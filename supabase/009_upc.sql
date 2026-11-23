-- UPC / manufacturer barcode per variation, so pickers can scan the product's own barcode.
alter table public.variants add column if not exists upc text;
create index if not exists variants_upc_idx on public.variants (shop_id, upc) where upc is not null;
notify pgrst, 'reload schema';
