create extension if not exists "pgcrypto";

create table if not exists public.linkedin_post_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  zid text not null,
  post_type text not null check (post_type in ('promotion', 'achievement', 'event', 'announcement')),
  title text not null,
  summary text not null,
  highlights jsonb not null default '[]'::jsonb,
  draft_content text not null,
  status text not null default 'pending_review' check (status in ('pending_review', 'approved', 'rejected', 'published')),
  admin_notes text,
  approved_content text,
  linkedin_post_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.linkedin_post_requests enable row level security;

create policy "Public can insert post requests"
on public.linkedin_post_requests
for insert
to anon, authenticated
with check (true);

create policy "Public can read own draft workflow for demo"
on public.linkedin_post_requests
for select
to anon, authenticated
using (true);
