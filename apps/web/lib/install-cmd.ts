export const NPX_GROK_SKILLS =
  "npx --yes github:samanyugoyal2010/grok-skills";

export const GITHUB_REF =
  "samanyugoyal2010/grok-skills@cursor/grok-bot-skills-directory-plan-7471";

/** Catalog add (bundled SKILL.md; no GitHub clone). */
export function catalogAddCommand(skillName: string): string {
  return `${NPX_GROK_SKILLS} add ${skillName} -g`;
}

/** Git clone of this repo at the skills branch, one skill only. */
export function gitSkillAddCommand(skillName: string): string {
  return `${NPX_GROK_SKILLS} add ${GITHUB_REF} --skill ${skillName}`;
}

export const PRIMARY_INSTALL_HINT = `${NPX_GROK_SKILLS} add <skill-name> -g`;
