---
name: privacy-request-pack
description: >
  Pack a privacy-request (DSAR) for review. Use when the user asks about dsar, privacy request, gdpr request.
when-to-use: dsar, privacy request, gdpr request
metadata:
  author: grok-skills
  short-description: Pack a privacy-request (DSAR) for review
  runtime: grok-bot
  connectors: [drive]
  computer-use: false
  approvals: [legal-send, sign-document]
  category: legal
---

## When to use

Use for: Pack a privacy-request (DSAR) for review.
Trigger phrases: dsar, privacy request, gdpr request.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to drive (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. List systems to search.
2. Do not email personal data.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: legal-send, sign-document.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
