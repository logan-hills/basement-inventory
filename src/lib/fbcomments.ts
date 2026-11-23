// Reading comments from a Facebook Live on a business Page.
// Real time comes from Facebook's comment stream; if that drops, it falls back to checking every few seconds.
import { supabase } from './supabase'
import type { BotComment } from './livebot'

/** Accepts a live video id, or a Facebook link to the live (…/videos/123…, ?v=123…, /watch/live/?v=…). */
export function parseVideoId(input: string): string | null {
  const s = input.trim()
  if (/^\d{6,}$/.test(s)) return s
  const m = s.match(/(?:videos\/(?:[^/?#]+\/)?|[?&]v=|live_videos\/|\/(\d{6,})_)(\d{6,})/)
  return m ? (m[2] ?? m[1]) : null
}

/**
 * The Page token comes from the app's server, which keeps it safe (it's never saved in the browser).
 * Until the Facebook connection is set up, this returns null and the bot runs in practice mode.
 */
export async function getPageToken(): Promise<string | null> {
  try {
    const { data, error } = await supabase.functions.invoke('facebook-page-token', { body: {} })
    if (error) return null
    return (data as any)?.access_token ?? null
  } catch {
    return null
  }
}

type RawComment = { id: string; message?: string; created_time?: string; from?: { id?: string; name?: string } }

const toComment = (c: RawComment): BotComment | null =>
  c?.id && c.message ? { id: c.id, text: c.message, fromId: c.from?.id ?? null, fromName: c.from?.name ?? 'Facebook user', at: c.created_time ? new Date(c.created_time).toISOString() : new Date().toISOString() } : null

export type StreamStatus = 'connecting' | 'live' | 'polling' | 'error'

/**
 * Starts listening to a live video's comments. Calls onComments with each batch of new comments
 * (oldest first, never the same comment twice). Returns a function that stops listening.
 */
export function listenToComments(
  videoId: string,
  token: string,
  onComments: (c: BotComment[]) => void,
  onStatus: (s: StreamStatus, detail?: string) => void,
): () => void {
  const seen = new Set<string>()
  let stopped = false
  let es: EventSource | null = null
  let timer: ReturnType<typeof setTimeout> | null = null
  let failures = 0

  const deliver = (list: BotComment[]) => {
    const fresh = list.filter(c => !seen.has(c.id))
    fresh.forEach(c => seen.add(c.id))
    if (fresh.length) onComments(fresh.sort((a, b) => a.at.localeCompare(b.at)))
  }

  // Comments made before the bot started (or while the connection blipped): read the latest page.
  async function poll() {
    if (stopped) return
    try {
      const url = `https://graph.facebook.com/${videoId}/comments?order=reverse_chronological&live_filter=no_filter&filter=stream&limit=100&fields=id,message,created_time,from{id,name}&access_token=${encodeURIComponent(token)}`
      const r = await fetch(url)
      const j = await r.json()
      if (j.error) throw new Error(j.error.message)
      deliver(((j.data ?? []) as RawComment[]).map(toComment).filter(Boolean) as BotComment[])
      failures = 0
      return true
    } catch (e: any) {
      failures++
      onStatus('error', e?.message ?? String(e))
      return false
    }
  }

  function startPolling() {
    onStatus('polling')
    const loop = async () => {
      if (stopped) return
      await poll()
      timer = setTimeout(loop, failures ? Math.min(30000, 3000 * 2 ** failures) : 3000)
    }
    loop()
  }

  function startStream() {
    onStatus('connecting')
    const url = `https://streaming-graph.facebook.com/${videoId}/live_comments?access_token=${encodeURIComponent(token)}&comment_rate=ten_per_second&live_filter=no_filter&fields=id,message,created_time,from{id,name}`
    try {
      es = new EventSource(url)
    } catch {
      startPolling(); return
    }
    let opened = false
    es.onopen = () => { opened = true; onStatus('live') }
    es.onmessage = ev => {
      try { const c = toComment(JSON.parse(ev.data)); if (c) deliver([c]) } catch { /* keep-alive or bad frame */ }
    }
    es.onerror = () => {
      // The stream ends when the live ends, or can't start (wrong id, expired token). Fall back to checking.
      es?.close(); es = null
      if (stopped) return
      if (!opened) startPolling()
      else { onStatus('connecting'); poll().then(() => !stopped && setTimeout(startStream, 2000)) }
    }
  }

  poll().then(() => !stopped && startStream())
  return () => {
    stopped = true
    es?.close()
    if (timer) clearTimeout(timer)
  }
}

/**
 * Reading comments through the app's server for one booked slot. Works for the seller who owns the slot
 * (and for hosts) without anyone in the browser ever holding the Page token. Checks every 3 seconds.
 */
export function listenToSlot(
  slotId: string,
  onComments: (c: BotComment[], videoId: string | null) => void,
  onStatus: (s: StreamStatus, detail?: string) => void,
): () => void {
  const seen = new Set<string>()
  let stopped = false
  let timer: ReturnType<typeof setTimeout> | null = null
  let failures = 0
  let since: string | undefined
  onStatus('connecting')

  async function tick() {
    if (stopped) return
    try {
      const { data, error } = await supabase.functions.invoke('facebook-live-comments', { body: { live_slot_id: slotId, since } })
      if (error) throw new Error((await (error as any).context?.json?.().catch(() => null))?.error ?? error.message)
      const list = ((data?.comments ?? []) as RawComment[]).map(toComment).filter(Boolean) as BotComment[]
      const fresh = list.filter(c => !seen.has(c.id)).sort((a, b) => a.at.localeCompare(b.at))
      fresh.forEach(c => seen.add(c.id))
      // Ask again from a little before the newest comment, so nothing slips between checks.
      if (fresh.length) since = new Date(new Date(fresh[fresh.length - 1].at).getTime() - 10000).toISOString()
      if (fresh.length) onComments(fresh, data?.fb_live_video_id ?? null)
      failures = 0
      onStatus('polling')
    } catch (e: any) {
      failures++
      onStatus('error', e?.message ?? String(e))
    }
    if (!stopped) timer = setTimeout(tick, failures ? Math.min(30000, 3000 * 2 ** failures) : 3000)
  }
  tick()
  return () => { stopped = true; if (timer) clearTimeout(timer) }
}
