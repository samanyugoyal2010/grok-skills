---
name: inbox-triage
description: >
  Triage an inbox into needs-reply, FYI, and noise, and draft replies for approval.
  Use when the user asks to catch up on email, triage Gmail, or clear an inbox.
when-to-use: inbox triage, catch up on email, gmail review
metadata:
  author: grok-skills
  short-description: Inbox triage with draft-only replies
  runtime: grok-bot
  connectors: [gmail]
  computer-use: false
  approvals: [send-email, archive]
---

## When to use

Use when the user wants a ranked inbox digest. Do not use for sending mail unattended or for calendar scheduling.

## Required inputs and access

- Mail connector (Gmail or Outlook) with read access
- Optional: VIP list, mute rules, lookback window (default 24 hours)

## Sequence of work

1. Fetch unread and recently received threads in the window.
2. Label each thread: needs-reply, FYI, noise, or needs-human.
3. For needs-reply, draft a reply in the user's voice. Do not send.
4. Return a digest grouped by label with links back to each thread.

## How to validate the result

Every item has a thread id. Drafts are clearly marked as drafts. No send or archive actions are executed.

## What to return

A digest plus draft replies. Ask which drafts to send.

## Approvals and safety

Sending, forwarding, deleting, and bulk archive require approval. Never include message bodies from other customers in a shared channel. If the mailbox cannot be read, stop and report the error.
