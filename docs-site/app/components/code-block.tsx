"use client";

import { useState } from "react";
import { Check, Clipboard } from "lucide-react";

export function CodeBlock({ label, value }: { label: string; value: string }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        throw new Error("Clipboard API unavailable");
      }
      setCopyStatus("copied");
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        let copied = false;
        try {
          textarea.select();
          copied = document.execCommand("copy");
        } finally {
          textarea.remove();
        }
        if (!copied) throw new Error("Copy command failed");
        setCopyStatus("copied");
      } catch {
        setCopyStatus("error");
      }
    }
    window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  return (
    <div className="code-block">
      <div className="code-head">
        <span>{label}</span>
        <button className="copy-button" onClick={copy} type="button" aria-label={`Copy ${label}`}>
          {copyStatus === "copied" ? <Check size={14} aria-hidden="true" /> : <Clipboard size={14} aria-hidden="true" />}
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
