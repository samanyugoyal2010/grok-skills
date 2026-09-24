import { createServer } from "node:http";
import { pathToFileURL } from "node:url";
import { readFile, realpath, stat } from "node:fs/promises";
import { extname, isAbsolute, join, normalize, relative, resolve, sep } from "node:path";

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

export function resolveContainedPath(root, pathname) {
  const rawPathname = pathname.replaceAll("\\", "/");
  if (rawPathname.split("/").includes("..")) return null;
  const normalizedPathname = normalize(rawPathname);
  const candidate = resolve(root, `.${normalizedPathname}`);
  const relativePath = relative(root, candidate);
  if (relativePath === ".." || relativePath.startsWith(`..${sep}`) || isAbsolute(relativePath)) return null;
  return candidate;
}

function isContainedPath(root, candidate) {
  const relativePath = relative(root, candidate);
  return relativePath === "" || (!relativePath.startsWith("..") && !isAbsolute(relativePath));
}

function responseHeaders(file) {
  const immutable = file.includes(`${sep}_next${sep}static${sep}`);
  return {
    "content-type": contentTypes[extname(file)] ?? "application/octet-stream",
    "cache-control": immutable ? "public, max-age=31536000, immutable" : "public, max-age=0, must-revalidate",
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin"
  };
}

export function createStaticServer(rootDirectory = resolve(process.cwd(), "out")) {
  const root = resolve(rootDirectory);
  const realRootPromise = realpath(root);
  return createServer(async (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { allow: "GET, HEAD", "content-type": "text/plain; charset=utf-8" }).end("Method not allowed");
      return;
    }

    try {
      const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
      const candidate = resolveContainedPath(root, pathname);
      if (!candidate) {
        response.writeHead(403, { "content-type": "text/plain; charset=utf-8" }).end("Forbidden");
        return;
      }

      let file = candidate;
      let fileStats = await stat(file).catch(() => null);
      if (!fileStats) {
        response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
        return;
      }
      if (fileStats.isDirectory()) {
        file = join(file, "index.html");
        fileStats = await stat(file).catch(() => null);
        if (!fileStats) {
          response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
          return;
        }
      }

      const [realRoot, realFile] = await Promise.all([realRootPromise, realpath(file)]);
      if (!isContainedPath(realRoot, realFile)) {
        response.writeHead(403, { "content-type": "text/plain; charset=utf-8" }).end("Forbidden");
        return;
      }

      file = realFile;
      fileStats = await stat(file);
      const headers = { ...responseHeaders(file), "content-length": String(fileStats.size) };
      response.writeHead(200, headers);
      if (request.method === "HEAD") {
        response.end();
        return;
      }
      response.end(await readFile(file));
    } catch {
      if (!response.writableEnded) response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
    }
  });
}

const entrypoint = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === entrypoint) {
  const root = resolve(process.cwd(), "out");
  const port = Number(process.env.PORT ?? 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65_535) throw new Error("PORT must be an integer from 1 to 65535");
  const server = createStaticServer(root);
  server.on("error", (error) => {
    console.error(`Static docs server error: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`Static docs site listening on http://127.0.0.1:${port}`);
  });
  const shutdown = () => server.close(() => process.exit(0));
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
}
