---
name: qbr-brief
description: >
  Assemble a QBR brief from CRM and docs. Use when the user asks about qbr brief, quarterly business review.
when-to-use: qbr brief, quarterly business review
metadata:
  author: grok-skills
  short-description: Assemble a QBR brief from CRM and docs
  runtime: grok-bot
  connectors: [salesforce]
  computer-use: false
  approvals: [customer-contact, send-email]
  category: crm
---

## When to use

Use for: Assemble a QBR brief from CRM and docs.
Trigger phrases: qbr brief, quarterly business review.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to salesforce (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Pull usage, tickets, pipeline.
2. Draft the brief. Do not send to the customer.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: customer-contact, send-email.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
