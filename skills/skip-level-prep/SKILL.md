---
name: skip-level-prep
description: >
  Prep skip-level 1:1 notes. Use when the user asks about skip level, 1:1 prep.
when-to-use: skip level, 1:1 prep
metadata:
  author: grok-skills
  short-description: Prep skip-level 1:1 notes
  runtime: grok-bot
  connectors: [browser]
  computer-use: false
  approvals: [offer-send, hr-system-write]
  category: people
---

## When to use

Use for: Prep skip-level 1:1 notes.
Trigger phrases: skip level, 1:1 prep.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Pull recent themes.
2. Do not message the skip's reports.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: offer-send, hr-system-write.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
