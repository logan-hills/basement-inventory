-- Shared Facebook Page: many sellers take turns going live on one Page.
-- Run once in Supabase: SQL Editor -> New query -> paste all of this -> Run.
--
-- A "stage" is one shared Facebook Page. Sellers join it with an invite code and book time slots.
-- Two slots on the same stage can never overlap (the database refuses it).
-- The Page's access token and each slot's stream key are kept in tables the app's
-- browser code cannot read directly; only the server timer (an Edge Function) writes them.

create extension if not exists btree_gist;

-- ---------- Stages (shared Pages) and who belongs to them ----------
create table if not exists public.stages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  fb_page_id text,
  fb_page_name text,
  warn_min int not null default 5 check (warn_min between 1 and 30),
  prep_min int not null default 10 check (prep_min between 2 and 60),
  invite_code text not null unique default upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6)),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.stage_members (
  stage_id uuid not null references public.stages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete set null,
  display_name text not null default 'Seller',
  role text not null default 'seller' check (role in ('host','seller')),
  created_at timestamptz not null default now(),
  primary key (stage_id, user_id)
);

create or replace function public.is_stage_member(p_stage uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.stage_members where stage_id = p_stage and user_id = auth.uid());
$$;

create or replace function public.is_stage_host(p_stage uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.stage_members where stage_id = p_stage and user_id = auth.uid() and role = 'host');
$$;

-- Whoever sets up a stage is its host.
create or replace function public.add_stage_host() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.stage_members(stage_id, user_id, shop_id, display_name, role)
  values (new.id, new.created_by,
          (select shop_id from public.shop_members where user_id = new.created_by order by created_at limit 1),
          coalesce((select s.name from public.shops s join public.shop_members m on m.shop_id = s.id where m.user_id = new.created_by order by m.created_at limit 1), 'Host'),
          'host')
  on conflict do nothing;
  return new;
end $$;
drop trigger if exists stages_add_host on public.stages;
create trigger stages_add_host after insert on public.stages for each row execute function public.add_stage_host();

-- Join with the 6-letter invite code. Uses the seller's shop name as their display name.
create or replace function public.join_stage(p_code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_stage uuid; v_shop uuid; v_name text;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  select id into v_stage from public.stages where invite_code = upper(trim(p_code));
  if v_stage is null then raise exception 'That invite code was not found'; end if;
  select m.shop_id, s.name into v_shop, v_name from public.shop_members m join public.shops s on s.id = m.shop_id
    where m.user_id = auth.uid() order by m.created_at limit 1;
  insert into public.stage_members(stage_id, user_id, shop_id, display_name)
  values (v_stage, auth.uid(), v_shop, coalesce(v_name, 'Seller'))
  on conflict (stage_id, user_id) do nothing;
  return v_stage;
end $$;

-- Hosts can make another member a host, rename, or remove a seller.
create or replace function public.set_stage_member(p_stage uuid, p_user uuid, p_role text default null, p_name text default null, p_remove boolean default false)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_stage_host(p_stage) and not (p_user = auth.uid() and p_role is null) then raise exception 'Only a host can do that'; end if;
  if p_remove then
    delete from public.stage_members where stage_id = p_stage and user_id = p_user;
    update public.live_slots set status = 'cancelled' where stage_id = p_stage and user_id = p_user and status = 'booked';
    return;
  end if;
  update public.stage_members set
    role = coalesce(case when p_role in ('host','seller') then p_role end, role),
    display_name = coalesce(nullif(trim(p_name), ''), display_name)
  where stage_id = p_stage and user_id = p_user;
end $$;

-- The Page's access token. No browser access at all: only the Edge Functions (service role) use it.
create table if not exists public.stage_page_tokens (
  stage_id uuid primary key references public.stages(id) on delete cascade,
  page_token text not null,
  scopes text[] not null default '{}',
  connected_by uuid references auth.users(id),
  connected_at timestamptz not null default now()
);

-- ---------- Slots ----------
create table if not exists public.live_slots (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references public.stages(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  shop_id uuid references public.shops(id) on delete set null,
  live_id uuid references public.lives(id) on delete set null,
  seller_name text not null default 'Seller',
  title text not null default 'Live sale',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  -- booked -> preparing -> ready (stream key made, preview) -> live -> ended. Also cancelled / missed.
  status text not null default 'booked' check (status in ('booked','preparing','ready','live','ending','ended','cancelled','missed')),
  fb_live_video_id text,
  went_live_at timestamptz,
  ended_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (ends_at - starts_at <= interval '8 hours'),
  constraint live_slots_no_overlap exclude using gist (stage_id with =, tstzrange(starts_at, ends_at, '[)') with &&) where (status <> 'cancelled')
);
create index if not exists live_slots_stage_start_idx on public.live_slots(stage_id, starts_at);
create index if not exists live_slots_due_idx on public.live_slots(status, starts_at);

-- The stream key for a slot. Only that slot's seller (and hosts) can read it.
create table if not exists public.live_slot_keys (
  slot_id uuid primary key references public.live_slots(id) on delete cascade,
  stage_id uuid not null references public.stages(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  stream_url text not null,
  created_at timestamptz not null default now()
);

-- New slots: always start as plain "booked", in the future, and carry the seller's name.
create or replace function public.prepare_slot() returns trigger
language plpgsql security definer set search_path = public as $$
declare m record;
begin
  select * into m from public.stage_members where stage_id = new.stage_id and user_id = auth.uid();
  if m is null then raise exception 'Join this shared Page before booking'; end if;
  if new.starts_at < now() - interval '1 minute' then raise exception 'That start time has already passed'; end if;
  new.user_id := auth.uid();
  new.shop_id := m.shop_id;
  new.seller_name := m.display_name;
  new.status := 'booked';
  new.fb_live_video_id := null; new.went_live_at := null; new.ended_at := null; new.last_error := null;
  return new;
end $$;
drop trigger if exists live_slots_prepare on public.live_slots;
create trigger live_slots_prepare before insert on public.live_slots for each row execute function public.prepare_slot();

-- Cancel a slot that has not started. Sellers cancel their own; hosts can cancel any.
create or replace function public.cancel_slot(p_slot uuid) returns void
language plpgsql security definer set search_path = public as $$
declare s record;
begin
  select * into s from public.live_slots where id = p_slot;
  if s is null then raise exception 'Slot not found'; end if;
  if s.user_id <> auth.uid() and not public.is_stage_host(s.stage_id) then raise exception 'Only the seller or a host can cancel this slot'; end if;
  if s.status not in ('booked','preparing','ready') then raise exception 'This slot has already started'; end if;
  update public.live_slots set status = 'cancelled' where id = p_slot;
  -- An unused Facebook live video is cleaned up by the timer.
end $$;

-- ---------- Row-level security ----------
alter table public.stages enable row level security;
alter table public.stage_members enable row level security;
alter table public.stage_page_tokens enable row level security;
alter table public.live_slots enable row level security;
alter table public.live_slot_keys enable row level security;

drop policy if exists stages_select on public.stages;
create policy stages_select on public.stages for select using (public.is_stage_member(id) or created_by = auth.uid());
drop policy if exists stages_insert on public.stages;
create policy stages_insert on public.stages for insert with check (created_by = auth.uid());
drop policy if exists stages_update on public.stages;
create policy stages_update on public.stages for update using (public.is_stage_host(id)) with check (public.is_stage_host(id));

drop policy if exists stage_members_select on public.stage_members;
create policy stage_members_select on public.stage_members for select using (public.is_stage_member(stage_id));

drop policy if exists live_slots_select on public.live_slots;
create policy live_slots_select on public.live_slots for select using (public.is_stage_member(stage_id));
drop policy if exists live_slots_insert on public.live_slots;
create policy live_slots_insert on public.live_slots for insert with check (public.is_stage_member(stage_id));

drop policy if exists live_slot_keys_select on public.live_slot_keys;
create policy live_slot_keys_select on public.live_slot_keys for select using (user_id = auth.uid() or public.is_stage_host(stage_id));

-- stage_page_tokens: no policies on purpose.
revoke all on public.stage_page_tokens from anon, authenticated;
revoke all on public.live_slot_keys from anon;
grant select, insert, update on public.stages to authenticated;
grant select on public.stage_members, public.live_slot_keys to authenticated;
grant select, insert on public.live_slots to authenticated;
-- Hosts may change only these columns on a stage (not the Page id, which the connect step sets).
revoke update on public.stages from authenticated;
grant update (name, warn_min, prep_min) on public.stages to authenticated;
grant execute on function public.join_stage(text), public.cancel_slot(uuid), public.set_stage_member(uuid, uuid, text, text, boolean) to authenticated;

-- Live updates in the app when slots change.
do $$ begin
  alter publication supabase_realtime add table public.live_slots;
exception when others then null; end $$;

notify pgrst, 'reload schema';
