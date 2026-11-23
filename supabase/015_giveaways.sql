-- Live giveaways (spin wheel, lucky number, countdown, mystery boxes) on stream.
-- The seller runs the giveaway from the Giveaways screen; this keeps one "show" per person so the
-- private overlay link from 012 (the same one used for the product card) can pop it up on stream.
-- Needs 012_live_overlay.sql first. Run once in Supabase: SQL Editor -> New query -> paste all -> Run.

create table if not exists public.giveaway_shows (
  user_id uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.giveaway_shows enable row level security;
revoke all on public.giveaway_shows from anon, authenticated;
grant all on public.giveaway_shows to service_role;

-- Save my giveaway. Stamps the server time so a second screen (OBS on another computer) can line
-- its clock up with the seller's phone and land the wheel on the same slice.
create or replace function public.set_giveaway(p_state jsonb) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'Please sign in'; end if;
  if pg_column_size(p_state) > 200000 then raise exception 'That giveaway is too big to show'; end if;
  insert into public.giveaway_shows(user_id, state, updated_at)
  values (auth.uid(), p_state || jsonb_build_object('saved_at', floor(extract(epoch from clock_timestamp()) * 1000)), now())
  on conflict (user_id) do update set state = excluded.state, updated_at = now();
end $$;

-- What the overlay shows. Anyone with the private overlay link can read only this seller's
-- current giveaway, and only if it was touched in the last 12 hours.
create or replace function public.giveaway_state(p_token text) returns jsonb
language sql stable security definer set search_path = public as $$
  select g.state || jsonb_build_object('server_now', floor(extract(epoch from clock_timestamp()) * 1000))
  from public.overlay_links o
  join public.giveaway_shows g on g.user_id = o.user_id
  where o.token = p_token and length(p_token) >= 32
    and g.updated_at > now() - interval '12 hours'
  limit 1;
$$;

grant execute on function public.set_giveaway(jsonb) to authenticated;
grant execute on function public.giveaway_state(text) to anon, authenticated;
notify pgrst, 'reload schema';
