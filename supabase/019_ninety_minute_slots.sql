-- Shared Page lives are now booked in 1.5-hour (90-minute) slots. The Queen's decision, Nov 2026.
-- Run once in Supabase: SQL Editor -> New query -> paste all of this -> Run. Safe to run twice.
-- Needs 010 first. Nothing is deleted: bookings made before this keep their old times.
--
-- 1. Slots may now start on the hour or the half hour (7:00, 7:30, 8:00 ...), not only on the hour.
-- 2. Every NEW booking (or a booking whose times are changed) must be exactly 90 minutes.
--    Existing 1-hour bookings stay as they are and still run normally.

-- ---------- 1. Swap the whole-hour rule for a half-hour rule ----------
do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.live_slots'::regclass and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%date_trunc%'
  loop
    execute format('alter table public.live_slots drop constraint %I', c.conname);
  end loop;
end $$;

alter table public.live_slots drop constraint if exists live_slots_half_hour;
alter table public.live_slots add constraint live_slots_half_hour check (
  extract(epoch from starts_at)::bigint % 1800 = 0 and extract(epoch from ends_at)::bigint % 1800 = 0
);

-- ---------- 2. New bookings are exactly 1.5 hours ----------
create or replace function public.live_slots_ninety_minutes() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' or new.starts_at is distinct from old.starts_at or new.ends_at is distinct from old.ends_at then
    if new.ends_at - new.starts_at <> interval '90 minutes' then
      raise exception 'live_slots_90_min: shared Page lives are booked in 1.5-hour slots';
    end if;
  end if;
  return new;
end $$;

drop trigger if exists live_slots_ninety_minutes on public.live_slots;
create trigger live_slots_ninety_minutes before insert or update on public.live_slots
  for each row execute function public.live_slots_ninety_minutes();

-- Planned lives default to 1.5 hours too.
alter table public.lives alter column duration_min set default 90;
