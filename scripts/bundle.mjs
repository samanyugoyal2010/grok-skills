import * as esbuild from "esbuild";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

await esbuild.build({
  absWorkingDir: root,
  entryPoints: ["packages/cli/src/cli.ts"],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: "bin/grok-skills.mjs",
  banner: {
    js: `#!/usr/bin/env node
import { createRequire as __grokCreateRequire } from "node:module";
const require = __grokCreateRequire(import.meta.url);
`,
  },
  alias: {
    "@grok-skills/core": "./packages/core/src/index.ts",
    "@grok-skills/spec": "./packages/spec/src/index.ts",
  },
});
