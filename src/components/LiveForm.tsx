import { useEffect, useState, type FormEvent } from 'react'
import Sheet from './Sheet'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import type { Live } from '../lib/lives'

const pad = (n: number) => String(n).padStart(2, '0')
const dateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const timeStr = (d: Date) => `${pad(d.getHours())}:${pad(d.getMinutes())}`

/** Create or edit a live. `day` pre-fills the date when adding from the calendar. */
export default function LiveForm({ open, onClose, live, day, onSaved }: { open: boolean; onClose: () => void; live?: Live | null; day?: Date | null; onSaved: (id: string) => void }) {
  const { shop, settings } = useSession()
  const toast = useToast()
  const [title, setTitle] = useState('')
  const [theme, setTheme] = useState('')
  const [host, setHost] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('19:00')
  const [duration, setDuration] = useState(String(settings.liveDurationMin))
  const [notes, setNotes] = useState('')
  const [repeat, setRepeat] = useState('1')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    if (live) {
      const s = new Date(live.starts_at)
      setTitle(live.title); setTheme(live.theme ?? ''); setHost(live.host ?? ''); setDate(dateStr(s)); setTime(timeStr(s))
      setDuration(String(live.duration_min)); setNotes(live.notes ?? ''); setRepeat('1')
    } else {
      const d = day ?? new Date()
      setTitle(''); setTheme(settings.liveThemes[0] ?? ''); setHost(settings.hosts[0] ?? ''); setDate(dateStr(d)); setTime('19:00')
      setDuration(String(settings.liveDurationMin)); setNotes(''); setRepeat('1')
    }
  }, [open, live, day, settings])

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!shop || !date) return
    setBusy(true)
    const start = new Date(`${date}T${time || '19:00'}`)
    const base = { shop_id: shop.id, title: title.trim() || theme || 'Live sale', theme: theme || null, host: host || null, duration_min: Math.max(1, parseInt(duration, 10) || 60), notes: notes.trim() || null }
    let id = live?.id ?? ''
    if (live) {
      const { error } = await supabase.from('lives').update({ ...base, starts_at: start.toISOString() }).eq('id', live.id)
      if (error) { toast(error.message, { kind: 'bad' }); setBusy(false); return }
    } else {
      const n = Math.max(1, Math.min(520, parseInt(repeat, 10) || 1))
      const rows = Array.from({ length: n }, (_, i) => ({ ...base, starts_at: new Date(start.getTime() + i * 7 * 86400000).toISOString() }))
      const { data, error } = await supabase.from('lives').insert(rows).select('id')
      if (error) { toast(error.message.includes('lives') ? 'The calendar needs a quick database update first.' : error.message, { kind: 'bad' }); setBusy(false); return }
      id = data![0].id
      toast(n > 1 ? `Scheduled ${n} weekly lives` : 'Live scheduled', { kind: 'ok' })
    }
    setBusy(false)
    onSaved(id)
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title={live ? 'Edit live' : 'Schedule a live'}>
      <form className="stack" onSubmit={save}>
        <label>Title<input value={title} onChange={e => setTitle(e.target.value)} placeholder={theme || '$2 Tuesday'} /></label>
        <div className="row2">
          <label>Theme
            <select value={theme} onChange={e => setTheme(e.target.value)}>
              <option value="">No theme</option>
              {[...new Set([...settings.liveThemes, ...(theme ? [theme] : [])])].map(t => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>Host
            <select value={host} onChange={e => setHost(e.target.value)}>
              <option value="">—</option>
              {[...new Set([...settings.hosts, ...(host ? [host] : [])])].map(t => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>
        <div className="row3">
          <label>Date<input type="date" required value={date} onChange={e => setDate(e.target.value)} /></label>
          <label>Start<input type="time" required value={time} onChange={e => setTime(e.target.value)} /></label>
          <label>Length
            <select value={duration} onChange={e => setDuration(e.target.value)}>
              {[...new Set([30, 45, 60, 90, 120, 150, 180, 240, parseInt(duration, 10) || 120])].sort((a, b) => a - b).map(m => <option key={m} value={m}>{m < 60 ? `${m} min` : `${Math.floor(m / 60)} hr${m % 60 ? ` ${m % 60} min` : ''}`}</option>)}
            </select>
          </label>
        </div>
        {!live && (
          <label>Repeat every week
            <select value={repeat} onChange={e => setRepeat(e.target.value)}>
              <option value="1">Just this once</option>
              {[4, 8, 13, 26, 52, 104].map(n => <option key={n} value={n}>For {n} weeks{n === 13 ? ' (3 months)' : n === 26 ? ' (6 months)' : n === 52 ? ' (1 year)' : n === 104 ? ' (2 years)' : ''}</option>)}
            </select>
          </label>
        )}
        <label>Notes<textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Giveaways, special guests, shipping cutoff…" /></label>
        <button className="btn primary big" disabled={busy}>{busy ? 'Saving…' : live ? 'Save changes' : 'Schedule'}</button>
      </form>
    </Sheet>
  )
}
