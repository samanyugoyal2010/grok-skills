---
name: offer-comp-note
description: >
  Draft an offer compensation note. Use when the user asks about offer letter notes, comp note.
when-to-use: offer letter notes, comp note
metadata:
  author: grok-skills
  short-description: Draft an offer compensation note
  runtime: grok-bot
  connectors: [browser]
  computer-use: false
  approvals: [offer-send, hr-system-write]
  category: people
---

## When to use

Use for: Draft an offer compensation note.
Trigger phrases: offer letter notes, comp note.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Use bands if provided.
2. Do not send an offer.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: offer-send, hr-system-write.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
