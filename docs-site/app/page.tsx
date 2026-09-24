import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { ChefHatIcon } from "@phosphor-icons/react/dist/ssr/ChefHat";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import { ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
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
          <ChefHatIcon className="brand-glyph" size={21} weight="duotone" aria-hidden="true" /><span><span className="brand-skill">Skill</span><span className="brand-chef">Chef</span></span>
        </a>
        <div className="topbar-meta">
          <a className="topbar-link" href="#how-it-works">How it works</a>
          <a className="topbar-link" href="#the-recipe">Example skill</a>
          <a className="topbar-cta" href="#station">Get started <ArrowUpRightIcon size={16} aria-hidden="true" /></a>
        </div>
      </nav>

      <div className="docs-layout">
        <main className="content-column" id="main-content" tabIndex={-1}>
          <section className="hero section" id="overview">
            <div className="hero-intro">
              <div className="hero-wordmark-wrap">
                <p className="eyebrow">A recipe card for your coding agent</p>
                <h1 className="hero-wordmark">Teach your agent how your repo works.</h1>
              </div>
              <div className="hero-copy">
                <p className="hero-kicker">Describe it. Review it. Reuse it.</p>
                <p className="hero-lede">Turn work your team repeats into an Agent Skill. Choose the repo context, inspect the draft, then save the <code>SKILL.md</code> where your agent can use it.</p>
                <div className="hero-actions">
                  <a className="button button-primary" href="#station">Set up SkillChef <ArrowUpRightIcon size={16} aria-hidden="true" /></a>
                  <a className="text-link" href="#the-recipe">See an example skill</a>
                </div>
              </div>
            </div>
            <div className="hero-quickstart">
              <div className="hero-command">
                <span className="eyebrow">Quick start</span>
                <a href="#station">Copy the setup prompt <ArrowUpRightIcon size={16} aria-hidden="true" /></a>
                <small>Runs locally · review before saving</small>
              </div>
              <div className="hero-agents">
                <span className="eyebrow">Works with your coding agent</span>
                <div className="agent-list" role="group" aria-label="Works with Claude Code, Cursor, Codex, and other MCP clients">
                  <span>CLAUDE CODE</span><span>CURSOR</span><span>CODEX</span><span>+ MCP CLIENTS</span>
                </div>
              </div>
            </div>
          </section>

          <section className="section method-section" id="how-it-works">
            <div className="section-heading">
              <div><h2>From repeated task to reusable skill.</h2><p>Describe the work, approve the context, then check the generated instructions before you save them.</p></div>
            </div>
            <div className="method-line">
              <article className="method-step">
                <span className="method-index">01 · Describe</span>
                <h3>Name the work you repeat</h3>
                <p>Tell SkillChef what the agent should do and when to use the skill.</p>
              </article>
              <article className="method-step">
                <span className="method-index">02 · Prepare</span>
                <h3>Approve useful repo context</h3>
                <p>Choose the exact files SkillChef may use. Public references are optional.</p>
              </article>
              <article className="method-step">
                <span className="method-index">03 · Review</span>
                <h3>Check the draft before saving</h3>
                <p>Inspect the skill, sources, and risk notes. SkillChef never saves or runs it for you.</p>
              </article>
            </div>
          </section>

          <section className="section recipe-section" id="the-recipe">
            <div className="section-heading">
              <div><h2>A real skill file, ready to inspect.</h2><p>SkillChef writes the standard Agent Skills format. Save it in a folder matching its <code>name</code>.</p></div>
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
              <div><h2>Connect SkillChef to your agent.</h2><p>Use a guided setup prompt or configure the local MCP server yourself.</p></div>
            </div>
            <SetupPrompt />
          </section>

          <ProviderSetup />

          <section className="section contract-section" id="contract">
            <div className="section-heading">
              <div><h2>Know what gets sent.</h2><p>The MCP server receives your task and only the repo context you approve. Cloud synthesis also sends that material to your chosen provider.</p></div>
            </div>
            <div className="contract-layout">
              <CodeBlock label="compile_skill · request" value={requestExample} />
              <div className="boundary-list">
                <div><CheckIcon size={17} aria-hidden="true" /><span><b>Your computer:</b> runs SkillChef and receives the task and approved files.</span></div>
                <div><CheckIcon size={17} aria-hidden="true" /><span><b>GitHub:</b> serves public skill references when lookup is enabled.</span></div>
                <div><CheckIcon size={17} aria-hidden="true" /><span><b>Your model provider:</b> receives the request only when cloud synthesis is selected.</span></div>
                <div><CheckIcon size={17} aria-hidden="true" /><span><b>Your project:</b> stays in your editor. SkillChef never reads or changes it directly.</span></div>
                <a href="https://agentskills.io/specification" target="_blank" rel="noreferrer">Read the Agent Skills specification <ArrowUpRightIcon size={16} aria-hidden="true" /></a>
              </div>
            </div>
          </section>

          <section className="safety-section" id="safety">
            <div className="safety-mark"><ShieldCheckIcon size={22} weight="duotone" aria-hidden="true" /></div>
            <div><h2>Built for local use.</h2><p>SkillChef has no accounts or per-user keys. HTTP mode uses one server-held provider key and is single-tenant. Check a cloud provider’s data terms before sending private code. Treat public references and generated instructions as untrusted, and review every skill before using it.</p><p className="safety-followup">A shared hosted service needs user accounts, isolated keys, and tenant-level controls.</p></div>
          </section>

          <footer className="footer"><a className="footer-brand" href="#overview"><ChefHatIcon size={19} weight="duotone" aria-hidden="true" /> SkillChef</a><span>Turn repeated work into a skill your agent can follow.</span><div className="footer-links"><a href="/llms.txt">Full guide</a><a href={repositoryUrl} target="_blank" rel="noreferrer">Source code <ArrowUpRightIcon size={16} aria-hidden="true" /></a></div></footer>
        </main>
      </div>
    </div>
  );
}
