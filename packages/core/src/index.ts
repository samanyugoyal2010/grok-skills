export * from "@grok-skills/spec";

export type InstallScope = "project" | "global";

export type { DiscoveredSkill } from "./discover.js";
export type { ResolveSourceResult } from "./resolve.js";
export type { InstallOptions, InstallResult } from "./install.js";
export type { WriteGrokPluginOptions } from "./plugin.js";

export { discoverSkills } from "./discover.js";
export { resolveSource } from "./resolve.js";
export { fetchSource } from "./fetch.js";
export { grokSkillsDir } from "./paths.js";
export {
  installFromSource,
  installFromCatalog,
  listInstalled,
  removeInstalled,
} from "./install.js";
export { scaffoldSkill } from "./scaffold.js";
export {
  reportInstall,
  telemetryEnabled,
  defaultTelemetryEndpoint,
} from "./telemetry.js";
export {
  loadBundledCatalog,
  searchCatalog,
  printSkillMarkdown,
  findCatalogSkill,
} from "./search.js";
export type { BundledCatalog } from "./search.js";
export { writeGrokPlugin } from "./plugin.js";
