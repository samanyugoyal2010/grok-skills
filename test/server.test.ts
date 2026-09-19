import test from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/client";
import { InMemoryTransport } from "@modelcontextprotocol/server";
import { createServer } from "../src/server.js";
import type { SkillRetriever } from "../src/types.js";
import { RateLimiter } from "../src/rate-limit.js";

test("registers the compile_skill tool", async () => {
  const retriever: SkillRetriever = { search: async () => [] };
  const server = createServer({ retriever, rateLimiter: new RateLimiter(10) });
  const client = new Client({ name: "test-client", version: "0.1.0" });
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
  const tools = await client.listTools();
  assert.equal(tools.tools.some((tool) => tool.name === "compile_skill"), true);
  const result = await client.callTool({
    name: "compile_skill",
    arguments: { task: "Add a profile page", search_query: "frontend", approved_context: [] }
  });
  assert.equal(result.isError, undefined);
  const textBlock = result.content.find((block) => block.type === "text");
  assert.ok(textBlock && "text" in textBlock);
  assert.match(textBlock.text, /skillMarkdown/);
  await client.close();
  await server.close();
});
