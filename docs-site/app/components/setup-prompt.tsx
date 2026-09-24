"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Bot, Check, Clipboard, ShieldCheck, Wrench } from "lucide-react";
import { CodeBlock } from "./code-block";
import { RecipeStation } from "./recipe-station";
import { copyTextToClipboard } from "./copy-to-clipboard";

const setupPrompt = `Set up SkillChef as a local MCP tool for the coding agent I am using right now.

Official source: https://github.com/samanyugoyal2010/grok-skills (production branch: master)

First inspect the repository README, package.json, lockfile, and examples/integrations for current setup instructions. Review package lifecycle scripts before executing them. Use the current environment's per-user application-data directory outside my project. If SkillChef is already installed there, inspect it and ask before replacing or updating anything. Install dependencies, build it, and run its tests. Do not use administrator privileges or run a remote shell script.

Detect which coding agent I am using. Configure it to launch the built SkillChef MCP server over stdio, following that agent's integration example. Preserve every existing MCP server entry and use absolute paths. Do not edit my current project to install SkillChef.

Safety:
- Before changing any agent configuration, show me the exact file and proposed diff and wait for my approval.
- Do not read or send files from my current project during setup. Do not add provider keys, tokens, or credentials anywhere.
- Do not auto-save generated skills. When I later use SkillChef, ask me to approve the exact repository files before sending their contents, then show the generated skill and its source/risk notes before offering to save it.
- If this agent cannot edit its MCP settings or needs a restart, give me the exact next step instead of claiming setup is complete.

After approval, validate the configuration and verify that this agent can see the compile_skill tool. Explain that deterministic compilation works without a model provider; semantic synthesis requires a separately configured cloud provider API or local Ollama service.`;

const buildExample = `npm ci
npm run build`;

type SetupMethod = "agent" | "manual";

function moveSetupTab(event: KeyboardEvent<HTMLDivElement>) {
  const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
  const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
  if (!direction || index < 0) return;
  event.preventDefault();
  const next = tabs[(index + direction + tabs.length) % tabs.length];
  next.focus();
  next.click();
}

export function SetupPrompt() {
  const [method, setMethod] = useState<SetupMethod>("agent");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => {
    if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
  }, []);

  async function copyPrompt() {
    try {
      await copyTextToClipboard(setupPrompt);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
    if (resetTimer.current !== undefined) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      setCopyStatus("idle");
      resetTimer.current = undefined;
    }, 2400);
  }

  return (
    <div className="setup-chooser">
      <div className="setup-method-picker" role="tablist" aria-label="Choose a setup method" onKeyDown={moveSetupTab}>
        <button id="setup-tab-agent" type="button" role="tab" aria-selected={method === "agent"} aria-controls="setup-panel" tabIndex={method === "agent" ? 0 : -1} className={`setup-method-option${method === "agent" ? " selected" : ""}`} onClick={() => setMethod("agent")}>
          <span className="setup-method-icon"><Bot size={19} aria-hidden="true" /></span>
          <span className="setup-method-copy"><strong>Agent setup</strong><small>Copy one prompt and review each change.</small></span>
          <span className="setup-method-check" aria-hidden="true">{method === "agent" ? <Check size={16} /> : null}</span>
        </button>
        <button id="setup-tab-manual" type="button" role="tab" aria-selected={method === "manual"} aria-controls="setup-panel" tabIndex={method === "manual" ? 0 : -1} className={`setup-method-option${method === "manual" ? " selected" : ""}`} onClick={() => setMethod("manual")}>
          <span className="setup-method-icon"><Wrench size={18} aria-hidden="true" /></span>
          <span className="setup-method-copy"><strong>Manual setup</strong><small>Install the server and connect it yourself.</small></span>
          <span className="setup-method-check" aria-hidden="true">{method === "manual" ? <Check size={16} /> : null}</span>
        </button>
      </div>

      {method === "agent" ? (
        <section className="setup-prompt-panel" id="setup-panel" role="tabpanel" aria-labelledby="setup-tab-agent" tabIndex={0}>
          <div className="setup-prompt-copy">
            <div className="setup-prompt-heading">
              <div>
                <h3 id="agent-prompt-title">Start with your coding agent.</h3>
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
        <section className="manual-setup-content" id="setup-panel" role="tabpanel" aria-labelledby="setup-tab-manual" tabIndex={0}>
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
