import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LiveForm from '../components/LiveForm'
import Icon from '../components/Icon'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { money } from '../lib/data'
import { liveWhen, projected, type Live } from '../lib/lives'
import { ENGAGEMENT_IDEAS, IDEA_BANK, PALETTES, inspirationOfTheDay, progress, type Plan } from '../lib/planner'

type LiveWithPlan = Live & { plan: Plan }

export default function Planner() {
  const navigate = useNavigate()
  const { settings } = useSession()
  const [lives, setLives] = useState<LiveWithPlan[] | null>(null)
  const [preset, setPreset] = useState<{ title: string; theme: string; plan: Plan } | null>(null)
  const [form, setForm] = useState(false)

  async function load() {
    const now = new Date(); now.setHours(0, 0, 0, 0)
    const { data } = await supabase.from('lives').select('id,title,theme,starts_at,duration_min,host,notes,status,plan, items:live_items(qty,sale_price, variant:variants(price))')
      .gte('starts_at', now.toISOString()).eq('status', 'planned').order('starts_at').limit(12)
    setLives((data ?? []) as any)
  }
  useEffect(() => { load() }, [])

  function useIdea(i: typeof IDEA_BANK[number]) {
    setPreset({ title: i.title, theme: i.title, plan: { vibe: i.vibe, ideas: i.hooks.map(h => `• ${h}`).join('\n'), poster: { palette: i.palette, headline: i.title } } })
    setForm(true)
  }

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div><span className="script">Dream it, plan it, go live ✨</span><h1>Live Planner</h1></div>
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
              const pal = PALETTES[l.plan?.poster?.palette ?? 0]?.c ?? PALETTES[0].c
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

      <section className="stack">
        <h2 className="section-title">Idea bank</h2>
        <p className="muted">Tap a theme to plan a live around it. It comes with a vibe, poster colors and hooks to get the comments going.</p>
        <div className="idea-grid">
          {IDEA_BANK.map(i => {
            const pal = PALETTES[i.palette].c
            return (
              <button key={i.title} className="idea-card" onClick={() => useIdea(i)}>
                <div className="idea-top" style={{ background: `linear-gradient(135deg, ${pal[0]}, ${pal[1]} 70%, ${pal[2]})`, color: pal[3] }}>
                  <b>{i.title}</b>
                </div>
                <div className="idea-body">
                  <span className="small">{i.vibe}</span>
                  <ul>{i.hooks.slice(0, 2).map(h => <li key={h}>{h}</li>)}</ul>
                  <span className="idea-cta">Plan this live →</span>
                </div>
              </button>
            )
          })}
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
