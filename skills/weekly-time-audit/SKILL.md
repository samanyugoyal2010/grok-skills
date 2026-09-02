---
name: weekly-time-audit
description: >
  Audit where time went last week. Use when the user asks about time audit, calendar audit, meeting load.
when-to-use: time audit, calendar audit, meeting load
metadata:
  author: grok-skills
  short-description: Audit where time went last week
  runtime: grok-bot
  connectors: [google-calendar]
  computer-use: false
  approvals: [create-event, send-invite]
  category: calendar
---

## When to use

Use for: Audit where time went last week.
Trigger phrases: time audit, calendar audit, meeting load.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to google-calendar (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Categorize events.
2. Return hours by category.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: create-event, send-invite.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
