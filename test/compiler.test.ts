import test from "node:test";
import assert from "node:assert/strict";
import { compileSkill } from "../src/compiler.js";
import type { CompileSkillInput, SkillSource } from "../src/types.js";

const input: CompileSkillInput = {
  task: "Add a user profile page",
  search_query: "frontend feature implementation",
  project_brief: "Use the existing design system and add tests.",
  approved_context: [{ path: "src/routes.ts", reason: "Existing route conventions", content: "export const routes = {};" }]
};

const source: SkillSource = {
  url: "https://example.com/skill",
  title: "Frontend skill",
  sourceHash: "abc123",
  matchReason: "Matched frontend",
  content: "Use existing components and run tests."
};

test("compiles a valid reusable skill with provenance", async () => {
  const result = await compileSkill(input, [source]);
  assert.equal(result.sources[0].url, source.url);
  assert.match(result.skillMarkdown, /^# /m);
  assert.match(result.skillMarkdown, /## Description/);
  assert.match(result.skillMarkdown, /## Procedure/);
  assert.match(result.skillMarkdown, /## Repository Constraints/);
  assert.match(result.skillMarkdown, /## Examples/);
});

test("uses the model endpoint only when configured and falls back on invalid output", async () => {
  const result = await compileSkill(input, [], {
    modelUrl: "https://model.example/compile",
    fetcher: (async () => new Response(JSON.stringify({ output: "not markdown" }), { status: 200 })) as typeof fetch
  });
  assert.match(result.skillMarkdown, /## Procedure/);
  assert.match(result.changeSummary.join(" "), /deterministic compiler fallback/);
});

test("reports model compilation in the change summary", async () => {
  const markdown = "# Skill\n\n## Description\nSafe\n\n## Procedure\nDo it\n\n## Repository Constraints\nKeep scope\n\n## Examples\nExample";
  const result = await compileSkill(input, [], {
    modelUrl: "https://model.example/compile",
    fetcher: (async () => new Response(JSON.stringify({ output: markdown }), { status: 200 })) as typeof fetch
  });
  assert.match(result.changeSummary.join(" "), /configured model endpoint/);
});

test("falls back when the model endpoint times out or fails", async () => {
  const result = await compileSkill(input, [], {
    modelUrl: "https://model.example/compile",
    fetcher: (async () => { throw new Error("timeout"); }) as typeof fetch
  });
  assert.equal(result.sources.length, 0);
  assert.match(result.skillMarkdown, /No public source skill was found/);
});

test("falls back when the model returns secret-like output", async () => {
  const markdown = "# Skill\n\n## Description\nSafe\n\n## Procedure\nDo it\n\n## Repository Constraints\nKeep scope\n\n## Examples\npassword=supersecret123";
  const result = await compileSkill(input, [], {
    modelUrl: "https://model.example/compile",
    fetcher: (async () => new Response(JSON.stringify({ output: markdown }), { status: 200 })) as typeof fetch
  });
  assert.doesNotMatch(result.skillMarkdown, /supersecret123/);
});

test("does not accept required headings hidden inside a code fence", async () => {
  const markdown = "```md\n# Fake\n## Description\n## Procedure\n## Repository Constraints\n## Examples\n```";
  const result = await compileSkill(input, [], {
    modelUrl: "https://model.example/compile",
    fetcher: (async () => new Response(JSON.stringify({ output: markdown }), { status: 200 })) as typeof fetch
  });
  assert.match(result.skillMarkdown, /## Procedure/);
  assert.doesNotMatch(result.skillMarkdown, /# Fake/);
});

test("falls back before parsing an oversized model response", async () => {
  const result = await compileSkill(input, [], {
    modelUrl: "https://model.example/compile",
    fetcher: (async () => new Response(JSON.stringify({ output: "x".repeat(130_000) }), { status: 200 })) as typeof fetch
  });
  assert.match(result.skillMarkdown, /No public source skill was found/);
});

test("withholds secret-like public source content from the model prompt", async () => {
  let promptBody = "";
  const result = await compileSkill(input, [{ ...source, content: "password=supersecret123" }], {
    modelUrl: "https://model.example/compile",
    fetcher: (async (_url, init) => {
      promptBody = String(init?.body ?? "");
      const markdown = "# Skill\n\n## Description\nSafe\n\n## Procedure\nDo it\n\n## Repository Constraints\nKeep scope\n\n## Examples\nExample";
      return new Response(JSON.stringify({ output: markdown }), { status: 200 });
    }) as typeof fetch
  });
  assert.doesNotMatch(promptBody, /supersecret123/);
  assert.match(result.changeSummary.join(" "), /Withheld 1 public source/);
  assert.equal(result.sources.length, 1);
  assert.equal(result.riskNotes.some((note) => note.category === "secret-like-value"), true);
});
