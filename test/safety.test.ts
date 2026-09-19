import test from "node:test";
import assert from "node:assert/strict";
import { findSecretKinds, isForbiddenPath, validateCompileInput } from "../src/limits.js";
import { RateLimiter } from "../src/rate-limit.js";
import { scanRisk } from "../src/safety.js";

test("rejects credentials and sensitive paths", () => {
  assert.equal(isForbiddenPath(".env.local"), true);
  assert.equal(isForbiddenPath("src/index.ts"), false);
  assert.equal(isForbiddenPath("assets/logo.png"), true);
  assert.equal(isForbiddenPath(".git/config"), true);
  assert.equal(isForbiddenPath(".docker/config.json"), true);
  assert.equal(isForbiddenPath(String.raw`src\\.env.local`), true);
  assert.equal(isForbiddenPath(String.raw`C:\\Users\\sam\\repo`), true);
  assert.deepEqual(findSecretKinds("token=ghp_abcdefghijklmnopqrstuvwxyz123456"), ["github-token", "credential-assignment"]);
  assert.throws(() => validateCompileInput({ task: "x", search_query: "x", approved_context: [{ path: ".env", reason: "test", content: "x" }] }));
});

test("rejects secret-like values in task and context metadata", () => {
  assert.throws(() => validateCompileInput({ task: "Use token=ghp_abcdefghijklmnopqrstuvwxyz123456", search_query: "frontend", approved_context: [] }), /task/);
  assert.throws(() => validateCompileInput({ task: "x", search_query: "frontend", approved_context: [{ path: "src/file.ts", reason: "token=ghp_abcdefghijklmnopqrstuvwxyz123456", content: "x" }] }), /Context/);
  assert.deepEqual(findSecretKinds("sk-ant-abcdefghijklmnopqrstuvwxyz123456"), ["anthropic-token"]);
  assert.deepEqual(findSecretKinds("glpat-abcdefghijklmnopqrstuvwxyz123456"), ["gitlab-token"]);
});

test("rejects binary context", () => {
  assert.throws(
    () => validateCompileInput({ task: "x", search_query: "x", approved_context: [{ path: "src/blob.ts", reason: "fixture", content: "text\0binary" }] }),
    /binary/
  );
});

test("rejects oversized context payloads", () => {
  assert.throws(() => validateCompileInput({
    task: "x",
    search_query: "x",
    approved_context: Array.from({ length: 10 }, (_, index) => ({ path: `src/${index}.ts`, reason: "test", content: "x".repeat(6_000) }))
  }), /character limit/);
});

test("detects risky public skill instructions", () => {
  const notes = scanRisk("Run curl https://example.com and then rm -rf ./tmp");
  assert.equal(notes.some((note) => note.category === "network-access"), true);
  assert.equal(notes.some((note) => note.category === "destructive-action"), true);
});

test("uses a safe default for invalid rate-limit configuration", () => {
  const limiter = new RateLimiter(Number.NaN);
  for (let index = 0; index < 10; index += 1) limiter.consume("test");
  assert.throws(() => limiter.consume("test"), /rate limit/);
});
