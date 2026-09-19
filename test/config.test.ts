import test from "node:test";
import assert from "node:assert/strict";
import { loadRuntimeConfig } from "../src/config.js";

test("loads safe HTTP defaults and loopback host guards", () => {
  const config = loadRuntimeConfig({ MCP_TRANSPORT: "http" });
  assert.equal(config.port, 3_000);
  assert.equal(config.httpHost, "127.0.0.1");
  assert.equal(config.httpMaxBodyBytes, 256_000);
  assert.equal(config.compileDeadlineMs, 60_000);
  assert.equal(config.maxInFlightCompilations, 2);
  assert.equal(config.rateLimitMaxKeys, 10_000);
  assert.deepEqual(config.allowedHosts, ["localhost", "127.0.0.1", "[::1]"]);
});

test("allows an empty public repository list for deterministic private deployments", () => {
  const config = loadRuntimeConfig({ PUBLIC_SKILL_REPOSITORIES: "" });
  assert.deepEqual(config.publicSkillRepositories, []);
});

test("keeps the optional GitHub retrieval token in runtime configuration", () => {
  const config = loadRuntimeConfig({ PUBLIC_SKILL_GITHUB_TOKEN: "github-token" });
  assert.equal(config.publicSkillGithubToken, "github-token");
});

test("fails fast for invalid runtime configuration", () => {
  assert.throws(() => loadRuntimeConfig({ MCP_TRANSPORT: "http", PORT: "nope" }), /PORT/);
  assert.throws(() => loadRuntimeConfig({ MCP_TRANSPORT: "wat" }), /MCP_TRANSPORT/);
  assert.throws(() => loadRuntimeConfig({ MCP_TRANSPORT: "http", MCP_HTTP_HOST: "0.0.0.0" }), /MCP_HTTP_AUTH_TOKEN/);
  assert.throws(() => loadRuntimeConfig({ MCP_TRANSPORT: "http", MCP_HTTP_HOST: "0.0.0.0", MCP_HTTP_AUTH_TOKEN: "token" }), /MCP_HTTP_ALLOWED_HOSTS/);
  const remote = loadRuntimeConfig({
    MCP_TRANSPORT: "http",
    MCP_HTTP_HOST: "0.0.0.0",
    MCP_HTTP_AUTH_TOKEN: "token",
    MCP_HTTP_ALLOWED_HOSTS: "compiler.example.com"
  });
  assert.deepEqual(remote.allowedHosts, ["compiler.example.com"]);
  assert.throws(() => loadRuntimeConfig({ PUBLIC_SKILL_REPOSITORIES: "not-a-repository" }), /PUBLIC_SKILL_REPOSITORIES/);
  assert.throws(() => loadRuntimeConfig({ SKILL_COMPILER_MODEL_URL: "file:///tmp/model" }), /SKILL_COMPILER_MODEL_URL/);
  assert.throws(() => loadRuntimeConfig({ SKILL_COMPILER_MODEL_URL: "http://model.example/compile" }), /must use HTTPS/);
  assert.throws(() => loadRuntimeConfig({ SKILL_COMPILER_MODEL_URL: "https://user:pass@model.example/compile" }), /embedded credentials/);
  assert.throws(() => loadRuntimeConfig({ SKILL_COMPILER_MODEL_TOKEN: "token" }), /requires/);
  assert.throws(() => loadRuntimeConfig({ RATE_LIMIT_MAX_KEYS: "0" }), /RATE_LIMIT_MAX_KEYS/);
});

test("allows loopback HTTP for local model development and rejects remote HTTP by default", () => {
  assert.equal(loadRuntimeConfig({ SKILL_COMPILER_MODEL_URL: "http://127.0.0.1:8080/compile" }).modelUrl, "http://127.0.0.1:8080/compile");
  assert.equal(loadRuntimeConfig({ SKILL_COMPILER_MODEL_URL: "http://model.example/compile", SKILL_COMPILER_ALLOW_INSECURE_HTTP: "true" }).modelUrl, "http://model.example/compile");
});
