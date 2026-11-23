// Shared Page timer. Runs every 15 seconds (see supabase/011_slot_timer.sql) and can also be
// poked by the app at the exact start or stop second. Each run only does what the schedule says
// is due, and every step "claims" the slot first, so running it twice at once is harmless.
//
//   booked    -> (start time)          create the Facebook live, store its stream key               -> live
//                (or prep_min early)   create a hidden preview instead                               -> ready -> live at start
//   live      -> (video arrives)       record went_live_at
//   any       -> (start + late_cancel_min, no video yet) delete the live                         -> missed
//   ready/live-> (stop time)          end the live on Facebook                                      -> ended / missed
//   cancelled -> clean up any unused Facebook live
//
// Deploy with "Verify JWT" OFF. Needs no secrets beyond the built-in SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY.
import { createClient } from 'npm:@supabase/supabase-js@2'

const GRAPH = 'https://graph.facebook.com/v21.0'
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }

type Slot = {
  id: string; stage_id: string; user_id: string; title: string; seller_name: string
  starts_at: string; ends_at: string; status: string; fb_live_video_id: string | null; went_live_at: string | null
  stage: { name: string; fb_page_id: string | null; prep_min: number; late_cancel_min: number } | null
}

async function graph(path: string, params: Record<string, string>, method = 'POST') {
  const res = await fetch(`${GRAPH}/${path}`, { method, body: new URLSearchParams(params) })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.error) throw new Error(json.error?.error_user_msg || json.error?.message || `Facebook error ${res.status}`)
  return json
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
  const now = Date.now()
  const log: string[] = []

  /** Move a slot from one status to another only if nobody else already did. */
  async function claim(id: string, from: string, to: string) {
    const { data } = await db.from('live_slots').update({ status: to }).eq('id', id).eq('status', from).select('id')
    return (data ?? []).length === 1
  }
  const set = (id: string, patch: Record<string, unknown>) => db.from('live_slots').update(patch).eq('id', id)

  const tokens = new Map<string, string | null>()
  async function pageToken(stageId: string) {
    if (!tokens.has(stageId)) {
      const { data } = await db.from('stage_page_tokens').select('page_token').eq('stage_id', stageId).maybeSingle()
      tokens.set(stageId, data?.page_token ?? null)
    }
    return tokens.get(stageId)!
  }

  const { data, error } = await db.from('live_slots')
    .select('id,stage_id,user_id,title,seller_name,starts_at,ends_at,status,fb_live_video_id,went_live_at, stage:stages(name,fb_page_id,prep_min,late_cancel_min)')
    .in('status', ['booked', 'preparing', 'ready', 'live', 'ending', 'cancelled'])
    .lte('starts_at', new Date(now + 61 * 60000).toISOString())
    .gte('ends_at', new Date(now - 24 * 3600000).toISOString())
    .order('ends_at')
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: cors })

  const slots = (data ?? []) as unknown as Slot[]
  // Stops first, so the next seller's start never collides with the last seller's live.
  const stops = slots.filter(s => (s.status === 'ready' || s.status === 'live') && Date.parse(s.ends_at) <= now)
  const rest = slots.filter(s => !stops.includes(s))

  for (const s of stops) {
    const from = s.status
    if (!(await claim(s.id, from, 'ending'))) continue
    const token = await pageToken(s.stage_id)
    try {
      if (s.fb_live_video_id && token) {
        if (s.went_live_at) await graph(s.fb_live_video_id, { end_live_video: 'true', access_token: token })
        else await graph(`${s.fb_live_video_id}?access_token=${encodeURIComponent(token)}`, {}, 'DELETE').catch(() => null)
      }
      await set(s.id, { status: s.went_live_at ? 'ended' : 'missed', ended_at: new Date().toISOString(), last_error: null })
      await db.from('live_slot_keys').delete().eq('slot_id', s.id)
      log.push(`stopped ${s.id}`)
    } catch (e) {
      await set(s.id, { status: from, last_error: `Could not end the live: ${(e as Error).message}` })
    }
  }

  for (const s of rest) {
    const start = Date.parse(s.starts_at), end = Date.parse(s.ends_at)
    const token = await pageToken(s.stage_id)

    if (s.status === 'cancelled') {
      if (s.fb_live_video_id && token) await graph(`${s.fb_live_video_id}?access_token=${encodeURIComponent(token)}`, {}, 'DELETE').catch(() => null)
      if (s.fb_live_video_id) await set(s.id, { fb_live_video_id: null })
      await db.from('live_slot_keys').delete().eq('slot_id', s.id)
      continue
    }

    if (s.status === 'booked' && end <= now) {
      if (await claim(s.id, 'booked', 'missed')) log.push(`missed ${s.id}`)
      continue
    }

    if (s.status === 'preparing' && start - now < -5 * 60000) {
      // A run died halfway through; let the next run try again.
      await claim(s.id, 'preparing', 'booked')
      continue
    }

    // House rule: more than N minutes late (not streaming) = live canceled.
    const late = (s.stage?.late_cancel_min ?? 10) * 60000
    if (['booked', 'ready', 'live'].includes(s.status) && !s.went_live_at && now >= start + late && end > now) {
      if (!(await claim(s.id, s.status, 'missed'))) continue
      if (s.fb_live_video_id && token) await graph(`${s.fb_live_video_id}?access_token=${encodeURIComponent(token)}`, {}, 'DELETE').catch(() => null)
      await set(s.id, { ended_at: new Date().toISOString(), last_error: `Live canceled: not streaming ${s.stage?.late_cancel_min ?? 10} minutes after the start time.` })
      await db.from('live_slot_keys').delete().eq('slot_id', s.id)
      log.push(`late ${s.id}`)
      continue
    }

    // Make the stream key. Default (prep_min 0): exactly at the start time, as a public live
    // that shows as soon as the seller's video arrives. With prep_min > 0: a hidden preview first.
    if (s.status === 'booked' && start - (s.stage?.prep_min ?? 0) * 60000 <= now) {
      if (!token || !s.stage?.fb_page_id) { await set(s.id, { last_error: 'The Facebook Page is not connected yet. A host needs to connect it.' }); continue }
      if (!(await claim(s.id, 'booked', 'preparing'))) continue
      const atStart = now >= start
      try {
        const live = await graph(`${s.stage.fb_page_id}/live_videos`, {
          status: atStart ? 'LIVE_NOW' : 'UNPUBLISHED',
          title: `${s.title} with ${s.seller_name}`.slice(0, 250),
          description: `${s.title} · ${s.seller_name} is live on ${s.stage.name}!`,
          access_token: token,
        })
        let url: string = live.secure_stream_url || live.stream_url
        if (!url) url = (await graph(`${live.id}?fields=secure_stream_url,stream_url&access_token=${encodeURIComponent(token)}`, {}, 'GET')).secure_stream_url
        await db.from('live_slot_keys').upsert({ slot_id: s.id, stage_id: s.stage_id, user_id: s.user_id, stream_url: url })
        await set(s.id, { status: atStart ? 'live' : 'ready', fb_live_video_id: live.id, last_error: null })
        log.push(`${atStart ? 'live' : 'ready'} ${s.id}`)
      } catch (e) {
        await set(s.id, { status: 'booked', last_error: `Could not make the stream key: ${(e as Error).message}` })
      }
      continue
    }

    // Preview mode only: flip the hidden preview to public at the start time.
    if (s.status === 'ready' && start <= now && end > now && s.fb_live_video_id && token) {
      try {
        await graph(s.fb_live_video_id, { status: 'LIVE_NOW', access_token: token })
        await claim(s.id, 'ready', 'live')
        log.push(`live ${s.id}`)
      } catch (e) {
        await set(s.id, { last_error: `Not live yet: ${(e as Error).message}` })
      }
      continue
    }

    // Watch for the seller's video actually arriving (this is what the late rule checks).
    if (s.status === 'live' && !s.went_live_at && s.fb_live_video_id && token && end > now) {
      try {
        const v = await graph(`${s.fb_live_video_id}?fields=status,broadcast_start_time&access_token=${encodeURIComponent(token)}`, {}, 'GET')
        if (v.broadcast_start_time || v.status === 'LIVE') { await set(s.id, { went_live_at: v.broadcast_start_time ?? new Date().toISOString(), last_error: null }); log.push(`streaming ${s.id}`) }
        else await set(s.id, { last_error: 'Waiting for your video. Start streaming in your app.' })
      } catch { /* try again next run */ }
    }
  }

  return new Response(JSON.stringify({ ok: true, did: log }), { headers: { ...cors, 'Content-Type': 'application/json' } })
})
