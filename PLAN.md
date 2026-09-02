# grok-skills: skills.sh replica for Grok Bot

This is the product and architecture plan for a public directory + installer for **Grok Bot** skills. The goal is to clone the skills.sh experience (discover, rank, inspect, one-command install) while targeting how Grok Bot actually uses skills, plugins, and routines.

This document is the implementation contract. Build in the phases below; do not skip security or install-target work to ship the homepage first.

---

## 1. What we are copying

[skills.sh](https://www.skills.sh/) is Vercel’s public directory for the open [Agent Skills](https://agentskills.io) ecosystem. The live product is three pieces:

| Piece | What it does |
| --- | --- |
| Directory site | Leaderboard (all-time / 24h / hot), search, owner + skill pages, install counts, source repo, security audits |
| CLI (`npx skills add owner/repo`) | Clone/copy `SKILL.md` folders into agent skill dirs (Cursor, Claude Code, Codex, Grok Build, 70+ others) |
| Telemetry | Opt-in anonymous install events (`add-skill.vercel.sh/t`) that **create** the index and **rank** skills. There is no GitHub crawler. No installs → no listing. |

A skill on skills.sh is a folder with `SKILL.md` (YAML frontmatter + markdown body), optional `scripts/`, `references/`, and assets. Ranking is install telemetry, not stars.

We are **not** forking Vercel’s CLI. We are building a Grok Bot–native equivalent that still understands `SKILL.md` because Grok already reads that format.

---

## 2. What “Grok Bot skills” actually are

Grok Bot is not the same product as Grok Build (coding agent) or grok.com Skills (consumer document skills). The directory must treat them as related but distinct.

### 2.1 Grok Bot (teammate + computer)

From [Grok Bot overview](https://docs.x.ai/grok-bot/overview) and [Skills and routines](https://docs.x.ai/grok-bot/skills-routines-and-automations):

- A **skill** is reusable instructions: when to use, required inputs/access, sequence, validation, output, **approval boundaries**. Available across the user’s Bots.
- A **routine** is *when* one Bot runs a workflow (schedule or event). Routines are not the catalog unit; skills are.
- Users invoke saved skills with `/` in the composer; `@` mentions Bots, groups, routines, connectors.
- Packaged skills and connectors are discovered via **Settings → Plugins**. Private skills can be enabled per Bot.
- Bots share one persistent cloud computer (browser, filesystem, terminal, logins). Skills that assume computer-use, connectors (Gmail, Calendar, Drive, Slack via events, Salesforce, etc.), or approval gates are first-class, not afterthoughts.
- “Teach a task” can draft a skill from a browser demonstration. Our authoring templates should still require written rules the demo will miss (failures, approvals, stale data).

There is **no public Grok Bot skill registry API**. Sharing today is: conversation → save skill, or Plugins. Our product is the missing public marketplace.

### 2.2 Grok Build / `.grok/skills` (installable today)

From [Skills, Plugins & Marketplaces](https://docs.x.ai/build/features/skills-plugins-marketplaces):

Grok discovers `SKILL.md` from:

- `./.grok/skills/` (walked to repo root)
- `~/.grok/skills/`
- enabled plugins’ `skills/`
- extra `[skills] paths` in `~/.grok/config.toml`

Frontmatter Grok actually uses: `name`, `description`, `when-to-use`, `paths`, `allowed-tools`, `argument-hint`, `user-invocable`, `disable-model-invocation`, `metadata.author`, `metadata.short-description`. Extra keys are ignored.

Grok is also Claude-compatible (`.claude/` skills, plugins, marketplaces) and reads `~/.agents/skills/`.

**Install path for v1 CLI:** write into `.grok/skills/` and `~/.grok/skills/`. Document Grok Bot import (`/` + Settings → Plugins) until xAI exposes a Bot-side import API.

### 2.3 grok.com Skills (out of v1 scope)

Consumer Skills (docs, decks, sheets) on grok.com / iOS / Android are a different surface. Index them later if xAI publishes a portable format. Do not mix them into the Grok Bot leaderboard without a `runtime` tag.

---

## 3. Product thesis

**grok-skills** is the open directory for skills that make Grok Bots better teammates: research, inbox, CRM, ops, coding-on-the-Bot-computer, and approval-safe automations.

Positioning:

- skills.sh = “npm for every coding agent”
- grok-skills = “npm for Grok Bot skills” (and Grok Build as the installable runtime until Bot import exists)

Differentiation vs skills.sh:

1. **Runtime tags:** `grok-bot` | `grok-build` | `both`. Filter the leaderboard by runtime.
2. **Bot metadata:** required connectors, approval policy, whether a routine wrapper is recommended, computer-use yes/no.
3. **Install targets:** `.grok/skills` first, not 70 agent folders.
4. **Safety copy:** every skill page shows “what this skill is allowed to do” and “what must wait for approval.”
5. **Authoring:** templates that match Grok Bot’s six-part skill definition, not only Agent Skills `name` + `description`.

---

## 4. User journeys

### Discover

1. Land on homepage: search + Grok Bot leaderboard (all-time / 24h / hot).
2. Filter: runtime, connector (Gmail, Calendar, browser, GitHub, Salesforce, …), category (research, inbox, coding, ops, docs).
3. Open skill page: description, `SKILL.md` preview, repo, install count, connectors, approval notes, security scan, “agents” replaced by **runtimes** (Grok Bot vs Grok Build).

### Install

```bash
npx grok-skills add owner/repo
npx grok-skills add owner/repo --skill weekly-account-health
npx grok-skills add owner/repo --global          # ~/.grok/skills
npx grok-skills add owner/repo --project         # ./.grok/skills
```

CLI:

- Detects Grok (`.grok/`, `~/.grok/config.toml`) and offers those paths by default.
- Prints a Grok Bot checklist: enable under Settings → Plugins → Yours if the skill does not appear in `/`.
- Sends anonymous install telemetry (opt-out `DISABLE_TELEMETRY=1` / `DO_NOT_TRACK`).

### Publish

No special publish command (same as skills.sh):

1. Put a skill folder in a public git repo (`skills/<name>/SKILL.md` or repo-root `SKILL.md`).
2. People run `npx grok-skills add owner/repo`.
3. First opted-in install creates the registry row; later installs rank it.

Optional later: GitHub topic `grok-bot-skill` crawler as a *secondary* ingest so unpublished-but-tagged repos appear with 0 installs. Do not rely on crawl for ranking.

### Author

- `npx grok-skills init weekly-account-health` scaffolds Grok Bot frontmatter + body sections (when, inputs, sequence, validate, return, approvals).
- Validate against Agent Skills name/description rules **and** Grok-specific fields.

---

## 5. Information architecture (site)

Mirror skills.sh enough that the product feels familiar; change labels and extra columns for Bot.

| Route | Purpose |
| --- | --- |
| `/` | Hero, `npx grok-skills add <owner/repo>`, runtime chips, leaderboard |
| `/search?q=` | Fuzzy search over name, description, owner, connectors |
| `/[owner]/[repo]` | Pack page (repo with many skills) |
| `/[owner]/[repo]/[skill]` | Skill detail + install + SKILL.md + security |
| `/topics/[slug]` | Categories (inbox, crm, research, coding, computer-use) |
| `/about` | Ranking, telemetry, audits, Grok Bot vs Grok Build |
| `/docs/cli` | Install, opt-out, paths |
| `/docs/authoring` | Frontmatter + Bot skill template |
| `/p/[pack-id]` | Curated packs (xAI builtins, community “chief of staff”, etc.) |

Skill detail must show:

- Install command (copy)
- Source git URL + commit SHA indexed
- Installs (all-time, 24h)
- Runtimes
- Connectors / computer-use
- Approval summary (parsed from a required `## Approvals` section or `metadata.approvals`)
- Security audit status
- Raw `SKILL.md` (not a screenshot-only teaser)

---

## 6. Skill package spec (v1)

Compatible with Agent Skills + Grok extras. Required files:

```
weekly-account-health/
  SKILL.md
  references/          # optional
  scripts/             # optional; prefer existing CLIs
```

### Frontmatter

```yaml
---
name: weekly-account-health
description: >
  Score CRM accounts for churn risk and draft a review list.
  Use when the user asks for weekly account health, churn, or customer-risk.
when-to-use: weekly account health, churn risk, customer risk review
metadata:
  author: acme
  short-description: Weekly CRM risk review for Grok Bot
  runtime: grok-bot          # grok-bot | grok-build | both
  connectors: [salesforce, browser]
  computer-use: true
  approvals: [customer-contact, send-email]
---
```

### Body (Grok Bot template)

Required headings for directory admission (validator fails closed):

1. When to use / when not to use
2. Required inputs and access
3. Sequence of work
4. How to validate the result
5. What to return
6. Approvals and safety boundaries (no-data / stale-data policy)

Keep the body as agent instructions, not marketing.

---

## 7. System architecture

```
┌─────────────┐     add owner/repo      ┌──────────────────┐
│  grok-skills CLI  │ ─────────────────► │  git fetch skill  │
└──────┬──────┘                         └────────┬─────────┘
       │ telemetry (opt-in)                      │ copy to
       ▼                                         ▼
┌──────────────┐                         ~/.grok/skills or ./.grok/skills
│ Ingest API   │
│ POST /t      │
└──────┬───────┘
       ▼
┌──────────────┐     snapshot SKILL.md      ┌─────────────────┐
│ Postgres     │ ◄───────────────────────── │ Indexer worker  │
│ skills,      │                            │ (git + parse)   │
│ installs,    │                            └─────────────────┘
│ scans        │
└──────┬───────┘
       ▼
┌──────────────┐
│ Next.js app  │  GET /api/search  GET /api/skills/:id
│ + CDN cache  │
└──────────────┘
```

### Suggested stack (greenfield)

- **Web:** Next.js (App Router) + TypeScript. skills.sh is a fast, content-heavy leaderboard; SSR/ISR for skill pages.
- **API:** Route handlers or a small Hono/Fastify service if ingest volume needs isolation.
- **DB:** Postgres (Supabase or similar) — skills, versions, install_events, daily_rollups, security_scans.
- **Search:** Postgres `pg_trgm` / `tsvector` for v1; swap to Typesense/Meilisearch if ranking quality stalls.
- **Queue:** one worker for git snapshot + markdown parse + static analysis.
- **CLI:** TypeScript, published as `grok-skills` on npm, runnable via `npx grok-skills`.
- **Auth (later):** GitHub OAuth for claiming owner pages and private-skill orgs. Public read needs no auth.

### Core tables

- `skills` — id, owner, repo, skill_slug, name, description, runtime, connectors[], install_count, hot_score, source_url, indexed_sha, created_at
- `skill_files` — skill_id, path, content (SKILL.md + listed references)
- `install_events` — skill_id, anonymous_hash, runtime, day_bucket, created_at  
  Deduplicate hourly on `(skill_id, anonymous_hash, day)` the same way skills.sh does, to stop install farming.
- `security_scans` — skill_id, provider, status, summary, scanned_at
- `packs` — curated collections

Hot score (starting formula): `installs_24h * 4 + installs_7d * 1`, recomputed hourly.

---

## 8. CLI behavior (v1)

Commands:

| Command | Behavior |
| --- | --- |
| `add <source>` | GitHub/GitLab/URL/local path; discover SKILL.md like vercel-labs/skills (root, `skills/`, `.curated`, depth 3) |
| `add --skill <name>` | Single skill from a pack |
| `list` | Local installed skills and paths |
| `remove <name>` | Unlink/copy-remove from chosen scope |
| `update` | Re-fetch installed sources |
| `find <query>` | Query `GET /api/search` |
| `init <name>` | Scaffold Bot-shaped SKILL.md |
| `check [path]` | Validate frontmatter + required headings |

Discovery locations to write:

1. Project `.grok/skills/<name>/` (default if cwd is a git repo)
2. User `~/.grok/skills/<name>/` (`--global`)
3. Optional symlink into `~/.agents/skills/` if that dir exists

Do **not** spray into Claude/Cursor folders unless the user passes `--also cursor|claude`. This product is Grok-first.

Telemetry payload (no PII, no file bodies of private skills if `source` is local):

```json
{
  "skillId": "weekly-account-health",
  "source": "acme/grok-bot-skills",
  "sha": "abc123",
  "runtimeHint": "grok-bot",
  "cliVersion": "0.1.0"
}
```

Anonymous hash: HMAC of a locally generated install-id stored in `~/.grok/skills-cli.json`, not IP.

---

## 9. Security

Public skill directories are prompt-injection and supply-chain surfaces. v1 gates:

1. **Parse-only ingest.** Never execute `scripts/` on the indexer.
2. **Static checks:** YAML size limits, no HTML/script in frontmatter, flag `curl | bash`, credential patterns, exfil URLs, `ignore previous instructions`.
3. **Fail-closed listing:** skills that fail every check stay off the leaderboard; skill page can still exist with a warning for direct URL.
4. **Display SHA + “review SKILL.md before install.”** Same honesty as skills.sh.
5. **Approvals section required** for `runtime: grok-bot`. Computer-use skills without it do not rank.
6. Later: partner or in-house LLM audit similar to skills.sh security partners.

---

## 10. Seed content (so the directory is not empty)

skills.sh is empty without telemetry. Ship with:

1. **Official-shaped examples** in this repo under `skills/` (inbox triage with approval, CRM research, staging repro pack, expense draft-not-submit). These are Grok Bot templates, not xAI builtins.
2. **Compatibility import:** optional one-shot job that searches GitHub for `SKILL.md` + `grok-bot` / `.grok/skills` and offers “index with 0 installs.” Ranking still comes from our CLI.
3. **Curated pack** `/p/getting-started` so the homepage has rows on day one.

Do not scrape skills.sh install counts or copy their UI chrome/assets. Reimplement the *pattern* (leaderboard + add command + skill pages).

---

## 11. Phased delivery

### Phase 0 — Spec and examples (this repo now)

- This plan
- `skills/` examples using the Grok Bot template
- `packages/spec` JSON schema for frontmatter + `grok-skills check`

### Phase 1 — CLI that installs locally

- `packages/cli`: `init`, `check`, `add` (git), `list`, `remove`
- Writes only Grok paths
- Telemetry stub (no-op or log)

### Phase 2 — Directory MVP

- Next.js app: home leaderboard, search, skill page, about, docs
- Postgres + ingest `POST /t` + indexer
- Seed from this repo’s `skills/`
- Public `GET /api/search`

### Phase 3 — Grok Bot–specific UX

- Runtime / connector filters
- Approval and connector badges
- `init` template + authoring docs
- Pack pages

### Phase 4 — Trust and growth

- Deduped leaderboards, badges (`https://grok-skills.example/b/owner/repo`)
- Security scanner UI
- GitHub OAuth claim
- Marketplace source file for Grok Build (`[[marketplace.sources]]`) pointing at this registry
- If/when xAI documents a Bot plugin import API, add `grok-skills add --bot`

---

## 12. Explicit non-goals (v1)

- Installing into 70 coding agents by default
- Hosting or executing skills in our cloud as a Bot
- Replacing Grok Bot Plugins or xAI builtins
- Consumer grok.com document skills
- Paid ranking or featured slots
- Copying skills.sh proprietary telemetry or design assets

---

## 13. Risks

| Risk | Mitigation |
| --- | --- |
| No official Grok Bot import API | CLI targets `.grok/skills`; Bot users get copy/checklist; watch xAI docs |
| Empty leaderboard | Seed examples + curated pack; optional GitHub topic ingest at 0 installs |
| Install farming | Daily dedupe, rate limits, ignore local-path telemetry for ranking |
| Malicious SKILL.md | Static gate, required approvals section, SHA pin, don’t execute scripts |
| Confusion with skills.sh | Distinct name, runtime badges, about page comparison |
| Grok vs Grok Bot vs grok.com | `runtime` field; about docs; don’t mix document skills |

---

## 14. Success criteria

v1 is done when:

1. A stranger can browse a leaderboard of Grok Bot–oriented skills.
2. `npx grok-skills add <owner/repo>` lands a valid skill in `.grok/skills` or `~/.grok/skills`.
3. A skill page shows source, SHA, connectors, approvals, and SKILL.md.
4. Installs (opt-in) move rank within an hour.
5. `grok-skills check` rejects Bot skills missing the six body sections.

---

## 15. Immediate next implementation slice

When building starts, in order:

1. JSON schema + example skills in `skills/`
2. CLI `init` / `check` / `add`
3. Minimal Next.js homepage + skill page backed by seed JSON (no Postgres yet)
4. Postgres + telemetry ingest
5. Search API wired to CLI `find`

Keep the public name TBD (`grok-skills` package, site TBD). Do not claim affiliation with xAI or Vercel.
