-- Lessons: each person's progress through the in-app trainings (like SCORM tracking).
create table if not exists public.lesson_progress (
  shop_id uuid not null references public.shops(id) on delete cascade,
  user_id uuid not null default auth.uid(),
  lesson_id text not null,
  step int not null default 0,
  score int,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (shop_id, user_id, lesson_id)
);
alter table public.lesson_progress enable row level security;
drop policy if exists lesson_progress_all on public.lesson_progress;
create policy lesson_progress_all on public.lesson_progress for all
  using (public.is_shop_member(shop_id)) with check (public.is_shop_member(shop_id) and user_id = auth.uid());
notify pgrst, 'reload schema';
