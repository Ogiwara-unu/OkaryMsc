const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const port = 8080;
const distFolder = path.join(__dirname, 'dist', 'okary-msc', 'browser');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml',
  '.webmanifest': 'application/manifest+json',
  '.wasm': 'application/wasm'
};

const server = http.createServer(async (req, res) => {
  try {
    if (req.url.includes('favicon.ico') || req.url.includes('.well-known')) {
      res.statusCode = 204;
      return res.end();
    }

    let filePath = req.url === '/' ? 'index.html' : req.url;
    filePath = path.join(distFolder, filePath);

    if (!filePath.startsWith(distFolder)) {
      res.statusCode = 403;
      return res.end('Forbidden');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'text/plain';

    const data = await fs.readFile(filePath);
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.end(data);

  } catch (err) {
    console.error(`Error serving ${req.url}:`, err.message);
    
    try {
      const fallback = await fs.readFile(path.join(distFolder, 'index.html'));
      res.setHeader('Content-Type', 'text/html');
      res.end(fallback);
    } catch (fallbackErr) {
      res.statusCode = 404;
      res.end('Not Found');
    }
  }
});

server.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📂 Serving from: ${distFolder}`);
});