export * from "@grok-skills/spec";

export type InstallScope = "project" | "global";

export type { DiscoveredSkill } from "./discover.js";
export type { ResolveSourceResult } from "./resolve.js";
export type { InstallOptions, InstallResult } from "./install.js";

export { discoverSkills } from "./discover.js";
export { resolveSource } from "./resolve.js";
export { fetchSource } from "./fetch.js";
export { grokSkillsDir } from "./paths.js";
export { installFromSource, listInstalled, removeInstalled } from "./install.js";
export { scaffoldSkill } from "./scaffold.js";
export { reportInstall, telemetryEnabled } from "./telemetry.js";
export { loadBundledCatalog, searchCatalog } from "./search.js";
export type { BundledCatalog } from "./search.js";
