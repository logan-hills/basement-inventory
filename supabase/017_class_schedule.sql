-- Live class schedule the Queen (a host of the community calendar) can change from the app:
-- which day each class meets, its daytime and evening times, and dates with no class.
-- Classes with no row here use the defaults in src/lessons/classes.ts.
-- Needs 016_class_signups.sql first. Run once in Supabase: SQL Editor -> New query -> paste all -> Run.

-- Only hosts of the community calendar (the shared Page everyone joins) run the classes.
create or replace function public.is_any_host() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.stage_members m join public.stages s on s.id = m.stage_id
                 where m.user_id = auth.uid() and m.role = 'host' and s.open_to_all);
$$;
grant execute on function public.is_any_host() to authenticated;

create table if not exists public.class_schedule (
  class_id text primary key check (length(class_id) <= 40),
  weekday smallint not null check (weekday between 0 and 6),
  day_time text not null check (day_time ~ '^(1[0-2]|[1-9]):[0-5][0-9] (AM|PM)$'),
  evening_time text not null check (evening_time ~ '^(1[0-2]|[1-9]):[0-5][0-9] (AM|PM)$'),
  skip_dates date[] not null default '{}' check (cardinality(skip_dates) <= 60),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users(id) on delete set null
);
alter table public.class_schedule enable row level security;
revoke all on public.class_schedule from anon;
grant select, insert, update on public.class_schedule to authenticated;

drop policy if exists class_schedule_read on public.class_schedule;
create policy class_schedule_read on public.class_schedule for select to authenticated using (true);

drop policy if exists class_schedule_host_insert on public.class_schedule;
create policy class_schedule_host_insert on public.class_schedule for insert to authenticated
  with check (public.is_any_host());

drop policy if exists class_schedule_host_update on public.class_schedule;
create policy class_schedule_host_update on public.class_schedule for update to authenticated
  using (public.is_any_host()) with check (public.is_any_host());
