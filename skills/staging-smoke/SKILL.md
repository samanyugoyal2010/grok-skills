---
name: staging-smoke
description: >
  Run a staging smoke checklist. Use when the user asks about staging smoke, sanity check staging.
when-to-use: staging smoke, sanity check staging
metadata:
  author: grok-skills
  short-description: Run a staging smoke checklist
  runtime: grok-bot
  connectors: [github]
  computer-use: false
  approvals: [merge-pr, production-change]
  category: eng
---

## When to use

Use for: Run a staging smoke checklist.
Trigger phrases: staging smoke, sanity check staging.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to github (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Hit listed checks.
2. Do not test in production.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: merge-pr, production-change.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
