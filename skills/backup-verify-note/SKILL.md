---
name: backup-verify-note
description: >
  Note whether backups ran from provided logs. Use when the user asks about backup verify, backup job.
when-to-use: backup verify, backup job
metadata:
  author: grok-skills
  short-description: Note whether backups ran from provided logs
  runtime: grok-bot
  connectors: [browser]
  computer-use: true
  approvals: [vendor-change, purchase]
  category: ops
---

## When to use

Use for: Note whether backups ran from provided logs.
Trigger phrases: backup verify, backup job.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Parse logs.
2. Do not restore until approved.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: vendor-change, purchase.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
