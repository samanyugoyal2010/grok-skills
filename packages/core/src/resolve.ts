import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadBundledCatalog } from "./search.js";

export interface ResolveSourceResult {
  kind: "git" | "local" | "url" | "catalog";
  display: string;
  owner?: string;
  repo?: string;
  gitUrl?: string;
  localPath?: string;
  ref?: string;
  subpath?: string;
  catalogName?: string;
}

const OWNER_REPO_RE = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
const OWNER_REPO_AT_RE = /^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)@(.+)$/;
const GITHUB_TREE_RE =
  /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)(?:\/(.*))?$/;
const GITHUB_REPO_RE = /^https?:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/;

function githubGitUrl(owner: string, repo: string): string {
  const cleanRepo = repo.replace(/\.git$/, "");
  return `https://github.com/${owner}/${cleanRepo}.git`;
}

function catalogNames(): Set<string> {
  return new Set(loadBundledCatalog().skills.map((skill) => skill.name));
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

  const atMatch = trimmed.match(OWNER_REPO_AT_RE);
  if (atMatch) {
    const [, owner, repoRaw, rest] = atMatch;
    const repo = repoRaw.replace(/\.git$/, "");
    // Remainder after @ is the git ref and may contain slashes (e.g. cursor/branch).
    // owner/repo@ref/sub: if the remainder has a slash, treat the last path
    // segment as subpath only when the first segment is a simple tag/branch
    // without nested cursor/ prefixes — otherwise keep the full ref.
    let ref = rest;
    let subpath: string | undefined;
    const parts = rest.split("/").filter(Boolean);
    if (parts.length >= 2 && parts[0] !== "cursor") {
      ref = parts[0]!;
      subpath = parts.slice(1).join("/");
    }
    return {
      kind: "git",
      display: subpath ? `${owner}/${repo}@${ref}/${subpath}` : `${owner}/${repo}@${ref}`,
      owner,
      repo,
      gitUrl: githubGitUrl(owner, repo),
      ref,
      subpath,
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

  if (!trimmed.includes("/") && !trimmed.includes("@") && catalogNames().has(trimmed)) {
    return {
      kind: "catalog",
      display: trimmed,
      catalogName: trimmed,
    };
  }

  return {
    kind: "local",
    display: trimmed,
    localPath,
  };
}
