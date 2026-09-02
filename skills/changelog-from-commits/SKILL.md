---
name: changelog-from-commits
description: >
  Draft a changelog from git log. Use when the user asks about changelog, commits since tag.
when-to-use: changelog, commits since tag
metadata:
  author: grok-skills
  short-description: Draft a changelog from git log
  runtime: grok-bot
  connectors: [github]
  computer-use: false
  approvals: [merge-pr, production-change]
  category: eng
---

## When to use

Use for: Draft a changelog from git log.
Trigger phrases: changelog, commits since tag.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to github (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Group commits.
2. Do not tag a release.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: merge-pr, production-change.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
