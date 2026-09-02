# grok-skills

A [skills.sh](https://www.skills.sh/)-style directory and installer for **Grok Bot** skills.

```
grok-skills find "inbox triage" --json
grok-skills add samanyugoyal2010/grok-skills --skill inbox-triage -g -y
```

Copies `SKILL.md` packages into `.grok/skills` or `~/.grok/skills`. **162** starter skills ship in `skills/`. `find-skills` is the auto-discovery skill for Grok Bot.

Not affiliated with xAI or Vercel.

Read **[STATUS.md](./STATUS.md)** for what works vs what does not.

## Monorepo

| Package | Role |
| --- | --- |
| `@grok-skills/spec` | Parse and validate `SKILL.md` |
| `@grok-skills/core` | Library: discover, fetch, install, bundled catalog search |
| `@grok-skills/cli` (`grok-skills`) | CLI over the library |
| `@grok-skills/web` | Directory site + `/api/search` + `/api/t` |
| `skills/` | Starter Grok Bot catalog |

## Quick start

```bash
pnpm install
pnpm --filter @grok-skills/spec build
pnpm --filter @grok-skills/core build
pnpm --filter @grok-skills/cli build

# Search the bundled catalog (no website needed)
node packages/cli/dist/cli.js find "inbox" --json

# Bootstrap Grok Bot discovery
node packages/cli/dist/cli.js add . --skill find-skills -g -y

# Directory UI
pnpm --filter @grok-skills/web dev
```

Regenerate skills after editing `scripts/generate-skills.mjs`:

```bash
pnpm generate:skills
```
