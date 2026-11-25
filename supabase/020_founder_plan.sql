-- Founder plan: Dynamic Dazzle's own shop (LaVerne, the creator) and her team use the whole app free, forever.
-- Run once in Supabase: SQL Editor -> New query -> paste all of this -> Run. Safe to run twice.
-- Needs 008 and 018 first. Nothing is deleted.
--
-- 1. Adds a named 'founder' plan. It unlocks every feature, including Dazzle University, and never bills.
-- 2. Every shop that has no plan yet (only shops opened before plans existed, which means Dynamic Dazzle's
--    own shop) becomes a founder shop. Every shop opened since then is already on a plan, so nobody else moves.
-- 3. From now on a shop always has a plan (new shops still start on the free Stream plan).
-- 4. Only someone signed in to Supabase's SQL editor (the platform owner) can make a shop founder or take
--    founder away. A seller can't do it from the app, and a future billing webhook can't do it either,
--    so a payment mix-up can never downgrade LaVerne's shop or upgrade someone else's to free.
-- 5. Founder shops get 10 team members (Empire gets 5).

-- ---------- 1. Allow the 'founder' plan ----------
do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.shops'::regclass and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%plan%'
  loop
    execute format('alter table public.shops drop constraint %I', c.conname);
  end loop;
end $$;
alter table public.shops add constraint shops_plan_check check (plan in ('stream', 'gem', 'crown', 'empire', 'founder'));

-- ---------- 2. Only the platform owner can grant or remove founder ----------
create or replace function public.guard_shop_plan() returns trigger language plpgsql as $$
declare
  is_owner boolean := current_user in ('postgres', 'supabase_admin')
                      and coalesce(current_setting('request.jwt.claims', true)::json->>'role', '') not in ('anon', 'authenticated', 'service_role');
  is_service boolean := is_owner or coalesce(current_setting('request.jwt.claims', true)::json->>'role', '') = 'service_role';
begin
  if tg_op = 'INSERT' then
    if not is_service then new.plan := 'stream'; end if;
    if new.plan = 'founder' and not is_owner then new.plan := 'stream'; end if;
  elsif new.plan is distinct from old.plan then
    if not is_service then
      raise exception 'Plans can only be changed through billing';
    elsif (new.plan = 'founder' or old.plan = 'founder') and not is_owner then
      raise exception 'Founder shops are set by the platform owner only';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists shops_plan_guard on public.shops;
create trigger shops_plan_guard before insert or update on public.shops for each row execute function public.guard_shop_plan();

-- ---------- 3. Dynamic Dazzle's shop becomes founder; every shop has a plan from now on ----------
update public.shops set plan = 'founder' where plan is null;
alter table public.shops alter column plan set default 'stream';
alter table public.shops alter column plan set not null;

-- ---------- 4. Team size per plan (the owner doesn't count) ----------
create or replace function public.team_limit(p_plan text) returns int
language sql immutable as $$
  select case p_plan when 'stream' then 0 when 'gem' then 1 when 'crown' then 2 when 'empire' then 5
                     when 'founder' then 10 else 0 end;
$$;

notify pgrst, 'reload schema';

-- Check: this lists every shop and its plan. Dynamic Dazzle should say founder; everyone else a paid or stream plan.
select name, plan, created_at from public.shops order by created_at;
