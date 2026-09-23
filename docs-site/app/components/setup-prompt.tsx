"use client";

import { useState } from "react";
import { Check, Clipboard, ShieldCheck } from "lucide-react";
import { CodeBlock } from "./code-block";
import { RecipeStation } from "./recipe-station";

const setupPrompt = `Set up SkillChef as a local MCP tool for the coding agent I am using right now.

Official source: https://github.com/samanyugoyal2010/grok-skills (production branch: master)

First inspect the repository README, package.json, and examples/integrations for the current installation instructions. Use a dedicated per-user install directory outside my current project. If SkillChef is already installed there, inspect it and ask before replacing or updating anything. Install dependencies, build it, and run its tests.

Then configure this agent to launch the built SkillChef MCP server over stdio. Follow the integration example for this agent and preserve every existing MCP server entry. Use absolute paths. Do not edit my current project to install SkillChef.

Safety:
- Before changing any agent configuration, show me the exact file and proposed diff and wait for my approval.
- Do not read or send files from my current project during setup. Do not add provider keys, tokens, or credentials anywhere.
- Do not auto-save generated skills. When I later use SkillChef, ask me to approve the exact repository files before sending their contents, then show the generated skill and its source/risk notes before offering to save it.
- If this agent cannot edit its MCP settings or needs a restart, give me the exact next step instead of claiming setup is complete.

After approval, validate the configuration and verify that this agent can see the compile_skill tool. Explain that deterministic compilation works without a model provider; semantic synthesis requires a separately configured cloud provider API or local Ollama service.`;

const buildExample = `npm ci
npm run build`;

type SetupMethod = "agent" | "manual";

export function SetupPrompt() {
  const [method, setMethod] = useState<SetupMethod>("agent");
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
        let copied = false;
        try {
          textarea.select();
          copied = document.execCommand("copy");
        } finally {
          textarea.remove();
        }
        if (!copied) throw new Error("Copy failed");
        setCopyStatus("copied");
      } catch {
        setCopyStatus("error");
      }
    }
    window.setTimeout(() => setCopyStatus("idle"), 2400);
  }

  return (
    <div className="setup-chooser">
      <div className="setup-method-picker" role="group" aria-label="Choose a setup method">
        <button type="button" aria-pressed={method === "agent"} className={`setup-method-option${method === "agent" ? " selected" : ""}`} onClick={() => setMethod("agent")}>
          <span>Agent prompt</span><small>Copy, paste, review</small>
        </button>
        <button type="button" aria-pressed={method === "manual"} className={`setup-method-option${method === "manual" ? " selected" : ""}`} onClick={() => setMethod("manual")}>
          <span>Manual setup</span><small>Install and connect it yourself</small>
        </button>
      </div>

      {method === "agent" ? (
        <section className="setup-prompt-panel" aria-labelledby="agent-prompt-title">
          <div className="setup-prompt-copy">
            <div className="setup-prompt-heading">
              <span className="setup-prompt-icon"><Clipboard size={18} aria-hidden="true" /></span>
              <div>
                <h3 id="agent-prompt-title">Give your agent one setup instruction.</h3>
                <p>It installs SkillChef locally and prepares the MCP connection. Your agent shows any config changes and waits for your approval.</p>
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
          <details className="setup-prompt-preview">
            <summary>Preview the setup prompt</summary>
            <div className="setup-prompt-text" aria-label="Prompt to paste into your coding agent">
              <pre><code>{setupPrompt}</code></pre>
            </div>
          </details>
          <div className="setup-prompt-safety">
            <ShieldCheck size={17} aria-hidden="true" />
            <p><strong>You stay in control.</strong> Setup asks before changing agent settings. It does not read your project or add credentials. Later, you approve exact context files and review the skill before saving.</p>
          </div>
        </section>
      ) : (
        <section className="manual-setup-content" aria-label="Manual SkillChef setup">
          <p>Install and build the MCP server, then add its local command to your agent’s MCP configuration. Keep provider keys out of agent config files.</p>
          <div className="build-row"><div><span className="tiny-label">Build locally</span><p>Run these commands from a SkillChef checkout.</p></div><CodeBlock label="terminal" value={buildExample} /></div>
          <RecipeStation />
        </section>
      )}

      <span className="sr-only" aria-live="polite">
        {copyStatus === "copied" ? "Setup prompt copied to clipboard." : copyStatus === "error" ? "Could not copy the setup prompt. Select and copy the text manually." : ""}
      </span>
    </div>
  );
}
