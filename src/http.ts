import type { IncomingMessage, ServerResponse } from "node:http";

export interface HttpSecurityOptions {
  bearerToken?: string;
  allowedOrigins?: string[];
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

  return (request, response) => {
    const requestPath = (request.url ?? "/").split("?", 1)[0];
    if (requestPath !== path) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const origin = request.headers.origin;
    if (origin && allowedOrigins.size > 0 && !allowedOrigins.has(origin)) {
      response.writeHead(403, { "content-type": "text/plain; charset=utf-8" });
      response.end("Origin not allowed");
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

    handler(request, response);
  };
}
