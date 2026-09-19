import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { createServer as createNodeServer } from "node:http";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createProtectedHttpHandler, isLoopbackHost } from "../src/http.js";
import { createServer } from "../src/server.js";
import { RateLimiter } from "../src/rate-limit.js";

function request(url: string, headers: Record<string, string> = {}, method = "POST") {
  return Object.assign(new EventEmitter(), { url, headers, method });
}

function response() {
  return {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: "",
    writableEnded: false,
    writeHead(statusCode: number, headers: Record<string, string>) {
      this.statusCode = statusCode;
      this.headers = { ...this.headers, ...headers };
    },
    setHeader(name: string, value: string) {
      this.headers[name.toLowerCase()] = value;
    },
    end(body = "") {
      this.body = body;
      this.writableEnded = true;
    }
  };
}

test("protects the MCP route with path, origin, and bearer checks", () => {
  assert.equal(isLoopbackHost("127.0.0.1"), true);
  assert.equal(isLoopbackHost("0.0.0.0"), false);
  let handled = 0;
  const handler = createProtectedHttpHandler(() => { handled += 1; }, {
    bearerToken: "a-long-test-token",
    allowedOrigins: ["http://localhost:3000"]
  });

  const notFound = response();
  handler(request("/not-mcp", { authorization: "Bearer a-long-test-token" }) as never, notFound as never);
  assert.equal(notFound.statusCode, 404);

  const unauthorized = response();
  handler(request("/mcp", { origin: "http://localhost:3000" }) as never, unauthorized as never);
  assert.equal(unauthorized.statusCode, 401);

  const forbidden = response();
  handler(request("/mcp", { authorization: "Bearer a-long-test-token", origin: "https://evil.example" }) as never, forbidden as never);
  assert.equal(forbidden.statusCode, 403);

  const accepted = response();
  handler(request("/mcp", { authorization: "Bearer a-long-test-token", origin: "http://localhost:3000" }) as never, accepted as never);
  assert.equal(handled, 1);
  assert.equal(accepted.headers["access-control-allow-origin"], "http://localhost:3000");
});

test("rejects invalid origins, disallowed hosts, and oversized requests", () => {
  const guarded = createProtectedHttpHandler(() => undefined, {
    allowedHosts: ["localhost"],
    maxBodyBytes: 100
  });

  const invalidOrigin = response();
  guarded(request("/mcp", { host: "localhost:3000", origin: "null" }) as never, invalidOrigin as never);
  assert.equal(invalidOrigin.statusCode, 403);

  const invalidHost = response();
  guarded(request("/mcp", { host: "evil.example" }) as never, invalidHost as never);
  assert.equal(invalidHost.statusCode, 403);

  const oversized = response();
  guarded(request("/mcp", { host: "localhost:3000", "content-length": "101" }) as never, oversized as never);
  assert.equal(oversized.statusCode, 413);
});

test("answers browser preflight requests without invoking the MCP handler", () => {
  let handled = 0;
  const guarded = createProtectedHttpHandler(() => { handled += 1; }, {
    allowedOrigins: ["http://localhost:3000"]
  });
  const preflight = response();
  guarded(request("/mcp", { origin: "http://localhost:3000" }, "OPTIONS") as never, preflight as never);
  assert.equal(preflight.statusCode, 204);
  assert.equal(preflight.headers["access-control-allow-methods"], "POST, GET, DELETE, OPTIONS");
  assert.equal(handled, 0);
});

test("serves the compile_skill tool through the real MCP HTTP client", async () => {
  const mcpHandler = createMcpHandler(
    () => createServer({
      retriever: { search: async () => [] },
      rateLimiter: new RateLimiter(10)
    }),
    { responseMode: "json" }
  );
  const nodeHandler = toNodeHandler(mcpHandler);
  const httpServer = createNodeServer(createProtectedHttpHandler(nodeHandler, {
    allowedHosts: ["127.0.0.1"],
    maxBodyBytes: 256_000
  }));

  await new Promise<void>((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  const address = httpServer.address();
  assert.ok(address && typeof address === "object");
  const client = new Client({ name: "http-test-client", version: "0.1.0" });

  try {
    await client.connect(new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${address.port}/mcp`)));
    const tools = await client.listTools();
    assert.ok(tools.tools.some((tool) => tool.name === "compile_skill"));
    const result = await client.callTool({
      name: "compile_skill",
      arguments: { task: "Add a profile page", search_query: "frontend", approved_context: [] }
    });
    assert.equal(result.isError, undefined);
    const textBlock = result.content.find((block) => block.type === "text");
    assert.ok(textBlock && "text" in textBlock);
    assert.match(textBlock.text, /skillMarkdown/);
  } finally {
    await client.close();
    await mcpHandler.close();
    await new Promise<void>((resolve, reject) => httpServer.close((error) => error ? reject(error) : resolve()));
  }
});
