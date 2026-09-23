# SkillChef in a real coding workflow

SkillChef is an MCP tool that a coding agent can call. It does not replace the agent, provide the agent's chat subscription, or need a separate SkillChef login. The coding agent continues to use whichever model and account the developer already configured. SkillChef uses a separate provider API key only when it needs to synthesize the reusable skill.

## One complete run

```text
Developer describes a workflow they repeat
  → coding agent identifies useful repository files and asks approval
  → agent calls SkillChef's compile_skill MCP tool with approved text only
  → SkillChef retrieves public SKILL.md references
  → selected model provider compiles an installable, reviewable skill
  → coding agent presents the skill, then saves it only with the developer's approval
  → the coding platform discovers that skill in later sessions
```

SkillChef itself never reads the working tree, writes files, or executes generated instructions. The host coding agent is responsible for showing context for approval and, if asked, saving the returned `SKILL.md` in that platform's skill directory. The skill's frontmatter `name` must match its directory name.

## Which key is this?

There are two separate model connections:

1. The coding agent's model connection powers the user's normal coding conversation. Keep using that platform's existing login or provider configuration.
2. SkillChef's model connection is used for the one-time skill-compilation call. The developer chooses OpenAI, Anthropic, OpenRouter, or Groq and pays that provider directly with their API key.

An OpenAI API key is not the same as a ChatGPT subscription, and a Claude Code login is not an Anthropic API key. You do not need to change the coding agent's model to use SkillChef.

## Local development and individual use

The local MCP server is the simplest BYOK deployment. The developer puts one provider key in the environment of the machine that runs SkillChef, selects that provider and model, then configures their coding agent to launch the local server. Use the variable names and setup for the provider in [`.env.example`](.env.example) and [`examples/integrations`](examples/integrations).

Keep keys in a local secret store, shell environment, or an untracked environment file with restrictive file permissions. Never paste a key into `compile_skill`, a prompt, a generated `SKILL.md`, a committed MCP config, or a client-side website. The key belongs to the SkillChef server process. The server should send it only in the provider's authentication header and must not return it in tool results or log it.

With no model key configured, the server uses its deterministic local compiler. With a provider configured, the approved task, brief, and file contents are sent to that provider for synthesis. Check the provider's current data-retention and training terms before sending private repository context. API usage is billed to the configured provider account.

## Shared hosted service: production boundary

The current MCP HTTP bearer token is a server access token, not per-user identity. It does not safely isolate individual users' provider keys. For that reason, a shared multi-user SkillChef deployment must not ask users to send API keys as normal tool arguments and must not run every user's requests against one operator-owned API key by default.

A hosted BYOK release needs a separate account-and-credential feature before it can safely serve multiple people:

- Authenticate each user or organization and authorize every compile request against that identity.
- Collect provider credentials in a secured settings flow—not in chat or MCP tool arguments.
- Encrypt keys with a managed KMS-backed envelope-encryption design; decrypt only in the short-lived request worker that calls the selected provider.
- Keep plaintext out of logs, traces, analytics, error messages, database queries, and model prompts. Do not retain it in request history or MCP responses.
- Let users test, rotate, and revoke keys; delete encrypted material on disconnect and account removal.
- Apply per-user quotas, cost limits, concurrency limits, and audit metadata that never includes secret values or repository contents.
- Document which repository context is transmitted to which model provider and obtain user approval before each submission.

Until those controls exist, run SkillChef locally with the user's own key, or operate a private single-tenant deployment whose administrator controls the provider key. Do not advertise a public shared server as BYOK merely because it accepts a bearer token.

## Coding-agent workflow

1. Install the MCP server using the appropriate recipe in [`examples/integrations`](examples/integrations/README.md). MCP setup makes `compile_skill` available; it does not install the skill itself.
2. Ask the agent to prepare a skill for a workflow that will be repeated, not just the current one-off task.
3. Before a call, the agent should propose the exact repository paths, explain why each is needed, and wait for approval. SkillChef accepts only the content explicitly sent by the client.
4. SkillChef retrieves relevant public skill references and compiles the artifact. The selected provider sees the approved request context when model synthesis is enabled.
5. Review the skill, provenance, and risk notes. Save it to the chosen agent's supported skills folder; do not auto-install unreviewed third-party instructions.
6. Start a fresh session or reload skills if that client requires it, then invoke the workflow by describing a matching task.

Platform-specific skill folders and MCP configuration are listed in the integration guide. Client behavior changes over time, so confirm paths and secret/environment interpolation against each client's current documentation before rolling out a team setup.
