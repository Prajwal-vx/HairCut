-- The existing application data adapter stores one JSON document. This table
-- keeps it persistent on serverless hosts while the app is migrated to a
-- normalized schema. Only the server's private Postgres connection may access it.
create table if not exists public.salon_state (
  id smallint primary key check (id = 1),
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.salon_state enable row level security;
revoke all on public.salon_state from anon, authenticated;
