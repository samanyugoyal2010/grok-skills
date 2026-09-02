import { existsSync } from "node:fs";
import { resolve } from "node:path";

export interface ResolveSourceResult {
  kind: "git" | "local" | "url";
  display: string;
  owner?: string;
  repo?: string;
  gitUrl?: string;
  localPath?: string;
  ref?: string;
  subpath?: string;
}

const OWNER_REPO_RE = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
const GITHUB_TREE_RE =
  /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)(?:\/(.*))?$/;
const GITHUB_REPO_RE = /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/;

function githubGitUrl(owner: string, repo: string): string {
  const cleanRepo = repo.replace(/\.git$/, "");
  return `https://github.com/${owner}/${cleanRepo}.git`;
}

export function resolveSource(source: string, cwd = process.cwd()): ResolveSourceResult {
  const trimmed = source.trim();

  const treeMatch = trimmed.match(GITHUB_TREE_RE);
  if (treeMatch) {
    const [, owner, repoRaw, ref, subpath] = treeMatch;
    const repo = repoRaw.replace(/\.git$/, "");
    return {
      kind: "git",
      display: `${owner}/${repo}`,
      owner,
      repo,
      gitUrl: githubGitUrl(owner, repo),
      ref,
      subpath: subpath?.replace(/\/$/, "") || undefined,
    };
  }

  if (OWNER_REPO_RE.test(trimmed) && !trimmed.includes("://")) {
    const [owner, repo] = trimmed.split("/");
    return {
      kind: "git",
      display: trimmed,
      owner,
      repo,
      gitUrl: githubGitUrl(owner, repo),
    };
  }

  const ghMatch = trimmed.match(GITHUB_REPO_RE);
  if (ghMatch) {
    const [, owner, repoRaw] = ghMatch;
    const repo = repoRaw.replace(/\.git$/, "");
    return {
      kind: "git",
      display: `${owner}/${repo}`,
      owner,
      repo,
      gitUrl: githubGitUrl(owner, repo),
    };
  }

  if (/^https?:\/\//.test(trimmed)) {
    return {
      kind: "git",
      display: trimmed,
      gitUrl: trimmed.endsWith(".git") ? trimmed : trimmed,
    };
  }

  const localPath = resolve(cwd, trimmed);
  if (existsSync(localPath)) {
    return {
      kind: "local",
      display: trimmed,
      localPath,
    };
  }

  return {
    kind: "local",
    display: trimmed,
    localPath,
  };
}
