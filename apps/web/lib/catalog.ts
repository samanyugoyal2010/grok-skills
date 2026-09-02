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

export function overlayInstalls(
  skills: CatalogSkill[],
  counts: Record<string, number>,
): CatalogSkill[] {
  return skills.map((skill) => {
    const extra =
      (counts[skill.id] ?? 0) + (counts[skill.skillId] ?? 0) + (counts[skill.name] ?? 0);
    if (extra === 0) return skill;
    return {
      ...skill,
      installs: skill.installs + extra,
      installs24h: skill.installs24h + extra,
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

export function sortSkills(
  skills: CatalogSkill[],
  mode: SortMode,
): CatalogSkill[] {
  const sorted = [...skills];
  switch (mode) {
    case "trending":
      sorted.sort((a, b) => b.installs24h - a.installs24h);
      break;
    case "hot":
      sorted.sort(
        (a, b) =>
          b.installs24h * 4 +
          b.installs -
          (a.installs24h * 4 + a.installs),
      );
      break;
    default:
      sorted.sort((a, b) => b.installs - a.installs);
  }
  return sorted;
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

  if (!q) return filtered;

  return filtered.filter((skill) => {
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
  });
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
