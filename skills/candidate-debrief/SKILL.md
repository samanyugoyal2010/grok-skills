---
name: candidate-debrief
description: >
  Structure interviewer debriefs into one view. Use when the user asks about debrief, interview feedback synthesis.
when-to-use: debrief, interview feedback synthesis
metadata:
  author: grok-skills
  short-description: Structure interviewer debriefs into one view
  runtime: grok-bot
  connectors: [browser]
  computer-use: false
  approvals: [offer-send, hr-system-write]
  category: people
---

## When to use

Use for: Structure interviewer debriefs into one view.
Trigger phrases: debrief, interview feedback synthesis.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Cluster signal.
2. Do not reject/advance in the ATS until approved.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: offer-send, hr-system-write.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
