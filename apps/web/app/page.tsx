import { HomeClientShell } from "@/components/HomeClientShell";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import {
  getCatalog,
  matchesRuntime,
  sortSkills,
  type RuntimeFilter,
  type SortMode,
} from "@/lib/catalog";

interface HomeProps {
  searchParams: Promise<{
    tab?: string;
    runtime?: string;
  }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const tab = (params.tab as SortMode) || "all-time";
  const runtime = (params.runtime as RuntimeFilter) || "all";

  const catalog = getCatalog();
  const filtered = catalog.skills.filter((s) => matchesRuntime(s, runtime));
  const sorted = sortSkills(filtered, tab);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight mb-2">Skills</h1>
        <p className="text-lg text-muted mb-1">
          The Grok Agent Skills Directory
        </p>
        <p className="text-sm text-muted/80">
          Reusable capabilities for Grok Bot. Install from the bundled catalog
          via <code className="font-mono text-xs">npx github:…/grok-skills</code>
          — not published on npm.
        </p>
      </div>

      <HomeClientShell>
        <LeaderboardTable skills={sorted} />
      </HomeClientShell>
    </div>
  );
}
