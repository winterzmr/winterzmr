const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000;

const mimeTypes = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  const filePath = req.url === "/" ? "./index.html" : `.${req.url}`;
  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      const status = err.code === "ENOENT" ? 404 : 500;
      const errorFile = status === 404 ? "./404.html" : null;
      return fs.readFile(errorFile, (_, errorContent) => {
        res.writeHead(status, { "Content-Type": "text/html" });
        res.end(errorContent || "Server Error", "utf-8");
      });
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content, "utf-8");
  });
});

server.listen(port, () => console.log(`Server running at http://localhost:${port}`));
