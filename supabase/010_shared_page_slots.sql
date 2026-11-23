-- Shared Facebook Page: many sellers take turns going live on one Page.
-- Run once in Supabase: SQL Editor -> New query -> paste all of this -> Run.
--
-- A "stage" is one shared Facebook Page. The first one created is the community calendar that every
-- account joins automatically; later ones are invite-only. Sellers book whole-hour blocks.
-- Two slots on the same stage can never overlap (the database refuses it).
-- The Page's access token and each slot's stream key are kept in tables the app's
-- browser code cannot read directly; only the server timer (an Edge Function) writes them.

create extension if not exists btree_gist;

-- ---------- Profiles ----------
-- Every account has one. The display name always shows on the shared calendar; photo, bio,
-- email and phone show to other members only when the person switches them on.
-- 'stream' = free account that only books slots and goes live; 'seller' = full app with a shop.
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  display_name text not null check (length(trim(display_name)) between 1 and 60),
  photo_path text,
  bio text check (bio is null or length(bio) <= 600),
  email text,
  phone text,
  show_photo boolean not null default true,
  show_bio boolean not null default true,
  show_email boolean not null default false,
  show_phone boolean not null default false,
  account_type text not null default 'stream' check (account_type in ('stream','seller')),
  terms_version text,
  terms_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists profiles_own on public.profiles;
create policy profiles_own on public.profiles for all using (user_id = auth.uid()) with check (user_id = auth.uid());
grant select, insert, update on public.profiles to authenticated;

-- What other signed-in members may see: hidden fields come back empty.
create or replace view public.public_profiles as
  select user_id, display_name,
         case when show_photo then photo_path end as photo_path,
         case when show_bio then bio end as bio,
         case when show_email then email end as email,
         case when show_phone then phone end as phone
  from public.profiles;
revoke all on public.public_profiles from anon;
grant select on public.public_profiles to authenticated;

-- Keep calendar names in step when someone renames themselves.
create or replace function public.sync_profile_name() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if tg_op = 'UPDATE' and new.display_name is distinct from old.display_name then
    update public.stage_members set display_name = new.display_name where user_id = new.user_id;
    update public.live_slots set seller_name = new.display_name where user_id = new.user_id and ends_at > now() and status <> 'cancelled';
  end if;
  return new;
end $$;

-- Profile photos: public images, each person writes only inside their own folder.
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true) on conflict (id) do nothing;
drop policy if exists avatars_own on storage.objects;
create policy avatars_own on storage.objects for all to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create or replace function public.my_name() returns text
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select display_name from public.profiles where user_id = auth.uid()),
    (select s.name from public.shops s join public.shop_members m on m.shop_id = s.id where m.user_id = auth.uid() order by m.created_at limit 1),
    'Seller');
$$;

-- ---------- Stages (shared Pages) and who belongs to them ----------
create table if not exists public.stages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  fb_page_id text,
  fb_page_name text,
  warn_min int not null default 5 check (warn_min between 1 and 30),
  -- Minutes before the start that the seller gets the stream key for a HIDDEN test (default 5; 0 = exactly at the start).
  prep_min int not null default 5 check (prep_min between 0 and 30),
  open_to_all boolean not null default false,
  -- Seller rules shown (and agreed to) every time the calendar opens. Empty = the app's built-in rules.
  guidelines text,
  -- Not streaming this many minutes after the start time = live canceled.
  late_cancel_min int not null default 10 check (late_cancel_min between 1 and 60),
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
          public.my_name(), 'host')
  on conflict do nothing;
  return new;
end $$;

-- The very first shared Page becomes the community calendar everyone joins.
create or replace function public.first_stage_open() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.open_to_all := not exists (select 1 from public.stages where open_to_all);
  return new;
end $$;
drop trigger if exists stages_first_open on public.stages;
create trigger stages_first_open before insert on public.stages for each row execute function public.first_stage_open();

-- Called by the app on sign-in: joins the community calendar.
create or replace function public.join_open_stages() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return; end if;
  insert into public.stage_members(stage_id, user_id, shop_id, display_name)
  select st.id, auth.uid(),
         (select shop_id from public.shop_members where user_id = auth.uid() order by created_at limit 1),
         public.my_name()
  from public.stages st where st.open_to_all
  on conflict (stage_id, user_id) do nothing;
end $$;
drop trigger if exists stages_add_host on public.stages;
create trigger stages_add_host after insert on public.stages for each row execute function public.add_stage_host();

-- Join with the 6-letter invite code. Uses the seller's shop name as their display name.
create or replace function public.join_stage(p_code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_stage uuid; v_shop uuid;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  select id into v_stage from public.stages where invite_code = upper(trim(p_code));
  if v_stage is null then raise exception 'That invite code was not found'; end if;
  select m.shop_id into v_shop from public.shop_members m where m.user_id = auth.uid() order by m.created_at limit 1;
  insert into public.stage_members(stage_id, user_id, shop_id, display_name)
  values (v_stage, auth.uid(), v_shop, public.my_name())
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
  -- Whole-hour blocks that start on the hour.
  check (date_trunc('hour', starts_at) = starts_at and date_trunc('hour', ends_at) = ends_at),
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

drop trigger if exists profiles_sync on public.profiles;
create trigger profiles_sync before insert or update on public.profiles for each row execute function public.sync_profile_name();

-- ---------- Guideline agreements ----------
-- One row every time a seller taps "I agree" on the calendar's rules pop-up.
create table if not exists public.guideline_acceptances (
  id uuid primary key default gen_random_uuid(),
  stage_id uuid not null references public.stages(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  version text not null,
  accepted_at timestamptz not null default now()
);
create index if not exists guideline_acceptances_user_idx on public.guideline_acceptances(stage_id, user_id, accepted_at desc);
alter table public.guideline_acceptances enable row level security;
drop policy if exists guideline_acceptances_insert on public.guideline_acceptances;
create policy guideline_acceptances_insert on public.guideline_acceptances for insert
  with check (user_id = auth.uid() and public.is_stage_member(stage_id));
drop policy if exists guideline_acceptances_select on public.guideline_acceptances;
create policy guideline_acceptances_select on public.guideline_acceptances for select
  using (user_id = auth.uid() or public.is_stage_host(stage_id));
grant select, insert on public.guideline_acceptances to authenticated;
-- The server sets the time; nobody can backdate an agreement.
create or replace function public.stamp_acceptance() returns trigger language plpgsql as $$
begin new.accepted_at := now(); new.user_id := auth.uid(); return new; end $$;
drop trigger if exists guideline_acceptances_stamp on public.guideline_acceptances;
create trigger guideline_acceptances_stamp before insert on public.guideline_acceptances for each row execute function public.stamp_acceptance();

-- ---------- Row-level security ----------
alter table public.stages enable row level security;
alter table public.stage_members enable row level security;
alter table public.stage_page_tokens enable row level security;
alter table public.live_slots enable row level security;
alter table public.live_slot_keys enable row level security;

drop policy if exists stages_select on public.stages;
create policy stages_select on public.stages for select using (public.is_stage_member(id) or created_by = auth.uid() or open_to_all);
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
-- The seller sees their key only from their key time until their stop time. Hosts can always see keys.
create policy live_slot_keys_select on public.live_slot_keys for select using (
  public.is_stage_host(stage_id)
  or (user_id = auth.uid() and exists (
    select 1 from public.live_slots s join public.stages st on st.id = s.stage_id
    where s.id = slot_id and now() >= s.starts_at - make_interval(mins => st.prep_min) and now() < s.ends_at)));

-- stage_page_tokens: no policies on purpose.
revoke all on public.stage_page_tokens from anon, authenticated;
-- Supabase grants new tables to the signed-out role by default; none of this is for signed-out visitors.
revoke all on public.live_slot_keys, public.stages, public.stage_members, public.live_slots, public.profiles, public.guideline_acceptances from anon;
grant select, insert, update on public.stages to authenticated;
grant select on public.stage_members, public.live_slot_keys to authenticated;
grant select, insert on public.live_slots to authenticated;
-- Hosts may change only these columns on a stage (not the Page id, which the connect step sets).
revoke update on public.stages from authenticated;
-- prep_min is not editable in the app: owner chose a 5-minute hidden test, public exactly at start.
grant update (name, warn_min, guidelines, late_cancel_min) on public.stages to authenticated;
grant execute on function public.join_open_stages(), public.join_stage(text), public.cancel_slot(uuid), public.set_stage_member(uuid, uuid, text, text, boolean) to authenticated;

-- Live updates in the app when slots change.
do $$ begin
  alter publication supabase_realtime add table public.live_slots;
exception when others then null; end $$;

notify pgrst, 'reload schema';
