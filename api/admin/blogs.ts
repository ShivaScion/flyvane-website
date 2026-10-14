import { validateAdminSession } from '../../app/api/auth/otpStore.ts';
import { applyOwaspHeaders, sanitizeServerText } from '../../app/api/auth/security.ts';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const localBlogPath = path.resolve(process.cwd(), 'supabase', 'blog_posts_store.json');

const INITIAL_BLOGS = [
  {
    id: '1',
    slug: 'autonomous-data-pipelines-at-scale',
    title: 'Architecting Zero-Failure Autonomous Worker Swarms in Node & Python',
    excerpt: 'How we eliminated 98.4% of operational friction across institutional client data flows through distributed task scheduling and self-healing nodes.',
    content: `# Architecting Zero-Failure Autonomous Worker Swarms

High-throughput enterprise data pipelines fail not because of memory leaks, but because of rigid orchestration assumptions.

### The Decentralized Swarm Paradigm
By moving away from monolithic Airflow DAGs toward localized, resilient worker swarms with autonomous failover, we achieved sub-50ms ingestion latency and 99.98% pipeline uptime across 14 enterprise deployments.

### Core Engineering Principles
1. **Deterministic State Recovery**: Idempotent checkpointing ensures zero duplicate ledger transactions.
2. **Dynamic Backpressure Throttling**: Rate-limiting algorithms automatically recalibrate worker concurrency based on target API health.
3. **Tactile Telemetry**: Continuous distributed health pinging eliminates silent worker starvation.`,
    category: 'Engineering',
    reading_time: '4 min read',
    status: 'published',
    published_at: '2026-10-10T12:00:00.000Z',
    created_at: '2026-10-10T12:00:00.000Z',
  },
  {
    id: '2',
    slug: 'loss-aversion-and-b2b-procurement-psychology',
    title: 'Loss-Aversion Architecture: Engineering High-Ticket Inbound Conversion',
    excerpt: 'Examining why enterprise procurement executives respond 3.4x more aggressively to downside prevention messaging than generic aspirational marketing.',
    content: `# Loss-Aversion Architecture

Institutional buyers are not incentivized to take risks. They are incentivized to protect their careers and eliminate organizational downside.

### The Psychology of Risk Parity
When marketing to Fortune 500 procurement teams, framing an engagement around "economic arbitrage" and "loss containment" consistently outperforms generic "growth hacking" by an average margin of 340%.

### Strategic Takeaways
- **Quantify the cost of inaction with mathematical precision.**
- **Replace subjective agency promises with deterministic contractual SLAs.**
- **Architect category authority before the initial discovery call.**`,
    category: 'Behavioral Psychology',
    reading_time: '6 min read',
    status: 'published',
    published_at: '2026-10-12T15:30:00.000Z',
    created_at: '2026-10-12T15:30:00.000Z',
  },
];

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) {
    return createClient(url, key, { auth: { persistSession: false } });
  }
  return null;
}

function getLocalBlogs(): any[] {
  try {
    if (fs.existsSync(localBlogPath)) {
      return JSON.parse(fs.readFileSync(localBlogPath, 'utf8') || '[]');
    }
  } catch {}
  return INITIAL_BLOGS;
}

function saveLocalBlogs(blogs: any[]) {
  try {
    const dir = path.dirname(localBlogPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(localBlogPath, JSON.stringify(blogs, null, 2), 'utf8');
  } catch {}
}

export default async function handler(req: any, res: any) {
  applyOwaspHeaders(res);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const isAdmin = validateAdminSession(token);

  // GET: Read blogs
  if (req.method === 'GET') {
    try {
      const supabase = getSupabase();
      if (supabase) {
        let query = supabase.from('blog_posts').select('*').order('published_at', { ascending: false });
        if (!isAdmin) {
          query = query.eq('status', 'published');
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return res.status(200).json({ success: true, blogs: data });
        }
      }

      // Local fallback
      let blogs = getLocalBlogs();
      if (!isAdmin) {
        blogs = blogs.filter((b) => b.status === 'published');
      }
      return res.status(200).json({ success: true, blogs });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // Admin mutation methods require authentication
  if (!isAdmin) {
    return res.status(401).json({ success: false, error: 'Unauthorized: valid admin session required.' });
  }

  const rawBody = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

  // POST: Create new blog post
  if (req.method === 'POST') {
    try {
      const { title, excerpt, content, category, reading_time, status } = rawBody;
      if (!title || !content) {
        return res.status(400).json({ success: false, error: 'Title and content are required.' });
      }

      const safeTitle = sanitizeServerText(title, 200);
      const safeContent = sanitizeServerText(content, 50000);
      const safeExcerpt = sanitizeServerText(excerpt || title, 500);
      const safeCategory = sanitizeServerText(category || 'Engineering', 50);
      const safeReadingTime = sanitizeServerText(reading_time || '5 min read', 30);
      const safeSlug =
        sanitizeServerText(rawBody.slug || '', 100) ||
        safeTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

      const newPost = {
        id: crypto.randomUUID(),
        slug: safeSlug,
        title: safeTitle,
        excerpt: safeExcerpt,
        content: safeContent,
        category: safeCategory,
        reading_time: safeReadingTime,
        status: status || 'published',
        published_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };

      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('blog_posts').insert([newPost]);
      }

      const local = getLocalBlogs();
      local.unshift(newPost);
      saveLocalBlogs(local);

      return res.status(200).json({ success: true, post: newPost });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // PUT: Update blog post
  if (req.method === 'PUT') {
    try {
      const { id, ...updates } = rawBody;
      if (!id) return res.status(400).json({ success: false, error: 'Missing post id' });
      const safeId = sanitizeServerText(id, 64);

      const safeUpdates: Record<string, any> = { ...updates };
      if (updates.title) safeUpdates.title = sanitizeServerText(updates.title, 200);
      if (updates.slug) safeUpdates.slug = sanitizeServerText(updates.slug, 100);
      if (updates.excerpt) safeUpdates.excerpt = sanitizeServerText(updates.excerpt, 500);
      if (updates.content) safeUpdates.content = sanitizeServerText(updates.content, 50000);
      if (updates.category) safeUpdates.category = sanitizeServerText(updates.category, 50);
      if (updates.reading_time) safeUpdates.reading_time = sanitizeServerText(updates.reading_time, 30);

      safeUpdates.updated_at = new Date().toISOString();

      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('blog_posts').update(safeUpdates).eq('id', safeId);
      }

      const local = getLocalBlogs().map((b) => (b.id === safeId ? { ...b, ...safeUpdates } : b));
      saveLocalBlogs(local);

      return res.status(200).json({ success: true, message: 'Post updated successfully' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // DELETE: Remove post (OWASP Object-level verification)
  if (req.method === 'DELETE') {
    try {
      const id = req.query?.id || rawBody.id;
      if (!id) return res.status(400).json({ success: false, error: 'Missing post id' });
      const safeId = sanitizeServerText(id, 64);

      const supabase = getSupabase();
      if (supabase) {
        await supabase.from('blog_posts').delete().eq('id', safeId);
      }

      const local = getLocalBlogs().filter((b) => b.id !== safeId);
      saveLocalBlogs(local);

      return res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
