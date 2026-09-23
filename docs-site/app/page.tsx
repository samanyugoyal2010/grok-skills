import {
  ArrowUpRight,
  Check,
  ChefHat,
  CircleDot,
  Github,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed
} from "lucide-react";
import { CodeBlock } from "./components/code-block";
import { DocsSidebar } from "./components/docs-sidebar";
import { RecipeStation } from "./components/recipe-station";

const repositoryUrl = "https://github.com/samanyugoyal2010/grok-skills";

const buildExample = `npm ci
npm run build`;

const skillFrontmatter = `---
name: account-form-validation
description: Add and verify client-side validation in the account settings form.
---

# Account form validation

## Procedure
...`;

const requestExample = `{
  "task": "Add client-side validation to account settings.",
  "search_query": "frontend form validation testing",
  "project_brief": "TypeScript app; use Vitest.",
  "approved_context": [
    {
      "path": "src/account/form.ts",
      "reason": "Current form boundary.",
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
          <span className="brand-mark" aria-hidden="true"><ChefHat size={19} /></span>
          <span>SkillChef</span>
        </a>
        <div className="topbar-meta">
          <span className="topbar-context">The agent skill workbench</span>
          <a className="source-link" href={repositoryUrl} target="_blank" rel="noreferrer">Source <Github size={14} aria-hidden="true" /></a>
          <a className="topbar-cta" href="#station">Set up SkillChef <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </nav>

      <div className="docs-layout">
        <DocsSidebar />
        <main className="content-column" id="main-content" tabIndex={-1}>
          <section className="hero section" id="overview">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-rule" />A kitchen for repeatable coding work</div>
              <h1>Make your repo’s way of working a skill.</h1>
              <p className="hero-lede">Bring a workflow you repeat, the project files you approve, and useful public techniques. SkillChef prepares them into a portable, reviewable <code>SKILL.md</code>.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#station">Connect a coding agent <ArrowUpRight size={15} aria-hidden="true" /></a>
                <a className="text-link" href="#how-it-works">See the workflow</a>
              </div>
              <div className="hero-facts"><span><Check size={14} aria-hidden="true" /> local compiler by default</span><span><Check size={14} aria-hidden="true" /> context by approval</span><span><Check size={14} aria-hidden="true" /> human-reviewed output</span></div>
            </div>

            <div className="ticket-scene" role="img" aria-label="A work order listing a repeatable developer task, approved project context, public techniques, and the resulting agent skill">
              <div className="ticket-topline"><span>Prep board</span><span className="ticket-live"><CircleDot size={12} aria-hidden="true" /> Ready to compile</span></div>
              <div className="ticket-main">
                <div className="ticket-row"><span className="ticket-kicker">A repeatable workflow</span><strong>Add form validation to account settings</strong></div>
                <div className="ticket-divider"><span>mise en place</span><i /></div>
                <div className="ingredient-list">
                  <div className="ingredient"><span className="ingredient-mark herb-mark" /><span><b>Repo context</b><small>2 files, approved</small></span></div>
                  <div className="ingredient"><span className="ingredient-mark citrus-mark" /><span><b>Public techniques</b><small>Matched and cited</small></span></div>
                  <div className="ingredient"><span className="ingredient-mark plum-mark" /><span><b>Project brief</b><small>TypeScript · Vitest</small></span></div>
                </div>
                <div className="ticket-action"><Sparkles size={15} aria-hidden="true" /><span>compile_skill</span><span className="action-note">local MCP tool</span></div>
              </div>
              <div className="recipe-output"><div className="recipe-stamp"><UtensilsCrossed size={16} aria-hidden="true" /><span>THE RECIPE</span></div><strong>account-form-validation</strong><span className="recipe-path">SKILL.md <span>·</span> ready to review</span></div>
            </div>
          </section>

          <section className="promise-strip" aria-label="Workflow summary">
            <p>Built for work you’ll do again.</p>
            <div><span>Collect</span><b>→</b><span>Match</span><b>→</b><span>Compile</span><b>→</b><span>Review</span></div>
          </section>

          <section className="section method-section" id="how-it-works">
            <div className="section-heading">
              <span className="section-kicker">How it works</span>
              <div><h2>Good recipes start with what’s already in the kitchen.</h2><p>SkillChef draws from approved repo context and a small set of public skill sources. You inspect the result before saving it.</p></div>
            </div>
            <div className="method-line">
              <article className="method-step"><span className="method-index">01 · Gather</span><h3>Choose the workflow</h3><p>Start with work your team repeats, like reviewing migrations or shipping a UI change.</p><span className="ingredient-tag">workflow</span></article>
              <article className="method-step method-step-accent"><span className="method-index">02 · Prep</span><h3>Approve the ingredients</h3><p>Your agent proposes files first. Include only context that helps define the workflow.</p><span className="ingredient-tag">approved files</span></article>
              <article className="method-step"><span className="method-index">03 · Plate</span><h3>Review the skill</h3><p>Get a standard skill file with its sources, matched techniques, and risk notes.</p><span className="ingredient-tag">SKILL.md</span></article>
            </div>
          </section>

          <section className="section station-section" id="station">
            <div className="section-heading">
              <span className="section-kicker">Agent setup</span>
              <div><h2>Pick an agent. Get the right setup.</h2><p>Connect the compiler once, then place its reviewed recipe where your agent discovers skills.</p></div>
            </div>
            <div className="build-row"><div><span className="tiny-label">FIRST, BUILD LOCALLY</span><p>From the SkillChef repository:</p></div><CodeBlock label="terminal" value={buildExample} /></div>
            <RecipeStation />
          </section>

          <section className="section recipe-section" id="the-recipe">
            <div className="section-heading">
              <span className="section-kicker">The finished skill</span>
              <div><h2>A skill your agent can actually find.</h2><p>The output uses standard Agent Skills metadata, with a folder name that must match the skill’s <code>name</code>.</p></div>
            </div>
            <div className="recipe-layout">
              <div className="recipe-copy">
                <div className="recipe-detail"><span className="detail-mark detail-green" /><div><strong>Clear name and description</strong><p>Help the agent recognize when this workflow applies.</p></div></div>
                <div className="recipe-detail"><span className="detail-mark detail-yellow" /><div><strong>Repo-specific constraints</strong><p>Carry forward the conventions in the context you approved.</p></div></div>
                <div className="recipe-detail"><span className="detail-mark detail-purple" /><div><strong>Sources to inspect</strong><p>See matched excerpts with source links and content hashes.</p></div></div>
              </div>
              <CodeBlock label="SKILL.md · Agent Skills format" value={skillFrontmatter} />
            </div>
          </section>

          <section className="section contract-section" id="contract">
            <div className="section-heading">
              <span className="section-kicker">What goes in</span>
              <div><h2>The agent sends the request. You stay in control.</h2><p>SkillChef never crawls a working tree. The client must pass the paths and file contents the user approved.</p></div>
            </div>
            <div className="contract-layout">
              <CodeBlock label="compile_skill · request" value={requestExample} />
              <div className="boundary-list">
                <div><Check size={15} aria-hidden="true" /><span>Only submitted context reaches the compiler.</span></div>
                <div><Check size={15} aria-hidden="true" /><span>No repository edits or command execution.</span></div>
                <div><Check size={15} aria-hidden="true" /><span>Sources are public GitHub SKILL.md files.</span></div>
                <div><Check size={15} aria-hidden="true" /><span>Review the skill and risk notes before installing.</span></div>
                <a href="https://agentskills.io/specification" target="_blank" rel="noreferrer">Read the Agent Skills specification <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
            </div>
          </section>

          <section className="safety-section" id="safety">
            <div className="safety-mark"><ShieldCheck size={20} aria-hidden="true" /></div>
            <div><span className="section-kicker">Review before serving</span><h2>The compiler proposes. Your agent decides.</h2><p>Public skills can contain unsafe or irrelevant instructions. SkillChef labels sources and flags risky patterns, but those checks are advisory. Without a model endpoint, compilation stays local. If you configure one, approved context is sent to that provider—check its retention terms first. Review the generated file before installing it.</p></div>
          </section>

          <footer className="footer"><a className="footer-brand" href="#overview"><ChefHat size={17} aria-hidden="true" /> SkillChef</a><span>A little more of your workflow, ready for next time.</span><a href={repositoryUrl} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={13} aria-hidden="true" /></a></footer>
        </main>
      </div>
    </div>
  );
}
