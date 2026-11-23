import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { money } from '../lib/data'

/** Next Tuesday 7 PM Eastern, the shop's regular "$2 Tuesday" live. */
function nextLive() {
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

export default function Home() {
  const { shop } = useSession()
  const [stats, setStats] = useState<{ units: number; value: number; noLoc: number; damaged: number } | null>(null)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('units').select('status, location_id, removed_at, variant:variants!inner(price)')
      const rows = (data ?? []) as any[]
      const inStock = rows.filter(r => r.status === 'in_stock')
      const monthAgo = Date.now() - 30 * 864e5
      setStats({
        units: inStock.length,
        value: inStock.reduce((s, r) => s + (Number(r.variant.price) || 0), 0),
        noLoc: inStock.filter(r => !r.location_id).length,
        damaged: rows.filter(r => r.status === 'removed' && r.removed_at && Date.parse(r.removed_at) > monthAgo).length,
      })
    })()
  }, [])

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div><span className="eyebrow">Dashboard</span><h1>{shop?.name}</h1></div>
        <div className="row-gap">
          <Link to="/scan" className="btn outline-gold">Scan</Link>
          <Link to="/intake" className="btn primary">+ Receive items</Link>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat"><span>Units in stock</span><b>{stats ? stats.units : '—'}</b></div>
        <div className="stat"><span>Stock value</span><b className="gold">{stats ? money(stats.value).replace('.00', '') : '—'}</b></div>
        <div className="stat"><span>Need a location</span><b>{stats ? stats.noLoc : '—'}</b></div>
        <Link to="/damaged" className="stat"><span>Damaged out (30 days)</span><b className={stats?.damaged ? 'danger-text' : ''}>{stats ? stats.damaged : '—'}</b></Link>
      </div>

      <div className="home-grid">
        <div className="live-card">
          <span className="eyebrow light">Next live</span>
          <span className="live-title">$2 Tuesday</span>
          <span>{nextLive()}</span>
          <Link to="/live" className="btn gold">Get ready for live</Link>
        </div>
        <Link to="/scan" className="scan-hero">
          <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3M8 8v8M12 8v8M16 8v8" /></svg>
          <b>Scan a tag</b>
          <span className="muted">Camera, USB or Bluetooth scanner</span>
        </Link>
      </div>

      <div className="quick-grid">
        <Link to="/intake" className="quick"><b>Receive items</b><span className="muted">Photos, Live Numbers and tags</span></Link>
        <Link to="/inventory" className="quick"><b>Inventory</b><span className="muted">Search and manage stock</span></Link>
        <Link to="/locations" className="quick"><b>Warehouse map</b><span className="muted">Shelves and bins</span></Link>
        <Link to="/damaged" className="quick"><b>Damaged</b><span className="muted">Losses and put-backs</span></Link>
      </div>
    </div>
  )
}
