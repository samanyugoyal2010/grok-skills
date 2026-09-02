"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { RuntimeFilter } from "@/lib/catalog";

const FILTERS: { id: RuntimeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "grok-bot", label: "Grok Bot" },
  { id: "grok-build", label: "Grok Build" },
];

export function RuntimeFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = (searchParams.get("runtime") as RuntimeFilter) || "all";

  function setRuntime(runtime: RuntimeFilter) {
    const params = new URLSearchParams(searchParams.toString());
    if (runtime === "all") {
      params.delete("runtime");
    } else {
      params.set("runtime", runtime);
    }
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => setRuntime(filter.id)}
          className={`px-3 py-1 text-xs rounded-full border transition-colors ${
            current === filter.id
              ? "border-accent text-accent bg-accent/10"
              : "border-border text-muted hover:text-foreground hover:border-foreground/30"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
