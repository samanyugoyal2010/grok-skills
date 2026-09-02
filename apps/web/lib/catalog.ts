import fs from "fs";
import path from "path";
import type { CatalogSkill, Runtime } from "@grok-skills/spec";

export interface Catalog {
  generatedAt: string;
  skills: CatalogSkill[];
}

export interface InstallsData {
  counts: Record<string, number>;
}

const DATA_DIR = path.join(process.cwd(), "data");

function readJson<T>(filePath: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadInstalls(): InstallsData {
  return readJson<InstallsData>(path.join(DATA_DIR, "installs.json"), {
    counts: {},
  });
}

export function saveInstalls(data: InstallsData): void {
  fs.writeFileSync(
    path.join(DATA_DIR, "installs.json"),
    JSON.stringify(data, null, 2) + "\n",
    "utf-8",
  );
}

export function loadCatalogBase(): Catalog {
  return readJson<Catalog>(path.join(DATA_DIR, "catalog.json"), {
    generatedAt: new Date().toISOString(),
    skills: [],
  });
}

/** Hand-written catalog entries; others are generated templates. */
export const FEATURED_SKILL_NAMES = new Set([
  "find-skills",
  "inbox-triage",
  "weekly-account-health",
  "expense-draft",
  "pr-review-pack",
  "staging-repro-pack",
]);

function telemetryCount(
  skill: CatalogSkill,
  counts: Record<string, number>,
): number {
  return (
    (counts[skill.id] ?? 0) +
    (counts[skill.skillId] ?? 0) +
    (counts[skill.name] ?? 0)
  );
}

function isFeatured(skill: CatalogSkill): boolean {
  return skill.featured === true || FEATURED_SKILL_NAMES.has(skill.name);
}

/** Rank by public telemetry only. Catalog seed `installs` are ignored. */
export function overlayInstalls(
  skills: CatalogSkill[],
  counts: Record<string, number>,
): CatalogSkill[] {
  return skills.map((skill) => {
    const installs = telemetryCount(skill, counts);
    return {
      ...skill,
      installs,
      installs24h: installs,
      featured: isFeatured(skill),
    };
  });
}

export function getCatalog(): Catalog {
  const base = loadCatalogBase();
  const installs = loadInstalls();
  return {
    ...base,
    skills: overlayInstalls(base.skills, installs.counts),
  };
}

export type SortMode = "all-time" | "trending" | "hot";
export type RuntimeFilter = "all" | "grok-bot" | "grok-build";

export function matchesRuntime(
  skill: CatalogSkill,
  filter: RuntimeFilter,
): boolean {
  if (filter === "all") return true;
  if (filter === "grok-bot") {
    return skill.runtime === "grok-bot" || skill.runtime === "both";
  }
  return skill.runtime === "grok-build" || skill.runtime === "both";
}

function featuredThenName(a: CatalogSkill, b: CatalogSkill): number {
  const featA = a.featured ? 1 : 0;
  const featB = b.featured ? 1 : 0;
  if (featA !== featB) return featB - featA;
  return a.name.localeCompare(b.name);
}

export function sortSkills(
  skills: CatalogSkill[],
  mode: SortMode,
): CatalogSkill[] {
  const sorted = [...skills];
  switch (mode) {
    case "trending":
      sorted.sort((a, b) => {
        const d = b.installs24h - a.installs24h;
        return d !== 0 ? d : featuredThenName(a, b);
      });
      break;
    case "hot":
      sorted.sort((a, b) => {
        const d = hotScore(b) - hotScore(a);
        return d !== 0 ? d : featuredThenName(a, b);
      });
      break;
    default:
      sorted.sort((a, b) => {
        const d = b.installs - a.installs;
        return d !== 0 ? d : featuredThenName(a, b);
      });
  }
  return sorted;
}

export function hasPublicInstallCounts(skills: CatalogSkill[]): boolean {
  return skills.some((s) => s.installs > 0);
}

export function searchSkills(
  skills: CatalogSkill[],
  query: string,
  runtime?: RuntimeFilter,
): CatalogSkill[] {
  const q = query.trim().toLowerCase();
  let filtered = skills;

  if (runtime && runtime !== "all") {
    filtered = filtered.filter((s) => matchesRuntime(s, runtime));
  }

  if (!q) return sortSkills(filtered, "all-time");

  return sortSkills(
    filtered.filter((skill) => {
      const haystack = [
        skill.name,
        skill.description,
        skill.shortDescription ?? "",
        skill.source,
        skill.owner,
        skill.repo,
        skill.author ?? "",
        ...skill.connectors,
        ...skill.approvals,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    }),
    "all-time",
  );
}

export function getSkillByPath(
  owner: string,
  repo: string,
  skillName: string,
): CatalogSkill | undefined {
  const catalog = getCatalog();
  return catalog.skills.find(
    (s) =>
      s.owner === owner && s.repo === repo && s.name === skillName,
  );
}

export function getSkillsByRepo(
  owner: string,
  repo: string,
): CatalogSkill[] {
  const catalog = getCatalog();
  return catalog.skills.filter(
    (s) => s.owner === owner && s.repo === repo,
  );
}

export function recordInstall(skillId: string): void {
  const installs = loadInstalls();
  installs.counts[skillId] = (installs.counts[skillId] ?? 0) + 1;
  saveInstalls(installs);
}

export function formatInstallCount(n: number): string {
  if (n >= 1_000_000) {
    const val = n / 1_000_000;
    return val >= 10 ? `${Math.round(val)}M` : `${val.toFixed(1)}M`;
  }
  if (n >= 10_000) {
    const val = n / 1_000;
    return val >= 100 ? `${Math.round(val)}K` : `${val.toFixed(1)}K`;
  }
  if (n >= 1_000) {
    const val = n / 1_000;
    return `${val.toFixed(1)}K`;
  }
  return String(n);
}

export function hotScore(skill: CatalogSkill): number {
  return skill.installs24h * 4 + skill.installs;
}

export function runtimeLabel(runtime: Runtime): string {
  switch (runtime) {
    case "grok-bot":
      return "Grok Bot";
    case "grok-build":
      return "Grok Build";
    case "both":
      return "Grok Bot & Build";
  }
}
