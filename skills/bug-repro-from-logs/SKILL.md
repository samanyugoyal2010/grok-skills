---
name: bug-repro-from-logs
description: >
  Turn logs plus a ticket into a repro hypothesis. Use when the user asks about logs repro, stacktrace ticket.
when-to-use: logs repro, stacktrace ticket
metadata:
  author: grok-skills
  short-description: Turn logs plus a ticket into a repro hypothesis
  runtime: grok-bot
  connectors: [browser]
  computer-use: true
  approvals: [customer-contact, production-access]
  category: support
---

## When to use

Use for: Turn logs plus a ticket into a repro hypothesis.
Trigger phrases: logs repro, stacktrace ticket.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Extract errors.
2. Propose staging steps.
3. Do not hit production.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: customer-contact, production-access.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
