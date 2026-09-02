"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { SortMode } from "@/lib/catalog";

const TABS: { id: SortMode; label: string }[] = [
  { id: "all-time", label: "All Time" },
  { id: "trending", label: "Trending (24h)" },
  { id: "hot", label: "Hot" },
];

export function LeaderboardTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get("tab") as SortMode) || "all-time";

  function setTab(tab: SortMode) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex gap-1 border-b border-border">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => setTab(tab.id)}
          className={`px-4 py-2 text-sm transition-colors border-b-2 -mb-px ${
            current === tab.id
              ? "border-accent text-accent"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
