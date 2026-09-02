# Architecture split

This repo is a **skills.sh replica for Grok**, implemented as a pnpm monorepo.

```
packages/spec     shared SKILL.md parse + validate  (done)
packages/core     install library (fetch, discover, copy into .grok/skills)
packages/cli      `grok-skills` CLI — thin wrapper over core
apps/web          directory site + search/telemetry APIs (skills.sh UX)
skills/           seed Grok Bot skills listed on the homepage
```

## How it mirrors Vercel skills.sh

| Vercel | This repo |
| --- | --- |
| `npx skills add owner/repo` | `npx grok-skills add owner/repo` |
| Copies `SKILL.md` folders into agent dirs | Copies into `.grok/skills` or `~/.grok/skills` |
| `skills.sh` leaderboard + skill pages | `apps/web` leaderboard + skill pages |
| Install telemetry → rank | `POST /api/t` → catalog install counts |
| No GitHub crawler | Catalog starts from `skills/` seed + telemetry |

## Library (`@grok-skills/core`) — public API

Must export (and implement) exactly:

- `discoverSkills(root: string): Promise<DiscoveredSkill[]>`
- `resolveSource(source: string, cwd?: string): ResolveSourceResult`
- `fetchSource(source: string, destDir: string): Promise<{ root: string; sha?: string; resolved: ResolveSourceResult }>`
- `grokSkillsDir(opts: { cwd?: string; global?: boolean }): string`
- `installFromSource(opts: InstallOptions): Promise<InstallResult>`
- `listInstalled(opts: { cwd?: string; global?: boolean }): Promise<{ name: string; path: string; source?: string }[]>`
- `removeInstalled(name: string, opts: { cwd?: string; global?: boolean }): Promise<boolean>`
- `scaffoldSkill(dir: string, name: string, opts?: { runtime?: 'grok-bot' \| 'grok-build' \| 'both' }): void`
- `reportInstall(event: TelemetryEvent, endpoint: string): Promise<void>`
- `telemetryEnabled(): boolean`
- Re-export parse/check from `@grok-skills/spec`

Install always **copies** (no symlink in v1). Target:

- project: `{gitRoot or cwd}/.grok/skills/<name>/`
- global: `~/.grok/skills/<name>/`

Write `{target}/.grok/skills-lock.json` at project git root (or `~/.grok/skills-lock.json` for global) mapping name → `{ source, sha, installedAt }`.

Discovery order (like Vercel, Grok-only):

1. `SKILL.md` at the search root
2. Immediate children of `skills/`, `skills/.curated`, `skills/.experimental`, `.grok/skills` that contain `SKILL.md`
3. Walk `skills/` up to 3 directory levels
4. Skip `node_modules`, `.git`, `dist`, `.next`

`resolveSource` accepts: `owner/repo`, GitHub/GitLab HTTPS, `git@`, local path, GitHub tree URL (`.../tree/main/skills/foo`). Fetch with `git clone --depth 1`. For GitHub also try tarball if git fails: `https://codeload.github.com/{owner}/{repo}/tar.gz/{ref}`.

Telemetry: skip if `DISABLE_TELEMETRY=1` or `DO_NOT_TRACK=1`. Default endpoint `process.env.GROK_SKILLS_REGISTRY || 'http://localhost:3000/api/t'`.

## CLI (`@grok-skills/cli`)

Binary name: `grok-skills`. Commands: `add`, `list`, `remove`, `find`, `init`, `check`. Flags on add: `-g/--global`, `-s/--skill`, `-l/--list`, `-y/--yes`. `find` hits `{registry}/api/search?q=`.

## Web (`@grok-skills/web`)

Next.js App Router, TypeScript, Tailwind. Dark, sparse, skills.sh-like:

- Home: “Skills” wordmark, subtitle “The Grok Agent Skills Directory”, copyable `$ npx grok-skills add <owner/repo>`, All-time / 24h / Hot tabs, table (rank, name, source, installs)
- `/[owner]/[repo]/[skill]` detail: install command, connectors, approvals, runtime, SKILL.md preview, security check from spec
- `/about`, `/docs/cli`
- `GET /api/search?q=&runtime=`
- `POST /api/t` body TelemetryEvent — bump install counts in `apps/web/data/installs.json`
- Catalog from `apps/web/data/catalog.json` (seeded from `skills/`) plus install overlays

Do not copy skills.sh assets. Reimplement the pattern.

## Seed skills

Four skills under `/workspace/skills/<name>/SKILL.md` must pass `checkSkill` for `runtime: grok-bot`.
