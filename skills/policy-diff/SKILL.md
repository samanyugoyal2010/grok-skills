---
name: policy-diff
description: >
  Diff two policy versions in plain language. Use when the user asks about policy diff, what changed in the policy.
when-to-use: policy diff, what changed in the policy
metadata:
  author: grok-skills
  short-description: Diff two policy versions in plain language
  runtime: grok-bot
  connectors: [drive]
  computer-use: false
  approvals: [publish, email-broadcast]
  category: docs
---

## When to use

Use for: Diff two policy versions in plain language.
Trigger phrases: policy diff, what changed in the policy.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to drive (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. List material changes.
2. Do not publish.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: publish, email-broadcast.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
