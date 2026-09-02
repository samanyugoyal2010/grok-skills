import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { checkSkill, parseSkillMarkdown } from "@grok-skills/spec";
import {
  discoverSkills,
  installFromSource,
  loadBundledCatalog,
  resolveSource,
  scaffoldSkill,
  searchCatalog,
} from "./index.js";

const SKILLS_ROOT = join(import.meta.dirname, "../../../skills");

test("discoverSkills finds the starter catalog", async () => {
  const skills = await discoverSkills(SKILLS_ROOT);
  assert.ok(skills.length >= 140, `expected >= 140 skills, got ${skills.length}`);
  const names = new Set(skills.map((s) => s.name));
  assert.ok(names.has("find-skills"));
  assert.ok(names.has("inbox-triage"));
});

test("installFromSource from /workspace/skills creates inbox-triage in temp cwd", async () => {
  const tempCwd = await mkdtemp(join(tmpdir(), "grok-skills-test-"));
  try {
    const result = await installFromSource({
      source: SKILLS_ROOT,
      cwd: tempCwd,
      skills: ["inbox-triage"],
      telemetry: false,
    });
    assert.equal(result.installed.length, 1);
    assert.equal(result.installed[0]?.name, "inbox-triage");
    const skillMd = join(tempCwd, ".grok", "skills", "inbox-triage", "SKILL.md");
    assert.ok(existsSync(skillMd), `expected ${skillMd}`);
  } finally {
    await rm(tempCwd, { recursive: true, force: true });
  }
});

test("checkSkill on scaffoldSkill output is ok", () => {
  const dir = join(tmpdir(), `grok-scaffold-${process.pid}`);
  scaffoldSkill(dir, "my-test-skill");
  const content = readFileSync(join(dir, "SKILL.md"), "utf8");
  const parsed = parseSkillMarkdown(content, join(dir, "SKILL.md"));
  const result = checkSkill(parsed);
  assert.equal(result.ok, true, JSON.stringify(result.issues));
  rmSync(dir, { recursive: true, force: true });
});

test("resolveSource('vercel-labs/skills') has owner vercel-labs", () => {
  const resolved = resolveSource("vercel-labs/skills");
  assert.equal(resolved.owner, "vercel-labs");
  assert.equal(resolved.repo, "skills");
  assert.equal(resolved.kind, "git");
});

test("bundled catalog search finds inbox and find-skills", () => {
  const catalog = loadBundledCatalog();
  assert.ok(catalog.count >= 140);
  const inbox = searchCatalog(catalog.skills, "inbox triage");
  assert.ok(inbox.some((s) => s.name === "inbox-triage"));
  const finder = searchCatalog(catalog.skills, "find a skill");
  assert.ok(finder.some((s) => s.name === "find-skills"));
});
