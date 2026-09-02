# grok-skills

A [skills.sh](https://www.skills.sh/)-style directory and installer for **Grok Bot** skills.

```
npx grok-skills add owner/repo
```

Copies `SKILL.md` packages into `.grok/skills` (project) or `~/.grok/skills` (global). Rankings come from opt-in install telemetry, the same pattern Vercel uses.

Not affiliated with xAI or Vercel.

## Monorepo

| Package | Role |
| --- | --- |
| `@grok-skills/spec` | Parse and validate `SKILL.md` |
| `@grok-skills/core` | Library: discover, fetch, install, telemetry |
| `@grok-skills/cli` (`grok-skills`) | CLI over the library |
| `@grok-skills/web` | Directory site + `/api/search` + `/api/t` |
| `skills/` | Seed Grok Bot skills |

See [ARCHITECTURE.md](./ARCHITECTURE.md) and [PLAN.md](./PLAN.md).

## Quick start

```bash
pnpm install
pnpm --filter @grok-skills/spec build
pnpm --filter @grok-skills/core build
pnpm --filter @grok-skills/cli build

# Directory
pnpm --filter @grok-skills/web dev

# Install seed skills into this repo's .grok/skills
node packages/cli/dist/cli.js add ./skills --skill inbox-triage
node packages/cli/dist/cli.js check ./skills/inbox-triage
```

## Library

```ts
import { installFromSource, discoverSkills } from "@grok-skills/core";

const listed = await discoverSkills("./skills");
await installFromSource({ source: "owner/repo", skills: ["inbox-triage"] });
```
