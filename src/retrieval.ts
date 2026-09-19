import { createHash } from "node:crypto";
import { LIMITS } from "./limits.js";
import type { SkillRetriever, SkillSource } from "./types.js";
import { readLimitedResponse } from "./body.js";
import { raceWithAbort } from "./abort.js";

export { readLimitedResponse } from "./body.js";

export interface Fetcher {
  (url: string, signal?: AbortSignal, headers?: Record<string, string>): Promise<string>;
}

async function mapWithConcurrency<T, R>(items: T[], concurrency: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  const run = async () => {
    while (true) {
      const index = nextIndex++;
      if (index >= items.length) return;
      results[index] = await worker(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => run()));
  return results;
}

async function fetchText(url: string, signal?: AbortSignal, extraHeaders?: Record<string, string>): Promise<string> {
  const response = await fetch(url, {
    signal,
    headers: {
      accept: "application/vnd.github+json, text/html, text/plain",
      "user-agent": "task-time-skill-compiler/0.1.0",
      ...extraHeaders
    }
  });
  if (!response.ok) throw new Error(`Public skill fetch failed: ${response.status} ${response.statusText}`);
  return readLimitedResponse(response, LIMITS.fetchBytes, signal);
}

function tokens(value: string): string[] {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2);
}

function score(query: string, candidate: string, content = ""): number {
  const queryTokens = new Set(tokens(query));
  const normalizedQuery = query.trim().toLowerCase();
  const pathTokens = tokens(candidate);
  const contentTokens = new Set(tokens(content.slice(0, 20_000)));
  const pathScore = pathTokens.reduce((total, token) => total + (queryTokens.has(token) ? 4 : 0), 0);
  const contentScore = [...contentTokens].reduce((total, token) => total + (queryTokens.has(token) ? 1 : 0), 0);
  const phraseScore = normalizedQuery.length > 2 && candidate.toLowerCase().includes(normalizedQuery) ? 6 : 0;
  const contentPhraseScore = normalizedQuery.length > 2 && content.toLowerCase().includes(normalizedQuery) ? 3 : 0;
  return pathScore + contentScore + phraseScore + contentPhraseScore;
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function encodeRepositoryPath(path: string): string {
  return path.split("/").map((segment) => encodeURIComponent(segment)).join("/");
}

interface GitTreeEntry {
  path?: string;
  type?: string;
}

interface GitTreeResponse {
  tree?: GitTreeEntry[];
}

/**
 * The first public adapter uses GitHub's tree API for skill repositories.
 * skills.sh indexes public repositories, while GitHub gives us stable source
 * URLs and raw Markdown content for the actual compilation request.
 */
export class GitHubSkillRetriever implements SkillRetriever {
  constructor(
    private readonly repositories = (process.env.PUBLIC_SKILL_REPOSITORIES ?? "vercel-labs/agent-skills,anthropics/skills").split(",").map((repo) => repo.trim()).filter(Boolean),
    private readonly fetcher: Fetcher = fetchText,
    private readonly branch = process.env.PUBLIC_SKILL_BRANCH ?? "main",
    private readonly timeoutMs = Number(process.env.PUBLIC_SKILL_FETCH_TIMEOUT_MS ?? 10_000),
    private readonly githubToken = process.env.PUBLIC_SKILL_GITHUB_TOKEN
  ) {}

  private async fetchWithTimeout(url: string, signal?: AbortSignal): Promise<string> {
    const timeout = Number.isFinite(this.timeoutMs) && this.timeoutMs >= 1 ? this.timeoutMs : 10_000;
    let timer: NodeJS.Timeout | undefined;
    const controller = new AbortController();
    const abort = () => controller.abort(signal?.reason);
    if (signal) {
      if (signal.aborted) abort();
      else signal.addEventListener("abort", abort, { once: true });
    }
    try {
      const fetchOperation = Promise.resolve().then(() => this.fetcher(url, controller.signal, this.githubToken ? { authorization: `Bearer ${this.githubToken}` } : undefined));
      return await raceWithAbort(Promise.race([
        fetchOperation,
        new Promise<string>((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(new Error(`Public skill fetch timed out after ${timeout}ms`));
          }, timeout);
        })
      ]), signal, () => controller.abort(signal?.reason), "Public skill fetch aborted");
    } finally {
      if (timer) clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    }
  }

  async search(query: string, signal?: AbortSignal): Promise<SkillSource[]> {
    const repositories = this.repositories.slice(0, LIMITS.repositories);
    const candidateGroups = await mapWithConcurrency(repositories, 2, async (repository) => {
      try {
        const tree = JSON.parse(await this.fetchWithTimeout(`https://api.github.com/repos/${repository}/git/trees/${encodeURIComponent(this.branch)}?recursive=1`, signal)) as GitTreeResponse;
        return (tree.tree ?? [])
          .filter((entry) => entry.type === "blob" && entry.path?.endsWith("SKILL.md"))
          .map((entry) => ({ repository, path: entry.path!, score: score(query, entry.path!) }));
      } catch {
        // A missing or rate-limited repository must not make other sources fail.
        return [];
      }
    });
    const candidates = candidateGroups.flat();

    candidates.sort((a, b) => b.score - a.score);
    const selected = candidates.slice(0, Math.min(LIMITS.sources * 3, candidates.length));
    const retrieved = await mapWithConcurrency(selected, 3, async (candidate) => {
      const encodedPath = encodeRepositoryPath(candidate.path);
      const rawUrl = `https://raw.githubusercontent.com/${candidate.repository}/${encodeURIComponent(this.branch)}/${encodedPath}`;
      const sourceUrl = `https://github.com/${candidate.repository}/blob/${encodeURIComponent(this.branch)}/${encodedPath}`;
      try {
        const content = await this.fetchWithTimeout(rawUrl, signal);
        return { candidate, sourceUrl, content };
      } catch {
        // A single stale public entry must not make the whole compile fail.
        return null;
      }
    });
    return retrieved
      .filter((source): source is { candidate: typeof candidates[number]; sourceUrl: string; content: string } => source !== null)
      .sort((a, b) => {
        const scoreDifference = score(query, b.candidate.path, b.content) - score(query, a.candidate.path, a.content);
        return scoreDifference || a.candidate.path.localeCompare(b.candidate.path);
      })
      .slice(0, LIMITS.sources)
      .map(({ candidate, sourceUrl, content }) => {
        const title = candidate.path.split("/").at(-2) ?? candidate.path;
        const matchScore = score(query, candidate.path, content);
        return {
          url: sourceUrl,
          title,
          sourceHash: hash(content),
          matchReason: matchScore > 0 ? "Matched query tokens against the public SKILL.md path and content." : "Selected as the first available public SKILL.md candidate.",
          content
        } satisfies SkillSource;
      });
  }
}
