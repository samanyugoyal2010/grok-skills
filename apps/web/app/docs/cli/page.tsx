import Link from "next/link";

export default function CliDocsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-6">CLI Reference</h1>

      <div className="space-y-6 text-foreground/90 leading-relaxed">
        <p>
          The{" "}
          <code className="font-mono text-sm bg-white/5 px-1.5 py-0.5 rounded">
            grok-skills
          </code>{" "}
          CLI installs and manages Grok skills from this directory or any Git
          source.
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-3">Installation</h2>
          <pre className="font-mono text-sm bg-white/5 border border-border rounded p-4 overflow-x-auto">
            npx grok-skills add &lt;owner/repo&gt;
          </pre>
          <p className="text-sm text-muted mt-2">
            No global install required. Run via npx.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Commands</h2>
          <div className="space-y-4 text-sm">
            <div className="border border-border rounded p-4">
              <code className="font-mono text-accent">add</code>
              <p className="mt-2 text-muted">
                Install skills from a source. Accepts GitHub owner/repo, HTTPS
                URLs, git@ URLs, or local paths.
              </p>
              <pre className="font-mono text-xs bg-white/5 rounded p-3 mt-2 overflow-x-auto">
                grok-skills add grok-skills/grok-skills{"\n"}
                grok-skills add grok-skills/grok-skills --skill inbox-triage{"\n"}
                grok-skills add grok-skills/grok-skills -g
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
              <code className="font-mono text-accent">find</code>
              <p className="mt-2 text-muted">
                Search the skills directory from the terminal.
              </p>
              <pre className="font-mono text-xs bg-white/5 rounded p-3 mt-2 overflow-x-auto">
                grok-skills find inbox
              </pre>
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
                <td className="p-3 text-muted">Install a single skill by name</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-3 font-mono text-xs">-l, --list</td>
                <td className="p-3 text-muted">List available skills without installing</td>
              </tr>
              <tr>
                <td className="p-3 font-mono text-xs">-y, --yes</td>
                <td className="p-3 text-muted">Skip confirmation prompts</td>
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
                  Registry URL for search and telemetry (default: localhost:3000)
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
