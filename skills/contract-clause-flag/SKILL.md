---
name: contract-clause-flag
description: >
  Flag risky clauses in a contract for a lawyer. Use when the user asks about contract review flags, risky clause.
when-to-use: contract review flags, risky clause
metadata:
  author: grok-skills
  short-description: Flag risky clauses in a contract for a lawyer
  runtime: grok-bot
  connectors: [drive]
  computer-use: false
  approvals: [legal-send, sign-document]
  category: legal
---

## When to use

Use for: Flag risky clauses in a contract for a lawyer.
Trigger phrases: contract review flags, risky clause.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to drive (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. List clauses and why.
2. Not legal advice. Do not sign or send.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: legal-send, sign-document.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
