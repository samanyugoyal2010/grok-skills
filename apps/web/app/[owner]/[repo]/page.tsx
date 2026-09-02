import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton";
import {
  formatInstallCount,
  getSkillsByRepo,
  runtimeLabel,
  sortSkills,
} from "@/lib/catalog";
import { GITHUB_REF, NPX_GROK_SKILLS, PRIMARY_INSTALL_HINT } from "@/lib/install-cmd";

interface RepoPageProps {
  params: Promise<{ owner: string; repo: string }>;
}

export default async function RepoPage({ params }: RepoPageProps) {
  const { owner, repo } = await params;
  const skills = sortSkills(getSkillsByRepo(owner, repo), "all-time");

  if (skills.length === 0) {
    notFound();
  }

  const source = `${owner}/${repo}`;
  const gitList = `${NPX_GROK_SKILLS} add ${GITHUB_REF} --list`;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-muted mb-2">
          <Link href="/" className="hover:text-accent">
            Skills
          </Link>
          <span className="mx-2">/</span>
          <span className="font-mono">{source}</span>
        </p>
        <h1 className="text-3xl font-semibold mb-2 font-mono">{source}</h1>
        <p className="text-muted text-sm mb-4">
          {skills.length} skill{skills.length !== 1 ? "s" : ""} in this pack.
          Catalog add uses a skill name (no whole-pack install). Git installs
          require <code className="font-mono text-xs">--skill</code> or{" "}
          <code className="font-mono text-xs">--all</code>.
        </p>
        <div className="flex items-center gap-3 mb-3">
          <code className="font-mono text-sm bg-white/5 border border-border rounded px-4 py-2.5 overflow-x-auto">
            $ {PRIMARY_INSTALL_HINT}
          </code>
          <CopyButton text={PRIMARY_INSTALL_HINT} />
        </div>
        <div className="flex items-center gap-3">
          <code className="font-mono text-xs bg-white/5 border border-border rounded px-4 py-2 overflow-x-auto">
            $ {gitList}
          </code>
          <CopyButton text={gitList} />
        </div>
      </div>

      <div className="space-y-4">
        {skills.map((skill) => (
          <Link
            key={skill.id}
            href={`/${owner}/${repo}/${skill.name}`}
            className="block border border-border rounded p-4 hover:border-accent/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-medium text-lg">{skill.name}</h2>
                  {skill.featured && (
                    <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded border border-accent/40 text-accent">
                      featured
                    </span>
                  )}
                </div>
                {skill.shortDescription && (
                  <p className="text-sm text-muted mt-1">
                    {skill.shortDescription}
                  </p>
                )}
                <p className="text-sm text-muted/80 mt-2 line-clamp-2">
                  {skill.description}
                </p>
              </div>
              <span className="text-sm text-muted tabular-nums shrink-0">
                {skill.installs > 0 ? formatInstallCount(skill.installs) : "—"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs px-2 py-0.5 rounded border border-border text-muted">
                {runtimeLabel(skill.runtime)}
              </span>
              {skill.connectors.map((c) => (
                <span
                  key={c}
                  className="text-xs px-2 py-0.5 rounded border border-border text-muted"
                >
                  {c}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
