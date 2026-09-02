import { existsSync } from "node:fs";
import { readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { discoverSkills, type DiscoveredSkill } from "./discover.js";
import { createFetchTempDir, fetchSource } from "./fetch.js";
import { copySkillDirectory, readLockfile, writeLockfile } from "./lockfile.js";
import { grokSkillsDir, lockfilePath } from "./paths.js";
import { resolveSource, type ResolveSourceResult } from "./resolve.js";
import {
  buildTelemetryEvent,
  defaultTelemetryEndpoint,
  reportInstall,
  telemetryEnabled,
} from "./telemetry.js";

export interface InstallOptions {
  source: string;
  cwd?: string;
  global?: boolean;
  skills?: string[];
  telemetry?: boolean;
  telemetryEndpoint?: string;
  listOnly?: boolean;
}

export interface InstallResult {
  installed: { name: string; target: string }[];
  listed: DiscoveredSkill[];
  source: ResolveSourceResult;
  sha?: string;
}

export async function installFromSource(opts: InstallOptions): Promise<InstallResult> {
  const cwd = opts.cwd ?? process.cwd();
  const resolved = resolveSource(opts.source, cwd);
  const isLocal = resolved.kind === "local" && resolved.localPath && existsSync(resolved.localPath);

  let tempDir: string | undefined;
  let fetchRoot: string;
  let sha: string | undefined;

  if (isLocal) {
    const fetched = await fetchSource(opts.source, resolved.localPath!, cwd);
    fetchRoot = fetched.root;
    sha = fetched.sha;
  } else {
    tempDir = await createFetchTempDir();
    const fetched = await fetchSource(opts.source, tempDir, cwd);
    fetchRoot = fetched.root;
    sha = fetched.sha;
  }

  try {
    let listed = await discoverSkills(fetchRoot);

    if (opts.skills?.length) {
      const wanted = new Set(opts.skills);
      listed = listed.filter((skill) => wanted.has(skill.name));
      if (listed.length === 0) {
        throw new Error(`No matching skills found for: ${opts.skills.join(", ")}`);
      }
    }

    if (listed.length === 0) {
      throw new Error(`No SKILL.md found in ${resolved.display}`);
    }

    if (opts.listOnly) {
      return { installed: [], listed, source: resolved, sha };
    }

    const destBase = grokSkillsDir({ cwd, global: opts.global });
    await import("node:fs/promises").then((fs) => fs.mkdir(destBase, { recursive: true }));

    const installed: { name: string; target: string }[] = [];
    const lockPath = lockfilePath({ cwd, global: opts.global });
    const lock = await readLockfile(lockPath);
    const installedAt = new Date().toISOString();
    const sourceLabel = resolved.display;

    for (const skill of listed) {
      const target = join(destBase, skill.name);
      await copySkillDirectory(skill.dir, target);
      lock.skills[skill.name] = { source: sourceLabel, sha, installedAt };
      installed.push({ name: skill.name, target });

      if (telemetryEnabled() && opts.telemetry !== false) {
        const endpoint = opts.telemetryEndpoint ?? defaultTelemetryEndpoint();
        await reportInstall(
          buildTelemetryEvent(
            skill.name,
            sourceLabel,
            resolved.owner,
            resolved.repo,
            sha,
            skill.runtime
          ),
          endpoint
        );
      }
    }

    await writeLockfile(lockPath, lock);
    return { installed, listed, source: resolved, sha };
  } finally {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  }
}

export async function listInstalled(opts: {
  cwd?: string;
  global?: boolean;
} = {}): Promise<{ name: string; path: string; source?: string }[]> {
  const cwd = opts.cwd ?? process.cwd();
  const skillsDir = grokSkillsDir({ cwd, global: opts.global });
  if (!existsSync(skillsDir)) {
    return [];
  }

  const lock = await readLockfile(lockfilePath({ cwd, global: opts.global }));
  const entries = await readdir(skillsDir, { withFileTypes: true });
  const result: { name: string; path: string; source?: string }[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const skillMd = join(skillsDir, entry.name, "SKILL.md");
    if (!existsSync(skillMd)) {
      continue;
    }
    result.push({
      name: entry.name,
      path: join(skillsDir, entry.name),
      source: lock.skills[entry.name]?.source,
    });
  }

  return result.sort((a, b) => a.name.localeCompare(b.name));
}

export async function removeInstalled(
  name: string,
  opts: { cwd?: string; global?: boolean } = {}
): Promise<boolean> {
  const cwd = opts.cwd ?? process.cwd();
  const skillsDir = grokSkillsDir({ cwd, global: opts.global });
  const target = join(skillsDir, name);

  if (!existsSync(target)) {
    return false;
  }

  await rm(target, { recursive: true, force: true });

  const lockPath = lockfilePath({ cwd, global: opts.global });
  const lock = await readLockfile(lockPath);
  if (lock.skills[name]) {
    delete lock.skills[name];
    await writeLockfile(lockPath, lock);
  }

  return true;
}
