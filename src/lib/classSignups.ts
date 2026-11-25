import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import { useSession } from './session'
import { TEAM_CONTACT as CONTACT } from './legal'
import { CLASS_TZ_ID, type LiveClass } from '../lessons/classes'
import { getLiveClasses } from './classSchedule'
import { getRoom } from './meetings'
import { isFounder } from './plan'

/* Live class sign-ups. Saved to Supabase (016_class_signups.sql) so hosts can see who's coming.
   Until that table exists, a seat is kept on this device and the seller is offered an email
   to the team instead, so sign-up never dead-ends. */

export type Signup = {
  id: string; user_id?: string; class_id: string; session_label: 'Daytime' | 'Evening'; class_date: string
  name: string; email: string | null; phone: string | null; note: string | null; created_at?: string
}

const KEY = 'classSignups'
const readLocal = (): Signup[] => { try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] } }
const writeLocal = (l: Signup[]) => { try { localStorage.setItem(KEY, JSON.stringify(l)) } catch { /* ignore */ } }
const missingTable = (e: { code?: string; message?: string } | null) => !!e && (e.code === '42P01' || e.code === 'PGRST205' || /class_signups/.test(e.message ?? ''))

/** Today's date in Eastern Time, as YYYY-MM-DD, plus the time in minutes since midnight. */
function nowInClassTz(): { date: string; minutes: number } {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: CLASS_TZ_ID, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).map(p => [p.type, p.value]))
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) }
}

/** "12:00 PM" → minutes since midnight. */
export function timeToMinutes(t: string): number {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return 0
  let h = Number(m[1]) % 12
  if (m[3].toUpperCase() === 'PM') h += 12
  return h * 60 + Number(m[2])
}

const addDays = (iso: string, n: number) => { const d = new Date(`${iso}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10) }
const weekdayOf = (iso: string) => new Date(`${iso}T12:00:00Z`).getUTCDay()

/** The next `count` dates this class meets, skipping no-class dates and today if that session has already started. */
export function nextDates(c: LiveClass, time: string, count = 4): string[] {
  const now = nowInClassTz()
  let d = now.date
  const out: string[] = []
  for (let i = 0; i < 7 * (count + 1 + (c.skip?.length ?? 0)) && out.length < count; i++, d = addDays(d, 1)) {
    if (weekdayOf(d) !== c.weekday) continue
    if (c.skip?.includes(d)) continue
    if (d === now.date && now.minutes >= timeToMinutes(time)) continue
    out.push(d)
  }
  return out
}

/** "Mon, Dec 1" */
export const prettyDate = (iso: string, long = false) => new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', weekday: long ? 'long' : 'short', month: long ? 'long' : 'short', day: 'numeric' })

const stamp = (iso: string, mins: number) => `${iso.replace(/-/g, '')}T${String(Math.floor(mins / 60)).padStart(2, '0')}${String(mins % 60).padStart(2, '0')}00`

function sessionOf(s: Signup) {
  const c = getLiveClasses().find(x => x.id === s.class_id)
  const sess = c?.sessions.find(x => x.label === s.session_label)
  return { c, sess }
}

/** What a calendar invite says about joining: the link if the Queen has saved one. */
const joinLine = (classId: string) => {
  const link = getRoom(classId)
  return link ? `Join here: ${link} (or tap Join class now on the Dazzle University home, 15 minutes before).` : 'Tap Join class now on the Dazzle University home, 15 minutes before class.'
}

/** A Google Calendar link for this seat. */
export function googleCalLink(s: Signup): string {
  const { c, sess } = sessionOf(s)
  if (!c || !sess) return '#'
  const start = timeToMinutes(sess.time)
  const q = new URLSearchParams({ action: 'TEMPLATE', text: `Dazzle University: ${c.title}`, dates: `${stamp(s.class_date, start)}/${stamp(s.class_date, start + c.minutes)}`, ctz: CLASS_TZ_ID, details: `${c.what}\n\n${joinLine(c.id)} Questions? ${CONTACT}`, ...(getRoom(c.id) ? { location: getRoom(c.id)! } : {}) })
  return `https://calendar.google.com/calendar/render?${q}`
}

/** An .ics file (Apple Calendar, Outlook and most phones) for this seat. */
export function icsFile(s: Signup): string {
  const { c, sess } = sessionOf(s)
  if (!c || !sess) return ''
  const start = timeToMinutes(sess.time)
  const esc = (t: string) => t.replace(/[\\,;]/g, m => `\\${m}`).replace(/\n/g, '\\n')
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Dynamic Dazzle//Dazzle University//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${s.class_id}-${s.class_date}-${s.session_label}@dynamicdazzle`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART;TZID=${CLASS_TZ_ID}:${stamp(s.class_date, start)}`,
    `DTEND;TZID=${CLASS_TZ_ID}:${stamp(s.class_date, start + c.minutes)}`,
    `SUMMARY:${esc(`Dazzle University: ${c.title}`)}`,
    `DESCRIPTION:${esc(`${c.what} ${joinLine(c.id)} Questions? ${CONTACT}`)}`,
    ...(getRoom(c.id) ? [`LOCATION:${esc(getRoom(c.id)!)}`, `URL:${getRoom(c.id)}`] : []),
    'BEGIN:VALARM', 'TRIGGER:-PT30M', 'ACTION:DISPLAY', 'DESCRIPTION:Your live class starts in 30 minutes', 'END:VALARM',
    'END:VEVENT', 'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

export function downloadIcs(s: Signup) {
  const blob = new Blob([icsFile(s)], { type: 'text/calendar;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `dazzle-${s.class_id}-${s.class_date}.ics`
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}

/** An email to the team with the seat details, for when the sign-up list isn't set up yet. */
export function seatEmail(s: Signup): string {
  const { c, sess } = sessionOf(s)
  const subject = `Save my seat: ${c?.title ?? s.class_id}, ${prettyDate(s.class_date)} ${s.session_label.toLowerCase()} (${sess?.time ?? ''})`
  const body = [`Name: ${s.name}`, `Email: ${s.email ?? ''}`, `Phone: ${s.phone ?? ''}`, s.note ? `Note: ${s.note}` : ''].filter(Boolean).join('\n')
  return `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

/** My seats, and (for hosts) everyone's upcoming seats. */
export function useClassSignups() {
  const { session, shop } = useSession()
  const [mine, setMine] = useState<Signup[]>(() => readLocal())
  const [all, setAll] = useState<Signup[]>([])
  const [online, setOnline] = useState<boolean | null>(null)
  const [isHost, setIsHost] = useState(false)
  const today = nowInClassTz().date

  const load = useCallback(async () => {
    if (!session) return
    const { data: host } = await supabase.rpc('is_any_host')
    setIsHost(host === true)
    const { data, error } = await supabase.from('class_signups').select('id,user_id,class_id,session_label,class_date,name,email,phone,note,created_at').gte('class_date', today).order('class_date')
    if (error) { setOnline(!missingTable(error) ? null : false); return }
    setOnline(true)
    const rows = (data ?? []) as Signup[]
    setMine(rows.filter(r => r.user_id === session.user.id))
    setAll(rows)
  }, [session, today])
  useEffect(() => { load() }, [load])

  /** Save a seat. Returns 'saved' (on the list), 'local' (this device only; email the team) or an error message. */
  const signUp = useCallback(async (s: Omit<Signup, 'id'>): Promise<'saved' | 'local' | string> => {
    if (session && online !== false) {
      const { error } = await supabase.from('class_signups').insert({ ...s, shop_id: shop?.id ?? null })
      if (!error || error.code === '23505') { await load(); return 'saved' }
      if (!missingTable(error)) return error.message
      setOnline(false)
    }
    const next = [...readLocal().filter(x => !(x.class_id === s.class_id && x.class_date === s.class_date && x.session_label === s.session_label)), { ...s, id: `local-${Date.now()}` }]
    writeLocal(next); setMine(next)
    return 'local'
  }, [session, shop, online, load])

  const cancel = useCallback(async (s: Signup) => {
    if (!s.id.startsWith('local-')) {
      const { error } = await supabase.from('class_signups').delete().eq('id', s.id)
      if (error) return error.message
      await load()
    } else {
      const next = readLocal().filter(x => x.id !== s.id)
      writeLocal(next); setMine(next)
    }
    return null
  }, [load])

  const upcomingMine = mine.filter(x => x.class_date >= today).sort((a, b) => a.class_date.localeCompare(b.class_date))
  return { mine: upcomingMine, all, online, isHost: isHost && isFounder(shop?.plan), signUp, cancel, reload: load }
}
