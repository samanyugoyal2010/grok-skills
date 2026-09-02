import { readFile, stat } from "node:fs/promises";
import { basename, join } from "node:path";
import { pathToFileURL } from "node:url";
import {
  checkSkill,
  grokSkillsDir,
  installFromSource,
  listInstalled,
  loadBundledCatalog,
  parseSkillMarkdown,
  printSkillMarkdown,
  removeInstalled,
  scaffoldSkill,
  searchCatalog,
  writeGrokPlugin,
} from "@grok-skills/core";
import { parseArgv } from "./parse.js";

const HELP = `grok-skills — install and manage Grok Bot skills

Not published on the npm registry. Run from GitHub or this repo:

  npx github:samanyugoyal2010/grok-skills -- find-skills
  npx github:samanyugoyal2010/grok-skills add inbox-triage -g
  node bin/grok-skills.mjs add find-skills -g

Usage:
  grok-skills add <source> [-g|--global] [-s|--skill <name>]... [--all] [-l|--list] [-y|--yes]
  grok-skills setup [-g]
  grok-skills print <name>
  grok-skills list [-g|--global]
  grok-skills remove <name> [-g|--global]
  grok-skills find [query] [--json] [--limit n]
  grok-skills init <name> [--global]
  grok-skills check [path]
  grok-skills help

<source> may be a catalog skill name, owner/repo, owner/repo@ref, or a local path.

Examples:
  grok-skills add inbox-triage
  grok-skills add owner/repo@branch -s my-skill -y
  grok-skills find inbox --json
  grok-skills print find-skills
  grok-skills setup
`;

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function printHelp(): void {
  process.stdout.write(HELP);
}

function printBotNextSteps(name: string): void {
  console.log("Grok Build: loaded from .grok/skills (restart session if needed)");
  console.log(
    `Grok Bot: if / does not show it, paste SKILL.md (grok-skills print ${name}) into a saved skill / Settings → Plugins`
  );
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
    yes: parsed.yes,
    all: parsed.all,
    force: parsed.force,
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
    printBotNextSteps(result.installed[0]!.name);
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
  const query = parsed.query.trim();
  if (!query && (parsed.json || !process.stdin.isTTY)) {
    if (parsed.json) {
      console.log(JSON.stringify({ error: "query required" }));
    } else {
      console.error("query required");
    }
    process.exit(1);
  }

  const bundled = loadBundledCatalog();
  let skills = bundled.skills;

  const registry = process.env.GROK_SKILLS_REGISTRY?.replace(/\/$/, "");
  if (registry) {
    try {
      const url = `${registry}/api/search?q=${encodeURIComponent(query)}&limit=${parsed.limit}`;
      const response = await fetch(url);
      if (response.ok) {
        const payload = (await response.json()) as { skills?: typeof skills };
        if (Array.isArray(payload.skills) && payload.skills.length > 0) {
          skills = payload.skills;
        }
      }
    } catch {
      // Bundled catalog is the offline source of truth for Grok Bot.
    }
  }

  const results = searchCatalog(skills, query, { limit: parsed.limit });

  if (parsed.json) {
    console.log(
      JSON.stringify(
        {
          query,
          count: results.length,
          install: `npx github:samanyugoyal2010/grok-skills add <name> -g`,
          skills: results.map((skill) => ({
            name: skill.name,
            source: skill.source,
            description: skill.shortDescription || skill.description,
            runtime: skill.runtime,
            connectors: skill.connectors,
            approvals: skill.approvals,
            installs: skill.installs,
            add: `npx github:samanyugoyal2010/grok-skills add ${skill.name} -g`,
          })),
        },
        null,
        2
      )
    );
    return;
  }

  if (results.length === 0) {
    console.log("No results.");
    return;
  }

  console.log("Install with: npx github:samanyugoyal2010/grok-skills add <name> -g");
  console.log("");
  for (const skill of results) {
    console.log(`${skill.name}\t${skill.source}\t${skill.installs}`);
    console.log(`  ${skill.shortDescription || skill.description}`);
    console.log(`  npx github:samanyugoyal2010/grok-skills add ${skill.name} -g`);
    console.log("");
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

async function runSetup(): Promise<void> {
  const result = await installFromSource({
    source: "find-skills",
    global: true,
    yes: true,
  });
  const pluginRoot = await writeGrokPlugin();
  console.log("Installed find-skills globally.");
  if (result.installed[0]) {
    console.log(`  ${result.installed[0].name} → ${result.installed[0].target}`);
  }
  console.log(`Plugin: ${pluginRoot}`);
  console.log("Grok Build: loaded from .grok/skills (restart session if needed)");
  console.log(
    "Grok Bot: if / does not show it, paste SKILL.md (grok-skills print find-skills) into a saved skill / Settings → Plugins"
  );
}

function runPrint(parsed: Extract<ReturnType<typeof parseArgv>, { command: "print" }>): void {
  const md = printSkillMarkdown(parsed.name);
  process.stdout.write(md.endsWith("\n") ? md : `${md}\n`);
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
    case "setup":
      await runSetup();
      return;
    case "print":
      runPrint(parsed);
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
