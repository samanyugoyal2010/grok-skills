import {
  ArrowUpRight,
  Check,
  ChefHat,
  FileText,
  Github,
  ShieldCheck
} from "lucide-react";
import Image from "next/image";
import { CodeBlock } from "./components/code-block";
import { DocsSidebar } from "./components/docs-sidebar";
import { RecipeStation } from "./components/recipe-station";
import { ProviderSetup } from "./components/provider-setup";

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
              <span className="hero-ribbon">A little prep. A much better workflow.</span>
              <h1>Turn repeat work into a repo-specific skill.</h1>
              <p className="hero-lede">Give SkillChef a task, project brief, and files you approve. It finds relevant public skills and returns a reviewable <code>SKILL.md</code> with sources and risk notes. Your agent decides whether to save it.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#station">Set up your agent <ArrowUpRight size={15} aria-hidden="true" /></a>
                <a className="text-link" href="#the-recipe">See the output</a>
              </div>
              <div className="hero-facts"><span><Check size={14} aria-hidden="true" /> no repository access</span><span><Check size={14} aria-hidden="true" /> approved files only</span><span><Check size={14} aria-hidden="true" /> inspect before saving</span></div>
            </div>

            <div className="hero-workbench">
              <div className="hero-illustration" aria-label="Illustration of a recipe sheet, tomato, basil, spoon, and a wooden prep board">
                <Image src="/skillchef-prep-art.webp" alt="A recipe sheet, tomato, basil, wooden spoon, and cutting board" width={760} height={507} priority />
                <span>Gather the good bits</span>
              </div>
              <figure className="skill-specimen">
                <figcaption className="specimen-head"><span><FileText size={15} aria-hidden="true" /> Example output</span><span>review before saving</span></figcaption>
                <div className="specimen-path">.agents/skills/account-form-validation/SKILL.md</div>
                <pre className="specimen-body"><code>{`---
name: account-form-validation
description: Validate account settings inputs.
---

# Account form validation

## Procedure
1. Reuse the shared schema.
2. Show errors beside fields.
3. Test valid and invalid values.

## Repo constraints
- Shared form components; no new dependency.`}</code></pre>
                <div className="specimen-evidence"><span><b>Context</b> src/account/form.ts · approved</span><span><b>Sources</b> 2 public skills · linked</span></div>
              </figure>
            </div>
          </section>

          <section className="promise-strip" aria-label="Workflow summary">
            <p>From task to reviewable file.</p>
            <div><span>Task</span><b>→</b><span>Approved files</span><b>→</b><span>Public skills</span><b>→</b><span><code>SKILL.md</code></span></div>
          </section>

          <section className="section method-section" id="how-it-works">
            <div className="section-heading">
              <span className="section-kicker">How it works</span>
              <div><h2>Prep the context. Cook the skill. Taste before saving.</h2><p>Your coding agent stays in control of file selection and installation. SkillChef only compiles the request it receives.</p></div>
            </div>
            <div className="method-line">
              <article className="method-step">
                <span className="method-index">01 / PREP</span>
                <h3>Choose the ingredients</h3>
                <p>Describe the task and brief. Your agent proposes useful files; approve the exact text before sending it.</p>
              </article>
              <article className="method-step">
                <span className="method-index">02 / COOK</span>
                <h3>Compile a focused skill</h3>
                <p>SkillChef pairs public skill references with the approved context, using your configured model or its local deterministic compiler.</p>
              </article>
              <article className="method-step">
                <span className="method-index">03 / TASTE</span>
                <h3>Inspect before plating</h3>
                <p>Review the skill, linked sources, context manifest, and risk notes. Your agent asks before saving; nothing runs automatically.</p>
              </article>
            </div>
          </section>

          <section className="section station-section" id="station">
            <div className="section-heading">
              <span className="section-kicker">Agent setup</span>
              <div><h2>Run the compiler beside your agent.</h2><p>In the local setup, your coding agent starts SkillChef as an MCP child process. The page only documents setup; provider keys never belong in this site or an agent config.</p></div>
            </div>
            <div className="build-row"><div><span className="tiny-label">Build locally</span><p>From the SkillChef repository:</p></div><CodeBlock label="terminal" value={buildExample} /></div>
            <RecipeStation />
          </section>

          <ProviderSetup />

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
              <div><h2>Know what leaves the machine.</h2><p>The MCP tool receives the approved task payload. With a model provider configured, that payload is sent for synthesis; without one, the deterministic compiler runs locally.</p></div>
            </div>
            <div className="contract-layout">
              <CodeBlock label="compile_skill · request" value={requestExample} />
              <div className="boundary-list">
                <div><Check size={15} aria-hidden="true" /><span><b>Local MCP process:</b> receives the task and approved text from your coding agent.</span></div>
                <div><Check size={15} aria-hidden="true" /><span><b>GitHub:</b> receives public retrieval requests for configured skill repositories.</span></div>
                <div><Check size={15} aria-hidden="true" /><span><b>Model provider (optional):</b> receives the submitted task, brief, approved file contents, and selected public skill excerpts for synthesis.</span></div>
                <div><Check size={15} aria-hidden="true" /><span><b>Your repository:</b> is never read or changed by SkillChef; your agent asks before saving the returned file.</span></div>
                <a href="https://agentskills.io/specification" target="_blank" rel="noreferrer">Read the Agent Skills specification <ArrowUpRight size={14} aria-hidden="true" /></a>
              </div>
            </div>
          </section>

          <section className="safety-section" id="safety">
            <div className="safety-mark"><ShieldCheck size={20} aria-hidden="true" /></div>
            <div><span className="section-kicker">Safety & deployment</span><h2>Local-first today. Not shared BYOK hosting.</h2><p>SkillChef has no user accounts, persistent storage, or per-user provider credentials. Its optional HTTP transport uses the server’s single provider key and billing identity, so it is for a private single-owner deployment—not a public multi-user service. Before sending private code, verify the chosen provider’s current retention and training terms. Public skills and model output are untrusted; risk checks are advisory. Review the generated file before installing it.</p><p className="safety-followup">For a hosted multi-user product, add authentication, per-user authorization and isolated credentials, managed secret storage, tenant-aware rate limits, and explicit data-retention controls first.</p></div>
          </section>

          <footer className="footer"><a className="footer-brand" href="#overview"><ChefHat size={17} aria-hidden="true" /> SkillChef</a><span>Task-time compiler for repo-specific agent skills.</span><a href={repositoryUrl} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={13} aria-hidden="true" /></a></footer>
        </main>
      </div>
    </div>
  );
}
