import type { IncomingMessage, ServerResponse } from "node:http";

export interface HttpSecurityOptions {
  bearerToken?: string;
  allowedOrigins?: string[];
  allowedHosts?: string[];
  maxBodyBytes?: number;
  path?: string;
}

export function isLoopbackHost(host: string): boolean {
  return host === "127.0.0.1" || host === "localhost" || host === "::1";
}

export function createProtectedHttpHandler(
  handler: (request: IncomingMessage, response: ServerResponse) => void,
  options: HttpSecurityOptions = {}
): (request: IncomingMessage, response: ServerResponse) => void {
  const path = options.path ?? "/mcp";
  const allowedOrigins = new Set(options.allowedOrigins ?? []);
  const allowedHosts = new Set((options.allowedHosts ?? []).map((host) => host.toLowerCase()));
  const maxBodyBytes = options.maxBodyBytes ?? 256_000;

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
    const requestPath = (request.url ?? "/").split("?", 1)[0];
    if (requestPath !== path) {
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
        if (!/^https?:$/.test(parsedOrigin.protocol) || parsedOrigin.origin !== origin || (allowedOrigins.size > 0 && !allowedOrigins.has(origin))) {
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

    if (request.method?.toUpperCase() === "OPTIONS") {
      if (origin) setHeader(response, "access-control-allow-origin", origin);
      setHeader(response, "access-control-allow-methods", "POST, GET, DELETE, OPTIONS");
      setHeader(response, "access-control-allow-headers", "Authorization, Content-Type, MCP-Protocol-Version, Mcp-Method, Mcp-Name, Last-Event-ID");
      setHeader(response, "access-control-max-age", "600");
      response.writeHead(204);
      response.end();
      return;
    }

    if (options.bearerToken && request.headers.authorization !== `Bearer ${options.bearerToken}`) {
      response.writeHead(401, {
        "content-type": "text/plain; charset=utf-8",
        "www-authenticate": "Bearer"
      });
      response.end("Unauthorized");
      return;
    }

    if (maxBodyBytes > 0 && typeof request.on === "function" && typeof request.destroy === "function") {
      let receivedBytes = 0;
      request.on("data", (chunk: Buffer | string) => {
        receivedBytes += typeof chunk === "string" ? Buffer.byteLength(chunk) : chunk.byteLength;
        if (receivedBytes > maxBodyBytes && !response.writableEnded) {
          reject(response, 413, "Request body too large");
          request.destroy();
        }
      });
    }

    handler(request, response);
  };
}
