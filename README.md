# IsaLab4 — Local dev and deploy

This project is a small static frontend that talks to a dictionary API.

Local development

1. Install deps for the local proxy (optional; only needed if you want to avoid CORS issues):

```bash
npm install
```

2. Start the local proxy (for local testing only). This forwards requests to the partner API and injects permissive CORS headers:

```bash
# start in foreground
npm start

# or start in background and log to /tmp/proxy.log
nohup npm start > /tmp/proxy.log 2>&1 &
```

3. Serve the frontend from the project root (do not open the files directly with file://):

```bash
python3 -m http.server 8000
```

4. Open the pages in your browser:

- http://localhost:8000/index.html
- http://localhost:8000/store.html
- http://localhost:8000/search.html

Notes about config

- `js/config.js` currently points to the local proxy (`http://localhost:3000/api/definitions`) for development. Change it to the partner URL to make deployed sites call the remote API directly:

```js
export const API_BASE = "https://dictionary-api-n9tx.onrender.com/api/definitions";
```

Deploy to Vercel

- Option A: Deploy from GitHub and connect the repo in Vercel (recommended) — every push to `main` will auto-deploy.
- Option B: Deploy from CLI:

```bash
npm i -g vercel
vercel login
vercel --prod
```

CORS reminder

- The partner API must return CORS headers (Access-Control-Allow-Origin) for your browser to accept responses. If your deployed site shows "Failed to fetch", check DevTools Network and ask the API owner to add the CORS snippet to their server.