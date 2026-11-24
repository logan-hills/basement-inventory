import { useState } from 'react'
import { Link } from 'react-router-dom'
import Sheet from './Sheet'
import Icon from './Icon'
import { useSession } from '../lib/session'
import { downloadIcs, googleCalLink, nextDates, prettyDate, seatEmail, type Signup, useClassSignups } from '../lib/classSignups'
import { CLASS_TZ, type LiveClass } from '../lessons/classes'
import { lessonById } from '../lessons'

/* Save a seat in a live class, in a pop-up: pick daytime or evening, pick a date, check your
   name and how to reach you, done. Then add it to your calendar. */

export default function ClassSignup({ c, label, date: startDate, onClose, signups }: {
  c: LiveClass; label: 'Daytime' | 'Evening'; date?: string; onClose: () => void; signups: ReturnType<typeof useClassSignups>
}) {
  const { shop, session, profile } = useSession()
  const [sessionLabel, setSessionLabel] = useState(label)
  const sess = c.sessions.find(s => s.label === sessionLabel) ?? c.sessions[0]
  const dates = nextDates(c, sess.time)
  const [date, setDate] = useState(startDate && dates.includes(startDate) ? startDate : dates[0])
  const [name, setName] = useState(profile?.display_name || shop?.name || '')
  const [email, setEmail] = useState(profile?.email || session?.user.email || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState<{ seat: Signup; local: boolean } | null>(null)

  async function save() {
    if (!name.trim() || !date) return
    setBusy(true); setErr('')
    const seat = { class_id: c.id, session_label: sess.label, class_date: date, name: name.trim(), email: email.trim() || null, phone: phone.trim() || null, note: null }
    const r = await signups.signUp(seat)
    setBusy(false)
    if (r === 'saved' || r === 'local') setDone({ seat: { ...seat, id: 'new' }, local: r === 'local' })
    else setErr(r)
  }

  return (
    <Sheet open onClose={onClose} title={done ? 'You\'re in!' : 'Save my seat'}>
      {done ? (
        <div className={`stack class-done tone-${c.tone}`}>
          <div className={`class-ticket tone-${c.tone}`}>
            <small>{c.day.replace(/s$/, '')} · {CLASS_TZ}</small>
            <b>{c.title}</b>
            <span>{prettyDate(done.seat.class_date, true)} · {sess.time}</span>
          </div>
          {done.local
            ? <p className="muted">Your seat is saved on this phone. Tap below to email it to the team so they can send you the join link.</p>
            : <p className="muted">The team will send your join link before class. You can see or cancel your seat on the University home.</p>}
          {done.local && <a className="btn gold big" href={seatEmail(done.seat)}><Icon name="upload" size={18} /> Email my seat to the team</a>}
          <div className="class-cal">
            <button type="button" className="btn outline-gold" onClick={() => downloadIcs(done.seat)}><Icon name="calendar" size={18} /> Add to calendar</button>
            <a className="btn ghost" href={googleCalLink(done.seat)} target="_blank" rel="noopener noreferrer">Google Calendar ↗</a>
          </div>
          {c.prep.length > 0 && (
            <div className="class-prep">
              <small>Take these before class</small>
              {c.prep.map(id => lessonById(id)).filter(Boolean).map(l => <Link key={l!.id} to={`/lessons/${l!.id}`} onClick={onClose}>{l!.title} ›</Link>)}
            </div>
          )}
          <button type="button" className="btn ghost" onClick={onClose}>Done</button>
        </div>
      ) : (
        <div className={`stack class-form tone-${c.tone}`}>
          <div className="pop-banner">
            <small>✦ Free live class · {c.day} · {CLASS_TZ}</small>
            <b>{c.title}</b>
          </div>
          <fieldset>
            <legend>Daytime or evening?</legend>
            <div className="class-chips">
              {c.sessions.map(s => (
                <button key={s.label} type="button" aria-pressed={s.label === sessionLabel} className={`class-chip${s.label === sessionLabel ? ' on' : ''}`}
                  onClick={() => { setSessionLabel(s.label); setDate(nextDates(c, s.time)[0]) }}>
                  <small>{s.label}</small><b>{s.time}</b>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Which {c.day.replace(/s$/, '')}?</legend>
            <div className="class-chips">
              {dates.map(d => {
                const taken = signups.mine.some(m => m.class_id === c.id && m.class_date === d && m.session_label === sess.label)
                return (
                  <button key={d} type="button" aria-pressed={d === date} className={`class-chip${d === date ? ' on' : ''}`} onClick={() => setDate(d)}>
                    <b>{prettyDate(d)}</b>{taken && <small>✓ You're in</small>}
                  </button>
                )
              })}
            </div>
          </fieldset>
          <label>Your name<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" /></label>
          <label>Email for the join link<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" /></label>
          <label>Phone (optional, for a text reminder)<input type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="tel" /></label>
          {err && <p className="error">{err}</p>}
          <button type="button" className="btn gold big" disabled={busy || !name.trim() || !date} onClick={save}>{busy ? 'Saving…' : `Save my seat · ${date ? prettyDate(date) : ''} ${sess.time}`}</button>
          <p className="muted small">Free. Times are {CLASS_TZ}. Can't make it? Cancel any time from the University home.</p>
        </div>
      )}
    </Sheet>
  )
}
