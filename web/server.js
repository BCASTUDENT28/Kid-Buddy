const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8095;
const WEB_DIR = __dirname;
const REPO_ROOT = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.ico': 'image/x-icon',
  '.swift': 'text/plain; charset=UTF-8'
};

const server = http.createServer((req, res) => {
  // Normalize URL
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  let pathname = reqUrl.pathname;

  // API Endpoint: get app icon
  if (pathname === '/api/icon') {
    const iconPath = path.join(REPO_ROOT, 'Kid Buddy', 'supporting files', 'Assets.xcassets', 'AppIcon.appiconset', '1024.png');
    if (fs.existsSync(iconPath)) {
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' });
      return fs.createReadStream(iconPath).pipe(res);
    }
  }

  // API Endpoint: get person icon
  if (pathname === '/api/person-icon') {
    const personPath = path.join(REPO_ROOT, 'Kid Buddy', 'supporting files', 'Assets.xcassets', 'person.imageset', 'person.png');
    if (fs.existsSync(personPath)) {
      res.writeHead(200, { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' });
      return fs.createReadStream(personPath).pipe(res);
    }
  }

  // API Endpoint: get critical alert sound
  if (pathname === '/api/sound/sos') {
    const soundPath = path.join(REPO_ROOT, 'Kid Buddy', 'supporting files', 'criticalAlert.wav');
    if (fs.existsSync(soundPath)) {
      const stat = fs.statSync(soundPath);
      res.writeHead(200, {
        'Content-Type': 'audio/wav',
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes'
      });
      return fs.createReadStream(soundPath).pipe(res);
    }
  }

  // API Endpoint: list Swift source files
  if (pathname === '/api/source-tree') {
    try {
      const getSwiftFiles = (dir, base = '') => {
        let results = [];
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.name.startsWith('.') || entry.name === 'Pods') continue;
          const fullPath = path.join(dir, entry.name);
          const relPath = path.join(base, entry.name);
          if (entry.isDirectory()) {
            results = results.concat(getSwiftFiles(fullPath, relPath));
          } else if (entry.name.endsWith('.swift') || entry.name.endsWith('.plist') || entry.name.endsWith('.md')) {
            results.push({ name: entry.name, path: relPath.replace(/\\/g, '/'), size: fs.statSync(fullPath).size });
          }
        }
        return results;
      };

      const files = getSwiftFiles(path.join(REPO_ROOT, 'Kid Buddy'));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(files));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: err.message }));
    }
  }

  // API Endpoint: read specific file content
  if (pathname === '/api/source-file') {
    const filePathParam = reqUrl.searchParams.get('file');
    if (!filePathParam || filePathParam.includes('..')) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Invalid file parameter' }));
    }
    const targetPath = path.join(REPO_ROOT, 'Kid Buddy', filePathParam);
    if (fs.existsSync(targetPath)) {
      const content = fs.readFileSync(targetPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=UTF-8' });
      return res.end(content);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'File not found' }));
    }
  }

  // Static file serving from WEB_DIR
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(WEB_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('404 Not Found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Kid Buddy] Server is running on http://localhost:${PORT}`);
});
