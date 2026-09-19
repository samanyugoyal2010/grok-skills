# Brief-to-feature evaluation

This is the fixed v1 quality check described in the design record. It compares a generic skill with the artifact produced by the local deterministic compiler.

## Fixed task

Add a `/health` endpoint that returns `{status: "ok"}` and a `node:test` integration test. Keep the route in `src/http.ts` and do not expose environment values.

## Approved context

- `src/http.ts`: the existing Node HTTP boundary where the endpoint belongs.
- `test/http.test.ts`: the existing `node:test` coverage for the HTTP boundary.

The compiler request also included this project brief: “Node 20 TypeScript server. The entry point is `src/index.ts`. Tests use `node:test`. No web framework.”

## Artifacts

- [Generic baseline skill](original-skill.md)
- [Generated repo-aware skill](generated-skill.md)

The generated artifact was produced with no public source matches. It still names the approved files, preserves the task constraints, and adds a review/test loop.

Deterministic replay against the current repository passed input validation with the two approved files and reproduced the tracked artifact byte-for-byte: 1,665 characters, four required sections, zero public sources, and SHA-256 `95a76b858c3908ff8e2964fc80af3fdeb21174e303bab9c1ed70b8bcdad78ba8`. The only advisory risk was `network-access`, caused by URLs in the approved HTTP context.

## Live agent comparison

| Run | Wall time | Correction turns | Accuracy checklist | Status |
| --- | ---: | ---: | ---: | --- |
| Baseline agent with `original-skill.md` | — | — | — | Pending Claude Code re-authentication |
| Agent with `generated-skill.md` | — | — | — | Pending Claude Code re-authentication |

The local `claude` executable was available, but its OAuth session was expired and could not be refreshed. No live agent result or 20% improvement claim is recorded. Re-run both sessions after `claude auth login` and record:

1. wall time from first prompt to accepted diff;
2. correction turns, including agent self-corrections and user-requested fixes;
3. checklist results for route behavior, test coverage, scope, and secret exposure.

Continue the product experiment only if the generated-skill run reduces correction turns by at least 20% without lowering the checklist score.
