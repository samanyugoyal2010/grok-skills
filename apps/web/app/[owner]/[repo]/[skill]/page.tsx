import Link from "next/link";
import { notFound } from "next/navigation";
import {
  checkSkill,
  parseSkillMarkdown,
} from "@grok-skills/spec";
import { CopyButton } from "@/components/CopyButton";
import {
  formatInstallCount,
  getSkillByPath,
  runtimeLabel,
} from "@/lib/catalog";
import {
  catalogAddCommand,
  gitSkillAddCommand,
  NPX_GROK_SKILLS,
} from "@/lib/install-cmd";
import { readSkillMarkdown, renderSkillBody } from "@/lib/skill-md";

interface SkillPageProps {
  params: Promise<{ owner: string; repo: string; skill: string }>;
}

function SkillMarkdown({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++}>
          {listItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(<h2 key={key++}>{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(<h3 key={key++}>{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
    } else {
      flushList();
      elements.push(<p key={key++}>{trimmed}</p>);
    }
  }
  flushList();

  return <div className="prose-skill">{elements}</div>;
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { owner, repo, skill: skillName } = await params;
  const skill = getSkillByPath(owner, repo, skillName);

  if (!skill) {
    notFound();
  }

  const source = `${owner}/${repo}`;
  const installCmd = catalogAddCommand(skill.name);
  const gitCmd = gitSkillAddCommand(skill.name);
  const rawMarkdown = skill.skillMd || readSkillMarkdown(skill.name);
  let checkOk = false;
  let checkIssues: { level: string; message: string }[] = [];

  if (rawMarkdown) {
    const parsed = parseSkillMarkdown(rawMarkdown, `skills/${skill.name}/SKILL.md`);
    const result = checkSkill(parsed);
    checkOk = result.ok;
    checkIssues = result.issues;
  }

  const body = rawMarkdown ? renderSkillBody(rawMarkdown) : null;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-muted mb-2">
          <Link href="/" className="hover:text-accent">
            Skills
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${owner}/${repo}`} className="hover:text-accent font-mono">
            {source}
          </Link>
          <span className="mx-2">/</span>
          <span>{skill.name}</span>
        </p>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <h1 className="text-3xl font-semibold">{skill.name}</h1>
          {skill.featured && (
            <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border border-accent/40 text-accent">
              featured
            </span>
          )}
        </div>
        {skill.shortDescription && (
          <p className="text-muted mb-2">{skill.shortDescription}</p>
        )}
        <p className="text-sm text-muted/80 mb-4">{skill.description}</p>

        <p className="text-sm text-muted mb-4">
          Catalog install copies bundled SKILL.md into{" "}
          <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">.grok/skills</code>{" "}
          or{" "}
          <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">~/.grok/skills</code>
          . Not on the npm registry — use{" "}
          <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">npx github:…</code>.
        </p>
        <div className="flex items-center gap-3 mb-3">
          <code className="font-mono text-sm bg-white/5 border border-border rounded px-4 py-2.5 overflow-x-auto">
            $ {installCmd}
          </code>
          <CopyButton text={installCmd} />
        </div>
        <p className="text-xs text-muted mb-2">GitHub git install (this branch, one skill):</p>
        <div className="flex items-center gap-3 mb-6">
          <code className="font-mono text-xs bg-white/5 border border-border rounded px-4 py-2 overflow-x-auto">
            $ {gitCmd}
          </code>
          <CopyButton text={gitCmd} />
        </div>

        <div className="border border-border rounded p-4 mb-6 text-sm space-y-2">
          <h3 className="font-medium">Grok Build vs Grok Bot</h3>
          <p className="text-muted">
            <strong className="text-foreground">Build</strong> reads skills from{" "}
            <code className="font-mono text-xs bg-white/5 px-1">.grok/skills</code> in
            the project (and global{" "}
            <code className="font-mono text-xs bg-white/5 px-1">~/.grok/skills</code>{" "}
            when configured).
          </p>
          <p className="text-muted">
            <strong className="text-foreground">Bot</strong> does not load a disk
            install into <code className="font-mono text-xs bg-white/5 px-1">/</code>{" "}
            automatically. Enable the skill under Settings → Plugins, or paste
            SKILL.md:
          </p>
          <code className="font-mono text-xs bg-white/5 border border-border rounded px-3 py-2 block overflow-x-auto">
            {NPX_GROK_SKILLS} print {skill.name}
          </code>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="border border-border rounded p-4">
            <h3 className="text-muted text-xs uppercase tracking-wide mb-2">
              Runtime
            </h3>
            <p>{runtimeLabel(skill.runtime)}</p>
          </div>
          <div className="border border-border rounded p-4">
            <h3 className="text-muted text-xs uppercase tracking-wide mb-2">
              Installs
            </h3>
            <p className="tabular-nums">
              {skill.installs > 0 ? formatInstallCount(skill.installs) : "—"}
            </p>
          </div>
          <div className="border border-border rounded p-4">
            <h3 className="text-muted text-xs uppercase tracking-wide mb-2">
              Connectors
            </h3>
            <p>
              {skill.connectors.length > 0
                ? skill.connectors.join(", ")
                : "None"}
            </p>
          </div>
          <div className="border border-border rounded p-4">
            <h3 className="text-muted text-xs uppercase tracking-wide mb-2">
              Computer use
            </h3>
            <p>{skill.computerUse ? "Yes" : "No"}</p>
          </div>
          <div className="border border-border rounded p-4 sm:col-span-2">
            <h3 className="text-muted text-xs uppercase tracking-wide mb-2">
              Approvals
            </h3>
            <p>
              {skill.approvals.length > 0
                ? skill.approvals.join(", ")
                : "None required"}
            </p>
          </div>
        </div>
      </div>

      <div
        className={`border rounded p-4 mb-8 text-sm ${
          rawMarkdown
            ? checkOk
              ? "border-green-800/50 bg-green-950/20"
              : "border-yellow-800/50 bg-yellow-950/20"
            : "border-border bg-white/[0.02]"
        }`}
      >
        <h3 className="font-medium mb-2">Security check</h3>
        {!rawMarkdown ? (
          <p className="text-muted">
            SKILL.md not in catalog JSON and not found on disk. Security
            validation unavailable.
          </p>
        ) : checkOk ? (
          <p className="text-green-400/90">
            Passed spec validation for {skill.runtime} runtime.
          </p>
        ) : (
          <div>
            <p className="text-yellow-400/90 mb-2">
              Validation issues found:
            </p>
            <ul className="list-disc ml-5 text-muted">
              {checkIssues.map((issue, i) => (
                <li key={i}>
                  <span
                    className={
                      issue.level === "error" ? "text-red-400" : "text-yellow-400"
                    }
                  >
                    [{issue.level}]
                  </span>{" "}
                  {issue.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {body && (
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b border-border pb-2">
            SKILL.md
          </h2>
          <SkillMarkdown content={body} />
        </section>
      )}
    </div>
  );
}
