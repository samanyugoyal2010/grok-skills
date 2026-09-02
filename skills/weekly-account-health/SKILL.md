---
name: weekly-account-health
description: >
  Score CRM accounts for churn and expansion risk and return a review list.
  Use for weekly account health, customer-risk, or churn review. Never contact
  customers from this skill.
when-to-use: weekly account health, churn risk, customer risk review
metadata:
  author: grok-skills
  short-description: Weekly CRM risk review
  runtime: grok-bot
  connectors: [salesforce]
  computer-use: false
  approvals: [customer-contact, send-email]
  category: crm
---

## When to use

Recurring CRM health. Not for one-off account research (use account-research) and not for outbound (use outbound-drafts).

## Required inputs and access

- Salesforce (or named CRM) **read** on a list view or report they name
- Risk rules, or use: no activity 14d = medium, open sev ticket = high, renewal < 60d with usage down = high
- Time window default 7 days

## Sequence of work

1. Pull Account Id, Name, Owner, ARR if present, last activity, open cases, next close date.
2. Score each account with the rule that fired. Skip anyone they mark as in an active sequence.
3. Up to three contacts per at-risk account from CRM only. Do not email or LinkedIn them.
4. Table: account, id, score, evidence, recommended next step (human).

## How to validate the result

Every row has an Account Id. Scores cite fields. No CRM writes. No customer contact.

## What to return

Review list only. Stop.

## Approvals and safety

Customer contact, email, and sequence enrollment always need approval. Missing CRM: stop, do not reuse last week’s extract.
