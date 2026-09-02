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
  resolveSource,
  scaffoldSkill,
} from "./index.js";

const SKILLS_ROOT = join(import.meta.dirname, "../../../skills");

test("discoverSkills finds /workspace/skills (4 skills)", async () => {
  const skills = await discoverSkills(SKILLS_ROOT);
  assert.equal(skills.length, 4);
  const names = skills.map((s) => s.name).sort();
  assert.deepEqual(names, [
    "expense-draft",
    "inbox-triage",
    "staging-repro-pack",
    "weekly-account-health",
  ]);
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
