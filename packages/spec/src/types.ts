export const REQUIRED_BOT_HEADINGS = [
  "when to use",
  "required inputs and access",
  "sequence of work",
  "how to validate the result",
  "what to return",
  "approvals and safety",
] as const;

export const RUNTIMES = ["grok-bot", "grok-build", "both"] as const;
export type Runtime = (typeof RUNTIMES)[number];

export const SKILL_NAME_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface SkillFrontmatter {
  name?: string;
  description?: string;
  "when-to-use"?: string;
  when_to_use?: string;
  paths?: string | string[];
  "allowed-tools"?: string | string[];
  "argument-hint"?: string;
  "user-invocable"?: boolean;
  "disable-model-invocation"?: boolean;
  metadata?: SkillMetadata;
}

export interface SkillMetadata {
  author?: string;
  "short-description"?: string;
  runtime?: Runtime | string;
  connectors?: string[];
  "computer-use"?: boolean;
  approvals?: string[];
  [key: string]: unknown;
}

export interface ParsedSkill {
  path: string;
  dir: string;
  name: string;
  description: string;
  whenToUse: string;
  body: string;
  frontmatter: SkillFrontmatter;
  metadata: SkillMetadata;
  runtime: Runtime;
  connectors: string[];
  computerUse: boolean;
  approvals: string[];
  headings: string[];
}

export interface CheckIssue {
  level: "error" | "warning";
  code: string;
  message: string;
}

export interface CheckResult {
  ok: boolean;
  issues: CheckIssue[];
}

export interface CatalogSkill {
  id: string;
  skillId: string;
  name: string;
  description: string;
  owner: string;
  repo: string;
  source: string;
  runtime: Runtime;
  connectors: string[];
  computerUse: boolean;
  approvals: string[];
  installs: number;
  installs24h: number;
  author?: string;
  shortDescription?: string;
  skillMd?: string;
}

export interface TelemetryEvent {
  skillId: string;
  source: string;
  sha?: string;
  runtimeHint?: Runtime;
  cliVersion?: string;
  anonymousId?: string;
}
