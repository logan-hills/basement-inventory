-- Live comment bot: every claim read from Facebook Live comments (or typed in by hand), with who claimed it and when.
-- Who gets each item is worked out in the app, first come first served, so dropping a claim moves the next person up.
create table if not exists public.live_claims (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops(id) on delete cascade,
  live_id uuid not null references public.lives(id) on delete cascade,
  fb_video_id text,                         -- the Facebook live video the comment came from
  comment_id text,                          -- Facebook's comment id; stops the same comment counting twice
  comment_text text,
  commented_at timestamptz not null default now(),
  buyer_fb_id text,                         -- Facebook's id for the commenter (stays the same if they change their name)
  buyer_name text not null,
  live_number text not null,
  variant_id uuid references public.variants(id) on delete set null,
  qty int not null default 1 check (qty > 0),
  state text not null default 'active' check (state in ('active','cancelled')),
  source text not null default 'facebook' check (source in ('facebook','manual','practice')),
  order_id uuid references public.orders(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists live_claims_live_idx on public.live_claims(live_id, commented_at);
-- One comment can claim several Live #s, so the comment id is unique per Live #.
create unique index if not exists live_claims_comment_idx on public.live_claims(shop_id, comment_id, live_number) where comment_id is not null;

-- Remember each buyer's Facebook id so their next order finds them even if their name changes.
alter table public.customers add column if not exists facebook_id text;
create index if not exists customers_facebook_idx on public.customers(shop_id, facebook_id);

alter table public.live_claims enable row level security;
drop policy if exists live_claims_all on public.live_claims;
create policy live_claims_all on public.live_claims for all using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id));
grant select, insert, update, delete on public.live_claims to authenticated;
notify pgrst, 'reload schema';
