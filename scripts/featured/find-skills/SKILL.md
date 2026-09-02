---
name: find-skills
description: >
  Discover and install Grok skills from the grok-skills catalog when the user
  asks to find a skill, install a skill, search skills, extend Grok Bot, or
  says they need a capability that might already exist as a skill.
when-to-use: find a skill, is there a skill, install a skill, search skills, extend grok bot
metadata:
  author: grok-skills
  short-description: Discover and install skills from the grok-skills catalog
  runtime: grok-bot
  connectors: []
  computer-use: false
  approvals: [install-skill]
  category: meta
---

## When to use

Use when the user wants a **catalog skill** they do not already have: “find a skill for inbox triage”, “install the expense skill”, “is there a skill for QBRs”.

Do not use for general “how do I …” coding questions that are not about installing skills. Do not use this skill in place of inbox-triage, pr-review-pack, or other domain skills.

## Required inputs and access

- The user’s task in one sentence
- Network to run `npx github:samanyugoyal2010/grok-skills` (bundled catalog; does not need GitHub `main`)

## Sequence of work

1. Keywords: 2–5 words from the task.
2. Search:

```bash
npx --yes github:samanyugoyal2010/grok-skills find "<keywords>" --json
```

Checkout fallback: `node bin/grok-skills.mjs find "<keywords>" --json`

3. Show the top matches: name, short description, connectors, approvals, add command.
4. Install **one skill by catalog name** only after they agree (or immediately if they said install it):

```bash
npx --yes github:samanyugoyal2010/grok-skills add <name> -g
```

5. Open `~/.grok/skills/<name>/SKILL.md` and continue the original task with that skill.

## How to validate the result

Search JSON contains `skills[]`. Install created `SKILL.md`. You did not add an entire GitHub repo. You did not invent a skill that was not in the JSON.

## What to return

Matches table + what you installed + whether Grok Build vs Grok Bot still needs a paste into Plugins.

## Approvals and safety

`install-skill` requires a yes unless the user already asked to install a named skill. Never `add owner/repo` without `--skill` or a catalog name. Never execute scripts inside a downloaded skill before reading SKILL.md.

## Grok Bot vs Grok Build

Grok **Build** reads `~/.grok/skills` and project `.grok/skills`. Grok **Bot** slash commands come from saved/plugin skills. If `/` does not list it, paste SKILL.md (print with `npx --yes github:samanyugoyal2010/grok-skills print <name>`) or enable under Settings → Plugins.
