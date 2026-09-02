---
name: expense-draft
description: >
  Match receipts to policy and draft an expense report without submitting.
  Use when filing expenses, reconciling receipts, or preparing a report.
when-to-use: expense report, receipts, file expenses
metadata:
  author: grok-skills
  short-description: Draft expense report from receipts
  runtime: grok-bot
  connectors: [browser, drive]
  computer-use: true
  approvals: [submit-expense, purchase]
  category: finance
---

## When to use

Prepare an expense report. Do not book travel or submit payment.

## Required inputs and access

- Receipts (files, Drive folder, or mail attachments)
- Policy: alcohol, caps, attendees. If none, list assumptions and flag every line as unverified
- Expense tool login only if they want in-app draft; otherwise a table is enough

## Sequence of work

1. Extract merchant, date, amount, currency, category per receipt. Omit unreadable files and say so.
2. Check policy; flag exceptions with the rule.
3. Draft the report in the tool **without clicking submit**, or as a table.
4. Totals must match included receipts.

## How to validate the result

Submit was not pressed. Totals reconcile. Exceptions listed. No invented receipts.

## What to return

Draft report + exceptions + “ready to submit if you approve”.

## Approvals and safety

Submit, reimbursement, and any purchase need approval. Computer-use: stay on the expense app they named. Never reuse last month’s lines when new receipts are missing.
