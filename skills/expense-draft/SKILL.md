---
name: expense-draft
description: >
  Match receipts to an expense policy and draft an expense report without submitting it.
  Use when the user asks to file expenses, draft an expense report, or reconcile receipts.
when-to-use: expense report, receipts, file expenses
metadata:
  author: grok-skills
  short-description: Draft expense report from receipts
  runtime: grok-bot
  connectors: [browser, drive]
  computer-use: true
  approvals: [submit-expense, purchase]
---

## When to use

Use to prepare an expense report from receipts. Do not use to book travel or to submit payments.

## Required inputs and access

- Receipts (files, Drive folder, or email attachments)
- Expense policy or default policy in this skill
- Expense system login on the Bot computer if drafting in-app

## Sequence of work

1. Collect receipts and extract merchant, date, amount, currency, and category.
2. Check each line against the policy (caps, alcohol, missing attendees).
3. Draft the report in the expense tool or as a table. Do not submit.
4. Flag policy exceptions with the rule that fired.

## How to validate the result

Totals match the receipts. Exceptions are listed. Submit button is not pressed.

## What to return

A draft report plus exception list, ready for the user to approve submission.

## Approvals and safety

Submitting expenses, creating reimbursements, and any purchase require approval. If a receipt cannot be read, omit it and say so. Never reuse an old report's line items when new receipts are missing.
