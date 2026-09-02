# Production contract (do this)

Close the review gaps. Work only in your assigned paths.

## Product rules

1. **Catalog install (no GitHub needed):** `grok-skills add inbox-triage` and `grok-skills add find-skills -g` copy from the **bundled catalog** (SKILL.md text inside `bundled-catalog.json`).
2. **GitHub:** support `owner/repo@ref` (example `samanyugoyal2010/grok-skills@cursor/grok-bot-skills-directory-plan-7471`). Default clone still uses default branch.
3. **Never install a whole pack** unless `--all` or a single `--skill`. If listed.length > 1 and no `--skill` and no `--all`, print names and exit 1.
4. **`--yes`:** if not yes and not listOnly and installing > 0, print what will be installed; in TTY you may skip prompt when `--yes`; without TTY require `--yes` for git/local packs. Catalog single-skill add does not need `--yes`.
5. **Telemetry:** only if `GROK_SKILLS_REGISTRY` is a site origin (e.g. `https://example.com`). POST `${origin}/api/t`. Never default to localhost. `telemetryEnabled()` is false when registry unset.
6. **Find:** bundled catalog first. Optional overlay from `${GROK_SKILLS_REGISTRY}/api/search`. Empty query + `--json` from a non-TTY should return `{ error: "query required" }` exit 1. Empty query on TTY can show top skills.
7. **Grok Bot:** `setup` installs `find-skills` globally and writes `~/.grok/plugins/grok-skills/` with plugin.json + that skill. Print that Grok **Build** reads `.grok/skills`; Grok **Bot** may need Settings → Plugins or paste SKILL.md (`grok-skills print find-skills`).
8. **npx:** repo-root `bin/grok-skills.mjs` esbuild bundle of the CLI + catalog so `npx github:samanyugoyal2010/grok-skills` can work from this branch. Root package.json `"name": "grok-skills"`, `"bin": { "grok-skills": "./bin/grok-skills.mjs" }`, `"private": false` ok. Keep workspaces.
9. **Install counts:** catalog seed installs = 0. Website ranks by telemetry overlay only.
10. **Honest copy:** never claim npx works from npm registry. Say: `npx github:samanyugoyal2010/grok-skills -- find-skills` or `node bin/grok-skills.mjs add find-skills -g`.
11. **checkSkill before copy** for catalog and git installs; skip files that fail unless `--force` (optional). Fail closed on security errors.
12. After add, print Grok Bot next step (3 lines max).

## Grok Bot auto-find

`find-skills` SKILL.md must tell the agent:

```
npx --yes github:samanyugoyal2010/grok-skills find "KEYWORDS" --json
npx --yes github:samanyugoyal2010/grok-skills add SKILLNAME -g
```

Fallback: `node bin/grok-skills.mjs` in this repo.

Do not tell the agent to clone main for skills.
