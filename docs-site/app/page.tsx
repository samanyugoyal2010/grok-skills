import { ArrowUpRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowUpRight";
import { ChefHatIcon } from "@phosphor-icons/react/dist/ssr/ChefHat";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";
import { ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr/ShieldCheck";
import { CodeBlock } from "./components/code-block";
import { ProviderSetup } from "./components/provider-setup";
import { SetupPrompt } from "./components/setup-prompt";

const repositoryUrl = "https://github.com/samanyugoyal2010/grok-skills";

const skillFrontmatter = `---
name: add-list-filter
description: Add a searchable list filter using the project's existing patterns.
---

# Add a list filter

Use this when a page needs to filter items it already has.

## Recipe
1. Reuse the page's current list and input patterns.
2. Filter loaded items locally. Do not add a request or change the API.
3. Show all items for a blank query.
4. Give a clear message when nothing matches.

## Taste test
- Try matching, unmatched, and blank searches.
- Check keyboard access and input labels.
- Run the project's lint and test commands.`;

const requestExample = `{
  "task": "Add an accessible search filter to the settings page.",
  "search_query": "accessible React client-side list filter empty state",
  "project_brief": "Next.js app; follow existing components and keep filtering client-side.",
  "approved_context": [
    {
      "path": "app/settings/page.tsx",
      "reason": "Reuse the settings page's existing list and input patterns.",
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
                <p className="eyebrow">The prep station for your coding agent</p>
                <h1 className="hero-wordmark">Give your agent the recipe your team follows.</h1>
              </div>
              <div className="hero-copy">
                <p className="hero-kicker">Describe the work. Gather context. Review the draft.</p>
                <p className="hero-lede">Turn a repeatable task into an Agent Skill. Choose the repo files it can use, taste-test the draft, then save it where your agent can find it.</p>
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
                <small>Runs on your computer. Review before saving.</small>
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
              <div><h2>Prep the task. Gather ingredients. Taste-test the draft.</h2><p>Tell SkillChef what to make, choose the files it can use, then check the skill before saving.</p></div>
            </div>
            <div className="method-line">
              <article className="method-step">
                <span className="method-index">01 · Prep</span>
                <h3>Describe the work</h3>
                <p>Say what the agent should do and when this recipe applies.</p>
              </article>
              <article className="method-step">
                <span className="method-index">02 · Ingredients</span>
                <h3>Choose the files it can use</h3>
                <p>Approve exact repo files. Public references are optional.</p>
              </article>
              <article className="method-step">
                <span className="method-index">03 · Taste test</span>
                <h3>Review before you save</h3>
                <p>Check the skill, sources, and risk notes. SkillChef never saves or runs it for you.</p>
              </article>
            </div>
          </section>

          <section className="section recipe-section" id="the-recipe">
            <div className="section-heading">
              <div><h2>A recipe card your agent can follow.</h2><p>A compact skill file with the task, method, guardrails, and final checks spelled out.</p></div>
            </div>
            <div className="recipe-layout">
              <div className="recipe-copy">
                <div className="recipe-detail"><div><strong>A clear reason to use it</strong><p>The name and description tell the agent when to reach for this skill.</p></div></div>
                <div className="recipe-detail"><div><strong>Approved ingredients</strong><p>Only the repo files you choose can shape the draft.</p></div></div>
                <div className="recipe-detail"><div><strong>A final taste test</strong><p>Review the result, source notes, and risks before saving.</p></div></div>
              </div>
              <CodeBlock label="Sample recipe · SKILL.md" value={skillFrontmatter} variant="recipe" />
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
              <div><h2>Know what leaves your kitchen.</h2><p>The MCP server receives your task and only the repo context you approve. Cloud synthesis also sends that material to your chosen provider.</p></div>
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

          <footer className="footer"><a className="footer-brand" href="#overview"><ChefHatIcon size={19} weight="duotone" aria-hidden="true" /> SkillChef</a><span>Turn repeated work into a recipe your agent can follow.</span><div className="footer-links"><a href="/llms.txt">Full guide</a><a href={repositoryUrl} target="_blank" rel="noreferrer">Source code <ArrowUpRightIcon size={16} aria-hidden="true" /></a></div></footer>
        </main>
      </div>
    </div>
  );
}
