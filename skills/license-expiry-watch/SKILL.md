---
name: license-expiry-watch
description: >
  Watch software license expiry dates. Use when the user asks about license expiry, seat renewal.
when-to-use: license expiry, seat renewal
metadata:
  author: grok-skills
  short-description: Watch software license expiry dates
  runtime: grok-bot
  connectors: [browser]
  computer-use: true
  approvals: [vendor-change, purchase]
  category: ops
---

## When to use

Use for: Watch software license expiry dates.
Trigger phrases: license expiry, seat renewal.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. List dates.
2. Do not auto-buy seats.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: vendor-change, purchase.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
