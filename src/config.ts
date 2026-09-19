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

  if (transport === "http" && !isLoopbackHost(httpHost) && !bearerToken) {
    throw new Error("MCP_HTTP_AUTH_TOKEN is required when MCP_HTTP_HOST is not loopback");
  }

  return {
    transport,
    port: parsePositiveInteger("PORT", env.PORT, DEFAULT_HTTP_PORT),
    httpHost,
    httpMaxBodyBytes: parsePositiveInteger("MCP_HTTP_MAX_BODY_BYTES", env.MCP_HTTP_MAX_BODY_BYTES, DEFAULT_HTTP_MAX_BODY_BYTES),
    ...(bearerToken ? { bearerToken } : {}),
    allowedOrigins,
    allowedHosts: allowedHosts.length > 0 || !isLoopbackHost(httpHost) ? allowedHosts : ["localhost", "127.0.0.1", "[::1]"]
  };
}
