-- Customers, orders from live sales, and picking.
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  name text not null,
  handle text,
  email text,
  phone text,
  address1 text, address2 text, city text, state text, zip text, country text,
  created_at timestamptz not null default now()
);
create index if not exists customers_lookup_idx on public.customers(shop_id, lower(email), lower(handle), lower(name));

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  code text not null,                       -- unique order ID printed on the box label, e.g. DD-7K3P9Q
  customer_id uuid references public.customers(id) on delete set null,
  external_ref text,                        -- order or invoice number from the live-sale bot, if any
  live_date date,
  source text default 'live',
  status text not null default 'open' check (status in ('open','picking','packed','shipped','cancelled')),
  total numeric(10,2),
  tracking text,
  carrier text,
  upload_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (code)
);
create index if not exists orders_shop_status_idx on public.orders(shop_id, status);

create table if not exists public.order_lines (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid references public.variants(id) on delete set null,
  live_number text,
  description text,
  qty int not null default 1 check (qty > 0),
  price numeric(10,2),
  picked int not null default 0,
  short int not null default 0,             -- could not be found / out of stock
  created_at timestamptz not null default now()
);
create index if not exists order_lines_order_idx on public.order_lines(order_id);

alter table public.units add column if not exists order_id uuid references public.orders(id) on delete set null;
alter table public.units add column if not exists order_line_id uuid references public.order_lines(id) on delete set null;

-- Unique, easy-to-read order IDs (no 0/O or 1/I).
create or replace function public.assign_order_code() returns trigger
language plpgsql security definer set search_path = public as $$
declare alphabet text := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; c text; i int;
begin
  if new.code is not null and new.code <> '' then return new; end if;
  loop
    c := 'DD-';
    for i in 1..6 loop c := c || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1); end loop;
    exit when not exists (select 1 from public.orders where code = c);
  end loop;
  new.code := c;
  return new;
end $$;
drop trigger if exists orders_code on public.orders;
create trigger orders_code before insert on public.orders for each row execute function public.assign_order_code();

alter table public.customers enable row level security;
alter table public.orders enable row level security;
alter table public.order_lines enable row level security;
do $$
declare t text;
begin
  foreach t in array array['customers','orders','order_lines'] loop
    execute format('drop policy if exists %I_all on public.%I', t, t);
    execute format('create policy %I_all on public.%I for all using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id))', t, t);
  end loop;
end $$;

grant select, insert, update, delete on public.customers, public.orders, public.order_lines to authenticated;
notify pgrst, 'reload schema';
