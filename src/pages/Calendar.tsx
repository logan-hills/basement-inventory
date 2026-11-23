import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LiveForm from '../components/LiveForm'
import { loadLives, liveWhen, projected, durationText, type Live } from '../lib/lives'
import { money } from '../lib/data'

const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export default function Calendar() {
  const navigate = useNavigate()
  const [month, setMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1) })
  const [lives, setLives] = useState<Live[] | null>(null)
  const [upcoming, setUpcoming] = useState<Live[]>([])
  const [err, setErr] = useState('')
  const [form, setForm] = useState<{ day: Date | null } | null>(null)

  const gridStart = useMemo(() => { const d = new Date(month); d.setDate(1 - d.getDay()); return d }, [month])
  const days = useMemo(() => Array.from({ length: 42 }, (_, i) => new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)), [gridStart])

  const load = useCallback(async () => {
    try {
      setErr('')
      const end = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + 42)
      setLives(await loadLives(gridStart, end))
      const now = new Date(); now.setHours(0, 0, 0, 0)
      setUpcoming((await loadLives(now)).filter(l => l.status === 'planned').slice(0, 8))
    } catch (e: any) { setErr(e.message); setLives([]) }
  }, [gridStart])
  useEffect(() => { load() }, [load])

  const today = new Date()

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div><span className="eyebrow">Sell</span><h1>Live calendar</h1></div>
        <div className="row-gap">
          <Link className="btn ghost" to="/live">Plan items</Link>
          <button className="btn primary" onClick={() => setForm({ day: null })}>+ Schedule a live</button>
        </div>
      </div>
      {err && <p className="danger-text">{err.includes('lives') ? 'The calendar needs a quick database update. Claude is running it.' : err}</p>}

      <div className="cal-layout">
        <div className="card stack">
          <div className="row-between">
            <button className="icon-btn" aria-label="Previous month" onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))}>‹</button>
            <div className="cal-title">
              <h2>{month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h2>
              {!sameDay(month, new Date(today.getFullYear(), today.getMonth(), 1)) && <button className="link-btn" onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>Today</button>}
            </div>
            <button className="icon-btn" aria-label="Next month" onClick={() => setMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))}>›</button>
          </div>
          <div className="cal-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <span key={d} className="cal-dow">{d}</span>)}
            {days.map(d => {
              const list = (lives ?? []).filter(l => sameDay(new Date(l.starts_at), d))
              return (
                <div key={d.toISOString()} className={`cal-day ${d.getMonth() !== month.getMonth() ? 'out' : ''} ${sameDay(d, today) ? 'today' : ''}`}
                  onClick={() => setForm({ day: d })} role="button" tabIndex={0} aria-label={`Add a live on ${d.toDateString()}`}
                  onKeyDown={e => { if (e.key === 'Enter') setForm({ day: d }) }}>
                  <span className="cal-num">{d.getDate()}</span>
                  {list.map(l => (
                    <button key={l.id} className={`cal-live ${l.status}`} onClick={e => { e.stopPropagation(); navigate(`/lives/${l.id}`) }}>
                      <b>{new Date(l.starts_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</b> {l.title}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>
          <p className="muted small">Tap a day to schedule a live on it. Schedule as far ahead as you like.</p>
        </div>

        <div className="card stack">
          <span className="eyebrow">Coming up</span>
          {upcoming.length === 0 && <p className="muted">No lives planned yet. Schedule one, or set up your weekly show to repeat.</p>}
          {upcoming.map(l => {
            const p = projected(l)
            return (
              <Link key={l.id} to={`/lives/${l.id}`} className="cal-upcoming">
                <div className="row-between"><b>{l.title}</b>{l.theme && l.theme !== l.title && <span className="chip-mini">{l.theme}</span>}</div>
                <span className="muted small">{liveWhen(l)} · {durationText(l.duration_min)}{l.host ? ` · ${l.host}` : ''}</span>
                <span className="small">{(l.items ?? []).reduce((s, i) => s + i.qty, 0)} items planned · <span className="gold">{money(p)} if everything sells</span></span>
              </Link>
            )
          })}
        </div>
      </div>

      <LiveForm open={!!form} day={form?.day} onClose={() => setForm(null)} onSaved={() => load()} />
    </div>
  )
}
