"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { ChefHatIcon } from "@phosphor-icons/react/dist/csr/ChefHat";
import { ClipboardIcon } from "@phosphor-icons/react/dist/csr/Clipboard";
import { copyTextToClipboard } from "./copy-to-clipboard";

type CodeBlockProps = { label: string; value: string; variant?: "default" | "recipe" };

type CodeLanguage = "json" | "toml" | "env" | "shell" | "markdown";

function detectLanguage(label: string, value: string): CodeLanguage {
  if (label.toLowerCase() === "terminal") return "shell";
  if (value.startsWith("---\n")) return "markdown";
  if (value.startsWith("[mcp_servers.")) return "toml";
  if (/^(?:[A-Z][A-Z0-9_]+)=/m.test(value)) return "env";
  return "json";
}

function tokenize(line: string, pattern: RegExp, classify: (token: string, index: number) => string): ReactNode[] {
  const result: ReactNode[] = [];
  let cursor = 0;
  for (const match of line.matchAll(pattern)) {
    const token = match[0];
    const index = match.index ?? cursor;
    if (index > cursor) result.push(line.slice(cursor, index));
    result.push(<span className={`syntax-${classify(token, index)}`} key={`${index}-${token}`}>{token}</span>);
    cursor = index + token.length;
  }
  if (cursor < line.length) result.push(line.slice(cursor));
  return result;
}

function highlightLine(line: string, language: CodeLanguage): ReactNode {
  if (!line) return "\u00a0";

  if (language === "json") {
    return tokenize(line, /"(?:\\.|[^"\\])*"(?=\s*:)|"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?|[{}[\],:]/g, (token, index) => {
      if (token.startsWith("\"")) return /:\s*$/.test(line.slice(index + token.length)) ? "key" : "string";
      return /^(?:true|false|null|-?\d)/.test(token) ? "literal" : "punctuation";
    });
  }

  if (language === "toml" || language === "env") {
    if (/^\s*#/.test(line)) return <span className="syntax-comment">{line}</span>;
    const assignment = /^(\s*)([A-Za-z_][\w.-]*)(\s*=)(.*)$/.exec(line);
    if (assignment) {
      return <>{assignment[1]}<span className="syntax-key">{assignment[2]}</span><span className="syntax-operator">{assignment[3]}</span><span className="syntax-string">{assignment[4]}</span></>;
    }
    if (/^\s*\[.*\]\s*$/.test(line)) return <span className="syntax-section">{line}</span>;
    return line;
  }

  if (language === "shell") {
    const command = /^(\s*)(\S+)(.*)$/.exec(line);
    if (!command) return line;
    const rest = tokenize(command[3], /--?[\w-]+|&&|\|\|/g, (token) => token === "&&" || token === "||" ? "operator" : "flag");
    return <>{command[1]}<span className="syntax-command">{command[2]}</span>{rest}</>;
  }

  if (/^---\s*$/.test(line)) return <span className="syntax-delimiter">{line}</span>;
  const heading = /^(#{1,6})(\s+)(.*)$/.exec(line);
  if (heading) return <><span className="syntax-marker">{heading[1]}</span>{heading[2]}<span className="syntax-heading">{heading[3]}</span></>;
  const listItem = /^(\s*(?:[-*]|\d+\.))(\s+)(.*)$/.exec(line);
  if (listItem) return <><span className="syntax-marker">{listItem[1]}</span>{listItem[2]}{tokenize(listItem[3], /`[^`]+`/g, () => "inline-code")}</>;
  const frontmatter = /^([\w-]+:)(\s*)(.*)$/.exec(line);
  if (frontmatter) return <><span className="syntax-key">{frontmatter[1]}</span>{frontmatter[2]}<span className="syntax-string">{frontmatter[3]}</span></>;
  return tokenize(line, /`[^`]+`/g, () => "inline-code");
}

export function CodeBlock({ label, value, variant = "default" }: CodeBlockProps) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<number | undefined>(undefined);
  const language = detectLanguage(label, value);
  const lines = value.split("\n");

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
    <div className={`code-block code-block-${variant}`} data-language={language}>
      <div className="code-head">
        <span className="code-label">
          {variant === "recipe" && <ChefHatIcon size={19} weight="duotone" aria-hidden="true" />}
          {label}
        </span>
        <span className="code-tools">
          <span className="code-language" aria-hidden="true">{language === "markdown" ? "MD" : language === "shell" ? "SHELL" : language.toUpperCase()}</span>
        <button className="copy-button" onClick={copy} type="button" aria-label={`Copy ${label}`}>
          {copyStatus === "copied" ? <CheckIcon size={16} weight="bold" aria-hidden="true" /> : <ClipboardIcon size={16} aria-hidden="true" />}
          {copyStatus === "copied" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy"}
        </button>
        </span>
      </div>
      <pre><code>{lines.map((line, index) => (
        <span className="code-line" key={index}>
          <span className="code-line-number" aria-hidden="true">{index + 1}</span>
          <span className="code-line-content">{highlightLine(line, language)}</span>
        </span>
      ))}</code></pre>
      <span className="sr-only" aria-live="polite">
        {copyStatus === "copied" ? `${label} copied to clipboard.` : copyStatus === "error" ? `Could not copy ${label}.` : ""}
      </span>
    </div>
  );
}
