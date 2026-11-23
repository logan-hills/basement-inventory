import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { money } from '../lib/data'
import { loadLives, liveWhen, projected, type Live } from '../lib/lives'
import Icon from '../components/Icon'
import { BarList, ColumnChart, CountUp, Ring, SegmentBar, type Point } from '../components/Charts'
import { IDEA_BANK, PALETTES, inspirationOfTheDay, progress, savePlan, stepKey, steps, type Plan } from '../lib/planner'
import { tap } from '../lib/feedback'
import { NovaSays, burst, type NovaMood } from '../components/Nova'
import { hasAcademy } from '../lib/plan'

const HOME_TIPS: [NovaMood, string][] = [
  ['wink', 'Post your poster two days before the live, then again an hour before. Two touches, more faces.'],
  ['happy', 'Say your rules at the start AND end of every live: invoicing, when payment is due, and how to pay.'],
  ['wow', 'A handwritten thank-you in the box costs pennies and brings her back next week.'],
  ['think', 'Running behind on shipping? Message buyers before they ask. Speaking up early keeps them loyal.'],
  ['cheer', 'Shout out your top buyers by name on live. People love to be seen.'],
  ['happy', 'Film one Reel today: hook, close-up, styled on you, then your live day and time.'],
]

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
  units: number; retail: number; cost: number; noBin: number; damaged: number; old: number
  cats: Point[]; age: Point[]; sales30: number; salesByLive: Point[]; month: number; lastMonth: number; livesRecent: number
}

export default function Home() {
  const { settings, shop } = useSession()
  const [s, setS] = useState<Stats | null>(null)
  const [next, setNext] = useState<(Live & { plan?: Plan }) | null | undefined>(undefined)
  const [work, setWork] = useState<{ pick: number; ship: number }>({ pick: 0, ship: 0 })

  useEffect(() => {
    (async () => {
      const [{ data }, { data: ord }] = await Promise.all([
        supabase.from('units').select('status, location_id, removed_at, created_at, variant:variants!inner(price,cost, item:items!inner(category))'),
        supabase.from('orders').select('status,total,live_date,created_at'),
      ])
      const rows = (data ?? []) as any[]
      const inStock = rows.filter(r => r.status === 'in_stock')
      const now = Date.now(), day = 864e5
      const cats = new Map<string, number>()
      for (const r of inStock) { const k = r.variant.item.category ?? 'No category'; cats.set(k, (cats.get(k) ?? 0) + Number(r.variant.price ?? 0)) }
      const ageOf = (r: any) => (now - Date.parse(r.created_at)) / day
      const buckets: [string, number, number][] = [['Under 30 days', 0, 30], ['30–60', 30, 60], ['60–90', 60, 90], ['90–180', 90, 180], ['180+', 180, 1e9]]
      const orders = ((ord ?? []) as any[]).filter(o => o.status !== 'cancelled')
      const byLive = new Map<string, number>()
      for (const o of orders) { const k = o.live_date ?? o.created_at.slice(0, 10); byLive.set(k, (byLive.get(k) ?? 0) + Number(o.total ?? 0)) }
      setS({
        units: inStock.length,
        retail: inStock.reduce((a, r) => a + Number(r.variant.price ?? 0), 0),
        cost: inStock.reduce((a, r) => a + Number(r.variant.cost ?? 0), 0),
        noBin: inStock.filter(r => !r.location_id).length,
        damaged: rows.filter(r => r.status === 'removed' && r.removed_at && Date.parse(r.removed_at) > now - 30 * day).length,
        old: inStock.filter(r => ageOf(r) >= settings.oldStockDays).length,
        cats: [...cats.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, value]) => ({ label, value })),
        age: buckets.map(([label, a, b]) => ({ label, value: inStock.filter(r => ageOf(r) >= a && ageOf(r) < b).length })),
        sales30: orders.filter(o => Date.parse(o.live_date ? o.live_date + 'T12:00' : o.created_at) > now - 30 * day).reduce((a, o) => a + Number(o.total ?? 0), 0),
        month: orders.filter(o => { const d = new Date(o.live_date ? o.live_date + 'T12:00' : o.created_at); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear() }).reduce((a, o) => a + Number(o.total ?? 0), 0),
        lastMonth: orders.filter(o => { const d = new Date(o.live_date ? o.live_date + 'T12:00' : o.created_at); const n = new Date(); const lm = new Date(n.getFullYear(), n.getMonth() - 1, 1); return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear() }).reduce((a, o) => a + Number(o.total ?? 0), 0),
        livesRecent: new Set(orders.filter(o => o.live_date && Date.parse(o.live_date) > now - 28 * day).map(o => o.live_date)).size,
        salesByLive: [...byLive.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-10)
          .map(([d, v]) => ({ label: new Date(d + 'T12:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), value: v })),
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

  const [tip, setTip] = useState(() => new Date().getDate() % HOME_TIPS.length)
  useEffect(() => {
    if (!s || s.month < settings.monthlyGoal) return
    const k = `goalBurst:${new Date().toISOString().slice(0, 7)}`
    try { if (localStorage.getItem(k)) return; localStorage.setItem(k, '1') } catch { return }
    setTimeout(() => { burst(); setTimeout(() => burst(window.innerWidth * .25, window.innerHeight * .35), 200) }, 600)
  }, [s, settings.monthlyGoal])
  const shelved = s && s.units ? (s.units - s.noBin) / s.units : 0
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
      <div className="page-head">
        <div>
          <span className="script">{greeting()}, Queen</span>
          <h1>{headline()}</h1>
        </div>
        <div className="row-gap">
          {s && s.livesRecent > 0 && <span className="streak"><svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3.5 1-3.5S9 11 11 11c0-4 1-9 1-9z" /></svg> {s.livesRecent} live{s.livesRecent === 1 ? '' : 's'} in the last 4 weeks</span>}
          <Link to="/scan" className="btn ghost"><Icon name="scan" size={18} />Scan</Link>
          <Link to="/intake" className="btn gold"><Icon name="plus" size={18} />Add stock</Link>
        </div>
      </div>

      <div className="nova-strip">
        <NovaSays mood={HOME_TIPS[tip][0]} key={tip} onNovaClick={() => setTip(t => (t + 1) % HOME_TIPS.length)}>
          {HOME_TIPS[tip][1]}
        </NovaSays>
        {hasAcademy(shop?.plan) && <Link to="/lessons" className="btn ghost small nova-strip-link"><Icon name="lessons" size={16} />Dazzle University</Link>}
      </div>

      <div className="top-grid">
        {next ? (
          <div className="gh-hero">
            <span className="eyebrow"><span className="live-dot" />{isToday(next.starts_at) ? 'Tonight' : 'Next live'} · {new Date(next.starts_at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}</span>
            <span className="gh-hero-title">{next.title}</span>
            <span>{liveWhen(next)}</span>
            <span><b>{(next.items ?? []).reduce((a, i) => a + i.qty, 0)} items</b> ready · <b>{money(projected(next))}</b> if it all sells</span>
            <div className="row-gap" style={{ marginTop: 8 }}>
              <Link to={`/lives/${next.id}/plan`} className="btn gold"><Icon name="sparkle" size={18} />Open the plan</Link>
              <Link to={`/live?for=${next.id}`} className="btn glass">Pick items</Link>
              <Link to={`/lives/${next.id}`} className="btn glass">Bot sheet</Link>
            </div>
          </div>
        ) : (
          <div className="gh-hero">
            <span className="eyebrow"><span className="live-dot" />Your next live</span>
            <span className="gh-hero-title">{next === null ? "Let's get one on the calendar" : '$2 Tuesday'}</span>
            <span>{next === null ? 'Pick a theme from the idea bank and the planner does the rest.' : nextTuesday()}</span>
            <div className="row-gap" style={{ marginTop: 8 }}>
              <Link to="/planner" className="btn gold"><Icon name="sparkle" size={18} />Plan a live</Link>
              <Link to="/calendar" className="btn glass">Calendar</Link>
            </div>
          </div>
        )}
        <section className="card stack">
          <div className="row-between"><h2>Live checklist</h2>{next && <Link to={`/lives/${next.id}/plan#tab=check`} className="link-btn">See all</Link>}</div>
          {next ? <MiniChecklist live={next} onChange={plan => setNext({ ...next, plan })} /> : <p className="muted small">Plan a live to get your before, during and after checklist.</p>}
        </section>
      </div>

      {s && s.old > 0 && (
        <div className="alert-card">
          <div className="alert-ico"><Icon name="clock" size={22} /></div>
          <div className="grow"><b>{s.old} item{s.old === 1 ? ' has' : 's have'} been in stock {settings.oldStockDays}+ days</b><span className="muted small">Old stock ties up cash. Put it in front of buyers.</span></div>
          <Link to="/live?sale=1" className="btn gold"><Icon name="sparkle" size={18} />Run a sale</Link>
        </div>
      )}

      <div className="kpi-grid">
        <div className="kpi gold-tile"><span className="kpi-ico"><Icon name="dollar" /></span><span>Sold this month</span><b>{s ? <CountUp value={s.month} format={whole} /> : '—'}</b>
          <div className="goal-bar"><span style={{ width: `${s ? Math.min(100, (s.month / Math.max(1, settings.monthlyGoal)) * 100) : 0}%` }} /></div>
          <small>{s ? (s.month >= settings.monthlyGoal ? `Goal smashed! ${whole(settings.monthlyGoal)} goal` : `${whole(settings.monthlyGoal - s.month)} to your ${whole(settings.monthlyGoal)} goal`) : ''}</small></div>
        <div className="kpi green-tile"><span className="kpi-ico"><Icon name="trend" /></span><span>Profit sitting on the shelf</span><b>{s ? <CountUp value={s.retail - s.cost} format={whole} /> : '—'}</b><small>{s ? `${s.units} pieces ready to sell` : ''}</small></div>
        <div className="kpi rose-tile"><span className="kpi-ico"><Icon name="tag" /></span><span>Retail value in stock</span><b>{s ? <CountUp value={s.retail} format={whole} /> : '—'}</b><small>{s && s.lastMonth > 0 ? `Last month you sold ${whole(s.lastMonth)}` : 'Every piece is a sale waiting'}</small></div>
        <div className="kpi"><span className="kpi-ico"><Icon name="reports" /></span><span>Sales, last 30 days</span><b>{s ? <CountUp value={s.sales30} format={whole} /> : '—'}</b><small className="muted">{s && s.month > s.lastMonth && s.lastMonth > 0 ? `↑ ${Math.round((s.month / s.lastMonth - 1) * 100)}% vs last month` : 'Keep going live, it adds up'}</small></div>
      </div>

      {(work.pick > 0 || work.ship > 0) && (
        <div className="quick-grid two">
          {work.pick > 0 && <Link to="/orders" className="quick todo"><Icon name="pack" size={22} /><div><b>{work.pick} order{work.pick === 1 ? '' : 's'} to pick</b><span className="muted">Scan items into customer boxes</span></div><Icon name="arrow" size={18} /></Link>}
          {work.ship > 0 && <Link to="/shipping" className="quick todo"><Icon name="truck" size={22} /><div><b>{work.ship} box{work.ship === 1 ? '' : 'es'} to ship</b><span className="muted">Export to Pirate Ship</span></div><Icon name="arrow" size={18} /></Link>}
        </div>
      )}

      <div className="home-grid">
        <div className="quote-card">
          <Icon name="sparkle" size={22} />
          <p>“{inspirationOfTheDay()}”</p>
        </div>
        <div className="card ring-card">
          <Ring value={shelved} label="Items with a bin"><small>shelved</small></Ring>
          <div className="stack tight-gap">
            <b>Warehouse health</b>
            <span className="muted small">{s ? `${s.units - s.noBin} of ${s.units} items have a bin.` : 'Loading…'}</span>
            {s && s.noBin > 0 && <Link to="/scan" className="link-btn self-start">Put away {s.noBin} →</Link>}
            {s && s.damaged > 0 && <Link to="/damaged" className="muted small">{s.damaged} damaged out this month</Link>}
          </div>
        </div>
      </div>

      <div className="chart-grid">
        <section className="card stack">
          <div className="row-between"><div><h2>Sales by live</h2><span className="muted small">Order totals for your last 10 lives</span></div><Link to="/reports" className="link-btn">Reports</Link></div>
          {s && s.salesByLive.length ? <ColumnChart data={s.salesByLive} format={whole} label="Sales by live" /> : <div className="chart-empty"><Icon name="reports" size={28} /><span className="muted small">Upload your first live's sales to see this fill in.</span></div>}
        </section>
        <section className="card stack">
          <div><h2>Stock by category</h2><span className="muted small">Retail value on the shelf</span></div>
          {s && s.cats.length ? <BarList data={s.cats} format={whole} /> : <div className="chart-empty"><Icon name="inventory" size={28} /><span className="muted small">Receive items to see your mix.</span></div>}
        </section>
      </div>

      <section className="card stack">
        <div className="row-between"><div><h2>How old is your stock?</h2><span className="muted small">Items in stock, by days since they arrived</span></div>{s && s.old > 0 && <Link to="/live?sale=1" className="link-btn">Run a sale</Link>}</div>
        {s ? <SegmentBar data={s.age} /> : <div className="skeleton-list"><div /></div>}
      </section>

      <section className="stack">
        <div className="row-between"><h2 className="section-title">Theme ideas for your next live</h2><Link to="/planner" className="link-btn">Idea bank →</Link></div>
        <div className="idea-grid">
          {IDEA_BANK.slice(Math.floor(Date.now() / 864e5) % 13, Math.floor(Date.now() / 864e5) % 13 + 3).map(i => {
            const pal = PALETTES[i.palette].c
            return (
              <Link key={i.title} to="/planner" className="idea-card">
                <div className="idea-top" style={{ background: `linear-gradient(135deg, ${pal[0]}, ${pal[1]} 70%, ${pal[2]})`, color: pal[3] }}><b>{i.title}</b></div>
                <div className="idea-body"><span className="small">{i.vibe}</span><span className="idea-cta">Plan it →</span></div>
              </Link>
            )
          })}
        </div>
      </section>

      <div className="quick-grid">
        <Link to="/intake" className="quick"><Icon name="receive" size={22} /><div><b>Receive items</b><span className="muted">Photos, Live Numbers and tags</span></div></Link>
        <Link to="/calendar" className="quick"><Icon name="calendar" size={22} /><div><b>Live calendar</b><span className="muted">Plan your next shows</span></div></Link>
        <Link to="/locations" className="quick"><Icon name="warehouse" size={22} /><div><b>Warehouse map</b><span className="muted">Shelves and bins</span></div></Link>
        <Link to="/reports" className="quick"><Icon name="reports" size={22} /><div><b>Reports</b><span className="muted">Sales, profit and trends</span></div></Link>
      </div>
    </div>
  )
}
