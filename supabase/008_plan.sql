-- Subscription plan per shop: stream (free), gem, crown, empire.
-- Null = founder / full access (shops that existed before plans). New shops start on stream.
alter table public.shops add column if not exists plan text check (plan in ('stream', 'gem', 'crown', 'empire'));

-- Only the server (service role, e.g. billing webhooks) may set or change a plan.
create or replace function public.guard_shop_plan() returns trigger language plpgsql as $$
declare is_service boolean := coalesce(current_setting('request.jwt.claims', true)::json->>'role', '') = 'service_role'
                             or current_user in ('postgres', 'supabase_admin');
begin
  if tg_op = 'INSERT' then
    if not is_service then new.plan := 'stream'; end if;
  elsif new.plan is distinct from old.plan and not is_service then
    raise exception 'Plans can only be changed through billing';
  end if;
  return new;
end $$;
drop trigger if exists shops_plan_guard on public.shops;
create trigger shops_plan_guard before insert or update on public.shops for each row execute function public.guard_shop_plan();
notify pgrst, 'reload schema';
