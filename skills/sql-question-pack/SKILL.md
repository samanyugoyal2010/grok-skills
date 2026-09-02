---
name: sql-question-pack
description: >
  Turn a business question into SQL plus caveats. Use when the user asks about write sql, warehouse question.
when-to-use: write sql, warehouse question
metadata:
  author: grok-skills
  short-description: Turn a business question into SQL plus caveats
  runtime: grok-bot
  connectors: [browser]
  computer-use: false
  approvals: [warehouse-write]
  category: data
---

## When to use

Use for: Turn a business question into SQL plus caveats.
Trigger phrases: write sql, warehouse question.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Draft SQL.
2. Do not run unbounded queries if a dry-run exists.
3. Do not INSERT/UPDATE/DELETE.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: warehouse-write.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
