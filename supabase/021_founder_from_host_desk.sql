-- Makes the Host desk's "Free for you and your team" use the Founder plan from 020_founder_plan.sql.
-- Run once in Supabase after BOTH 020 files: SQL Editor -> New query -> paste all -> Run. Safe to run twice.
--
-- Why: 020_host_desk gave free access by setting a shop's plan to null, but 020_founder_plan made plan
-- required and named the free-forever plan 'founder'. Without this, adding someone on the Host desk fails.
-- After this: the Queen and her hosts (community calendar hosts) can move a shop onto or off Founder from the
-- Host desk; the platform owner can still do it in the SQL editor; sellers and billing still can't.

-- 1. Plan guard: Founder changes are allowed for the platform owner and for community calendar hosts.
create or replace function public.guard_shop_plan() returns trigger language plpgsql as $$
declare
  jwt_role text := coalesce(current_setting('request.jwt.claims', true)::json->>'role', '');
  is_owner boolean := current_user in ('postgres', 'supabase_admin') and jwt_role not in ('anon', 'authenticated', 'service_role');
  is_service boolean := is_owner or jwt_role = 'service_role';
  is_host boolean := jwt_role = 'authenticated' and public.is_any_host();
begin
  if tg_op = 'INSERT' then
    if not is_service then new.plan := 'stream'; end if;
    if new.plan = 'founder' and not is_owner then new.plan := 'stream'; end if;
  elsif new.plan is distinct from old.plan then
    if new.plan = 'founder' or old.plan = 'founder' then
      if not (is_owner or is_host) then raise exception 'Founder shops are set by the Queen and her hosts only'; end if;
    elsif not is_service then
      raise exception 'Plans can only be changed through billing';
    end if;
  end if;
  return new;
end $$;

-- 2. Host desk list: shops on Founder.
create or replace function public.free_access_list()
returns table (shop_id uuid, shop_name text, owner_email text)
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_any_host() then raise exception 'Only the Queen and her hosts can see this list.'; end if;
  return query
    select s.id, s.name::text, u.email::text
    from public.shops s
    join public.shop_members m on m.shop_id = s.id and m.role = 'owner'
    join auth.users u on u.id = m.user_id
    where s.plan = 'founder'
    order by s.name;
end $$;

-- 3. Host desk add/remove: on = Founder, off = free Stream plan.
create or replace function public.set_free_access(p_email text, p_on boolean) returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  if not public.is_any_host() then raise exception 'Only the Queen and her hosts can give free access.'; end if;
  if coalesce(trim(p_email), '') = '' then raise exception 'Type her sign-in email.'; end if;
  if not p_on and exists (
    select 1 from public.shop_members m join auth.users u on u.id = m.user_id
    where m.user_id = auth.uid() and m.role = 'owner' and lower(u.email) = lower(trim(p_email))
  ) then raise exception 'You can''t remove free access from your own shop.'; end if;
  update public.shops s set plan = case when p_on then 'founder' else 'stream' end
  where s.id in (select m.shop_id from public.shop_members m join auth.users u on u.id = m.user_id
                 where m.role = 'owner' and lower(u.email) = lower(trim(p_email)));
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.free_access_list() from public, anon;
grant execute on function public.free_access_list() to authenticated;
revoke all on function public.set_free_access(text, boolean) from public, anon;
grant execute on function public.set_free_access(text, boolean) to authenticated;

notify pgrst, 'reload schema';

-- Check: the Founder shops (both Basement shops should be listed).
select name, plan from public.shops order by created_at;
