import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const scraperApiPlugin = (): Plugin => ({
  name: 'scraper-proxy-api',
  configureServer(server) {
    server.middlewares.use('/api/scrape', async (req, res) => {
      try {
        const urlObj = new URL(req.url || '', 'http://localhost:3000');
        const target = urlObj.searchParams.get('url');
        if (!target) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Missing target url parameter' }));
          return;
        }
        const resp = await fetch(target, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });
        const html = await resp.text();
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(html);
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message || 'Failed to fetch target' }));
      }
    });

    server.middlewares.use('/api/contact', async (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Method not allowed' }));
        return;
      }

      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const receiptId = `FV-${Math.floor(100000 + Math.random() * 900000)}`;
          console.log(`[DEV CONTACT INTAKE] Receipt: ${receiptId} from ${parsed.name || 'Anonymous'}`);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              success: true,
              receiptId,
              timestamp: new Date().toISOString(),
              destination: 'contact@flyvane.com',
              message: 'Lead received and logged in dev intake queue.'
            })
          );
        } catch (e: any) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
    });
  }
});

export default defineConfig({
  plugins: [react(), scraperApiPlugin()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'three-vendor': ['three'],
          'motion-vendor': ['framer-motion'],
          'icons-vendor': ['lucide-react']
        }
      }
    }
  }
});
