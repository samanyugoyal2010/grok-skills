import { createServer as createNodeServer } from "node:http";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createServer } from "./server.js";
import { RateLimiter } from "./rate-limit.js";
import { createProtectedHttpHandler } from "./http.js";
import { loadRuntimeConfig } from "./config.js";
import { GitHubSkillRetriever } from "./retrieval.js";

const config = loadRuntimeConfig();
const dependencies = {
  rateLimiter: new RateLimiter(config.rateLimitPerMinute),
  retriever: new GitHubSkillRetriever(config.publicSkillRepositories, undefined, config.publicSkillBranch, config.publicSkillFetchTimeoutMs, config.publicSkillGithubToken),
  compilerOptions: {
    modelUrl: config.modelUrl,
    modelToken: config.modelToken,
    modelTimeoutMs: config.modelTimeoutMs
  }
};

if (config.transport === "http") {
  const handler = createMcpHandler(() => createServer(dependencies), { responseMode: "json" });
  const nodeHandler = toNodeHandler(handler);
  const protectedHandler = createProtectedHttpHandler(nodeHandler, {
    bearerToken: config.bearerToken,
    allowedOrigins: config.allowedOrigins,
    allowedHosts: config.allowedHosts,
    maxBodyBytes: config.httpMaxBodyBytes
  });
  const httpServer = createNodeServer(protectedHandler);
  httpServer.listen(config.port, config.httpHost, () => {
    console.error(`task-time-skill-compiler MCP listening on http://${config.httpHost}:${config.port}/mcp`);
  });
  const shutdown = async () => {
    await handler.close();
    httpServer.close();
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
} else {
  const handle = serveStdio(() => createServer(dependencies));
  console.error("task-time-skill-compiler MCP running over stdio");
  process.on("SIGINT", () => void handle.close());
}
