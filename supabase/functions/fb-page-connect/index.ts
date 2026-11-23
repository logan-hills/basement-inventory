// Connect a Facebook Page to a shared Page ("stage"), once, by a Page admin who is a host in the app.
// The browser does Facebook Login and sends the short-lived user token here. This function swaps it
// for a long-lived one, lists the Pages that person manages, and stores the chosen Page's token
// in stage_page_tokens, which no browser can read. Sellers never see it.
//
// Body: { action: 'pages' | 'connect' | 'disconnect', stage_id, user_token?, page_id? }
// Secrets (Supabase -> Edge Functions -> Secrets): FB_APP_ID, FB_APP_SECRET
import { createClient } from 'npm:@supabase/supabase-js@2'

const GRAPH = 'https://graph.facebook.com/v21.0'
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' }
const reply = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

async function get(path: string, params: Record<string, string>) {
  const res = await fetch(`${GRAPH}/${path}?${new URLSearchParams(params)}`)
  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.error) throw new Error(json.error?.message || `Facebook error ${res.status}`)
  return json
}

Deno.serve(async req => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const asUser = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } })
    const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    const { data: u } = await asUser.auth.getUser()
    if (!u.user) return reply({ error: 'Please sign in first' }, 401)

    const { action, stage_id, user_token, page_id } = await req.json()
    const { data: isHost } = await asUser.rpc('is_stage_host', { p_stage: stage_id })
    if (!isHost) return reply({ error: 'Only a host of this shared Page can connect Facebook' }, 403)

    if (action === 'disconnect') {
      await admin.from('stage_page_tokens').delete().eq('stage_id', stage_id)
      await admin.from('stages').update({ fb_page_id: null, fb_page_name: null }).eq('id', stage_id)
      return reply({ ok: true })
    }

    const appId = Deno.env.get('FB_APP_ID'), secret = Deno.env.get('FB_APP_SECRET')
    if (!appId || !secret) return reply({ error: 'FB_APP_ID and FB_APP_SECRET are not set in Supabase yet' }, 500)
    if (!user_token) return reply({ error: 'Missing Facebook login' }, 400)

    // Long-lived user token -> Page tokens that do not expire.
    const long = await get('oauth/access_token', { grant_type: 'fb_exchange_token', client_id: appId, client_secret: secret, fb_exchange_token: user_token })
    const pages = await get('me/accounts', { fields: 'id,name,access_token,tasks,followers_count', limit: '100', access_token: long.access_token })
    const list = (pages.data ?? []) as { id: string; name: string; access_token: string; tasks?: string[]; followers_count?: number }[]

    if (action === 'pages') {
      return reply({ pages: list.map(p => ({ id: p.id, name: p.name, followers: p.followers_count ?? null, can_live: (p.tasks ?? []).includes('CREATE_CONTENT') })) })
    }

    if (action === 'connect') {
      const page = list.find(p => p.id === page_id)
      if (!page) return reply({ error: 'That Page was not found on this Facebook account' }, 404)
      const perms = await get('me/permissions', { access_token: long.access_token })
      const scopes = (perms.data ?? []).filter((p: { status: string }) => p.status === 'granted').map((p: { permission: string }) => p.permission)
      const { error } = await admin.from('stage_page_tokens').upsert({ stage_id, page_token: page.access_token, scopes, connected_by: u.user.id, connected_at: new Date().toISOString() })
      if (error) throw error
      await admin.from('stages').update({ fb_page_id: page.id, fb_page_name: page.name }).eq('id', stage_id)
      return reply({ ok: true, page: { id: page.id, name: page.name }, scopes })
    }

    return reply({ error: 'Unknown action' }, 400)
  } catch (e) {
    return reply({ error: (e as Error).message }, 500)
  }
})
