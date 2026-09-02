---
name: cohort-note
description: >
  Write a cohort retention note. Use when the user asks about cohort retention, retention curve.
when-to-use: cohort retention, retention curve
metadata:
  author: grok-skills
  short-description: Write a cohort retention note
  runtime: grok-bot
  connectors: [browser]
  computer-use: false
  approvals: [warehouse-write]
  category: data
---

## When to use

Use for: Write a cohort retention note.
Trigger phrases: cohort retention, retention curve.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Build the cohort table if data allows.
2. Do not email customers.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: warehouse-write.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
