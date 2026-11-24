import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { supabase } from './supabase'
import { useSession } from './session'
import { LIVE_CLASSES, type LiveClass } from '../lessons/classes'

/* The live class schedule. The defaults live in src/lessons/classes.ts; the Queen (a host of the
   community calendar) can change each class's day, times and no-class dates from the app, saved in
   Supabase (017_class_schedule.sql). Until that table exists, everyone sees the defaults. */

export type ScheduleRow = { class_id: string; weekday: number; day_time: string; evening_time: string; skip_dates: string[] }

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** One class with the saved schedule laid over its defaults. */
export function applyRow(c: LiveClass, r?: ScheduleRow): LiveClass {
  if (!r) return c
  return {
    ...c,
    weekday: r.weekday,
    day: `${WEEKDAYS[r.weekday]}s`,
    sessions: c.sessions.map(s => ({ ...s, time: s.label === 'Daytime' ? r.day_time : r.evening_time })),
    skip: r.skip_dates ?? [],
  }
}

let current: LiveClass[] = LIVE_CLASSES
let loaded = false
let loading: Promise<void> | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach(f => f())

/** The classes as they are now (defaults until the saved schedule loads). */
export const getLiveClasses = () => current

function setRows(rows: ScheduleRow[]) {
  current = LIVE_CLASSES.map(c => applyRow(c, rows.find(r => r.class_id === c.id)))
  emit()
}

async function fetchSchedule(force = false) {
  if (loaded && !force) return
  if (loading && !force) return loading
  loading = (async () => {
    const { data, error } = await supabase.from('class_schedule').select('class_id,weekday,day_time,evening_time,skip_dates')
    loaded = true
    if (!error) setRows((data ?? []) as ScheduleRow[])
  })()
  try { await loading } finally { loading = null }
}

/** The live classes with the Queen's schedule, plus a save for hosts. */
export function useLiveClasses() {
  const { session } = useSession()
  const classes = useSyncExternalStore(f => { listeners.add(f); return () => { listeners.delete(f) } }, getLiveClasses)
  useEffect(() => { if (session) fetchSchedule() }, [session])

  /** Save one class's schedule. Returns null, or a message to show. */
  const save = useCallback(async (row: ScheduleRow): Promise<string | null> => {
    const { error } = await supabase.from('class_schedule').upsert({ ...row, updated_at: new Date().toISOString() })
    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205') return 'The class schedule isn\'t set up yet. Run 017_class_schedule.sql in Supabase first.'
      if (error.code === '42501') return 'Only a host of the community calendar can change class times.'
      return error.message
    }
    await fetchSchedule(true)
    return null
  }, [])

  return { classes, save }
}

/** "13:30" ↔ "1:30 PM" for the time pickers. */
export function to24(t: string): string {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i)
  if (!m) return '12:00'
  let h = Number(m[1]) % 12
  if (m[3].toUpperCase() === 'PM') h += 12
  return `${String(h).padStart(2, '0')}:${m[2]}`
}
export function to12(t: string): string {
  const [hs, ms] = t.split(':')
  const h = Number(hs)
  return `${h % 12 || 12}:${ms} ${h < 12 ? 'AM' : 'PM'}`
}
