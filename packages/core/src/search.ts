import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { CatalogSkill } from "@grok-skills/spec";
import bundledCatalogJson from "./bundled-catalog.json" with { type: "json" };

export interface BundledCatalog {
  generatedAt: string;
  source: string;
  count: number;
  skills: CatalogSkill[];
}

let cached: BundledCatalog | undefined;

export function loadBundledCatalog(): BundledCatalog {
  if (cached) {
    return cached;
  }
  const file = join(import.meta.dirname, "bundled-catalog.json");
  if (existsSync(file)) {
    cached = JSON.parse(readFileSync(file, "utf8")) as BundledCatalog;
    return cached;
  }
  cached = bundledCatalogJson as BundledCatalog;
  return cached;
}

export function findCatalogSkill(name: string): CatalogSkill | undefined {
  return loadBundledCatalog().skills.find((skill) => skill.name === name);
}

export function catalogSkillMarkdown(skill: CatalogSkill): string {
  if (skill.skillMd?.trim()) {
    return skill.skillMd;
  }
  const fromDisk = readBundledSkillFile(skill.name);
  if (fromDisk) {
    return fromDisk;
  }
  return reconstructSkillMarkdown(skill);
}

export function printSkillMarkdown(name: string): string {
  const skill = findCatalogSkill(name);
  if (!skill) {
    throw new Error(`Unknown catalog skill: ${name}`);
  }
  return catalogSkillMarkdown(skill);
}

function readBundledSkillFile(name: string): string | undefined {
  const here = import.meta.dirname;
  const candidates = [
    join(process.cwd(), "skills", name, "SKILL.md"),
    join(here, "../../../skills", name, "SKILL.md"),
    join(here, "../skills", name, "SKILL.md"),
    join(here, "skills", name, "SKILL.md"),
  ];
  for (const path of candidates) {
    if (existsSync(path)) {
      return readFileSync(path, "utf8");
    }
  }
  return undefined;
}

function reconstructSkillMarkdown(skill: CatalogSkill): string {
  const short = skill.shortDescription || skill.description.split(".")[0] || skill.name;
  const approvals = skill.approvals?.length ? skill.approvals : ["user-approval"];
  const connectors = skill.connectors ?? [];
  const runtime = skill.runtime || "grok-bot";
  const description = skill.description.replace(/\s+/g, " ").trim();
  return `---
name: ${skill.name}
description: ${description}
when-to-use: ${short}
metadata:
  runtime: ${runtime}
  connectors: [${connectors.join(", ")}]
  computer-use: ${skill.computerUse ? "true" : "false"}
  approvals: [${approvals.join(", ")}]
---

## When to use

${description}

## Required inputs and access

- Inputs named in the user request
- Access to: ${connectors.length ? connectors.join(", ") : "local files and conversation"}

## Sequence of work

1. Gather the required inputs.
2. Perform the ${short} workflow.
3. Stop at a reviewable draft.

## How to validate the result

Cite sources. Do not execute approval-gated actions.

## What to return

A reviewable pack: findings, drafts, and actions that still need approval.

## Approvals and safety

These always require explicit approval: ${approvals.join(", ")}.
Never embed secrets.
`;
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
