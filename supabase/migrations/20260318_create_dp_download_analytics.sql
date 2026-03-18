-- DP Blast download analytics table
-- Matches payload written by src/pages/api/analytics/download.ts

create table if not exists public.dp_download_analytics (
  id bigint generated always as identity primary key,
  event_slug text not null,
  frame_id text not null,
  source_path text,
  user_agent text,
  downloaded_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists idx_dp_download_analytics_event_slug
  on public.dp_download_analytics (event_slug);

create index if not exists idx_dp_download_analytics_frame_id
  on public.dp_download_analytics (frame_id);

create index if not exists idx_dp_download_analytics_downloaded_at
  on public.dp_download_analytics (downloaded_at desc);

-- Optional: tighten default access for non-service-role clients.
alter table public.dp_download_analytics enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'dp_download_analytics'
      and policyname = 'deny_anon_and_authenticated_read_write'
  ) then
    create policy deny_anon_and_authenticated_read_write
      on public.dp_download_analytics
      as restrictive
      for all
      to anon, authenticated
      using (false)
      with check (false);
  end if;
end $$;
