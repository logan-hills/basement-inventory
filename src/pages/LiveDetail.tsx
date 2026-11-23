import { useCallback, useEffect, useState } from 'react'
import Icon from '../components/Icon'
import MoreActions from '../components/ActionSheet'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LiveForm from '../components/LiveForm'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { money } from '../lib/data'
import { downloadFile, toCsv } from '../lib/csv'
import { durationText, liveWhen, loadLive, type Live, type LiveItem } from '../lib/lives'

/** Header row of Loyal Shops' Live Assistant Pro inventory template (loyalshops.com/lapro/templates). */
export const LOYAL_SHOPS_HEADERS = ['claim_number', 'claim_number_range_end', 'product_title', 'quantity', 'price', 'variant_option1_type', 'variant_option1', 'variant_option2_type', 'variant_option2', 'barcode', 'sku', 'Notes:'] as const

function botValue(key: string, li: LiveItem): string | number | null {
  const v = li.variant, it = v.item
  const inStock = v.units.filter(u => u.status === 'in_stock')
  const variation = v.label === 'One size' ? '' : v.label
  switch (key) {
    case 'live_number': return v.live_number
    case 'name': return it.name
    case 'variation': return variation
    case 'title': return variation ? `${it.name} - ${variation}` : it.name
    case 'price': return Number(li.sale_price ?? v.price ?? 0).toFixed(2)
    case 'regular_price': return v.price != null ? Number(v.price).toFixed(2) : ''
    case 'qty': return li.qty
    case 'in_stock': return inStock.length
    case 'cost': return v.cost != null ? Number(v.cost).toFixed(2) : ''
    case 'brand': return it.brand
    case 'category': return it.category
    case 'tags': return (it.tags ?? []).join('; ')
    case 'weight': return v.weight_lb
    case 'bins': return [...new Set(inStock.map(u => u.location?.code).filter(Boolean))].join(' ')
    case 'description': return it.description
    case 'upc': return (v as any).upc ?? ''
    case 'sku': return `${v.live_number}${variation ? '-' + variation.toUpperCase().replace(/[^A-Z0-9]+/g, '') : ''}`
    default: return ''
  }
}

export default function LiveDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { shop, settings } = useSession()
  const toast = useToast()
  const [live, setLive] = useState<Live | null | undefined>(undefined)
  const [items, setItems] = useState<LiveItem[]>([])
  const [editing, setEditing] = useState(false)

  const load = useCallback(async () => {
    const r = await loadLive(id!).catch(() => null)
    setLive(r?.live ?? null); setItems(r?.items ?? [])
  }, [id])
  useEffect(() => { load() }, [load])

  async function setItem(li: LiveItem, patch: Partial<Pick<LiveItem, 'qty' | 'sale_price'>>) {
    setItems(list => list.map(x => (x.id === li.id ? { ...x, ...patch } : x)))
    const { error } = await supabase.from('live_items').update(patch).eq('id', li.id)
    if (error) toast(error.message, { kind: 'bad' })
  }
  async function removeItem(li: LiveItem) {
    setItems(list => list.filter(x => x.id !== li.id))
    await supabase.from('live_items').delete().eq('id', li.id)
    toast(`Removed #${li.variant.live_number}`, {
      undo: async () => { await supabase.from('live_items').insert({ shop_id: shop!.id, live_id: li.live_id, variant_id: li.variant_id, qty: li.qty, sale_price: li.sale_price, sort: li.sort }); load() },
    })
  }
  async function setStatus(status: string) {
    if (!live) return
    await supabase.from('lives').update({ status }).eq('id', live.id)
    toast(status === 'done' ? 'Marked as done' : status === 'cancelled' ? 'Live cancelled' : 'Back to planned', { kind: 'ok' })
    load()
  }
  async function del() {
    if (!live) return
    if (!window.confirm(`Delete "${live.title}" and its item list? This can't be undone.`)) return
    await supabase.from('lives').delete().eq('id', live.id)
    navigate('/calendar')
  }

  const fileBase = () => live ? `${live.title.replace(/[^\w$ -]+/g, '').trim().replace(/\s+/g, '-')}-${new Date(live.starts_at).toISOString().slice(0, 10)}` : 'live'

  /** Loyal Shops (Live Assistant Pro) inventory import, using their published template headers.
      Each variation has its own Live #, so it goes in claim_number and the variant columns stay empty. */
  function exportLoyalShops() {
    const rows: (string | number | null)[][] = [[...LOYAL_SHOPS_HEADERS]]
    for (const li of items) rows.push([
      String(Number(li.variant.live_number)), '', botValue('title', li), li.qty, botValue('price', li),
      '', '', '', '', botValue('upc', li), botValue('sku', li), botValue('bins', li),
    ])
    downloadFile(`${fileBase()}-loyal-shops.csv`, toCsv(rows) + '\r\n')
  }

  function exportCsv() {
    if (!live) return
    const cols = settings.botColumns
    const rows = [cols.map(c => c.header), ...items.map(li => cols.map(c => botValue(c.key, li)))]
    downloadFile(`${fileBase()}.csv`, toCsv(rows) + '\r\n')
  }

  if (live === undefined) return <p className="muted">Loading…</p>
  if (live === null) return <div className="empty card"><b>That live wasn't found</b><Link className="btn ghost" to="/calendar">Calendar</Link></div>

  const units = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.qty * Number(i.sale_price ?? i.variant.price ?? 0), 0)
  const cost = items.reduce((s, i) => s + i.qty * Number(i.variant.cost ?? 0), 0)
  const missingCost = items.some(i => i.variant.cost == null)
  const short = items.filter(i => i.variant.units.filter(u => u.status === 'in_stock').length < i.qty)

  return (
    <div className="stack wide-gap">
      <Link to="/calendar" className="back-link">‹ Calendar</Link>
      <div className="page-head">
        <div>
          <span className="eyebrow">{live.theme ?? 'Live'}{live.host ? ` · ${live.host}` : ''}{live.status !== 'planned' ? ` · ${live.status === 'done' ? 'Done' : 'Cancelled'}` : ''}</span>
          <h1>{live.title}</h1>
          <span className="muted">{liveWhen(live)} · {durationText(live.duration_min)}</span>
        </div>
        <div className="page-actions">
          <MoreActions title="More for this live" items={[
            { label: 'Download for Loyal Shops', hint: 'The item file Loyal Shops imports', icon: 'download', onClick: exportLoyalShops, disabled: !items.length },
            { label: 'Download my bot CSV', hint: 'For any other comment bot, using your columns', icon: 'download', onClick: exportCsv, disabled: !items.length },
            { label: 'Planner and poster', hint: 'Theme, run of show, poster and checklist', icon: 'sparkle', to: `/lives/${live.id}/plan` },
            { label: 'Edit the details', hint: 'Title, date, time, host and notes', icon: 'calendar', onClick: () => setEditing(true) },
            live.status === 'planned'
              ? { label: 'Mark live as done', hint: 'Moves it out of your upcoming lives', icon: 'sparkle', onClick: () => setStatus('done') }
              : { label: 'Back to planned', hint: 'Puts it back on your upcoming lives', icon: 'calendar', onClick: () => setStatus('planned') },
            ...(live.status === 'planned' ? [{ label: 'Cancel live', hint: 'Keeps it on the calendar, marked cancelled', icon: 'clock', onClick: () => setStatus('cancelled') }] : []),
            { label: 'Delete this live', hint: 'Removes it for good', icon: 'damaged', tone: 'danger' as const, onClick: del },
          ]} />
          <Link className="btn outline-gold" to={`/live?for=${live.id}`}><Icon name="plus" size={18} />Add items</Link>
          <Link className="btn gold" to={`/lives/${live.id}/bot`}>Comment bot</Link>
        </div>
      </div>
      {live.notes && <p className="card muted">{live.notes}</p>}

      <div className="stat-row">
        <div className="stat"><span>Items planned</span><b>{units}</b></div>
        <div className="stat"><span>Projected sales</span><b className="gold">{money(total)}</b></div>
        <div className="stat"><span>Projected profit</span><b className="ok-text">{money(total - cost)}</b>{missingCost && <small className="muted">some costs missing</small>}</div>
        <div className="stat"><span>Avg price</span><b>{money(units ? total / units : 0)}</b></div>
      </div>
      {short.length > 0 && <p className="warn-box">{short.length} item{short.length === 1 ? ' has' : 's have'} fewer in stock than planned: {short.map(s => `#${s.variant.live_number}`).join(', ')}.</p>}

      <div className="card stack">
        <div className="row-between"><span className="eyebrow">Item list · this is what goes in the bot CSV</span><Link className="link-btn" to="/settings/bot">Change CSV columns</Link></div>
        {items.length === 0 && (
          <div className="empty"><b>No items yet</b><span className="muted">Pick items in Get ready for live, add them to your cart, then check out to this live.</span><Link className="btn gold" to={`/live?for=${live.id}`}>Pick items</Link></div>
        )}
        {items.map(li => {
          const stock = li.variant.units.filter(u => u.status === 'in_stock')
          const bins = [...new Set(stock.map(u => u.location?.code).filter(Boolean))]
          return (
            <div key={li.id} className="order-line">
              <span className="live-num small-live">#{li.variant.live_number}</span>
              <div className="hit-text grow">
                <Link to={`/item/${li.variant.item.id}`}><b>{li.variant.item.name}</b></Link>{li.variant.label !== 'One size' && <span className="variant-badge">{li.variant.label}</span>}
                <span className="muted small"><b className="shelf-count">{stock.length} on shelf</b>{bins.length ? ` · ${bins.join(', ')}` : ''} · regular {money(li.variant.price)}</span>
              </div>
              <label className="mini-field">Qty<input inputMode="numeric" defaultValue={li.qty} onBlur={e => { const n = parseInt(e.target.value, 10); if (n > 0 && n !== li.qty) setItem(li, { qty: n }) }} /></label>
              <label className="mini-field">Live price<input inputMode="decimal" defaultValue={li.sale_price ?? ''} placeholder={li.variant.price != null ? Number(li.variant.price).toFixed(2) : ''} onBlur={e => { const v = e.target.value.trim(); const n = v === '' ? null : Number(v); if (n === null || !Number.isNaN(n)) setItem(li, { sale_price: n }) }} /></label>
              <button className="icon-btn danger-text" aria-label="Remove from live" onClick={() => removeItem(li)}>×</button>
            </div>
          )
        })}
      </div>

      <LiveForm open={editing} live={live} onClose={() => setEditing(false)} onSaved={() => load()} />
    </div>
  )
}
