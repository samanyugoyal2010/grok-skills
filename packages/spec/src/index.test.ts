import assert from "node:assert/strict";
import test from "node:test";
import { parseSkillMarkdown } from "./parse.js";
import { checkSkill } from "./check.js";

const SAMPLE = `---
name: weekly-account-health
description: Score CRM accounts for churn risk. Use when the user asks for weekly account health.
metadata:
  runtime: grok-bot
  connectors: [salesforce]
  computer-use: false
  approvals: [customer-contact]
---

## When to use

Use for weekly CRM risk reviews.

## Required inputs and access

Salesforce read access.

## Sequence of work

1. Pull the account list.
2. Score risk.

## How to validate the result

Every row has a source record id.

## What to return

A review list. Do not contact customers.

## Approvals and safety

Customer contact always requires approval.
`;

test("parses frontmatter and headings", () => {
  const skill = parseSkillMarkdown(SAMPLE, "/tmp/weekly-account-health/SKILL.md");
  assert.equal(skill.name, "weekly-account-health");
  assert.equal(skill.runtime, "grok-bot");
  assert.deepEqual(skill.connectors, ["salesforce"]);
  assert.equal(skill.computerUse, false);
  assert.ok(skill.headings.some((h) => h.includes("approvals")));
});

test("checkSkill accepts a complete bot skill", () => {
  const result = checkSkill(parseSkillMarkdown(SAMPLE, "x/SKILL.md"));
  assert.equal(result.ok, true, JSON.stringify(result.issues));
});

test("checkSkill rejects missing bot headings", () => {
  const result = checkSkill(
    parseSkillMarkdown(
      `---
name: bad-skill
description: Does something when asked.
metadata:
  runtime: grok-bot
---

Just a paragraph.
`,
      "bad/SKILL.md"
    )
  );
  assert.equal(result.ok, false);
  assert.ok(result.issues.some((i) => i.code === "heading.missing"));
});
