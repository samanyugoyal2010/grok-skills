---
name: travel-day-plan
description: >
  Build a travel-day calendar plan. Use when the user asks about travel day, airport calendar, trip day plan.
when-to-use: travel day, airport calendar, trip day plan
metadata:
  author: grok-skills
  short-description: Build a travel-day calendar plan
  runtime: grok-bot
  connectors: [google-calendar]
  computer-use: false
  approvals: [create-event, send-invite]
  category: calendar
---

## When to use

Use for: Build a travel-day calendar plan.
Trigger phrases: travel day, airport calendar, trip day plan.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to google-calendar (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Stack flights, buffers, and meetings.
2. Propose events. Do not book travel.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: create-event, send-invite.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
