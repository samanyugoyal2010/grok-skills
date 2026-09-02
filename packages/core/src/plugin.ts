import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { printSkillMarkdown } from "./search.js";

export interface WriteGrokPluginOptions {
  home?: string;
}

export async function writeGrokPlugin(opts: WriteGrokPluginOptions = {}): Promise<string> {
  const home = opts.home ?? homedir();
  const pluginRoot = join(home, ".grok", "plugins", "grok-skills");
  const skillDir = join(pluginRoot, "skills", "find-skills");
  await mkdir(skillDir, { recursive: true });
  const pluginJson = {
    name: "grok-skills",
    version: "0.1.0",
    description: "Catalog finder for Grok",
    skills: "./skills",
  };
  await writeFile(join(pluginRoot, "plugin.json"), `${JSON.stringify(pluginJson, null, 2)}\n`, "utf8");
  await writeFile(join(skillDir, "SKILL.md"), printSkillMarkdown("find-skills"), "utf8");
  return pluginRoot;
}
