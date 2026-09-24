# SkillChef

SkillChef turns a workflow your team repeats, the repository context you approve, and relevant public skill techniques into a portable `SKILL.md` recipe. It is intended for repeatable work—like reviewing migrations or shipping a UI change—not as a one-off task prompt.

## Run locally

Requires Node 20+.

```bash
npm install
npm test
npm run typecheck
npm run dev
```

The companion Next.js documentation site lives in [`docs-site`](docs-site/). It is a normal static-export Next.js app in this repository. Run it with `cd docs-site && npm run dev`; deployment notes are in [`DEPLOYMENT.md`](DEPLOYMENT.md).

For the end-to-end coding-agent workflow, provider-key handling, and what must be added before a shared hosted BYOK service is safe, see [`PRODUCTION.md`](PRODUCTION.md).

The default transport is stdio. Logs go to stderr so stdout remains available for MCP JSON-RPC.

## Connect SkillChef

SkillChef is an MCP server. It does not require a SkillChef account or OAuth. Semantic compilation uses a separate provider API key configured for the local MCP server process; it does not use or require a coding-agent subscription login. Connect it from your coding client with the local stdio config below, then choose where the generated skill should live.

Add the server to the project or user MCP configuration. Replace the path with this repository's absolute path:

```json
{
  "mcpServers": {
    "skillchef": {
      "command": "node",
      "args": ["/absolute/path/to/ai-b2b-saas/dist/index.js"]
    }
  }
}
```

Run `npm run build` before using this configuration. For local iteration, `npx tsx /absolute/path/to/ai-b2b-saas/src/index.ts` is also supported. Before calling `compile_skill`, the agent should show the user the files it plans to send and obtain approval. The server rejects sensitive paths and secret-like values, but that is a heuristic safeguard, not a security guarantee.

## Client recipes

The templates in [`examples/integrations`](examples/integrations) cover local MCP connections for:

- Claude Code: `.mcp.json` or `claude mcp add`
- Cursor: `.cursor/mcp.json`
- Codex CLI and IDE extension: `.codex/config.toml` or `codex mcp add`
- Windsurf: `mcp_config.json`
- VS Code and GitHub Copilot: `.vscode/mcp.json`, `.mcp.json`, or `~/.copilot/mcp-config.json`
- Gemini CLI: `.gemini/settings.json`
- Cline and Roo Code: their standard `mcpServers` JSON configuration

Each recipe starts the same local `dist/index.js` process. The MCP connection gives the client access to the compiler; it does not install the resulting skill. Save the returned `SKILL.md` under the folder your agent scans:

| Agent | Project skill folder |
| --- | --- |
| Claude Code | `.claude/skills/<skill-name>/SKILL.md` |
| Cursor | `.agents/skills/<skill-name>/SKILL.md` or `.cursor/skills/<skill-name>/SKILL.md` |
| Codex | `.agents/skills/<skill-name>/SKILL.md` |
| VS Code / GitHub Copilot | `.github/skills/<skill-name>/SKILL.md` or `.agents/skills/<skill-name>/SKILL.md` |
| Gemini CLI | `.gemini/skills/<skill-name>/SKILL.md` |

The generated file includes the `name` and `description` front matter required for skill discovery. Check the selected client’s current skill docs for other supported locations and workspace rules.

## HTTP mode

```bash
MCP_TRANSPORT=http npm run dev
```

The stateless MCP endpoint is exposed at `/mcp`; `GET /healthz` returns a small liveness response for process supervisors. V1 has no persistence; HTTP authentication is opt-in through `MCP_HTTP_AUTH_TOKEN`. Do not send private repository context until the model provider's retention and no-training behavior has been verified.

HTTP mode binds to `127.0.0.1` by default. Set `MCP_HTTP_AUTH_TOKEN` to require a bearer token, and set `MCP_HTTP_ALLOWED_ORIGINS` for browser clients. Requests with an `Origin` header are rejected unless that origin is explicitly listed; non-browser MCP clients can omit the header. If you bind with `MCP_HTTP_HOST=0.0.0.0` or another non-loopback host, both a bearer token and `MCP_HTTP_ALLOWED_HOSTS` are required at startup. List hostnames without ports.

HTTP requests are capped at 256,000 bytes by default. Set `MCP_HTTP_MAX_BODY_BYTES` to change the limit, and `MCP_HTTP_ALLOWED_HOSTS` to add hostnames for DNS-rebinding protection. Invalid ports, transports, and non-loopback hosts without a token fail during startup. Behind a trusted reverse proxy, set `MCP_HTTP_CLIENT_ID_HEADER` to a header the proxy overwrites so rate limiting distinguishes clients; never trust a client-supplied identity header directly.

## Model providers, including local Ollama

For semantic compilation, configure a provider in the environment of the local MCP server process. Cloud provider keys are never accepted by `compile_skill` or added to its prompt, and are not coding-agent subscription credentials; usage is billed under the selected provider account. Ollama runs locally and needs no API key.

```bash
export SKILL_COMPILER_PROVIDER=openai
export SKILL_COMPILER_MODEL=gpt-4.1-mini # optional; defaults vary by provider
npm run build
npm start
```

Inject `OPENAI_API_KEY` into the MCP process using your OS secret manager or MCP host. Do not paste an actual key into a shell command or commit it in an MCP configuration.

Set exactly one of `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENROUTER_API_KEY`, or `GROQ_API_KEY` to infer a cloud provider, or explicitly set `SKILL_COMPILER_PROVIDER` (`openai`, `anthropic`, `openrouter`, `groq`, or `ollama`) when selecting a provider. `SKILL_COMPILER_MODEL` overrides the provider's model default. Cloud defaults are `gpt-4.1-mini`, `claude-sonnet-5`, `openai/gpt-4.1-mini`, and `openai/gpt-oss-20b`.

For Ollama, install and start Ollama yourself, make sure the model is already installed, then configure:

```bash
export SKILL_COMPILER_PROVIDER=ollama
export SKILL_COMPILER_MODEL=qwen3:8b
# Optional; defaults to http://127.0.0.1:11434
export SKILL_COMPILER_OLLAMA_BASE_URL=http://127.0.0.1:11434
```

SkillChef does not download/pull Ollama models. The endpoint must be plain HTTP on `localhost`, `127.0.0.1`, or `[::1]`; credentials, paths, query strings, fragments, HTTPS, and remote hosts are rejected. Requests use Ollama's native `/api/chat` API with `stream: false`; no API key or authorization header is sent. Approved context is sent to the local Ollama process. `SKILL_COMPILER_MODEL_TIMEOUT_MS` controls request timeout for all providers. Use a local secret manager or your MCP host's process-environment injection; `.env.example` documents names only and is not loaded automatically. For a stdio MCP server started by an IDE, the child inherits the IDE process environment plus any variables the IDE's local MCP launcher injects. An `export` in a terminal affects only processes started from that shell; it will not update an already-running IDE. Configure secrets in an uncommitted local secret store/launcher and restart the MCP child (or IDE, if needed). Never put a real key in repository examples or `compile_skill` arguments.

Keys belong to the MCP server process, not the agent's Claude/Cursor/Codex subscription login. In shared HTTP mode, every caller currently uses the same server-configured provider key and billing identity. Treat that mode as single-tenant; do not expose it to multiple users until per-user credential isolation and authorization exist. The server sends approved context to the selected provider, so review that provider's current data-retention terms before using private repository content.

## Tool input

`compile_skill` accepts `task`, `search_query`, optional `project_brief`, and up to ten approved text files. It returns source provenance, a context manifest, transformation notes, risk notes, and `skillMarkdown`.
The generated `skillMarkdown` is capped at 16,000 characters; oversized model output falls back to the bounded deterministic compiler.

## Reproducible example

The request fixture at [`examples/compile-skill-request.json`](examples/compile-skill-request.json) is safe sample input for the `compile_skill` tool. Start the server, connect it from your coding client, and pass the fixture fields as tool arguments. Review the returned `skillMarkdown` and source notes before saving it in your agent’s skill folder.

## Limitations

- Without a provider or `SKILL_COMPILER_MODEL_URL`, SkillChef uses a deterministic local compiler. It selects task-matched lines from retrieved public sources and combines them with the request context; it does not semantically synthesize new guidance.
- OpenAI, Anthropic, OpenRouter, and Groq use their native HTTPS APIs. Ollama uses its local native chat API. A custom `SKILL_COMPILER_MODEL_URL` remains available for a compatible JSON endpoint that receives `{ system, user }` and returns `{ skillMarkdown }`; it cannot be combined with provider selection or provider API keys. Custom endpoints must use HTTPS outside loopback development. Set `SKILL_COMPILER_ALLOW_INSECURE_HTTP=true` only for a controlled development network.
- Public skill retrieval uses GitHub's repository tree API as one adapter for public `SKILL.md` repositories. The default corpus is `vercel-labs/agent-skills` plus `anthropics/skills`; configure `PUBLIC_SKILL_REPOSITORIES` to replace that list, or set it empty to disable retrieval. It may return no sources if GitHub is unavailable or a repository has no `SKILL.md` files.
- Set `PUBLIC_SKILL_GITHUB_TOKEN` in the runtime environment when the anonymous GitHub API limit is too low. The token is sent only to GitHub's API host as an Authorization header and is never sent to raw content URLs or included in source URLs or responses.
- Retrieval requests time out after `PUBLIC_SKILL_FETCH_TIMEOUT_MS` (10 seconds by default), model responses are capped before parsing, and public tree/source responses are cached in memory for up to five minutes within a process.
- Retrieval is bounded to eight configured repositories and five selected sources, with a 60-second end-to-end deadline and two in-flight compilations by default.
- HTTP rate limiting is keyed by the connecting client address and returns `429` with `Retry-After`; stdio uses one local process bucket. The in-memory limiter prunes expired buckets and caps retained client keys with `RATE_LIMIT_MAX_KEYS` (10,000 by default). Behind a trusted reverse proxy, `MCP_HTTP_CLIENT_ID_HEADER` can select a proxy-overwritten client identity header; use a trusted edge limiter for multi-instance deployments.
- Risk detection is heuristic and advisory. Review generated skills before installing them.
