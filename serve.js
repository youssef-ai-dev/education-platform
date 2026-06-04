const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = 3000;
const BASE = '/home/z/my-project';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.rsc': 'text/x-component',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  console.log(`${req.method} ${urlPath}`);
  
  let filePath = null;
  
  if (urlPath.startsWith('/_next/static/')) {
    filePath = path.join(BASE, '.next', 'static', urlPath.replace('/_next/static/', ''));
  } else if (urlPath.startsWith('/_next/')) {
    // Other _next paths (like _next/data)
    const relPath = urlPath.replace('/_next/', '');
    filePath = path.join(BASE, '.next', relPath);
  } else if (urlPath === '/' || urlPath === '') {
    filePath = path.join(BASE, '.next', 'server', 'app', 'index.html');
  } else if (urlPath.startsWith('/signin') || urlPath.startsWith('/signup')) {
    // Auth pages - serve the relevant HTML
    const pageName = urlPath.split('/')[1];
    const subPath = urlPath.replace(`/${pageName}`, '');
    const htmlDir = path.join(BASE, '.next', 'server', 'app', pageName);
    if (fs.existsSync(htmlDir) && fs.statSync(htmlDir).isDirectory()) {
      filePath = path.join(htmlDir, 'index.html');
      if (!fs.existsSync(filePath)) {
        filePath = path.join(BASE, '.next', 'server', 'app', 'index.html');
      }
    } else {
      filePath = path.join(BASE, '.next', 'server', 'app', 'index.html');
    }
  } else {
    // Try public directory first
    const publicPath = path.join(BASE, 'public', urlPath);
    if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
      filePath = publicPath;
    } else {
      // Default to homepage for SPA-like behavior
      filePath = path.join(BASE, '.next', 'server', 'app', 'index.html');
    }
  }
  
  if (filePath && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentType = MIME[ext] || 'application/octet-stream';
    
    // Try to serve gzip version
    const gzipPath = filePath + '.gz';
    const acceptGzip = (req.headers['accept-encoding'] || '').includes('gzip');
    
    if (acceptGzip && fs.existsSync(gzipPath)) {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Encoding': 'gzip',
        'Cache-Control': 'public, max-age=31536000, immutable',
      });
      fs.createReadStream(gzipPath).pipe(res);
    } else if (acceptGzip && (ext === '.html' || ext === '.js' || ext === '.css')) {
      // Compress on the fly
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Encoding': 'gzip',
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      });
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      });
      fs.createReadStream(filePath).pipe(res);
    }
  } else {
    // Fallback to homepage
    const fallbackPath = path.join(BASE, '.next', 'server', 'app', 'index.html');
    if (fs.existsSync(fallbackPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(fallbackPath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Static server running on http://0.0.0.0:${PORT}`);
});
