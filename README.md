# Task-Time Agent Skill Compiler

An MCP server that turns public agent-skill guidance into a repo-aware `SKILL.md` using only context the user approved.

## Run locally

Requires Node 20+.

```bash
npm install
npm test
npm run typecheck
npm run dev
```

The companion Next.js documentation site lives in [`docs-site`](docs-site/). It is a normal static-export Next.js app in this repository. Run it with `cd docs-site && npm run dev`; deployment notes are in [`DEPLOYMENT.md`](DEPLOYMENT.md).

The default transport is stdio. Logs go to stderr so stdout remains available for MCP JSON-RPC.

## Claude Code setup

Add the server to the project or user MCP configuration. Replace the path with this repository's absolute path:

```json
{
  "mcpServers": {
    "task-time-skill-compiler": {
      "command": "node",
      "args": ["/absolute/path/to/ai-b2b-saas/dist/index.js"]
    }
  }
}
```

Run `npm run build` before using this configuration. For local iteration, `npx tsx /absolute/path/to/ai-b2b-saas/src/index.ts` is also supported. Before calling `compile_skill`, the agent should show the user the files it plans to send and obtain approval. The server rejects sensitive paths and secret-like values, but that is a heuristic safeguard, not a security guarantee.

## HTTP mode

```bash
MCP_TRANSPORT=http npm run dev
```

The stateless MCP endpoint is exposed at `/mcp`. V1 has no persistence; HTTP authentication is opt-in through `MCP_HTTP_AUTH_TOKEN`. Do not send private repository context until the model provider's retention and no-training behavior has been verified.

HTTP mode binds to `127.0.0.1` by default. Set `MCP_HTTP_AUTH_TOKEN` to require a bearer token, and set `MCP_HTTP_ALLOWED_ORIGINS` for browser clients. Requests with an `Origin` header are rejected unless that origin is explicitly listed; non-browser MCP clients can omit the header. If you bind with `MCP_HTTP_HOST=0.0.0.0` or another non-loopback host, both a bearer token and `MCP_HTTP_ALLOWED_HOSTS` are required at startup. List hostnames without ports.

HTTP requests are capped at 256,000 bytes by default. Set `MCP_HTTP_MAX_BODY_BYTES` to change the limit, and `MCP_HTTP_ALLOWED_HOSTS` to add hostnames for DNS-rebinding protection. Invalid ports, transports, and non-loopback hosts without a token fail during startup.

## Tool input

`compile_skill` accepts `task`, `search_query`, optional `project_brief`, and up to ten approved text files. It returns source provenance, a context manifest, transformation notes, risk notes, and `skillMarkdown`.

## Reproducible example

The request fixture at [`examples/compile-skill-request.json`](examples/compile-skill-request.json) is safe sample input for the `compile_skill` tool. Start the server, connect it from Claude Code, and pass the fixture fields as the tool arguments. The result is a JSON response whose `skillMarkdown` can be saved as a repository-local `SKILL.md` after review.

## Limitations

- The default compiler is deterministic and intended to make the flow runnable without a model credential.
- Set `SKILL_COMPILER_MODEL_URL` to use a compatible JSON model endpoint. The endpoint receives `{ system, user }` and should return `{ skillMarkdown }`.
- Public skill retrieval uses GitHub's repository tree API as one adapter for public `SKILL.md` repositories. The default corpus is `vercel-labs/agent-skills` plus `anthropics/skills`; configure `PUBLIC_SKILL_REPOSITORIES` to replace that list, or set it empty to disable retrieval. It may return no sources if GitHub is unavailable or a repository has no `SKILL.md` files.
- Set `PUBLIC_SKILL_GITHUB_TOKEN` in the runtime environment when the anonymous GitHub API limit is too low. The token is sent only as an Authorization header and is never included in source URLs or responses.
- Retrieval requests time out after `PUBLIC_SKILL_FETCH_TIMEOUT_MS` (10 seconds by default), and model responses are capped before parsing.
- Risk detection is heuristic and advisory. Review generated skills before installing them.
