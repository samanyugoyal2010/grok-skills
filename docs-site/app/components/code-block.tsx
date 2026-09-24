"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { ClipboardIcon } from "@phosphor-icons/react/dist/csr/Clipboard";
import { copyTextToClipboard } from "./copy-to-clipboard";

export function CodeBlock({ label, value }: { label: string; value: string }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
  }, []);

  async function copy() {
    try {
      await copyTextToClipboard(value);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      setCopyStatus("idle");
      resetTimer.current = undefined;
    }, 1800);
  }

  return (
    <div className="code-block">
      <div className="code-head">
        <span>{label}</span>
        <button className="copy-button" onClick={copy} type="button" aria-label={`Copy ${label}`}>
          {copyStatus === "copied" ? <CheckIcon size={16} weight="bold" aria-hidden="true" /> : <ClipboardIcon size={16} aria-hidden="true" />}
          {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy"}
        </button>
      </div>
      <pre><code>{value}</code></pre>
      <span className="sr-only" aria-live="polite">
        {copyStatus === "copied" ? `${label} copied to clipboard.` : copyStatus === "error" ? `Could not copy ${label}.` : ""}
      </span>
    </div>
  );
}
