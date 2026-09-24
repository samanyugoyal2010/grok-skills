"use client";

import { useState } from "react";
import { CodeBlock } from "./code-block";

const recipes = [
  {
    id: "claude",
    name: "Claude Code",
    configPath: ".mcp.json",
    skillPath: ".claude/skills/<name>/SKILL.md",
    config: `{
  "mcpServers": {
    "skillchef": {
      "command": "node",
      "args": ["/absolute/path/to/ai-b2b-saas/dist/index.js"]
    }
  }
}`
  },
  {
    id: "cursor",
    name: "Cursor",
    configPath: ".cursor/mcp.json",
    skillPath: ".agents/skills/<name>/SKILL.md",
    config: `{
  "mcpServers": {
    "skillchef": {
      "command": "node",
      "args": ["/absolute/path/to/ai-b2b-saas/dist/index.js"]
    }
  }
}`
  },
  {
    id: "codex",
    name: "Codex",
    configPath: "~/.codex/config.toml",
    skillPath: ".agents/skills/<name>/SKILL.md",
    config: `[mcp_servers.skillchef]
command = "node"
args = ["/absolute/path/to/ai-b2b-saas/dist/index.js"]`
  },
  {
    id: "vscode",
    name: "VS Code",
    configPath: ".vscode/mcp.json",
    skillPath: ".github/skills/<name>/SKILL.md",
    config: `{
  "servers": {
    "skillchef": {
      "type": "stdio",
      "command": "node",
      "args": ["/absolute/path/to/ai-b2b-saas/dist/index.js"]
    }
  }
}`
  },
  {
    id: "copilot",
    name: "Copilot CLI",
    configPath: "~/.copilot/mcp-config.json",
    skillPath: ".github/skills/<name>/SKILL.md",
    config: `{
  "mcpServers": {
    "skillchef": {
      "type": "local",
      "command": "node",
      "args": ["/absolute/path/to/ai-b2b-saas/dist/index.js"]
    }
  }
}`
  },
  {
    id: "gemini",
    name: "Gemini CLI",
    configPath: ".gemini/settings.json",
    skillPath: ".gemini/skills/<name>/SKILL.md",
    config: `{
  "mcpServers": {
    "skillchef": {
      "command": "node",
      "args": ["/absolute/path/to/ai-b2b-saas/dist/index.js"]
    }
  }
}`
  }
] as const;

export function RecipeStation() {
  const [selectedId, setSelectedId] = useState<(typeof recipes)[number]["id"]>("codex");
  const selected = recipes.find((recipe) => recipe.id === selectedId) ?? recipes[0];

  return (
    <div className="station">
      <div className="station-heading">
        <h4>2 · Add it to your agent</h4>
      </div>
      <div className="station-tabs" role="group" aria-label="Choose your coding agent">
        {recipes.map((recipe) => (
          <button
            key={recipe.id}
            className={`station-tab${selected.id === recipe.id ? " selected" : ""}`}
            type="button"
            aria-pressed={selected.id === recipe.id}
            aria-controls="agent-setup-panel"
            onClick={() => setSelectedId(recipe.id)}
          >
            {recipe.name}
          </button>
        ))}
      </div>
      <div key={selected.id} className="station-config" id="agent-setup-panel" role="region" aria-label={`${selected.name} setup`} aria-live="polite">
        <p>Put this entry in <code>{selected.configPath}</code> and replace the example path with your checkout path.</p>
        <CodeBlock label={selected.configPath} value={selected.config} />
        <p className="station-finish-note">Reload your agent. Save the reviewed skill to <code>{selected.skillPath}</code>, using its frontmatter name as the folder name.</p>
      </div>
    </div>
  );
}
