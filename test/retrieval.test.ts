import test from "node:test";
import assert from "node:assert/strict";
import { GitHubSkillRetriever, readLimitedResponse } from "../src/retrieval.js";
import { LIMITS } from "../src/limits.js";

test("retrieves and ranks public skills from the GitHub directory adapter", async () => {
  const pages = new Map([
    ["https://api.github.com/repos/acme/skills/git/trees/main?recursive=1", JSON.stringify({ tree: [
      { path: "skills/code-review/SKILL.md", type: "blob" },
      { path: "skills/frontend-design/SKILL.md", type: "blob" }
    ] })],
    ["https://raw.githubusercontent.com/acme/skills/main/skills/code-review/SKILL.md", "# Code review\nReview code and run tests."],
    ["https://raw.githubusercontent.com/acme/skills/main/skills/frontend-design/SKILL.md", "# Frontend design\nBuild UI components."]
  ]);
  const retriever = new GitHubSkillRetriever(["acme/skills"], async (url) => {
    const value = pages.get(url);
    if (!value) throw new Error("missing fixture");
    return value;
  });
  const results = await retriever.search("code review");
  assert.equal(results.length, 2);
  assert.equal(results[0].url, "https://github.com/acme/skills/blob/main/skills/code-review/SKILL.md");
  assert.match(results[0].sourceHash, /^[a-f0-9]{64}$/);
  assert.match(results[0].content, /Review code/);
});

test("passes the optional GitHub token as a request header", async () => {
  let receivedHeaders: Record<string, string> | undefined;
  const retriever = new GitHubSkillRetriever(["acme/skills"], async (_url, _signal, headers) => {
    receivedHeaders = headers;
    return JSON.stringify({ tree: [] });
  }, "main", 10, "github-token");
  await retriever.search("frontend");
  assert.deepEqual(receivedHeaders, { authorization: "Bearer github-token" });
});

test("times out a hung public source fetch", async () => {
  const retriever = new GitHubSkillRetriever(["acme/skills"], async () => new Promise<string>(() => {}), "main", 10);
  const startedAt = Date.now();
  const results = await retriever.search("frontend");
  assert.deepEqual(results, []);
  assert.ok(Date.now() - startedAt < 500);
});

test("stops a hanging public source fetch when the parent deadline aborts", async () => {
  const controller = new AbortController();
  const retriever = new GitHubSkillRetriever(["acme/skills"], async (_url, signal) => {
    await new Promise<void>((resolve) => signal?.addEventListener("abort", () => resolve(), { once: true }));
    throw new Error("aborted");
  }, "main", 10_000);
  const search = retriever.search("frontend", controller.signal);
  setTimeout(() => controller.abort(new Error("deadline")), 10);
  const startedAt = Date.now();
  const results = await search;
  assert.deepEqual(results, []);
  assert.ok(Date.now() - startedAt < 500);
});

test("caps streamed public response bodies before buffering them", async () => {
  await assert.rejects(
    readLimitedResponse(new Response("x".repeat(LIMITS.fetchBytes + 1))),
    /exceeded/
  );
});
