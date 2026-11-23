-- The Basement Inventory: foundation schema
-- Run once in Supabase: SQL Editor -> New query -> paste all of this -> Run.
-- Every table belongs to a "shop" so the app can later serve many sellers.

-- ---------- Shops and members ----------
create table if not exists public.shops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.shop_members (
  shop_id uuid not null references public.shops(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','staff')),
  created_at timestamptz not null default now(),
  primary key (shop_id, user_id)
);

-- Owner becomes a member automatically when a shop is created.
create or replace function public.add_shop_owner() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.shop_members(shop_id, user_id, role) values (new.id, new.created_by, 'owner');
  return new;
end $$;

drop trigger if exists shops_add_owner on public.shops;
create trigger shops_add_owner after insert on public.shops
  for each row execute function public.add_shop_owner();

create or replace function public.is_shop_member(p_shop uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.shop_members where shop_id = p_shop and user_id = auth.uid());
$$;

-- ---------- Warehouse locations ----------
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  code text not null,                 -- printed barcode, e.g. LOC-A1-03
  name text not null,                 -- "Shelf A1, bin 3"
  kind text not null default 'bin' check (kind in ('zone','shelf','bin')),
  parent_id uuid references public.locations(id) on delete set null,
  map_x numeric, map_y numeric, map_w numeric, map_h numeric,  -- 2D map placement
  created_at timestamptz not null default now(),
  unique (shop_id, code)
);

-- ---------- Items, variations, photos ----------
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  name text not null,
  description text,
  category text,
  brand text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.variants (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  label text not null default 'Default',   -- e.g. "Large / Red"
  live_number char(4) not null,             -- unique per shop, shared by all units of this variation
  price numeric(10,2),
  cost numeric(10,2),
  created_at timestamptz not null default now(),
  unique (shop_id, live_number),
  unique (item_id, label)
);

create table if not exists public.item_photos (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  item_id uuid not null references public.items(id) on delete cascade,
  path text not null,                       -- path in the item-photos storage bucket
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- One row per physical tag. Each unit has its own barcode and location.
create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  variant_id uuid not null references public.variants(id) on delete cascade,
  tag_code text not null,                   -- barcode on the tag, e.g. 4821-007
  location_id uuid references public.locations(id) on delete set null,
  status text not null default 'in_stock' check (status in ('in_stock','reserved','picked','packed','shipped','removed')),
  created_at timestamptz not null default now(),
  unique (shop_id, tag_code)
);

create index if not exists units_variant_idx on public.units(variant_id);
create index if not exists units_location_idx on public.units(location_id);

-- Every scan that moves something, for history and undo.
create table if not exists public.movements (
  id bigint generated always as identity primary key,
  shop_id uuid not null references public.shops(id) on delete cascade,
  unit_id uuid references public.units(id) on delete cascade,
  from_location uuid references public.locations(id) on delete set null,
  to_location uuid references public.locations(id) on delete set null,
  action text not null,
  user_id uuid default auth.uid(),
  created_at timestamptz not null default now()
);

-- ---------- Live Number assignment ----------
-- Picks a random unused 4-digit number for the shop when a variation is created without one.
create or replace function public.assign_live_number() returns trigger
language plpgsql security definer set search_path = public as $$
declare candidate char(4); tries int := 0;
begin
  if new.live_number is not null and new.live_number <> '' then return new; end if;
  loop
    candidate := lpad((floor(random() * 10000))::int::text, 4, '0');
    exit when not exists (select 1 from public.variants where shop_id = new.shop_id and live_number = candidate);
    tries := tries + 1;
    if tries > 20000 then raise exception 'All 10,000 Live Numbers are in use for this shop'; end if;
  end loop;
  new.live_number := candidate;
  return new;
end $$;

drop trigger if exists variants_live_number on public.variants;
create trigger variants_live_number before insert on public.variants
  for each row execute function public.assign_live_number();

-- ---------- Security: members only see their own shop ----------
alter table public.shops enable row level security;
alter table public.shop_members enable row level security;
alter table public.locations enable row level security;
alter table public.items enable row level security;
alter table public.variants enable row level security;
alter table public.item_photos enable row level security;
alter table public.units enable row level security;
alter table public.movements enable row level security;

drop policy if exists shops_select on public.shops;
create policy shops_select on public.shops for select using (public.is_shop_member(id) or created_by = auth.uid());
drop policy if exists shops_insert on public.shops;
create policy shops_insert on public.shops for insert with check (created_by = auth.uid());
drop policy if exists shops_update on public.shops;
create policy shops_update on public.shops for update using (public.is_shop_member(id));

drop policy if exists members_select on public.shop_members;
create policy members_select on public.shop_members for select using (public.is_shop_member(shop_id));

do $$
declare t text;
begin
  foreach t in array array['locations','items','variants','item_photos','units','movements'] loop
    execute format('drop policy if exists %I_all on public.%I', t, t);
    execute format('create policy %I_all on public.%I for all using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id))', t, t);
  end loop;
end $$;

-- ---------- Photo storage ----------
insert into storage.buckets (id, name, public) values ('item-photos', 'item-photos', false)
  on conflict (id) do nothing;

-- Photos are stored under <shop_id>/<item_id>/<file>.
drop policy if exists item_photos_rw on storage.objects;
create policy item_photos_rw on storage.objects for all
  using (bucket_id = 'item-photos' and public.is_shop_member(((storage.foldername(name))[1])::uuid))
  with check (bucket_id = 'item-photos' and public.is_shop_member(((storage.foldername(name))[1])::uuid));
