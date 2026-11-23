-- Comment bot: every phone and laptop watching the same live sees new claims the moment they happen.
do $$ begin
  alter publication supabase_realtime add table public.live_claims;
exception when others then null; end $$;
notify pgrst, 'reload schema';
