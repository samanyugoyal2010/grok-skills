import test from "node:test";
import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { createProtectedHttpHandler, isLoopbackHost } from "../src/http.js";

function request(url: string, headers: Record<string, string> = {}) {
  return Object.assign(new EventEmitter(), { url, headers });
}

function response() {
  return {
    statusCode: 200,
    headers: {} as Record<string, string>,
    body: "",
    writeHead(statusCode: number, headers: Record<string, string>) {
      this.statusCode = statusCode;
      this.headers = headers;
    },
    end(body = "") {
      this.body = body;
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
});
