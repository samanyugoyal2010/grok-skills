import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CatalogSkill } from "@grok-skills/spec";

export interface BundledCatalog {
  generatedAt: string;
  source: string;
  count: number;
  skills: CatalogSkill[];
}

export function loadBundledCatalog(): BundledCatalog {
  const file = join(import.meta.dirname, "bundled-catalog.json");
  return JSON.parse(readFileSync(file, "utf8")) as BundledCatalog;
}

export function searchCatalog(
  skills: CatalogSkill[],
  query: string,
  opts: { limit?: number } = {}
): CatalogSkill[] {
  const limit = opts.limit ?? 10;
  const q = query.trim().toLowerCase();
  if (!q) {
    return [...skills].sort((a, b) => b.installs - a.installs).slice(0, limit);
  }

  const terms = q.split(/\s+/).filter(Boolean);
  const scored = skills
    .map((skill) => {
      const hay = [
        skill.name,
        skill.name.replaceAll("-", " "),
        skill.description,
        skill.shortDescription ?? "",
        skill.source,
        ...(skill.connectors ?? []),
        ...((skill as CatalogSkill & { category?: string }).category
          ? [(skill as CatalogSkill & { category?: string }).category as string]
          : []),
      ]
        .join(" ")
        .toLowerCase();
      let score = 0;
      if (skill.name === q || skill.name.replaceAll("-", " ") === q) score += 100;
      if (skill.name.includes(q.replaceAll(" ", "-"))) score += 40;
      for (const term of terms) {
        if (skill.name.includes(term)) score += 12;
        if (hay.includes(term)) score += 4;
      }
      return { skill, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || b.skill.installs - a.skill.installs);

  return scored.slice(0, limit).map((row) => row.skill);
}
