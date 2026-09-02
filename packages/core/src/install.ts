import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { checkSkill, parseSkillMarkdown, type ParsedSkill } from "@grok-skills/spec";
import { discoverSkills, type DiscoveredSkill } from "./discover.js";
import { createFetchTempDir, fetchSource } from "./fetch.js";
import { copySkillDirectory, readLockfile, writeLockfile } from "./lockfile.js";
import { grokSkillsDir, lockfilePath } from "./paths.js";
import { resolveSource, type ResolveSourceResult } from "./resolve.js";
import { catalogSkillMarkdown, findCatalogSkill } from "./search.js";
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
  all?: boolean;
  yes?: boolean;
  force?: boolean;
}

export interface InstallResult {
  installed: { name: string; target: string }[];
  listed: DiscoveredSkill[];
  source: ResolveSourceResult;
  sha?: string;
}

function requireYesForPack(kind: ResolveSourceResult["kind"]): boolean {
  return kind === "git" || kind === "local";
}

function skillCheckError(skill: ParsedSkill, force?: boolean): string | undefined {
  const result = checkSkill(skill);
  const errors = result.issues.filter((issue) => issue.level === "error");
  if (errors.length === 0 || force) {
    return undefined;
  }
  const detail = errors.map((issue) => `${issue.code}: ${issue.message}`).join("; ");
  return `Skill check failed for ${skill.name}: ${detail}`;
}

async function maybeTelemetry(
  opts: InstallOptions,
  skill: ParsedSkill,
  sourceLabel: string,
  resolved: ResolveSourceResult,
  sha?: string
): Promise<void> {
  if (!(telemetryEnabled() && opts.telemetry !== false)) {
    return;
  }
  const endpoint = opts.telemetryEndpoint ?? defaultTelemetryEndpoint();
  if (!endpoint) {
    return;
  }
  await reportInstall(
    buildTelemetryEvent(skill.name, sourceLabel, resolved.owner, resolved.repo, sha, skill.runtime),
    endpoint
  );
}

async function installCatalogSkill(
  resolved: ResolveSourceResult,
  opts: InstallOptions,
  cwd: string
): Promise<InstallResult> {
  const name = resolved.catalogName ?? resolved.display;
  const skill = findCatalogSkill(name);
  if (!skill) {
    throw new Error(`Unknown catalog skill: ${name}`);
  }
  const md = catalogSkillMarkdown(skill);
  const destBase = grokSkillsDir({ cwd, global: opts.global });
  const target = join(destBase, skill.name);
  const parsed = parseSkillMarkdown(md, join(target, "SKILL.md"));
  const listed: DiscoveredSkill[] = [{ ...parsed, sourceRoot: "catalog" }];

  if (opts.skills?.length && !opts.skills.includes(skill.name)) {
    throw new Error(`No matching skills found for: ${opts.skills.join(", ")}`);
  }

  if (opts.listOnly) {
    return { installed: [], listed, source: resolved };
  }

  const checkErr = skillCheckError(parsed, opts.force);
  if (checkErr) {
    throw new Error(checkErr);
  }

  await mkdir(target, { recursive: true });
  await writeFile(join(target, "SKILL.md"), md, "utf8");

  const lockPath = lockfilePath({ cwd, global: opts.global });
  const lock = await readLockfile(lockPath);
  const installedAt = new Date().toISOString();
  const sourceLabel = `catalog:${skill.name}`;
  lock.skills[skill.name] = { source: sourceLabel, installedAt };
  await writeLockfile(lockPath, lock);

  await maybeTelemetry(opts, parsed, sourceLabel, resolved);

  return {
    installed: [{ name: skill.name, target }],
    listed,
    source: resolved,
  };
}

export async function installFromSource(opts: InstallOptions): Promise<InstallResult> {
  const cwd = opts.cwd ?? process.cwd();
  const resolved = resolveSource(opts.source, cwd);

  if (resolved.kind === "catalog") {
    return installCatalogSkill(resolved, opts, cwd);
  }

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

    if (listed.length > 1 && !opts.skills?.length && !opts.all) {
      const names = listed.map((skill) => skill.name).join(", ");
      throw new Error(
        `Refusing to install ${listed.length} skills. Pass --skill <name> or --all.\n${names}`
      );
    }

    if (
      requireYesForPack(resolved.kind) &&
      listed.length >= 1 &&
      !opts.yes &&
      !process.stdin.isTTY
    ) {
      throw new Error("Non-interactive install of a git/local pack requires --yes.");
    }

    const destBase = grokSkillsDir({ cwd, global: opts.global });
    await mkdir(destBase, { recursive: true });

    const installed: { name: string; target: string }[] = [];
    const lockPath = lockfilePath({ cwd, global: opts.global });
    const lock = await readLockfile(lockPath);
    const installedAt = new Date().toISOString();
    const sourceLabel = resolved.display;

    for (const skill of listed) {
      const skillMdPath = join(skill.dir, "SKILL.md");
      const content = existsSync(skillMdPath) ? await readFile(skillMdPath, "utf8") : skill.body;
      const parsed = parseSkillMarkdown(content, skillMdPath);
      const checkErr = skillCheckError(parsed, opts.force);
      if (checkErr) {
        throw new Error(checkErr);
      }

      const target = join(destBase, skill.name);
      await copySkillDirectory(skill.dir, target);
      lock.skills[skill.name] = { source: sourceLabel, sha, installedAt };
      installed.push({ name: skill.name, target });

      await maybeTelemetry(opts, skill, sourceLabel, resolved, sha);
    }

    await writeLockfile(lockPath, lock);
    return { installed, listed, source: resolved, sha };
  } finally {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  }
}

export async function installFromCatalog(
  name: string,
  opts: Omit<InstallOptions, "source"> = {}
): Promise<InstallResult> {
  return installFromSource({ ...opts, source: name });
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
