---
name: contact-map
description: >
  Map buying-committee contacts on an account. Use when the user asks about org chart, buying committee, contact map.
when-to-use: org chart, buying committee, contact map
metadata:
  author: grok-skills
  short-description: Map buying-committee contacts on an account
  runtime: grok-bot
  connectors: [salesforce]
  computer-use: false
  approvals: [customer-contact, send-email]
  category: crm
---

## When to use

Use for: Map buying-committee contacts on an account.
Trigger phrases: org chart, buying committee, contact map.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to salesforce (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. List contacts and roles.
2. Do not add contacts until approved.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: customer-contact, send-email.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
