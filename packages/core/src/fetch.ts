import { writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolveSource, type ResolveSourceResult } from "./resolve.js";

const execFileAsync = promisify(execFile);

function looksLikeBranch(ref: string): boolean {
  return !/^[0-9a-f]{40}$/i.test(ref);
}

async function gitRevParse(cwd: string): Promise<string> {
  const { stdout } = await execFileAsync("git", ["rev-parse", "HEAD"], { cwd });
  return stdout.trim();
}

async function gitClone(
  gitUrl: string,
  destDir: string,
  ref?: string
): Promise<void> {
  await mkdir(destDir, { recursive: true });

  if (ref && looksLikeBranch(ref)) {
    await execFileAsync("git", ["clone", "--depth", "1", "--branch", ref, gitUrl, destDir]);
    return;
  }

  await execFileAsync("git", ["clone", "--depth", "1", gitUrl, destDir]);

  if (ref) {
    await execFileAsync("git", ["checkout", ref], { cwd: destDir });
  }
}

async function fetchGithubTarball(
  owner: string,
  repo: string,
  destDir: string,
  ref?: string
): Promise<void> {
  const tarballRef = ref ?? "HEAD";
  const url = `https://codeload.github.com/${owner}/${repo}/tar.gz/${tarballRef}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Tarball fetch failed: ${response.status} ${response.statusText}`);
  }

  const tarPath = join(destDir, "repo.tar.gz");
  await mkdir(destDir, { recursive: true });
  const buffer = Buffer.from(await response.arrayBuffer());
  await writeFile(tarPath, buffer);

  await execFileAsync("tar", ["-xzf", tarPath, "-C", destDir, "--strip-components=1"]);
  await rm(tarPath, { force: true });
}

export async function fetchSource(
  source: string,
  destDir: string,
  cwd = process.cwd()
): Promise<{ root: string; sha?: string; resolved: ResolveSourceResult }> {
  const resolved = resolveSource(source, cwd);

  if (resolved.kind === "local" && resolved.localPath) {
    let root = resolved.localPath;
    if (resolved.subpath) {
      root = join(resolved.localPath, resolved.subpath);
    }
    if (!existsSync(root)) {
      throw new Error(`Local path not found: ${root}`);
    }
    return { root: resolve(root), resolved };
  }

  if (resolved.kind === "git" && resolved.gitUrl) {
    let sha: string | undefined;
    try {
      await gitClone(resolved.gitUrl, destDir, resolved.ref);
      sha = await gitRevParse(destDir);
    } catch (gitError) {
      if (resolved.owner && resolved.repo) {
        await rm(destDir, { recursive: true, force: true });
        await mkdir(destDir, { recursive: true });
        await fetchGithubTarball(resolved.owner, resolved.repo, destDir, resolved.ref);
      } else {
        throw gitError;
      }
    }

    let root = destDir;
    if (resolved.subpath) {
      root = join(destDir, resolved.subpath);
      if (!existsSync(root)) {
        throw new Error(`Subpath not found in fetched source: ${resolved.subpath}`);
      }
    }

    return { root: resolve(root), sha, resolved };
  }

  throw new Error(`Unable to fetch source: ${source}`);
}

export async function createFetchTempDir(prefix = "grok-skills-"): Promise<string> {
  return mkdtemp(join(tmpdir(), prefix));
}
