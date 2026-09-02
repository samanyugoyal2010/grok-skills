import Link from "next/link";
import { GITHUB_REF, NPX_GROK_SKILLS, PRIMARY_INSTALL_HINT } from "@/lib/install-cmd";

export default function CliDocsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">CLI Reference</h1>

      <div className="space-y-6 text-foreground/90 leading-relaxed">
        <p>
          <code className="font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">
            grok-skills
          </code>{" "}
          is not published on npm. Run it from this GitHub repo (or{" "}
          <code className="font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">
            node bin/grok-skills.mjs
          </code>{" "}
          in a checkout).
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-3">Installation</h2>
          <pre className="font-mono text-sm bg-white/5 border border-border rounded p-4 overflow-x-auto">
            {PRIMARY_INSTALL_HINT}
          </pre>
          <p className="text-sm text-muted mt-2">
            Catalog names (for example <code className="font-mono">inbox-triage</code>)
            copy bundled SKILL.md. No GitHub clone. Prefix{" "}
            <code className="font-mono">npx --yes github:samanyugoyal2010/grok-skills</code>{" "}
            on every command below, or use the local bin.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Commands</h2>
          <div className="space-y-4 text-sm">
            <div className="border border-border rounded p-4">
              <code className="font-mono text-accent">add NAME</code>
              <p className="mt-2 text-muted">
                Install one catalog skill by name. Copies from the bundled
                catalog. Does not need <code className="font-mono">--yes</code>.
              </p>
              <pre className="font-mono text-xs bg-white/5 rounded p-3 mt-2 overflow-x-auto">
                {`${NPX_GROK_SKILLS} add inbox-triage -g\n${NPX_GROK_SKILLS} add find-skills -g`}
              </pre>
            </div>

            <div className="border border-border rounded p-4">
              <code className="font-mono text-accent">add owner/repo@ref</code>
              <p className="mt-2 text-muted">
                Clone a GitHub source. Default clone uses the default branch
                (GitHub <code className="font-mono">main</code> may still be
                empty until this work is merged). Pass{" "}
                <code className="font-mono">@ref</code> for a branch. Never
                installs a whole pack unless you pass{" "}
                <code className="font-mono">--skill</code> or{" "}
                <code className="font-mono">--all</code>.
              </p>
              <pre className="font-mono text-xs bg-white/5 rounded p-3 mt-2 overflow-x-auto">
                {`${NPX_GROK_SKILLS} add ${GITHUB_REF} --skill inbox-triage\n${NPX_GROK_SKILLS} add ${GITHUB_REF} --all -y`}
              </pre>
            </div>

            <div className="border border-border rounded p-4">
              <code className="font-mono text-accent">find --json</code>
              <p className="mt-2 text-muted">
                Search the bundled catalog (no website required).{" "}
                <code className="font-mono">--json</code> is for Grok Bot.
                Empty query with <code className="font-mono">--json</code> from
                a non-TTY returns an error. Optional overlay from{" "}
                <code className="font-mono">$GROK_SKILLS_REGISTRY/api/search</code>{" "}
                when that origin is set.
              </p>
              <pre className="font-mono text-xs bg-white/5 rounded p-3 mt-2 overflow-x-auto">
                {`${NPX_GROK_SKILLS} find "inbox triage" --json`}
              </pre>
            </div>

            <div className="border border-border rounded p-4">
              <code className="font-mono text-accent">setup</code>
              <p className="mt-2 text-muted">
                Installs <code className="font-mono">find-skills</code> globally
                and writes{" "}
                <code className="font-mono">~/.grok/plugins/grok-skills/</code>{" "}
                (plugin.json plus that skill). Grok Build reads{" "}
                <code className="font-mono">.grok/skills</code>. Grok Bot may
                still need Settings → Plugins or a paste of SKILL.md.
              </p>
              <pre className="font-mono text-xs bg-white/5 rounded p-3 mt-2 overflow-x-auto">
                {`${NPX_GROK_SKILLS} setup`}
              </pre>
            </div>

            <div className="border border-border rounded p-4">
              <code className="font-mono text-accent">print</code>
              <p className="mt-2 text-muted">
                Print a skill&apos;s SKILL.md (for pasting into Grok Bot).
              </p>
              <pre className="font-mono text-xs bg-white/5 rounded p-3 mt-2 overflow-x-auto">
                {`${NPX_GROK_SKILLS} print find-skills`}
              </pre>
            </div>

            <div className="border border-border rounded p-4">
              <code className="font-mono text-accent">list</code>
              <p className="mt-2 text-muted">
                List installed skills in the current project or globally.
              </p>
            </div>

            <div className="border border-border rounded p-4">
              <code className="font-mono text-accent">remove</code>
              <p className="mt-2 text-muted">Remove an installed skill by name.</p>
            </div>

            <div className="border border-border rounded p-4">
              <code className="font-mono text-accent">init</code>
              <p className="mt-2 text-muted">
                Scaffold a new SKILL.md in the current directory.
              </p>
            </div>

            <div className="border border-border rounded p-4">
              <code className="font-mono text-accent">check</code>
              <p className="mt-2 text-muted">
                Validate a SKILL.md against the Grok skills spec.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Flags</h2>
          <table className="w-full text-sm border border-border rounded overflow-hidden">
            <thead>
              <tr className="border-b border-border bg-white/[0.02]">
                <th className="text-left p-3 font-normal text-muted">Flag</th>
                <th className="text-left p-3 font-normal text-muted">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-mono text-xs">-g, --global</td>
                <td className="p-3 text-muted">Install to ~/.grok/skills/</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-mono text-xs">-s, --skill</td>
                <td className="p-3 text-muted">
                  Install a single skill from a git/local pack (required unless
                  --all when the source has more than one skill)
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-mono text-xs">--all</td>
                <td className="p-3 text-muted">
                  Install every skill from a git or local pack
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-mono text-xs">-l, --list</td>
                <td className="p-3 text-muted">List available skills without installing</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">-y, --yes</td>
                <td className="p-3 text-muted">
                  Skip confirmation. Required for git/local packs when stdin is
                  not a TTY. Catalog single-skill add does not need --yes.
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Environment</h2>
          <table className="w-full text-sm border border-border rounded overflow-hidden">
            <thead>
              <tr className="border-b border-border bg-white/[0.02]">
                <th className="text-left p-3 font-normal text-muted">Variable</th>
                <th className="text-left p-3 font-normal text-muted">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-3 font-mono text-xs">GROK_SKILLS_REGISTRY</td>
                <td className="p-3 text-muted">
                  Deployed site origin for optional search overlay and install
                  telemetry (POST /api/t). Unset by default — no localhost
                  telemetry.
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-mono text-xs">DISABLE_TELEMETRY</td>
                <td className="p-3 text-muted">Set to 1 to disable install tracking</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">DO_NOT_TRACK</td>
                <td className="p-3 text-muted">Set to 1 to disable install tracking</td>
              </tr>
            </tbody>
          </table>
        </section>

        <p className="mt-8">
          <Link href="/" className="text-accent hover:underline">
            ← Back to directory
          </Link>
        </p>
      </div>
    </div>
  );
}
