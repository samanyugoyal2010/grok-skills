import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { REQUIRED_BOT_HEADINGS, type Runtime } from "@grok-skills/spec";

function titleCaseHeading(heading: string): string {
  return heading
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function scaffoldSkill(
  dir: string,
  name: string,
  opts: { runtime?: Runtime } = {}
): void {
  const runtime = opts.runtime ?? "grok-bot";
  const description = `Use when the user asks for help with ${name.replace(/-/g, " ")}.`;

  const headings = REQUIRED_BOT_HEADINGS.map((heading) => {
    const title = titleCaseHeading(heading);
    let body = "Describe this section for your skill.";
    if (heading === "approvals and safety") {
      body = "List actions that require user approval before execution.";
    }
    return `## ${title}\n\n${body}`;
  }).join("\n\n");

  const content = `---
name: ${name}
description: ${description}
when-to-use: ${name.replace(/-/g, " ")}
metadata:
  runtime: ${runtime}
  connectors: []
  computer-use: false
  approvals: [user-approval]
---

${headings}
`;

  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "SKILL.md"), content, "utf8");
}
