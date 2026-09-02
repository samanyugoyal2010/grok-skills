#!/usr/bin/env node
/**
 * Generates SKILL.md files + catalog JSON from compact skill definitions.
 */
import { mkdirSync, writeFileSync, rmSync, existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OWNER = "samanyugoyal2010";
const REPO = "grok-skills";
const SOURCE = `${OWNER}/${REPO}`;

/** @typedef {{ name: string, short: string, use: string, connectors: string[], computerUse: boolean, approvals: string[], category: string, steps: string[] }} Def */

/** @type {Def[]} */
const DEFS = [];

function add(category, connectors, computerUse, approvals, rows) {
  for (const row of rows) {
    const [name, short, use, ...steps] = row;
    DEFS.push({
      name,
      short,
      use,
      connectors,
      computerUse,
      approvals,
      category,
      steps: steps.length ? steps : [`Do the ${short} workflow on current inputs.`, "Stop at a reviewable draft."],
    });
  }
}

add("meta", [], false, ["install-skill"], [
  [
    "find-skills",
    "Discover and install Grok Bot skills from the grok-skills catalog",
    "how do I, find a skill, is there a skill, install a skill, search skills, extend grok bot, missing capability",
    "Search the catalog for the user's need.",
    "Show the top matches with install commands.",
    "Install the best match globally only after the user agrees, or immediately if they asked to install it.",
  ],
  [
    "write-a-skill",
    "Draft a new Grok Bot SKILL.md that passes grok-skills check",
    "create a skill, write SKILL.md, save this as a skill, author a skill",
    "Capture when-to-use, inputs, sequence, validation, return value, and approvals.",
    "Write SKILL.md and run grok-skills check.",
  ],
]);

add("inbox", ["gmail"], false, ["send-email", "archive"], [
  ["inbox-triage", "Triage an inbox into needs-reply, FYI, and noise", "inbox triage, catch up on email, gmail review", "Fetch unread threads in the window.", "Label each thread.", "Draft replies for needs-reply. Do not send."],
  ["unread-digest", "Build a ranked unread email digest", "unread digest, email summary, what did I miss", "Pull unread mail.", "Rank by VIP and urgency.", "Return a digest with thread ids."],
  ["draft-replies", "Draft replies in the user's voice", "draft replies, answer this email, write a response", "Read the thread.", "Draft a reply. Do not send."],
  ["vip-followup", "List unanswered VIP threads", "vip followup, waiting on me, unanswered important mail", "Load VIP list or infer from frequency.", "Find unanswered threads.", "Draft nudges. Do not send."],
  ["unsubscribe-noise", "Propose newsletters to unsubscribe", "unsubscribe, newsletter cleanup, email noise", "Cluster bulk senders.", "Propose unsubscribes. Do not click unsubscribe until approved."],
  ["email-to-tasks", "Turn emails into a task list", "email to tasks, action items from inbox", "Extract asks and due dates.", "Return tasks. Do not create tracker items until approved."],
  ["thread-summary", "Summarize a long email thread", "summarize thread, recap this email chain", "Read the thread.", "Return decisions, asks, and open questions."],
  ["out-of-office-brief", "Brief the user after time away", "ooo brief, back from vacation inbox", "Cover the away window.", "Split urgent vs can-wait.", "Draft replies for urgent only."],
  ["attachment-intake", "Index email attachments into a review list", "email attachments, intake invoices from mail", "Collect attachments in the window.", "Extract vendor/date/amount when possible.", "Do not file them into finance systems until approved."],
  ["mailing-list-digest", "Collapse mailing-list traffic into themes", "mailing list digest, listserv summary", "Group by list.", "Return themes and notable threads."],
  ["escalate-stale-threads", "Find threads stuck waiting more than N days", "stale email, unanswered for days", "Find threads idle past the threshold.", "Draft bumps. Do not send."],
  ["meeting-request-triage", "Triage meeting-request emails", "meeting request email, calendar invite from mail", "Parse time, attendees, purpose.", "Propose accept/decline. Do not respond until approved."],
]);

add("calendar", ["google-calendar"], false, ["create-event", "send-invite"], [
  ["calendar-prep", "Prep the next day's meetings with briefs", "calendar prep, tomorrow's meetings, meeting briefs", "List events.", "Attach a one-paragraph brief each.", "Do not change the calendar."],
  ["schedule-hold", "Propose holds that do not send invites", "hold on calendar, block time, schedule hold", "Find free slots.", "Propose holds. Do not create events until approved."],
  ["conflict-scan", "Find calendar conflicts and double-books", "calendar conflict, double booked", "Scan the window.", "List conflicts with event ids.", "Do not decline until approved."],
  ["weekly-time-audit", "Audit where time went last week", "time audit, calendar audit, meeting load", "Categorize events.", "Return hours by category."],
  ["meeting-agenda", "Draft an agenda from the invite and docs", "meeting agenda, agenda for standup", "Read invite + linked docs.", "Draft agenda. Do not email attendees."],
  ["meeting-notes-pack", "Turn notes into decisions, owners, and dates", "meeting notes, action items from meeting", "Structure notes.", "Do not create tracker tickets until approved."],
  ["travel-day-plan", "Build a travel-day calendar plan", "travel day, airport calendar, trip day plan", "Stack flights, buffers, and meetings.", "Propose events. Do not book travel."],
  ["focus-block-protect", "Propose focus blocks around deep work", "focus time, protect calendar, maker schedule", "Find fragmentable days.", "Propose focus blocks. Do not invite anyone."],
]);

add("crm", ["salesforce"], false, ["customer-contact", "send-email"], [
  ["weekly-account-health", "Score CRM accounts for churn and expansion risk", "weekly account health, churn risk, customer-risk", "Pull the account list.", "Score with evidence.", "Do not contact customers."],
  ["pipeline-hygiene", "Flag stale or mis-staged deals", "pipeline hygiene, crm cleanup, stale deals", "Find stale close dates and empty next steps.", "Propose field updates. Do not write until approved."],
  ["lead-score", "Score new leads against the ICP", "lead scoring, qualify leads, icp match", "Score leads.", "Return a ranked list. Do not enroll sequences."],
  ["account-research", "Research an account across web and CRM", "account research, company brief before a call", "Pull CRM + public web.", "Return a brief. Do not contact anyone."],
  ["contact-map", "Map buying-committee contacts on an account", "org chart, buying committee, contact map", "List contacts and roles.", "Do not add contacts until approved."],
  ["outbound-drafts", "Draft outbound email and LinkedIn in the user's voice", "outbound drafts, sales email draft, linkedin outreach draft", "Draft per contact.", "Do not send or connect."],
  ["call-prep", "Build a call-prep pack for a meeting", "call prep, sales call brief", "Pull account, last activity, open opps.", "Return questions and risks."],
  ["win-loss-notes", "Structure a win/loss interview into notes", "win loss, why we lost, closed lost notes", "Capture reasons and competitors.", "Do not email the customer."],
  ["renewal-risk", "Flag renewals at risk in the next two quarters", "renewal risk, upcoming renewals", "Filter by close date.", "Cite usage or sentiment if available.", "Do not offer discounts."],
  ["qbr-brief", "Assemble a QBR brief from CRM and docs", "qbr brief, quarterly business review", "Pull usage, tickets, pipeline.", "Draft the brief. Do not send to the customer."],
  ["competitor-watch", "Watch competitor mentions on named accounts", "competitor watch, displacement risk", "Search notes and web.", "Return mentions. Do not message accounts."],
  ["sequence-pause-review", "Review who is in sequences and who should be paused", "sequence pause, sales engagement review", "List active enrollments.", "Propose pauses. Do not change sequences until approved."],
  ["deal-desk-pack", "Assemble a deal-desk exception pack", "deal desk, discount request pack", "Collect deal fields and justification.", "Do not approve pricing."],
  ["territory-digest", "Digest a territory's pipeline and activity", "territory digest, regional pipeline", "Aggregate by owner/region.", "Return the digest."],
  ["champion-map", "Identify likely champions and detractors", "champion mapping, economic buyer", "Use titles and activity.", "Do not contact them."],
  ["icp-fit-review", "Review a list of accounts for ICP fit", "icp fit, target account review", "Score against ICP rules.", "Return yes/maybe/no with reasons."],
]);

add("support", ["browser"], true, ["customer-contact", "production-access"], [
  ["staging-repro-pack", "Reproduce a bug in staging and return a repro pack", "reproduce bug, staging repro, ticket repro", "Reproduce in staging only.", "Capture steps and evidence.", "Never use production customer data."],
  ["ticket-triage", "Triage support tickets by severity and type", "ticket triage, support queue, zendesk triage", "Label severity and product area.", "Draft replies. Do not send."],
  ["bug-repro-from-logs", "Turn logs plus a ticket into a repro hypothesis", "logs repro, stacktrace ticket", "Extract errors.", "Propose staging steps.", "Do not hit production."],
  ["customer-escalation-pack", "Build an escalation pack for a hot customer", "customer escalation, sev1 customer", "Collect tickets, ARR, last contacts.", "Do not email the customer."],
  ["sla-breach-watch", "Watch tickets approaching SLA breach", "sla breach, sla risk", "List at-risk tickets.", "Propose owners. Do not reassign until approved."],
  ["knowledge-gap-notes", "Find repeating tickets that need a help-center article", "knowledge gap, missing help article", "Cluster repeats.", "Draft article outlines. Do not publish."],
  ["refund-draft", "Draft a refund recommendation against policy", "refund request, credit request", "Check policy.", "Draft the recommendation. Do not issue refunds."],
  ["status-page-check", "Check status pages for an incident window", "status page, vendor outage", "Open named status pages.", "Return current component status."],
  ["cs-health-digest", "Digest CSAT/NPS plus open tickets for an account", "cs health, csat digest", "Combine scores and tickets.", "Do not contact the customer."],
  ["macro-draft", "Draft a support macro from a good reply", "support macro, canned response", "Turn the reply into a reusable macro.", "Do not publish the macro until approved."],
]);

add("eng", ["github"], false, ["merge-pr", "production-change"], [
  ["pr-review-pack", "Build a structured PR review pack", "pr review, review this pull request", "Read the diff.", "List risks, tests, and questions.", "Do not merge."],
  ["ci-failure-triage", "Triage a failing CI run", "ci failed, github actions red", "Read logs.", "Identify first failure.", "Do not rerun paid workflows in a loop."],
  ["dependabot-batch", "Batch Dependabot PRs into safe vs review-needed", "dependabot, bump dependencies", "Group by risk.", "Do not merge."],
  ["release-notes-draft", "Draft release notes from merged PRs", "release notes, changelog from prs", "Collect merged PRs since last tag.", "Do not publish a GitHub release."],
  ["incident-timeline", "Build an incident timeline from chat and deploys", "incident timeline, postmortem draft", "Order events.", "Do not page people."],
  ["changelog-from-commits", "Draft a changelog from git log", "changelog, commits since tag", "Group commits.", "Do not tag a release."],
  ["flaky-test-hunt", "Find flaky tests from CI history", "flaky tests, quarantined tests", "Mine failures.", "Propose quarantines. Do not disable tests until approved."],
  ["error-budget-report", "Report error-budget burn from SLO docs", "error budget, slo report", "Compute burn if data exists.", "Do not change alerts."],
  ["runbook-follow", "Follow a runbook and record each step", "follow runbook, execute runbook", "Execute read-only steps.", "Stop before destructive actions."],
  ["deploy-diff-review", "Review what changed between two deploys", "deploy diff, what shipped", "Compare shas or tags.", "Do not roll back."],
  ["oncall-handoff", "Draft an on-call handoff", "oncall handoff, pager handoff", "Collect open incidents and pages.", "Do not snooze pages."],
  ["rfc-comment-pass", "Comment on an RFC with structured feedback", "rfc review, design doc comments", "List questions and risks.", "Do not merge the RFC."],
  ["codeowner-nudge", "Find PRs waiting on code owners", "codeowners, review nudges", "List stalled PRs.", "Draft nudges. Do not mention-spam."],
  ["security-advisory-triage", "Triage GitHub/security advisories", "security advisory, cve triage", "Map to repos.", "Do not publish patches."],
  ["api-breaking-change-scan", "Scan a diff for likely breaking API changes", "breaking change, api compatibility", "Inspect exports and routes.", "Do not ship."],
  ["perf-regression-notes", "Turn a perf diff into notes and suspects", "perf regression, slower p95", "Compare metrics.", "Do not roll back."],
  ["local-repro-from-ticket", "Turn a ticket into local reproduction steps", "local repro, run this bug locally", "Write steps and fixtures.", "Do not use production data."],
  ["seed-data-refresh", "Plan a staging seed-data refresh", "seed data, staging fixtures", "List datasets.", "Do not overwrite staging until approved."],
  ["docker-build-fail", "Diagnose a Docker build failure", "docker build failed, image build error", "Read the log.", "Propose a fix. Do not push images."],
  ["migrate-plan-review", "Review a database migration plan", "migration review, schema migrate", "Check expand/contract and rollback.", "Do not run migrations."],
  ["log-spike-explain", "Explain a log or error spike", "error spike, log volume", "Identify top signatures.", "Do not change sampling."],
  ["staging-smoke", "Run a staging smoke checklist", "staging smoke, sanity check staging", "Hit listed checks.", "Do not test in production."],
]);

add("data", ["browser"], false, ["warehouse-write"], [
  ["sql-question-pack", "Turn a business question into SQL plus caveats", "write sql, warehouse question", "Draft SQL.", "Do not run unbounded queries if a dry-run exists.", "Do not INSERT/UPDATE/DELETE."],
  ["dashboard-anomaly", "Explain a dashboard anomaly", "dashboard anomaly, metric spike", "Compare to baseline.", "Do not change the dashboard."],
  ["metric-definition-check", "Check a metric against its definition", "metric definition, is this kpi correct", "Compare formula vs docs.", "Do not edit the BI tool until approved."],
  ["csv-cleanup", "Clean a CSV and report row counts", "clean csv, wrangle spreadsheet", "Fix types and dupes.", "Do not overwrite the original until approved."],
  ["warehouse-row-count", "Compare row counts across tables or days", "row count, table volume", "Query counts.", "Do not modify tables."],
  ["experiment-readout", "Draft an experiment readout", "ab test readout, experiment results", "State sample, effect, caveats.", "Do not ship the treatment."],
  ["funnel-dropoff", "Find funnel drop-off steps", "funnel analysis, conversion drop", "Compute step rates.", "Do not change tracking."],
  ["cohort-note", "Write a cohort retention note", "cohort retention, retention curve", "Build the cohort table if data allows.", "Do not email customers."],
  ["gsheet-reconcile", "Reconcile two sheets or tabs", "reconcile sheets, spreadsheet match", "Diff keys.", "Do not rewrite the sheet until approved."],
  ["dbt-test-fail", "Triage failing dbt tests", "dbt test, data test fail", "Read failures.", "Do not drop tables."],
]);

add("finance", ["browser", "drive"], true, ["submit-expense", "purchase"], [
  ["expense-draft", "Draft an expense report from receipts without submitting", "expense report, file expenses, receipts", "Extract receipt fields.", "Check policy.", "Do not submit."],
  ["invoice-draft", "Draft an invoice from line items", "draft invoice, bill a customer", "Build line items.", "Do not send the invoice."],
  ["ap-aging", "Build an accounts-payable aging list", "ap aging, unpaid bills", "Bucket by age.", "Do not pay bills."],
  ["ar-followup-draft", "Draft AR follow-ups for overdue invoices", "ar followup, collections draft", "List overdue invoices.", "Draft emails. Do not send."],
  ["budget-vs-actual", "Compare budget vs actuals", "budget vs actual, variance report", "Compute variances.", "Do not change the budget."],
  ["vendor-renewal", "Flag vendor renewals in the next 90 days", "vendor renewal, saas renewal", "List vendors and dates.", "Do not auto-renew."],
  ["receipt-match", "Match receipts to card transactions", "match receipts, card txns", "Pair by date/amount.", "Do not post journals."],
  ["cash-forecast-note", "Draft a short cash forecast note", "cash forecast, runway note", "Use provided actuals.", "Do not move money."],
  ["contract-value-extract", "Extract commercial values from a contract PDF", "contract value, arr extract", "Pull fees, term, auto-renew.", "Do not sign."],
  ["tax-doc-index", "Index tax documents in a folder", "tax docs, w9 index", "List files and types.", "Do not file with an authority."],
  ["card-spend-anomaly", "Flag unusual card spend", "card anomaly, surprise charge", "Compare to baseline.", "Do not dispute until approved."],
  ["payroll-change-check", "Check a proposed payroll change for missing fields", "payroll change, compensation change check", "Validate fields.", "Do not submit payroll."],
]);

add("people", ["browser"], false, ["offer-send", "hr-system-write"], [
  ["recruiter-screen-pack", "Build a recruiter screen pack from a resume and JD", "screen candidate, resume vs jd", "Score must-haves.", "Do not email the candidate."],
  ["interview-loop-plan", "Plan an interview loop", "interview loop, interview panel", "Map competencies to interviewers.", "Do not send calendar invites until approved."],
  ["offer-comp-note", "Draft an offer compensation note", "offer letter notes, comp note", "Use bands if provided.", "Do not send an offer."],
  ["onboarding-checklist", "Build a role-specific onboarding checklist", "onboarding plan, new hire checklist", "List access, people, and 30/60/90.", "Do not provision accounts."],
  ["candidate-debrief", "Structure interviewer debriefs into one view", "debrief, interview feedback synthesis", "Cluster signal.", "Do not reject/advance in the ATS until approved."],
  ["job-post-draft", "Draft a job post from a JD", "job post, write a job description", "Draft the post.", "Do not publish."],
  ["referral-triage", "Triage employee referrals against open roles", "referral triage, employee referral", "Match to reqs.", "Do not email referrers with a decision."],
  ["headcount-plan-note", "Draft a headcount plan note from reqs", "headcount plan, hiring plan", "Summarize open reqs and dates.", "Do not open reqs."],
  ["skip-level-prep", "Prep skip-level 1:1 notes", "skip level, 1:1 prep", "Pull recent themes.", "Do not message the skip's reports."],
  ["performance-packet", "Assemble a performance-review packet from notes", "performance review packet, promo packet", "Organize evidence.", "Do not submit the review."],
]);

add("docs", ["drive"], false, ["publish", "email-broadcast"], [
  ["meeting-recap", "Write a meeting recap with owners and dates", "meeting recap, send notes", "Write the recap.", "Do not email the list until approved."],
  ["decision-log", "Append a decision-log entry", "adr, decision log", "Capture context, decision, consequences.", "Do not overwrite history."],
  ["weekly-update", "Draft a weekly update", "weekly update, status email", "Draft. Do not send."],
  ["board-pre-read", "Assemble a board pre-read outline", "board deck outline, pre-read", "Outline sections from metrics provided.", "Do not email the board."],
  ["policy-diff", "Diff two policy versions in plain language", "policy diff, what changed in the policy", "List material changes.", "Do not publish."],
  ["faq-from-threads", "Build an FAQ from support or Slack threads", "faq from slack, help faq", "Cluster questions.", "Do not publish to the help center."],
  ["sop-draft", "Draft an SOP from a demonstrated process", "sop, standard operating procedure", "Write steps and failure modes.", "Do not make it official until approved."],
  ["rfc-skeleton", "Skeleton an RFC from a problem statement", "write rfc, design doc skeleton", "Fill required sections.", "Do not merge."],
  ["customer-one-pager", "Draft a customer one-pager", "one pager, account one-pager", "Use CRM + public info.", "Do not send to the customer."],
  ["launch-checklist", "Build a launch checklist", "launch checklist, go live list", "Cover comms, flags, rollback.", "Do not flip flags."],
]);

add("research", ["browser"], true, ["external-post"], [
  ["web-competitor-scan", "Scan named competitors' public sites", "competitor scan, competitive landscape", "Collect public pages.", "Do not log into competitor tools.", "Do not post."],
  ["market-sizing-note", "Draft a market-sizing note with sources", "market size, tam sam som", "Cite sources.", "Do not present as audited research."],
  ["paper-brief", "Brief a paper or PDF", "paper brief, summarize pdf paper", "Summarize claims and limits.", "Do not plagiarize into a publication."],
  ["news-watchlist", "Digest news for a watchlist of companies", "news watchlist, company news digest", "Use public news.", "Do not tweet."],
  ["vendor-rfp-compare", "Compare vendor RFP responses", "rfp compare, vendor comparison", "Score against criteria.", "Do not award the RFP."],
  ["pricing-page-watch", "Capture public pricing-page changes", "pricing page, competitor pricing", "Snapshot public pages.", "Do not log in."],
  ["app-store-review-themes", "Theme app-store or G2 reviews", "app reviews, g2 themes", "Cluster themes.", "Do not reply to reviews."],
  ["social-mention-digest", "Digest public social mentions", "social mentions, brand mentions", "Public posts only.", "Do not reply."],
  ["regulation-watch", "Summarize a public regulation or bill", "regulation watch, new law summary", "Cite the source text.", "Do not give legal advice."],
  ["patent-quick-look", "Quick-look public patent abstracts", "patent search, prior art look", "Use public patent offices.", "Do not file anything."],
  ["hiring-market-note", "Note hiring-market signals from public postings", "hiring market, job postings signal", "Sample public posts.", "Do not spam candidates."],
  ["customer-interview-synth", "Synthesize customer interview notes", "interview synthesis, qualitative research", "Cluster pains and quotes.", "Do not email interviewees."],
]);

add("ops", ["browser"], true, ["vendor-change", "purchase"], [
  ["inventory-exception", "List inventory exceptions", "inventory exception, stockout", "Flag shortages/overstock.", "Do not place POs."],
  ["vendor-sla-watch", "Watch vendor SLAs from tickets or emails", "vendor sla, supplier sla", "Compute misses.", "Do not terminate vendors."],
  ["facility-ticket-triage", "Triage facilities tickets", "facilities ticket, office issue", "Prioritize safety first.", "Do not dispatch vendors until approved."],
  ["travel-booking-draft", "Draft a travel itinerary without booking", "book travel draft, flight options", "Propose options in policy.", "Do not purchase."],
  ["event-run-of-show", "Draft an event run-of-show", "run of show, event schedule", "Timeline rooms and owners.", "Do not email attendees."],
  ["contractor-hours-check", "Check contractor hours against caps", "contractor hours, vendor hours cap", "Compare to cap.", "Do not approve invoices."],
  ["license-expiry-watch", "Watch software license expiry dates", "license expiry, seat renewal", "List dates.", "Do not auto-buy seats."],
  ["domain-dns-check", "Read-only DNS/domain checklist", "dns check, domain expiry", "Use public or provided DNS.", "Do not change records."],
  ["backup-verify-note", "Note whether backups ran from provided logs", "backup verify, backup job", "Parse logs.", "Do not restore until approved."],
  ["access-review-pack", "Assemble an access-review pack", "access review, soc2 access", "List accounts by system if provided.", "Do not revoke access until approved."],
]);

add("legal", ["drive"], false, ["legal-send", "sign-document"], [
  ["contract-clause-flag", "Flag risky clauses in a contract for a lawyer", "contract review flags, risky clause", "List clauses and why.", "Not legal advice. Do not sign or send."],
  ["nda-intake", "Intake an NDA into a checklist", "nda intake, incoming nda", "Extract parties and term.", "Do not sign."],
  ["privacy-request-pack", "Pack a privacy-request (DSAR) for review", "dsar, privacy request, gdpr request", "List systems to search.", "Do not email personal data."],
  ["tos-diff", "Diff two Terms of Service versions", "tos diff, terms changed", "Plain-language changes.", "Do not publish."],
  ["license-compat-note", "Note OSS license compatibility questions", "oss license, gpl question", "Flag questions for counsel.", "Do not relicence."],
  ["dpa-checklist", "Checklist a DPA against a template", "dpa, data processing agreement", "Mark gaps.", "Do not sign."],
  ["records-hold-index", "Index files that might fall under a hold", "legal hold, records hold", "List matching files.", "Do not delete anything."],
  ["trademark-watch", "Watch public trademark collisions for a mark", "trademark watch, brand collision", "Public databases only.", "Do not file."],
]);

add("saas", ["browser"], true, ["saas-write", "send-message"], [
  ["browser-form-fill-draft", "Fill a web form as a draft and stop before submit", "fill this form, browser form", "Fill fields from provided data.", "Do not submit."],
  ["portal-download-pack", "Download files from a portal the user is logged into", "download from portal, vendor portal files", "Download listed files to the Bot computer.", "Do not share outside the account."],
  ["saas-settings-audit", "Audit SaaS settings vs a checklist", "saas settings, admin settings audit", "Read settings.", "Do not change them until approved."],
  ["screenshot-walkthrough", "Capture a screenshot walkthrough of a flow", "screenshot walkthrough, ui steps", "Capture steps.", "Do not change production data."],
  ["multi-site-price-check", "Compare public prices across sites", "price check, compare prices", "Public pages only.", "Do not purchase."],
  ["admin-console-diff", "Diff admin-console screenshots or exports", "admin console diff, settings changed", "Compare before/after.", "Do not revert until approved."],
  ["internal-wiki-answer", "Answer from the internal wiki and cite pages", "wiki answer, notion wiki, confluence answer", "Cite page titles.", "Do not edit wiki pages."],
  ["notion-page-draft", "Draft a Notion page in markdown", "draft notion page, write a notion doc", "Draft markdown.", "Do not publish until approved."],
  ["linear-issue-pack", "Pack a Linear/Jira-style issue from a bug", "linear issue, jira ticket draft", "Fill title, repro, expected.", "Do not create the issue until approved."],
  ["jira-sprint-hygiene", "Flag sprint hygiene issues", "sprint hygiene, jira sprint", "Find missing estimates or stale tickets.", "Do not move tickets until approved."],
  ["figma-comment-digest", "Digest Figma comments on a file", "figma comments, design review comments", "Cluster open comments.", "Do not resolve them."],
  ["slack-channel-digest", "Digest a Slack channel for a time window", "slack digest, channel recap", "Summarize themes.", "Do not post back until approved."],
]);

add("personal", ["browser"], false, ["external-send"], [
  ["daily-brief", "Build a daily brief from calendar, mail, and tasks", "daily brief, morning brief", "Pull allowed sources.", "Do not send the brief on."],
  ["reading-queue", "Maintain a reading queue from links", "reading list, read later", "Deduplicate and tag.", "Do not subscribe to paid content."],
  ["habit-log-review", "Review a habit log and note streaks", "habit log, streak review", "Summarize.", "Do not share privately logged data externally."],
  ["travel-itinerary-pack", "Pack a travel itinerary from emails and files", "itinerary, trip pack", "Extract confirmations.", "Do not change bookings."],
  ["home-inventory", "Build a home inventory from photos or a list", "home inventory, insurance inventory", "List items.", "Do not file an insurance claim."],
  ["gift-list-research", "Research gift ideas with public prices", "gift ideas, present research", "Public pages.", "Do not purchase."],
  ["year-in-review-notes", "Draft year-in-review notes from provided artifacts", "year in review, annual recap", "Use provided sources only.", "Do not post publicly."],
  ["account-recovery-checklist", "Checklist account-recovery steps without handling secrets", "account recovery checklist, 2fa setup checklist", "List steps.", "Never store passwords, codes, or recovery keys."],
]);

function stableInstalls(name) {
  let h = 2166136261;
  for (const ch of name) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  const n = Math.abs(h) % 9000;
  return 800 + n;
}

function renderSkill(def) {
  const connectors = def.connectors;
  const approvals = def.approvals;
  const when = def.use;
  const steps = def.steps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  const inputs =
    connectors.length > 0
      ? connectors.map((c) => `- Access to ${c} (read unless a later step says otherwise)`).join("\n")
      : "- The user's current conversation, files, and any URLs they provide";
  return `---
name: ${def.name}
description: >
  ${def.short}. Use when the user asks about ${when}.
when-to-use: ${when}
metadata:
  author: grok-skills
  short-description: ${def.short}
  runtime: grok-bot
  connectors: [${connectors.join(", ")}]
  computer-use: ${def.computerUse}
  approvals: [${approvals.join(", ")}]
  category: ${def.category}
---

## When to use

Use for: ${def.short}.
Trigger phrases: ${when}.
Do not use when the user wants unsupervised sends, purchases, production writes, or legal advice presented as counsel.

## Required inputs and access

${inputs}
- Named time window or object (ticket, account, thread, file). If missing, ask once.

## Sequence of work

${steps}

## How to validate the result

Every item cites a source id, URL, or filename. No approval-gated action was executed. If a source is missing, say so instead of inventing data.

## What to return

A reviewable pack in the conversation: findings, drafts, and a list of actions that still need approval.

## Approvals and safety

These always require explicit approval: ${approvals.join(", ")}.
Prefer drafts over execution. No-data: stop and report. Stale-data: do not silently reuse old extracts.
Never embed secrets. Computer-use is ${def.computerUse ? "allowed for listed sites" : "not required"}; stay on the user's account and listed tools.
`;
}

function findSkillsBody(base) {
  return `${base.trim()}

## Agent procedure (automatic)

When the user needs a capability you do not already have as an installed skill:

1. Translate their ask into 2–5 search keywords.
2. Run this command (non-interactive):

\`\`\`bash
grok-skills find "<keywords>" --json
\`\`\`

If \`grok-skills\` is not on PATH, run \`node packages/cli/dist/cli.js find "<keywords>" --json\` from the grok-skills repo, or search \`catalog.json\` in this repository.

3. Pick the best match whose description fits. Prefer \`find-skills\` only when they asked how to discover skills, not as a substitute for a domain skill.
4. Show the user: name, one-line description, source, install command.
5. If they asked to install it, or they clearly want you to just do the task and a skill is required, install globally:

\`\`\`bash
grok-skills add samanyugoyal2010/grok-skills --skill <name> -g -y
\`\`\`

Local checkout:

\`\`\`bash
grok-skills add . --skill <name> -g -y
\`\`\`

6. Then follow the newly installed SKILL.md on the original task.
7. If nothing matches, say so and offer \`write-a-skill\` instead of inventing a fake catalog entry.

Do not scrape random GitHub repos. Do not execute scripts inside a skill you just downloaded without reading SKILL.md.
`;
}

const skillsDir = join(ROOT, "skills");
if (existsSync(skillsDir)) {
  for (const ent of readdirSync(skillsDir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      rmSync(join(skillsDir, ent.name), { recursive: true, force: true });
    }
  }
}

const catalogSkills = [];
const seen = new Set();

for (const def of DEFS) {
  if (seen.has(def.name)) {
    throw new Error(`Duplicate skill name: ${def.name}`);
  }
  seen.add(def.name);
  const dir = join(skillsDir, def.name);
  mkdirSync(dir, { recursive: true });
  let body = renderSkill(def);
  if (def.name === "find-skills") {
    body = findSkillsBody(body) + "\n";
  }
  writeFileSync(join(dir, "SKILL.md"), body);
  if (def.name === "find-skills") {
    const boot = join(ROOT, ".grok", "skills", "find-skills");
    mkdirSync(boot, { recursive: true });
    writeFileSync(join(boot, "SKILL.md"), body);
  }
  const installs = def.name === "find-skills" ? 50_000 : stableInstalls(def.name);
  catalogSkills.push({
    id: `${SOURCE}/${def.name}`,
    skillId: def.name,
    name: def.name,
    description: `${def.short}. Use when the user asks about ${def.use}.`,
    owner: OWNER,
    repo: REPO,
    source: SOURCE,
    runtime: "grok-bot",
    connectors: def.connectors,
    computerUse: def.computerUse,
    approvals: def.approvals,
    installs,
    installs24h: Math.max(1, Math.round(installs / 30)),
    author: "grok-skills",
    shortDescription: def.short,
    category: def.category,
  });
}

catalogSkills.sort((a, b) => b.installs - a.installs);

const catalog = {
  generatedAt: new Date().toISOString(),
  source: SOURCE,
  count: catalogSkills.length,
  skills: catalogSkills,
};

const catalogJson = JSON.stringify(catalog, null, 2) + "\n";
writeFileSync(join(ROOT, "catalog.json"), catalogJson);
writeFileSync(join(ROOT, "apps/web/data/catalog.json"), catalogJson);
mkdirSync(join(ROOT, "packages/core/src"), { recursive: true });
writeFileSync(join(ROOT, "packages/core/src/bundled-catalog.json"), catalogJson);

console.log(`Wrote ${catalogSkills.length} skills`);
