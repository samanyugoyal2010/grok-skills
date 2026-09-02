---
name: app-store-review-themes
description: >
  Theme app-store or G2 reviews. Use when the user asks about app reviews, g2 themes.
when-to-use: app reviews, g2 themes
metadata:
  author: grok-skills
  short-description: Theme app-store or G2 reviews
  runtime: grok-bot
  connectors: [browser]
  computer-use: true
  approvals: [external-post]
  category: research
---

## When to use

Use for: Theme app-store or G2 reviews.
Trigger phrases: app reviews, g2 themes.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Cluster themes.
2. Do not reply to reviews.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: external-post.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
