# SkillChef edge-case fix session

The 2026-09-22 audit found and fixed credential-assignment scanning bypasses, GitHub token over-sharing to raw content URLs, missing retrieval status, blocked-source summary inaccuracies, Markdown metadata injection risks, proxy rate-limit identity handling, clipboard fallback cleanup, stale Ollama setup wording, static-file symlink reopening, and missing stdio error diagnostics.

Verification: root tests 71/71 passing, root typecheck/build passing, docs tests/typecheck/build passing, and both production dependency audits reporting zero vulnerabilities. Full details are in [`EDGE_CASE_AUDIT.md`](../EDGE_CASE_AUDIT.md).
