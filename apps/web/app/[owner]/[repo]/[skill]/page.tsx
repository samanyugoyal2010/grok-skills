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
  const installCmd = `npx grok-skills add ${source} --skill ${skill.name}`;
  const rawMarkdown = readSkillMarkdown(skill.name);
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
        <h1 className="text-3xl font-semibold mb-2">{skill.name}</h1>
        {skill.shortDescription && (
          <p className="text-muted mb-2">{skill.shortDescription}</p>
        )}
        <p className="text-sm text-muted/80 mb-4">{skill.description}</p>

        <p className="text-sm text-muted mb-6">
          Installs into <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">.grok/skills</code>{" "}
          or <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">~/.grok/skills</code>.
          In Grok Bot, type <code className="font-mono text-xs bg-white/5 px-1.5 py-0.5 rounded">/</code> to
          invoke it, or enable it under Settings → Plugins if it does not appear.
        </p>
        <div className="flex items-center gap-3 mb-6">
          <code className="font-mono text-sm bg-white/5 border border-border rounded px-4 py-2.5 overflow-x-auto">
            $ {installCmd}
          </code>
          <CopyButton text={installCmd} />
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
            <p className="tabular-nums">{formatInstallCount(skill.installs)}</p>
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
            SKILL.md not found on disk. Security validation unavailable.
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
