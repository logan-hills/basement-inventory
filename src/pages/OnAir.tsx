import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StreamSetup from '../components/StreamSetup'
import { supabase } from '../lib/supabase'
import {
  loadSlot, loadSlotKey, loadMyStages, pokeTimer, chime, fmtCountdown, fmtTime, fmtDay, SLOT_FIELDS,
  type Slot, type Stage,
} from '../lib/stage'

/** The seller's screen for one slot: stream key, countdown, wrap-up warning, hard stop. */
export default function OnAir() {
  const { id = '' } = useParams()
  const [slot, setSlot] = useState<Slot | null | undefined>(undefined)
  const [stage, setStage] = useState<Stage | null>(null)
  const [key, setKey] = useState<string | null>(null)
  const [next, setNext] = useState<Slot | null>(null)
  const [now, setNow] = useState(Date.now())
  const warned = useRef(false)
  const lastMin = useRef(false)
  const poked = useRef<Set<string>>(new Set())

  // Clock.
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(t) }, [])

  // Slot + stage, refreshed every 5 seconds and whenever it changes.
  useEffect(() => {
    let alive = true
    async function load() {
      const s = await loadSlot(id).catch(() => null)
      if (!alive) return
      setSlot(s)
      if (!s) return
      if (['ready', 'live', 'ending'].includes(s.status)) setKey(await loadSlotKey(s.id))
      const st = (await loadMyStages().catch(() => [])).find(x => x.stage.id === s.stage_id)
      if (alive && st) setStage(st.stage)
      const { data } = await supabase.from('live_slots').select(SLOT_FIELDS).eq('stage_id', s.stage_id).neq('status', 'cancelled')
        .gte('starts_at', s.ends_at).order('starts_at').limit(1)
      if (alive) setNext((data?.[0] as Slot) ?? null)
    }
    load()
    const t = setInterval(load, 5000)
    const ch = supabase.channel(`slot-${id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'live_slots', filter: `id=eq.${id}` }, () => load())
      .subscribe()
    return () => { alive = false; clearInterval(t); supabase.removeChannel(ch) }
  }, [id])

  const start = slot ? Date.parse(slot.starts_at) : 0
  const end = slot ? Date.parse(slot.ends_at) : 0
  const warnMs = (stage?.warn_min ?? 5) * 60000
  const prepMs = (stage?.prep_min ?? 5) * 60000

  // Nudge the server timer at the exact moments that matter, so start and stop land on the second.
  useEffect(() => {
    if (!slot) return
    const moments: [string, number][] = [['prep', start - prepMs], ['start', start], ['end', end]]
    for (const [name, at] of moments) {
      if (now >= at && now < at + 60000 && !poked.current.has(name)) { poked.current.add(name); pokeTimer() }
    }
  }, [now, slot, start, end, prepMs])

  // Wrap-up warning sound, then a last-minute sound.
  const left = end - now
  const onAir = now >= start && now < end
  useEffect(() => {
    if (!onAir) return
    if (left <= warnMs && !warned.current) { warned.current = true; chime(2) }
    if (left <= 60000 && !lastMin.current) { lastMin.current = true; chime(3) }
  }, [onAir, left, warnMs])

  if (slot === undefined) return <div className="center-page"><p className="muted">Loading…</p></div>
  if (slot === null) return <div className="stack"><h1>Slot not found</h1><Link to="/shared-page">Back to Shared Page lives</Link></div>

  const before = now < start
  const after = now >= end || ['ended', 'missed'].includes(slot.status)
  const wrap = onAir && left <= warnMs
  const keyOpen = now >= start - prepMs

  let phase: string, big: string, sub: string
  if (slot.status === 'cancelled') { phase = 'off'; big = 'Cancelled'; sub = 'This slot was cancelled.' }
  else if (after) { phase = 'off'; big = 'Time is up'; sub = slot.went_live_at ? `Your live ended at ${fmtTime(slot.ends_at)}. Great show!` : slot.status === 'missed' && slot.last_error ? slot.last_error : 'This slot is over.' }
  else if (before) { phase = keyOpen ? 'ready' : 'wait'; big = fmtCountdown(start - now); sub = keyOpen ? `Your Go Live key is ready. Start streaming now for a private test. Nobody sees you until ${fmtTime(start)} exactly.` : `until your live. Your Go Live key unlocks at exactly ${fmtTime(start - prepMs)}.` }
  else if (slot.status === 'live' && slot.went_live_at) { phase = wrap ? 'wrap' : 'live'; big = fmtCountdown(left); sub = wrap ? 'Wrap it up! Last call, thank your buyers, and say goodbye.' : `left. Hard stop at ${fmtTime(end)}.` }
  else { phase = 'waiting'; big = fmtCountdown(left); sub = `It's your time! Paste your key into your streaming app and start. You go live the moment your video arrives. Not streaming by ${fmtTime(start + (stage?.late_cancel_min ?? 10) * 60000)} = live canceled.` }

  return (
    <div className={`stack wide-gap onair phase-${phase}`}>
      <div className="page-head">
        <div>
          <span className="eyebrow">{stage?.name ?? 'Shared Page'} · {fmtDay(slot.starts_at)}</span>
          <h1>{slot.title}</h1>
          <p className="muted small">{fmtTime(slot.starts_at)} to {fmtTime(slot.ends_at)} · {slot.seller_name}</p>
        </div>
        <Link className="btn ghost" to="/shared-page">All slots</Link>
      </div>

      <div className="onair-hero">
        {phase === 'live' || phase === 'wrap' ? <span className="onair-badge">● ON AIR</span> : phase === 'ready' ? <span className="onair-badge soft">Preview, not public yet</span> : null}
        <div className="onair-clock" aria-live="off">{big}</div>
        <p className="onair-sub">{sub}</p>
        {wrap && <div className="onair-wrap" role="alert">⏰ {Math.ceil(left / 60000)} minute{Math.ceil(left / 60000) === 1 ? '' : 's'} left · hard stop at {fmtTime(end)}</div>}
        {slot.last_error && !after && <p className="onair-error">{slot.last_error}</p>}
        {next && !after && <p className="muted small">Up next: {next.seller_name} at {fmtTime(next.starts_at)}</p>}
      </div>

      {!after && slot.status !== 'cancelled' && keyOpen && (
        <div className="card stack onair-go">
          <h2>Go live now</h2>
          <StreamSetup url={key} />
        </div>
      )}
      {!after && slot.status !== 'cancelled' && !keyOpen && (
        <div className="card stack">
          <h2>Get your streaming app ready</h2>
          <p className="muted">Your Go Live key unlocks 5 minutes before your start time, only on the night you booked, for a private test. You go public at your exact start time. Set up your app now so you just paste and go.</p>
          <StreamSetup url={null} />
        </div>
      )}

      {slot.live_id && slot.fb_live_video_id && (
        <Link className="btn outline-gold" to={`/lives/${slot.live_id}/bot?slot=${slot.id}`}>Open live comments and claims</Link>
      )}
    </div>
  )
}
