---
name: attachment-intake
description: >
  Index email attachments into a review list. Use when the user asks about email attachments, intake invoices from mail.
when-to-use: email attachments, intake invoices from mail
metadata:
  author: grok-skills
  short-description: Index email attachments into a review list
  runtime: grok-bot
  connectors: [gmail]
  computer-use: false
  approvals: [send-email, archive]
  category: inbox
---

## When to use

Use for: Index email attachments into a review list.
Trigger phrases: email attachments, intake invoices from mail.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to gmail (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Collect attachments in the window.
2. Extract vendor/date/amount when possible.
3. Do not file them into finance systems until approved.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: send-email, archive.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
