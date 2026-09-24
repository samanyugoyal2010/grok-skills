import {
  ArrowUpRight,
  Check,
  ShieldCheck
} from "lucide-react";
import { CodeBlock } from "./components/code-block";
import { ProviderSetup } from "./components/provider-setup";
import { SetupPrompt } from "./components/setup-prompt";

const repositoryUrl = "https://github.com/samanyugoyal2010/grok-skills";

const skillFrontmatter = `---
name: mcp-server-release-check
description: Verify an MCP server before cutting a release.
---

# MCP server release check

## Procedure
1. Run the repository's lint and test commands.
2. Launch the server over stdio and initialize a client.
3. List tools and call one safe tool; verify stdout contains only protocol messages.
4. Record any failing command and its output.

## Repo constraints
- Use the scripts defined in package.json.`;

const requestExample = `{
  "task": "Check the MCP server before a release.",
  "search_query": "MCP server stdio protocol release checklist",
  "project_brief": "Node.js MCP server; follow the repository's scripts and test setup.",
  "approved_context": [
    {
      "path": "package.json",
      "reason": "Use the project's actual lint and test commands.",
      "content": "..."
    }
  ]
}`;

export default function Home() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#overview" aria-label="SkillChef home">
          <span className="brand-glyph" aria-hidden="true">▲</span><span><span className="brand-skill">Skill</span><span className="brand-chef">Chef</span></span>
        </a>
        <div className="topbar-meta">
          <a className="topbar-link" href="#how-it-works">Workflow</a>
          <a className="topbar-link" href="#the-recipe">Skill file</a>
          <a className="topbar-cta" href="#station">Get started <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </nav>

      <div className="docs-layout">
        <main className="content-column" id="main-content" tabIndex={-1}>
          <section className="hero section" id="overview">
            <div className="hero-intro">
              <div className="hero-wordmark-wrap">
                <p className="eyebrow">THE LOCAL AGENT SKILL WORKBENCH</p>
                <h1 className="hero-wordmark" aria-label="SkillChef"><span>SKILL</span><span>CHEF</span></h1>
              </div>
              <div className="hero-copy">
                <p className="hero-kicker">PREP <span>→</span> COOK <span>→</span> REVIEW</p>
                <p className="hero-lede">Turn a repeatable task into an Agent Skill. Approve the context, shape the workflow, and review the <code>SKILL.md</code> before saving.</p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#station">Choose a setup path <ArrowUpRight size={15} aria-hidden="true" /></a>
                  <a className="text-link" href="#the-recipe">View a sample</a>
                </div>
              </div>
            </div>
            <div className="hero-quickstart">
              <div className="hero-command">
                <span className="eyebrow">QUICK START</span>
                <a href="#station">Get the setup prompt <ArrowUpRight size={14} aria-hidden="true" /></a>
                <small>Local MCP server · review before saving</small>
              </div>
              <div className="hero-agents">
                <span className="eyebrow">AVAILABLE FOR YOUR AGENT</span>
                <div className="agent-list" aria-label="Works with Claude Code, Cursor, Codex, and other MCP clients">
                  <span>CLAUDE CODE</span><span>CURSOR</span><span>CODEX</span><span>+ MCP CLIENTS</span>
                </div>
              </div>
            </div>
          </section>

          <section className="section method-section" id="how-it-works">
            <div className="section-heading">
              <div><h2>A workflow becomes a reviewable skill.</h2><p>Choose the task and context, compile it, then inspect sources and risk notes before saving.</p></div>
            </div>
            <div className="method-line">
              <article className="method-step">
                <span className="method-index">Step 1 · Prep</span>
                <h3>Choose a task and files</h3>
                <p>Describe the repeatable workflow. Approve each file before its text is sent.</p>
              </article>
              <article className="method-step">
                <span className="method-index">Step 2 · Cook</span>
                <h3>Compile with approved context</h3>
                <p>SkillChef finds public references and combines them with approved context.</p>
              </article>
              <article className="method-step">
                <span className="method-index">Step 3 · Taste</span>
                <h3>Review before saving</h3>
                <p>Check the skill, sources, and risk notes. Nothing is saved or run automatically.</p>
              </article>
            </div>
          </section>

          <section className="section recipe-section" id="the-recipe">
            <div className="section-heading">
              <div><h2>A skill file you can inspect.</h2><p>Save it in your agent’s skills folder. Match the folder name to the file’s <code>name</code>.</p></div>
            </div>
            <div className="recipe-layout">
              <div className="recipe-copy">
                <div className="recipe-detail"><div><strong>Clear name and description</strong><p>Help the agent recognize when this workflow applies.</p></div></div>
                <div className="recipe-detail"><div><strong>Repo-specific constraints</strong><p>Carry forward the conventions in the context you approved.</p></div></div>
                <div className="recipe-detail"><div><strong>Sources to inspect</strong><p>See matched excerpts with source links and content hashes.</p></div></div>
              </div>
              <CodeBlock label="SKILL.md / Agent Skills format" value={skillFrontmatter} />
            </div>
          </section>

          <section className="section station-section" id="station">
            <div className="section-heading">
              <div><h2>Pick one setup path.</h2><p>Ask your coding agent to guide setup, or configure the local MCP server yourself.</p></div>
            </div>
            <SetupPrompt />
          </section>

          <ProviderSetup />

          <section className="section contract-section" id="contract">
            <div className="section-heading">
              <div><h2>Know where your text goes.</h2><p>Your local MCP server receives only the task and context your agent sends. Choose local deterministic output, local Ollama, or a cloud provider.</p></div>
            </div>
            <div className="contract-layout">
              <CodeBlock label="compile_skill · request" value={requestExample} />
              <div className="boundary-list">
                <div><Check size={15} aria-hidden="true" /><span><b>Your computer:</b> runs the MCP server and receives the text you approved.</span></div>
                <div><Check size={15} aria-hidden="true" /><span><b>GitHub:</b> serves public skill references to the retriever.</span></div>
                <div><Check size={15} aria-hidden="true" /><span><b>Model provider:</b> gets the request and selected references only when synthesis is configured.</span></div>
                <div><Check size={15} aria-hidden="true" /><span><b>Your project:</b> is not read or changed by SkillChef. You review before saving.</span></div>
                <a href="https://agentskills.io/specification" target="_blank" rel="noreferrer">Read the Agent Skills specification <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
            </div>
          </section>

          <section className="safety-section" id="safety">
            <div className="safety-mark"><ShieldCheck size={20} aria-hidden="true" /></div>
            <div><h2>Designed to run locally.</h2><p>SkillChef has no accounts or per-user credentials. HTTP mode uses one server-side provider key, so keep it private and single-tenant. Check a cloud provider’s current data terms before sending private code. Public skills and generated instructions are untrusted; risk checks are advisory. Review every skill before use.</p><p className="safety-followup">A shared hosted service needs user authentication, isolated credentials, and tenant-level controls first.</p></div>
          </section>

          <footer className="footer"><a className="footer-brand" href="#overview">SkillChef</a><span>Turn a workflow into a skill you can inspect.</span><div className="footer-links"><a href="/llms.txt">Full guide</a><a href={repositoryUrl} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={13} aria-hidden="true" /></a></div></footer>
        </main>
      </div>
    </div>
  );
}
