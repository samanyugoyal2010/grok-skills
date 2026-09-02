---
name: pr-review-pack
description: >
  Build a structured pull-request review: summary, risks, tests, and questions.
  Use when asked to review a PR. Do not merge, approve, or push.
when-to-use: pr review, review this pull request, github review
metadata:
  author: grok-skills
  short-description: Structured PR review pack
  runtime: grok-bot
  connectors: [github]
  computer-use: false
  approvals: [merge-pr, production-change]
  category: eng
---

## When to use

Review a named PR (URL or number). Not for writing the feature.

## Required inputs and access

- PR URL or repo + number
- GitHub **read** (gh, API, or checked-out diff)
- Test/CI status if available

## Sequence of work

1. Read the PR title, description, and diff. Note missing tests.
2. Summarize intent in 5 lines.
3. List risks (auth, data, migrations, API breaks) with file paths.
4. List what you would test. Do not merge. Do not click approve.
5. Open questions for the author.

## How to validate the result

Every risk cites a path. No merge/approve. Secrets in the diff are flagged, not copied.

## What to return

Review pack ready to paste as a comment **if they ask**. Default: only in this conversation.

## Approvals and safety

Merge, force-push, production deploy, and publishing the review on GitHub need approval.
