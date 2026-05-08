import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const root = resolve(here, "../..");
const startPort = Number.parseInt(process.env.PORT || "4173", 10);
const host = process.env.HOST || "127.0.0.1";

const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
};

function resolveRequest(url) {
  const parsed = new URL(url, `http://${host}`);
  const pathname = decodeURIComponent(parsed.pathname);
  const relative = pathname === "/" ? "webapp/index.html" : pathname.slice(1);
  const target = normalize(join(root, relative));

  if (!target.startsWith(root)) return null;

  try {
    const info = statSync(target);
    if (info.isDirectory()) return join(target, "index.html");
    return target;
  } catch {
    return null;
  }
}

function makeServer() {
  return createServer((request, response) => {
    const target = resolveRequest(request.url || "/");

    if (!target) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const type = types[extname(target)] || "application/octet-stream";
    response.writeHead(200, { "content-type": type });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(target).pipe(response);
  });
}

function listen(port) {
  const server = makeServer();

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      listen(port + 1);
      return;
    }
    throw error;
  });

  server.listen(port, host, () => {
    console.log(`AI Agent Pattern Landscape webapp`);
    console.log(`Local: http://${host}:${port}/webapp/`);
  });
}

listen(startPort);
