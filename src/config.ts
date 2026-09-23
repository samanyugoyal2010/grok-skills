import { isLoopbackHost } from "./http.js";
import { DEFAULT_RATE_LIMIT_MAX_KEYS } from "./rate-limit.js";

export const DEFAULT_HTTP_PORT = 3_000;
export const DEFAULT_HTTP_HOST = "127.0.0.1";
export const DEFAULT_HTTP_MAX_BODY_BYTES = 256_000;
export const DEFAULT_COMPILE_DEADLINE_MS = 60_000;
export const DEFAULT_MAX_IN_FLIGHT_COMPILATIONS = 2;

export const MODEL_PROVIDERS = ["openai", "anthropic", "openrouter", "groq"] as const;
export type ModelProvider = typeof MODEL_PROVIDERS[number];

const PROVIDER_KEYS: Record<ModelProvider, string> = {
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  openrouter: "OPENROUTER_API_KEY",
  groq: "GROQ_API_KEY"
};

const DEFAULT_MODELS: Record<ModelProvider, string> = {
  openai: "gpt-4.1-mini",
  anthropic: "claude-sonnet-5",
  openrouter: "openai/gpt-4.1-mini",
  groq: "openai/gpt-oss-20b"
};

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
  modelProvider?: ModelProvider;
  modelApiKey?: string;
  model?: string;
  modelTimeoutMs: number;
  compileDeadlineMs: number;
  maxInFlightCompilations: number;
  rateLimitMaxKeys: number;
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

export function loadModelConfig(env: NodeJS.ProcessEnv = process.env): Pick<RuntimeConfig, "modelUrl" | "modelToken" | "modelProvider" | "modelApiKey" | "model"> {
  const modelUrl = parseModelUrl(env.SKILL_COMPILER_MODEL_URL, env.SKILL_COMPILER_ALLOW_INSECURE_HTTP === "true");
  const modelToken = env.SKILL_COMPILER_MODEL_TOKEN || undefined;
  const configuredKeys = MODEL_PROVIDERS.flatMap((provider) => {
    const key = env[PROVIDER_KEYS[provider]];
    return key?.trim() ? [{ provider, key }] : [];
  });
  const requestedProvider = env.SKILL_COMPILER_PROVIDER?.trim().toLowerCase();

  if (requestedProvider && !(MODEL_PROVIDERS as readonly string[]).includes(requestedProvider)) {
    throw new Error("SKILL_COMPILER_PROVIDER must be openai, anthropic, openrouter, or groq");
  }
  if (modelUrl && requestedProvider) throw new Error("SKILL_COMPILER_MODEL_URL cannot be combined with SKILL_COMPILER_PROVIDER");
  if (modelUrl && configuredKeys.length > 0) throw new Error("Provider API keys cannot be combined with SKILL_COMPILER_MODEL_URL");
  if (modelToken && !modelUrl) throw new Error("SKILL_COMPILER_MODEL_TOKEN requires SKILL_COMPILER_MODEL_URL");

  if (modelUrl) return { modelUrl, ...(modelToken ? { modelToken } : {}) };

  let provider: ModelProvider | undefined;
  if (requestedProvider) {
    provider = requestedProvider as ModelProvider;
    if (!env[PROVIDER_KEYS[provider]]?.trim()) {
      throw new Error(`${PROVIDER_KEYS[provider]} must be set when SKILL_COMPILER_PROVIDER selects ${provider}`);
    }
  } else if (configuredKeys.length === 1) {
    provider = configuredKeys[0].provider;
  } else if (configuredKeys.length > 1) {
    throw new Error("Set SKILL_COMPILER_PROVIDER when more than one provider API key is configured");
  }

  if (!provider) return {};
  const apiKey = env[PROVIDER_KEYS[provider]]!;
  return {
    modelProvider: provider,
    modelApiKey: apiKey,
    model: env.SKILL_COMPILER_MODEL?.trim() || DEFAULT_MODELS[provider]
  };
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
  const normalizedAllowedHosts = allowedHosts.map((host) => host.toLowerCase());
  const modelConfig = loadModelConfig(env);
  const publicSkillRepositories = parseList(env.PUBLIC_SKILL_REPOSITORIES === undefined ? "vercel-labs/agent-skills,anthropics/skills" : env.PUBLIC_SKILL_REPOSITORIES);
  const publicSkillBranch = env.PUBLIC_SKILL_BRANCH?.trim() || "main";
  const publicSkillGithubToken = env.PUBLIC_SKILL_GITHUB_TOKEN || undefined;

  if (transport === "http" && !isLoopbackHost(httpHost) && !bearerToken) {
    throw new Error("MCP_HTTP_AUTH_TOKEN is required when MCP_HTTP_HOST is not loopback");
  }
  if (transport === "http" && !isLoopbackHost(httpHost) && normalizedAllowedHosts.length === 0) {
    throw new Error("MCP_HTTP_ALLOWED_HOSTS is required when MCP_HTTP_HOST is not loopback");
  }
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
    allowedHosts: normalizedAllowedHosts.length > 0 || !isLoopbackHost(httpHost) ? normalizedAllowedHosts : ["localhost", "127.0.0.1", "[::1]"],
    ...modelConfig,
    modelTimeoutMs: parsePositiveInteger("SKILL_COMPILER_MODEL_TIMEOUT_MS", env.SKILL_COMPILER_MODEL_TIMEOUT_MS, 20_000),
    compileDeadlineMs: parsePositiveInteger("SKILL_COMPILER_DEADLINE_MS", env.SKILL_COMPILER_DEADLINE_MS, DEFAULT_COMPILE_DEADLINE_MS),
    maxInFlightCompilations: parsePositiveInteger("MAX_IN_FLIGHT_COMPILATIONS", env.MAX_IN_FLIGHT_COMPILATIONS, DEFAULT_MAX_IN_FLIGHT_COMPILATIONS),
    rateLimitMaxKeys: parsePositiveInteger("RATE_LIMIT_MAX_KEYS", env.RATE_LIMIT_MAX_KEYS, DEFAULT_RATE_LIMIT_MAX_KEYS),
    publicSkillRepositories,
    publicSkillBranch,
    publicSkillFetchTimeoutMs: parsePositiveInteger("PUBLIC_SKILL_FETCH_TIMEOUT_MS", env.PUBLIC_SKILL_FETCH_TIMEOUT_MS, 10_000),
    ...(publicSkillGithubToken ? { publicSkillGithubToken } : {}),
    rateLimitPerMinute: parsePositiveInteger("RATE_LIMIT_PER_MINUTE", env.RATE_LIMIT_PER_MINUTE, 10)
  };
}
