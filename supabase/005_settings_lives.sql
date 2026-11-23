-- Shop settings (customizable lists), item tags, and planned lives with their item lists.
alter table public.shops add column if not exists settings jsonb not null default '{}'::jsonb;
alter table public.items add column if not exists tags text[] not null default '{}';

drop policy if exists shops_update on public.shops;
create policy shops_update on public.shops for update using (public.is_shop_member(id)) with check (public.is_shop_member(id));
grant update on public.shops to authenticated;

create table if not exists public.lives (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  title text not null,
  theme text,
  starts_at timestamptz not null,
  duration_min int not null default 120 check (duration_min > 0),
  host text,
  notes text,
  status text not null default 'planned' check (status in ('planned','done','cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists lives_shop_start_idx on public.lives(shop_id, starts_at);

create table if not exists public.live_items (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  live_id uuid not null references public.lives(id) on delete cascade,
  variant_id uuid not null references public.variants(id) on delete cascade,
  qty int not null default 1 check (qty > 0),
  sale_price numeric(10,2),
  sort int not null default 0,
  created_at timestamptz not null default now(),
  unique (live_id, variant_id)
);
create index if not exists live_items_live_idx on public.live_items(live_id);

alter table public.orders add column if not exists live_id uuid references public.lives(id) on delete set null;

alter table public.lives enable row level security;
alter table public.live_items enable row level security;
do $$
declare t text;
begin
  foreach t in array array['lives','live_items'] loop
    execute format('drop policy if exists %I_all on public.%I', t, t);
    execute format('create policy %I_all on public.%I for all using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id))', t, t);
  end loop;
end $$;

grant select, insert, update, delete on public.lives, public.live_items to authenticated;
notify pgrst, 'reload schema';
