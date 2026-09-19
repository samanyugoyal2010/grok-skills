# Deployment

Task-Time has two separately deployable pieces:

- The MCP server runs as a Node.js process over stdio or stateless HTTP.
- The documentation site is a static Next.js export in `docs-site/out`.

## MCP server

Build and run the compiled server:

```bash
npm ci
npm run build
npm start
```

For local Claude Code use, keep the default stdio transport. For a process that needs HTTP, bind the server explicitly:

```bash
MCP_TRANSPORT=http \
MCP_HTTP_HOST=127.0.0.1 \
MCP_HTTP_AUTH_TOKEN='replace-with-a-random-token' \
npm start
```

The MCP endpoint is `/mcp`. A non-loopback bind requires `MCP_HTTP_AUTH_TOKEN`; do not expose the server publicly without a token and an appropriate `MCP_HTTP_ALLOWED_ORIGINS` value. Requests are capped at 256,000 bytes by default. Set `MCP_HTTP_ALLOWED_HOSTS` when a proxy or custom hostname is part of the deployment.

The server is stateless in v1. Keep it behind a process supervisor or platform service that provides restart behavior, logs, and secret storage. Do not put tokens in the repository or in a client-side bundle. Point Claude Code at `dist/index.js` after the build; use `tsx src/index.ts` only for local iteration.

For private-only testing, set `PUBLIC_SKILL_REPOSITORIES=`. The compiler then skips public retrieval and produces the deterministic local artifact from the approved request context.

For a public retrieval deployment, set `PUBLIC_SKILL_GITHUB_TOKEN` through the platform's secret manager when anonymous GitHub API limits are insufficient. Do not commit it or pass it to the docs site.

## Documentation site

Build the site from its own package directory:

```bash
cd docs-site
npm ci
npm run build
npm start
```

`next.config.ts` uses `output: "export"`, so the deployable artifact is `docs-site/out`. It can be served by any static host. A normal Next.js-compatible host can also build from `docs-site` with `npm ci` and `npm run build`; no external site wrapper is required.

Set `NEXT_PUBLIC_SITE_URL` at build time when the deployed site needs canonical and Open Graph URLs. Leave it unset for local development.

## Private repository context

The server only accepts context included in the `approved_context` request, but validation is a heuristic safeguard. Before testing with private code, verify the model provider's retention and no-training terms. If those terms cannot be verified, run the deterministic compiler without `SKILL_COMPILER_MODEL_URL` and keep inputs public.

## Release checks

Run the same checks used by CI before publishing either artifact:

```bash
npm run typecheck
npm test
npm run build

cd docs-site
npm run typecheck
npm run build
npm audit --omit=dev
```
