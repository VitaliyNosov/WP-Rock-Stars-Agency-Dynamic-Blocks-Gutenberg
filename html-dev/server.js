const http = require('http');
const fs = require('fs');
const path = require('path');
const { build, SECTIONS } = require('./build');

const PORT = 3000;
const BASE_DIR = __dirname;
const SECTIONS_DIR = path.join(BASE_DIR, 'sections');
const TEMPLATE_FILE = path.join(BASE_DIR, 'template.html');

// Initial build on server startup
build();

// File watcher with debounce for automatic rebuilding
let debounceTimer = null;
function triggerRebuild(filename) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    console.log(`[watch] Change detected in ${filename}, rebuilding...`);
    try {
      build();
    } catch (err) {
      console.error('[watch] Rebuild error:', err);
    }
  }, 100);
}

if (fs.existsSync(SECTIONS_DIR)) {
  fs.watch(SECTIONS_DIR, (eventType, filename) => {
    if (filename && filename.endsWith('.html')) {
      triggerRebuild(`sections/${filename}`);
    }
  });
}
if (fs.existsSync(TEMPLATE_FILE)) {
  fs.watch(TEMPLATE_FILE, () => {
    triggerRebuild('template.html');
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // Normalize URL
  let parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);
  if (pathname === '/') {
    pathname = '/index.html';
  }

  // Previews asset fallback aliases
  if (pathname.startsWith('/previews/img/')) {
    pathname = pathname.replace('/previews/img/', '/img/');
  } else if (pathname.startsWith('/previews/css/')) {
    pathname = pathname.replace('/previews/css/', '/css/');
  } else if (pathname.startsWith('/previews/js/')) {
    pathname = pathname.replace('/previews/js/', '/js/');
  }

  // Previews index page
  if (pathname === '/previews' || pathname === '/previews/') {
    const listItems = SECTIONS.map(s => `
      <li style="margin-bottom: 12px;">
        <a href="/previews/${s.file}" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: #111111; border: 1px dashed #2A2A2A; border-radius: 12px; color: #F0F0F0; text-decoration: none; font-size: 15px; transition: border-color 0.2s;" onmouseover="this.style.borderColor='#F0F0F0'" onmouseout="this.style.borderColor='#2A2A2A'">
          <span><b style="color: #A0A0A0; font-family: monospace; margin-right: 12px;">Section ${s.num}</b> ${s.title}</span>
          <span style="color: #A0A0A0; font-size: 13px;">Open preview &rarr;</span>
        </a>
      </li>
    `).join('');

    const previewIndexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sections Preview Directory</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="background: #000000; color: #F0F0F0; font-family: 'Inter', sans-serif; padding: 40px 20px; margin: 0; min-height: 100vh;">
  <div style="max-width: 720px; margin: 0 auto;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; border-bottom: 1px dashed #2A2A2A; padding-bottom: 24px;">
      <div>
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 6px 0;">Sections Preview</h1>
        <p style="color: #A0A0A0; font-size: 14px; margin: 0;">Interactive standalone section viewer for Docs Dev Landing</p>
      </div>
      <a href="/index.html" style="padding: 10px 18px; background: #111111; border: 1px solid #2A2A2A; border-radius: 10px; color: #F0F0F0; text-decoration: none; font-size: 14px; font-weight: 500;">
        &larr; Main index.html
      </a>
    </div>
    <ul style="list-style: none; padding: 0; margin: 0;">
      ${listItems}
    </ul>
  </div>
</body>
</html>`;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
    res.end(previewIndexHtml);
    return;
  }

  if (pathname === '/screenshot.png') {
    const screenPath = 'C:\\Users\\user\\.gemini\\antigravity-ide\\brain\\84ecd19a-c0b7-4377-8b13-358b9b7c4c74\\section_04_default_1792849363914.png';
    if (fs.existsSync(screenPath)) {
      res.writeHead(200, { 'Content-Type': 'image/png' });
      fs.createReadStream(screenPath).pipe(res);
      return;
    }
  }

  if (pathname === '/save-asset' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { filename, dataUrl } = JSON.parse(body);
        const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
        const targetDir = path.join(BASE_DIR, 'img', 'services');
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        const savePath = path.join(targetDir, filename);
        fs.writeFileSync(savePath, base64Data, 'base64');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, saved: filename }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Resolve file path safely
  const filePath = path.normalize(path.join(BASE_DIR, pathname));

  // Security check to avoid directory traversal
  if (!filePath.startsWith(BASE_DIR)) {
    res.statusCode = 403;
    res.end('Access Denied');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
      res.end(`404 Not Found: ${pathname}`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Development server running at http://localhost:${PORT}/`);
  console.log(`Previews directory available at http://localhost:${PORT}/previews`);
});
