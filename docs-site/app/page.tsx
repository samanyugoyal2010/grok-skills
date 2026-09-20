import {
  ArrowUpRight,
  ChevronRight,
  FileCode2,
  Github,
  LockKeyhole,
  Network,
  Radio,
  ShieldCheck,
  Sparkles,
  Terminal
} from "lucide-react";
import { CodeBlock } from "./components/code-block";
import { DocsSidebar } from "./components/docs-sidebar";

const claudeConfig = `{
  "mcpServers": {
    "task-time-skill-compiler": {
      "command": "node",
      "args": ["/absolute/path/to/dist/index.js"]
    }
  }
}`;

const repositoryUrl = "https://github.com/samanyugoyal2010/grok-skills";

const requestExample = `{
  "task": "Add client-side validation to account settings.",
  "search_query": "frontend form validation testing",
  "project_brief": "TypeScript web app with Vitest.",
  "approved_context": [
    {
      "path": "src/account-settings/form.ts",
      "reason": "Current form boundary.",
      "content": "..."
    }
  ]
}`;

const outputExample = `{
  "sources": [{
    "url": "https://github.com/.../SKILL.md",
    "title": "frontend-design",
    "sourceHash": "fcd3fcf3893605287a54c62e3923958dc854f3bad53754cff331cfd69510ecf5",
    "matchReason": "Matched query tokens against the public skill path and content."
  }],
  "contextManifest": [{
    "path": "src/account-settings/form.ts",
    "reason": "Current form boundary.",
    "characterCount": 412
  }],
  "changeSummary": ["Compiled with the deterministic local compiler."],
  "riskNotes": [],
  "skillMarkdown": "# frontend-form-validation..."
}`;

const runtimeExample = `# local stdio (the default)
npm run dev

# stateless HTTP on /mcp
MCP_TRANSPORT=http PORT=3000 npm run dev`;

const errorExample = `{
  "error": "Context path is not allowed: .env"
}`;

export default function Home() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <nav className="topbar" aria-label="Primary navigation">
        <a className="brand" href="#overview" aria-label="Task-Time Skill Compiler home">
          <span className="brand-mark" aria-hidden="true">tt</span>
          <span>task-time</span>
          <span className="brand-muted">/ compiler</span>
        </a>
        <div className="topbar-meta">
          <span className="topbar-context">Documentation <span>/</span> v0.1</span>
          <a className="source-link" href={repositoryUrl} target="_blank" rel="noreferrer">Source <Github size={14} aria-hidden="true" /></a>
          <a href="#quickstart">Quickstart <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </nav>

      <div className="docs-layout">
        <DocsSidebar />

        <main className="content-column" id="main-content" tabIndex={-1}>
          <section className="hero section" id="overview">
            <div className="hero-copy">
              <div className="eyebrow accent-eyebrow"><span className="pulse-dot" /> Task-time documentation</div>
              <h1>Turn a hard-to-explain task into a skill your repo can use.</h1>
              <p className="hero-lede">Task-Time combines the work in front of you, the repository context you approve, and focused public guidance into one inspectable <code>SKILL.md</code>.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#quickstart">Start with the quickstart <ChevronRight size={16} aria-hidden="true" /></a>
                <a className="text-link" href="#contract">Read the contract <ArrowUpRight size={15} aria-hidden="true" /></a>
              </div>
              <div className="hero-note"><span>Made for</span><strong>Claude Code + MCP</strong><span>·</span><span>deterministic by default</span><span>·</span><span>no repository writes</span></div>
            </div>

            <div className="trace-card" aria-label="Compiler flow preview">
              <div className="trace-header"><span>compile_skill</span><span>local by default</span></div>
              <div className="trace-stack">
                <div className="trace-step"><span className="trace-number">01</span><div><span className="trace-label">task</span><strong>"Add form validation"</strong></div></div>
                <div className="trace-connector" aria-hidden="true" />
                <div className="trace-step"><span className="trace-number">02</span><div><span className="trace-label">context</span><strong>2 approved files</strong></div></div>
                <div className="trace-connector" aria-hidden="true" />
                <div className="trace-step"><span className="trace-number">03</span><div><span className="trace-label">sources</span><strong>frontend-design + 2</strong></div></div>
                <div className="trace-connector" aria-hidden="true" />
                <div className="trace-result"><FileCode2 size={18} aria-hidden="true" /><div><span className="trace-label">output</span><strong>SKILL.md</strong></div><span className="result-status">deterministic</span></div>
              </div>
              <div className="trace-footer"><span className="status-dot" /> provenance and risk notes included</div>
            </div>
          </section>

          <section className="proof-strip" aria-label="Product boundary">
            <p>The useful boundary is simple: the compiler proposes, your agent decides.</p>
            <div className="proof-items"><span><b>01</b> approve private context</span><span><b>02</b> retrieve public guidance</span><span><b>03</b> inspect the result</span></div>
          </section>

          <section className="section workflow-section" id="workflow">
            <div className="section-heading">
              <span className="section-index">02</span>
              <div><h2>From task to artifact</h2><p>Three deliberate steps keep the useful context visible and the boundary narrow.</p></div>
            </div>
            <div className="workflow-grid">
              <article className="workflow-card">
                <div className="step-icon"><LockKeyhole size={19} aria-hidden="true" /></div>
                <span className="step-number">Approve</span>
                <h3>Choose the context</h3>
                <p>The agent proposes files. You approve the paths before private content crosses the boundary.</p>
              </article>
              <article className="workflow-card featured-step">
                <div className="step-icon"><Network size={19} aria-hidden="true" /></div>
                <span className="step-number">Retrieve</span>
                <h3>Find public guidance</h3>
                <p>A focused public-skill adapter retrieves relevant Markdown and records each source URL and hash.</p>
              </article>
              <article className="workflow-card">
                <div className="step-icon"><Sparkles size={19} aria-hidden="true" /></div>
                <span className="step-number">Compile</span>
                <h3>Generate the artifact</h3>
                <p>Get a reusable SKILL.md with repository constraints, examples, provenance, and risk notes.</p>
              </article>
            </div>
          </section>

          <section className="section quickstart-section" id="quickstart">
            <div className="section-heading">
              <span className="section-index">03</span>
              <div><h2>Quickstart</h2><p>Get a first result without adding an account, database, or repository integration.</p></div>
            </div>
            <div className="quickstart-grid">
              <div className="quickstart-copy">
                <div className="install-step"><span>1</span><div><h3>Clone and build</h3><p>From the repository root, run <code>npm ci</code> and <code>npm run build</code>, then point Claude Code at <code>dist/index.js</code>.</p></div></div>
                <div className="install-step"><span>2</span><div><h3>Approve the context</h3><p>Ask the agent to list the files it plans to send. Keep the approval narrow and task-specific.</p></div></div>
                <div className="install-step"><span>3</span><div><h3>Save the output</h3><p>Review the returned Markdown, then save it as a repository-local <code>SKILL.md</code>.</p></div></div>
              </div>
              <div className="quickstart-configs">
                <CodeBlock label=".mcp.json" value={claudeConfig} />
                <aside className="quiet-note"><span className="eyebrow">Review before install</span><p>Task-Time never edits or executes your repository. The default compiler is deterministic, and private context is sent only after approval.</p></aside>
              </div>
            </div>
          </section>

          <section className="section contract-section" id="contract">
            <div className="section-heading">
              <span className="section-index">04</span>
              <div><h2>Tool contract</h2><p>Designed to be small enough to understand before the first call.</p></div>
            </div>
            <div className="contract-grid">
              <div className="contract-panel">
                <div className="panel-label"><Terminal size={15} aria-hidden="true" /> input / compile_skill</div>
                <CodeBlock label="request.json" value={requestExample} />
                <div className="limit-list"><span>task <b>4,000 chars</b></span><span>search_query <b>500 chars</b></span><span>approved_context <b>10 files / 50k chars</b></span><span>skillMarkdown <b>16,000 chars max</b></span></div>
              </div>
              <div className="contract-panel output-panel">
                <div className="panel-label"><FileCode2 size={15} aria-hidden="true" /> output / inspectable artifact</div>
                <CodeBlock label="response.json" value={outputExample} />
                <div className="output-tags"><span>sources</span><span>context manifest</span><span>risk notes</span><span>skillMarkdown</span></div>
              </div>
            </div>
          </section>

          <section className="section reference-section" id="reference">
            <div className="section-heading">
              <span className="section-index">05</span>
              <div><h2>Runtime reference</h2><p>Use stdio locally. Use the protected HTTP endpoint when another process needs the compiler.</p></div>
            </div>
            <div className="reference-grid">
              <div className="reference-panel"><div className="panel-label"><Radio size={15} aria-hidden="true" /> transports</div><CodeBlock label="terminal" value={runtimeExample} /><dl className="reference-list"><div><dt>stdio</dt><dd>Default transport for Claude Code. JSON-RPC stays on stdout; logs go to stderr.</dd></div><div><dt>HTTP</dt><dd>Stateless MCP at <code>/mcp</code>, with a liveness check at <code>/healthz</code>. It binds to <code>127.0.0.1</code> unless configured otherwise.</dd></div></dl></div>
              <div className="reference-panel"><div className="panel-label"><Terminal size={15} aria-hidden="true" /> environment</div><div className="env-table"><div><code>MCP_TRANSPORT</code><span><code>stdio</code> by default; set <code>http</code> for the stateless endpoint.</span></div><div><code>PORT</code><span>HTTP port; default 3000.</span></div><div><code>MCP_HTTP_HOST</code><span>HTTP bind address; default 127.0.0.1.</span></div><div><code>MCP_HTTP_AUTH_TOKEN</code><span>Required for non-loopback HTTP hosts.</span></div><div><code>MCP_HTTP_ALLOWED_ORIGINS</code><span>Browser origins must be listed explicitly; other Origin headers are rejected.</span></div><div><code>MCP_HTTP_ALLOWED_HOSTS</code><span>Required for non-loopback binds; hostnames for DNS-rebinding protection.</span></div><div><code>MCP_HTTP_MAX_BODY_BYTES</code><span>Request limit; default 256,000 bytes.</span></div><div><code>PUBLIC_SKILL_REPOSITORIES</code><span>Public GitHub repositories for the first adapter.</span></div><div><code>PUBLIC_SKILL_BRANCH</code><span>Branch used by the public-skill adapter; default main.</span></div><div><code>PUBLIC_SKILL_FETCH_TIMEOUT_MS</code><span>Per-request retrieval timeout; default 10,000.</span></div><div><code>PUBLIC_SKILL_GITHUB_TOKEN</code><span>Optional server-side token for higher GitHub API limits.</span></div><div><code>SKILL_COMPILER_MODEL_URL</code><span>Optional compatible JSON model endpoint.</span></div><div><code>SKILL_COMPILER_MODEL_TOKEN</code><span>Optional bearer token for the model endpoint.</span></div><div><code>SKILL_COMPILER_MODEL_TIMEOUT_MS</code><span>Model request timeout; default 20,000.</span></div><div><code>SKILL_COMPILER_ALLOW_INSECURE_HTTP</code><span>Development-only escape hatch for a non-loopback model URL; default false.</span></div><div><code>SKILL_COMPILER_DEADLINE_MS</code><span>End-to-end compile deadline; default 60,000.</span></div><div><code>MAX_IN_FLIGHT_COMPILATIONS</code><span>Process concurrency cap; default 2.</span></div><div><code>RATE_LIMIT_PER_MINUTE</code><span>HTTP requests per client address per minute; default 10.</span></div><div><code>RATE_LIMIT_MAX_KEYS</code><span>Maximum in-memory client buckets; default 10,000.</span></div></div></div>
            </div>
            <div className="reference-footnote"><strong>When a call fails</strong><div><span>The tool returns <code>isError: true</code> with a JSON error message. Retrieval and model timeouts fall back safely; an empty retrieval result still produces a deterministic skill.</span><CodeBlock label="error.json" value={errorExample} /></div></div>
          </section>

          <section className="section safety-section" id="safety">
            <div className="section-heading"><span className="section-index">06</span><div><h2>Safety boundaries</h2><p>Keep the compiler useful without giving it repository control.</p></div></div>
            <div className="safety-callout"><div className="safety-icon"><ShieldCheck size={21} aria-hidden="true" /></div><div><span className="eyebrow">A deliberate boundary</span><h2>The compiler proposes. Your agent decides.</h2><p>Task-Time never edits or executes the repository. Public skill content is treated as untrusted input, and the response calls out shell, network, destructive, and credential-related instructions for review.</p></div></div>
            <div className="principles-grid"><div><span className="principle-marker">01</span><h3>Private by approval</h3><p>Only context explicitly included in the request is sent to the compiler.</p></div><div><span className="principle-marker">02</span><h3>Traceable by default</h3><p>Every public source is returned with a URL, title, and content hash.</p></div><div><span className="principle-marker">03</span><h3>Inspectable output</h3><p>The result is Markdown you can read, edit, and commit like any other file.</p></div></div>
          </section>

          <footer className="footer"><div><span className="footer-brand">task-time / compiler</span><p>Task-time guidance for agents that work in real repositories.</p></div><div className="footer-links"><a href="#overview">Back to top <ArrowUpRight size={14} aria-hidden="true" /></a><span>Built for Claude Code</span></div></footer>
        </main>
      </div>
    </div>
  );
}
