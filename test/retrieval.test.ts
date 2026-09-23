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

test("uses public skill content to refine path-based ranking", async () => {
  const pages = new Map([
    ["https://api.github.com/repos/acme/skills/git/trees/main?recursive=1", JSON.stringify({ tree: [
      { path: "skills/general/SKILL.md", type: "blob" },
      { path: "skills/other/SKILL.md", type: "blob" }
    ] })],
    ["https://raw.githubusercontent.com/acme/skills/main/skills/general/SKILL.md", "# General\nA generic workflow."],
    ["https://raw.githubusercontent.com/acme/skills/main/skills/other/SKILL.md", "# Other\nUse the graphql resolver pattern for this task."]
  ]);
  const retriever = new GitHubSkillRetriever(["acme/skills"], async (url) => {
    const value = pages.get(url);
    if (!value) throw new Error("missing fixture");
    return value;
  });
  const results = await retriever.search("graphql resolver");
  assert.equal(results[0]?.title, "other");
  assert.match(results[0]?.matchReason ?? "", /content/);
});

test("caches public tree and skill responses within one retriever", async () => {
  let calls = 0;
  const retriever = new GitHubSkillRetriever(["acme/skills"], async (url) => {
    calls += 1;
    if (url.startsWith("https://api.github.com/")) {
      return JSON.stringify({ tree: [{ path: "skills/frontend/SKILL.md", type: "blob" }] });
    }
    return "# Frontend\nUse the existing components.";
  });
  await retriever.search("frontend");
  await retriever.search("frontend");
  assert.equal(calls, 2);
});

test("passes the optional GitHub token as a request header", async () => {
  const receivedHeaders: Array<{ url: string; headers: Record<string, string> | undefined }> = [];
  const retriever = new GitHubSkillRetriever(["acme/skills"], async (_url, _signal, headers) => {
    receivedHeaders.push({ url: _url, headers });
    return JSON.stringify({ tree: [] });
  }, "main", 10, "github-token");
  await retriever.search("frontend");
  assert.deepEqual(receivedHeaders, [{ url: "https://api.github.com/repos/acme/skills/git/trees/main?recursive=1", headers: { authorization: "Bearer github-token" } }]);
});

test("does not send the GitHub API token to raw source URLs", async () => {
  const receivedHeaders: Array<{ url: string; headers: Record<string, string> | undefined }> = [];
  const retriever = new GitHubSkillRetriever(["acme/skills"], async (url, _signal, headers) => {
    receivedHeaders.push({ url, headers });
    return url.startsWith("https://api.github.com/")
      ? JSON.stringify({ tree: [{ path: "skills/frontend/SKILL.md", type: "blob" }] })
      : "# Frontend\nUse the existing components.";
  }, "main", 10, "github-token");
  await retriever.search("frontend");
  assert.deepEqual(receivedHeaders, [
    { url: "https://api.github.com/repos/acme/skills/git/trees/main?recursive=1", headers: { authorization: "Bearer github-token" } },
    { url: "https://raw.githubusercontent.com/acme/skills/main/skills/frontend/SKILL.md", headers: undefined }
  ]);
});

test("reports partial and failed retrieval status without throwing", async () => {
  const partial = new GitHubSkillRetriever(["acme/one", "acme/two"], async (url) => {
    if (url.includes("acme/one")) return JSON.stringify({ tree: [{ path: "skills/frontend/SKILL.md", type: "blob" }] });
    if (url.includes("api.github.com/repos/acme/two")) throw new Error("rate limited");
    return "# Frontend\nUse the existing components.";
  });
  assert.equal((await partial.search("frontend")).length, 1);
  assert.equal(partial.getLastSearchStatus(), "partial");

  const failed = new GitHubSkillRetriever(["acme/skills"], async () => { throw new Error("timeout"); });
  assert.deepEqual(await failed.search("frontend"), []);
  assert.equal(failed.getLastSearchStatus(), "failed");
});

test("encodes unusual public skill path segments in source URLs", async () => {
  const requested: string[] = [];
  const retriever = new GitHubSkillRetriever(["acme/skills"], async (url) => {
    requested.push(url);
    if (url.startsWith("https://api.github.com/")) {
      return JSON.stringify({ tree: [{ path: "skills/ui#review/SKILL.md", type: "blob" }] });
    }
    return "# Safe skill";
  });
  const results = await retriever.search("ui review");
  assert.equal(results[0]?.url, "https://github.com/acme/skills/blob/main/skills/ui%23review/SKILL.md");
  assert.equal(requested.includes("https://raw.githubusercontent.com/acme/skills/main/skills/ui%23review/SKILL.md"), true);
});

test("encodes branch names in GitHub API paths", async () => {
  let treeUrl = "";
  const retriever = new GitHubSkillRetriever(["acme/skills"], async (url) => {
    treeUrl = url;
    return JSON.stringify({ tree: [] });
  }, "release/v1");
  await retriever.search("frontend");
  assert.equal(treeUrl, "https://api.github.com/repos/acme/skills/git/trees/release%2Fv1?recursive=1");
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

test("cancels a response body when its declared length is oversized", async () => {
  let canceled = false;
  const response = new Response(new ReadableStream({ cancel: () => { canceled = true; } }), {
    headers: { "content-length": String(LIMITS.fetchBytes + 1) }
  });
  await assert.rejects(readLimitedResponse(response, LIMITS.fetchBytes), /exceeded/);
  assert.equal(canceled, true);
});
