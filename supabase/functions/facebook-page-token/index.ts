// Hands the shared Page's access token to a HOST of that shared Page (used by the Live comment bot).
// Sellers never get it: a Page token can post and delete as the Page.
// Body: { stage_id? }  -> { access_token, page_id, page_name }
import { createClient } from 'npm:@supabase/supabase-js@2'

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

    const body = await req.json().catch(() => ({}))
    let stageId: string | undefined = body?.stage_id
    if (!stageId) {
      const { data } = await admin.from('stage_members').select('stage_id').eq('user_id', u.user.id).eq('role', 'host').order('created_at').limit(1)
      stageId = data?.[0]?.stage_id
    }
    if (!stageId) return reply({ error: 'Only a host of a shared Page can use the Page connection' }, 403)
    const { data: isHost } = await asUser.rpc('is_stage_host', { p_stage: stageId })
    if (!isHost) return reply({ error: 'Only a host of this shared Page can use the Page connection' }, 403)

    const { data: tok } = await admin.from('stage_page_tokens').select('page_token').eq('stage_id', stageId).maybeSingle()
    const { data: stage } = await admin.from('stages').select('fb_page_id,fb_page_name').eq('id', stageId).maybeSingle()
    if (!tok) return reply({ error: 'The Facebook Page is not connected yet' }, 404)
    return reply({ access_token: tok.page_token, page_id: stage?.fb_page_id, page_name: stage?.fb_page_name })
  } catch (e) {
    return reply({ error: (e as Error).message }, 500)
  }
})
