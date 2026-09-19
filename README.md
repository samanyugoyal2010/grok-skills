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
      "command": "npx",
      "args": ["tsx", "/absolute/path/to/ai-b2b-saas/src/index.ts"]
    }
  }
}
```

Before calling `compile_skill`, the agent should show the user the files it plans to send and obtain approval. The server rejects sensitive paths and secret-like values, but that is a heuristic safeguard, not a security guarantee.

## HTTP mode

```bash
MCP_TRANSPORT=http npm run dev
```

The stateless MCP endpoint is exposed at `/mcp`. V1 has no persistence; HTTP authentication is opt-in through `MCP_HTTP_AUTH_TOKEN`. Do not send private repository context until the model provider's retention and no-training behavior has been verified.

HTTP mode binds to `127.0.0.1` by default. Set `MCP_HTTP_AUTH_TOKEN` to require a bearer token, and provide `MCP_HTTP_ALLOWED_ORIGINS` when browser-origin filtering is needed. If you bind with `MCP_HTTP_HOST=0.0.0.0` or another non-loopback host, a bearer token is required at startup.

## Tool input

`compile_skill` accepts `task`, `search_query`, optional `project_brief`, and up to ten approved text files. It returns source provenance, a context manifest, transformation notes, risk notes, and `skillMarkdown`.

## Reproducible example

The request fixture at [`examples/compile-skill-request.json`](examples/compile-skill-request.json) is safe sample input for the `compile_skill` tool. Start the server, connect it from Claude Code, and pass the fixture fields as the tool arguments. The result is a JSON response whose `skillMarkdown` can be saved as a repository-local `SKILL.md` after review.

## Limitations

- The default compiler is deterministic and intended to make the flow runnable without a model credential.
- Set `SKILL_COMPILER_MODEL_URL` to use a compatible JSON model endpoint. The endpoint receives `{ system, user }` and should return `{ skillMarkdown }`.
- Public skill retrieval uses GitHub's repository tree API as one adapter for public `SKILL.md` repositories. The default corpus is `vercel-labs/agent-skills` plus `anthropics/skills`; configure `PUBLIC_SKILL_REPOSITORIES` to add repositories. It may return no sources if GitHub is unavailable or a repository has no `SKILL.md` files.
- Retrieval requests time out after `PUBLIC_SKILL_FETCH_TIMEOUT_MS` (10 seconds by default), and model responses are capped before parsing.
- Risk detection is heuristic and advisory. Review generated skills before installing them.
