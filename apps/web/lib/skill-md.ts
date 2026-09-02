import fs from "fs";
import path from "path";

const SKILL_MD_CANDIDATES = (skillName: string) => [
  path.join(process.cwd(), "skills", skillName, "SKILL.md"),
  path.join(process.cwd(), "../../skills", skillName, "SKILL.md"),
  path.join("/workspace/skills", skillName, "SKILL.md"),
];

export function readSkillMarkdown(skillName: string): string | null {
  for (const candidate of SKILL_MD_CANDIDATES(skillName)) {
    try {
      if (fs.existsSync(candidate)) {
        return fs.readFileSync(candidate, "utf-8");
      }
    } catch {
      // try next path
    }
  }
  return null;
}

export function renderSkillBody(markdown: string): string {
  const lines = markdown.split("\n");
  let inFrontmatter = false;
  let frontmatterDone = false;
  const body: string[] = [];

  for (const line of lines) {
    if (!frontmatterDone && line.trim() === "---") {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      }
      frontmatterDone = true;
      continue;
    }
    if (!frontmatterDone) continue;
    body.push(line);
  }

  return body.join("\n").trim();
}
