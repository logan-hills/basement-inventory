-- Every seller's shop stays private, and sellers can add team members (employees).
-- Run once in Supabase: SQL Editor -> New query -> paste all of this -> Run. Safe to run twice.
-- Needs 001 through 017 first. Nothing is deleted: the on-stream product card is moved, not removed.
--
-- 1. The on-stream product card moves out of the shared calendar row, so other sellers on the
--    calendar can no longer see which product (and photo link) a seller has queued up.
-- 2. A shop's records can only point at that same shop's records (no borrowing another shop's ids).
-- 3. Team members: the shop owner invites up to their plan's limit. Team members get the shop's
--    stock, scanning, picking, shipping and live prep. Dazzle University classes, Time with the
--    Queen and booking Shared Page lives stay with the owner. One account belongs to one shop.

-- ---------- 1. Private product card ----------
create table if not exists public.live_slot_cards (
  slot_id uuid primary key references public.live_slots(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  featured jsonb,
  updated_at timestamptz not null default now()
);
alter table public.live_slot_cards enable row level security;
drop policy if exists live_slot_cards_own on public.live_slot_cards;
create policy live_slot_cards_own on public.live_slot_cards for select to authenticated using (user_id = auth.uid());
revoke all on public.live_slot_cards from anon, authenticated;
grant select on public.live_slot_cards to authenticated;
grant all on public.live_slot_cards to service_role;

-- Move any card already saved on a slot into the private table, then clear the shared copy.
insert into public.live_slot_cards(slot_id, user_id, featured)
  select id, user_id, featured from public.live_slots where featured is not null
  on conflict (slot_id) do nothing;
update public.live_slots set featured = null where featured is not null;

create or replace function public.set_featured(p_slot uuid, p_featured jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.live_slots where id = p_slot and user_id = auth.uid()
                 and status not in ('cancelled','ended','missed')) then
    raise exception 'You can only show products during your own slot';
  end if;
  insert into public.live_slot_cards(slot_id, user_id, featured, updated_at)
  values (p_slot, auth.uid(), case when p_featured is null then null else p_featured || jsonb_build_object('at', now()) end, now())
  on conflict (slot_id) do update set featured = excluded.featured, updated_at = now();
end $$;

-- The overlay (Prism / OBS) reads the card from the private table, with the seller's private link.
create or replace function public.overlay_state(p_token text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('featured', c.featured, 'title', s.title, 'seller', s.seller_name,
                            'status', s.status, 'starts_at', s.starts_at, 'ends_at', s.ends_at)
  from public.overlay_links o
  join public.live_slots s on s.user_id = o.user_id
  left join public.live_slot_cards c on c.slot_id = s.id
  where o.token = p_token and length(p_token) >= 32
    and s.status not in ('cancelled','missed')
    and s.starts_at <= now() + interval '1 hour' and s.ends_at > now() - interval '10 minutes'
  order by s.starts_at
  limit 1;
$$;
grant execute on function public.set_featured(uuid, jsonb) to authenticated;
grant execute on function public.overlay_state(text) to anon, authenticated;

-- ---------- 2. Records stay inside their own shop ----------
-- Trigger arguments come in pairs: column name, table it points at. Each pointed-at row must have
-- the same shop_id. Only checked when the value is new or changed, so old rows are left alone.
create or replace function public.guard_same_shop() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  i int := 0; col text; tbl text; ref text; ok boolean;
  n jsonb := to_jsonb(new);
  o jsonb := case when tg_op = 'UPDATE' then to_jsonb(old) else null end;
begin
  while i < tg_nargs loop
    col := tg_argv[i]; tbl := tg_argv[i + 1]; i := i + 2;
    ref := n->>col;
    continue when ref is null;
    continue when o is not null and (o->>col) is not distinct from ref and (o->>'shop_id') is not distinct from (n->>'shop_id');
    execute format('select exists (select 1 from public.%I where id = $1 and shop_id = $2)', tbl)
      into ok using ref::uuid, (n->>'shop_id')::uuid;
    if not ok then raise exception 'That belongs to a different shop (%.%)', tg_table_name, col; end if;
  end loop;
  return new;
end $$;
revoke execute on function public.guard_same_shop() from public, anon, authenticated;

drop trigger if exists same_shop on public.variants;
create trigger same_shop before insert or update on public.variants for each row execute function public.guard_same_shop('item_id', 'items');
drop trigger if exists same_shop on public.item_photos;
create trigger same_shop before insert or update on public.item_photos for each row execute function public.guard_same_shop('item_id', 'items');
drop trigger if exists same_shop on public.locations;
create trigger same_shop before insert or update on public.locations for each row execute function public.guard_same_shop('parent_id', 'locations');
drop trigger if exists same_shop on public.units;
create trigger same_shop before insert or update on public.units for each row execute function public.guard_same_shop(
  'variant_id', 'variants', 'location_id', 'locations', 'order_id', 'orders', 'order_line_id', 'order_lines');
drop trigger if exists same_shop on public.movements;
create trigger same_shop before insert or update on public.movements for each row execute function public.guard_same_shop(
  'unit_id', 'units', 'from_location', 'locations', 'to_location', 'locations');
drop trigger if exists same_shop on public.orders;
create trigger same_shop before insert or update on public.orders for each row execute function public.guard_same_shop(
  'customer_id', 'customers', 'live_id', 'lives');
drop trigger if exists same_shop on public.order_lines;
create trigger same_shop before insert or update on public.order_lines for each row execute function public.guard_same_shop(
  'order_id', 'orders', 'variant_id', 'variants');
drop trigger if exists same_shop on public.live_items;
create trigger same_shop before insert or update on public.live_items for each row execute function public.guard_same_shop(
  'live_id', 'lives', 'variant_id', 'variants');
drop trigger if exists same_shop on public.live_claims;
create trigger same_shop before insert or update on public.live_claims for each row execute function public.guard_same_shop(
  'live_id', 'lives', 'variant_id', 'variants', 'order_id', 'orders');

-- ---------- 3. Team members ----------
create or replace function public.is_shop_owner(p_shop uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.shop_members where shop_id = p_shop and user_id = auth.uid() and role = 'owner');
$$;

-- A team member who doesn't own a shop of their own. They get the shop's daily work, not the extras.
create or replace function public.is_team_only() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.shop_members where user_id = auth.uid() and role = 'staff')
     and not exists (select 1 from public.shop_members where user_id = auth.uid() and role = 'owner');
$$;

create or replace function public.in_any_shop() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.shop_members where user_id = auth.uid());
$$;

-- How many team members each plan includes (the owner doesn't count).
-- null = Dynamic Dazzle's own founder shop.
create or replace function public.team_limit(p_plan text) returns int
language sql immutable as $$
  select case p_plan when 'gem' then 1 when 'crown' then 2 when 'empire' then 5 when 'stream' then 0 else 5 end;
$$;

-- One account, one shop: a team member can't also open a second shop (keeps every screen showing one shop).
drop policy if exists shops_insert on public.shops;
create policy shops_insert on public.shops for insert with check (created_by = auth.uid() and not public.in_any_shop());

create table if not exists public.shop_invites (
  code text primary key,
  shop_id uuid not null references public.shops(id) on delete cascade,
  name text check (name is null or length(name) <= 80),
  created_by uuid not null default auth.uid() references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  used_by uuid references auth.users(id) on delete set null,
  used_at timestamptz
);
create index if not exists shop_invites_shop_idx on public.shop_invites(shop_id);
alter table public.shop_invites enable row level security;
drop policy if exists shop_invites_owner on public.shop_invites;
create policy shop_invites_owner on public.shop_invites for select to authenticated using (public.is_shop_owner(shop_id));
revoke all on public.shop_invites from anon, authenticated;
grant select on public.shop_invites to authenticated;
grant all on public.shop_invites to service_role;

create or replace function public.team_seats_used(p_shop uuid) returns int
language sql stable security definer set search_path = public as $$
  select (select count(*) from public.shop_members where shop_id = p_shop and role = 'staff')::int
       + (select count(*) from public.shop_invites where shop_id = p_shop and used_by is null and expires_at > now())::int;
$$;

-- Owner: make a one-time invite code (good for 7 days).
create or replace function public.create_team_invite(p_name text default null) returns text
language plpgsql security definer set search_path = public as $$
declare v_shop uuid; v_plan text; v_code text; alphabet text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; i int;
begin
  select m.shop_id, s.plan into v_shop, v_plan from public.shop_members m join public.shops s on s.id = m.shop_id
   where m.user_id = auth.uid() and m.role = 'owner' order by m.created_at limit 1;
  if v_shop is null then raise exception 'Only the shop owner can add team members'; end if;
  if public.team_seats_used(v_shop) >= public.team_limit(v_plan) then
    raise exception 'Your plan includes % team member%. Remove one or upgrade to add more.', public.team_limit(v_plan), case when public.team_limit(v_plan) = 1 then '' else 's' end;
  end if;
  loop
    v_code := '';
    for i in 1..8 loop v_code := v_code || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1); end loop;
    exit when not exists (select 1 from public.shop_invites where code = v_code);
  end loop;
  insert into public.shop_invites(code, shop_id, name) values (v_code, v_shop, nullif(trim(p_name), ''));
  return v_code;
end $$;

create or replace function public.cancel_team_invite(p_code text) returns void
language plpgsql security definer set search_path = public as $$
begin
  delete from public.shop_invites where code = upper(trim(p_code)) and used_by is null and public.is_shop_owner(shop_id);
end $$;

-- New team member: join with the code. Leaves the community calendar (that's for sellers).
create or replace function public.join_team(p_code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare inv record; v_plan text;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if public.in_any_shop() then raise exception 'This account already belongs to a shop. Team members need their own sign-in.'; end if;
  select * into inv from public.shop_invites where code = upper(regexp_replace(p_code, '[^A-Za-z0-9]', '', 'g')) for update;
  if inv is null or inv.used_by is not null or inv.expires_at < now() then
    raise exception 'That invite code was not found or has expired. Ask the shop owner for a new one.';
  end if;
  update public.shop_invites set used_by = auth.uid(), used_at = now() where code = inv.code;
  insert into public.shop_members(shop_id, user_id, role) values (inv.shop_id, auth.uid(), 'staff');
  delete from public.stage_members sm where sm.user_id = auth.uid() and sm.role = 'seller'
    and not exists (select 1 from public.live_slots s where s.stage_id = sm.stage_id and s.user_id = auth.uid() and s.status <> 'cancelled');
  return inv.shop_id;
end $$;

-- The owner's team list, with names and sign-in emails.
create or replace function public.team_members() returns table (user_id uuid, role text, display_name text, email text, joined_at timestamptz)
language sql stable security definer set search_path = public as $$
  select m.user_id, m.role, coalesce(p.display_name, 'Team member'), coalesce(p.email, u.email), m.created_at
  from public.shop_members m
  left join public.profiles p on p.user_id = m.user_id
  left join auth.users u on u.id = m.user_id
  where public.is_shop_owner(m.shop_id)
  order by m.role, m.created_at;
$$;

-- Owner removes a team member, or a team member leaves. The shop owner can't be removed.
create or replace function public.remove_team_member(p_user uuid) returns void
language plpgsql security definer set search_path = public as $$
declare v_shop uuid;
begin
  select shop_id into v_shop from public.shop_members where user_id = p_user and role = 'staff'
    and (public.is_shop_owner(shop_id) or p_user = auth.uid()) limit 1;
  if v_shop is null then
    if exists (select 1 from public.shop_members where user_id = p_user and role = 'owner') then raise exception 'The shop owner can''t be removed'; end if;
    raise exception 'Only the shop owner can remove team members';
  end if;
  delete from public.shop_members where shop_id = v_shop and user_id = p_user and role = 'staff';
end $$;

-- Seller-only extras: the community calendar, booking Shared Page lives, and live class seats.
create or replace function public.join_open_stages() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null or public.is_team_only() then return; end if;
  insert into public.stage_members(stage_id, user_id, shop_id, display_name)
  select st.id, auth.uid(),
         (select shop_id from public.shop_members where user_id = auth.uid() order by created_at limit 1),
         public.my_name()
  from public.stages st where st.open_to_all
  on conflict (stage_id, user_id) do nothing;
end $$;

create or replace function public.join_stage(p_code text) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_stage uuid; v_shop uuid;
begin
  if auth.uid() is null then raise exception 'Please sign in first'; end if;
  if public.is_team_only() then raise exception 'Shared Pages are for shop owners. Ask your shop owner to book the live.'; end if;
  select id into v_stage from public.stages where invite_code = upper(trim(p_code));
  if v_stage is null then raise exception 'That invite code was not found'; end if;
  select m.shop_id into v_shop from public.shop_members m where m.user_id = auth.uid() order by m.created_at limit 1;
  insert into public.stage_members(stage_id, user_id, shop_id, display_name)
  values (v_stage, auth.uid(), v_shop, public.my_name())
  on conflict (stage_id, user_id) do nothing;
  return v_stage;
end $$;

drop policy if exists live_slots_insert on public.live_slots;
create policy live_slots_insert on public.live_slots for insert with check (public.is_stage_member(stage_id) and not public.is_team_only());

drop policy if exists class_signups_own_insert on public.class_signups;
create policy class_signups_own_insert on public.class_signups for insert to authenticated
  with check (user_id = auth.uid() and class_date >= current_date and not public.is_team_only());

-- A booked slot can only link one of the seller's own lives.
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
  if new.live_id is not null and not exists (select 1 from public.lives l where l.id = new.live_id and l.shop_id = m.shop_id) then
    new.live_id := null;
  end if;
  new.featured := null;
  return new;
end $$;

grant execute on function public.is_shop_owner(uuid), public.is_team_only(), public.in_any_shop(), public.team_limit(text),
  public.team_seats_used(uuid), public.create_team_invite(text), public.cancel_team_invite(text), public.join_team(text),
  public.team_members(), public.remove_team_member(uuid), public.join_open_stages(), public.join_stage(text) to authenticated;
revoke execute on function public.create_team_invite(text), public.cancel_team_invite(text), public.join_team(text),
  public.team_members(), public.remove_team_member(uuid), public.team_seats_used(uuid) from anon;
grant usage on schema public to service_role;

notify pgrst, 'reload schema';
