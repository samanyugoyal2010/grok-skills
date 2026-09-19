import { createHash } from "node:crypto";
import { LIMITS } from "./limits.js";
import type { SkillRetriever, SkillSource } from "./types.js";

export interface Fetcher {
  (url: string, signal?: AbortSignal): Promise<string>;
}

async function fetchText(url: string, signal?: AbortSignal): Promise<string> {
  const response = await fetch(url, {
    signal,
    headers: {
      accept: "application/vnd.github+json, text/html, text/plain",
      "user-agent": "task-time-skill-compiler/0.1.0"
    }
  });
  if (!response.ok) throw new Error(`Public skill fetch failed: ${response.status} ${response.statusText}`);
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > LIMITS.fetchBytes) throw new Error(`Public skill response exceeded ${LIMITS.fetchBytes} bytes`);
  return new TextDecoder().decode(bytes);
}

function tokens(value: string): string[] {
  return value.toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length > 2);
}

function score(query: string, candidate: string): number {
  const queryTokens = new Set(tokens(query));
  return tokens(candidate).reduce((total, token) => total + (queryTokens.has(token) ? 2 : 0), 0);
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex");
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
    private readonly timeoutMs = Number(process.env.PUBLIC_SKILL_FETCH_TIMEOUT_MS ?? 10_000)
  ) {}

  private async fetchWithTimeout(url: string): Promise<string> {
    const timeout = Number.isFinite(this.timeoutMs) && this.timeoutMs >= 1 ? this.timeoutMs : 10_000;
    let timer: NodeJS.Timeout | undefined;
    const controller = new AbortController();
    try {
      return await Promise.race([
        this.fetcher(url, controller.signal),
        new Promise<string>((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(new Error(`Public skill fetch timed out after ${timeout}ms`));
          }, timeout);
        })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  async search(query: string): Promise<SkillSource[]> {
    const candidates: Array<{ repository: string; path: string; score: number }> = [];
    for (const repository of this.repositories) {
      try {
        const tree = JSON.parse(await this.fetchWithTimeout(`https://api.github.com/repos/${repository}/git/trees/${this.branch}?recursive=1`)) as GitTreeResponse;
        for (const entry of tree.tree ?? []) {
          if (entry.type === "blob" && entry.path?.endsWith("SKILL.md")) {
            candidates.push({ repository, path: entry.path, score: score(query, entry.path) });
          }
        }
      } catch {
        // A missing or rate-limited repository must not make other sources fail.
      }
    }

    candidates.sort((a, b) => b.score - a.score);
    const selected = candidates.slice(0, 5);
    const sources: SkillSource[] = [];
    for (const candidate of selected) {
      const rawUrl = `https://raw.githubusercontent.com/${candidate.repository}/${this.branch}/${candidate.path}`;
      const sourceUrl = `https://github.com/${candidate.repository}/blob/${this.branch}/${candidate.path}`;
      try {
        const content = await this.fetchWithTimeout(rawUrl);
        const title = candidate.path.split("/").at(-2) ?? candidate.path;
        sources.push({
          url: sourceUrl,
          title,
          sourceHash: hash(content),
          matchReason: candidate.score > 0 ? "Matched query tokens against a public SKILL.md path." : "Selected as the first available public SKILL.md candidate.",
          content
        });
      } catch {
        // A single stale public entry must not make the whole compile fail.
      }
    }
    return sources;
  }
}
