-- Shared Page timer: every 15 seconds, ask the "live-slots-tick" Edge Function to
-- make stream keys, start slots on time, and end them at their hard stop.
-- Run once, AFTER the live-slots-tick Edge Function is deployed (with "Verify JWT" turned off).
-- The function only acts on what the schedule says is due, so it needs no secret.

create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.unschedule('live-slots-tick') where exists (select 1 from cron.job where jobname = 'live-slots-tick');

select cron.schedule(
  'live-slots-tick',
  '15 seconds',
  $$ select net.http_post(
       url := 'https://wmtqtprbgogeyjpaoauv.supabase.co/functions/v1/live-slots-tick',
       headers := '{"Content-Type": "application/json"}'::jsonb,
       body := '{}'::jsonb,
       timeout_milliseconds := 20000
     ) $$
);
