import Link from "next/link";

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">About</h1>

      <div className="space-y-4 text-foreground/90 leading-relaxed">
        <p>
          <strong className="text-foreground">Skills</strong> is the Grok Agent
          Skills Directory — a registry of reusable capabilities for Grok Bot
          and Grok Build. Think of it as skills.sh, but purpose-built for the
          Grok ecosystem.
        </p>

        <p>
          Skills are self-contained packages defined by a{" "}
          <code className="font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">
            SKILL.md
          </code>{" "}
          file. Each skill describes what it does, what connectors it needs, and
          what approvals are required before taking action.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Install a skill</h2>
        <p>
          Use the Grok Skills CLI to add skills to your project or global
          config:
        </p>
        <pre className="font-mono text-sm bg-white/5 border border-border rounded p-4 overflow-x-auto">
          npx grok-skills add grok-skills/grok-skills
        </pre>
        <p>
          Skills are copied into{" "}
          <code className="font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">
            .grok/skills/
          </code>{" "}
          in your project, or{" "}
          <code className="font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">
            ~/.grok/skills/
          </code>{" "}
          for global installs.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Leaderboard</h2>
        <p>
          Install counts are tracked anonymously when you use the CLI. The
          homepage ranks skills by all-time installs, 24-hour trending, and a
          hot score that weights recent activity.
        </p>

        <p className="mt-8">
          <Link href="/docs/cli" className="text-accent hover:underline">
            Read the CLI documentation →
          </Link>
        </p>
      </div>
    </div>
  );
}
