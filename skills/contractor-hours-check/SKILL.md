---
name: contractor-hours-check
description: >
  Check contractor hours against caps. Use when the user asks about contractor hours, vendor hours cap.
when-to-use: contractor hours, vendor hours cap
metadata:
  author: grok-skills
  short-description: Check contractor hours against caps
  runtime: grok-bot
  connectors: [browser]
  computer-use: true
  approvals: [vendor-change, purchase]
  category: ops
---

## When to use

Use for: Check contractor hours against caps.
Trigger phrases: contractor hours, vendor hours cap.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Compare to cap.
2. Do not approve invoices.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: vendor-change, purchase.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
