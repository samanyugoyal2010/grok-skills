import {
  ArrowUpRight,
  Check,
  ChefHat,
  FileText,
  Github,
  ShieldCheck
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
          <span className="topbar-context">Task-time skill compiler</span>
          <a className="source-link" href={repositoryUrl} target="_blank" rel="noreferrer">Source <Github size={14} aria-hidden="true" /></a>
          <a className="topbar-cta" href="#station">Set up SkillChef <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </nav>

      <div className="docs-layout">
        <DocsSidebar />
        <main className="content-column" id="main-content" tabIndex={-1}>
          <section className="hero section" id="overview">
            <div className="hero-copy">
              <h1>Turn repeat work into a repo-specific skill.</h1>
              <p className="hero-lede">Give SkillChef a task, project brief, and files you approve. It finds relevant public skills and returns a reviewable <code>SKILL.md</code> with sources and risk notes. Your agent decides whether to save it.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#station">Set up your agent <ArrowUpRight size={15} aria-hidden="true" /></a>
                <a className="text-link" href="#the-recipe">See the output</a>
              </div>
              <div className="hero-facts"><span><Check size={14} aria-hidden="true" /> no repository access</span><span><Check size={14} aria-hidden="true" /> approved files only</span><span><Check size={14} aria-hidden="true" /> inspect before saving</span></div>
            </div>

            <figure className="skill-specimen">
              <figcaption className="specimen-head"><span><FileText size={15} aria-hidden="true" /> Example output</span><span>review before saving</span></figcaption>
              <div className="specimen-path">.agents/skills/account-form-validation/SKILL.md</div>
              <pre className="specimen-body"><code>{`---
name: account-form-validation
description: Add and verify client-side validation in account settings.
---

# Account form validation

## Procedure
1. Reuse the existing form schema.
2. Show field errors beside each input.
3. Cover valid and invalid input with Vitest.

## Repository constraints
- Use the shared form components.
- Do not add a validation dependency.`}</code></pre>
              <div className="specimen-evidence"><span><b>Context</b> src/account/form.ts · approved</span><span><b>Sources</b> 2 public skills · linked</span></div>
            </figure>
          </section>

          <section className="promise-strip" aria-label="Workflow summary">
            <p>Four inputs. One reviewable file.</p>
            <div><span>Task</span><b>→</b><span>Approved files</span><b>→</b><span>Public skills</span><b>→</b><span><code>SKILL.md</code></span></div>
          </section>

          <section className="section method-section" id="how-it-works">
            <div className="section-heading">
              <span className="section-kicker">How it works</span>
              <div><h2>Three steps. You approve each input.</h2><p>SkillChef does not choose which private files to read or install the result on your behalf.</p></div>
            </div>
            <div className="method-line">
              <article className="method-step"><span className="method-index">01</span><h3>Describe the repeatable task</h3><p>Include the outcome, project conventions, and what “done” means.</p></article>
              <article className="method-step method-step-accent"><span className="method-index">02</span><h3>Approve the project context</h3><p>Your agent proposes paths. Only the files you approve are sent.</p></article>
              <article className="method-step"><span className="method-index">03</span><h3>Inspect before installing</h3><p>Review the procedure, source links, context manifest, and risk notes.</p></article>
            </div>
          </section>

          <section className="section station-section" id="station">
            <div className="section-heading">
              <span className="section-kicker">Agent setup</span>
              <div><h2>Connect SkillChef to your coding agent.</h2><p>Add the MCP server once. Save each reviewed skill in the folder that agent scans.</p></div>
            </div>
            <div className="build-row"><div><span className="tiny-label">Build locally</span><p>From the SkillChef repository:</p></div><CodeBlock label="terminal" value={buildExample} /></div>
            <RecipeStation />
          </section>

          <section className="section recipe-section" id="the-recipe">
            <div className="section-heading">
              <span className="section-kicker">The finished skill</span>
              <div><h2>What the compiler returns.</h2><p>A plain Agent Skills file. Its folder name must match the <code>name</code> in its front matter.</p></div>
            </div>
            <div className="recipe-layout">
              <div className="recipe-copy">
                <div className="recipe-detail"><span className="detail-mark detail-green" /><div><strong>Clear name and description</strong><p>Help the agent recognize when this workflow applies.</p></div></div>
                <div className="recipe-detail"><span className="detail-mark detail-yellow" /><div><strong>Repo-specific constraints</strong><p>Carry forward the conventions in the context you approved.</p></div></div>
                <div className="recipe-detail"><span className="detail-mark detail-purple" /><div><strong>Sources to inspect</strong><p>See matched excerpts with source links and content hashes.</p></div></div>
              </div>
              <CodeBlock label="SKILL.md / Agent Skills format" value={skillFrontmatter} />
            </div>
          </section>

          <section className="section contract-section" id="contract">
            <div className="section-heading">
              <span className="section-kicker">What goes in</span>
              <div><h2>Only approved context goes into the request.</h2><p>SkillChef does not read your working tree. The client passes the file paths and contents you approved.</p></div>
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
            <div><span className="section-kicker">Safety</span><h2>Read it like a code change.</h2><p>Public skills can contain unsafe or irrelevant instructions. SkillChef labels sources and flags risky patterns, but those checks are advisory. Without a model endpoint, compilation stays local. If you configure one, approved context is sent to that provider; check its retention terms. Review the generated file before installing it.</p></div>
          </section>

          <footer className="footer"><a className="footer-brand" href="#overview"><ChefHat size={17} aria-hidden="true" /> SkillChef</a><span>Task-time compiler for repo-specific agent skills.</span><a href={repositoryUrl} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={13} aria-hidden="true" /></a></footer>
        </main>
      </div>
    </div>
  );
}
