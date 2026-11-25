import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import { supabase } from './supabase'
import { useSession } from './session'
import { CLASS_TZ_ID, QUEEN_SESSION } from '../lessons/classes'
import { isFounder } from './plan'

/* Where the Queen actually holds her live classes and 1:1 sessions.
   She saves a meeting link once (Zoom, Google Meet, Microsoft Teams, any link that opens a video call)
   and the app does the rest: a big Start button on her Host desk, a Join button for everyone with a seat
   from 15 minutes before class, and the link inside every calendar invite.
   Saved in Supabase (020_host_desk.sql). Until that's run, the Host desk says so and nothing breaks. */

/** Rooms: one per live class (keyed by class id) and 'queen' for her 1:1 consults. */
export type RoomKey = string
export const QUEEN_ROOM = 'queen'

/** Join opens this many minutes before the start. */
export const JOIN_EARLY_MIN = 15

const missing = (e: { code?: string; message?: string } | null) => !!e && (e.code === '42P01' || e.code === 'PGRST205' || e.code === 'PGRST202' || /meeting_rooms|queen_sessions|free_access/.test(e.message ?? ''))

/* ---------- Meeting links ---------- */

/** Tidy a pasted link: trims it, adds https:// if it was left off. Returns null if it isn't a web link. */
export function cleanLink(input: string): string | null {
  let t = input.trim()
  if (!t) return null
  // People often paste a whole invite. Pull the first link out of it.
  const found = t.match(/https?:\/\/[^\s<>"]+/i)
  if (found) t = found[0]
  if (!/^https?:\/\//i.test(t)) t = `https://${t}`
  t = t.replace(/^http:\/\//i, 'https://')
  try {
    const u = new URL(t)
    if (!u.hostname.includes('.')) return null
    return u.toString()
  } catch { return null }
}

/** "Zoom", "Google Meet"… from the link, so buttons can say what will open. */
export function serviceName(url: string | null | undefined): string {
  if (!url) return 'video call'
  const h = (() => { try { return new URL(url).hostname.toLowerCase() } catch { return '' } })()
  if (h.endsWith('zoom.us') || h.endsWith('zoom.com')) return 'Zoom'
  if (h === 'meet.google.com') return 'Google Meet'
  if (h.endsWith('teams.microsoft.com') || h.endsWith('teams.live.com')) return 'Microsoft Teams'
  if (h.endsWith('facebook.com') || h === 'fb.me') return 'Facebook'
  if (h.includes('jit.si')) return 'Jitsi'
  if (h.endsWith('webex.com')) return 'Webex'
  return 'video call'
}

let rooms: Record<RoomKey, string> = {}
let roomsReady: boolean | null = null
let roomsLoading: Promise<void> | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach(f => f())
let snapshot: { rooms: Record<RoomKey, string>; ready: boolean | null } = { rooms, ready: roomsReady }

/** The saved link for a room, if there is one (for calendar invites). */
export const getRoom = (key: RoomKey) => rooms[key] ?? null

async function fetchRooms(force = false) {
  if (roomsReady !== null && !force) return
  if (roomsLoading && !force) return roomsLoading
  roomsLoading = (async () => {
    const { data, error } = await supabase.from('meeting_rooms').select('key,url')
    if (error) { roomsReady = missing(error) ? false : roomsReady; }
    else { roomsReady = true; rooms = Object.fromEntries((data ?? []).map((r: { key: string; url: string }) => [r.key, r.url])) }
    snapshot = { rooms, ready: roomsReady }
    emit()
  })()
  try { await roomsLoading } finally { roomsLoading = null }
}

/** The saved meeting links, plus a save for hosts. `ready` is false until 020_host_desk.sql is run. */
export function useMeetingRooms() {
  const { session } = useSession()
  const snap = useSyncExternalStore(f => { listeners.add(f); return () => { listeners.delete(f) } }, () => snapshot)
  useEffect(() => { if (session) fetchRooms() }, [session])

  /** Save (or clear, with '') one room's link. Returns null, or a message to show. */
  const save = useCallback(async (key: RoomKey, input: string): Promise<string | null> => {
    if (!input.trim()) {
      const { error } = await supabase.from('meeting_rooms').delete().eq('key', key)
      if (error) return missing(error) ? NOT_SET_UP : error.message
    } else {
      const url = cleanLink(input)
      if (!url) return 'That doesn\'t look like a meeting link. Copy the whole link from Zoom, Google Meet or Teams and paste it here.'
      const { error } = await supabase.from('meeting_rooms').upsert({ key, url, updated_at: new Date().toISOString() })
      if (error) {
        if (missing(error)) return NOT_SET_UP
        if (error.code === '42501') return 'Only the Queen and her hosts can change meeting links.'
        return error.message
      }
    }
    await fetchRooms(true)
    return null
  }, [])

  return { rooms: snap.rooms, ready: snap.ready, save }
}

export const NOT_SET_UP = 'The Host desk isn\'t switched on yet. Run 020_host_desk.sql in Supabase first.'

/* ---------- Times ---------- */

/** A wall-clock time in Eastern Time ("2026-12-01", 19*60) as a real moment. */
export function easternToDate(iso: string, minutes: number): Date {
  const [y, m, d] = iso.split('-').map(Number)
  const guess = Date.UTC(y, m - 1, d, Math.floor(minutes / 60), minutes % 60)
  // How far Eastern Time is behind UTC at that moment (4 or 5 hours).
  const offset = (at: number) => {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: CLASS_TZ_ID, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date(at)).map(x => [x.type, x.value]))
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - at
  }
  const first = guess - offset(guess)
  return new Date(guess - offset(first))
}

export type JoinState = 'soon' | 'open' | 'over'
/** Is it time to join? 'open' from 15 minutes before the start until the end. */
export function joinState(start: Date, minutes: number, now = new Date()): JoinState {
  const t = now.getTime()
  if (t < start.getTime() - JOIN_EARLY_MIN * 60000) return 'soon'
  if (t > start.getTime() + minutes * 60000) return 'over'
  return 'open'
}

/** Re-render every 30 seconds so Join buttons light up on time. */
export function useNow(every = 30000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), every); return () => clearInterval(t) }, [every])
  return now
}

/** "Starts in 12 minutes", "Starts in 3 hours", "On now". */
export function startsIn(start: Date, minutes: number, now = new Date()): string {
  const diff = Math.round((start.getTime() - now.getTime()) / 60000)
  if (diff <= 0) return now.getTime() <= start.getTime() + minutes * 60000 ? 'On now' : 'Finished'
  if (diff < 60) return `Starts in ${diff} minute${diff === 1 ? '' : 's'}`
  const h = Math.round(diff / 60)
  if (h < 24) return `Starts in about ${h} hour${h === 1 ? '' : 's'}`
  const d = Math.round(diff / 1440)
  return `In ${d} day${d === 1 ? '' : 's'}`
}

/** "Tue, Dec 2 · 7:00 PM ET", shown in Eastern Time like the rest of the calendar. */
export const whenLabel = (d: Date) =>
  `${d.toLocaleDateString('en-US', { timeZone: CLASS_TZ_ID, weekday: 'short', month: 'short', day: 'numeric' })} · ${d.toLocaleTimeString('en-US', { timeZone: CLASS_TZ_ID, hour: 'numeric', minute: '2-digit' })} ET`

/** Open the meeting in a new tab (or the Zoom / Meet / Teams app, if the phone has it). */
export function openMeeting(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}

/* ---------- Is this person one of the Queen's hosts? ---------- */

let hostCache: { user: string; host: boolean } | null = null
/** True only for Founder accounts (the Queen's shop and her team). The server checks the same rule
    (is_any_host in 022_founder_host_desk_and_requests.sql), so hiding the button is not the only lock. */
export function useIsHost() {
  const { session, shop } = useSession()
  const founder = isFounder(shop?.plan)
  const uid = session?.user.id ?? ''
  // null while we check.
  const [host, setHost] = useState<boolean | null>(() => (hostCache?.user === uid ? hostCache.host : null))
  useEffect(() => {
    if (!uid) return
    let live = true
    supabase.rpc('is_any_host').then(({ data }) => { const h = data === true; hostCache = { user: uid, host: h }; if (live) setHost(h) })
    return () => { live = false }
  }, [uid])
  return founder ? host : false
}

/* ---------- Time with the Queen: booked sessions ---------- */

export type QueenSession = {
  id: string; client_name: string; client_email: string; client_phone: string | null
  starts_at: string; minutes: number; topic: string | null; join_url: string | null
  status: 'booked' | 'done' | 'cancelled'; created_at?: string
}

/** Booked consults. Hosts see every upcoming one; a seller sees the ones booked under her email. */
export function useQueenSessions() {
  const { session } = useSession()
  const [list, setList] = useState<QueenSession[]>([])
  const [ready, setReady] = useState<boolean | null>(null)

  const load = useCallback(async () => {
    if (!session) return
    const since = new Date(Date.now() - 12 * 3600000).toISOString()
    const { data, error } = await supabase.from('queen_sessions').select('id,client_name,client_email,client_phone,starts_at,minutes,topic,join_url,status,created_at')
      .gte('starts_at', since).neq('status', 'cancelled').order('starts_at')
    if (error) { setReady(missing(error) ? false : null); return }
    setReady(true)
    setList((data ?? []) as QueenSession[])
  }, [session])
  useEffect(() => { load() }, [load])

  const add = useCallback(async (s: Omit<QueenSession, 'id' | 'status'>): Promise<QueenSession | string> => {
    const { data, error } = await supabase.from('queen_sessions').insert({ ...s, status: 'booked' }).select().single()
    if (error) return missing(error) ? NOT_SET_UP : error.code === '42501' ? 'Only the Queen and her hosts can book sessions here.' : error.message
    await load()
    return data as QueenSession
  }, [load])

  const setStatus = useCallback(async (id: string, status: QueenSession['status']) => {
    const { error } = await supabase.from('queen_sessions').update({ status }).eq('id', id)
    if (!error) await load()
    return error?.message ?? null
  }, [load])

  const mine = list.filter(s => s.client_email.toLowerCase() === (session?.user.email ?? '').toLowerCase())
  return { list, mine, ready, add, setStatus, reload: load }
}

/** The link a session will open: its own, or the Queen's 1:1 room. */
export const sessionLink = (s: QueenSession) => s.join_url || getRoom(QUEEN_ROOM)

const icsStamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

/** An .ics invite for a consult, with the join link in it. */
export function queenIcs(s: QueenSession): string {
  const start = new Date(s.starts_at)
  const end = new Date(start.getTime() + s.minutes * 60000)
  const link = sessionLink(s)
  const esc = (t: string) => t.replace(/[\\,;]/g, m => `\\${m}`).replace(/\n/g, '\\n')
  const desc = `1:1 business consult with the Queen.${s.topic ? ` Topic: ${s.topic}.` : ''}${link ? ` Join here: ${link}` : ' The join link is in the app under Time with the Queen.'} Questions? ${QUEEN_SESSION.email}`
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Dynamic Dazzle//Time with the Queen//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT', `UID:queen-${s.id}@dynamicdazzle`, `DTSTAMP:${icsStamp(new Date())}`, `DTSTART:${icsStamp(start)}`, `DTEND:${icsStamp(end)}`,
    `SUMMARY:${esc('Time with the Queen')}`, `DESCRIPTION:${esc(desc)}`, ...(link ? [`LOCATION:${esc(link)}`, `URL:${link}`] : []),
    'BEGIN:VALARM', 'TRIGGER:-PT30M', 'ACTION:DISPLAY', 'DESCRIPTION:Time with the Queen starts in 30 minutes', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
}

export function downloadText(name: string, text: string, type = 'text/calendar;charset=utf-8') {
  const blob = new Blob([text], { type })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = name
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}

/** The confirmation email the Queen sends her client: time, length, deposit note and the join link. */
export function queenConfirmEmail(s: QueenSession): string {
  const start = new Date(s.starts_at)
  const link = sessionLink(s)
  const body = [
    `Hi ${s.client_name.split(' ')[0]},`,
    '',
    `You're booked for Time with the Queen on ${whenLabel(start)} for ${s.minutes} minutes.`,
    s.topic ? `We'll work on: ${s.topic}` : '',
    '',
    link ? `Join here at your time: ${link}` : 'Your join link will be in the app under Time with the Queen.',
    `You'll also see a Join button in the Dynamic Dazzle app under Time with the Queen, ${JOIN_EARLY_MIN} minutes before we start.`,
    '',
    'Bring your snapshot and your three sharpest questions. See you soon!',
    '',
    '♛ The Queen',
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n')
  return `mailto:${encodeURIComponent(s.client_email)}?subject=${encodeURIComponent(`You're booked: Time with the Queen, ${whenLabel(start)}`)}&body=${encodeURIComponent(body)}`
}

/** The email the Queen sends everyone with a class seat: the time and the join link. */
export function classReminderEmail(opts: { emails: string[]; title: string; when: string; link: string | null }): string {
  const body = [
    'Hi Queens,',
    '',
    `See you at ${opts.title}, ${opts.when}.`,
    opts.link ? `Join here: ${opts.link}` : '',
    `There's also a Join button in the app on the Dazzle University home, ${JOIN_EARLY_MIN} minutes before class.`,
    '',
    'Bring your questions!',
    '♛ The Queen',
  ].filter(Boolean).join('\n')
  return `mailto:?bcc=${encodeURIComponent(opts.emails.join(','))}&subject=${encodeURIComponent(`Class reminder: ${opts.title}, ${opts.when}`)}&body=${encodeURIComponent(body)}`
}

/* ---------- Free access for the Queen and her team ---------- */

export type FreeShop = { shop_id: string; shop_name: string; owner_email: string }

/** Shops that use every feature free: the Queen's own shop and the team members she adds. Hosts only. */
export function useFreeAccess(enabled: boolean) {
  const [list, setList] = useState<FreeShop[]>([])
  const [ready, setReady] = useState<boolean | null>(null)
  const load = useCallback(async () => {
    if (!enabled) return
    const { data, error } = await supabase.rpc('free_access_list')
    if (error) { setReady(missing(error) ? false : null); return }
    setReady(true); setList((data ?? []) as FreeShop[])
  }, [enabled])
  useEffect(() => { load() }, [load])

  /** Turn free access on or off by the shop owner's sign-in email. Returns a message to show. */
  const set = useCallback(async (email: string, on: boolean): Promise<{ ok: boolean; text: string }> => {
    const { data, error } = await supabase.rpc('set_free_access', { p_email: email.trim(), p_on: on })
    if (error) return { ok: false, text: missing(error) ? NOT_SET_UP : error.message }
    await load()
    const n = Number(data ?? 0)
    if (!n) return { ok: false, text: 'No shop found for that email. Ask her to sign up and create her shop first, then add her again.' }
    return { ok: true, text: on ? 'Done! She has every feature free now. She may need to close and reopen the app.' : 'Free access removed. Her shop is back on the free Stream plan.' }
  }, [load])

  return { list, ready, set }
}
