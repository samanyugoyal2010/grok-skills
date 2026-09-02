---
name: gsheet-reconcile
description: >
  Reconcile two sheets or tabs. Use when the user asks about reconcile sheets, spreadsheet match.
when-to-use: reconcile sheets, spreadsheet match
metadata:
  author: grok-skills
  short-description: Reconcile two sheets or tabs
  runtime: grok-bot
  connectors: [browser]
  computer-use: false
  approvals: [warehouse-write]
  category: data
---

## When to use

Use for: Reconcile two sheets or tabs.
Trigger phrases: reconcile sheets, spreadsheet match.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Diff keys.
2. Do not rewrite the sheet until approved.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: warehouse-write.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
