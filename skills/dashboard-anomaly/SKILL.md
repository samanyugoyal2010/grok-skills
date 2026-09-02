---
name: dashboard-anomaly
description: >
  Explain a dashboard anomaly. Use when the user asks about dashboard anomaly, metric spike.
when-to-use: dashboard anomaly, metric spike
metadata:
  author: grok-skills
  short-description: Explain a dashboard anomaly
  runtime: grok-bot
  connectors: [browser]
  computer-use: false
  approvals: [warehouse-write]
  category: data
---

## When to use

Use for: Explain a dashboard anomaly.
Trigger phrases: dashboard anomaly, metric spike.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Compare to baseline.
2. Do not change the dashboard.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: warehouse-write.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
