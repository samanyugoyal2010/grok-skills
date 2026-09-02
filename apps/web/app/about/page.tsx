import Link from "next/link";
import { GITHUB_REF, NPX_GROK_SKILLS, PRIMARY_INSTALL_HINT } from "@/lib/install-cmd";

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">About</h1>

      <div className="space-y-4 text-foreground/90 leading-relaxed">
        <p>
          <strong className="text-foreground">Skills</strong> is a community
          directory of reusable <code className="font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">SKILL.md</code>{" "}
          packages for Grok Bot and Grok Build. It is inspired by skills.sh.{" "}
          <strong className="text-foreground">Not affiliated with xAI or Vercel.</strong>
        </p>

        <p>
          Featured skills are hand-written. The rest of the catalog is generated
          from templates (distinct tasks and approvals, not 162 unique essays).
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Install a skill</h2>
        <p>
          The CLI is not on the npm registry. Use the GitHub installer, then a
          catalog skill name (copies bundled SKILL.md; no GitHub clone):
        </p>
        <pre className="font-mono text-sm bg-white/5 border border-border rounded p-4 overflow-x-auto">
          {PRIMARY_INSTALL_HINT}
        </pre>
        <p>To install from this branch on GitHub (one skill at a time):</p>
        <pre className="font-mono text-sm bg-white/5 border border-border rounded p-4 overflow-x-auto">
          {NPX_GROK_SKILLS} add {GITHUB_REF} --skill inbox-triage
        </pre>
        <p>
          Skills land in{" "}
          <code className="font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">
            .grok/skills/
          </code>{" "}
          or{" "}
          <code className="font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">
            ~/.grok/skills/
          </code>
          . Grok <strong>Build</strong> reads project skills from disk. Grok{" "}
          <strong>Bot</strong> does not pick them up automatically — use Settings
          → Plugins or paste SKILL.md.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-2">Leaderboard</h2>
        <p>
          Ranking uses opt-in telemetry only: the CLI POSTs to{" "}
          <code className="font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">
            $GROK_SKILLS_REGISTRY/api/t
          </code>{" "}
          when that variable is the deployed site origin. With the local
          default (registry unset), telemetry is off and catalog seed counts
          are 0 — there are no public install numbers until a registry is
          deployed and clients point at it.
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
