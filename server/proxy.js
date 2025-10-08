const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const url = require('url');

const app = express();
const TARGET = 'https://dictionary-api-n9tx.onrender.com';

app.use((req, res, next) => {
  // Add permissive CORS for local testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  next();
});

app.use(bodyParser.json());

// Proxy all /api/definitions requests to the partner API
app.all('/api/definitions*', async (req, res) => {
  try {
  // Normalize path to ensure partner receives a consistent route format.
  // Some deployed routes differentiate between `/api/definitions?` and `/api/definitions/?`.
  // Insert a trailing slash before the query string when the path is exactly /api/definitions
  let forwardPath = req.originalUrl;
  forwardPath = forwardPath.replace(/^\/api\/definitions\?/, '/api/definitions/?');

  // Forward the (possibly normalized) original URL path to the target, including the /api prefix.
  const targetUrl = new url.URL(forwardPath, TARGET);
    const method = req.method;
    const headers = { 'Content-Type': req.headers['content-type'] || 'application/json' };

    const opts = { method, headers };
    if (method !== 'GET' && method !== 'HEAD') {
      opts.body = JSON.stringify(req.body);
    }

    console.log(`Proxying ${method} ${targetUrl.href}`);
    const r = await fetch(targetUrl.href, opts);
    const text = await r.text();
    // Log upstream status and a truncated preview of the body for debugging
    try {
      const preview = typeof text === 'string' && text.length > 200 ? text.slice(0, 200) + '...<truncated>' : text;
      console.log(`Upstream response: ${r.status} ${r.statusText || ''}`);
      console.log(`Upstream body preview: ${preview}`);
    } catch (logErr) {
      console.error('Error logging upstream response preview', logErr);
    }

    // Forward status and body
    res.status(r.status);
    // forward content-type header if present
    const ct = r.headers.get('content-type');
    if (ct) res.setHeader('Content-Type', ct);
    res.send(text);
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).json({ success: false, message: 'Proxy error', error: String(err) });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Local proxy listening on http://localhost:${PORT}`));
