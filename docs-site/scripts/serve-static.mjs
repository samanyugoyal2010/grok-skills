import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd(), "out");
const port = Number(process.env.PORT ?? 3000);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8"
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? "/", "http://localhost").pathname);
    const candidate = resolve(root, `.${normalize(pathname)}`);
    if (!candidate.startsWith(root)) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    let file = candidate;
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, "index.html");
    const contents = await readFile(file);
    response.writeHead(200, { "content-type": contentTypes[extname(file)] ?? "application/octet-stream" });
    response.end(contents);
  } catch {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" }).end("Not found");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static docs site listening on http://127.0.0.1:${port}`);
});
