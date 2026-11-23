import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { chime, fmtCountdown, fmtTime, loadMyNextSlot, type Slot } from '../lib/stage'

const WARN_MS = 5 * 60000

/**
 * A slim bar on every screen when your shared-Page slot is close or on air,
 * so the wrap-up warning reaches you even while you are on another page of the app.
 */
export default function OnAirBar() {
  const { pathname } = useLocation()
  const [slot, setSlot] = useState<Slot | null>(null)
  const [now, setNow] = useState(Date.now())
  const warned = useRef<string>('')

  useEffect(() => {
    let alive = true
    const load = () => loadMyNextSlot().then(s => { if (alive) setSlot(s) }).catch(() => null)
    load()
    const t = setInterval(load, 30000)
    return () => { alive = false; clearInterval(t) }
  }, [])
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])

  const start = slot ? Date.parse(slot.starts_at) : 0
  const end = slot ? Date.parse(slot.ends_at) : 0
  const onPage = pathname.startsWith('/on-air')
  const wrap = !!slot && now >= start && now < end && end - now <= WARN_MS

  useEffect(() => {
    if (wrap && !onPage && slot && warned.current !== slot.id) { warned.current = slot.id; chime(2) }
  }, [wrap, onPage, slot])

  if (!slot || onPage || now >= end || now < start - 30 * 60000) return null
  const live = now >= start
  const streaming = slot.status === 'live' && !!slot.went_live_at
  return (
    <Link to={`/on-air/${slot.id}`} className={`onair-bar no-print ${wrap ? 'wrap' : live ? 'live' : ''}`}>
      {live
        ? <span><b>{wrap ? 'Wrap it up!' : streaming ? '● On air' : 'It\'s your time! Get your Go Live key'}</b> {fmtCountdown(end - now)} left · hard stop {fmtTime(end)}</span>
        : <span><b>Your slot</b> starts in {fmtCountdown(start - now)} · {slot.title}</span>}
      <span className="onair-bar-go">Open On Air ›</span>
    </Link>
  )
}
