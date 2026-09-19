import { createServer as createNodeServer } from "node:http";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createServer } from "./server.js";
import { RateLimiter } from "./rate-limit.js";
import { createProtectedHttpHandler, isLoopbackHost } from "./http.js";

const dependencies = { rateLimiter: new RateLimiter() };

if (process.env.MCP_TRANSPORT === "http") {
  const handler = createMcpHandler(() => createServer(dependencies), { responseMode: "json" });
  const nodeHandler = toNodeHandler(handler);
  const port = Number(process.env.PORT ?? 3000);
  const host = process.env.MCP_HTTP_HOST ?? "127.0.0.1";
  const bearerToken = process.env.MCP_HTTP_AUTH_TOKEN;
  const allowedOrigins = (process.env.MCP_HTTP_ALLOWED_ORIGINS ?? "").split(",").map((origin) => origin.trim()).filter(Boolean);
  if (!isLoopbackHost(host) && !bearerToken) {
    throw new Error("MCP_HTTP_AUTH_TOKEN is required when MCP_HTTP_HOST is not loopback");
  }
  const protectedHandler = createProtectedHttpHandler(nodeHandler, { bearerToken, allowedOrigins });
  const httpServer = createNodeServer(protectedHandler);
  httpServer.listen(port, host, () => {
    console.error(`task-time-skill-compiler MCP listening on http://${host}:${port}/mcp`);
  });
  process.on("SIGINT", async () => {
    await handler.close();
    httpServer.close();
  });
} else {
  const handle = serveStdio(() => createServer(dependencies));
  console.error("task-time-skill-compiler MCP running over stdio");
  process.on("SIGINT", () => void handle.close());
}
