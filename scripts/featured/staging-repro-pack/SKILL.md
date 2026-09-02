---
name: staging-repro-pack
description: >
  Reproduce a bug in staging and return steps, evidence, and a minimal test
  case. Use for ticket repros. Never use production or real customer data.
when-to-use: reproduce bug, staging repro, ticket repro pack
metadata:
  author: grok-skills
  short-description: Staging bug repro pack
  runtime: grok-bot
  connectors: [browser, github]
  computer-use: true
  approvals: [production-access, customer-data]
  category: support
---

## When to use

Staging reproduction of a reported bug. Not for production hotfixes.

## Required inputs and access

- Ticket or report (expected vs actual)
- Staging URL and a **fresh test account**
- Browser on the Bot computer
- Optional repo for a failing test

## Sequence of work

1. Extract expected vs actual and environment.
2. Use only staging + test account. If they offer production, refuse.
3. Reproduce; capture steps, screenshots, console/network notes.
4. If it reproduces and a repo is in scope, add a minimal failing test. Do not merge.
5. If it does not, document attempts and blockers.

## How to validate the result

Pack has steps, browser/OS, expected vs actual, evidence. Production untouched. No customer PII.

## What to return

Repro pack in the conversation.

## Approvals and safety

Production access and real customer data are forbidden without explicit approval. Do not post to Slack/GitHub until they approve. Staging down: fail, do not switch to production.
