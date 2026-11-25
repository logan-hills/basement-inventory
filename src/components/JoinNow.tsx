import { Link } from 'react-router-dom'
import Icon from './Icon'
import { getLiveClasses, useLiveClasses } from '../lib/classSchedule'
import { timeToMinutes, useClassSignups, type Signup } from '../lib/classSignups'
import { JOIN_EARLY_MIN, easternToDate, joinState, sessionLink, serviceName, startsIn, useIsHost, useMeetingRooms, useNow, useQueenSessions, whenLabel } from '../lib/meetings'
import type { LiveClass } from '../lessons/classes'

/* Join buttons. Everyone with a class seat or a booked 1:1 gets one, from 15 minutes before the start
   until the end, so nobody has to dig through email for a link. */

/** When a seat's class starts, as a real moment. */
export function seatStart(seat: Signup, c?: LiveClass) {
  const cls = c ?? getLiveClasses().find(x => x.id === seat.class_id)
  const time = cls?.sessions.find(x => x.label === seat.session_label)?.time ?? '12:00 PM'
  return { start: easternToDate(seat.class_date, timeToMinutes(time)), minutes: cls?.minutes ?? 60 }
}

/** On a seat row (University home): "Join class now" when it's time, otherwise when it will appear. */
export function SeatJoin({ seat, c }: { seat: Signup; c: LiveClass }) {
  const now = useNow()
  const { rooms } = useMeetingRooms()
  const { start, minutes } = seatStart(seat, c)
  const state = joinState(start, minutes, now)
  const link = rooms[c.id]
  if (state === 'over') return null
  if (state === 'open' && link) return <a className="uni-join" href={link} target="_blank" rel="noopener noreferrer"><Icon name="live" size={18} />Join class now</a>
  if (state === 'open') return <span className="uni-join-wait">Class is starting. The team will share the link any moment.</span>
  const opens = new Date(start.getTime() - JOIN_EARLY_MIN * 60000)
  return <span className="uni-join-wait">Your Join button shows here at {opens.toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' })} ET</span>
}

/** A banner on Home when a class or 1:1 is about to start: Join for guests, Start for the Queen. */
export function JoinNowBanner() {
  const now = useNow()
  const host = useIsHost()
  const { classes } = useLiveClasses()
  const signups = useClassSignups()
  const { rooms } = useMeetingRooms()
  const queen = useQueenSessions()

  // The Queen and her hosts: any class or booked 1:1 that's on now.
  if (host) {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(now)
    const dayOf = new Date(`${today}T12:00:00Z`).getUTCDay()
    const cls = classes.flatMap(c => c.weekday === dayOf && !(c.skip ?? []).includes(today)
      ? c.sessions.map(s => ({ title: c.title, start: easternToDate(today, timeToMinutes(s.time)), minutes: c.minutes })) : [])
    const ones = queen.list.filter(s => s.status === 'booked').map(s => ({ title: `Time with the Queen: ${s.client_name}`, start: new Date(s.starts_at), minutes: s.minutes }))
    const on = [...cls, ...ones].filter(e => joinState(e.start, e.minutes, now) === 'open').sort((a, b) => a.start.getTime() - b.start.getTime())[0]
    if (on) return (
      <section className="join-now" aria-live="polite">
        <div><b>♛ You're on: {on.title}</b><span>{whenLabel(on.start)} · {startsIn(on.start, on.minutes, now)}</span></div>
        <Link to="/host" className="btn gold"><Icon name="live" size={18} />Open my Host desk</Link>
      </section>
    )
  }

  // Guests: my class seats and my booked 1:1s.
  const seats = signups.mine.map(m => {
    const c = classes.find(x => x.id === m.class_id)
    const { start, minutes } = seatStart(m, c)
    return { title: c?.title ?? 'Live class', start, minutes, link: c ? rooms[c.id] ?? null : null }
  })
  const ones = queen.mine.filter(s => s.status === 'booked').map(s => ({ title: 'Time with the Queen', start: new Date(s.starts_at), minutes: s.minutes, link: sessionLink(s) }))
  const on = [...seats, ...ones].filter(e => joinState(e.start, e.minutes, now) === 'open').sort((a, b) => a.start.getTime() - b.start.getTime())[0]
  if (!on) return null
  return (
    <section className="join-now" aria-live="polite">
      <div><b>{on.title}</b><span>{whenLabel(on.start)} · {startsIn(on.start, on.minutes, now)}</span></div>
      {on.link
        ? <a className="btn gold" href={on.link} target="_blank" rel="noopener noreferrer"><Icon name="live" size={18} />Join now in {serviceName(on.link)}</a>
        : <span className="muted small">The join link is on its way from the team.</span>}
    </section>
  )
}
