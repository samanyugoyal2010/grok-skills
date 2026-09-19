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
  const content = headingsOutsideCodeFences(markdown).join("\n");
  if (!/^#\s+.+/m.test(content)) throw new Error("Generated skill must contain a top-level name heading");
  if (!/^##\s+(?:Description|Overview)/mi.test(content)) throw new Error("Generated skill must contain a description section");
  if (!/^##\s+(?:Procedure|Workflow|Instructions)/mi.test(content)) throw new Error("Generated skill must contain a task procedure");
  if (!/^##\s+(?:Constraints|Repository Constraints)/mi.test(content)) throw new Error("Generated skill must contain repository constraints");
  if (!/^##\s+(?:Examples|Example)/mi.test(content)) throw new Error("Generated skill must contain an example section");
}

export function trimText(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1)}…`;
}
