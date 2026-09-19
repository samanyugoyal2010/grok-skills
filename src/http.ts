import type { IncomingMessage, ServerResponse } from "node:http";
import { timingSafeEqual } from "node:crypto";
import { PassThrough } from "node:stream";
import { RateLimitError, RateLimiter } from "./rate-limit.js";

export interface HttpSecurityOptions {
  bearerToken?: string;
  allowedOrigins?: string[];
  allowedHosts?: string[];
  maxBodyBytes?: number;
  path?: string;
  healthPath?: string;
  rateLimiter?: RateLimiter;
}

export function isLoopbackHost(host: string): boolean {
  return host === "127.0.0.1" || host === "localhost" || host === "::1";
}

function matchesBearerToken(expected: string, actual: string | undefined): boolean {
  if (!actual) return false;
  const expectedBytes = Buffer.from(expected);
  const actualBytes = Buffer.from(actual);
  return expectedBytes.length === actualBytes.length && timingSafeEqual(expectedBytes, actualBytes);
}

function bufferedRequest(request: IncomingMessage, body: Buffer): IncomingMessage {
  const stream = new PassThrough();
  Object.defineProperties(stream, {
    url: { value: request.url, enumerable: true },
    method: { value: request.method, enumerable: true },
    headers: { value: request.headers, enumerable: true },
    rawHeaders: { value: request.rawHeaders, enumerable: true },
    httpVersion: { value: request.httpVersion, enumerable: true },
    httpVersionMajor: { value: request.httpVersionMajor, enumerable: true },
    httpVersionMinor: { value: request.httpVersionMinor, enumerable: true },
    socket: { value: request.socket, enumerable: true },
    complete: { value: true, enumerable: true }
  });
  queueMicrotask(() => stream.end(body));
  return stream as unknown as IncomingMessage;
}

function readRequestBody(request: IncomingMessage, maxBytes: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    let settled = false;
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      request.removeListener("data", onData);
      request.removeListener("end", onEnd);
      request.removeListener("aborted", onAborted);
      request.removeListener("error", onError);
      if (error) reject(error);
      else resolve(Buffer.concat(chunks, totalBytes));
    };
    const onData = (chunk: Buffer | string) => {
      const value = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        request.resume();
        finish(new Error("Request body too large"));
        return;
      }
      chunks.push(value);
    };
    const onEnd = () => finish();
    const onAborted = () => finish(new Error("Request was aborted"));
    const onError = (error: Error) => finish(error);
    request.on("data", onData);
    request.on("end", onEnd);
    request.on("aborted", onAborted);
    request.on("error", onError);
  });
}

export function createProtectedHttpHandler(
  handler: (request: IncomingMessage, response: ServerResponse) => void,
  options: HttpSecurityOptions = {}
): (request: IncomingMessage, response: ServerResponse) => void {
  const path = options.path ?? "/mcp";
  const healthPath = options.healthPath ?? "/healthz";
  const allowedOrigins = new Set(options.allowedOrigins ?? []);
  const allowedHosts = new Set((options.allowedHosts ?? []).map((host) => host.toLowerCase()));
  const maxBodyBytes = options.maxBodyBytes ?? 256_000;
  const rateLimiter = options.rateLimiter;

  const setHeader = (response: ServerResponse, name: string, value: string) => {
    response.setHeader?.(name, value);
  };

  const reject = (response: ServerResponse, status: number, body: string, headers: Record<string, string> = {}) => {
    response.writeHead(status, { "content-type": "text/plain; charset=utf-8", ...headers });
    response.end(body);
  };

  const hostnameFromHostHeader = (value: string | undefined): string | null => {
    if (!value) return null;
    if (value.startsWith("[")) {
      const closingBracket = value.indexOf("]");
      return closingBracket > 0 ? value.slice(0, closingBracket + 1).toLowerCase() : null;
    }
    return value.split(":", 1)[0]?.toLowerCase() || null;
  };

  return (request, response) => {
    setHeader(response, "cache-control", "no-store");
    setHeader(response, "x-content-type-options", "nosniff");
    setHeader(response, "referrer-policy", "no-referrer");
    const requestPath = (request.url ?? "/").split("?", 1)[0];
    if (requestPath !== path && requestPath !== healthPath) {
      reject(response, 404, "Not found");
      return;
    }

    if (allowedHosts.size > 0 && !allowedHosts.has(hostnameFromHostHeader(request.headers.host) ?? "")) {
      reject(response, 403, "Host not allowed");
      return;
    }

    const origin = request.headers.origin;
    if (origin) {
      try {
        const parsedOrigin = new URL(origin);
        if (!/^https?:$/.test(parsedOrigin.protocol) || parsedOrigin.origin !== origin || !allowedOrigins.has(origin)) {
          reject(response, 403, "Origin not allowed");
          return;
        }
      } catch {
        reject(response, 403, "Origin not allowed");
        return;
      }
    }

    const contentLength = request.headers["content-length"];
    if (contentLength !== undefined) {
      if (!/^\d+$/.test(contentLength) || Number(contentLength) > maxBodyBytes) {
        reject(response, Number(contentLength) > maxBodyBytes ? 413 : 400, Number(contentLength) > maxBodyBytes ? "Request body too large" : "Invalid content length");
        return;
      }
    }

    if (origin) {
      setHeader(response, "access-control-allow-origin", origin);
      setHeader(response, "access-control-allow-credentials", "true");
      setHeader(response, "access-control-expose-headers", "MCP-Session-Id, MCP-Protocol-Version");
      setHeader(response, "vary", "Origin");
    }

    if (requestPath === healthPath) {
      if (request.method?.toUpperCase() !== "GET" && request.method?.toUpperCase() !== "HEAD") {
        reject(response, 405, "Method not allowed", { allow: "GET, HEAD" });
        return;
      }
      const body = JSON.stringify({ status: "ok" });
      setHeader(response, "cache-control", "no-store");
      setHeader(response, "content-type", "application/json; charset=utf-8");
      setHeader(response, "content-length", String(Buffer.byteLength(body)));
      response.writeHead(200);
      response.end(request.method?.toUpperCase() === "HEAD" ? undefined : body);
      return;
    }

    if (request.method?.toUpperCase() === "OPTIONS") {
      if (origin) setHeader(response, "access-control-allow-origin", origin);
      setHeader(response, "access-control-allow-methods", "POST, GET, DELETE, OPTIONS");
      setHeader(response, "access-control-allow-headers", "Authorization, Content-Type, MCP-Protocol-Version, Mcp-Method, Mcp-Name, Last-Event-ID");
      setHeader(response, "access-control-max-age", "600");
      response.writeHead(204);
      response.end();
      return;
    }

    const suppliedToken = request.headers.authorization?.startsWith("Bearer ") ? request.headers.authorization.slice(7) : undefined;
    if (options.bearerToken && !matchesBearerToken(options.bearerToken, suppliedToken)) {
      response.writeHead(401, {
        "content-type": "text/plain; charset=utf-8",
        "www-authenticate": "Bearer"
      });
      response.end("Unauthorized");
      return;
    }

    if (rateLimiter) {
      try {
        rateLimiter.consume(request.socket?.remoteAddress ?? "anonymous");
      } catch (error) {
        if (error instanceof RateLimitError) {
          reject(response, 429, "Too many requests", { "retry-after": String(error.retryAfterSeconds) });
          return;
        }
        throw error;
      }
    }

    if (maxBodyBytes > 0 && request.method?.toUpperCase() === "POST") {
      void readRequestBody(request, maxBodyBytes)
        .then((body) => handler(bufferedRequest(request, body), response))
        .catch((error: unknown) => {
          if (!response.writableEnded) reject(response, error instanceof Error && error.message === "Request was aborted" ? 400 : 413, error instanceof Error ? error.message : "Request body too large");
        });
      return;
    }

    handler(request, response);
  };
}
