---
name: meeting-request-triage
description: >
  Triage meeting-request emails. Use when the user asks about meeting request email, calendar invite from mail.
when-to-use: meeting request email, calendar invite from mail
metadata:
  author: grok-skills
  short-description: Triage meeting-request emails
  runtime: grok-bot
  connectors: [gmail]
  computer-use: false
  approvals: [send-email, archive]
  category: inbox
---

## When to use

Use for: Triage meeting-request emails.
Trigger phrases: meeting request email, calendar invite from mail.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to gmail (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Parse time, attendees, purpose.
2. Propose accept/decline. Do not respond until approved.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: send-email, archive.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
