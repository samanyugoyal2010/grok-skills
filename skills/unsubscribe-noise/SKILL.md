---
name: unsubscribe-noise
description: >
  Propose newsletters to unsubscribe. Use when the user asks about unsubscribe, newsletter cleanup, email noise.
when-to-use: unsubscribe, newsletter cleanup, email noise
metadata:
  author: grok-skills
  short-description: Propose newsletters to unsubscribe
  runtime: grok-bot
  connectors: [gmail]
  computer-use: false
  approvals: [send-email, archive]
  category: inbox
---

## When to use

Use for: Propose newsletters to unsubscribe.
Trigger phrases: unsubscribe, newsletter cleanup, email noise.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to gmail (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Cluster bulk senders.
2. Propose unsubscribes. Do not click unsubscribe until approved.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: send-email, archive.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
