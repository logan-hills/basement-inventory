import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { money } from '../lib/data'
import { loadLives, liveWhen, projected, type Live } from '../lib/lives'
import Icon from '../components/Icon'
import { CountUp } from '../components/Charts'
import { progress, savePlan, stepKey, steps, type Plan } from '../lib/planner'
import { tap } from '../lib/feedback'
import { NovaSays, burst } from '../components/Nova'
import { hasAcademy } from '../lib/plan'
import Sheet from '../components/Sheet'
import { DAILY_TIPS, tipIndexFor, type DailyTip } from '../lessons/tips'
import { lessonById } from '../lessons'
import { JoinNowBanner } from '../components/JoinNow'

/** Nova's 5-minute tip in a pop-up: tiny steps to tick off, and the course that goes deeper. */
function FiveMinuteTip({ tip, open, onClose, showCourse }: { tip: DailyTip; open: boolean; onClose: () => void; showCourse: boolean }) {
  const key = `tip5:${new Date().toISOString().slice(0, 10)}:${tip.title}`
  const [done, setDone] = useState<number[]>(() => { try { return JSON.parse(localStorage.getItem(key) ?? '[]') } catch { return [] } })
  const course = lessonById(tip.course)
  const toggle = (n: number) => {
    tap()
    const next = done.includes(n) ? done.filter(x => x !== n) : [...done, n]
    setDone(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch { /* ignore */ }
    if (next.length === tip.steps.length) burst()
  }
  return (
    <Sheet open={open} onClose={onClose} title="Nova's 5-minute tip">
      <div className="stack tip5">
        <span className="eyebrow"><Icon name="clock" size={14} /> About 5 minutes</span>
        <h3 className="tip5-title">{tip.title}</h3>
        <ul className="action-list">
          {tip.steps.map((st, n) => (
            <li key={st}><button type="button" className={`action-item${done.includes(n) ? ' on' : ''}`} aria-pressed={done.includes(n)} onClick={() => toggle(n)}>
              <span className="action-box">{done.includes(n) ? '✓' : ''}</span>{st}</button></li>
          ))}
        </ul>
        {done.length === tip.steps.length && <p className="lesson-good">Done! Five minutes well spent. Your shop is better than it was this morning.</p>}
        {showCourse && course && <Link to={`/lessons/${course.id}`} className="btn ghost self-start" onClick={onClose}><Icon name="lessons" size={16} />Go deeper: {course.title}</Link>}
      </div>
    </Sheet>
  )
}


/** Next Tuesday 7 PM Eastern, the shop's regular "$2 Tuesday" live. */
function nextTuesday() {
  const now = new Date()
  const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }))
  const d = new Date(et)
  const add = (2 - d.getDay() + 7) % 7
  d.setDate(d.getDate() + add)
  d.setHours(19, 0, 0, 0)
  if (d < et) d.setDate(d.getDate() + 7)
  const today = add === 0 && d.getDate() === et.getDate()
  return today ? 'Tonight · 7:00 PM ET' : `${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · 7:00 PM ET`
}

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

const whole = (n: number) => money(n).replace(/\.\d\d$/, '')
const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString()

/** The first few unchecked "before" steps for the next live, tickable right here. */
function MiniChecklist({ live, onChange }: { live: Live & { plan?: Plan }; onChange: (p: Plan) => void }) {
  const { settings } = useSession()
  const plan = live.plan ?? {}
  const all = steps(settings.checklist, plan).filter(x => x.phase === 'before')
  const pr = progress(settings.checklist, plan)
  const show = [...all.filter(x => plan.checked?.[stepKey(x.phase, x.text)]).slice(-2), ...all.filter(x => !plan.checked?.[stepKey(x.phase, x.text)]).slice(0, 4)]
  function toggle(text: string, e?: { clientX: number; clientY: number }) {
    const k = stepKey('before', text)
    if (!plan.checked?.[k] && e) burst(e.clientX, e.clientY)
    const next = { ...plan, checked: { ...(plan.checked ?? {}), [k]: !plan.checked?.[k] } }
    onChange(next); tap()
    savePlan(live.id, next).catch(() => {})
  }
  return (
    <div className="stack tight-gap">
      <div className="plan-progress"><span style={{ width: `${Math.round(pr.pct * 100)}%` }} /></div>
      <span className="muted small">{pr.done} of {pr.total} steps done{pr.done === pr.total && pr.total ? ". You're ready, Queen!" : ''}</span>
      <div className="mini-check">
        {show.map(x => {
          const on = !!plan.checked?.[stepKey('before', x.text)]
          return <button key={x.text} className={on ? 'on' : ''} onClick={e => toggle(x.text, e)}><span className="check-box">{on ? '✓' : ''}</span><span className={on ? 'muted' : ''}>{x.text}</span></button>
        })}
      </div>
    </div>
  )
}

type Stats = {
  units: number; retail: number; cost: number; noBin: number; old: number
  month: number; lastMonth: number; livesRecent: number
}

export default function Home() {
  const { settings, shop, isTeam } = useSession()
  const [s, setS] = useState<Stats | null>(null)
  const [next, setNext] = useState<(Live & { plan?: Plan }) | null | undefined>(undefined)
  const [work, setWork] = useState<{ pick: number; ship: number }>({ pick: 0, ship: 0 })

  useEffect(() => {
    (async () => {
      const [{ data }, { data: ord }] = await Promise.all([
        supabase.from('units').select('status, location_id, created_at, variant:variants!inner(price,cost)'),
        supabase.from('orders').select('status,total,live_date,created_at'),
      ])
      const rows = (data ?? []) as any[]
      const inStock = rows.filter(r => r.status === 'in_stock')
      const now = Date.now(), day = 864e5
      const ageOf = (r: any) => (now - Date.parse(r.created_at)) / day
      const orders = ((ord ?? []) as any[]).filter(o => o.status !== 'cancelled')
      setS({
        units: inStock.length,
        retail: inStock.reduce((a, r) => a + Number(r.variant.price ?? 0), 0),
        cost: inStock.reduce((a, r) => a + Number(r.variant.cost ?? 0), 0),
        noBin: inStock.filter(r => !r.location_id).length,
        old: inStock.filter(r => ageOf(r) >= settings.oldStockDays).length,
        month: orders.filter(o => { const d = new Date(o.live_date ? o.live_date + 'T12:00' : o.created_at); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() }).reduce((a, o) => a + Number(o.total ?? 0), 0),
        lastMonth: orders.filter(o => { const d = new Date(o.live_date ? o.live_date + 'T12:00' : o.created_at); const n = new Date(); const lm = new Date(n.getFullYear(), n.getMonth() - 1, 1); return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear() }).reduce((a, o) => a + Number(o.total ?? 0), 0),
        livesRecent: new Set(orders.filter(o => o.live_date && Date.parse(o.live_date) > now - 28 * day).map(o => o.live_date)).size,
      })
      setWork({ pick: orders.filter(o => o.status === 'open' || o.status === 'picking').length, ship: orders.filter(o => o.status === 'packed').length })
    })()
    loadLives(new Date(Date.now() - 4 * 3600e3)).then(async l => {
      const n = l.find(x => x.status === 'planned')
      if (!n) { setNext(null); return }
      const { data } = await supabase.from('lives').select('plan').eq('id', n.id).maybeSingle()
      setNext({ ...n, plan: ((data as any)?.plan ?? {}) as Plan })
    }).catch(() => setNext(null))
  }, [settings.oldStockDays])

  const [tip, setTip] = useState(() => tipIndexFor())
  const [tipOpen, setTipOpen] = useState(false)
  useEffect(() => {
    if (!s || s.month < settings.monthlyGoal) return
    const k = `goalBurst:${new Date().toISOString().slice(0, 7)}`
    try { if (localStorage.getItem(k)) return; localStorage.setItem(k, '1') } catch { return }
    setTimeout(() => { burst(); setTimeout(() => burst(window.innerWidth * .25, window.innerHeight * .35), 200) }, 600)
  }, [s, settings.monthlyGoal])
  function headline() {
    if (next && isToday(next.starts_at)) return <>Let's make <em>tonight</em> count.</>
    if (next) {
      const days = Math.ceil((new Date(next.starts_at).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 864e5)
      return days === 1 ? <>You go live <em>tomorrow</em>.</> : <><em>{days} days</em> until your next live.</>
    }
    return <>Let's get you <em>live</em> this week.</>
  }

  return (
    <div className="stack wide-gap">
      <div className="page-head home-head">
        <div className="stack tight-gap">
          <span className="script">{greeting()}, Queen</span>
          <h1>{headline()}</h1>
          {s && s.livesRecent > 0 && <span className="streak self-start"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 1-3.5S9 11 11 11c0-4 1-9 1-9z" /></svg> {s.livesRecent} live{s.livesRecent === 1 ? '' : 's'} in the last 4 weeks</span>}
        </div>
        <Link to="/intake" className="btn gold"><Icon name="plus" size={18} />Add stock</Link>
      </div>

      <JoinNowBanner />

      {/* Nova greets you at the top with today's 5-minute tip. Tap her for another one, or open it to do it now. */}
      <section className="nova-strip home-nova" aria-label="Nova's 5-minute tip">
        <NovaSays mood={DAILY_TIPS[tip].mood} key={tip} size={96} onNovaClick={() => setTip(t => (t + 1) % DAILY_TIPS.length)}>
          {DAILY_TIPS[tip].line}
        </NovaSays>
        <div className="nova-strip-actions">
          <button type="button" className="btn gold small" onClick={() => { tap(); setTipOpen(true) }}><Icon name="clock" size={16} />Do it in 5 minutes</button>
          {hasAcademy(shop?.plan) && !isTeam && <Link to="/lessons" className="btn ghost small nova-strip-link"><Icon name="lessons" size={16} />Dazzle University</Link>}
        </div>
      </section>
      <FiveMinuteTip key={tip} tip={DAILY_TIPS[tip]} open={tipOpen} onClose={() => setTipOpen(false)} showCourse={hasAcademy(shop?.plan) && !isTeam} />

      <div className="top-grid">
        {next ? (
          <div className="gh-hero">
            <span className="eyebrow"><span className="live-dot" />{isToday(next.starts_at) ? 'Tonight' : 'Next live'} · {new Date(next.starts_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>
            <span className="gh-hero-title">{next.title}</span>
            <span>{liveWhen(next)}</span>
            <span><b>{(next.items ?? []).reduce((a, i) => a + i.qty, 0)} items</b> ready · <b>{money(projected(next))}</b> if it all sells</span>
            <div className="hero-actions">
              <Link to={`/lives/${next.id}/plan`} className="btn gold"><Icon name="sparkle" size={18} />Open the plan</Link>
              <Link to={`/live?for=${next.id}`} className="btn glass">Pick items</Link>
            </div>
          </div>
        ) : (
          <div className="gh-hero">
            <span className="eyebrow"><span className="live-dot" />Your next live</span>
            <span className="gh-hero-title">{next === null ? "Let's get one on the calendar" : '$2 Tuesday'}</span>
            <span>{next === null ? 'Pick a theme from the idea bank and the planner does the rest.' : nextTuesday()}</span>
            <div className="hero-actions">
              <Link to="/planner" className="btn gold"><Icon name="sparkle" size={18} />Plan a live</Link>
              <Link to="/planner/ideas" className="btn glass">Theme ideas</Link>
            </div>
          </div>
        )}
        <section className="card stack home-check">
          <div className="row-between"><h2>Live checklist</h2>{next && <Link to={`/lives/${next.id}/plan#tab=check`} className="link-btn">See all</Link>}</div>
          {next ? <MiniChecklist live={next} onChange={plan => setNext({ ...next, plan })} /> : <p className="muted small">Plan a live to get your before, during and after checklist.</p>}
        </section>
      </div>

      {s && (s.old > 0 || work.pick > 0 || work.ship > 0 || s.noBin > 0) && (
        <section className="stack">
          <div className="section-head"><h2 className="section-title">Your to-do list</h2></div>
          <div className="quick-grid two">
            {work.pick > 0 && <Link to="/orders" className="quick todo"><Icon name="pack" size={22} /><div><b>{work.pick} order{work.pick === 1 ? '' : 's'} to pick</b><span className="muted">Scan items into customer boxes</span></div><Icon name="arrow" size={18} /></Link>}
            {work.ship > 0 && <Link to="/shipping" className="quick todo"><Icon name="truck" size={22} /><div><b>{work.ship} box{work.ship === 1 ? '' : 'es'} to ship</b><span className="muted">Export to Pirate Ship</span></div><Icon name="arrow" size={18} /></Link>}
            {s.old > 0 && <Link to="/live?sale=1" className="quick todo"><Icon name="clock" size={22} /><div><b>{s.old} item{s.old === 1 ? '' : 's'} sitting {settings.oldStockDays}+ days</b><span className="muted">Run a sale to turn them back into cash</span></div><Icon name="arrow" size={18} /></Link>}
            {s.noBin > 0 && <Link to="/scan" className="quick todo"><Icon name="warehouse" size={22} /><div><b>{s.noBin} item{s.noBin === 1 ? '' : 's'} to put away</b><span className="muted">{s.units - s.noBin} of {s.units} already have a bin</span></div><Icon name="arrow" size={18} /></Link>}
          </div>
        </section>
      )}

      <section className="stack">
        <div className="section-head"><h2 className="section-title">Your money</h2><Link to="/reports" className="link-btn">See all your numbers →</Link></div>
        <div className="kpi-grid three">
          <div className="kpi gold-tile"><span className="kpi-ico"><Icon name="dollar" /></span><span>Sold this month</span><b>{s ? <CountUp value={s.month} format={whole} /> : '—'}</b>
            <div className="goal-bar"><span style={{ width: `${s ? Math.min(100, (s.month / Math.max(1, settings.monthlyGoal)) * 100) : 0}%` }} /></div>
            <small>{s ? (s.month >= settings.monthlyGoal ? `Goal smashed! ${whole(settings.monthlyGoal)} goal` : `${whole(settings.monthlyGoal - s.month)} to your ${whole(settings.monthlyGoal)} goal`) : ''}</small></div>
          <div className="kpi green-tile"><span className="kpi-ico"><Icon name="trend" /></span><span>Profit sitting on the shelf</span><b>{s ? <CountUp value={s.retail - s.cost} format={whole} /> : '—'}</b><small>{s ? `${s.units} pieces ready to sell` : ''}</small></div>
          <div className="kpi rose-tile"><span className="kpi-ico"><Icon name="tag" /></span><span>Retail value in stock</span><b>{s ? <CountUp value={s.retail} format={whole} /> : '—'}</b><small>{s && s.lastMonth > 0 ? `Last month you sold ${whole(s.lastMonth)}` : 'Every piece is a sale waiting'}</small></div>
        </div>
      </section>

    </div>
  )
}
