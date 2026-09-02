---
name: tax-doc-index
description: >
  Index tax documents in a folder. Use when the user asks about tax docs, w9 index.
when-to-use: tax docs, w9 index
metadata:
  author: grok-skills
  short-description: Index tax documents in a folder
  runtime: grok-bot
  connectors: [browser, drive]
  computer-use: true
  approvals: [submit-expense, purchase]
  category: finance
---

## When to use

Use for: Index tax documents in a folder.
Trigger phrases: tax docs, w9 index.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Access to drive (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. List files and types.
2. Do not file with an authority.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: submit-expense, purchase.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
