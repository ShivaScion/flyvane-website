-- ==============================================================================
-- CMS AND BLOG PUBLISHING SCHEMA
-- ==============================================================================

-- 1. Site Content Key-Value Store (For controlling each headline, text, mode config)
create table if not exists public.site_content (
    key text primary key,
    value jsonb not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Blog Posts & Research Publications Table
create table if not exists public.blog_posts (
    id uuid primary key default gen_random_uuid(),
    slug text unique not null,
    title text not null,
    excerpt text not null,
    content text not null,
    cover_image text default '',
    category text default 'Engineering' check (category in ('Engineering', 'Behavioral Psychology', 'System Architecture', 'Case Study')),
    reading_time text default '5 min read',
    status text default 'published' check (status in ('draft', 'published', 'archived')),
    published_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists idx_blog_posts_published on public.blog_posts (published_at desc);
create index if not exists idx_blog_posts_status on public.blog_posts (status);
create index if not exists idx_blog_posts_slug on public.blog_posts (slug);

-- 3. Initial Seed for Blog Posts
insert into public.blog_posts (slug, title, excerpt, content, category, reading_time, status)
values
(
    'autonomous-data-pipelines-at-scale',
    'Architecting Zero-Failure Autonomous Worker Swarms in Node & Python',
    'How we eliminated 98.4% of operational friction across institutional client data flows through distributed task scheduling and self-healing nodes.',
    '# Architecting Zero-Failure Autonomous Worker Swarms\n\nHigh-throughput enterprise data pipelines fail not because of memory leaks, but because of rigid orchestration assumptions.\n\n### The Decentralized Swarm Paradigm\nBy moving away from monolithic Airflow DAGs toward localized, resilient worker swarms with autonomous failover, we achieved sub-50ms ingestion latency and 99.98% pipeline uptime across 14 enterprise deployments.\n\n### Core Engineering Principles\n1. **Deterministic State Recovery**: Idempotent checkpointing ensures zero duplicate ledger transactions.\n2. **Dynamic Backpressure Throttling**: Rate-limiting algorithms automatically recalibrate worker concurrency based on target API health.\n3. **Tactile Telemetry**: Continuous distributed health pinging eliminates silent worker starvation.',
    'Engineering',
    '4 min read',
    'published'
),
(
    'loss-aversion-and-b2b-procurement-psychology',
    'Loss-Aversion Architecture: Engineering High-Ticket Inbound Conversion',
    'Examining why enterprise procurement executives respond 3.4x more aggressively to downside prevention messaging than generic aspirational marketing.',
    '# Loss-Aversion Architecture\n\nInstitutional buyers are not incentivized to take risks. They are incentivized to protect their careers and eliminate organizational downside.\n\n### The Psychology of Risk Parity\nWhen marketing to Fortune 500 procurement teams, framing an engagement around "economic arbitrage" and "loss containment" consistently outperforms generic "growth hacking" by an average margin of 340%.\n\n### Strategic Takeaways\n- Quantify the cost of inaction with mathematical precision.\n- Replace subjective agency promises with deterministic contractual SLAs.\n- Architect category authority before the initial discovery call.',
    'Behavioral Psychology',
    '6 min read',
    'published'
)
on conflict (slug) do nothing;
