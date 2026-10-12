create table if not exists public.advisory_leads (
    id uuid primary key default gen_random_uuid(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    name text not null,
    contact_handle text not null,
    contact_type text check (contact_type in ('email', 'linkedin', 'unknown')) not null,
    service_scope text not null,
    project_brief text not null,
    active_mode text default 'machine' check (active_mode in ('machine', 'mind', 'hybrid')),
    status text default 'new' check (status in ('new', 'contacted', 'qualified', 'archived'))
);

create index if not exists idx_advisory_leads_created on public.advisory_leads (created_at desc);
create index if not exists idx_advisory_leads_status on public.advisory_leads (status);
