---
name: staging-repro-pack
description: >
  Reproduce a bug in staging and return a repro pack with steps, evidence, and a minimal test case.
  Use when the user asks to reproduce a ticket, write a repro, or investigate a staging bug.
when-to-use: reproduce bug, staging repro, ticket repro pack
metadata:
  author: grok-skills
  short-description: Staging bug repro pack
  runtime: grok-bot
  connectors: [browser, github]
  computer-use: true
  approvals: [production-access, customer-data]
---

## When to use

Use for staging reproduction of a reported bug. Do not use against production. Do not use to “just fix it” in prod.

## Required inputs and access

- Bug report or ticket link
- Staging URL and a fresh test account
- Browser on the Bot computer
- Optional: repo access for a minimal test case

## Sequence of work

1. Read the report. Extract expected vs actual behavior.
2. Create or use a fresh staging test account. Never use production customer data.
3. Reproduce in the browser. Capture steps, screenshots, console and network notes.
4. If it reproduces, write a minimal test case or failing assertion when a repo is in scope.
5. If it does not reproduce, document what was tried and what blocked it.

## How to validate the result

The pack includes exact steps, environment (browser/OS), expected vs actual, and evidence. No production systems were touched.

## What to return

A repro pack in the conversation: steps, evidence, and a minimal test case if possible.

## Approvals and safety

Production access and real customer data are forbidden without explicit approval. Do not post the pack to Slack or GitHub until the user approves. If staging is down, report failure instead of switching to production.
