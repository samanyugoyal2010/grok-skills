import test from "node:test";
import assert from "node:assert/strict";
import { findSecretKinds, isForbiddenPath, validateCompileInput } from "../src/limits.js";
import { InFlightLimiter, RateLimitError, RateLimiter } from "../src/rate-limit.js";
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
  assert.equal(findSecretKinds("AWS_SECRET_ACCESS_KEY=abcdefghijklmnop").includes("aws-secret-assignment"), true);
  assert.equal(findSecretKinds("DATABASE_URL=postgres://user:password@example.com/db").includes("database-url"), true);
  assert.equal(findSecretKinds("const accessToken = getToken();").length, 0);
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

test("reports a retry window when a rate limit is exceeded", () => {
  const limiter = new RateLimiter(1, 60_000);
  limiter.consume("client");
  assert.throws(() => limiter.consume("client"), (error: unknown) => error instanceof RateLimitError && error.retryAfterSeconds === 60);
});

test("bounds the number of client buckets", () => {
  const limiter = new RateLimiter(10, 60_000, 2);
  limiter.consume("client-a");
  limiter.consume("client-b");
  limiter.consume("client-c");
  const buckets = (limiter as unknown as { buckets: Map<string, unknown> }).buckets;
  assert.equal(buckets.size, 2);
  assert.equal(buckets.has("client-c"), true);
});

test("rejects work above the in-flight compilation cap", async () => {
  const limiter = new InFlightLimiter(1);
  let release!: () => void;
  const first = limiter.run(() => new Promise<void>((resolve) => { release = resolve; }));
  await assert.rejects(limiter.run(async () => undefined), /Too many compilations/);
  release();
  await first;
  await limiter.run(async () => undefined);
});
