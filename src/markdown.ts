import { LIMITS } from "./limits.js";

function headingsOutsideCodeFences(markdown: string): string[] {
  let inFence = false;
  const headings: string[] = [];
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (!inFence) headings.push(line);
  }
  return headings;
}

export function validateSkillMarkdown(markdown: string): void {
  if (!markdown.trim()) throw new Error("Generated skill is empty");
  if (markdown.length > LIMITS.outputChars) throw new Error(`Generated skill exceeds ${LIMITS.outputChars} characters`);
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(markdown);
  if (!frontmatter) throw new Error("Generated skill must begin with YAML front matter");
  const name = /^name:\s*([a-z0-9]+(?:-[a-z0-9]+)*)\s*$/m.exec(frontmatter[1])?.[1];
  const description = /^description:\s*(.+)\s*$/m.exec(frontmatter[1])?.[1];
  if (!name || name.length > 64) throw new Error("Generated skill must contain a valid kebab-case name in front matter");
  if (!description || description.length > 1024) throw new Error("Generated skill must contain a description in front matter");
  const content = headingsOutsideCodeFences(markdown.slice(frontmatter[0].length)).join("\n");
  if (!/^#\s+.+/m.test(content)) throw new Error("Generated skill must contain a top-level name heading");
  if (!/^##\s+(?:Description|Overview)/mi.test(content)) throw new Error("Generated skill must contain a description section");
  if (!/^##\s+(?:Procedure|Workflow|Instructions)/mi.test(content)) throw new Error("Generated skill must contain a task procedure");
  if (!/^##\s+(?:Constraints|Repository Constraints)/mi.test(content)) throw new Error("Generated skill must contain repository constraints");
  if (!/^##\s+(?:Examples|Example)/mi.test(content)) throw new Error("Generated skill must contain an example section");
}

export function trimText(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}

export function singleLine(value: string): string {
  return value.replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

export function escapeMarkdownInline(value: string): string {
  return singleLine(value).replace(/[\\`*_{}\[\]<>!|]/g, "\\$&");
}

export function escapeMarkdownCodeSpan(value: string): string {
  const normalized = value.replace(/[\r\n]+/g, " ");
  const longestRun = Math.max(0, ...Array.from(normalized.matchAll(/`+/g), (match) => match[0].length));
  const delimiter = "`".repeat(longestRun + 1);
  const needsPadding = normalized.startsWith(" ") || normalized.endsWith(" ") || normalized.startsWith("`") || normalized.endsWith("`");
  return `${delimiter}${needsPadding ? ` ${normalized} ` : normalized}${delimiter}`;
}

export function escapeMarkdownLinkLabel(value: string): string {
  return escapeMarkdownInline(value);
}

export function escapeMarkdownUrl(value: string): string {
  const normalized = singleLine(value).replace(/[<>\r\n]/g, "");
  try {
    const parsed = new URL(normalized);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? normalized : "#";
  } catch {
    return "#";
  }
}
