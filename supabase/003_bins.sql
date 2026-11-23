-- Warehouse addressing: aisle (number), section (number), level (letter), bin (number).
-- A bin holds many different items. Code example: A3-S2-C-01
alter table public.locations add column if not exists aisle int;
alter table public.locations add column if not exists section int;
alter table public.locations add column if not exists level text;
alter table public.locations add column if not exists bin_no int;
create index if not exists locations_addr_idx on public.locations(shop_id, aisle, section, level, bin_no);
notify pgrst, 'reload schema';
