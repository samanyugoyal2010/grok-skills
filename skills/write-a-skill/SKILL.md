---
name: write-a-skill
description: >
  Draft a new Grok Bot SKILL.md that passes grok-skills check. Use when the user asks about create a skill, write SKILL.md, save this as a skill, author a skill.
when-to-use: create a skill, write SKILL.md, save this as a skill, author a skill
metadata:
  author: grok-skills
  short-description: Draft a new Grok Bot SKILL.md that passes grok-skills check
  runtime: grok-bot
  connectors: []
  computer-use: false
  approvals: [install-skill]
  category: meta
---

## When to use

Use for: Draft a new Grok Bot SKILL.md that passes grok-skills check.
Trigger phrases: create a skill, write SKILL.md, save this as a skill, author a skill.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- The user's current conversation, files, and any URLs they provide
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Capture when-to-use, inputs, sequence, validation, return value, and approvals.
2. Write SKILL.md and run grok-skills check.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: install-skill.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
