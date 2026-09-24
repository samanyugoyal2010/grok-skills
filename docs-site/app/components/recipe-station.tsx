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
      <div key={selected.id} className="station-worktop" id="agent-setup-panel" aria-label={`${selected.name} setup`}>
        <div className="station-instructions">
          <div className="station-step"><span className="station-number">1</span><div><h3>Connect SkillChef</h3><p>Put this server entry in <code>{selected.configPath}</code>, then replace the example path with your checkout path.</p></div></div>
          <CodeBlock label={selected.configPath} value={selected.config} />
          <p className="station-reload-note">Restart or reload your agent after changing its MCP configuration.</p>
          <div className="station-step station-step-last"><span className="station-number">2</span><div><h3>Save the finished skill</h3><p>Review the generated file, then save it at <code>{selected.skillPath}</code>. The folder name must match the front matter <code>name</code>.</p></div></div>
        </div>
        <aside className="station-slip">
          <span className="slip-label">One format</span>
          <h3>One portable skill format</h3>
          <p>SkillChef returns standard <code>SKILL.md</code> with a name and description. Each agent scans its own folders for that file.</p>
          <a href="https://agentskills.io/home" target="_blank" rel="noreferrer">Agent Skills format <span aria-hidden="true">↗</span></a>
        </aside>
      </div>
    </div>
  );
}
