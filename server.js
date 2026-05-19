const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const host = '127.0.0.1';
const port = Number(process.env.PORT || 3000);
const rootDir = __dirname;

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};

function resolveFilePath(urlPath) {
  const requestPath = urlPath === '/' ? '/index.html' : urlPath;
  const normalizedPath = path.normalize(requestPath).replace(/^([.][.][/\\])+/, '');
  return path.join(rootDir, normalizedPath);
}

function sendResponse(response, statusCode, body, headers = {}) {
  response.writeHead(statusCode, headers);
  response.end(body);
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  const filePath = resolveFilePath(requestUrl.pathname);

  if (!filePath.startsWith(rootDir)) {
    sendResponse(response, 403, 'Forbidden', {
      'Content-Type': 'text/plain; charset=utf-8',
    });
    return;
  }

  fs.readFile(filePath, (error, fileBuffer) => {
    if (error) {
      if (error.code === 'ENOENT') {
        sendResponse(response, 404, 'Not found', {
          'Content-Type': 'text/plain; charset=utf-8',
        });
        return;
      }

      sendResponse(response, 500, 'Internal server error', {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    sendResponse(response, 200, fileBuffer, {
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
  });
});

server.listen(port, host, () => {
  console.log(`Todo app running at http://${host}:${port}`);
});