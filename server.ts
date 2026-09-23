import compression from 'compression';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DIST_DIR = path.resolve(__dirname, 'dist');

// Compress all responses with gzip.
app.use(compression() as unknown as express.RequestHandler);

// Serve the Vite-built static assets.
app.use(
  express.static(DIST_DIR, {
    index: false,
  }),
);

// SPA fallback: any request that isn't a static asset is routed to index.html
// so client-side routing (e.g. react-router) can take over.
app.get('*', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend server listening on port ${PORT}`);
});
