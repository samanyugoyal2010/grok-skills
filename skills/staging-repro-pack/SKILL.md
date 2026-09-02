---
name: staging-repro-pack
description: >
  Reproduce a bug in staging and return a repro pack. Use when the user asks about reproduce bug, staging repro, ticket repro.
when-to-use: reproduce bug, staging repro, ticket repro
metadata:
  author: grok-skills
  short-description: Reproduce a bug in staging and return a repro pack
  runtime: grok-bot
  connectors: [browser]
  computer-use: true
  approvals: [customer-contact, production-access]
  category: support
---

## When to use

Use for: Reproduce a bug in staging and return a repro pack.
Trigger phrases: reproduce bug, staging repro, ticket repro.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Reproduce in staging only.
2. Capture steps and evidence.
3. Never use production customer data.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: customer-contact, production-access.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
