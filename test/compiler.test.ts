import test from "node:test";
import assert from "node:assert/strict";
import { compileSkill } from "../src/compiler.js";
import { LIMITS } from "../src/limits.js";
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
  assert.match(result.skillMarkdown, /^---\nname: frontend-feature-implementation\n/m);
  assert.match(result.skillMarkdown, /^# /m);
  assert.match(result.skillMarkdown, /## Description/);
  assert.match(result.skillMarkdown, /## Procedure/);
  assert.match(result.skillMarkdown, /## Repository Constraints/);
  assert.match(result.skillMarkdown, /## Examples/);
});

test("keeps the deterministic fallback within the output limit for maximum valid input", async () => {
  const result = await compileSkill({
    task: "Implement the requested feature. ".repeat(100),
    search_query: "frontend validation testing",
    project_brief: "Use the existing repository conventions. ".repeat(500),
    approved_context: Array.from({ length: 10 }, (_, index) => ({
      path: `src/file-${index}.ts`,
      reason: "Approved context for the requested task. ".repeat(10),
      content: "const value = 1;\n".repeat(250)
    }))
  }, Array.from({ length: 5 }, (_, index) => ({
    url: `https://example.com/${"source-".repeat(80)}/${index}`,
    title: "Public source title ".repeat(30),
    sourceHash: "a".repeat(64),
    matchReason: "Matched the request",
    content: "Use the repository conventions."
  })));

  assert.ok(result.skillMarkdown.length <= LIMITS.outputChars);
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
  const markdown = "---\nname: skill\ndescription: A safe example skill.\n---\n\n# Skill\n\n## Description\nSafe\n\n## Procedure\nDo it\n\n## Repository Constraints\nKeep scope\n\n## Examples\nExample";
  const result = await compileSkill(input, [], {
    modelUrl: "https://model.example/compile",
    fetcher: (async () => new Response(JSON.stringify({ output: markdown }), { status: 200 })) as typeof fetch
  });
  assert.match(result.changeSummary.join(" "), /configured model endpoint/);
});

test("uses the configured provider adapter without placing its key in the prompt and reports safe failures", async () => {
  const apiKey = "provider-secret-only-in-server-config";
  let serializedRequest = "";
  const result = await compileSkill(input, [], {
    modelProvider: "openai",
    modelApiKey: apiKey,
    model: "gpt-4.1-mini",
    fetcher: (async (_url, init) => {
      serializedRequest = String(init?.body);
      assert.equal(new Headers(init?.headers).get("authorization"), `Bearer ${apiKey}`);
      return new Response(JSON.stringify({ output_text: "invalid skill" }), { status: 200 });
    }) as typeof fetch
  });
  assert.equal(serializedRequest.includes(apiKey), false);
  assert.match(result.changeSummary.join(" "), /openai.*used the deterministic compiler fallback/);
  assert.doesNotMatch(result.changeSummary.join(" "), new RegExp(apiKey));
});

test("times out provider calls that do not resolve and keeps the deterministic fallback", async () => {
  const result = await compileSkill(input, [], {
    modelProvider: "groq",
    modelApiKey: "server-only-key",
    model: "openai/gpt-oss-20b",
    modelTimeoutMs: 10,
    fetcher: (async () => new Promise<Response>(() => {})) as typeof fetch
  });
  assert.match(result.changeSummary.join(" "), /timed out.*deterministic compiler fallback/);
  assert.doesNotMatch(result.changeSummary.join(" "), /server-only-key/);
});

test("falls back when the model endpoint times out or fails", async () => {
  const result = await compileSkill(input, [], {
    modelUrl: "https://model.example/compile",
    fetcher: (async () => { throw new Error("timeout"); }) as typeof fetch
  });
  assert.equal(result.sources.length, 0);
  assert.match(result.skillMarkdown, /No public source skill was found/);
});

test("does not wait for a model fetcher that ignores the parent deadline", async () => {
  const controller = new AbortController();
  const compilation = compileSkill(input, [], {
    modelUrl: "https://model.example/compile",
    signal: controller.signal,
    fetcher: (async () => new Promise<Response>(() => {})) as typeof fetch
  });
  setTimeout(() => controller.abort(new Error("deadline")), 10);
  await assert.rejects(compilation, /deadline/i);
});

test("cancels a model response body that never finishes", async () => {
  const controller = new AbortController();
  const result = await compileSkill(input, [], {
    modelUrl: "https://model.example/compile",
    modelTimeoutMs: 10,
    signal: controller.signal,
    fetcher: (async () => new Response(new ReadableStream({ pull: () => new Promise<void>(() => {}) }))) as typeof fetch
  });
  assert.match(result.changeSummary.join(" "), /deterministic compiler fallback/);
});

test("falls back when the model returns secret-like output", async () => {
  const markdown = "---\nname: skill\ndescription: A safe example skill.\n---\n\n# Skill\n\n## Description\nSafe\n\n## Procedure\nDo it\n\n## Repository Constraints\nKeep scope\n\n## Examples\npassword=supersecret123";
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
      const markdown = "---\nname: skill\ndescription: A safe example skill.\n---\n\n# Skill\n\n## Description\nSafe\n\n## Procedure\nDo it\n\n## Repository Constraints\nKeep scope\n\n## Examples\nExample";
      return new Response(JSON.stringify({ output: markdown }), { status: 200 });
    }) as typeof fetch
  });
  assert.doesNotMatch(promptBody, /supersecret123/);
  assert.match(result.changeSummary.join(" "), /Withheld 1 public source/);
  assert.equal(result.sources.length, 1);
  assert.equal(result.riskNotes.some((note) => note.category === "secret-like-value"), true);
});
