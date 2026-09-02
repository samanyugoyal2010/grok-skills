---
name: onboarding-checklist
description: >
  Build a role-specific onboarding checklist. Use when the user asks about onboarding plan, new hire checklist.
when-to-use: onboarding plan, new hire checklist
metadata:
  author: grok-skills
  short-description: Build a role-specific onboarding checklist
  runtime: grok-bot
  connectors: [browser]
  computer-use: false
  approvals: [offer-send, hr-system-write]
  category: people
---

## When to use

Use for: Build a role-specific onboarding checklist.
Trigger phrases: onboarding plan, new hire checklist.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. List access, people, and 30/60/90.
2. Do not provision accounts.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: offer-send, hr-system-write.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
