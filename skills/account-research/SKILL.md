---
name: account-research
description: >
  Research an account across web and CRM. Use when the user asks about account research, company brief before a call.
when-to-use: account research, company brief before a call
metadata:
  author: grok-skills
  short-description: Research an account across web and CRM
  runtime: grok-bot
  connectors: [salesforce]
  computer-use: false
  approvals: [customer-contact, send-email]
  category: crm
---

## When to use

Use for: Research an account across web and CRM.
Trigger phrases: account research, company brief before a call.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- Access to salesforce (read unless a later step says otherwise)
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Pull CRM + public web.
2. Return a brief. Do not contact anyone.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: customer-contact, send-email.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.
