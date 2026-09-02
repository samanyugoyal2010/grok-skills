import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";

export function findGitRoot(start: string): string | null {
  let dir = resolve(start);
  for (;;) {
    if (existsSync(join(dir, ".git"))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      return null;
    }
    dir = parent;
  }
}

export function grokSkillsDir(opts: { cwd?: string; global?: boolean } = {}): string {
  const cwd = opts.cwd ?? process.cwd();
  if (opts.global) {
    return join(homedir(), ".grok", "skills");
  }
  const gitRoot = findGitRoot(cwd);
  const base = gitRoot ?? cwd;
  return join(base, ".grok", "skills");
}

export function lockfilePath(opts: { cwd?: string; global?: boolean } = {}): string {
  const cwd = opts.cwd ?? process.cwd();
  if (opts.global) {
    return join(homedir(), ".grok", "skills-lock.json");
  }
  const gitRoot = findGitRoot(cwd);
  const base = gitRoot ?? cwd;
  return join(base, ".grok", "skills-lock.json");
}
