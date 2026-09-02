# What works vs what does not

Honest snapshot after the production contract in `PRODUCTION.md`.

## Works today

- **Spec**: parse `SKILL.md`, require Grok Bot headings + approvals, reject `curl | bash` / obvious injection.
- **Library (`@grok-skills/core`)**: discover skills, copy into `.grok/skills` or `~/.grok/skills`, lockfile, local git/path install, bundled catalog.
- **CLI catalog add (no GitHub)**: `add inbox-triage` / `add find-skills -g` copies SKILL.md from the bundled catalog.
- **CLI git add**: `owner/repo` and `owner/repo@ref` (example `samanyugoyal2010/grok-skills@cursor/grok-bot-skills-directory-plan-7471`). Whole packs need `--skill` or `--all`.
- **`find`**: bundled catalog first. `--json` is for Grok Bot. Optional overlay only if `GROK_SKILLS_REGISTRY` is a deployed origin.
- **`setup` / `print`**: bootstrap find-skills + plugin files; print SKILL.md for Bot paste.
- **`npx` from GitHub**: `npx --yes github:samanyugoyal2010/grok-skills` via repo-root `bin/grok-skills.mjs`. Not on npm.
- **Starter catalog**: 162 Grok Bot skills under `skills/`, including `find-skills`.
- **Directory site**: leaderboard (telemetry overlay only; seed installs are 0), search, skill pages (`skillMd` from catalog JSON with disk fallback), `GET /api/search`, `POST /api/t`.
- **Grok Build auto-load of finder**: `.grok/skills/find-skills/SKILL.md` is committed so opening this repo can trigger discovery in **Build**.

## Does not work yet (or only works with caveats)

| Gap | Why it matters |
| --- | --- |
| **Not on npm** | `npx grok-skills` does not install a published package. Use `npx --yes github:samanyugoyal2010/grok-skills` or `node bin/grok-skills.mjs`. |
| **GitHub `main` is empty until merge** | `add samanyugoyal2010/grok-skills` without `@ref` clones the default branch. Until this branch lands on `main`, that clone will not contain the 162 skills. Use catalog `add NAME` or pass `@cursor/grok-bot-skills-directory-plan-7471`. Local `add . --skill NAME` still works. |
| **Grok Bot still needs Plugins / paste** | The CLI writes `.grok/skills` and can write `~/.grok/plugins/grok-skills/`. There is no Grok Bot Plugins API. Skills do **not** automatically appear under Bot `/`. Enable Settings → Plugins or paste SKILL.md (`print`). |
| **Telemetry off unless registry set** | `GROK_SKILLS_REGISTRY` unset → no POST to `/api/t`, no localhost default. Leaderboard shows “No public install counts yet” until a deployed origin is set and clients opt in. Catalog seed counts are 0; ranking is overlay-only. |
| **Website not deployed** | No public grok-skills URL yet. Local Next app does not turn on CLI telemetry by itself. |
| **No `update` command** | Re-run `add` to refresh. |
| **Substring search, not embeddings** | `find "inbox"` works; fuzzy synonyms are limited. |
| **Generated skill bodies share a template** | Featured skills are hand-written. Others are 162 distinct tasks/approvals, not 162 hand-tuned essays. |
| **Computer-use / connectors are instructions** | Skills describe Gmail/Salesforce/browser; they do not OAuth those systems. |

## How Grok Bot should auto-find skills

1. Once: `npx --yes github:samanyugoyal2010/grok-skills setup` (or `add find-skills -g`), then enable the plugin / paste SKILL.md in Bot.

2. The agent should run:

```bash
npx --yes github:samanyugoyal2010/grok-skills find "KEYWORDS" --json
npx --yes github:samanyugoyal2010/grok-skills add SKILLNAME -g
```

Fallback: `node bin/grok-skills.mjs` in this repo. Do not clone `main` for skills.
