import { createServer as createNodeServer } from "node:http";
import { createMcpHandler } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { toNodeHandler } from "@modelcontextprotocol/node";
import { createServer } from "./server.js";
import { RateLimiter } from "./rate-limit.js";
import { InFlightLimiter } from "./rate-limit.js";
import { createProtectedHttpHandler } from "./http.js";
import { loadRuntimeConfig } from "./config.js";
import { GitHubSkillRetriever } from "./retrieval.js";

const config = loadRuntimeConfig();
const dependencies = {
  rateLimiter: config.transport === "http" ? null : new RateLimiter(config.rateLimitPerMinute),
  inFlightLimiter: new InFlightLimiter(config.maxInFlightCompilations),
  retriever: new GitHubSkillRetriever(config.publicSkillRepositories, undefined, config.publicSkillBranch, config.publicSkillFetchTimeoutMs, config.publicSkillGithubToken),
  compilerOptions: {
    modelUrl: config.modelUrl,
    modelToken: config.modelToken,
    modelTimeoutMs: config.modelTimeoutMs
  },
  compileDeadlineMs: config.compileDeadlineMs
};

if (config.transport === "http") {
  const handler = createMcpHandler(() => createServer(dependencies), { responseMode: "json" });
  const nodeHandler = toNodeHandler(handler);
  const protectedHandler = createProtectedHttpHandler(nodeHandler, {
    bearerToken: config.bearerToken,
    allowedOrigins: config.allowedOrigins,
    allowedHosts: config.allowedHosts,
    maxBodyBytes: config.httpMaxBodyBytes,
    rateLimiter: new RateLimiter(config.rateLimitPerMinute)
  });
  const httpServer = createNodeServer(protectedHandler);
  httpServer.requestTimeout = 120_000;
  httpServer.headersTimeout = 15_000;
  httpServer.keepAliveTimeout = 5_000;
  httpServer.maxRequestsPerSocket = 100;
  httpServer.on("error", (error) => {
    console.error(`task-time-skill-compiler MCP HTTP error: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
  httpServer.listen(config.port, config.httpHost, () => {
    console.error(`task-time-skill-compiler MCP listening on http://${config.httpHost}:${config.port}/mcp`);
  });
  let shutdownStarted = false;
  const shutdown = async () => {
    if (shutdownStarted) return;
    shutdownStarted = true;
    console.error("task-time-skill-compiler MCP shutting down");
    try {
      const closePromise = new Promise<void>((resolve, reject) => {
        httpServer.close((error) => error ? reject(error) : resolve());
      });
      httpServer.closeIdleConnections?.();
      let forceTimer: NodeJS.Timeout | undefined;
      await Promise.race([
        closePromise,
        new Promise<void>((resolve) => {
          forceTimer = setTimeout(() => {
            httpServer.closeAllConnections?.();
            resolve();
          }, 10_000);
        })
      ]);
      if (forceTimer) clearTimeout(forceTimer);
      await handler.close();
    } catch (error) {
      console.error(`task-time-skill-compiler MCP shutdown error: ${error instanceof Error ? error.message : String(error)}`);
      process.exitCode = 1;
    }
  };
  process.once("SIGINT", () => void shutdown());
  process.once("SIGTERM", () => void shutdown());
} else {
  const handle = serveStdio(() => createServer(dependencies));
  console.error("task-time-skill-compiler MCP running over stdio");
  let shutdownStarted = false;
  const shutdown = () => {
    if (shutdownStarted) return;
    shutdownStarted = true;
    void Promise.resolve(handle.close()).catch((error: unknown) => {
      console.error(`task-time-skill-compiler MCP shutdown error: ${error instanceof Error ? error.message : String(error)}`);
      process.exitCode = 1;
    });
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
