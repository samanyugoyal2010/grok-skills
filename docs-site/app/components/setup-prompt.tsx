"use client";

import { useState } from "react";
import { Check, Clipboard, ShieldCheck } from "lucide-react";

const setupPrompt = `Set up SkillChef as a local MCP tool for the coding agent I am using right now.

Official source: https://github.com/samanyugoyal2010/grok-skills (production branch: master)

First inspect the repository README, package.json, lockfile, and examples/integrations for the current setup. Use the current environment's per-user application-data directory, outside my project. If SkillChef is already installed there, inspect it and ask before replacing or updating anything. Review package lifecycle scripts before executing them. Then install dependencies, build the server, and run its tests. Do not use administrator privileges or run a remote shell script.

Detect which coding agent I am using. Configure it to launch the built SkillChef MCP server over stdio, following the integration example for this agent. Preserve every existing MCP server entry and use absolute paths. Do not edit my current project to install SkillChef.

Safety:
- Before changing any agent configuration, show me the exact file and proposed diff and wait for my approval.
- Do not read or send files from my current project during setup. Do not add provider keys, tokens, or credentials anywhere.
- Do not auto-save generated skills. When I later use SkillChef, ask me to approve the exact repository files before sending their contents, then show the generated skill and its source and risk notes before offering to save it.
- If this agent cannot edit its MCP settings or needs a restart, give me the exact next step instead of claiming setup is complete.

After approval, validate the configuration and verify that this agent can see the compile_skill tool. Explain that compilation works in deterministic local mode without a provider API key; semantic model synthesis requires separately configured provider API access.`;

export function SetupPrompt() {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");

  async function copyPrompt() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(setupPrompt);
      setCopyStatus("copied");
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = setupPrompt;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();
        if (!copied) throw new Error("Copy failed");
        setCopyStatus("copied");
      } catch {
        setCopyStatus("error");
      }
    }
    window.setTimeout(() => setCopyStatus("idle"), 2400);
  }

  return (
    <div className="setup-prompt-panel">
      <div className="setup-prompt-copy">
        <div className="setup-prompt-heading">
          <span className="setup-prompt-icon"><Clipboard size={18} aria-hidden="true" /></span>
          <div>
            <h3>One prompt. Your agent handles the setup.</h3>
            <p>Works with coding agents that support local MCP servers and can update their own configuration.</p>
          </div>
        </div>
        <div className="setup-prompt-actions">
          <button className="setup-copy-button" onClick={copyPrompt} type="button">
            {copyStatus === "copied" ? <Check size={16} aria-hidden="true" /> : <Clipboard size={16} aria-hidden="true" />}
            {copyStatus === "copied" ? "Prompt copied" : copyStatus === "error" ? "Copy failed — select the text below" : "Copy setup prompt"}
          </button>
          <a href="https://github.com/samanyugoyal2010/grok-skills" target="_blank" rel="noreferrer">Review source first</a>
        </div>
      </div>
      <div className="setup-prompt-text" aria-label="Prompt to paste into your coding agent">
        <pre><code>{setupPrompt}</code></pre>
      </div>
      <div className="setup-prompt-safety">
        <ShieldCheck size={17} aria-hidden="true" />
        <p><strong>You stay in control.</strong> It asks before changing agent settings. No project files or credentials are sent during setup. Skill generation still requires your approval of context.</p>
      </div>
      <span className="sr-only" aria-live="polite">
        {copyStatus === "copied" ? "Setup prompt copied to clipboard." : copyStatus === "error" ? "Could not copy the setup prompt. Select and copy the text manually." : ""}
      </span>
    </div>
  );
}
