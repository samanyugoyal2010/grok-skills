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
import { ProviderSetup } from "./components/provider-setup";
import { SetupPrompt } from "./components/setup-prompt";

const repositoryUrl = "https://github.com/samanyugoyal2010/grok-skills";

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

const specimenLines = [
  { kind: "fence", text: "---" },
  { kind: "frontmatter", key: "name:", text: "account-form-validation" },
  { kind: "frontmatter", key: "description:", text: "Validate account settings inputs." },
  { kind: "fence", text: "---" },
  { kind: "blank", text: "" },
  { kind: "title", text: "# Account form validation" },
  { kind: "blank", text: "" },
  { kind: "heading", text: "## Procedure" },
  { kind: "list", text: "1. Reuse the shared schema." },
  { kind: "list", text: "2. Show errors beside fields." },
  { kind: "list", text: "3. Test valid and invalid values." },
  { kind: "blank", text: "" },
  { kind: "heading", text: "## Repo constraints" },
  { kind: "list", text: "- Shared form components; no new dependency." }
];

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
          <a className="topbar-cta" href="#station">Set up your agent <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </nav>

      <div className="docs-layout">
        <DocsSidebar />
        <main className="content-column" id="main-content" tabIndex={-1}>
          <section className="hero section" id="overview">
            <div className="hero-copy">
              <span className="hero-ribbon">A better recipe for repeat work</span>
              <h1>Make repeatable work easier for your agent.</h1>
              <p className="hero-lede">Describe a workflow, approve the project files to share, and get a reusable <code>SKILL.md</code> to review. SkillChef never reads or edits your repository itself.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#station">Set up your agent <ArrowUpRight size={15} aria-hidden="true" /></a>
                <a className="text-link" href="#the-recipe">See the output</a>
              </div>
              <div className="hero-facts"><span><Check size={14} aria-hidden="true" /> You choose what to share</span><span><Check size={14} aria-hidden="true" /> No repository edits</span><span><Check size={14} aria-hidden="true" /> Review before saving</span></div>
            </div>

            <div className="hero-workbench">
              <div className="hero-illustration" aria-label="Illustration of a recipe sheet, tomato, basil, spoon, and a wooden prep board">
                <Image src="/skillchef-prep-art.webp" alt="A recipe sheet, tomato, basil, wooden spoon, and cutting board" width={760} height={507} priority />
                <span>Prep station</span>
              </div>
              <figure className="skill-specimen">
                <figcaption className="specimen-head">
                  <span><FileText size={15} aria-hidden="true" /> SKILL.md</span>
                  <span className="specimen-status"><i aria-hidden="true" /> Ready for review</span>
                </figcaption>
                <div className="specimen-path"><span>Save to</span><code>.agents/skills/account-form-validation/SKILL.md</code></div>
                <pre className="specimen-body"><code>{specimenLines.map((line, index) => (
                  <span className={`specimen-line specimen-line-${line.kind}`} key={index}>
                    {line.kind === "frontmatter" ? <><span className="specimen-key">{line.key}</span> {line.text}</> : line.text || " "}
                  </span>
                ))}</code></pre>
                <div className="specimen-evidence"><span><b>Context</b> src/account/form.ts · approved</span><span><b>Sources</b> 2 public skills · linked</span></div>
              </figure>
            </div>
          </section>

          <section className="promise-strip" aria-label="Workflow summary">
              <p>One workflow, one reusable skill.</p>
            <div><span>Task</span><b>→</b><span>Approved files</span><b>→</b><span>Public skills</span><b>→</b><span><code>SKILL.md</code></span></div>
          </section>

          <section className="section method-section" id="how-it-works">
            <div className="section-heading">
              <span className="section-kicker">The method</span>
              <div><h2>Three steps. You stay in control.</h2><p>Approve what is shared, then inspect the result before using it.</p></div>
            </div>
            <div className="method-line">
              <article className="method-step">
                <span className="method-index">Step 1 · Prep</span>
                <h3>Choose a task and files</h3>
                <p>Describe the repeatable workflow. Approve each file before its text is sent.</p>
              </article>
              <article className="method-step">
                <span className="method-index">Step 2 · Cook</span>
                <h3>Build a focused skill</h3>
                <p>SkillChef finds public references and combines them with approved context.</p>
              </article>
              <article className="method-step">
                <span className="method-index">Step 3 · Taste</span>
                <h3>Review before saving</h3>
                <p>Check the skill, sources, and risk notes. Nothing is saved or run automatically.</p>
              </article>
            </div>
          </section>

          <section className="section station-section" id="station">
            <div className="section-heading">
              <span className="section-kicker">Set up once</span>
              <div><h2>Pick one setup path.</h2><p>Ask your coding agent to guide setup, or configure the local MCP server yourself.</p></div>
            </div>
            <SetupPrompt />
          </section>

          <ProviderSetup />

          <section className="section recipe-section" id="the-recipe">
            <div className="section-heading">
              <span className="section-kicker">The finished skill</span>
              <div><h2>A skill file you can inspect.</h2><p>Save it in your agent’s skills folder. Match the folder name to the file’s <code>name</code>.</p></div>
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
            <div><span className="section-kicker">Safety & deployment</span><h2>Designed to run locally.</h2><p>SkillChef has no accounts or per-user credentials. HTTP mode uses one server-side provider key, so keep it private and single-tenant. Check a cloud provider’s current data terms before sending private code. Public skills and generated instructions are untrusted; risk checks are advisory. Review every skill before use.</p><p className="safety-followup">A shared hosted service needs user authentication, isolated credentials, and tenant-level controls first.</p></div>
          </section>

          <footer className="footer"><a className="footer-brand" href="#overview"><ChefHat size={17} aria-hidden="true" /> SkillChef</a><span>Task-time compiler for repo-specific agent skills.</span><a href={repositoryUrl} target="_blank" rel="noreferrer">Source code <ArrowUpRight size={13} aria-hidden="true" /></a></footer>
        </main>
      </div>
    </div>
  );
}
