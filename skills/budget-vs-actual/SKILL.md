---
name: budget-vs-actual
description: >
  Compare budget vs actuals. Use when the user asks about budget vs actual, variance report.
when-to-use: budget vs actual, variance report
metadata:
  author: grok-skills
  short-description: Compare budget vs actuals
  runtime: grok-bot
  connectors: [browser, drive]
  computer-use: true
  approvals: [submit-expense, purchase]
  category: finance
---

## When to use

Use for: Compare budget vs actuals.
Trigger phrases: budget vs actual, variance report.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Access to drive (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Compute variances.
2. Do not change the budget.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: submit-expense, purchase.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
