"use client";

import { useState } from "react";
import { CodeBlock } from "./code-block";

type Provider = {
  id: string;
  name: string;
  keyName?: string;
  model: string;
  url?: string;
};

const providers: Provider[] = [
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
  },
  {
    id: "ollama",
    name: "Ollama (local)",
    model: "<installed model name>"
  }
];

const ollamaEnvironment = `SKILL_COMPILER_PROVIDER=ollama
SKILL_COMPILER_MODEL=<installed model name>
SKILL_COMPILER_OLLAMA_BASE_URL=http://127.0.0.1:11434`;

export function ProviderSetup() {
  const [selectedId, setSelectedId] = useState("openai");
  const selected = providers.find((provider) => provider.id === selectedId) ?? providers[0];
  const isOllama = selected.id === "ollama";

  return (
    <section className="section provider-section" id="provider-setup">
      <div className="section-heading">
        <span className="section-kicker">Model provider</span>
        <div>
          <h2>Choose where synthesis runs.</h2>
          <p>Semantic compilation is optional. Without a provider, the deterministic compiler runs locally. A remote provider receives the task, approved context, and selected public skill excerpts for synthesis.</p>
        </div>
      </div>

      <div className="provider-panel">
        <div className="provider-tabs" role="group" aria-label="Choose a model provider">
          <span className="provider-select-label">Choose a provider</span>
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
            {isOllama ? (
              <>
                <p className="provider-local-intro">Install and start Ollama, then pull a model with <code>ollama pull &lt;model&gt;</code>. Set <code>SKILL_COMPILER_MODEL</code> to that exact installed model name. SkillChef does not download models, and no provider API key is needed.</p>
                <CodeBlock label="Ollama environment" value={ollamaEnvironment} />
                <p>Set these values in the MCP server process environment, not in chat or the generated skill. Keep Ollama at the loopback address shown above so approved context stays on this computer.</p>
              </>
            ) : (
              <>
                <div className="provider-runtime">
                  <span><b>Provider</b><code>SKILL_COMPILER_PROVIDER={selected.id}</code></span>
                  <span><b>Secret variable</b><code>{selected.keyName}</code></span>
                  <span><b>Default model</b><code>{selected.model}</code></span>
                </div>
                <p>Load the key through your OS secret manager or MCP host’s process-environment injection. The local server reads it at startup; restart the MCP child after changing it. Do not put real keys in chat, <code>compile_skill</code>, source control, or an agent config file.</p>
                <a className="provider-doc-link" href={selected.url} target="_blank" rel="noreferrer">
                  Get an API key from {selected.name} <span aria-hidden="true">↗</span>
                </a>
              </>
            )}
          </div>
          <aside className="provider-aside">
            <span className="provider-status"><span className="status-dot" /> {isOllama ? "Local · no API key" : "Optional"}</span>
            <h3>{isOllama ? "Model stays on your machine." : "Separate from your coding-agent plan."}</h3>
            <p>{isOllama ? "Synthesis requests go to your local Ollama server, not a hosted model provider. Resource use depends on the model you install." : "A Claude Code, Cursor, Codex, or other coding-tool login does not supply this API key. Provider API usage is billed by the selected provider account."}</p>
            {!isOllama && <p className="provider-default-note">Model defaults are shown from the current server config. Override with <code>SKILL_COMPILER_MODEL</code>.</p>}
          </aside>
        </div>
      </div>
      <p className="provider-footnote">Cloud keys stay in the MCP server process and are sent only in the provider request’s authentication header. Ollama needs no API key; approved context is sent to the configured local Ollama service. SkillChef does not persist credentials or include them in tool results.</p>
    </section>
  );
}
