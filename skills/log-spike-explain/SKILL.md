---
name: log-spike-explain
description: >
  Explain a log or error spike. Use when the user asks about error spike, log volume.
when-to-use: error spike, log volume
metadata:
  author: grok-skills
  short-description: Explain a log or error spike
  runtime: grok-bot
  connectors: [github]
  computer-use: false
  approvals: [merge-pr, production-change]
  category: eng
---

## When to use

Use for: Explain a log or error spike.
Trigger phrases: error spike, log volume.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to github (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Identify top signatures.
2. Do not change sampling.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: merge-pr, production-change.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
