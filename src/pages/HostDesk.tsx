import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Sheet from '../components/Sheet'
import { useSession } from '../lib/session'
import { useLiveClasses } from '../lib/classSchedule'
import { nextDates, prettyDate, timeToMinutes, useClassSignups, type Signup } from '../lib/classSignups'
import {
  QUEEN_ROOM, JOIN_EARLY_MIN, classReminderEmail, cleanLink, downloadText, easternToDate, joinState, openMeeting, queenConfirmEmail, queenIcs,
  serviceName, sessionLink, startsIn, useFreeAccess, useIsHost, useMeetingRooms, useNow, useQueenSessions, whenLabel, type QueenSession,
} from '../lib/meetings'
import { CLASS_TZ, QUEEN_SESSION, type LiveClass } from '../lessons/classes'

/* The Queen's Host desk: everything she runs, in one place.
   1. Up next: her classes and booked 1:1s with a big Start button that opens her meeting.
   2. Meeting rooms: paste a Zoom / Google Meet / Teams link once per class and once for her 1:1s.
   3. Time with the Queen: put a booked consult on the calendar so her client gets a Join button.
   4. Free for my team: give her team members' shops every feature, free.
   Open to hosts of the community calendar (the Queen and anyone she makes a host). */

type Event =
  | { kind: 'class'; key: string; c: LiveClass; label: 'Daytime' | 'Evening'; date: string; start: Date; minutes: number; link: string | null; seats: Signup[] }
  | { kind: 'queen'; key: string; s: QueenSession; start: Date; minutes: number; link: string | null }

const LENGTHS = [30, 60, 90, 120, 180]
const lenLabel = (m: number) => (m < 60 ? `${m} min` : `${m / 60} hr${m === 60 ? '' : 's'}`)

export default function HostDesk() {
  const host = useIsHost()
  if (host === null) return <div className="center-page"><p className="muted">Opening your Host desk…</p></div>
  if (!host) return (
    <div className="stack host-desk">
      <div className="pop-banner foil"><small>♛ Host desk</small><b>This desk is for the Queen and her hosts</b>
        <span>It's where live classes and Time with the Queen sessions are started. Looking for your own class or session? Your Join button is on the Dazzle University home and on Time with the Queen.</span></div>
      <div className="row-gap"><Link className="btn gold" to="/lessons">Dazzle University</Link><Link className="btn ghost" to="/consult">Time with the Queen</Link></div>
    </div>
  )
  return <Desk />
}

function Desk() {
  const now = useNow()
  const { classes } = useLiveClasses()
  const signups = useClassSignups()
  const { rooms, ready, save } = useMeetingRooms()
  const queen = useQueenSessions()
  const roomsRef = useRef<HTMLElement>(null)
  const [who, setWho] = useState<Extract<Event, { kind: 'class' }> | null>(null)
  const [booking, setBooking] = useState(false)

  const events = useMemo<Event[]>(() => {
    const out: Event[] = []
    for (const c of classes) for (const sess of c.sessions) for (const date of nextDates(c, sess.time, 2)) {
      const start = easternToDate(date, timeToMinutes(sess.time))
      out.push({ kind: 'class', key: `${c.id}|${date}|${sess.label}`, c, label: sess.label, date, start, minutes: c.minutes, link: rooms[c.id] ?? null,
        seats: signups.all.filter(r => r.class_id === c.id && r.class_date === date && r.session_label === sess.label) })
    }
    // Classes that started a moment ago are still "on now".
    for (const c of classes) for (const sess of c.sessions) {
      const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(now)
      const start = easternToDate(today, timeToMinutes(sess.time))
      const day = new Date(`${today}T12:00:00Z`).getUTCDay()
      if (day === c.weekday && !(c.skip ?? []).includes(today) && joinState(start, c.minutes, now) === 'open' && now >= start)
        out.push({ kind: 'class', key: `${c.id}|${today}|${sess.label}`, c, label: sess.label, date: today, start, minutes: c.minutes, link: rooms[c.id] ?? null,
          seats: signups.all.filter(r => r.class_id === c.id && r.class_date === today && r.session_label === sess.label) })
    }
    for (const s of queen.list.filter(x => x.status === 'booked'))
      out.push({ kind: 'queen', key: s.id, s, start: new Date(s.starts_at), minutes: s.minutes, link: sessionLink(s) })
    const seen = new Set<string>()
    return out.filter(e => joinState(e.start, e.minutes, now) !== 'over' && !seen.has(e.key) && (seen.add(e.key), true))
      .sort((a, b) => a.start.getTime() - b.start.getTime()).slice(0, 5)
  }, [classes, rooms, signups.all, queen.list, now])

  const goRooms = () => roomsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const [first, ...rest] = events

  return (
    <div className="stack wide-gap host-desk">
      <div className="page-head">
        <div className="stack tight-gap">
          <span className="script">Your stage, Queen</span>
          <h1>Host desk</h1>
          <p className="muted">Start your live classes and 1:1 sessions here. Tap Start, and your meeting opens. Everyone with a seat gets a Join button {JOIN_EARLY_MIN} minutes before. Times are {CLASS_TZ}.</p>
        </div>
      </div>

      {ready === false && (
        <div className="card host-setup"><b>One quick setup step first</b>
          <p className="muted">Ask Logan to run <code>020_host_desk.sql</code> in Supabase. Then meeting links, bookings and free access all save here.</p></div>
      )}

      {first ? <NextUp e={first} now={now} onWho={setWho} onNeedLink={goRooms} /> : (
        <div className="card"><b>Nothing on the calendar yet</b><p className="muted">Your classes show here once they have dates. Add a booked 1:1 below.</p></div>
      )}

      {rest.length > 0 && (
        <section className="stack">
          <h2 className="section-title">Coming up</h2>
          <ul className="host-list">
            {rest.map(e => <EventRow key={e.key} e={e} now={now} onWho={setWho} onNeedLink={goRooms} />)}
          </ul>
        </section>
      )}

      <section className="stack" ref={roomsRef}>
        <h2 className="section-title">Your meeting rooms</h2>
        <p className="muted">Paste a meeting link once and it's used every week. One for each class, and one for your 1:1s.</p>
        <div className="host-rooms">
          {classes.map(c => <RoomField key={c.id} label={c.title} sub={`${c.day} · ${c.sessions.map(s => s.time).join(' and ')}`} value={rooms[c.id] ?? ''} onSave={v => save(c.id, v)} />)}
          <RoomField label="Time with the Queen (1:1)" sub="Private: only you, your hosts and the booked client see it" value={rooms[QUEEN_ROOM] ?? ''} onSave={v => save(QUEEN_ROOM, v)} />
        </div>
        <LinkHelp />
      </section>

      <section className="stack">
        <div className="row-between"><h2 className="section-title">Time with the Queen</h2>
          <button type="button" className="btn gold" onClick={() => setBooking(true)}><Icon name="plus" size={18} />Book a session</button></div>
        <p className="muted">When a client's deposit is in, put her session here. She sees it in her app with a Join button, and you can email her the details in one tap.</p>
        {queen.ready === false ? <p className="muted small">Saves once 020_host_desk.sql is run.</p> : (
          queen.list.filter(s => s.status === 'booked').length === 0
            ? <p className="muted small">No booked sessions yet.</p>
            : <ul className="host-list">{queen.list.filter(s => s.status === 'booked').map(s => <QueenRow key={s.id} s={s} now={now} onDone={() => queen.setStatus(s.id, 'done')} onCancel={() => { if (window.confirm(`Cancel ${s.client_name}'s session?`)) queen.setStatus(s.id, 'cancelled') }} />)}</ul>
        )}
      </section>

      <FreeTeam />

      {who && <WhoSheet e={who} onClose={() => setWho(null)} />}
      {booking && <BookSheet onClose={() => setBooking(false)} add={queen.add} queenRoom={rooms[QUEEN_ROOM] ?? null} />}
    </div>
  )
}

function eventTitle(e: Event) { return e.kind === 'class' ? e.c.title : `Time with the Queen: ${e.s.client_name}` }
function eventSub(e: Event) { return e.kind === 'class' ? `${e.label} class · ${e.seats.length} seat${e.seats.length === 1 ? '' : 's'} saved` : `${lenLabel(e.minutes)}${e.s.topic ? ` · ${e.s.topic}` : ''}` }

function StartButton({ e, now, big, onNeedLink }: { e: Event; now: Date; big?: boolean; onNeedLink: () => void }) {
  if (!e.link) return <button type="button" className={`btn outline-gold${big ? ' big' : ''}`} onClick={onNeedLink}>Add your meeting link first</button>
  const open = joinState(e.start, e.minutes, now) === 'open'
  return (
    <button type="button" className={`btn ${open ? 'gold host-start-on' : 'ghost'}${big ? ' big' : ''}`} onClick={() => openMeeting(e.link!)}>
      <Icon name="live" size={big ? 22 : 18} />{open ? 'Start' : 'Open early'} {e.kind === 'class' ? 'class' : 'session'} in {serviceName(e.link)}
    </button>
  )
}

function NextUp({ e, now, onWho, onNeedLink }: { e: Event; now: Date; onWho: (e: Extract<Event, { kind: 'class' }>) => void; onNeedLink: () => void }) {
  const open = joinState(e.start, e.minutes, now) === 'open'
  return (
    <section className={`host-next${open ? ' on' : ''}`}>
      <span className="eyebrow">{open ? '● You\'re on' : 'Next up'} · {startsIn(e.start, e.minutes, now)}</span>
      <h2>{eventTitle(e)}</h2>
      <p className="host-when">{whenLabel(e.start)}</p>
      <p className="muted">{eventSub(e)}</p>
      <StartButton e={e} now={now} big onNeedLink={onNeedLink} />
      <div className="row-gap">
        {e.kind === 'class' && <button type="button" className="btn ghost small" onClick={() => onWho(e)}><Icon name="users" size={16} />Who's coming ({e.seats.length})</button>}
        {e.kind === 'queen' && <a className="btn ghost small" href={queenConfirmEmail(e.s)}>Email her the link</a>}
      </div>
      {open && <p className="small host-tip">Tip: give people two or three minutes to come in, then start with a warm welcome and what they'll leave with today.</p>}
    </section>
  )
}

function EventRow({ e, now, onWho, onNeedLink }: { e: Event; now: Date; onWho: (e: Extract<Event, { kind: 'class' }>) => void; onNeedLink: () => void }) {
  return (
    <li className="host-row">
      <div className="host-row-text">
        <b>{eventTitle(e)}</b>
        <span>{whenLabel(e.start)} · {startsIn(e.start, e.minutes, now)}</span>
        <small className="muted">{eventSub(e)}</small>
      </div>
      <div className="host-row-actions">
        {e.kind === 'class' && <button type="button" className="btn ghost small" onClick={() => onWho(e)}>Who's coming</button>}
        <StartButton e={e} now={now} onNeedLink={onNeedLink} />
      </div>
    </li>
  )
}

function QueenRow({ s, now, onDone, onCancel }: { s: QueenSession; now: Date; onDone: () => void; onCancel: () => void }) {
  const start = new Date(s.starts_at)
  return (
    <li className="host-row">
      <div className="host-row-text">
        <b>{s.client_name}</b>
        <span>{whenLabel(start)} · {lenLabel(s.minutes)} · {startsIn(start, s.minutes, now)}</span>
        <small className="muted">{s.client_email}{s.client_phone ? ` · ${s.client_phone}` : ''}{s.topic ? ` · ${s.topic}` : ''}</small>
      </div>
      <div className="host-row-actions">
        <a className="btn ghost small" href={queenConfirmEmail(s)}>Email details</a>
        <button type="button" className="btn ghost small" onClick={() => downloadText(`time-with-the-queen-${s.starts_at.slice(0, 10)}.ics`, queenIcs(s))}>Calendar invite</button>
        <button type="button" className="btn ghost small" onClick={onDone}>✓ Done</button>
        <button type="button" className="link-btn" onClick={onCancel}>Cancel</button>
      </div>
    </li>
  )
}

function RoomField({ label, sub, value, onSave }: { label: string; sub: string; value: string; onSave: (v: string) => Promise<string | null> }) {
  const [draft, setDraft] = useState(value)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [seen, setSeen] = useState(value)
  if (value !== seen) { setSeen(value); setDraft(value) }
  const changed = draft.trim() !== value
  async function go() {
    setBusy(true); setMsg(null)
    const err = await onSave(draft)
    setBusy(false)
    setMsg(err ? { ok: false, text: err } : { ok: true, text: draft.trim() ? 'Saved. Everyone with a seat gets this link.' : 'Link removed.' })
  }
  return (
    <div className="card host-room">
      <b>{label}</b><small className="muted">{sub}</small>
      <label className="sr-only" htmlFor={`room-${label}`}>Meeting link for {label}</label>
      <input id={`room-${label}`} type="url" inputMode="url" placeholder="Paste your Zoom, Google Meet or Teams link" value={draft} onChange={e => { setDraft(e.target.value); setMsg(null) }} />
      <div className="row-gap">
        <button type="button" className="btn gold small" disabled={busy || !changed} onClick={go}>{busy ? 'Saving…' : 'Save link'}</button>
        {value && <button type="button" className="btn ghost small" onClick={() => openMeeting(value)}>Test it ({serviceName(value)})</button>}
      </div>
      {msg && <p className={msg.ok ? 'sched-ok small' : 'danger-text small'}>{msg.text}</p>}
    </div>
  )
}

function LinkHelp() {
  return (
    <details className="card host-help">
      <summary><b>How do I get a meeting link?</b></summary>
      <div className="stack">
        <div><b>Google Meet (free)</b>
          <ol><li>Go to meet.google.com and sign in with a Google account.</li><li>Tap <i>New meeting</i>, then <i>Create a meeting for later</i>.</li><li>Copy the link and paste it here. It works every week.</li></ol>
          <small className="muted">Free: up to 100 people. Group calls end at 60 minutes, which fits a one-hour class. 1:1 calls can run up to 24 hours.</small></div>
        <div><b>Zoom</b>
          <ol><li>Sign in at zoom.us, open <i>Meetings</i>, then <i>Personal Room</i>.</li><li>Copy the invite link and paste it here.</li></ol>
          <small className="muted">The free plan ends every meeting at 40 minutes. A paid Pro plan (about $16 a month) runs up to 30 hours.</small></div>
        <div><b>Microsoft Teams (free)</b>
          <ol><li>Sign in at teams.live.com with a Microsoft account (a Hotmail or Outlook address works).</li><li>Choose <i>Create a link</i> under Meet, then copy it.</li></ol>
          <small className="muted">Free: up to 100 people for 60 minutes.</small></div>
        <small className="muted">Guests join from a phone or computer by tapping the link. On a computer it opens in the web browser. On a phone it may ask to open the free app.</small>
      </div>
    </details>
  )
}

function WhoSheet({ e, onClose }: { e: Extract<Event, { kind: 'class' }>; onClose: () => void }) {
  const emails = e.seats.map(r => r.email).filter((x): x is string => !!x)
  return (
    <Sheet open onClose={onClose} title="Who's coming">
      <div className="stack">
        <div className="pop-banner"><small>{prettyDate(e.date, true)} · {e.label} · {CLASS_TZ}</small><b>{e.c.title}</b><span>{e.seats.length} seat{e.seats.length === 1 ? '' : 's'} saved</span></div>
        {e.seats.length === 0 ? <p className="muted">No seats saved yet. Share the class in your Facebook group and on your lives.</p> : (
          <ul className="host-who">{e.seats.map(r => <li key={r.id}><b>{r.name}</b>{r.email && <span>{r.email}</span>}{r.phone && <span>{r.phone}</span>}</li>)}</ul>
        )}
        {emails.length > 0 && <a className="btn gold big" href={classReminderEmail({ emails, title: e.c.title, when: whenLabel(e.start), link: e.link })}>Email everyone the join link</a>}
        {emails.length > 0 && <button type="button" className="btn ghost" onClick={() => navigator.clipboard?.writeText(emails.join(', '))}>Copy all emails</button>}
        <button type="button" className="btn ghost" onClick={onClose}>Close</button>
      </div>
    </Sheet>
  )
}

function BookSheet({ onClose, add, queenRoom }: { onClose: () => void; add: ReturnType<typeof useQueenSessions>['add']; queenRoom: string | null }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(() => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date(Date.now() + 86400000)))
  const [time, setTime] = useState('11:00')
  const [minutes, setMinutes] = useState(60)
  const [topic, setTopic] = useState('')
  const [link, setLink] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [done, setDone] = useState<QueenSession | null>(null)

  async function save() {
    const [h, m] = time.split(':').map(Number)
    const start = easternToDate(date, h * 60 + m)
    if (start.getTime() < Date.now() - 3600000) { setErr('That time has already passed. Pick a date and time ahead.'); return }
    setBusy(true); setErr('')
    const own = link.trim() ? cleanLink(link) : null
    if (link.trim() && !own) { setBusy(false); setErr('That meeting link doesn\'t look right. Paste the whole link, or leave it empty to use your 1:1 room.'); return }
    const r = await add({ client_name: name.trim(), client_email: email.trim(), client_phone: phone.trim() || null, starts_at: start.toISOString(), minutes, topic: topic.trim() || null, join_url: own ?? queenRoom })  // Copy the 1:1 room onto the booking: the client can't see the private room itself.
    setBusy(false)
    if (typeof r === 'string') setErr(r); else setDone(r)
  }

  return (
    <Sheet open onClose={onClose} title={done ? 'Booked!' : 'Book a session'}>
      {done ? (
        <div className="stack">
          <div className="pop-banner foil"><small>♛ Time with the Queen</small><b>{done.client_name}</b><span>{whenLabel(new Date(done.starts_at))} · {lenLabel(done.minutes)}</span></div>
          <p className="muted">It's on your Host desk. If she signs in with {done.client_email}, she sees it under Time with the Queen with a Join button {JOIN_EARLY_MIN} minutes before. Send her the details now:</p>
          <a className="btn gold big" href={queenConfirmEmail(done)}>Email her the details and link</a>
          <button type="button" className="btn ghost" onClick={() => downloadText(`time-with-the-queen-${done.starts_at.slice(0, 10)}.ics`, queenIcs(done))}><Icon name="calendar" size={18} />Download a calendar invite</button>
          {!sessionLink(done) && <p className="danger-text small">No meeting link yet. Add your 1:1 room under Your meeting rooms so she has one to join.</p>}
          <button type="button" className="btn ghost" onClick={onClose}>Done</button>
        </div>
      ) : (
        <div className="stack">
          <p className="muted">Book it once her {Math.round(QUEEN_SESSION.deposit * 100)}% deposit is in. Times are {CLASS_TZ}.</p>
          <label>Her name<input value={name} onChange={e => setName(e.target.value)} autoComplete="off" /></label>
          <label>Her email (the one she signs in with)<input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="off" /></label>
          <label>Phone (optional)<input type="tel" value={phone} onChange={e => setPhone(e.target.value)} autoComplete="off" /></label>
          <div className="sched-times">
            <label>Date<input type="date" value={date} onChange={e => e.target.value && setDate(e.target.value)} /></label>
            <label>Time (ET)<input type="time" value={time} onChange={e => e.target.value && setTime(e.target.value)} /></label>
          </div>
          <fieldset><legend>How long?</legend>
            <div className="class-chips">{LENGTHS.map(l => <button key={l} type="button" aria-pressed={l === minutes} className={`class-chip${l === minutes ? ' on' : ''}`} onClick={() => setMinutes(l)}><b>{lenLabel(l)}</b></button>)}</div>
          </fieldset>
          <label>What you'll work on (optional)<input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Pricing for profit" /></label>
          <label>Meeting link (optional)<input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder={queenRoom ? `Leave empty to use your 1:1 room (${serviceName(queenRoom)})` : 'Paste a link, or save your 1:1 room first'} /></label>
          {err && <p className="danger-text">{err}</p>}
          <button type="button" className="btn gold big" disabled={busy || !name.trim() || !/\S+@\S+\.\S+/.test(email)} onClick={save}>{busy ? 'Saving…' : 'Book it'}</button>
        </div>
      )}
    </Sheet>
  )
}

function FreeTeam() {
  const { shop } = useSession()
  const free = useFreeAccess(true)
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  async function go(e: string, on: boolean) {
    setBusy(true); setMsg(null)
    const r = await free.set(e, on)
    setBusy(false); setMsg(r)
    if (r.ok && on) setEmail('')
  }
  return (
    <section className="stack">
      <h2 className="section-title">Free for you and your team</h2>
      <p className="muted">You built this, so you and your team never pay. Shops on this list get every feature free: Dazzle University, team members, everything. Everyone else picks a plan. Helpers you invite in Settings, Team members, already work inside your shop for free. Add someone here when she runs her own shop too.</p>
      {free.ready === false ? <p className="muted small">Saves once 020_host_desk.sql is run.</p> : (
        <>
          <ul className="host-list">
            {free.list.map(f => (
              <li key={f.shop_id} className="host-row">
                <div className="host-row-text"><b>{f.shop_name}{f.shop_id === shop?.id ? ' (your shop)' : ''}</b><small className="muted">{f.owner_email}</small></div>
                {f.shop_id !== shop?.id && <div className="host-row-actions"><button type="button" className="link-btn" disabled={busy} onClick={() => { if (window.confirm(`Remove free access for ${f.shop_name}?`)) go(f.owner_email, false) }}>Remove</button></div>}
              </li>
            ))}
          </ul>
          <div className="host-free-add">
            <label>Her sign-in email<input type="email" value={email} onChange={e => { setEmail(e.target.value); setMsg(null) }} placeholder="name@email.com" /></label>
            <button type="button" className="btn gold" disabled={busy || !/\S+@\S+\.\S+/.test(email)} onClick={() => go(email, true)}>Give free access</button>
          </div>
          {msg && <p className={msg.ok ? 'sched-ok' : 'danger-text'}>{msg.text}</p>}
        </>
      )}
    </section>
  )
}
