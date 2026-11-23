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
import { ENGAGEMENT_IDEAS, IDEA_BANK, PALETTES, THEME_CATS, findIdea, ideaPreset, ideasForMonth, inspirationOfTheDay, progress, swatch, type Idea, type Plan } from '../lib/planner'

type LiveWithPlan = Live & { plan: Plan }

export default function Planner() {
  const navigate = useNavigate()
  const { settings } = useSession()
  const [lives, setLives] = useState<LiveWithPlan[] | null>(null)
  const [preset, setPreset] = useState<{ title: string; theme: string; plan: Plan } | null>(null)
  const [spin, setSpin] = useState<{ i: number; spinning: boolean } | null>(null)
  const [cat, setCat] = useState<string>('All')
  const [q, setQ] = useState('')
  const thisMonth = ideasForMonth()
  const inCat = (c: string): Idea[] => c === 'All' ? IDEA_BANK : c === 'This month' ? thisMonth : IDEA_BANK.filter(i => i.cat === c)
  const shown = inCat(cat).filter(i => !q.trim() || `${i.title} ${i.vibe} ${i.hooks.join(' ')}`.toLowerCase().includes(q.trim().toLowerCase()))
  // The wheel spins through the group that's picked below (or every theme).
  const wheel = inCat(cat).length ? inCat(cat) : IDEA_BANK
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

  function planIdea(i: Idea) {
    setPreset(ideaPreset(i))
    setForm(true)
  }

  // Home links here with ?idea=Theme name to start planning that theme right away.
  const [params, setParams] = useSearchParams()
  useEffect(() => {
    const i = findIdea(params.get('idea'))
    if (i) { planIdea(i); setParams({}, { replace: true }) }
  }, [params]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div><span className="script">Dream it, plan it, go live</span><h1>Live Planner</h1></div>
        <button className="btn gold" onClick={() => { setPreset(null); setForm(true) }}><Icon name="plus" size={18} />Plan a new live</button>
      </div>

      <div className="quote-card">
        <Icon name="sparkle" size={22} />
        <p>“{inspirationOfTheDay()}”</p>
      </div>

      <section className="stack">
        <h2 className="section-title">Your upcoming lives</h2>
        {lives === null ? <div className="skeleton-list"><div /><div /></div> : lives.length === 0 ? (
          <div className="empty card"><b>No lives on the calendar yet</b><span className="muted">Pick a theme from the idea bank below, or start from scratch.</span></div>
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
          {spin?.spinning ? 'Ooh, where is it gonna land…' : spin ? `${wheel[spin.i % wheel.length].title}! I can already see the poster.` : `Can't pick a theme? Let me spin one for you${cat === 'All' ? '' : ` from ${cat}`}.`}
        </NovaSays>
        <div className="roulette-stage">
          {(() => {
            const idea = wheel[(spin?.i ?? 0) % wheel.length]; const pal = PALETTES[idea.palette].c
            return (
              <div className={`roulette-card${spin?.spinning ? ' spinning' : ''}`} key={spin?.i ?? -1} style={{ background: `linear-gradient(135deg, ${pal[0]}, ${pal[1]} 70%, ${pal[2]})`, color: pal[3] }}>
                <span className="cat-no" style={{ color: 'inherit', opacity: .75 }}>Tonight's theme</span>
                <b>{spin ? idea.title : '? ? ?'}</b>
                {spin && !spin.spinning && <span className="roulette-vibe">{idea.vibe}</span>}
              </div>
            )
          })()}
          <div className="row-gap">
            <button className="btn gold" onClick={spinTheme} disabled={!!spin?.spinning}><Icon name="sparkle" size={18} />{spin ? 'Spin again' : 'Spin for a theme'}</button>
            {spin && !spin.spinning && <button className="btn glass" onClick={() => planIdea(wheel[spin.i % wheel.length])}>Plan this live →</button>}
          </div>
        </div>
      </section>

      <section className="stack">
        <div className="row-between"><h2 className="section-title">Idea bank</h2><span className="muted small">{IDEA_BANK.length} themes</span></div>
        <p className="muted">Tap a theme to plan a live around it. It comes with a vibe, a poster look and hooks to get the comments going.</p>
        <div className="theme-filter">
          <div className="chips">
            {['All', ...(thisMonth.length ? ['This month'] : []), ...THEME_CATS].map(c => <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => { setCat(c); setSpin(null) }}>{c}</button>)}
          </div>
          <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search themes: bags, church, gold…" aria-label="Search themes" />
        </div>
        {shown.length === 0 && <div className="empty card"><b>No themes match "{q}"</b><span className="muted">Try another word, or start from scratch with Plan a new live.</span></div>}
        <div className="idea-grid">
          {shown.map(i => (
            <button key={i.title} className="idea-card" onClick={() => planIdea(i)}>
              <div className="idea-top" style={swatch(i.palette)}>
                <span className="idea-cat">{i.cat}</span>
                <b>{i.title}</b>
              </div>
              <div className="idea-body">
                <span className="small">{i.vibe}</span>
                <ul>{i.hooks.slice(0, 2).map(h => <li key={h}>{h}</li>)}</ul>
                <span className="idea-cta">Plan this live →</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="card stack">
        <h2>Ways to get the comments flowing</h2>
        <div className="chip-list">{ENGAGEMENT_IDEAS.map(e => <span key={e} className="idea-chip">{e}</span>)}</div>
      </section>

      <LiveForm open={form} preset={preset} onClose={() => setForm(false)} onSaved={id => navigate(`/lives/${id}/plan`)} />
    </div>
  )
}
