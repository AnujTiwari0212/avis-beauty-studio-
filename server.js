const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

const staticDir = path.join(__dirname, 'avi-beauty-studio');

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: "Avi's Beauty Studio" });
});

// Serve static assets from avi-beauty-studio
app.use(express.static(staticDir, {
  extensions: ['html', 'htm']
}));

// Also handle requests prefixed with /avi-beauty-studio/
app.use('/avi-beauty-studio', express.static(staticDir, {
  extensions: ['html', 'htm']
}));

// Clean URL resolver and SPA fallback (Express 5 compatible)
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return next();
  }

  // If request has a file extension and wasn't found by express.static, return 404
  if (path.extname(req.path)) {
    return next();
  }

  const cleanPath = req.path.replace(/^\/+/, '');
  const htmlPath = path.join(staticDir, `${cleanPath}.html`);

  if (cleanPath && fs.existsSync(htmlPath)) {
    return res.sendFile(htmlPath);
  }

  // Handle /services -> service.html mapping
  if (cleanPath === 'services') {
    const serviceHtml = path.join(staticDir, 'service.html');
    if (fs.existsSync(serviceHtml)) {
      return res.sendFile(serviceHtml);
    }
  }

  // Default fallback to index.html
  res.sendFile(path.join(staticDir, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Avi's Beauty Studio server listening on http://${HOST}:${PORT}`);
});
