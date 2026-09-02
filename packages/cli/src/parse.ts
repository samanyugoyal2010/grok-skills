export type Parsed =
  | {
      command: "add";
      source: string;
      global: boolean;
      skills: string[];
      list: boolean;
      yes: boolean;
    }
  | { command: "list"; global: boolean }
  | { command: "remove"; name: string; global: boolean }
  | { command: "find"; query: string }
  | { command: "init"; name: string; global: boolean }
  | { command: "check"; path?: string }
  | { command: "help" };

function nextValue(args: string[], i: number): string | undefined {
  return i + 1 < args.length && !args[i + 1]!.startsWith("-") ? args[i + 1] : undefined;
}

function parseGlobal(args: string[], i: number): boolean {
  const arg = args[i]!;
  return arg === "-g" || arg === "--global";
}

export function parseArgv(argv: string[]): Parsed {
  if (argv.length === 0) {
    return { command: "help" };
  }

  const [cmd, ...rest] = argv;

  if (cmd === "help" || cmd === "--help" || cmd === "-h") {
    return { command: "help" };
  }

  switch (cmd) {
    case "add": {
      let source = "";
      let global = false;
      const skills: string[] = [];
      let list = false;
      let yes = false;

      for (let i = 0; i < rest.length; i++) {
        const arg = rest[i]!;
        if (arg === "-g" || arg === "--global") {
          global = true;
        } else if (arg === "-l" || arg === "--list") {
          list = true;
        } else if (arg === "-y" || arg === "--yes") {
          yes = true;
        } else if (arg === "-s" || arg === "--skill") {
          const value = nextValue(rest, i);
          if (!value) {
            throw new Error("Missing value for --skill");
          }
          skills.push(value);
          i++;
        } else if (!arg.startsWith("-")) {
          source = arg;
        } else {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }

      if (!source) {
        throw new Error("add requires a <source> argument");
      }

      return { command: "add", source, global, skills, list, yes };
    }

    case "list": {
      let global = false;
      for (const arg of rest) {
        if (arg === "-g" || arg === "--global") {
          global = true;
        } else if (!arg.startsWith("-")) {
          throw new Error(`Unexpected argument: ${arg}`);
        } else {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }
      return { command: "list", global };
    }

    case "remove": {
      let name = "";
      let global = false;

      for (let i = 0; i < rest.length; i++) {
        const arg = rest[i]!;
        if (parseGlobal(rest, i)) {
          global = true;
        } else if (!arg.startsWith("-")) {
          name = arg;
        } else {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }

      if (!name) {
        throw new Error("remove requires a <name> argument");
      }

      return { command: "remove", name, global };
    }

    case "find": {
      const query = rest.find((arg) => !arg.startsWith("-"));
      if (!query) {
        throw new Error("find requires a <query> argument");
      }
      for (const arg of rest) {
        if (arg.startsWith("-")) {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }
      return { command: "find", query };
    }

    case "init": {
      let name = "";
      let global = false;

      for (const arg of rest) {
        if (arg === "--global") {
          global = true;
        } else if (!arg.startsWith("-")) {
          name = arg;
        } else {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }

      if (!name) {
        throw new Error("init requires a <name> argument");
      }

      return { command: "init", name, global };
    }

    case "check": {
      const positional = rest.filter((arg) => !arg.startsWith("-"));
      for (const arg of rest) {
        if (arg.startsWith("-")) {
          throw new Error(`Unknown flag: ${arg}`);
        }
      }
      return { command: "check", path: positional[0] };
    }

    default:
      return { command: "help" };
  }
}
