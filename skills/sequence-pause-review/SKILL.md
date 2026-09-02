---
name: sequence-pause-review
description: >
  Review who is in sequences and who should be paused. Use when the user asks about sequence pause, sales engagement review.
when-to-use: sequence pause, sales engagement review
metadata:
  author: grok-skills
  short-description: Review who is in sequences and who should be paused
  runtime: grok-bot
  connectors: [salesforce]
  computer-use: false
  approvals: [customer-contact, send-email]
  category: crm
---

## When to use

Use for: Review who is in sequences and who should be paused.
Trigger phrases: sequence pause, sales engagement review.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to salesforce (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. List active enrollments.
2. Propose pauses. Do not change sequences until approved.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: customer-contact, send-email.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
