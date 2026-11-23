-- On-stream product card (like Whatnot / Palmstreet): during a slot the seller picks a Live Number
-- and it shows on the bottom of their stream through a web overlay in Prism (or OBS / Larix).
-- Run once in Supabase: SQL Editor -> New query -> paste all of this -> Run.

alter table public.live_slots add column if not exists featured jsonb;

-- Each seller's private overlay link. One per person, reused for every slot they book,
-- so they paste it into Prism once and it keeps working.
create table if not exists public.overlay_links (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  token text not null unique default replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
  created_at timestamptz not null default now()
);
alter table public.overlay_links enable row level security;
revoke all on public.overlay_links from anon, authenticated;
grant all on public.overlay_links to service_role;

create or replace function public.my_overlay_token() returns text
language plpgsql security definer set search_path = public as $$
declare t text;
begin
  if auth.uid() is null then return null; end if;
  insert into public.overlay_links(user_id) values (auth.uid()) on conflict (user_id) do nothing;
  select token into t from public.overlay_links where user_id = auth.uid();
  return t;
end $$;

-- Make a new link (if the old one was shared by mistake).
create or replace function public.reset_overlay_token() returns text
language plpgsql security definer set search_path = public as $$
begin
  delete from public.overlay_links where user_id = auth.uid();
  return public.my_overlay_token();
end $$;

-- The slot's seller shows (or clears, with null) the product card.
create or replace function public.set_featured(p_slot uuid, p_featured jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.live_slots
     set featured = case when p_featured is null then null else p_featured || jsonb_build_object('at', now()) end
   where id = p_slot and user_id = auth.uid() and status not in ('cancelled','ended','missed');
  if not found then raise exception 'You can only show products during your own slot'; end if;
end $$;

-- What the overlay shows: the seller's current (or next) slot today. Anyone with the private
-- overlay link can read only this, and only while that seller has a slot within the hour.
create or replace function public.overlay_state(p_token text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object('featured', s.featured, 'title', s.title, 'seller', s.seller_name,
                            'status', s.status, 'starts_at', s.starts_at, 'ends_at', s.ends_at)
  from public.overlay_links o
  join public.live_slots s on s.user_id = o.user_id
  where o.token = p_token and length(p_token) >= 32
    and s.status not in ('cancelled','missed')
    and s.starts_at <= now() + interval '1 hour' and s.ends_at > now() - interval '10 minutes'
  order by s.starts_at
  limit 1;
$$;

grant execute on function public.set_featured(uuid, jsonb), public.my_overlay_token(), public.reset_overlay_token() to authenticated;
grant execute on function public.overlay_state(text) to anon, authenticated;
notify pgrst, 'reload schema';
