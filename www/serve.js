// Zero-dependency static file server for local development and Playwright's
// webServer. This marketing site is static HTML/CSS/JS without a framework.
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = process.env.PORT ? Number(process.env.PORT) : 4321;

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".webmanifest": "application/manifest+json",
};

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || "/").split("?")[0]);
  const relativePath =
    requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const filePath = path.join(ROOT, relativePath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (path.extname(filePath) === ".php") {
    res.writeHead(501, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        error:
          "serve.js does not execute PHP — use a PHP-enabled server (for example: `php -S localhost:4321`) to test the contact form locally.",
      }),
    );
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": CONTENT_TYPES[ext] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Cosign marketing site serving http://localhost:${PORT}`);
});
