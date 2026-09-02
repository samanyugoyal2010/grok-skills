---
name: inbox-triage
description: >
  Triage Gmail/Outlook into needs-reply, FYI, and noise and draft replies
  without sending. Use when the user asks to catch up on email, triage an
  inbox, or clear unread mail.
when-to-use: inbox triage, catch up on email, gmail review, unread mail
metadata:
  author: grok-skills
  short-description: Inbox triage with draft-only replies
  runtime: grok-bot
  connectors: [gmail]
  computer-use: false
  approvals: [send-email, archive]
  category: inbox
---

## When to use

Use for a time-boxed inbox pass (default last 24 hours, or the window they name). Do not use to send mail, manage calendar, or file expenses.

## Required inputs and access

- Mail connector with **read** access (Gmail or Outlook)
- Optional: VIP list, mute senders, lookback window
- If the connector is missing, stop and say which plugin to enable. Do not scrape the mail website unless they explicitly allow computer-use.

## Sequence of work

1. Confirm the window and VIP rules. Default: unread + last 24h.
2. Fetch thread ids, from, subject, date, unread. Do not dump full bodies of unrelated people into shared chats.
3. Label each thread: `needs-reply`, `FYI`, `noise`, `needs-human`.
4. For `needs-reply`, draft a reply in the user’s voice. Mark it DRAFT. Do not send.
5. Return a digest grouped by label with thread ids and draft text.

## How to validate the result

Every row has a thread id. No send/archive/delete ran. Drafts are labeled drafts. If mail cannot be read, report the connector error instead of guessing.

## What to return

Digest + drafts + a short list of actions still needing approval (send, archive).

## Approvals and safety

Sending, forwarding, deleting, and bulk archive require approval. Never paste other customers’ mail into Slack. If the mailbox is unreadable, stop.
