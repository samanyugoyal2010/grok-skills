# What works vs what does not

Honest snapshot of this repo as a skills.sh replica for Grok Bot.

## Works today

- **Spec**: parse `SKILL.md`, require Grok Bot headings + approvals, reject `curl | bash` / obvious injection.
- **Library (`@grok-skills/core`)**: discover skills, copy into `.grok/skills` or `~/.grok/skills`, lockfile, local git/path install.
- **CLI**: `add`, `list`, `remove`, `init`, `check`.
- **`grok-skills find`**: searches a **bundled catalog** (no website required). `--json` is for Grok Bot.
- **Starter catalog**: 162 Grok Bot skills under `skills/`, including `find-skills`.
- **Directory site**: leaderboard, search, skill pages, `GET /api/search`, `POST /api/t` — when you run the Next app locally.
- **Grok Build auto-load of finder**: `.grok/skills/find-skills/SKILL.md` is committed so opening this repo can trigger discovery.

## Does not work yet (or only works with caveats)

| Gap | Why it matters |
| --- | --- |
| **Not on npm** | `npx grok-skills` will fail until `@grok-skills/cli` (or `grok-skills`) is published. Use `node packages/cli/dist/cli.js` from this repo. |
| **GitHub `add samanyugoyal2010/grok-skills` clones default branch** | Until this branch is merged to `main`, GitHub installs will not see the 162 skills. Local `add .` / `add ./skills` works. |
| **No Grok Bot Plugins API** | The CLI cannot push a skill into the Grok Bot desktop Plugins UI. It writes `.grok/skills`. Bot users still enable `/` skills under Settings → Plugins if they do not appear. |
| **No hosted registry** | Telemetry is a local `installs.json`. Public ranking like skills.sh needs a deployed Next app + real `GROK_SKILLS_REGISTRY`. |
| **`find` remote overlay is optional** | Default is bundled JSON. Set `GROK_SKILLS_REGISTRY` only when the site is deployed. |
| **No `update` command** | Re-run `add` to refresh. |
| **No interactive TTY finder** | Agent-first: keyword + `--json` only. |
| **Substring search, not embeddings** | `find "inbox"` works; fuzzy synonyms are limited. |
| **Generated skill bodies share a template** | 162 distinct tasks/approvals/connectors, but not 162 hand-tuned essays. |
| **Computer-use / connectors are instructions** | Skills describe Gmail/Salesforce/browser; they do not OAuth those systems. |
| **Seed install counts are synthetic** | Leaderboard numbers are stable hashes, except `find-skills` which is pinned high. |
| **Website not deployed** | No public grok-skills URL yet. |

## How Grok Bot should auto-find skills

1. Install **find-skills** into the Bot computer (once):

```bash
node packages/cli/dist/cli.js add . --skill find-skills -g -y
```

2. After that, when the user asks “is there a skill for inbox triage?”, the Bot should follow `find-skills`: run `grok-skills find "inbox triage" --json`, then `grok-skills add samanyugoyal2010/grok-skills --skill inbox-triage -g -y` (or `add .` from this checkout).

`find-skills` is written so the model is supposed to invoke it automatically from the description (same idea as Vercel’s find-skills).
