import './app/api/auth/loadEnv';
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { processAdvisorySubmission } from './app/api/advisory/route';
import sendOtpHandler from './api/auth/send-otp';
import verifyOtpHandler from './api/auth/verify-otp';
import adminContentHandler from './api/admin/content';
import adminBlogsHandler from './api/admin/blogs';
import adminLeadsHandler from './api/admin/leads';
import { validateAdminSession } from './app/api/auth/otpStore';
import fs from 'fs';
import path from 'path';

function adaptHandler(handler: Function) {
  return async (req: any, res: any) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
    });
    req.on('end', async () => {
      try {
        req.body = body ? JSON.parse(body) : {};
      } catch {
        req.body = body;
      }
      res.status = (code: number) => {
        res.statusCode = code;
        return res;
      };
      res.json = (data: any) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(data));
        return res;
      };
      res.send = (data: any) => {
        res.end(data);
        return res;
      };
      const urlObj = new URL(req.url || '', 'http://localhost:3000');
      req.query = Object.fromEntries(urlObj.searchParams.entries());
      await handler(req, res);
    });
  };
}

const backendApiPlugin = (): Plugin => ({
  name: 'backend-api-plugin',
  configureServer(server) {
    // 1. Scraper proxy
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

        const parsed = new URL(target);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid URL protocol. Only HTTP and HTTPS are permitted.' }));
          return;
        }

        const lowerHost = parsed.hostname.toLowerCase();
        if (
          lowerHost === 'localhost' ||
          lowerHost === '127.0.0.1' ||
          lowerHost === '0.0.0.0' ||
          lowerHost === '::1' ||
          lowerHost === '169.254.169.254' ||
          lowerHost.startsWith('10.') ||
          lowerHost.startsWith('192.168.') ||
          lowerHost.endsWith('.local') ||
          lowerHost.endsWith('.internal')
        ) {
          res.statusCode = 403;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Access to private and internal infrastructure is prohibited.' }));
          return;
        }

        const resp = await fetch(target, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
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

    // 2. Advisory Leads Ingestion
    server.middlewares.use('/api/advisory', async (req, res) => {
      // OWASP A01: Broken Access Control & BOLA Prevention
      if (req.method === 'GET') {
        const authHeader = req.headers['authorization'] || '';
        const token = (typeof authHeader === 'string' ? authHeader : '').replace(/^Bearer\s+/i, '').trim();
        if (!validateAdminSession(token)) {
          res.statusCode = 401;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Unauthorized: Admin authentication required.' }));
          return;
        }

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
      let isTooLarge = false;
      req.on('data', (chunk) => {
        body += chunk;
        if (body.length > 50 * 1024) {
          isTooLarge = true;
        }
      });

      req.on('end', async () => {
        if (isTooLarge) {
          res.statusCode = 413;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: false, error: 'Payload exceeds maximum limit (50KB)' }));
          return;
        }
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

    // 3. Contact Ingestion
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
            contact: parsed.contact || parsed.contactInfo || 'contact@cybersteed.com',
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

    // 4. 2FA Authentication
    server.middlewares.use('/api/auth/send-otp', adaptHandler(sendOtpHandler));
    server.middlewares.use('/api/auth/verify-otp', adaptHandler(verifyOtpHandler));

    // 5. Admin CMS & Blogs & Leads
    server.middlewares.use('/api/admin/content', adaptHandler(adminContentHandler));
    server.middlewares.use('/api/admin/blogs', adaptHandler(adminBlogsHandler));
    server.middlewares.use('/api/admin/leads', adaptHandler(adminLeadsHandler));
  },
});

export default defineConfig({
  plugins: [react(), backendApiPlugin()],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
  server: {
    port: 3000,
    open: true,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' ws: wss: https://r.jina.ai https://api.allorigins.win https://*.supabase.co wss://*.supabase.co https://api.resend.com https://api.twilio.com; media-src 'self' data: blob:; worker-src 'self' blob:; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
    },
  },
  preview: {
    port: 3000,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://r.jina.ai https://api.allorigins.win https://*.supabase.co wss://*.supabase.co https://api.resend.com https://api.twilio.com; media-src 'self' data: blob:; worker-src 'self' blob:; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self';",
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    modulePreload: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('vite/') || id.includes('preload')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules')) {
            if (id.includes('/three/') || id.includes('/@react-three/')) {
              return 'three-vendor';
            }
            if (id.includes('/framer-motion/')) {
              return 'motion-vendor';
            }
            if (id.includes('/lucide-react/')) {
              return 'icons-vendor';
            }
            return 'react-vendor';
          }
        },
      },
    },
  },
});
