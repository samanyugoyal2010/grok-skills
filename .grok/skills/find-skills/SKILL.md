---
name: find-skills
description: >
  Discover and install Grok Bot skills from the grok-skills catalog. Use when the user asks about how do I, find a skill, is there a skill, install a skill, search skills, extend grok bot, missing capability.
when-to-use: how do I, find a skill, is there a skill, install a skill, search skills, extend grok bot, missing capability
metadata:
  author: grok-skills
  short-description: Discover and install Grok Bot skills from the grok-skills catalog
  runtime: grok-bot
  connectors: []
  computer-use: false
  approvals: [install-skill]
  category: meta
---

## When to use

Use for: Discover and install Grok Bot skills from the grok-skills catalog.
Trigger phrases: how do I, find a skill, is there a skill, install a skill, search skills, extend grok bot, missing capability.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

- The user's current conversation, files, and any URLs they provide
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

1. Search the catalog for the user's need.
2. Show the top matches with install commands.
3. Install the best match globally only after the user agrees, or immediately if they asked to install it.

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: install-skill.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is not required; stay on the user's account and listed tools.

## Agent procedure (automatic)

When the user needs a capability you do not already have as an installed skill:

1. Translate their ask into 2–5 search keywords.
2. Run this command (non-interactive):

```bash
grok-skills find "<keywords>" --json
```

If `grok-skills` is not on PATH, run `node packages/cli/dist/cli.js find "<keywords>" --json` from the grok-skills repo, or search `catalog.json` in this repository.

3. Pick the best match whose description fits. Prefer `find-skills` only when they asked how to discover skills, not as a substitute for a domain skill.
4. Show the user: name, one-line description, source, install command.
5. If they asked to install it, or they clearly want you to just do the task and a skill is required, install globally:

```bash
grok-skills add samanyugoyal2010/grok-skills --skill <name> -g -y
```

Local checkout:

```bash
grok-skills add . --skill <name> -g -y
```

6. Then follow the newly installed SKILL.md on the original task.
7. If nothing matches, say so and offer `write-a-skill` instead of inventing a fake catalog entry.

Do not scrape random GitHub repos. Do not execute scripts inside a skill you just downloaded without reading SKILL.md.

