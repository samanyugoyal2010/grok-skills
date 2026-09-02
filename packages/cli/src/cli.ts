#!/usr/bin/env node
import { readFile, stat } from "node:fs/promises";
import { basename, join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  checkSkill,
  grokSkillsDir,
  installFromSource,
  listInstalled,
  parseSkillMarkdown,
  removeInstalled,
  scaffoldSkill,
} from "@grok-skills/core";
import { parseArgv } from "./parse.js";

const HELP = `grok-skills — install and manage Grok Bot skills

Usage:
  grok-skills add <source> [-g|--global] [-s|--skill <name>]... [-l|--list] [-y|--yes]
  grok-skills list [-g|--global]
  grok-skills remove <name> [-g|--global]
  grok-skills find <query>
  grok-skills init <name> [--global]
  grok-skills check [path]
  grok-skills help

Examples:
  grok-skills add owner/repo
  grok-skills add owner/repo -g -s my-skill
  grok-skills list
  grok-skills find inbox
  grok-skills check ./skills/foo
`;

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function printHelp(): void {
  process.stdout.write(HELP);
}

async function resolveSkillPath(path?: string): Promise<string> {
  const target = path ?? process.cwd();
  const info = await stat(target);

  if (info.isFile()) {
    if (basename(target) !== "SKILL.md") {
      fail(`Expected SKILL.md, got ${basename(target)}`);
    }
    return target;
  }

  if (info.isDirectory()) {
    return join(target, "SKILL.md");
  }

  fail(`Not a file or directory: ${target}`);
}

async function runAdd(parsed: Extract<ReturnType<typeof parseArgv>, { command: "add" }>): Promise<void> {
  const result = await installFromSource({
    source: parsed.source,
    global: parsed.global,
    skills: parsed.skills.length > 0 ? parsed.skills : undefined,
    listOnly: parsed.list,
  });

  if (result.listed.length > 0) {
    console.log("Discovered skills:");
    for (const entry of result.listed) {
      console.log(`  ${entry.name}`);
    }
  }

  if (parsed.list) {
    return;
  }

  if (result.installed.length > 0) {
    console.log("Installed:");
    for (const item of result.installed) {
      console.log(`  ${item.name} → ${item.target}`);
    }
  }
}

async function runList(parsed: Extract<ReturnType<typeof parseArgv>, { command: "list" }>): Promise<void> {
  const items = await listInstalled({ global: parsed.global });
  if (items.length === 0) {
    console.log("No skills installed.");
    return;
  }
  for (const item of items) {
    const parts = [item.name, item.path];
    if (item.source) {
      parts.push(item.source);
    }
    console.log(parts.join("\t"));
  }
}

async function runRemove(parsed: Extract<ReturnType<typeof parseArgv>, { command: "remove" }>): Promise<void> {
  const removed = await removeInstalled(parsed.name, { global: parsed.global });
  if (!removed) {
    fail(`Skill not found: ${parsed.name}`);
  }
  console.log(`Removed ${parsed.name}`);
}

async function runFind(parsed: Extract<ReturnType<typeof parseArgv>, { command: "find" }>): Promise<void> {
  const base = (process.env.GROK_SKILLS_REGISTRY || "http://localhost:3000").replace(/\/$/, "");
  const url = `${base}/api/search?q=${encodeURIComponent(parsed.query)}`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    fail(`Search failed: ${message}`);
  }

  if (!response.ok) {
    fail(`Search failed: ${response.status} ${response.statusText}`);
  }

  const payload = (await response.json()) as {
    skills?: Array<{ name: string; source: string; installs: number }>;
  };
  const results = Array.isArray(payload.skills) ? payload.skills : [];

  if (results.length === 0) {
    console.log("No results.");
    return;
  }

  for (const item of results) {
    console.log(`${item.name}\t${item.source}\t${item.installs}`);
  }
}

function runInit(parsed: Extract<ReturnType<typeof parseArgv>, { command: "init" }>): void {
  const dir = join(grokSkillsDir({ global: parsed.global }), parsed.name);
  scaffoldSkill(dir, parsed.name);
  console.log(dir);
}

async function runCheck(parsed: Extract<ReturnType<typeof parseArgv>, { command: "check" }>): Promise<void> {
  const skillPath = await resolveSkillPath(parsed.path);
  let content: string;
  try {
    content = await readFile(skillPath, "utf8");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    fail(`Cannot read ${skillPath}: ${message}`);
  }

  const skill = parseSkillMarkdown(content, skillPath);
  const result = checkSkill(skill);

  if (result.issues.length === 0) {
    console.log("OK");
    return;
  }

  for (const issue of result.issues) {
    console.log(`${issue.level} [${issue.code}] ${issue.message}`);
  }

  if (!result.ok) {
    process.exit(1);
  }
}

export async function main(argv: string[] = process.argv.slice(2)): Promise<void> {
  let parsed;
  try {
    parsed = parseArgv(argv);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    fail(message);
  }

  switch (parsed.command) {
    case "help":
      printHelp();
      return;
    case "add":
      await runAdd(parsed);
      return;
    case "list":
      await runList(parsed);
      return;
    case "remove":
      await runRemove(parsed);
      return;
    case "find":
      await runFind(parsed);
      return;
    case "init":
      runInit(parsed);
      return;
    case "check":
      await runCheck(parsed);
      return;
    default:
      printHelp();
  }
}

const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  main().catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(message);
    process.exit(1);
  });
}
