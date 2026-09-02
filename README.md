# grok-skills

A [skills.sh](https://www.skills.sh/)-style directory and installer for **Grok Bot** skills.

Not affiliated with xAI or Vercel.

```bash
npx --yes github:samanyugoyal2010/grok-skills add inbox-triage -g
npx --yes github:samanyugoyal2010/grok-skills find "inbox triage" --json
```

The CLI is **not on the npm registry**. `npx grok-skills` will not resolve a published package. Use `npx --yes github:samanyugoyal2010/grok-skills` or `node bin/grok-skills.mjs` in this checkout.

Catalog `add <skill-name>` copies bundled `SKILL.md` (no GitHub clone). Git installs need `owner/repo@ref` plus `--skill` or `--all`. Example branch:

```bash
npx --yes github:samanyugoyal2010/grok-skills add samanyugoyal2010/grok-skills@cursor/grok-bot-skills-directory-plan-7471 --skill inbox-triage
```

Copies packages into `.grok/skills` or `~/.grok/skills`. **162** starter skills ship in `skills/`. `find-skills` is the auto-discovery skill. Featured skills are hand-written; the rest are templates.

Grok **Build** reads `.grok/skills`. Grok **Bot** does not pick up a disk install in `/` automatically — use Settings → Plugins or paste SKILL.md (`print`).

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

# Bundled catalog (no website, no GitHub)
node bin/grok-skills.mjs find "inbox" --json
node bin/grok-skills.mjs add find-skills -g

# Or from GitHub
npx --yes github:samanyugoyal2010/grok-skills add find-skills -g
npx --yes github:samanyugoyal2010/grok-skills setup

# Directory UI (local; telemetry stays off unless GROK_SKILLS_REGISTRY is set)
pnpm --filter @grok-skills/web dev
```

Regenerate skills after editing `scripts/generate-skills.mjs`:

```bash
pnpm generate:skills
```
