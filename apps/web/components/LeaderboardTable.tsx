import Link from "next/link";
import type { CatalogSkill } from "@grok-skills/spec";
import { formatInstallCount } from "@/lib/catalog";

interface LeaderboardTableProps {
  skills: CatalogSkill[];
}

export function LeaderboardTable({ skills }: LeaderboardTableProps) {
  if (skills.length === 0) {
    return (
      <p className="py-8 text-center text-muted text-sm">No skills found.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted">
            <th className="py-3 pr-4 font-normal w-10">#</th>
            <th className="py-3 pr-4 font-normal">Skill</th>
            <th className="py-3 pr-4 font-normal hidden sm:table-cell">
              Source
            </th>
            <th className="py-3 font-normal text-right">Installs</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill, index) => (
            <tr
              key={skill.id}
              className="border-b border-border/50 hover:bg-white/[0.02]"
            >
              <td className="py-3 pr-4 text-muted tabular-nums">{index + 1}</td>
              <td className="py-3 pr-4">
                <Link
                  href={`/${skill.owner}/${skill.repo}/${skill.name}`}
                  className="font-medium hover:text-accent"
                >
                  {skill.name}
                </Link>
                {skill.shortDescription && (
                  <p className="text-muted text-xs mt-0.5 sm:hidden">
                    {skill.shortDescription}
                  </p>
                )}
              </td>
              <td className="py-3 pr-4 hidden sm:table-cell">
                <Link
                  href={`/${skill.owner}/${skill.repo}`}
                  className="text-muted hover:text-accent font-mono text-xs"
                >
                  {skill.source}
                </Link>
              </td>
              <td className="py-3 text-right tabular-nums text-muted">
                {formatInstallCount(skill.installs)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
