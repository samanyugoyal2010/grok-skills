---
name: weekly-account-health
description: >
  Score CRM accounts for churn and expansion risk and return a review list.
  Use when the user asks for weekly account health, customer-risk, or churn review.
when-to-use: weekly account health, churn risk, customer risk review
metadata:
  author: grok-skills
  short-description: Weekly CRM risk review
  runtime: grok-bot
  connectors: [salesforce]
  computer-use: false
  approvals: [customer-contact, send-email]
---

## When to use

Use for a recurring CRM health pass. Do not use for one-off account research that should stay in chat, or for sending outreach.

## Required inputs and access

- Read access to the named CRM view or account list
- Risk definitions (or use the defaults in this skill)
- Time window (default: last 7 days)

## Sequence of work

1. Pull the current account list from the source system. Skip anyone already in an active sequence.
2. Score each account against the risk definitions. Cite the source fields used.
3. Identify up to three relevant contacts per at-risk account. Do not message them.
4. Draft a review table: account, score, evidence, recommended next step.

## How to validate the result

Every row has a source record id. Scores are explained. No customer-facing text is sent.

## What to return

A review list in the conversation. Stop there.

## Approvals and safety

Customer contact, email, and sequence enrollment always require approval. If source data is missing, report the failure instead of using stale data.
