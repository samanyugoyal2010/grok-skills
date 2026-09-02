---
name: draft-replies
description: >
  Draft replies in the user's voice. Use when the user asks about draft replies, answer this email, write a response.
when-to-use: draft replies, answer this email, write a response
metadata:
  author: grok-skills
  short-description: Draft replies in the user's voice
  runtime: grok-bot
  connectors: [gmail]
  computer-use: false
  approvals: [send-email, archive]
  category: inbox
---

## When to use

Use for: Draft replies in the user's voice.
Trigger phrases: draft replies, answer this email, write a response.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to gmail (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Read the thread.
2. Draft a reply. Do not send.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: send-email, archive.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
