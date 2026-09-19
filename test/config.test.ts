import test from "node:test";
import assert from "node:assert/strict";
import { loadRuntimeConfig } from "../src/config.js";

test("loads safe HTTP defaults and loopback host guards", () => {
  const config = loadRuntimeConfig({ MCP_TRANSPORT: "http" });
  assert.equal(config.port, 3_000);
  assert.equal(config.httpHost, "127.0.0.1");
  assert.equal(config.httpMaxBodyBytes, 256_000);
  assert.deepEqual(config.allowedHosts, ["localhost", "127.0.0.1", "[::1]"]);
});

test("fails fast for invalid runtime configuration", () => {
  assert.throws(() => loadRuntimeConfig({ MCP_TRANSPORT: "http", PORT: "nope" }), /PORT/);
  assert.throws(() => loadRuntimeConfig({ MCP_TRANSPORT: "wat" }), /MCP_TRANSPORT/);
  assert.throws(() => loadRuntimeConfig({ MCP_TRANSPORT: "http", MCP_HTTP_HOST: "0.0.0.0" }), /MCP_HTTP_AUTH_TOKEN/);
});
