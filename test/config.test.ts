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

test("selects one locally configured provider with a conservative model default", () => {
  const config = loadRuntimeConfig({ OPENAI_API_KEY: "  local-openai-key  " });
  assert.equal(config.modelProvider, "openai");
  assert.equal(config.modelApiKey, "local-openai-key");
  assert.equal(config.model, "gpt-4.1-mini");
  assert.equal(loadRuntimeConfig({ ANTHROPIC_API_KEY: "local-anthropic-key" }).model, "claude-sonnet-5");
  assert.equal(loadRuntimeConfig({ OPENROUTER_API_KEY: "local-openrouter-key" }).model, "openai/gpt-4.1-mini");
  assert.equal(loadRuntimeConfig({ GROQ_API_KEY: "local-groq-key" }).model, "openai/gpt-oss-20b");
});

test("requires an explicit provider when multiple local API keys are set", () => {
  assert.throws(() => loadRuntimeConfig({ OPENAI_API_KEY: "one", GROQ_API_KEY: "two" }), /SKILL_COMPILER_PROVIDER/);
  const config = loadRuntimeConfig({ SKILL_COMPILER_PROVIDER: "groq", GROQ_API_KEY: "local-groq-key", SKILL_COMPILER_MODEL: "custom-model" });
  assert.equal(config.modelProvider, "groq");
  assert.equal(config.model, "custom-model");
});

test("selects Ollama explicitly without a key and applies its local defaults", () => {
  const config = loadRuntimeConfig({ SKILL_COMPILER_PROVIDER: "ollama" });
  assert.equal(config.modelProvider, "ollama");
  assert.equal(config.model, "qwen3:8b");
  assert.equal(config.ollamaBaseUrl, "http://127.0.0.1:11434");
  assert.equal(config.modelApiKey, undefined);
  assert.equal(config.modelTimeoutMs, 45_000);

  const custom = loadRuntimeConfig({
    SKILL_COMPILER_PROVIDER: "ollama",
    SKILL_COMPILER_MODEL: "llama3.2:3b",
    SKILL_COMPILER_OLLAMA_BASE_URL: "http://localhost:11434/"
  });
  assert.equal(custom.model, "llama3.2:3b");
  assert.equal(custom.ollamaBaseUrl, "http://localhost:11434");
  assert.equal(loadRuntimeConfig({ SKILL_COMPILER_PROVIDER: "ollama", SKILL_COMPILER_MODEL_TIMEOUT_MS: "45000" }).modelTimeoutMs, 45_000);
});

test("restricts Ollama URLs to loopback HTTP origins without credentials or extra URL components", () => {
  for (const url of [
    "https://127.0.0.1:11434",
    "http://ollama.example:11434",
    "http://192.168.1.20:11434",
    "http://user:pass@127.0.0.1:11434",
    "http://127.0.0.1:11434/api",
    "http://127.0.0.1:11434?token=x",
    "http://127.0.0.1:11434/#fragment"
  ]) {
    assert.throws(() => loadRuntimeConfig({
      SKILL_COMPILER_PROVIDER: "ollama",
      SKILL_COMPILER_OLLAMA_BASE_URL: url
    }), /SKILL_COMPILER_OLLAMA_BASE_URL/);
  }
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
    MCP_HTTP_ALLOWED_HOSTS: "Compiler.Example.COM"
  });
  assert.deepEqual(remote.allowedHosts, ["compiler.example.com"]);
  assert.throws(() => loadRuntimeConfig({ PUBLIC_SKILL_REPOSITORIES: "not-a-repository" }), /PUBLIC_SKILL_REPOSITORIES/);
  assert.throws(() => loadRuntimeConfig({ SKILL_COMPILER_MODEL_URL: "file:///tmp/model" }), /SKILL_COMPILER_MODEL_URL/);
  assert.throws(() => loadRuntimeConfig({ SKILL_COMPILER_MODEL_URL: "http://model.example/compile" }), /must use HTTPS/);
  assert.throws(() => loadRuntimeConfig({ SKILL_COMPILER_MODEL_URL: "https://user:pass@model.example/compile" }), /embedded credentials/);
  assert.throws(() => loadRuntimeConfig({ SKILL_COMPILER_MODEL_TOKEN: "token" }), /requires/);
  assert.throws(() => loadRuntimeConfig({ SKILL_COMPILER_PROVIDER: "unknown", OPENAI_API_KEY: "secret" }), /SKILL_COMPILER_PROVIDER/);
  assert.throws(() => loadRuntimeConfig({ SKILL_COMPILER_PROVIDER: "anthropic" }), /ANTHROPIC_API_KEY/);
  assert.throws(() => loadRuntimeConfig({ SKILL_COMPILER_PROVIDER: "openai", OPENAI_API_KEY: "key", SKILL_COMPILER_MODEL_URL: "https://model.example" }), /cannot be combined/);
  assert.throws(() => loadRuntimeConfig({ RATE_LIMIT_MAX_KEYS: "0" }), /RATE_LIMIT_MAX_KEYS/);
});

test("accepts a configured trusted proxy client identity header", () => {
  const config = loadRuntimeConfig({ MCP_TRANSPORT: "http", MCP_HTTP_CLIENT_ID_HEADER: "X-Real-IP" });
  assert.equal(config.httpClientIdHeader, "x-real-ip");
  assert.throws(() => loadRuntimeConfig({ MCP_TRANSPORT: "http", MCP_HTTP_CLIENT_ID_HEADER: "x bad" }), /header name/);
  for (const header of ["constructor", "toString", "hasOwnProperty", "__proto__"]) {
    assert.throws(() => loadRuntimeConfig({ MCP_TRANSPORT: "http", MCP_HTTP_CLIENT_ID_HEADER: header }), /header name/);
  }
});

test("allows loopback HTTP for local model development and rejects remote HTTP by default", () => {
  assert.equal(loadRuntimeConfig({ SKILL_COMPILER_MODEL_URL: "http://127.0.0.1:8080/compile" }).modelUrl, "http://127.0.0.1:8080/compile");
  assert.equal(loadRuntimeConfig({ SKILL_COMPILER_MODEL_URL: "http://model.example/compile", SKILL_COMPILER_ALLOW_INSECURE_HTTP: "true" }).modelUrl, "http://model.example/compile");
});
