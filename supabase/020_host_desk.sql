-- The Queen's Host desk: where she actually holds her live classes and Time with the Queen sessions,
-- and free access to every feature for the Queen and her team.
--   meeting_rooms   one saved meeting link per live class, plus 'queen' for her 1:1 room
--   queen_sessions  booked consults; the client sees hers (matched by sign-in email) with a Join button
--   free_access_list / set_free_access   hosts give a shop every feature free (plan = null)
-- Needs 016 and 017 first. Run once in Supabase: SQL Editor -> New query -> paste all -> Run.

-- Hosts of the community calendar (the shared Page everyone joins) run the classes. Same as 016/017.
create or replace function public.is_any_host() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.stage_members m join public.stages s on s.id = m.stage_id
                 where m.user_id = auth.uid() and m.role = 'host' and s.open_to_all);
$$;
grant execute on function public.is_any_host() to authenticated;

-- 1. Meeting links ---------------------------------------------------------------------------
create table if not exists public.meeting_rooms (
  key text primary key check (length(key) between 1 and 40),
  url text not null check (url ~* '^https://' and length(url) <= 500),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users(id) on delete set null
);
alter table public.meeting_rooms enable row level security;
revoke all on public.meeting_rooms from anon;
grant select, insert, update, delete on public.meeting_rooms to authenticated;
grant all on public.meeting_rooms to service_role;

-- Class links are for every signed-in member (the Join button shows to those with a seat).
-- The Queen's private 1:1 room is for hosts only; clients get it on their own booked session.
drop policy if exists meeting_rooms_read on public.meeting_rooms;
create policy meeting_rooms_read on public.meeting_rooms for select to authenticated
  using (key <> 'queen' or public.is_any_host());
drop policy if exists meeting_rooms_host_write on public.meeting_rooms;
create policy meeting_rooms_host_write on public.meeting_rooms for all to authenticated
  using (public.is_any_host()) with check (public.is_any_host());

-- 2. Time with the Queen bookings -----------------------------------------------------------
create table if not exists public.queen_sessions (
  id uuid primary key default gen_random_uuid(),
  client_name text not null check (length(client_name) between 1 and 120),
  client_email text not null check (length(client_email) between 3 and 200),
  client_phone text check (client_phone is null or length(client_phone) <= 40),
  starts_at timestamptz not null,
  minutes int not null check (minutes between 15 and 480),
  topic text check (topic is null or length(topic) <= 500),
  join_url text check (join_url is null or (join_url ~* '^https://' and length(join_url) <= 500)),
  status text not null default 'booked' check (status in ('booked', 'done', 'cancelled')),
  created_at timestamptz not null default now(),
  created_by uuid default auth.uid() references auth.users(id) on delete set null
);
create index if not exists queen_sessions_starts on public.queen_sessions (starts_at);
alter table public.queen_sessions enable row level security;
revoke all on public.queen_sessions from anon;
grant select, insert, update, delete on public.queen_sessions to authenticated;
grant all on public.queen_sessions to service_role;

drop policy if exists queen_sessions_host on public.queen_sessions;
create policy queen_sessions_host on public.queen_sessions for all to authenticated
  using (public.is_any_host()) with check (public.is_any_host());
drop policy if exists queen_sessions_client_read on public.queen_sessions;
create policy queen_sessions_client_read on public.queen_sessions for select to authenticated
  using (lower(client_email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- 3. Free access for the Queen and her team -------------------------------------------------
-- plan = null means every feature, free (see 008_plan.sql). Only hosts can grant or remove it,
-- and only through these functions (the plan guard lets them through because they run as the owner).
create or replace function public.free_access_list()
returns table (shop_id uuid, shop_name text, owner_email text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_any_host() then raise exception 'Only the Queen and her hosts can see this list.'; end if;
  return query
    select s.id, s.name::text, u.email::text
    from public.shops s
    join public.shop_members m on m.shop_id = s.id and m.role = 'owner'
    join auth.users u on u.id = m.user_id
    where s.plan is null
    order by s.name;
end $$;
revoke all on function public.free_access_list() from public, anon;
grant execute on function public.free_access_list() to authenticated;

create or replace function public.set_free_access(p_email text, p_on boolean) returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not public.is_any_host() then raise exception 'Only the Queen and her hosts can give free access.'; end if;
  if coalesce(trim(p_email), '') = '' then raise exception 'Type her sign-in email.'; end if;
  if not p_on and exists (
    select 1 from public.shop_members m join auth.users u on u.id = m.user_id
    where m.user_id = auth.uid() and m.role = 'owner' and lower(u.email) = lower(trim(p_email))
  ) then raise exception 'You can''t remove free access from your own shop.'; end if;
  update public.shops s set plan = case when p_on then null else 'stream' end
  where s.id in (select m.shop_id from public.shop_members m join auth.users u on u.id = m.user_id
                 where m.role = 'owner' and lower(u.email) = lower(trim(p_email)));
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.set_free_access(text, boolean) from public, anon;
grant execute on function public.set_free_access(text, boolean) to authenticated;

notify pgrst, 'reload schema';
