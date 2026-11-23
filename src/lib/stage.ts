import { supabase } from './supabase'

export type Stage = {
  id: string; name: string; fb_page_id: string | null; fb_page_name: string | null
  warn_min: number; prep_min: number; invite_code: string; created_by: string
  open_to_all?: boolean; guidelines?: string | null; late_cancel_min?: number
}
export type StageMember = { stage_id: string; user_id: string; display_name: string; role: 'host' | 'seller'; shop_id: string | null }
export type Slot = {
  id: string; stage_id: string; user_id: string; live_id: string | null; seller_name: string; title: string
  starts_at: string; ends_at: string; status: string; fb_live_video_id: string | null
  went_live_at: string | null; ended_at: string | null; last_error: string | null
}

export const SLOT_FIELDS = 'id,stage_id,user_id,live_id,seller_name,title,starts_at,ends_at,status,fb_live_video_id,went_live_at,ended_at,last_error'

/** The shared Pages this person belongs to. */
export async function loadMyStages(): Promise<{ stage: Stage; me: StageMember }[]> {
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) return []
  const { data, error } = await supabase.from('stage_members').select('stage_id,user_id,display_name,role,shop_id, stage:stages(*)').eq('user_id', u.user.id).order('created_at')
  if (error) throw error
  return (data ?? []).filter((r: any) => r.stage).map((r: any) => ({ stage: r.stage as Stage, me: { stage_id: r.stage_id, user_id: r.user_id, display_name: r.display_name, role: r.role, shop_id: r.shop_id } }))
}

export async function loadMembers(stageId: string): Promise<StageMember[]> {
  const { data, error } = await supabase.from('stage_members').select('stage_id,user_id,display_name,role,shop_id').eq('stage_id', stageId).order('created_at')
  if (error) throw error
  return (data ?? []) as StageMember[]
}

export async function loadSlots(stageId: string, from: Date, to: Date): Promise<Slot[]> {
  const { data, error } = await supabase.from('live_slots').select(SLOT_FIELDS)
    .eq('stage_id', stageId).neq('status', 'cancelled')
    .lt('starts_at', to.toISOString()).gt('ends_at', from.toISOString()).order('starts_at')
  if (error) throw error
  return (data ?? []) as Slot[]
}

export async function loadSlot(id: string): Promise<Slot | null> {
  const { data, error } = await supabase.from('live_slots').select(SLOT_FIELDS).eq('id', id).maybeSingle()
  if (error) throw error
  return data as Slot | null
}

/** My next slot that hasn't finished (any shared Page). */
export async function loadMyNextSlot(): Promise<Slot | null> {
  const { data: u } = await supabase.auth.getUser()
  if (!u.user) return null
  const { data } = await supabase.from('live_slots').select(SLOT_FIELDS).eq('user_id', u.user.id)
    .in('status', ['booked', 'preparing', 'ready', 'live', 'ending']).gt('ends_at', new Date().toISOString())
    .order('starts_at').limit(1)
  return (data?.[0] as Slot) ?? null
}

export async function loadSlotKey(slotId: string): Promise<string | null> {
  const { data } = await supabase.from('live_slot_keys').select('stream_url').eq('slot_id', slotId).maybeSingle()
  return data?.stream_url ?? null
}

/** Facebook gives one URL; streaming apps want it as "server" + "stream key". */
export function splitStreamUrl(url: string) {
  const i = url.indexOf('/rtmp/')
  if (i < 0) return { server: url, key: '' }
  return { server: url.slice(0, i + 6), key: url.slice(i + 6) }
}

/** Ask the server timer to run now (used at the exact start/stop second). Harmless if early. */
export function pokeTimer() {
  return supabase.functions.invoke('live-slots-tick', { body: {} }).catch(() => null)
}

export function friendlySlotError(msg: string) {
  if (msg.includes('live_slots_check')) return 'Book whole hours that start on the hour.'
  if (msg.includes('live_slots_no_overlap')) return 'Someone already has that time. Pick a time that does not overlap.'
  if (msg.includes('stage') && (msg.includes('does not exist') || msg.includes('schema cache'))) return 'Shared Page needs a quick database update first (supabase/010_shared_page_slots.sql).'
  return msg
}

export const STATUS_LABEL: Record<string, string> = {
  booked: 'Booked', preparing: 'Getting key', ready: 'Key ready', live: 'On air', ending: 'Wrapping up',
  ended: 'Done', missed: 'Missed', cancelled: 'Cancelled',
}

export const fmtTime = (d: Date | string | number) => new Date(d).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
export const fmtDay = (d: Date | string | number) => new Date(d).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })

export function fmtCountdown(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  const p = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${h}:${p(m)}:${p(sec)}` : `${m}:${p(sec)}`
}

/** A short two-tone chime, so a seller hears the wrap-up warning while talking to the camera. */
export function chime(times = 2) {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext
    const ctx = new Ctx()
    for (let i = 0; i < times; i++) {
      for (const [f, off] of [[880, 0], [1320, 0.18]] as const) {
        const o = ctx.createOscillator(), g = ctx.createGain()
        o.frequency.value = f; o.type = 'sine'
        const t = ctx.currentTime + i * 0.6 + off
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.3, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)
        o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.4)
      }
    }
    navigator.vibrate?.([200, 100, 200])
  } catch { /* sound is a bonus */ }
}
