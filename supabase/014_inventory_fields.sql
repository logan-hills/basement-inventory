-- Optional details for sorting and filing inventory. Every column is optional:
-- sellers who don't use them never see an empty-field warning.
alter table public.items add column if not exists condition text;      -- New with tags, Gently used, Vintage…
alter table public.items add column if not exists color text;
alter table public.items add column if not exists material text;
alter table public.items add column if not exists department text;     -- Women, Men, Kids, Unisex, Home
alter table public.items add column if not exists supplier text;       -- where it was bought
alter table public.items add column if not exists season text;         -- Spring, Holiday, Back to school…
alter table public.items add column if not exists purchased_on date;   -- when it was bought

alter table public.variants add column if not exists sku text;               -- the seller's own code
alter table public.variants add column if not exists sale_price numeric(10,2); -- printed on yellow sale tags

create index if not exists items_supplier_idx on public.items (shop_id, supplier) where supplier is not null;
notify pgrst, 'reload schema';
