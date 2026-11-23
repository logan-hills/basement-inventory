// Live comments for ONE slot, for the seller who owns it (or a host). The Page token stays here.
// Body: { live_slot_id, since?: ISO time }
//   -> { comments: [{ id, message, created_time, from: { id, name } }], status, fb_live_video_id }
// Works from when the slot's stream key is made until 30 minutes after it ends.
import { createClient } from 'npm:@supabase/supabase-js@2'

const GRAPH = 'https://graph.facebook.com/v21.0'
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const asUser = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } })
    const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: u } = await asUser.auth.getUser()
    if (!u.user) return reply({ error: 'Please sign in first' }, 401)

    const { live_slot_id, since } = await req.json().catch(() => ({}))
    const { data: slot } = await admin.from('live_slots').select('id,stage_id,user_id,status,ends_at,fb_live_video_id').eq('id', live_slot_id).maybeSingle()
    if (!slot) return reply({ error: 'Slot not found' }, 404)
    if (slot.user_id !== u.user.id) {
      const { data: isHost } = await asUser.rpc('is_stage_host', { p_stage: slot.stage_id })
      if (!isHost) return reply({ error: 'Only the seller of this slot can read its comments' }, 403)
    }
    const fresh = Date.parse(slot.ends_at) > Date.now() - 30 * 60000
    if (!slot.fb_live_video_id || !fresh) return reply({ comments: [], status: slot.status, fb_live_video_id: slot.fb_live_video_id })

    const { data: tok } = await admin.from('stage_page_tokens').select('page_token').eq('stage_id', slot.stage_id).maybeSingle()
    if (!tok) return reply({ error: 'The Facebook Page is not connected yet' }, 404)

    const params = new URLSearchParams({
      fields: 'id,message,created_time,from{id,name}',
      order: 'reverse_chronological', live_filter: 'no_filter', filter: 'stream', limit: '100',
      access_token: tok.page_token,
    })
    if (since) params.set('since', String(Math.floor(Date.parse(since) / 1000)))
    const res = await fetch(`${GRAPH}/${slot.fb_live_video_id}/comments?${params}`)
    const json = await res.json().catch(() => ({}))
    if (!res.ok || json.error) return reply({ error: json.error?.message || `Facebook error ${res.status}` }, 502)
    return reply({ comments: json.data ?? [], status: slot.status, fb_live_video_id: slot.fb_live_video_id })
  } catch (e) {
    return reply({ error: (e as Error).message }, 500)
  }
})
