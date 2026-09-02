---
name: saas-settings-audit
description: >
  Audit SaaS settings vs a checklist. Use when the user asks about saas settings, admin settings audit.
when-to-use: saas settings, admin settings audit
metadata:
  author: grok-skills
  short-description: Audit SaaS settings vs a checklist
  runtime: grok-bot
  connectors: [browser]
  computer-use: true
  approvals: [saas-write, send-message]
  category: saas
---

## When to use

Use for: Audit SaaS settings vs a checklist.
Trigger phrases: saas settings, admin settings audit.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Read settings.
2. Do not change them until approved.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: saas-write, send-message.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
