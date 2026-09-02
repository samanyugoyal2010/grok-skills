import { parse as parseYaml } from "yaml";
import type { ParsedSkill, SkillFrontmatter, SkillMetadata, Runtime } from "./types.js";
import { RUNTIMES } from "./types.js";

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function headingList(body: string): string[] {
  return [...body.matchAll(/^#{1,3}\s+(.+)$/gm)].map((m) =>
    m[1].trim().toLowerCase().replace(/[.:]/g, "")
  );
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asStringList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[,\s]+/)
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeRuntime(value: unknown): Runtime {
  if (typeof value === "string" && (RUNTIMES as readonly string[]).includes(value)) {
    return value as Runtime;
  }
  return "both";
}

export function parseSkillMarkdown(content: string, filePath = "SKILL.md"): ParsedSkill {
  const match = content.match(FRONTMATTER_RE);
  let frontmatter: SkillFrontmatter = {};
  let body = content;

  if (match) {
    const parsed = parseYaml(match[1]) as unknown;
    frontmatter = parsed && typeof parsed === "object" ? (parsed as SkillFrontmatter) : {};
    body = match[2] ?? "";
  }

  const metadata: SkillMetadata =
    frontmatter.metadata && typeof frontmatter.metadata === "object"
      ? frontmatter.metadata
      : {};

  const dir = filePath.replace(/[/\\]SKILL\.md$/i, "");
  const folderName = dir.split(/[/\\]/).filter(Boolean).pop() ?? "unnamed-skill";
  const firstParagraph =
    body
      .split(/\n\n+/)
      .map((p) => p.replace(/^#+\s+.+\n?/, "").trim())
      .find((p) => p.length > 0) ?? "";

  const name = asString(frontmatter.name) || folderName;
  const description = asString(frontmatter.description) || firstParagraph;
  const whenToUse =
    asString(frontmatter["when-to-use"]) || asString(frontmatter.when_to_use);

  return {
    path: filePath,
    dir,
    name,
    description,
    whenToUse,
    body: body.trim(),
    frontmatter,
    metadata,
    runtime: normalizeRuntime(metadata.runtime),
    connectors: asStringList(metadata.connectors),
    computerUse: Boolean(metadata["computer-use"]),
    approvals: asStringList(metadata.approvals),
    headings: headingList(body),
  };
}

export function headingMatches(headings: string[], required: string): boolean {
  const needle = required.toLowerCase();
  return headings.some((h) => h.includes(needle) || needle.includes(h));
}
