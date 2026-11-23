import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Sheet from '../components/Sheet'
import Avatar from '../components/Avatar'
import { loadPublicProfiles, type PublicProfile } from '../lib/profile'
import { supabase } from '../lib/supabase'
import { useToast } from '../lib/toast'
import { loadLives, type Live } from '../lib/lives'
import { fbConfigured, facebookLogin, loadFacebook } from '../lib/facebook'
import {
  loadMyStages, loadMembers, loadSlots, friendlySlotError, fmtTime, fmtDay, STATUS_LABEL,
  type Stage, type StageMember, type Slot,
} from '../lib/stage'

const pad = (n: number) => String(n).padStart(2, '0')
const dateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const HOURS = Array.from({ length: 24 }, (_, h) => h)
const hourText = (h: number) => new Date(2000, 0, 1, h).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

function Welcome({ onDone }: { onDone: () => void }) {
  const toast = useToast()
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  async function join(e: FormEvent) {
    e.preventDefault(); setBusy(true)
    const { error } = await supabase.rpc('join_stage', { p_code: code })
    setBusy(false)
    if (error) return toast(friendlySlotError(error.message), { kind: 'bad' })
    toast('You joined the shared Page', { kind: 'ok' }); onDone()
  }
  async function create(e: FormEvent) {
    e.preventDefault(); setBusy(true)
    const { error } = await supabase.from('stages').insert({ name: name.trim() || 'Our shared Page' })
    setBusy(false)
    if (error) return toast(friendlySlotError(error.message), { kind: 'bad' })
    toast('Shared Page created. Next, connect Facebook.', { kind: 'ok' }); onDone()
  }
  return (
    <div className="stack wide-gap">
      <div className="page-head"><div><span className="eyebrow">Sell</span><h1>Shared Page lives</h1></div></div>
      <p className="muted lead">Take turns going live on one Facebook Page. Book your time, get your own private stream key, and the app starts and ends your live right on time. Nobody ever needs the Page password.</p>
      <div className="stage-welcome">
        <form className="card stack" onSubmit={join}>
          <h2>Join with an invite code</h2>
          <p className="muted small">The Page's host gives you a 6-letter code.</p>
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="ABC123" maxLength={6} className="code-input" required />
          <button className="btn primary big" disabled={busy || code.length < 6}>Join</button>
        </form>
        <form className="card stack" onSubmit={create}>
          <h2>Host a shared Page</h2>
          <p className="muted small">For the Page owner or an admin. You will connect the Facebook Page once and invite sellers.</p>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Dynamic Dazzle Live Hub" />
          <button className="btn gold big" disabled={busy}>Set it up</button>
        </form>
      </div>
    </div>
  )
}

function HostPanel({ stage, members, onChange }: { stage: Stage; members: StageMember[]; onChange: () => void }) {
  const toast = useToast()
  const [pages, setPages] = useState<{ id: string; name: string; followers: number | null; can_live: boolean }[] | null>(null)
  const [userToken, setUserToken] = useState('')
  const [busy, setBusy] = useState(false)
  const [warn, setWarn] = useState(String(stage.warn_min))
  const [prep, setPrep] = useState(String(stage.prep_min))

  useEffect(() => { if (fbConfigured) loadFacebook().catch(() => null) }, [])
  useEffect(() => { setWarn(String(stage.warn_min)); setPrep(String(stage.prep_min)) }, [stage])

  async function call(body: Record<string, unknown>) {
    const { data, error } = await supabase.functions.invoke('fb-page-connect', { body: { stage_id: stage.id, ...body } })
    if (error) {
      let msg = error.message
      try { msg = (await (error as any).context.json()).error ?? msg } catch { /* keep message */ }
      throw new Error(msg)
    }
    return data
  }

  async function connect() {
    setBusy(true)
    try {
      const FB = await loadFacebook()
      const token = await facebookLogin(FB)
      setUserToken(token)
      const data = await call({ action: 'pages', user_token: token })
      setPages(data.pages ?? [])
      if (!data.pages?.length) toast('That Facebook account does not manage any Pages', { kind: 'bad' })
    } catch (e: any) { toast(e.message, { kind: 'bad' }) }
    setBusy(false)
  }
  async function pick(pageId: string) {
    setBusy(true)
    try { const d = await call({ action: 'connect', user_token: userToken, page_id: pageId }); toast(`Connected ${d.page.name}`, { kind: 'ok' }); setPages(null); onChange() } catch (e: any) { toast(e.message, { kind: 'bad' }) }
    setBusy(false)
  }
  async function disconnect() {
    if (!confirm('Disconnect the Facebook Page? Booked slots will not get stream keys until it is connected again.')) return
    setBusy(true)
    try { await call({ action: 'disconnect' }); toast('Disconnected', { kind: 'ok' }); onChange() } catch (e: any) { toast(e.message, { kind: 'bad' }) }
    setBusy(false)
  }
  async function saveTimes() {
    const { error } = await supabase.from('stages').update({ warn_min: parseInt(warn, 10), prep_min: parseInt(prep, 10) }).eq('id', stage.id)
    if (error) toast(error.message, { kind: 'bad' }); else { toast('Saved', { kind: 'ok' }); onChange() }
  }
  async function member(m: StageMember, patch: { role?: string; remove?: boolean }) {
    if (patch.remove && !confirm(`Remove ${m.display_name}? Their booked slots will be cancelled.`)) return
    const { error } = await supabase.rpc('set_stage_member', { p_stage: stage.id, p_user: m.user_id, p_role: patch.role ?? null, p_name: null, p_remove: !!patch.remove })
    if (error) toast(error.message, { kind: 'bad' }); else onChange()
  }

  return (
    <details className="card stack host-panel" open={!stage.fb_page_id}>
      <summary><span className="eyebrow">Host tools</span><b>Facebook connection, invites and sellers</b></summary>
      <div className="stack">
        <div className="stack tight-gap">
          <h3>Facebook Page</h3>
          {stage.fb_page_id ? (
            <div className="row-between"><span><span className="dot ok" /> Connected to <b>{stage.fb_page_name}</b></span><button className="btn ghost small" disabled={busy} onClick={disconnect}>Disconnect</button></div>
          ) : !fbConfigured ? (
            <p className="muted small">The Facebook app is not set up yet. Once the App ID is added, a Connect button appears here.</p>
          ) : (
            <>
              <p className="muted small">A Page admin signs in with Facebook once. The Page login is never shared with sellers, and the app only gets permission to start and end lives and read comments.</p>
              <button className="btn primary" disabled={busy} onClick={connect}>{busy ? 'Connecting…' : 'Connect Facebook Page'}</button>
            </>
          )}
          {pages && pages.length > 0 && (
            <div className="stack tight-gap">
              <span className="muted small">Pick the shared Page:</span>
              {pages.map(p => (
                <button key={p.id} className="btn ghost" disabled={busy || !p.can_live} onClick={() => pick(p.id)}>
                  {p.name}{p.followers != null ? ` · ${p.followers.toLocaleString()} followers` : ''}{!p.can_live ? ' (no permission to post)' : ''}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="stack tight-gap">
          <h3>Invite sellers</h3>
          <div className="row-between"><span>Invite code <b className="code-big">{stage.invite_code}</b></span>
            <button className="btn gold small" onClick={() => navigator.clipboard.writeText(`Join our shared Facebook Page lives in Dazzle Warehouse: open Shared Page lives and enter code ${stage.invite_code}`).then(() => toast('Invite copied', { kind: 'ok' }))}>Copy invite</button>
          </div>
        </div>

        <div className="row2">
          <label>Wrap-up warning
            <select value={warn} onChange={e => setWarn(e.target.value)}>{[2, 3, 5, 10, 15].map(n => <option key={n} value={n}>{n} minutes before the end</option>)}</select>
          </label>
          <label>Stream key appears
            <select value={prep} onChange={e => setPrep(e.target.value)}>{[5, 10, 15, 20, 30].map(n => <option key={n} value={n}>{n} minutes before the start</option>)}</select>
          </label>
        </div>
        {(warn !== String(stage.warn_min) || prep !== String(stage.prep_min)) && <button className="btn primary small" onClick={saveTimes}>Save times</button>}

        <div className="stack tight-gap">
          <h3>Sellers ({members.length})</h3>
          {members.map(m => (
            <div key={m.user_id} className="row-between member-row">
              <span>{m.display_name} {m.role === 'host' && <span className="pill gold">Host</span>}</span>
              {m.user_id !== stage.created_by && (
                <div className="row-gap">
                  <button className="link-btn" onClick={() => member(m, { role: m.role === 'host' ? 'seller' : 'host' })}>{m.role === 'host' ? 'Make seller' : 'Make host'}</button>
                  <button className="link-btn danger-text" onClick={() => member(m, { remove: true })}>Remove</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </details>
  )
}

function BookSheet({ open, onClose, stage, day, slots, onSaved }: { open: boolean; onClose: () => void; stage: Stage; day: Date | null; slots: Slot[]; onSaved: () => void }) {
  const toast = useToast()
  const [date, setDate] = useState('')
  const [hour, setHour] = useState(19)
  const [hours, setHours] = useState(1)
  const [title, setTitle] = useState('')
  const [liveId, setLiveId] = useState('')
  const [lives, setLives] = useState<Live[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) return
    setDate(dateStr(day ?? new Date())); setHour(19); setHours(1); setTitle(''); setLiveId('')
    loadLives(startOfDay(new Date())).then(l => setLives(l.filter(x => x.status === 'planned'))).catch(() => setLives([]))
  }, [open, day])

  const taken = useMemo(() => slots.filter(s => date && dateStr(new Date(s.starts_at)) === date), [slots, date])
  const start = date ? new Date(`${date}T${pad(hour)}:00`) : null
  const end = start ? new Date(start.getTime() + hours * 3600000) : null
  const hourTaken = (h: number) => { const a = new Date(`${date}T${pad(h)}:00`).getTime(); return taken.some(s => Date.parse(s.starts_at) < a + 3600000 && Date.parse(s.ends_at) > a) || a < Date.now() }
  const clash = start && end ? taken.find(s => new Date(s.starts_at) < end && new Date(s.ends_at) > start) : undefined

  function pickLive(id: string) {
    setLiveId(id)
    const l = lives.find(x => x.id === id)
    if (l) {
      const s = new Date(l.starts_at)
      setDate(dateStr(s)); setHour(s.getHours()); setHours(Math.min(4, Math.max(1, Math.round(l.duration_min / 60)))); setTitle(l.title)
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    if (!start || !end) return
    if (start.getTime() < Date.now()) return toast('Pick a time in the future', { kind: 'bad' })
    setBusy(true)
    const { error } = await supabase.from('live_slots').insert({ stage_id: stage.id, title: title.trim() || 'Live sale', starts_at: start.toISOString(), ends_at: end.toISOString(), live_id: liveId || null })
    setBusy(false)
    if (error) return toast(friendlySlotError(error.message), { kind: 'bad' })
    toast(`Booked ${fmtDay(start)}, ${fmtTime(start)} to ${fmtTime(end)}`, { kind: 'ok' })
    onSaved(); onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Book your live hour">
      <form className="stack" onSubmit={save}>
        {lives.length > 0 && (
          <label>Use one of my planned lives (optional)
            <select value={liveId} onChange={e => pickLive(e.target.value)}>
              <option value="">No, just book a time</option>
              {lives.map(l => <option key={l.id} value={l.id}>{l.title} · {fmtDay(l.starts_at)} {fmtTime(l.starts_at)}</option>)}
            </select>
          </label>
        )}
        <label>Title<input value={title} onChange={e => setTitle(e.target.value)} placeholder="$2 Tuesday" /></label>
        <div className="row3">
          <label>Date<input type="date" required value={date} onChange={e => setDate(e.target.value)} /></label>
          <label>Start
            <select value={hour} onChange={e => setHour(parseInt(e.target.value, 10))}>
              {HOURS.map(h => <option key={h} value={h} disabled={!!date && hourTaken(h)}>{hourText(h)}{date && hourTaken(h) ? ' (taken)' : ''}</option>)}
            </select>
          </label>
          <label>Hours<select value={hours} onChange={e => setHours(parseInt(e.target.value, 10))}>{[1, 2, 3, 4].map(n => <option key={n} value={n}>{n} hour{n > 1 ? 's' : ''}</option>)}</select></label>
        </div>
        {taken.length > 0 && (
          <div className="stack tight-gap">
            <span className="muted small">Already taken that day:</span>
            {taken.map(s => <span key={s.id} className="taken-row">{fmtTime(s.starts_at)} to {fmtTime(s.ends_at)} · {s.seller_name}</span>)}
          </div>
        )}
        {clash && <p className="danger-text small">That overlaps {clash.seller_name}'s slot ({fmtTime(clash.starts_at)} to {fmtTime(clash.ends_at)}). Only one seller can be live at a time.</p>}
        {start && end && !clash && <p className="muted small">Hard start {fmtTime(start)}, hard stop {fmtTime(end)}. You get a {stage.warn_min}-minute wrap-up warning.</p>}
        <button className="btn primary big" disabled={busy || !!clash}>{busy ? 'Booking…' : 'Book this slot'}</button>
      </form>
    </Sheet>
  )
}

export default function SharedPage() {
  const toast = useToast()
  const [mine, setMine] = useState<{ stage: Stage; me: StageMember }[] | null>(null)
  const [pick, setPick] = useState(0)
  const [members, setMembers] = useState<StageMember[]>([])
  const [weekStart, setWeekStart] = useState(() => startOfDay(new Date()))
  const [slots, setSlots] = useState<Slot[]>([])
  const [book, setBook] = useState<{ day: Date | null } | null>(null)
  const [err, setErr] = useState('')
  const [people, setPeople] = useState<Record<string, PublicProfile>>({})
  const [viewing, setViewing] = useState<PublicProfile | null>(null)

  const current = mine?.[pick] ?? null
  const stage = current?.stage ?? null
  const me = current?.me ?? null

  const loadStages = useCallback(async () => {
    try { setErr(''); await supabase.rpc('join_open_stages').then(() => null, () => null); setMine(await loadMyStages()) } catch (e: any) { setErr(friendlySlotError(e.message)); setMine([]) }
  }, [])
  useEffect(() => { loadStages() }, [loadStages])

  const refresh = useCallback(async () => {
    if (!stage) return
    try {
      const [m, s] = await Promise.all([loadMembers(stage.id), loadSlots(stage.id, weekStart, addDays(weekStart, 7))])
      setMembers(m); setSlots(s)
      setPeople(await loadPublicProfiles(s.map(x => x.user_id)))
    } catch (e: any) { setErr(friendlySlotError(e.message)) }
  }, [stage, weekStart])
  useEffect(() => { refresh() }, [refresh])

  // Live updates when anyone books, cancels, or goes live.
  useEffect(() => {
    if (!stage) return
    const ch = supabase.channel(`slots-${stage.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_slots', filter: `stage_id=eq.${stage.id}` }, () => refresh())
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [stage, refresh])

  async function cancel(s: Slot) {
    if (!confirm(`Cancel ${fmtDay(s.starts_at)}, ${fmtTime(s.starts_at)}? The time opens up for other sellers.`)) return
    const { error } = await supabase.rpc('cancel_slot', { p_slot: s.id })
    if (error) toast(error.message, { kind: 'bad' }); else { toast('Slot cancelled', { kind: 'ok' }); refresh() }
  }

  if (mine === null) return <div className="center-page"><p className="muted">Loading…</p></div>
  if (err && !stage) return <div className="stack"><h1>Shared Page lives</h1><p className="danger-text">{err}</p></div>
  if (!stage || !me) return <Welcome onDone={loadStages} />

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const now = Date.now()
  const myNext = slots.filter(s => s.user_id === me.user_id && new Date(s.ends_at).getTime() > now && !['ended', 'missed'].includes(s.status))[0]

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div>
          <span className="eyebrow">Sell · Shared Page</span>
          <h1>{stage.name}</h1>
          <p className="muted small">{stage.fb_page_id ? <>Goes live on <b>{stage.fb_page_name}</b></> : <span className="danger-text">Facebook Page not connected yet</span>} · one seller per hour · hard start and stop</p>
        </div>
        <div className="row-gap">
          {mine.length > 1 && <select value={pick} onChange={e => setPick(parseInt(e.target.value, 10))}>{mine.map((m, i) => <option key={m.stage.id} value={i}>{m.stage.name}</option>)}</select>}
          <button className="btn primary" onClick={() => setBook({ day: null })}>+ Book your hour</button>
        </div>
      </div>
      {err && <p className="danger-text">{err}</p>}

      {myNext && (
        <Link to={`/on-air/${myNext.id}`} className="card next-slot">
          <div>
            <span className="eyebrow">Your next slot</span>
            <b>{myNext.title}</b>
            <span className="muted">{fmtDay(myNext.starts_at)} · {fmtTime(myNext.starts_at)} to {fmtTime(myNext.ends_at)}</span>
          </div>
          <span className="btn gold">Open On Air</span>
        </Link>
      )}

      {me.role === 'host' && <HostPanel stage={stage} members={members} onChange={() => { loadStages(); refresh() }} />}

      <div className="card stack">
        <div className="row-between">
          <button className="icon-btn" aria-label="Previous week" onClick={() => setWeekStart(d => addDays(d, -7))}>‹</button>
          <div className="cal-title">
            <h2>{fmtDay(days[0]).replace(/^\w+, /, '')} to {fmtDay(days[6]).replace(/^\w+, /, '')}</h2>
            {startOfDay(new Date()).getTime() !== weekStart.getTime() && <button className="link-btn" onClick={() => setWeekStart(startOfDay(new Date()))}>Today</button>}
          </div>
          <button className="icon-btn" aria-label="Next week" onClick={() => setWeekStart(d => addDays(d, 7))}>›</button>
        </div>
        <div className="slot-week">
          {days.map(d => {
            const list = slots.filter(s => dateStr(new Date(s.starts_at)) === dateStr(d))
            const past = addDays(d, 1).getTime() <= now
            return (
              <div key={d.toISOString()} className={`slot-day ${past ? 'past' : ''}`}>
                <div className="row-between">
                  <b>{d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</b>
                  {!past && <button className="link-btn" onClick={() => setBook({ day: d })}>+ Book</button>}
                </div>
                {list.length === 0 && <span className="muted small">Wide open</span>}
                {list.map(s => {
                  const mineSlot = s.user_id === me.user_id
                  return (
                    <div key={s.id} className={`slot-row ${mineSlot ? 'mine' : ''} st-${s.status}`}>
                      <div className="slot-time">{fmtTime(s.starts_at)}<span>to {fmtTime(s.ends_at)}</span></div>
                      <button type="button" className="slot-who-wrap plain" onClick={() => people[s.user_id] && setViewing(people[s.user_id])} aria-label={`About ${s.seller_name}`}>
                        <Avatar name={s.seller_name} path={people[s.user_id]?.photo_path} size={30} />
                        <span className="slot-who">
                          <b>{s.seller_name}</b>
                          <span className="muted small">{s.title}</span>
                        </span>
                      </button>
                      <span className={`pill st-${s.status}`}>{STATUS_LABEL[s.status] ?? s.status}</span>
                      {(mineSlot || me.role === 'host') && (
                        <div className="row-gap slot-actions">
                          {mineSlot && !['ended', 'missed'].includes(s.status) && <Link className="link-btn" to={`/on-air/${s.id}`}>On Air</Link>}
                          {['booked', 'preparing', 'ready'].includes(s.status) && new Date(s.starts_at).getTime() > now && <button className="link-btn danger-text" onClick={() => cancel(s)}>Cancel</button>}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <Sheet open={!!viewing} onClose={() => setViewing(null)} title="Seller">
        {viewing && (
          <div className="seller-card">
            <Avatar name={viewing.display_name} path={viewing.photo_path} size={72} />
            <div className="stack tight-gap">
              <h2>{viewing.display_name}</h2>
              {viewing.bio && <p>{viewing.bio}</p>}
              {viewing.email && <a href={`mailto:${viewing.email}`}>{viewing.email}</a>}
              {viewing.phone && <a href={`tel:${viewing.phone}`}>{viewing.phone}</a>}
              {!viewing.bio && !viewing.email && !viewing.phone && <p className="muted small">This seller keeps their details private.</p>}
            </div>
          </div>
        )}
      </Sheet>

      <BookSheet open={!!book} onClose={() => setBook(null)} stage={stage} day={book?.day ?? null} slots={slots} onSaved={refresh} />
    </div>
  )
}
