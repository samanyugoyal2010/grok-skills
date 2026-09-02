---
name: meeting-recap
description: >
  Write a meeting recap with owners and dates. Use when the user asks about meeting recap, send notes.
when-to-use: meeting recap, send notes
metadata:
  author: grok-skills
  short-description: Write a meeting recap with owners and dates
  runtime: grok-bot
  connectors: [drive]
  computer-use: false
  approvals: [publish, email-broadcast]
  category: docs
---

## When to use

Use for: Write a meeting recap with owners and dates.
Trigger phrases: meeting recap, send notes.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to drive (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Write the recap.
2. Do not email the list until approved.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: publish, email-broadcast.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
