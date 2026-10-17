const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.csv': 'text/csv; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp3': 'audio/mpeg',
  '.bin': 'application/octet-stream',
  '.dat': 'application/octet-stream',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json'
};

const server = http.createServer((req, res) => {
  let parsedUrl = req.url.split('?')[0];

  // Try file path in public
  let filePath = path.join(PUBLIC_DIR, parsedUrl);

  if (!fs.existsSync(filePath)) {
    if (filePath.endsWith('.dat') && fs.existsSync(filePath.replace(/\.dat$/, '.bin'))) {
      filePath = filePath.replace(/\.dat$/, '.bin');
    } else if (filePath.endsWith('.glb') && fs.existsSync(filePath.replace(/\.glb$/, '.bin'))) {
      filePath = filePath.replace(/\.glb$/, '.bin');
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  } else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
  }

  // Handle /og/
  if (parsedUrl === '/og/' || parsedUrl === '/og') {
    filePath = path.join(PUBLIC_DIR, 'og.png');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(`<h1>404 Not Found</h1><p>Cannot find ${parsedUrl}</p>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Accept-Ranges': 'bytes'
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', (streamErr) => {
      console.error('Stream error:', streamErr);
      if (!res.headersSent) {
        res.writeHead(500);
        res.end();
      }
    });
    res.on('close', () => {
      stream.destroy();
    });
    stream.pipe(res);
  });
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception handled:', err.message);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection handled:', reason);
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
