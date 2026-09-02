import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseArgv } from "./parse.js";

describe("parseArgv", () => {
  it("parses add with global and skill", () => {
    assert.deepEqual(parseArgv(["add", "owner/repo", "-g", "-s", "foo"]), {
      command: "add",
      source: "owner/repo",
      global: true,
      skills: ["foo"],
      list: false,
      yes: false,
    });
  });

  it("parses check without path", () => {
    assert.deepEqual(parseArgv(["check"]), {
      command: "check",
      path: undefined,
    });
  });

  it("parses find with query", () => {
    assert.deepEqual(parseArgv(["find", "inbox"]), {
      command: "find",
      query: "inbox",
      json: false,
      limit: 10,
    });
  });

  it("parses find --json --limit", () => {
    assert.deepEqual(parseArgv(["find", "pr", "review", "--json", "--limit", "5"]), {
      command: "find",
      query: "pr review",
      json: true,
      limit: 5,
    });
  });
});
