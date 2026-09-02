"use client";

import { Suspense } from "react";
import { CopyButton } from "@/components/CopyButton";
import { LeaderboardTabs } from "@/components/LeaderboardTabs";
import { RuntimeFilter } from "@/components/RuntimeFilter";
import { SearchBox } from "@/components/SearchBox";

export function HomeClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <code className="font-mono text-sm bg-white/5 border border-border rounded px-4 py-2.5 flex-1 overflow-x-auto">
            $ npx grok-skills add &lt;owner/repo&gt;
          </code>
          <CopyButton text="npx grok-skills add <owner/repo>" />
        </div>
      </div>

      <div className="mb-6">
        <SearchBox />
      </div>

      <div className="mb-4">
        <Suspense fallback={null}>
          <RuntimeFilter />
        </Suspense>
      </div>

      <div className="mb-6">
        <Suspense fallback={null}>
          <LeaderboardTabs />
        </Suspense>
      </div>

      {children}
    </>
  );
}
