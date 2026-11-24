-- Live class sign-ups (Dazzle University: Monday implementation meeting, Wednesday How to go Live).
-- A seller saves a seat for one date and time; hosts of any shared Page see everyone who's coming.
-- Needs 010_shared_page_slots.sql first. Run once in Supabase: SQL Editor -> New query -> paste all -> Run.

create table if not exists public.class_signups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  shop_id uuid,
  class_id text not null check (length(class_id) <= 40),
  session_label text not null check (session_label in ('Daytime', 'Evening')),
  class_date date not null,
  name text not null check (length(name) between 1 and 120),
  email text check (email is null or length(email) <= 200),
  phone text check (phone is null or length(phone) <= 40),
  note text check (note is null or length(note) <= 500),
  created_at timestamptz not null default now(),
  unique (user_id, class_id, class_date, session_label)
);
create index if not exists class_signups_date on public.class_signups (class_date);
alter table public.class_signups enable row level security;
revoke all on public.class_signups from anon;
grant select, insert, delete on public.class_signups to authenticated;

-- Is this person a host of the community calendar (the shared Page everyone joins)?
-- Those hosts run the classes, so they see the full list. Hosts of a seller's own private Page don't count.
create or replace function public.is_any_host() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.stage_members m join public.stages s on s.id = m.stage_id
                 where m.user_id = auth.uid() and m.role = 'host' and s.open_to_all);
$$;
grant execute on function public.is_any_host() to authenticated;

drop policy if exists class_signups_own_insert on public.class_signups;
create policy class_signups_own_insert on public.class_signups for insert to authenticated
  with check (user_id = auth.uid() and class_date >= current_date);

drop policy if exists class_signups_read on public.class_signups;
create policy class_signups_read on public.class_signups for select to authenticated
  using (user_id = auth.uid() or public.is_any_host());

drop policy if exists class_signups_cancel on public.class_signups;
create policy class_signups_cancel on public.class_signups for delete to authenticated
  using (user_id = auth.uid() or public.is_any_host());
