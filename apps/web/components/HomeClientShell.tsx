"use client";

import { Suspense } from "react";
import { CopyButton } from "@/components/CopyButton";
import { LeaderboardTabs } from "@/components/LeaderboardTabs";
import { RuntimeFilter } from "@/components/RuntimeFilter";
import { SearchBox } from "@/components/SearchBox";
import { PRIMARY_INSTALL_HINT } from "@/lib/install-cmd";

export function HomeClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <code className="font-mono text-sm bg-white/5 border border-border rounded px-4 py-2.5 flex-1 overflow-x-auto">
            $ {PRIMARY_INSTALL_HINT}
          </code>
          <CopyButton text={PRIMARY_INSTALL_HINT} />
        </div>
        <p className="text-xs text-muted">
          Runs from GitHub, not the npm registry. Catalog names copy bundled{" "}
          <code className="font-mono">SKILL.md</code> — no clone required.
        </p>
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
