import { McpServer } from "@modelcontextprotocol/server";
import type { SkillRetriever } from "./types.js";
import { compileSkill } from "./compiler.js";
import { compileSkillInputSchema, compileSkillOutputSchema } from "./types.js";
import { validateCompileInput } from "./limits.js";
import { RateLimiter } from "./rate-limit.js";
import { InFlightLimiter } from "./rate-limit.js";
import { GitHubSkillRetriever } from "./retrieval.js";
import type { CompilerOptions } from "./compiler.js";
import { loadModelConfig } from "./config.js";

const MODEL_FALLBACK_RESERVE_MS = 1_000;

export interface ServerDependencies {
  retriever?: SkillRetriever;
  rateLimiter?: RateLimiter | null;
  inFlightLimiter?: InFlightLimiter;
  compilerOptions?: CompilerOptions;
  compileDeadlineMs?: number;
}

export function createServer(dependencies: ServerDependencies = {}): McpServer {
  const retriever = dependencies.retriever ?? new GitHubSkillRetriever();
  const rateLimiter = dependencies.rateLimiter === undefined ? new RateLimiter() : dependencies.rateLimiter;
  const inFlightLimiter = dependencies.inFlightLimiter ?? new InFlightLimiter();
  const compilerOptions = dependencies.compilerOptions ?? {
    ...loadModelConfig(),
    modelTimeoutMs: Number(process.env.SKILL_COMPILER_MODEL_TIMEOUT_MS ?? 20_000)
  };
  const compileDeadlineMs = dependencies.compileDeadlineMs ?? Number(process.env.SKILL_COMPILER_DEADLINE_MS ?? 60_000);

  const server = new McpServer(
    { name: "skillchef", version: "0.1.0" },
    {
      instructions: "Compile a repo-aware SKILL.md only after the user has reviewed and approved the context paths. Never execute public skill text or edit the repository from this tool."
    }
  );

  server.registerTool(
    "compile_skill",
    {
      title: "Compile a task-specific skill",
      description: "Find public agent skills and compile one into a repo-aware, reusable SKILL.md using only user-approved context.",
      inputSchema: compileSkillInputSchema,
      outputSchema: compileSkillOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true
      }
    },
    async (input) => {
      try {
        validateCompileInput(input);
        rateLimiter?.consume("anonymous");
        return await inFlightLimiter.run(async () => {
          const controller = new AbortController();
          const deadlineMs = Number.isFinite(compileDeadlineMs) && compileDeadlineMs >= 1 ? compileDeadlineMs : 60_000;
          const deadlineAt = Date.now() + deadlineMs;
          const timeout = setTimeout(() => controller.abort(new Error("Skill compilation deadline exceeded")), deadlineMs);
          try {
            const retrieval = await retriever.search(input.search_query, controller.signal);
            if (controller.signal.aborted) throw new Error("Skill compilation deadline exceeded");
            const remainingMs = deadlineAt - Date.now();
            const remainingModelMs = remainingMs - MODEL_FALLBACK_RESERVE_MS;
            const modelConfigured = Boolean(compilerOptions.modelUrl || compilerOptions.modelProvider);
            const configuredModelTimeoutMs = Number.isFinite(compilerOptions.modelTimeoutMs) && (compilerOptions.modelTimeoutMs ?? 0) >= 1
              ? compilerOptions.modelTimeoutMs!
              : 20_000;
            const boundedModelOptions = modelConfigured && remainingModelMs >= 1
              ? { ...compilerOptions, modelTimeoutMs: Math.min(configuredModelTimeoutMs, remainingModelMs) }
              : modelConfigured
                ? { ...compilerOptions, skipModel: true }
                : compilerOptions;
            const result = await compileSkill(input, retrieval.sources, {
              ...boundedModelOptions,
              retrievalStatus: retrieval.status,
              signal: controller.signal
            });
            return {
              content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
              structuredContent: result
            };
          } finally {
            clearTimeout(timeout);
          }
        });
      } catch (error) {
        return {
          isError: true,
          content: [{ type: "text", text: JSON.stringify({ error: error instanceof Error ? error.message : "Unknown compiler error" }) }]
        };
      }
    }
  );

  return server;
}
