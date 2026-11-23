-- Live Planner: theme, ideas, inspiration, poster and checklist live on each live as one JSON plan.
alter table public.lives add column if not exists plan jsonb not null default '{}'::jsonb;
notify pgrst, 'reload schema';
