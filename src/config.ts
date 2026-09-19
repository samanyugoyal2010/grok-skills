import { isLoopbackHost } from "./http.js";

export const DEFAULT_HTTP_PORT = 3_000;
export const DEFAULT_HTTP_HOST = "127.0.0.1";
export const DEFAULT_HTTP_MAX_BODY_BYTES = 256_000;

export interface RuntimeConfig {
  transport: "stdio" | "http";
  port: number;
  httpHost: string;
  httpMaxBodyBytes: number;
  bearerToken?: string;
  allowedOrigins: string[];
  allowedHosts: string[];
  modelUrl?: string;
  modelToken?: string;
  modelTimeoutMs: number;
  publicSkillRepositories: string[];
  publicSkillBranch: string;
  publicSkillFetchTimeoutMs: number;
  publicSkillGithubToken?: string;
  rateLimitPerMinute: number;
}

function parsePositiveInteger(name: string, value: string | undefined, fallback: number): number {
  if (value === undefined || value.trim() === "") return fallback;
  if (!/^\d+$/.test(value)) throw new Error(`${name} must be a positive integer`);
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) throw new Error(`${name} must be a positive integer`);
  return parsed;
}

function parseList(value: string | undefined): string[] {
  return (value ?? "").split(",").map((item) => item.trim()).filter(Boolean);
}

function isLoopbackHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "::1";
}

function parseModelUrl(value: string | undefined, allowInsecureHttp: boolean): string | undefined {
  if (!value?.trim()) return undefined;
  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error("SKILL_COMPILER_MODEL_URL must be a valid HTTP or HTTPS URL");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error("SKILL_COMPILER_MODEL_URL must be a valid HTTP or HTTPS URL");
  if (parsed.username || parsed.password) throw new Error("SKILL_COMPILER_MODEL_URL must not contain embedded credentials");
  if (parsed.protocol === "http:" && !isLoopbackHostname(parsed.hostname) && !allowInsecureHttp) {
    throw new Error("SKILL_COMPILER_MODEL_URL must use HTTPS outside loopback development");
  }
  return parsed.toString();
}

function validateOrigins(origins: string[]): void {
  for (const origin of origins) {
    try {
      const parsed = new URL(origin);
      if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") || parsed.origin !== origin) throw new Error();
    } catch {
      throw new Error(`MCP_HTTP_ALLOWED_ORIGINS contains an invalid origin: ${origin}`);
    }
  }
}

function validateRepositories(repositories: string[]): void {
  for (const repository of repositories) {
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw new Error(`PUBLIC_SKILL_REPOSITORIES contains an invalid repository: ${repository}`);
  }
}

export function loadRuntimeConfig(env: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const transport = env.MCP_TRANSPORT === undefined || env.MCP_TRANSPORT === "stdio"
    ? "stdio"
    : env.MCP_TRANSPORT === "http"
      ? "http"
      : (() => { throw new Error("MCP_TRANSPORT must be either stdio or http"); })();
  const httpHost = env.MCP_HTTP_HOST?.trim() || DEFAULT_HTTP_HOST;
  const bearerToken = env.MCP_HTTP_AUTH_TOKEN || undefined;
  const allowedOrigins = parseList(env.MCP_HTTP_ALLOWED_ORIGINS);
  const allowedHosts = parseList(env.MCP_HTTP_ALLOWED_HOSTS);
  const allowInsecureModelHttp = env.SKILL_COMPILER_ALLOW_INSECURE_HTTP === "true";
  const modelUrl = parseModelUrl(env.SKILL_COMPILER_MODEL_URL, allowInsecureModelHttp);
  const modelToken = env.SKILL_COMPILER_MODEL_TOKEN || undefined;
  const publicSkillRepositories = parseList(env.PUBLIC_SKILL_REPOSITORIES === undefined ? "vercel-labs/agent-skills,anthropics/skills" : env.PUBLIC_SKILL_REPOSITORIES);
  const publicSkillBranch = env.PUBLIC_SKILL_BRANCH?.trim() || "main";
  const publicSkillGithubToken = env.PUBLIC_SKILL_GITHUB_TOKEN || undefined;

  if (transport === "http" && !isLoopbackHost(httpHost) && !bearerToken) {
    throw new Error("MCP_HTTP_AUTH_TOKEN is required when MCP_HTTP_HOST is not loopback");
  }
  if (transport === "http" && !isLoopbackHost(httpHost) && allowedHosts.length === 0) {
    throw new Error("MCP_HTTP_ALLOWED_HOSTS is required when MCP_HTTP_HOST is not loopback");
  }
  if (modelToken && !modelUrl) throw new Error("SKILL_COMPILER_MODEL_TOKEN requires SKILL_COMPILER_MODEL_URL");
  validateOrigins(allowedOrigins);
  validateRepositories(publicSkillRepositories);
  if (!/^[A-Za-z0-9._/-]+$/.test(publicSkillBranch) || publicSkillBranch.includes("..")) throw new Error("PUBLIC_SKILL_BRANCH contains invalid characters");

  return {
    transport,
    port: parsePositiveInteger("PORT", env.PORT, DEFAULT_HTTP_PORT),
    httpHost,
    httpMaxBodyBytes: parsePositiveInteger("MCP_HTTP_MAX_BODY_BYTES", env.MCP_HTTP_MAX_BODY_BYTES, DEFAULT_HTTP_MAX_BODY_BYTES),
    ...(bearerToken ? { bearerToken } : {}),
    allowedOrigins,
    allowedHosts: allowedHosts.length > 0 || !isLoopbackHost(httpHost) ? allowedHosts : ["localhost", "127.0.0.1", "[::1]"],
    ...(modelUrl ? { modelUrl } : {}),
    ...(modelToken ? { modelToken } : {}),
    modelTimeoutMs: parsePositiveInteger("SKILL_COMPILER_MODEL_TIMEOUT_MS", env.SKILL_COMPILER_MODEL_TIMEOUT_MS, 20_000),
    publicSkillRepositories,
    publicSkillBranch,
    publicSkillFetchTimeoutMs: parsePositiveInteger("PUBLIC_SKILL_FETCH_TIMEOUT_MS", env.PUBLIC_SKILL_FETCH_TIMEOUT_MS, 10_000),
    ...(publicSkillGithubToken ? { publicSkillGithubToken } : {}),
    rateLimitPerMinute: parsePositiveInteger("RATE_LIMIT_PER_MINUTE", env.RATE_LIMIT_PER_MINUTE, 10)
  };
}
