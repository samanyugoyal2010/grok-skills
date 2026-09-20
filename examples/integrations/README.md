# MCP client recipes

Build the server first:

```bash
npm ci
npm run build
```

Replace `/absolute/path/to/ai-b2b-saas` in each file with the absolute path to this checkout. These recipes start the local stdio server. Task-Time does not require a client login, product account, or OAuth flow.

## Recipes

| Client | Project or user configuration | Example |
| --- | --- | --- |
| Claude Code | `.mcp.json` or `claude mcp add` | [`claude-code.mcp.json`](../claude-code.mcp.json) |
| Cursor | `.cursor/mcp.json` | [`cursor.mcp.json`](cursor.mcp.json) |
| Codex CLI and IDE extension | `.codex/config.toml` or `codex mcp add` | [`codex.config.toml`](codex.config.toml) |
| Windsurf | `mcp_config.json` | [`windsurf.mcp_config.json`](windsurf.mcp_config.json) |
| VS Code | `.vscode/mcp.json` | [`vscode.mcp.json`](vscode.mcp.json) |
| GitHub Copilot CLI | `.mcp.json` or `~/.copilot/mcp-config.json` | [`copilot.mcp.json`](copilot.mcp.json) |
| Gemini CLI | `.gemini/settings.json` | [`gemini.settings.json`](gemini.settings.json) |

Cline and Roo Code use the same `mcpServers` JSON shape as the Claude Code and Cursor examples. Their UI can write the same server entry to the client-managed configuration file.

## CLI shortcuts

```bash
# Claude Code, project scope
claude mcp add --scope project task-time-skill-compiler -- \
  node /absolute/path/to/ai-b2b-saas/dist/index.js

# Codex
codex mcp add task-time-skill-compiler -- \
  node /absolute/path/to/ai-b2b-saas/dist/index.js

# Gemini CLI, project scope
gemini mcp add --scope project task-time-skill-compiler \
  node /absolute/path/to/ai-b2b-saas/dist/index.js

# GitHub Copilot CLI
copilot mcp add task-time-skill-compiler -- \
  node /absolute/path/to/ai-b2b-saas/dist/index.js
```

For remote use, run the server with `MCP_TRANSPORT=http` and configure the client with `https://your-host.example.com/mcp`. Set the bearer token in the client’s HTTP header configuration and keep `MCP_HTTP_ALLOWED_ORIGINS` and `MCP_HTTP_ALLOWED_HOSTS` restricted.

Official configuration references:

- [Claude Code MCP](https://docs.anthropic.com/en/docs/claude-code/mcp)
- [Cursor MCP](https://docs.cursor.com/context/model-context-protocol)
- [Codex MCP](https://learn.chatgpt.com/docs/extend/mcp)
- [Windsurf MCP](https://docs.windsurf.com/windsurf/cascade/mcp)
- [VS Code MCP](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
- [GitHub Copilot CLI MCP](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers)
- [Gemini CLI MCP](https://geminicli.com/docs/tools/mcp-server/)
