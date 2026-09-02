---
name: ticket-triage
description: >
  Triage support tickets by severity and type. Use when the user asks about ticket triage, support queue, zendesk triage.
when-to-use: ticket triage, support queue, zendesk triage
metadata:
  author: grok-skills
  short-description: Triage support tickets by severity and type
  runtime: grok-bot
  connectors: [browser]
  computer-use: true
  approvals: [customer-contact, production-access]
  category: support
---

## When to use

Use for: Triage support tickets by severity and type.
Trigger phrases: ticket triage, support queue, zendesk triage.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Label severity and product area.
2. Draft replies. Do not send.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: customer-contact, production-access.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
