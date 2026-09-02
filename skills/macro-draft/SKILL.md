---
name: macro-draft
description: >
  Draft a support macro from a good reply. Use when the user asks about support macro, canned response.
when-to-use: support macro, canned response
metadata:
  author: grok-skills
  short-description: Draft a support macro from a good reply
  runtime: grok-bot
  connectors: [browser]
  computer-use: true
  approvals: [customer-contact, production-access]
  category: support
---

## When to use

Use for: Draft a support macro from a good reply.
Trigger phrases: support macro, canned response.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Turn the reply into a reusable macro.
2. Do not publish the macro until approved.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: customer-contact, production-access.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
