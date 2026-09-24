"use client";

import { useState, type KeyboardEvent } from "react";
import { Check, Cloud, ExternalLink, FileText, Laptop, LockKeyhole, type LucideIcon } from "lucide-react";
import { CodeBlock } from "./code-block";

type SetupMode = "none" | "local" | "cloud";

type CloudProvider = {
  id: string;
  name: string;
  keyName: string;
  model: string;
  url: string;
};

const cloudProviders: CloudProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    keyName: "OPENAI_API_KEY",
    model: "gpt-4.1-mini",
    url: "https://developers.openai.com/api/docs/quickstart"
  },
  {
    id: "anthropic",
    name: "Anthropic",
    keyName: "ANTHROPIC_API_KEY",
    model: "claude-sonnet-5",
    url: "https://platform.claude.com/docs/en/manage-claude/authentication"
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    keyName: "OPENROUTER_API_KEY",
    model: "openai/gpt-4.1-mini",
    url: "https://openrouter.ai/docs/quickstart"
  },
  {
    id: "groq",
    name: "Groq",
    keyName: "GROQ_API_KEY",
    model: "openai/gpt-oss-20b",
    url: "https://console.groq.com/docs/quickstart"
  }
];

const setupModes: Array<{ id: SetupMode; label: string; detail: string; icon: LucideIcon }> = [
  { id: "none", label: "Built-in compiler", detail: "No model or key", icon: FileText },
  { id: "local", label: "Ollama on this device", detail: "Local model, local context", icon: Laptop },
  { id: "cloud", label: "Cloud provider", detail: "Use your provider key", icon: Cloud }
];

function moveProviderTab(event: KeyboardEvent<HTMLDivElement>) {
  const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
  const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
  if (!direction || index < 0) return;
  event.preventDefault();
  const next = tabs[(index + direction + tabs.length) % tabs.length];
  next.focus();
  next.click();
}

function moveCloudProvider(event: KeyboardEvent<HTMLDivElement>) {
  const options = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]'));
  const index = options.indexOf(document.activeElement as HTMLButtonElement);
  const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
  if (!direction || index < 0) return;
  event.preventDefault();
  const next = options[(index + direction + options.length) % options.length];
  next.focus();
  next.click();
}

const ollamaEnvironment = `SKILL_COMPILER_PROVIDER=ollama
SKILL_COMPILER_MODEL=qwen3:8b
SKILL_COMPILER_OLLAMA_BASE_URL=http://127.0.0.1:11434`;

function CloudSetup({ provider }: { provider: CloudProvider }) {
  const article = ["openai", "anthropic", "openrouter"].includes(provider.id) ? "an" : "a";
  const environment = `SKILL_COMPILER_PROVIDER=${provider.id}
${provider.keyName}=your-key-here
# Optional: defaults to ${provider.model}
SKILL_COMPILER_MODEL=${provider.model}`;

  return (
    <div className="provider-guide provider-guide-cloud">
      <div className="provider-guide-main">
        <div className="provider-guide-heading">
          <div>
            <span className="provider-guide-kicker">Cloud setup</span>
            <h3>Use {provider.name} to help write the final skill.</h3>
            <p>SkillChef sends the task and files you approve to this provider to help write the skill. The key is read from the MCP server environment and sent only as the provider authentication header.</p>
          </div>
        </div>

        <div className="provider-steps">
          <div className="provider-step">
            <span className="provider-step-number">1</span>
            <div><h4>Get a key</h4><p>Create or use {article} {provider.name} API key. It is separate from your coding-agent login.</p><a className="provider-inline-link" href={provider.url} target="_blank" rel="noreferrer">Open {provider.name} setup <ExternalLink size={14} aria-hidden="true" /></a></div>
          </div>
          <div className="provider-step">
            <span className="provider-step-number">2</span>
            <div><h4>Set it where SkillChef runs</h4><p>Add these values to the MCP server environment. Replace only <code>your-key-here</code>.</p><CodeBlock label="MCP server environment" value={environment} /></div>
          </div>
          <div className="provider-step">
            <span className="provider-step-number">3</span>
            <div><h4>Restart the MCP server</h4><p>Start SkillChef again, then call <code>compile_skill</code>. Leave the key out of chat, source control, and tool input.</p></div>
          </div>
        </div>
      </div>
      <aside className="provider-guide-note">
        <strong>One key, one local server</strong>
        <p>SkillChef does not store provider keys or include them in generated skills. Your approved context leaves this computer when you choose a cloud provider. Usage is billed by that provider account.</p>
      </aside>
    </div>
  );
}

export function ProviderSetup() {
  const [mode, setMode] = useState<SetupMode>("none");
  const [providerId, setProviderId] = useState("openai");
  const provider = cloudProviders.find((item) => item.id === providerId) ?? cloudProviders[0];

  return (
    <section className="section provider-section" id="provider-setup">
      <div className="section-heading">
        <div>
          <h2>Choose how to compile a skill.</h2>
          <p>Run the deterministic compiler locally, add an Ollama model, or use a cloud provider.</p>
        </div>
      </div>

      <div className="provider-panel">
        <div className="provider-choice-header">
          <span className="provider-choice-label">What sounds right?</span>
          <span className="provider-choice-help">You can change this later.</span>
        </div>
        <div className="provider-choice-grid" role="tablist" aria-label="Choose how SkillChef should create skills" onKeyDown={moveProviderTab}>
          {setupModes.map((item) => (
            <button
              id={`provider-tab-${item.id}`}
              className={`provider-choice${mode === item.id ? " selected" : ""}`}
              key={item.id}
              type="button"
              role="tab"
              aria-selected={mode === item.id}
              aria-controls="provider-panel"
              tabIndex={mode === item.id ? 0 : -1}
              onClick={() => setMode(item.id)}
            >
              <span className="provider-choice-icon"><item.icon size={19} aria-hidden="true" /></span>
              <span className="provider-choice-copy"><span className="provider-choice-title">{item.label}</span><span className="provider-choice-detail">{item.detail}</span></span>
              <span className="provider-choice-check" aria-hidden="true">{mode === item.id ? "Selected" : ""}</span>
            </button>
          ))}
        </div>

        <div className="provider-choice-body" id="provider-panel" role="tabpanel" aria-labelledby={`provider-tab-${mode}`} tabIndex={0} aria-live="polite">
          {mode === "none" && (
            <div className="provider-guide provider-guide-none">
              <div className="provider-guide-main provider-guide-heading">
                <div>
                  <h3>Compile locally, with no model key.</h3>
                  <p>The local compiler turns your task and approved context into a reviewable <code>SKILL.md</code>. Public reference lookup is optional.</p>
                </div>
              </div>
            </div>
          )}

          {mode === "local" && (
            <div className="provider-guide provider-guide-local">
              <div className="provider-guide-main">
                <div className="provider-guide-heading">
                  <div>
                    <span className="provider-guide-kicker">Local setup</span>
                    <h3>Keep the model and your context on this computer.</h3>
                    <p>Ollama runs the model locally. You need Ollama and an installed model, but no cloud account or API key.</p>
                  </div>
                </div>
                <div className="provider-steps">
                  <div className="provider-step"><span className="provider-step-number">1</span><div><h4>Install Ollama</h4><p>Download Ollama, start it, then install a model.</p><a className="provider-inline-link" href="https://ollama.com/download" target="_blank" rel="noreferrer">Get Ollama <ExternalLink size={14} aria-hidden="true" /></a><pre className="provider-command"><code>ollama pull qwen3:8b</code></pre></div></div>
                  <div className="provider-step"><span className="provider-step-number">2</span><div><h4>Point SkillChef at it</h4><p>Set these values in the MCP server environment.</p><CodeBlock label="MCP server environment" value={ollamaEnvironment} /></div></div>
                  <div className="provider-step"><span className="provider-step-number">3</span><div><h4>Restart the MCP server</h4><p>SkillChef sends approved context to your local Ollama service.</p></div></div>
                </div>
              </div>
            </div>
          )}

          {mode === "cloud" && (
            <div className="provider-cloud-wrap">
              <div className="provider-cloud-picker">
                <div>
                  <span className="provider-choice-label">Choose a cloud provider</span>
                  <p>Pick the account you already use or trust.</p>
                </div>
                <div className="provider-cloud-options" role="radiogroup" aria-label="Choose a cloud provider" onKeyDown={moveCloudProvider}>
                  {cloudProviders.map((item) => (
                    <button
                      className={`provider-cloud-option${provider.id === item.id ? " selected" : ""}`}
                      key={item.id}
                      type="button"
                      role="radio"
                      aria-checked={provider.id === item.id}
                      aria-controls="cloud-provider-setup"
                      tabIndex={provider.id === item.id ? 0 : -1}
                      onClick={() => setProviderId(item.id)}
                    >
                      <span>{item.name}</span>
                      <span className="provider-cloud-selected" aria-hidden="true">{provider.id === item.id ? <Check size={15} /> : ""}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div id="cloud-provider-setup" aria-label={`${provider.name} setup`}>
                <CloudSetup provider={provider} />
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="provider-footnote"><LockKeyhole size={14} aria-hidden="true" /> Store the key in the MCP server environment. Keep it out of chat, source control, skills, and tool calls.</p>
    </section>
  );
}
