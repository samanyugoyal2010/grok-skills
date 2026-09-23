"use client";

import { useState } from "react";

const providers = [
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
] as const;

export function ProviderSetup() {
  const [selectedId, setSelectedId] = useState<(typeof providers)[number]["id"]>("openai");
  const selected = providers.find((provider) => provider.id === selectedId) ?? providers[0];

  return (
    <section className="section provider-section" id="provider-setup">
      <div className="section-heading">
        <span className="section-kicker">Model provider</span>
        <div>
          <h2>Choose where synthesis runs.</h2>
          <p>Semantic compilation is optional. No provider key means the deterministic compiler runs locally; adding one sends the submitted task, approved context, and selected public skill excerpts to that provider.</p>
        </div>
      </div>

      <div className="provider-panel">
        <div className="provider-tabs" role="group" aria-label="Choose a model provider">
          {providers.map((provider) => (
            <button
              type="button"
              key={provider.id}
              aria-pressed={provider.id === selected.id}
              className={`provider-tab${provider.id === selected.id ? " selected" : ""}`}
              onClick={() => setSelectedId(provider.id)}
            >
              {provider.name}
            </button>
          ))}
        </div>

        <div className="provider-detail" aria-live="polite">
          <div className="provider-primary">
            <span className="tiny-label">Runtime configuration · MCP server process</span>
            <div className="provider-runtime">
              <span><b>Provider</b><code>SKILL_COMPILER_PROVIDER={selected.id}</code></span>
              <span><b>Secret variable</b><code>{selected.keyName}</code></span>
              <span><b>Default model</b><code>{selected.model}</code></span>
            </div>
            <p>Load the key through your OS secret manager or MCP host’s process-environment injection. The local server reads it at startup; restart the MCP child after changing it. Do not put real keys in chat, <code>compile_skill</code>, source control, or an agent config file.</p>
            <a className="provider-doc-link" href={selected.url} target="_blank" rel="noreferrer">
              Get an API key from {selected.name} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <aside className="provider-aside">
            <span className="provider-status"><span className="status-dot" /> Optional</span>
            <h3>Separate from your coding-agent plan.</h3>
            <p>A Claude Code, Cursor, Codex, or other coding-tool login does not supply this API key. Provider API usage is billed by the selected provider account.</p>
            <p className="provider-default-note">Model defaults are shown from the current server config. Override with <code>SKILL_COMPILER_MODEL</code>.</p>
          </aside>
        </div>
      </div>
      <p className="provider-footnote">Keys stay in the server process and are sent only in the provider request’s authentication header. SkillChef does not persist them or include them in tool results.</p>
    </section>
  );
}
