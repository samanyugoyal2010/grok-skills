---
name: referral-triage
description: >
  Triage employee referrals against open roles. Use when the user asks about referral triage, employee referral.
when-to-use: referral triage, employee referral
metadata:
  author: grok-skills
  short-description: Triage employee referrals against open roles
  runtime: grok-bot
  connectors: [browser]
  computer-use: false
  approvals: [offer-send, hr-system-write]
  category: people
---

## When to use

Use for: Triage employee referrals against open roles.
Trigger phrases: referral triage, employee referral.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Match to reqs.
2. Do not email referrers with a decision.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: offer-send, hr-system-write.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
