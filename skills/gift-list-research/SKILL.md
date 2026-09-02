---
name: gift-list-research
description: >
  Research gift ideas with public prices. Use when the user asks about gift ideas, present research.
when-to-use: gift ideas, present research
metadata:
  author: grok-skills
  short-description: Research gift ideas with public prices
  runtime: grok-bot
  connectors: [browser]
  computer-use: false
  approvals: [external-send]
  category: personal
---

## When to use

Use for: Research gift ideas with public prices.
Trigger phrases: gift ideas, present research.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Public pages.
2. Do not purchase.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: external-send.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
