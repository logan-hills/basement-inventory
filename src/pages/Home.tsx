import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { money } from '../lib/data'
import { loadLives, liveWhen, projected, type Live } from '../lib/lives'
import Icon from '../components/Icon'
import { BarList, ColumnChart, CountUp, Ring, SegmentBar, type Point } from '../components/Charts'

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

type Stats = {
  units: number; retail: number; cost: number; noBin: number; damaged: number; old: number
  cats: Point[]; age: Point[]; sales30: number; salesByLive: Point[]
}

export default function Home() {
  const { shop, settings } = useSession()
  const [s, setS] = useState<Stats | null>(null)
  const [next, setNext] = useState<Live | null | undefined>(undefined)
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
        salesByLive: [...byLive.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-10)
          .map(([d, v]) => ({ label: new Date(d + 'T12:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), value: v })),
      })
      setWork({ pick: orders.filter(o => o.status === 'open' || o.status === 'picking').length, ship: orders.filter(o => o.status === 'packed').length })
    })()
    loadLives(new Date(Date.now() - 4 * 3600e3)).then(l => setNext(l.find(x => x.status === 'planned') ?? null)).catch(() => setNext(null))
  }, [settings.oldStockDays])

  const shelved = s && s.units ? (s.units - s.noBin) / s.units : 0

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div>
          <span className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          <h1 className="shine">{greeting()}</h1>
          <span className="muted">{shop?.name}</span>
        </div>
        <div className="row-gap">
          <Link to="/scan" className="btn outline-gold"><Icon name="scan" size={18} />Scan</Link>
          <Link to="/intake" className="btn primary"><Icon name="plus" size={18} />Receive items</Link>
        </div>
      </div>

      {s && s.old > 0 && (
        <div className="alert-card">
          <div className="alert-ico"><Icon name="clock" size={22} /></div>
          <div className="grow"><b>{s.old} item{s.old === 1 ? ' has' : 's have'} been in stock {settings.oldStockDays}+ days</b><span className="muted small">Old stock ties up cash. Put it in front of buyers.</span></div>
          <Link to="/live?sale=1" className="btn gold"><Icon name="sparkle" size={18} />Run a sale</Link>
        </div>
      )}

      <div className="kpi-grid">
        <div className="kpi"><span className="kpi-ico"><Icon name="inventory" /></span><span>Items in stock</span><b>{s ? <CountUp value={s.units} /> : '—'}</b></div>
        <div className="kpi"><span className="kpi-ico"><Icon name="tag" /></span><span>Retail value</span><b className="gold">{s ? <CountUp value={s.retail} format={whole} /> : '—'}</b></div>
        <div className="kpi"><span className="kpi-ico green"><Icon name="trend" /></span><span>Profit waiting</span><b className="ok-text">{s ? <CountUp value={s.retail - s.cost} format={whole} /> : '—'}</b></div>
        <div className="kpi"><span className="kpi-ico"><Icon name="dollar" /></span><span>Sales, last 30 days</span><b>{s ? <CountUp value={s.sales30} format={whole} /> : '—'}</b></div>
      </div>

      {(work.pick > 0 || work.ship > 0) && (
        <div className="quick-grid two">
          {work.pick > 0 && <Link to="/orders" className="quick todo"><Icon name="pack" size={22} /><div><b>{work.pick} order{work.pick === 1 ? '' : 's'} to pick</b><span className="muted">Scan items into customer boxes</span></div><Icon name="arrow" size={18} /></Link>}
          {work.ship > 0 && <Link to="/shipping" className="quick todo"><Icon name="truck" size={22} /><div><b>{work.ship} box{work.ship === 1 ? '' : 'es'} to ship</b><span className="muted">Export to Pirate Ship</span></div><Icon name="arrow" size={18} /></Link>}
        </div>
      )}

      <div className="home-grid">
        <div className="live-card">
          <div className="live-glow" aria-hidden="true" />
          <span className="eyebrow light"><span className="live-dot" />Next live</span>
          {next ? (
            <>
              <span className="live-title">{next.title}</span>
              <span>{liveWhen(next)}</span>
              <span className="small">{(next.items ?? []).reduce((a, i) => a + i.qty, 0)} items planned · <b>{money(projected(next))}</b> if everything sells</span>
              <Link to={`/lives/${next.id}`} className="btn gold">Open this live</Link>
            </>
          ) : (
            <>
              <span className="live-title">$2 Tuesday</span>
              <span>{nextTuesday()}</span>
              <Link to="/calendar" className="btn gold">{next === null ? 'Schedule it on the calendar' : 'Get ready for live'}</Link>
            </>
          )}
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

      <div className="quick-grid">
        <Link to="/intake" className="quick"><Icon name="receive" size={22} /><div><b>Receive items</b><span className="muted">Photos, Live Numbers and tags</span></div></Link>
        <Link to="/calendar" className="quick"><Icon name="calendar" size={22} /><div><b>Live calendar</b><span className="muted">Plan your next shows</span></div></Link>
        <Link to="/locations" className="quick"><Icon name="warehouse" size={22} /><div><b>Warehouse map</b><span className="muted">Shelves and bins</span></div></Link>
        <Link to="/reports" className="quick"><Icon name="reports" size={22} /><div><b>Reports</b><span className="muted">Sales, profit and trends</span></div></Link>
      </div>
    </div>
  )
}
