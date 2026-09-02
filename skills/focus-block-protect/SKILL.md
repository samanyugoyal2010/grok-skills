---
name: focus-block-protect
description: >
  Propose focus blocks around deep work. Use when the user asks about focus time, protect calendar, maker schedule.
when-to-use: focus time, protect calendar, maker schedule
metadata:
  author: grok-skills
  short-description: Propose focus blocks around deep work
  runtime: grok-bot
  connectors: [google-calendar]
  computer-use: false
  approvals: [create-event, send-invite]
  category: calendar
---

## When to use

Use for: Propose focus blocks around deep work.
Trigger phrases: focus time, protect calendar, maker schedule.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to google-calendar (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Find fragmentable days.
2. Propose focus blocks. Do not invite anyone.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: create-event, send-invite.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
