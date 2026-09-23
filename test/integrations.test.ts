import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const jsonRecipes = [
  "examples/claude-code.mcp.json",
  "examples/integrations/cursor.mcp.json",
  "examples/integrations/windsurf.mcp_config.json",
  "examples/integrations/vscode.mcp.json",
  "examples/integrations/copilot.mcp.json",
  "examples/integrations/gemini.settings.json"
];

test("ships valid JSON MCP recipes for major coding clients", async () => {
  for (const recipe of jsonRecipes) {
    const parsed = JSON.parse(await readFile(resolve(root, recipe), "utf8")) as Record<string, unknown>;
    const servers = (parsed.mcpServers ?? parsed.servers) as Record<string, unknown> | undefined;
    assert.ok(servers?.skillchef, recipe);
  }
});

test("ships a Codex TOML recipe with the stdio server command", async () => {
  const recipe = await readFile(resolve(root, "examples/integrations/codex.config.toml"), "utf8");
  assert.match(recipe, /\[mcp_servers\.skillchef\]/);
  assert.match(recipe, /command = "node"/);
  assert.match(recipe, /dist\/index\.js/);
});
