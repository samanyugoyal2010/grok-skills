import { REQUIRED_BOT_HEADINGS, SKILL_NAME_RE, type CheckIssue, type CheckResult, type ParsedSkill } from "./types.js";
import { headingMatches } from "./parse.js";

const CREDENTIAL_RE =
  /\b(api[_-]?key|secret|password|token)\s*[:=]\s*['"]?[A-Za-z0-9_\-]{12,}/i;
const PIPE_BASH_RE = /curl\s+[^\n|]+\|\s*(?:ba)?sh/i;
const IGNORE_PREVIOUS_RE = /ignore (all )?(previous|prior) instructions/i;

export function checkSkill(skill: ParsedSkill): CheckResult {
  const issues: CheckIssue[] = [];

  if (!skill.name) {
    issues.push({ level: "error", code: "name.missing", message: "Skill name is required." });
  } else if (!SKILL_NAME_RE.test(skill.name)) {
    issues.push({
      level: "error",
      code: "name.invalid",
      message: "Name must be lowercase letters, digits, and single hyphens (1–64 chars).",
    });
  } else if (skill.name.length > 64) {
    issues.push({ level: "error", code: "name.length", message: "Name must be at most 64 characters." });
  }

  if (!skill.description) {
    issues.push({
      level: "error",
      code: "description.missing",
      message: "Description is required (frontmatter or first body paragraph).",
    });
  } else if (skill.description.length > 1024) {
    issues.push({
      level: "error",
      code: "description.length",
      message: "Description must be at most 1024 characters.",
    });
  }

  const botLike = skill.runtime === "grok-bot" || skill.runtime === "both";
  if (botLike) {
    for (const required of REQUIRED_BOT_HEADINGS) {
      if (!headingMatches(skill.headings, required)) {
        issues.push({
          level: "error",
          code: "heading.missing",
          message: `Grok Bot skills must include a heading covering: ${required}.`,
        });
      }
    }
    if (skill.approvals.length === 0) {
      issues.push({
        level: "error",
        code: "approvals.missing",
        message: "Set metadata.approvals (or an Approvals section) for Grok Bot skills.",
      });
    }
  }

  const blob = `${skill.description}\n${skill.body}`;
  if (CREDENTIAL_RE.test(blob)) {
    issues.push({
      level: "error",
      code: "security.credential",
      message: "Possible hardcoded credential detected.",
    });
  }
  if (PIPE_BASH_RE.test(blob)) {
    issues.push({
      level: "error",
      code: "security.pipe-bash",
      message: "curl | bash patterns are not allowed in listed skills.",
    });
  }
  if (IGNORE_PREVIOUS_RE.test(blob)) {
    issues.push({
      level: "error",
      code: "security.injection",
      message: "Prompt-injection phrasing detected.",
    });
  }

  if (skill.body.length > 80_000) {
    issues.push({
      level: "warning",
      code: "body.size",
      message: "SKILL.md body is unusually large.",
    });
  }

  return { ok: issues.every((i) => i.level !== "error"), issues };
}
