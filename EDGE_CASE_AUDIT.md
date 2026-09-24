# SkillChef Edge-Case Audit and Fix Report

Date: 2026-09-22

Scope: MCP server, compiler, retrieval, provider adapters, HTTP transport, safety limits, generated Markdown, static docs server, and docs UI. Existing user worktree changes were preserved.

## Result

The audited edge cases were fixed and regression-tested. The implementation now has clearer retrieval provenance, safer credential scanning, scoped GitHub token use, Markdown-safe output, proxy-aware rate-limit configuration, exception-safe clipboard cleanup, and stdio error diagnostics.

## Verification

- Root `npm test`: **71/71 passing**.
- Root typecheck and production build: **passing**.
- Docs tests and typecheck: **passing**.
- Docs production build: **passing**.
- Root and docs `npm audit --omit=dev`: **0 vulnerabilities**.
- Fuzzed 100 combinations of empty, whitespace, punctuation, fenced-code, escaped, Unicode, newline, and long inputs: no compilation or Markdown-validation failures.
- Exercised HTTP auth, host/origin checks, body limits, CORS preflight, health checks, rate limits, chunked oversized bodies, and a real MCP HTTP client flow.
- Exercised stdio initialization, tool listing, valid calls, malformed tool arguments, timeouts, cancellation, cache limits, provider failures, Ollama, and response-size limits.

## Fixed findings

### Credential scanning checked only the first assignment

Root cause: `src/limits.ts` used one non-global regular-expression match, so a placeholder assignment could hide a later real assignment.

Fix: scan all credential assignments and reject any non-placeholder value.

Regression coverage: `test/safety.test.ts` covers `API_KEY=example123 password=realsecret99` and equivalent token/password combinations.

### GitHub tokens were sent to raw content URLs

Root cause: retrieval passed the same extra headers to GitHub API and `raw.githubusercontent.com` requests.

Fix: `src/retrieval.ts` now attaches the optional token only to `api.github.com` requests. Raw source requests receive no authorization header.

Regression coverage: `test/retrieval.test.ts` asserts both header behaviors.

### Retrieval failures looked like genuine no-match results

Root cause: retrieval intentionally swallowed upstream failures but returned no status, so the compiler could not distinguish “no sources” from a failed or partial search.

Fix: `GitHubSkillRetriever` now reports `complete`, `partial`, or `failed` status through `src/types.ts`, `src/retrieval.ts`, and `src/server.ts`. `src/compiler.ts` reports that status without exposing upstream error details.

Regression coverage: retrieval and compiler tests cover partial, failed, and genuine empty searches.

### Blocked sources were counted as adapted sources

Root cause: the deterministic fallback and summary used all retrieved sources even when secret-like source content was withheld from model synthesis.

Fix: the fallback receives only safe sources, and the summary counts only safe sources as adapted while separately reporting withheld sources.

Regression coverage: `test/compiler.test.ts` verifies blocked-only sources are not claimed as adapted.

### Generated Markdown allowed metadata control characters

Root cause: task text, paths, reasons, source labels, URLs, and hashes were interpolated without consistent escaping or line normalization.

Fix: `src/markdown.ts` now provides single-line and Markdown escaping helpers. `src/compiler.ts` applies them to generated metadata and converts non-HTTP(S) source URLs into inert `#` destinations.

Regression coverage: `test/compiler.test.ts` covers heading/list injection, backticks, and non-web URLs.

### Rate limiting collapsed clients behind a reverse proxy

Root cause: the limiter always used the socket’s remote address, which is commonly the proxy address in a proxied deployment.

Fix: `src/http.ts` accepts an explicit `clientKey` function. `MCP_HTTP_CLIENT_ID_HEADER` wires a proxy-overwritten identity header into the runtime. It is opt-in and documented as unsafe for direct untrusted clients because headers can be spoofed.

Regression coverage: `test/http.test.ts` and `test/config.test.ts` cover the configured identity path.

### Clipboard fallback leaked temporary DOM nodes on exceptions

Root cause: temporary textareas were removed only after `execCommand("copy")` returned.

Fix: both `docs-site/app/components/setup-prompt.tsx` and `docs-site/app/components/code-block.tsx` remove the textarea in `finally`, including when selection or copy throws.

### Setup documentation was stale about Ollama

Fix: the current setup prompt explains that semantic synthesis can use either a cloud provider API or a local Ollama service with an installed model. The provider page, README, and environment example agree with the runtime behavior.

### Static-file symlink race was reduced

Fix: `docs-site/scripts/serve-static.mjs` resolves and reads the verified real path rather than reopening the original potentially symlinked path after containment validation.

### Stdio parse errors were not observable

Fix: `src/index.ts` now attaches the SDK’s stdio `onerror` callback and reports malformed frames and transport errors to stderr. The SDK still intentionally does not emit an in-band JSON-RPC response for an unparseable raw frame.

## Remaining concerns

- The SDK-defined behavior for raw malformed stdio frames is still “report/drop,” not an in-band error response.
- Clipboard cleanup has not been exercised in Safari/Firefox or with real browser automation; the cleanup path is now exception-safe by construction.
- A real Ollama process/model was not required for the provider adapter tests; malformed, oversized, missing-content, timeout, and network cases are covered with fixtures.
- `MCP_HTTP_CLIENT_ID_HEADER` must only be used when a trusted proxy overwrites the header. Direct clients can spoof it.
- The in-process limiter remains process-local; use a trusted edge limiter for multi-instance deployments.
- Risk and secret detection remain heuristic safeguards and require review before installing generated skills.

## Final status

**DONE_WITH_CONCERNS.** The identified implementation issues are fixed, the full automated validation is green, and the remaining items are external integration or deployment-policy concerns rather than unaddressed code paths.
