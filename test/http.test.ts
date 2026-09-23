import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { createServer as createNodeServer, request as nodeRequest } from "node:http";
import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createProtectedHttpHandler, isLoopbackHost } from "../src/http.js";
import { createServer } from "../src/server.js";
import { RateLimiter } from "../src/rate-limit.js";

function request(url: string, headers: Record<string, string> = {}, method = "POST", remoteAddress = "127.0.0.1") {
  return Object.assign(new EventEmitter(), { url, headers, method, socket: { remoteAddress } });
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
  handler(request("/mcp", { authorization: "Bearer a-long-test-token", origin: "http://localhost:3000" }, "GET") as never, accepted as never);
  assert.equal(handled, 1);
  assert.equal(accepted.headers["access-control-allow-origin"], "http://localhost:3000");
  assert.equal(accepted.headers["cache-control"], "no-store");
  assert.equal(accepted.headers["x-content-type-options"], "nosniff");
  assert.equal(accepted.headers["referrer-policy"], "no-referrer");
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

test("rejects browser origins unless an explicit allowlist is configured", () => {
  const guarded = createProtectedHttpHandler(() => undefined);
  const rejected = response();
  guarded(request("/mcp", { origin: "http://localhost:3000" }) as never, rejected as never);
  assert.equal(rejected.statusCode, 403);
});

test("enforces HTTP rate limits per client with Retry-After", () => {
  let handled = 0;
  const guarded = createProtectedHttpHandler(() => { handled += 1; }, { rateLimiter: new RateLimiter(1, 60_000) });
  const first = response();
  guarded(request("/mcp", {}, "GET", "127.0.0.1") as never, first as never);
  const second = response();
  guarded(request("/mcp", {}, "GET", "127.0.0.1") as never, second as never);
  const otherClient = response();
  guarded(request("/mcp", {}, "GET", "127.0.0.2") as never, otherClient as never);
  assert.equal(first.statusCode, 200);
  assert.equal(second.statusCode, 429);
  assert.equal(second.headers["retry-after"], "60");
  assert.equal(otherClient.statusCode, 200);
  assert.equal(handled, 2);
});

test("supports a trusted proxy client identity function for rate limiting", () => {
  let handled = 0;
  const guarded = createProtectedHttpHandler(() => { handled += 1; }, {
    rateLimiter: new RateLimiter(1, 60_000),
    clientKey: (incoming) => String(incoming.headers["x-real-ip"] ?? incoming.socket?.remoteAddress ?? "anonymous")
  });
  const first = response();
  guarded(request("/mcp", { "x-real-ip": "198.51.100.10" }, "GET", "127.0.0.1") as never, first as never);
  const sameClient = response();
  guarded(request("/mcp", { "x-real-ip": "198.51.100.10" }, "GET", "127.0.0.2") as never, sameClient as never);
  const otherClient = response();
  guarded(request("/mcp", { "x-real-ip": "198.51.100.11" }, "GET", "127.0.0.2") as never, otherClient as never);
  assert.equal(first.statusCode, 200);
  assert.equal(sameClient.statusCode, 429);
  assert.equal(otherClient.statusCode, 200);
  assert.equal(handled, 2);
});

test("serves a cache-disabled health response without invoking MCP", () => {
  let handled = 0;
  const guarded = createProtectedHttpHandler(() => { handled += 1; }, { allowedHosts: ["localhost"] });
  const healthy = response();
  guarded(request("/healthz", { host: "localhost:3000" }, "GET") as never, healthy as never);
  assert.equal(healthy.statusCode, 200);
  assert.equal(healthy.headers["cache-control"], "no-store");
  assert.equal(healthy.body, JSON.stringify({ status: "ok" }));
  assert.equal(handled, 0);

  const wrongMethod = response();
  guarded(request("/healthz", { host: "localhost:3000" }, "POST") as never, wrongMethod as never);
  assert.equal(wrongMethod.statusCode, 405);
});

test("rejects oversized chunked bodies before invoking the MCP handler", async () => {
  let handled = 0;
  const httpServer = createNodeServer(createProtectedHttpHandler(() => { handled += 1; }, {
    allowedHosts: ["127.0.0.1"],
    maxBodyBytes: 32
  }));
  await new Promise<void>((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  const address = httpServer.address();
  assert.ok(address && typeof address === "object");

  try {
    const result = await new Promise<{ statusCode: number; body: string }>((resolve, reject) => {
      const request = nodeRequest({
        host: "127.0.0.1",
        port: address.port,
        method: "POST",
        path: "/mcp",
        headers: { host: "127.0.0.1" }
      }, (response) => {
        const chunks: Buffer[] = [];
        response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        response.on("end", () => resolve({ statusCode: response.statusCode ?? 0, body: Buffer.concat(chunks).toString("utf8") }));
      });
      request.on("error", reject);
      request.write("x".repeat(64));
      request.end();
    });
    assert.equal(result.statusCode, 413);
    assert.match(result.body, /Request body too large/);
    assert.equal(handled, 0);
  } finally {
    await new Promise<void>((resolve, reject) => httpServer.close((error) => error ? reject(error) : resolve()));
  }
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
