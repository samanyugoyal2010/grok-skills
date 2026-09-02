---
name: payroll-change-check
description: >
  Check a proposed payroll change for missing fields. Use when the user asks about payroll change, compensation change check.
when-to-use: payroll change, compensation change check
metadata:
  author: grok-skills
  short-description: Check a proposed payroll change for missing fields
  runtime: grok-bot
  connectors: [browser, drive]
  computer-use: true
  approvals: [submit-expense, purchase]
  category: finance
---

## When to use

Use for: Check a proposed payroll change for missing fields.
Trigger phrases: payroll change, compensation change check.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Access to drive (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Validate fields.
2. Do not submit payroll.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: submit-expense, purchase.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
