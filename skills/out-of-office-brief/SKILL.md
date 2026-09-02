---
name: out-of-office-brief
description: >
  Brief the user after time away. Use when the user asks about ooo brief, back from vacation inbox.
when-to-use: ooo brief, back from vacation inbox
metadata:
  author: grok-skills
  short-description: Brief the user after time away
  runtime: grok-bot
  connectors: [gmail]
  computer-use: false
  approvals: [send-email, archive]
  category: inbox
---

## When to use

Use for: Brief the user after time away.
Trigger phrases: ooo brief, back from vacation inbox.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to gmail (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Cover the away window.
2. Split urgent vs can-wait.
3. Draft replies for urgent only.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: send-email, archive.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
