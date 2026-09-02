import Link from "next/link";
import { SearchBox } from "@/components/SearchBox";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import { getCatalog, searchSkills } from "@/lib/catalog";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const catalog = getCatalog();
  const results = searchSkills(catalog.skills, query);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-4">Search</h1>
        <SearchBox defaultValue={query} />
      </div>

      {query && (
        <p className="text-sm text-muted mb-6">
          {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;
          {query}&rdquo;
        </p>
      )}

      <LeaderboardTable skills={results} />

      <p className="mt-8 text-sm text-muted">
        <Link href="/" className="hover:text-accent">
          ← Back to leaderboard
        </Link>
      </p>
    </div>
  );
}
