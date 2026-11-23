-- Damage-out details and optional per-item weight.
alter table public.variants add column if not exists weight_lb numeric(8,3);

alter table public.units add column if not exists removed_reason text;
alter table public.units add column if not exists removed_note text;
alter table public.units add column if not exists removed_at timestamptz;

create index if not exists units_status_idx on public.units(shop_id, status);
