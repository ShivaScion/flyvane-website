import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { processAdvisorySubmission } from './app/api/advisory/route';
import fs from 'fs';
import path from 'path';

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

    server.middlewares.use('/api/advisory', async (req, res) => {
      if (req.method === 'GET') {
        try {
          const storePath = path.resolve(process.cwd(), 'supabase', 'advisory_leads_store.json');
          const records = fs.existsSync(storePath)
            ? JSON.parse(fs.readFileSync(storePath, 'utf8') || '[]')
            : [];
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ table: 'advisory_leads', records }));
        } catch {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ table: 'advisory_leads', records: [] }));
        }
        return;
      }

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

      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const result = await processAdvisorySubmission(parsed);
          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result.body));
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
        }
      });
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

      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const result = await processAdvisorySubmission({
            name: parsed.name || 'Partner',
            contact: parsed.contact || parsed.contactInfo || 'contact@flyvane.com',
            serviceScope: parsed.serviceScope || parsed.projectType || 'Autonomous Data Pipelines',
            projectBrief: parsed.projectBrief || parsed.message || 'Advisory project inquiry submitted.',
            activeMode: parsed.activeMode || 'machine',
            trapField: parsed.trapField || '',
          });
          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result.body));
        } catch {
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
          'motion-vendor': ['framer-motion'],
          'icons-vendor': ['lucide-react']
        }
      }
    }
  }
});
