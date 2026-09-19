import { McpServer } from "@modelcontextprotocol/server";
import type { SkillRetriever } from "./types.js";
import { compileSkill } from "./compiler.js";
import { compileSkillInputSchema, compileSkillOutputSchema } from "./types.js";
import { validateCompileInput } from "./limits.js";
import { RateLimiter } from "./rate-limit.js";
import { GitHubSkillRetriever } from "./retrieval.js";
import type { CompilerOptions } from "./compiler.js";

export interface ServerDependencies {
  retriever?: SkillRetriever;
  rateLimiter?: RateLimiter;
  compilerOptions?: CompilerOptions;
}

export function createServer(dependencies: ServerDependencies = {}): McpServer {
  const retriever = dependencies.retriever ?? new GitHubSkillRetriever();
  const rateLimiter = dependencies.rateLimiter ?? new RateLimiter();

  const server = new McpServer(
    { name: "task-time-skill-compiler", version: "0.1.0" },
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
        rateLimiter.consume("anonymous");
        const sources = await retriever.search(input.search_query);
        const result = await compileSkill(input, sources, dependencies.compilerOptions ?? {
          modelUrl: process.env.SKILL_COMPILER_MODEL_URL,
          modelToken: process.env.SKILL_COMPILER_MODEL_TOKEN,
          modelTimeoutMs: Number(process.env.SKILL_COMPILER_MODEL_TIMEOUT_MS ?? 20_000)
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
          structuredContent: result
        };
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
