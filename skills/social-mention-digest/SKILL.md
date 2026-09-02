---
name: social-mention-digest
description: >
  Digest public social mentions. Use when the user asks about social mentions, brand mentions.
when-to-use: social mentions, brand mentions
metadata:
  author: grok-skills
  short-description: Digest public social mentions
  runtime: grok-bot
  connectors: [browser]
  computer-use: true
  approvals: [external-post]
  category: research
---

## When to use

Use for: Digest public social mentions.
Trigger phrases: social mentions, brand mentions.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Public posts only.
2. Do not reply.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: external-post.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
