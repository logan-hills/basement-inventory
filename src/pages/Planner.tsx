import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import LiveForm from '../components/LiveForm'
import Icon from '../components/Icon'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { money } from '../lib/data'
import { liveWhen, projected, type Live } from '../lib/lives'
import { NovaSays, burst } from '../components/Nova'
import { tap } from '../lib/feedback'
import { ENGAGEMENT_IDEAS, IDEA_BANK, PALETTES, THEME_CATS, findIdea, fitLabel, ideaFit, ideaPreset, ideasForDate, inspirationOfTheDay, liveDayLabel, nextFitDate, progress, swatch, upcomingIdeas, type Idea, type Plan } from '../lib/planner'

type LiveWithPlan = Live & { plan: Plan }

/** The Live Planner. `ideas` is its sub-page with the whole idea bank, so the main page stays short. */
export default function Planner({ view = 'main' }: { view?: 'main' | 'ideas' }) {
  const navigate = useNavigate()
  const { settings } = useSession()
  const [lives, setLives] = useState<LiveWithPlan[] | null>(null)
  const [preset, setPreset] = useState<{ title: string; theme: string; plan: Plan } | null>(null)
  const [spin, setSpin] = useState<{ i: number; spinning: boolean } | null>(null)
  const [cat, setCat] = useState<string>('Best fits')
  const [q, setQ] = useState('')
  // Ideas are picked for a live date: the one the seller chooses, else their next planned live, else today.
  const [pickedDate, setPickedDate] = useState('')
  const toInput = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const liveDate = (() => {
    if (pickedDate) { const [y, m, d] = pickedDate.split('-').map(Number); return new Date(y, m - 1, d) }
    if (lives?.length) return new Date(lives[0].starts_at)
    return new Date()
  })()
  const fits = ideasForDate(liveDate)
  const upcoming = upcomingIdeas(liveDate)
  const inCat = (c: string): { idea: Idea; why: string; fits: boolean }[] =>
    c === 'Every theme' ? IDEA_BANK.map(i => ({ idea: i, ...ideaFit(i, liveDate) }))
      : c === 'Best fits' ? fits
        : fits.filter(x => x.idea.cat === c)
  const shown = inCat(cat).filter(({ idea: i }) => !q.trim() || `${i.title} ${i.vibe} ${i.hooks.join(' ')}`.toLowerCase().includes(q.trim().toLowerCase()))
  // The wheel only lands on themes that make sense for the live date (within the picked group).
  const wheelRows = cat === 'Every theme' || !inCat(cat).length ? fits : inCat(cat)
  const wheel = wheelRows.map(x => x.idea)
  const whyOf = (i: Idea) => ideaFit(i, liveDate).why
  function spinTheme(e: { clientX: number; clientY: number }) {
    if (spin?.spinning) return
    const target = Math.floor(Math.random() * wheel.length)
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setSpin({ i: target, spinning: false }); return }
    let n = 0, i = (spin?.i ?? 0) % wheel.length, delay = 45
    const { clientX, clientY } = e
    const step = () => {
      i = (i + 1) % wheel.length; n++
      setSpin({ i, spinning: true }); tap()
      if (n > 14 && i === target) { setSpin({ i, spinning: false }); burst(clientX, clientY); return }
      delay = Math.min(delay * 1.12, 220); setTimeout(step, delay)
    }
    step()
  }
  const [form, setForm] = useState(false)

  async function load() {
    const now = new Date(); now.setHours(0, 0, 0, 0)
    const { data } = await supabase.from('lives').select('id,title,theme,starts_at,duration_min,host,notes,status,plan, items:live_items(qty,sale_price, variant:variants(price))')
      .gte('starts_at', now.toISOString()).eq('status', 'planned').order('starts_at').limit(12)
    setLives((data ?? []) as any)
  }
  useEffect(() => { load() }, [])

  const [presetDay, setPresetDay] = useState<Date | null>(null)
  /** Plans a theme on the live date, or on the first day it fits if that date doesn't suit it. */
  function planIdea(i: Idea, on?: Date) {
    setPreset(ideaPreset(i))
    setPresetDay(on ?? (ideaFit(i, liveDate).fits ? liveDate : nextFitDate(i, liveDate)) ?? liveDate)
    setForm(true)
  }

  // Home links here with ?idea=Theme name to start planning that theme right away.
  const [params, setParams] = useSearchParams()
  useEffect(() => {
    const i = findIdea(params.get('idea'))
    if (i) { planIdea(i); setParams({}, { replace: true }) }
  }, [params]) // eslint-disable-line react-hooks/exhaustive-deps

  const datePicker = (
    <div className="fit-bar">
      <label>Your live date<input type="date" value={pickedDate || toInput(liveDate)} onChange={e => { setPickedDate(e.target.value); setSpin(null) }} /></label>
      <p className="muted small">Nova only suggests themes that make sense for <b>{liveDayLabel(liveDate)}</b>: the right day of the week, the season, and holidays coming up. Each idea says why it fits.</p>
    </div>
  )

  const ideaBank = (
    <>
      {datePicker}
      {upcoming.length > 0 && (
        <section className="stack tight-gap">
          <h2 className="section-title">Coming up soon</h2>
          <div className="upcoming-list">
            {upcoming.map(({ idea: i, on }) => (
              <button key={i.title} className="upcoming" onClick={() => planIdea(i, on)}>
                <span className="upcoming-dot" style={swatch(i.palette)} />
                <span className="grow"><b>{i.title}</b><small className="muted">{fitLabel(i, liveDate)}</small></span>
                <span className="idea-cta">Plan it for {liveDayLabel(on)} →</span>
              </button>
            ))}
          </div>
        </section>
      )}
      <div className="theme-filter">
        <div className="chips">
          {['Best fits', ...THEME_CATS, 'Every theme'].map(c => <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => { setCat(c); setSpin(null) }}>{c}</button>)}
        </div>
        <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search themes: bags, church, gold…" aria-label="Search themes" />
      </div>
      {cat === 'Every theme' && <p className="muted small">All {IDEA_BANK.length} themes. The ones that don't fit {liveDayLabel(liveDate)} say when they do, and planning one puts it on its next good date.</p>}
      {shown.length === 0 && <div className="empty card"><b>{q ? `No themes match "${q}"` : `No ${cat} themes fit ${liveDayLabel(liveDate)}`}</b><span className="muted">Try another word or group, or tap Every theme.</span></div>}
      <div className="idea-grid">
        {shown.map(({ idea: i, why, fits: ok }) => (
          <button key={i.title} className={`idea-card ${ok ? '' : 'off-date'}`} onClick={() => planIdea(i)}>
            <div className="idea-top" style={swatch(i.palette)}>
              <span className="idea-cat">{i.cat}</span>
              <b>{i.title}</b>
            </div>
            <div className="idea-body">
              {ok ? <span className="idea-why">✓ {why}</span> : <span className="idea-why off">Fits {fitLabel(i, liveDate)}</span>}
              <span className="small">{i.vibe}</span>
              <ul>{i.hooks.slice(0, 2).map(h => <li key={h}>{h}</li>)}</ul>
              <span className="idea-cta">{ok ? 'Plan this live →' : `Plan it for ${liveDayLabel(nextFitDate(i, liveDate) ?? liveDate)} →`}</span>
            </div>
          </button>
        ))}
      </div>
      <section className="card stack">
        <h2>Ways to get the comments flowing</h2>
        <div className="chip-list">{ENGAGEMENT_IDEAS.map(e => <span key={e} className="idea-chip">{e}</span>)}</div>
      </section>
    </>
  )
  const form_ = <LiveForm open={form} preset={preset} day={presetDay} onClose={() => setForm(false)} onSaved={id => navigate(`/lives/${id}/plan`)} />

  if (view === 'ideas') return (
    <div className="stack wide-gap">
      <Link to="/planner" className="back-link">‹ Live Planner</Link>
      <div className="page-head">
        <div><h1>Theme ideas</h1><p className="lede">{fits.length} of {IDEA_BANK.length} themes fit {liveDayLabel(liveDate)}. Tap one to plan a live with its vibe, poster look and comment hooks ready to go.</p></div>
      </div>
      {ideaBank}
      {form_}
    </div>
  )

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div><span className="script">Dream it, plan it, go live</span><h1>Live Planner</h1></div>
        <button className="btn gold" onClick={() => { setPreset(null); setPresetDay(null); setForm(true) }}><Icon name="plus" size={18} />Plan a new live</button>
      </div>

      <div className="quote-card">
        <Icon name="sparkle" size={22} />
        <p>“{inspirationOfTheDay()}”</p>
      </div>

      <section className="stack">
        <h2 className="section-title">Your upcoming lives</h2>
        {lives === null ? <div className="skeleton-list"><div /><div /></div> : lives.length === 0 ? (
          <div className="empty card"><b>No lives on the calendar yet</b><span className="muted">Spin for a theme below, browse the theme ideas, or start from scratch.</span></div>
        ) : (
          <div className="plan-grid">
            {lives.map(l => {
              const pr = progress(settings.checklist, l.plan ?? {})
              const pal = PALETTES[l.plan?.poster?.palette ?? 6]?.c ?? PALETTES[0].c
              return (
                <Link key={l.id} to={`/lives/${l.id}/plan`} className="plan-card">
                  <div className="plan-swatch" style={{ background: `linear-gradient(135deg, ${pal[0]}, ${pal[1]} 70%, ${pal[2]})`, color: pal[3] }}>
                    <small>{new Date(l.starts_at).toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}</small>
                    <b>{new Date(l.starts_at).getDate()}</b>
                  </div>
                  <div className="grow stack tight-gap">
                    <b className="plan-title">{l.title}</b>
                    <span className="muted small">{liveWhen(l)}</span>
                    <span className="small">{(l.items ?? []).reduce((a, i) => a + i.qty, 0)} items · <b className="gold">{money(projected(l))}</b> possible</span>
                    <div className="plan-progress"><span style={{ width: `${Math.round(pr.pct * 100)}%` }} /></div>
                    <span className="muted small">{pr.done} of {pr.total} checklist steps done</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <section className="roulette">
        <NovaSays mood={spin?.spinning ? 'wow' : spin ? 'cheer' : 'wink'} key={spin?.spinning ? 'spin' : spin ? `done${spin.i}` : 'idle'}>
          {spin?.spinning ? 'Ooh, where is it gonna land…' : spin ? `${wheel[spin.i % wheel.length].title}! ${whyOf(wheel[spin.i % wheel.length])}. I can already see the poster.` : `Can't pick a theme? I'll spin one that fits ${liveDayLabel(liveDate)}.`}
        </NovaSays>
        <div className="roulette-stage">
          {(() => {
            const idea = wheel[(spin?.i ?? 0) % wheel.length]; const pal = PALETTES[idea.palette].c
            return (
              <div className={`roulette-card${spin?.spinning ? ' spinning' : ''}`} key={spin?.i ?? -1} style={{ background: `linear-gradient(135deg, ${pal[0]}, ${pal[1]} 70%, ${pal[2]})`, color: pal[3] }}>
                <span className="cat-no" style={{ color: 'inherit', opacity: .75 }}>Theme for {liveDayLabel(liveDate)}</span>
                <b>{spin ? idea.title : '? ? ?'}</b>
                {spin && !spin.spinning && <span className="roulette-vibe">{idea.vibe}<br />✓ {whyOf(idea)}</span>}
              </div>
            )
          })()}
          <label className="roulette-date">Live date<input type="date" value={pickedDate || toInput(liveDate)} onChange={e => { setPickedDate(e.target.value); setSpin(null) }} /></label>
          <div className="row-gap">
            <button className="btn gold" onClick={spinTheme} disabled={!!spin?.spinning}><Icon name="sparkle" size={18} />{spin ? 'Spin again' : 'Spin for a theme'}</button>
            {spin && !spin.spinning && <button className="btn glass" onClick={() => planIdea(wheel[spin.i % wheel.length])}>Plan this live →</button>}
          </div>
        </div>
      </section>

      <Link to="/planner/ideas" className="hub-row">
        <span className="action-ico"><Icon name="sparkle" size={22} /></span>
        <span className="action-text"><b>Browse theme ideas</b><small>{fits.length} themes fit {liveDayLabel(liveDate)}{upcoming.length ? `, and ${upcoming[0].idea.title} is coming up ${liveDayLabel(upcoming[0].on)}` : ''}. Each says why it fits.</small></span>
        <Icon name="chevron" size={20} className="action-chev" />
      </Link>

      {form_}
    </div>
  )
}
