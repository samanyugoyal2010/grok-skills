import assert from "node:assert/strict";
import { existsSync, readFileSync, rmSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { checkSkill, parseSkillMarkdown } from "@grok-skills/spec";
import {
  defaultTelemetryEndpoint,
  discoverSkills,
  installFromCatalog,
  installFromSource,
  loadBundledCatalog,
  resolveSource,
  scaffoldSkill,
  searchCatalog,
  telemetryEnabled,
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
      yes: true,
    });
    assert.equal(result.installed.length, 1);
    assert.equal(result.installed[0]?.name, "inbox-triage");
    const skillMd = join(tempCwd, ".grok", "skills", "inbox-triage", "SKILL.md");
    assert.ok(existsSync(skillMd), `expected ${skillMd}`);
  } finally {
    await rm(tempCwd, { recursive: true, force: true });
  }
});

test("catalog add inbox-triage writes SKILL.md in tmp dir", async () => {
  const tempCwd = await mkdtemp(join(tmpdir(), "grok-skills-catalog-"));
  try {
    const result = await installFromCatalog("inbox-triage", {
      cwd: tempCwd,
      telemetry: false,
    });
    assert.equal(result.source.kind, "catalog");
    assert.equal(result.installed.length, 1);
    assert.equal(result.installed[0]?.name, "inbox-triage");
    const skillMd = join(tempCwd, ".grok", "skills", "inbox-triage", "SKILL.md");
    assert.ok(existsSync(skillMd), `expected ${skillMd}`);
    const lock = JSON.parse(
      readFileSync(join(tempCwd, ".grok", "skills-lock.json"), "utf8")
    ) as { skills: Record<string, { source: string }> };
    assert.equal(lock.skills["inbox-triage"]?.source, "catalog:inbox-triage");
  } finally {
    await rm(tempCwd, { recursive: true, force: true });
  }
});

test("installFromSource refuses a whole pack without --all or --skill", async () => {
  const tempCwd = await mkdtemp(join(tmpdir(), "grok-skills-refuse-"));
  try {
    await assert.rejects(
      () =>
        installFromSource({
          source: SKILLS_ROOT,
          cwd: tempCwd,
          telemetry: false,
          yes: true,
        }),
      /Refusing to install \d+ skills\. Pass --skill <name> or --all\./
    );
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

test("resolveSource parses owner/repo@branch", () => {
  const resolved = resolveSource("owner/repo@branch");
  assert.equal(resolved.kind, "git");
  assert.equal(resolved.owner, "owner");
  assert.equal(resolved.repo, "repo");
  assert.equal(resolved.ref, "branch");
});

test("resolveSource parses owner/repo@ref/sub", () => {
  const resolved = resolveSource("acme/skills@main/skills/foo");
  assert.equal(resolved.kind, "git");
  assert.equal(resolved.ref, "main");
  assert.equal(resolved.subpath, "skills/foo");
});

test("resolveSource keeps cursor/ branch names as a single ref", () => {
  const resolved = resolveSource(
    "samanyugoyal2010/grok-skills@cursor/grok-bot-skills-directory-plan-7471"
  );
  assert.equal(resolved.kind, "git");
  assert.equal(resolved.ref, "cursor/grok-bot-skills-directory-plan-7471");
  assert.equal(resolved.subpath, undefined);
});

test("resolveSource treats catalog skill names as catalog", () => {
  const resolved = resolveSource("inbox-triage");
  assert.equal(resolved.kind, "catalog");
  assert.equal(resolved.display, "inbox-triage");
});

test("bundled catalog search finds inbox and find-skills", () => {
  const catalog = loadBundledCatalog();
  assert.ok(catalog.count >= 140);
  const inbox = searchCatalog(catalog.skills, "inbox triage");
  assert.ok(inbox.some((s) => s.name === "inbox-triage"));
  const finder = searchCatalog(catalog.skills, "find a skill");
  assert.ok(finder.some((s) => s.name === "find-skills"));
});

test("telemetry is off and has no localhost default when registry unset", () => {
  const prev = process.env.GROK_SKILLS_REGISTRY;
  const prevDisable = process.env.DISABLE_TELEMETRY;
  delete process.env.GROK_SKILLS_REGISTRY;
  delete process.env.DISABLE_TELEMETRY;
  try {
    assert.equal(telemetryEnabled(), false);
    assert.equal(defaultTelemetryEndpoint(), null);
  } finally {
    if (prev === undefined) {
      delete process.env.GROK_SKILLS_REGISTRY;
    } else {
      process.env.GROK_SKILLS_REGISTRY = prev;
    }
    if (prevDisable === undefined) {
      delete process.env.DISABLE_TELEMETRY;
    } else {
      process.env.DISABLE_TELEMETRY = prevDisable;
    }
  }
});

test("defaultTelemetryEndpoint appends /api/t to origin", () => {
  const prev = process.env.GROK_SKILLS_REGISTRY;
  const prevDisable = process.env.DISABLE_TELEMETRY;
  const prevDnt = process.env.DO_NOT_TRACK;
  process.env.GROK_SKILLS_REGISTRY = "https://x.com";
  delete process.env.DISABLE_TELEMETRY;
  delete process.env.DO_NOT_TRACK;
  try {
    assert.equal(defaultTelemetryEndpoint(), "https://x.com/api/t");
    assert.equal(telemetryEnabled(), true);
    process.env.DISABLE_TELEMETRY = "1";
    assert.equal(telemetryEnabled(), false);
  } finally {
    if (prev === undefined) {
      delete process.env.GROK_SKILLS_REGISTRY;
    } else {
      process.env.GROK_SKILLS_REGISTRY = prev;
    }
    if (prevDisable === undefined) {
      delete process.env.DISABLE_TELEMETRY;
    } else {
      process.env.DISABLE_TELEMETRY = prevDisable;
    }
    if (prevDnt === undefined) {
      delete process.env.DO_NOT_TRACK;
    } else {
      process.env.DO_NOT_TRACK = prevDnt;
    }
  }
});
