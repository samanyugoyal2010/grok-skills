import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { parseSkillMarkdown, type ParsedSkill } from "@grok-skills/spec";

export interface DiscoveredSkill extends ParsedSkill {
  sourceRoot: string;
}

const SKIP_DIRS = new Set(["node_modules", ".git", "dist", ".next"]);

async function readSkill(skillMdPath: string, sourceRoot: string): Promise<DiscoveredSkill> {
  const content = await readFile(skillMdPath, "utf8");
  const parsed = parseSkillMarkdown(content, skillMdPath);
  return { ...parsed, sourceRoot };
}

export async function discoverSkills(root: string): Promise<DiscoveredSkill[]> {
  const found: DiscoveredSkill[] = [];
  const seen = new Set<string>();

  async function addSkill(skillMdPath: string): Promise<void> {
    const skill = await readSkill(skillMdPath, root);
    if (seen.has(skill.name)) {
      return;
    }
    seen.add(skill.name);
    found.push(skill);
  }

  const rootSkill = join(root, "SKILL.md");
  if (existsSync(rootSkill)) {
    await addSkill(rootSkill);
  }

  await scanImmediateChildren(root, addSkill);

  const scanRoots = [
    join(root, "skills"),
    join(root, "skills", ".curated"),
    join(root, "skills", ".experimental"),
    join(root, ".grok", "skills"),
  ];

  for (const scanRoot of scanRoots) {
    await scanImmediateChildren(scanRoot, addSkill);
  }

  const skillsDir = join(root, "skills");
  if (existsSync(skillsDir)) {
    await walkSkills(skillsDir, 0, 3, addSkill);
  }

  return found;
}

async function scanImmediateChildren(
  dir: string,
  addSkill: (skillMdPath: string) => Promise<void>
): Promise<void> {
  if (!existsSync(dir)) {
    return;
  }

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) {
      continue;
    }
    const skillMd = join(dir, entry.name, "SKILL.md");
    if (existsSync(skillMd)) {
      await addSkill(skillMd);
    }
  }
}

async function walkSkills(
  dir: string,
  depth: number,
  maxDepth: number,
  addSkill: (skillMdPath: string) => Promise<void>
): Promise<void> {
  if (depth > maxDepth) {
    return;
  }

  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) {
      continue;
    }
    if (!entry.isDirectory()) {
      continue;
    }
    const child = join(dir, entry.name);
    const skillMd = join(child, "SKILL.md");
    if (existsSync(skillMd)) {
      await addSkill(skillMd);
    }
    if (depth < maxDepth) {
      await walkSkills(child, depth + 1, maxDepth, addSkill);
    }
  }
}
