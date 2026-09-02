---
name: pr-review-pack
description: >
  Build a structured PR review pack. Use when the user asks about pr review, review this pull request.
when-to-use: pr review, review this pull request
metadata:
  author: grok-skills
  short-description: Build a structured PR review pack
  runtime: grok-bot
  connectors: [github]
  computer-use: false
  approvals: [merge-pr, production-change]
  category: eng
---

## When to use

Use for: Build a structured PR review pack.
Trigger phrases: pr review, review this pull request.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to github (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Read the diff.
2. List risks, tests, and questions.
3. Do not merge.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: merge-pr, production-change.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
