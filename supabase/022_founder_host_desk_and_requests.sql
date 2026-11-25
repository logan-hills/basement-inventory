-- 1. Only Founder accounts get the Host desk (Logan, 2026-11-25).
--    A "host" is now anyone on a Founder shop (owner or team member): LaVerne, her team, and anyone
--    she adds under "Free for you and your team". Being a host of the community calendar alone is no
--    longer enough. Everything the Host desk does checks this on the server: meeting links, Queen
--    bookings, free access, class times, Who's coming, and the requests below.
-- 2. Requests sellers send from forms inside the app (no email app opens):
--      'coaching'  free 1:1 coaching with the Dynamic Dazzle team (Help desk, Live classes page)
--      'queen'     Time with the Queen consult requests
--    They land on the Host desk, with a "new requests" alert on the Founder's Home screen.
-- Needs 020_host_desk.sql, 020_founder_plan.sql and 021 first. Run once in Supabase: SQL Editor -> New query -> paste all -> Run.

create or replace function public.is_any_host() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.shop_members m join public.shops s on s.id = m.shop_id
                 where m.user_id = auth.uid() and s.plan = 'founder');
$$;
grant execute on function public.is_any_host() to authenticated;

create table if not exists public.host_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  shop_id uuid,
  shop_name text check (shop_name is null or length(shop_name) <= 120),
  kind text not null check (kind in ('coaching', 'queen')),
  name text not null check (length(name) between 1 and 120),
  email text check (email is null or length(email) <= 200),
  phone text check (phone is null or length(phone) <= 40),
  best_time text check (best_time is null or best_time in ('Daytime', 'Evening')),
  hours numeric(4,2) check (hours is null or (hours > 0 and hours <= 8)),
  topics text check (topics is null or length(topics) <= 500),
  details text not null check (length(details) between 1 and 4000),
  status text not null default 'new' check (status in ('new', 'handled')),
  created_at timestamptz not null default now(),
  handled_at timestamptz
);
create index if not exists host_requests_created on public.host_requests (created_at desc);
alter table public.host_requests enable row level security;
revoke all on public.host_requests from anon;
grant select, insert, update, delete on public.host_requests to authenticated;
grant all on public.host_requests to service_role;

-- A seller sends her own requests and can see them; only she can't mark them handled.
drop policy if exists host_requests_own_insert on public.host_requests;
create policy host_requests_own_insert on public.host_requests for insert to authenticated
  with check (user_id = auth.uid() and status = 'new');
drop policy if exists host_requests_read on public.host_requests;
create policy host_requests_read on public.host_requests for select to authenticated
  using (user_id = auth.uid() or public.is_any_host());
drop policy if exists host_requests_host_update on public.host_requests;
create policy host_requests_host_update on public.host_requests for update to authenticated
  using (public.is_any_host()) with check (public.is_any_host());
drop policy if exists host_requests_host_delete on public.host_requests;
create policy host_requests_host_delete on public.host_requests for delete to authenticated
  using (public.is_any_host());

notify pgrst, 'reload schema';
