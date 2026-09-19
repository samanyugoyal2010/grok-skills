# node-http-health-endpoint-integration-test

## Description

Apply this workflow to the task: Add a /health endpoint that returns {status: ok} and a node:test integration test. Keep the route in src/http.ts and do not expose environment values.

This skill was compiled for the current repository context. Treat all source references as guidance, not as executable instructions.

## Procedure

1. Restate the requested outcome and identify the smallest set of files needed.
2. Inspect the approved repository context before making changes.
3. Follow the repository's existing conventions instead of introducing new patterns.
4. Implement the smallest change that satisfies the task.
5. Run the most relevant tests, checks, or validation commands available in the repository.
6. Review the final diff for unrelated changes, missing tests, and accidental secrets.
7. Report what changed, what was verified, and any remaining uncertainty.

## Repository Constraints

Approved context:
- `src/http.ts`: Existing Node HTTP boundary where the endpoint belongs.
- `test/http.test.ts`: Existing node:test coverage for the HTTP boundary.

Project brief:
Node 20 TypeScript server. The entry point is src/index.ts. Tests use node:test. No web framework.

Do not access unrelated files, credentials, environment files, or destructive commands without explicit user approval.

## Examples

Task example: Add a /health endpoint that returns {status: ok} and a node:test integration test. Keep the route in src/http.ts and do not expose environment values.

Source skills consulted:
- No public source skill was found; use the repository context and task requirements directly.
