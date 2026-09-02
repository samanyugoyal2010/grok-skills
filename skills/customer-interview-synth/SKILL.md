---
name: customer-interview-synth
description: >
  Synthesize customer interview notes. Use when the user asks about interview synthesis, qualitative research.
when-to-use: interview synthesis, qualitative research
metadata:
  author: grok-skills
  short-description: Synthesize customer interview notes
  runtime: grok-bot
  connectors: [browser]
  computer-use: true
  approvals: [external-post]
  category: research
---

## When to use

Use for: Synthesize customer interview notes.
Trigger phrases: interview synthesis, qualitative research.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to browser (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Cluster pains and quotes.
2. Do not email interviewees.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: external-post.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is allowed for listed sites; stay on the user's account and listed tools.
