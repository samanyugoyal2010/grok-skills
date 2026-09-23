import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { resolveContainedPath } from "./serve-static.mjs";

test("keeps static paths inside the export root", () => {
const root = resolve("/tmp/skillchef-docs/out");
  assert.equal(resolveContainedPath(root, "/index.html"), resolve(root, "index.html"));
  assert.equal(resolveContainedPath(root, "../../etc/passwd"), null);
  assert.equal(resolveContainedPath(root, "/../etc/passwd"), null);
});
