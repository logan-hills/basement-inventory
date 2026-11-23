import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'
import { money } from '../lib/data'
import { downloadFile, toCsv } from '../lib/csv'
import { loadStock, margin, type StockRow } from '../lib/stock'
import { BarList, ColumnChart, SegmentBar } from '../components/Charts'
import Icon from '../components/Icon'

type OrderRow = { id: string; status: string; total: number | null; live_date: string | null; created_at: string; customer_id: string | null; customer: { name: string } | null; lines: { qty: number; price: number | null; picked: number; short: number; variant_id: string | null; live_number: string | null; description: string | null; variant: { cost: number | null; label: string; item: { name: string; category: string | null } } | null }[] }
type Removed = { removed_reason: string | null; removed_at: string | null; variant: { price: number | null; cost: number | null } | null }

/** Every report a seller can print, in page order. */
const REPORTS = [
  { k: 'summary', label: 'Big numbers', hint: 'Sales and inventory totals' },
  { k: 'categories', label: 'Top categories', hint: 'What sold in each category, in percents' },
  { k: 'lives', label: 'Sales by live', hint: 'Each live night\'s totals' },
  { k: 'best', label: 'Best sellers', hint: 'Your top pieces' },
  { k: 'customers', label: 'Top customers', hint: 'Your biggest buyers' },
  { k: 'stockAge', label: 'Stock age', hint: 'How long pieces have sat' },
  { k: 'stockCat', label: 'Stock by category', hint: 'What\'s on the shelf, by category' },
  { k: 'oldest', label: 'Oldest stock', hint: 'Pieces to put on sale' },
  { k: 'lowMargin', label: 'Low margin items', hint: 'Pieces making you the least' },
  { k: 'damage', label: 'Damage by reason', hint: 'What went wrong most' },
] as const
type ReportKey = typeof REPORTS[number]['k']

const RANGES = [{ k: '30', label: 'Last 30 days' }, { k: '90', label: 'Last 90 days' }, { k: '365', label: 'Last 12 months' }, { k: 'all', label: 'All time' }]
const pct = (n: number | null) => (n == null ? '—' : `${Math.round(n * 100)}%`)

function ReportHead({ title, sub, onPrint, csv }: { title: string; sub?: string; onPrint: () => void; csv?: { file: string; rows: (string | number)[][] } }) {
  return (
    <div className="report-head">
      <div><h2>{title}</h2>{sub && <span className="muted small">{sub}</span>}</div>
      <div className="report-actions no-print">
        {csv && csv.rows.length > 1 && <button className="link-btn" onClick={() => downloadFile(csv.file, toCsv(csv.rows) + '\r\n')}>Download CSV</button>}
        <button className="btn ghost small" onClick={onPrint}><Icon name="print" size={16} /> Print</button>
      </div>
    </div>
  )
}

function Table({ title, head, rows, file, cls, onPrint }: { title: string; head: string[]; rows: (string | number)[][]; file: string; cls: string; onPrint: () => void }) {
  return (
    <section className={`card stack report-block ${cls}`}>
      <ReportHead title={title} onPrint={onPrint} csv={{ file, rows: [head, ...rows] }} />
      {rows.length === 0 ? <p className="muted small">No data yet.</p> : (
        <div className="table-box"><table className="data-table">
          <thead><tr>{head.map(h => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
        </table></div>
      )}
    </section>
  )
}

export default function Reports() {
  const { settings, shop } = useSession()
  const [range, setRange] = useState('90')
  const [picker, setPicker] = useState(false)
  const [picked, setPicked] = useState<Set<ReportKey>>(() => new Set(REPORTS.map(r => r.k)))
  const [printing, setPrinting] = useState<Set<ReportKey> | null>(null)
  const [catSort, setCatSort] = useState<'units' | 'revenue'>('units')
  const [openCat, setOpenCat] = useState<string | null>(null)
  const [allItems, setAllItems] = useState<Set<string>>(new Set())
  const [stock, setStock] = useState<StockRow[] | null>(null)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [removed, setRemoved] = useState<Removed[]>([])

  // Print only the chosen reports: hide the rest, open the print window, then put the page back.
  useEffect(() => {
    if (!printing) return
    const done = () => setPrinting(null)
    window.addEventListener('afterprint', done)
    const t = window.setTimeout(() => window.print(), 80)
    return () => { window.clearTimeout(t); window.removeEventListener('afterprint', done) }
  }, [printing])
  const printOnly = (keys: ReportKey[]) => { setPicker(false); setPrinting(new Set(keys)) }
  const cls = (k: ReportKey) => (printing && !printing.has(k) ? 'print-skip' : '')
  const togglePick = (k: ReportKey) => setPicked(p => { const n = new Set(p); if (n.has(k)) n.delete(k); else n.add(k); return n })

  useEffect(() => {
    loadStock().then(setStock).catch(() => setStock([]))
    supabase.from('orders').select('id,status,total,live_date,created_at,customer_id, customer:customers(name), lines:order_lines(qty,price,picked,short,variant_id,live_number,description, variant:variants(cost,label, item:items(name,category)))')
      .then(({ data }) => setOrders((data ?? []) as any))
    supabase.from('units').select('removed_reason,removed_at, variant:variants(price,cost)').eq('status', 'removed').then(({ data }) => setRemoved((data ?? []) as any))
  }, [])

  const since = range === 'all' ? 0 : Date.now() - Number(range) * 86400000
  const sales = useMemo(() => orders.filter(o => o.status !== 'cancelled' && new Date(o.live_date ? o.live_date + 'T12:00' : o.created_at).getTime() >= since), [orders, since])

  const s = stock ?? []
  const live = s.filter(r => r.inStock > 0)
  const units = live.reduce((a, r) => a + r.inStock, 0)
  const retail = live.reduce((a, r) => a + r.inStock * Number(r.price ?? 0), 0)
  const cost = live.reduce((a, r) => a + r.inStock * Number(r.cost ?? 0), 0)
  const noCost = live.filter(r => r.cost == null).length
  const margins = live.map(margin).filter((m): m is number => m != null)
  const avgMargin = margins.length ? margins.reduce((a, b) => a + b, 0) / margins.length : null
  const old = live.filter(r => r.ageDays >= settings.oldStockDays)

  const revenue = sales.reduce((a, o) => a + Number(o.total ?? 0), 0)
  const soldUnits = sales.reduce((a, o) => a + o.lines.reduce((b, l) => b + l.qty, 0), 0)
  const cogs = sales.reduce((a, o) => a + o.lines.reduce((b, l) => b + l.qty * Number(l.variant?.cost ?? 0), 0), 0)
  const customers = new Set(sales.map(o => o.customer_id).filter(Boolean)).size
  const shortUnits = sales.reduce((a, o) => a + o.lines.reduce((b, l) => b + l.short, 0), 0)
  const shipped = sales.filter(o => o.status === 'shipped').length
  const damagedValue = removed.reduce((a, r) => a + Number(r.variant?.cost ?? r.variant?.price ?? 0), 0)

  const buckets = [[0, 30], [31, 60], [61, 90], [91, 180], [181, 99999]].map(([a, b]) => {
    const rs = live.filter(r => r.ageDays >= a && r.ageDays <= b)
    return [b > 9999 ? `${a}+ days` : `${a}–${b} days`, rs.reduce((x, r) => x + r.inStock, 0), money(rs.reduce((x, r) => x + r.inStock * Number(r.price ?? 0), 0)), money(rs.reduce((x, r) => x + r.inStock * Number(r.cost ?? 0), 0))]
  })

  const byCat = new Map<string, { units: number; retail: number; cost: number }>()
  for (const r of live) { const k = r.item.category ?? 'No category'; const v = byCat.get(k) ?? { units: 0, retail: 0, cost: 0 }; v.units += r.inStock; v.retail += r.inStock * Number(r.price ?? 0); v.cost += r.inStock * Number(r.cost ?? 0); byCat.set(k, v) }

  const byLive = new Map<string, { orders: number; units: number; revenue: number; customers: Set<string> }>()
  for (const o of sales) { const k = o.live_date ?? o.created_at.slice(0, 10); const v = byLive.get(k) ?? { orders: 0, units: 0, revenue: 0, customers: new Set() }; v.orders++; v.units += o.lines.reduce((b, l) => b + l.qty, 0); v.revenue += Number(o.total ?? 0); if (o.customer_id) v.customers.add(o.customer_id); byLive.set(k, v) }

  const top = new Map<string, { name: string; units: number; revenue: number }>()
  for (const o of sales) for (const l of o.lines) { const k = l.variant_id ?? `x${l.live_number}${l.description}`; const v = top.get(k) ?? { name: l.variant ? `#${l.live_number ?? ''} ${l.variant.item.name}${l.variant.label !== 'One size' ? ` · ${l.variant.label}` : ''}` : (l.description ?? `#${l.live_number}`), units: 0, revenue: 0 }; v.units += l.qty; v.revenue += l.qty * Number(l.price ?? 0); top.set(k, v) }

  const topCust = new Map<string, { name: string; orders: number; spent: number }>()
  for (const o of sales) { if (!o.customer_id) continue; const v = topCust.get(o.customer_id) ?? { name: o.customer?.name ?? '—', orders: 0, spent: 0 }; v.orders++; v.spent += Number(o.total ?? 0); topCust.set(o.customer_id, v) }

  // Top categories: what sold in each category, and each piece's share inside its category.
  const catSales = new Map<string, { units: number; revenue: number; items: Map<string, { name: string; units: number; revenue: number }> }>()
  for (const o of sales) for (const l of o.lines) {
    const c = l.variant?.item.category?.trim() || 'No category'
    const v = catSales.get(c) ?? { units: 0, revenue: 0, items: new Map() }
    const rev = l.qty * Number(l.price ?? 0)
    v.units += l.qty; v.revenue += rev
    const k = l.variant_id ?? `x${l.live_number}${l.description}`
    const it = v.items.get(k) ?? { name: l.variant ? `#${l.live_number ?? ''} ${l.variant.item.name}${l.variant.label !== 'One size' ? ` · ${l.variant.label}` : ''}` : (l.description ?? `#${l.live_number}`), units: 0, revenue: 0 }
    it.units += l.qty; it.revenue += rev
    v.items.set(k, it); catSales.set(c, v)
  }
  const totalRev = [...catSales.values()].reduce((a, v) => a + v.revenue, 0)
  const cats = [...catSales.entries()].map(([name, v]) => ({
    name, units: v.units, revenue: v.revenue,
    unitShare: soldUnits ? v.units / soldUnits : 0, revShare: totalRev ? v.revenue / totalRev : 0,
    items: [...v.items.values()].sort((a, b) => b.units - a.units || b.revenue - a.revenue),
  })).sort((a, b) => (catSort === 'units' ? b.units - a.units || b.revenue - a.revenue : b.revenue - a.revenue || b.units - a.units))
  const leader = cats[0]
  const catCsv: (string | number)[][] = [['Category', 'Category items sold', 'Category % of all items sold', 'Category sales', 'Category % of sales', 'Item', 'Item sold', 'Item % of category', 'Item sales']]
  for (const c of cats) for (const it of c.items) catCsv.push([c.name, c.units, pct(c.unitShare), money(c.revenue), pct(c.revShare), it.name, it.units, pct(c.units ? it.units / c.units : 0), money(it.revenue)])
  const rangeLabel = RANGES.find(r => r.k === range)!.label

  const dmg = new Map<string, number>()
  for (const r of removed) dmg.set(r.removed_reason ?? 'Other', (dmg.get(r.removed_reason ?? 'Other') ?? 0) + 1)

  return (
    <div className={`stack wide-gap report-page${printing ? ' printing' : ''}`}>
      <div className="page-head no-print">
        <div><span className="eyebrow">Insights</span><h1>Reports</h1></div>
        <div className="report-top-actions">
          <select value={range} onChange={e => setRange(e.target.value)} aria-label="Date range">{RANGES.map(r => <option key={r.k} value={r.k}>{r.label}</option>)}</select>
          <button className="btn gold" onClick={() => setPicker(p => !p)} aria-expanded={picker}><Icon name="print" size={18} /> Print reports</button>
        </div>
      </div>

      <div className="print-only print-title">
        <h1>{shop?.name ?? 'My shop'} · Reports</h1>
        <p>{rangeLabel} · printed {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      {picker && (
        <section className="card stack print-picker no-print" aria-label="Choose reports to print">
          <div className="row-between">
            <div><h2>Which reports do you want to print?</h2><span className="muted small">Tick the ones you want. They print in this order, using the {rangeLabel.toLowerCase()} range.</span></div>
            <div className="report-row">
              <button className="btn ghost small" onClick={() => setPicked(new Set(REPORTS.map(r => r.k)))}>Select all</button>
              <button className="btn ghost small" onClick={() => setPicked(new Set())}>Clear</button>
            </div>
          </div>
          <div className="pick-grid">
            {REPORTS.map(r => (
              <label key={r.k} className={`pick-tile${picked.has(r.k) ? ' on' : ''}`}>
                <input type="checkbox" checked={picked.has(r.k)} onChange={() => togglePick(r.k)} />
                <span><b>{r.label}</b><small>{r.hint}</small></span>
              </label>
            ))}
          </div>
          <div className="report-row">
            <button className="btn gold" disabled={!picked.size} onClick={() => printOnly(REPORTS.filter(r => picked.has(r.k)).map(r => r.k))}>
              <Icon name="print" size={18} /> {picked.size === REPORTS.length ? 'Print all reports' : `Print ${picked.size} report${picked.size === 1 ? '' : 's'}`}
            </button>
            <button className="btn ghost" onClick={() => setPicker(false)}>Cancel</button>
          </div>
          <p className="muted small">Tip: in the print window, choose "Save as PDF" to keep a copy or email it to your bookkeeper.</p>
        </section>
      )}

      <section className={`stack report-block report-plain ${cls('summary')}`}>
        <ReportHead title="Big numbers" onPrint={() => printOnly(['summary'])} />
        <span className="eyebrow">Sales · {rangeLabel.toLowerCase()}</span>
        <div className="stat-row">
          <div className="stat"><span>Sales</span><b className="gold">{money(revenue)}</b></div>
          <div className="stat"><span>Gross profit</span><b className="ok-text">{money(revenue - cogs)}</b><small className="muted">{revenue ? pct((revenue - cogs) / revenue) : '—'} margin</small></div>
          <div className="stat"><span>Orders</span><b>{sales.length}</b><small className="muted">{shipped} shipped</small></div>
          <div className="stat"><span>Avg order</span><b>{money(sales.length ? revenue / sales.length : 0)}</b></div>
          <div className="stat"><span>Items sold</span><b>{soldUnits}</b><small className="muted">{shortUnits} short</small></div>
          <div className="stat"><span>Buyers</span><b>{customers}</b></div>
        </div>
        <span className="eyebrow">Inventory right now</span>
        <div className="stat-row">
          <div className="stat"><span>Items in stock</span><b>{units}</b><small className="muted">{live.length} variations</small></div>
          <div className="stat"><span>Retail value</span><b className="gold">{money(retail)}</b></div>
          <div className="stat"><span>Cost value</span><b>{money(cost)}</b>{noCost > 0 && <small className="muted">{noCost} without a cost</small>}</div>
          <div className="stat"><span>Profit waiting</span><b className="ok-text">{money(retail - cost)}</b></div>
          <div className="stat"><span>Avg margin</span><b>{pct(avgMargin)}</b></div>
          <div className="stat"><span>Old stock</span><b className={old.length ? 'danger-text' : ''}>{old.length}</b><small className="muted">{settings.oldStockDays}+ days</small></div>
          <div className="stat"><span>Damaged out</span><b>{removed.length}</b><small className="muted">{money(damagedValue)} lost</small></div>
        </div>
      </section>

      <section className={`card stack report-block ${cls('categories')}`}>
        <ReportHead title="Top categories" sub="What your buyers pick most, and what sold inside each category" onPrint={() => printOnly(['categories'])} csv={{ file: 'top-categories.csv', rows: catCsv }} />
        {cats.length === 0 ? <div className="chart-empty"><Icon name="tag" size={28} /><span className="muted small">Nothing sold in this range yet. Once orders come in, your top categories show up here.</span></div> : <>
          {leader && <p className="cat-insight"><Icon name="sparkle" size={18} /> <span><b>{leader.name}</b> is your buyers' favorite: <b>{pct(catSort === 'units' ? leader.unitShare : leader.revShare)}</b> of {catSort === 'units' ? 'everything sold' : 'your sales'}.{leader.items[0] && <> Inside it, <b>{leader.items[0].name}</b> leads with {pct(leader.units ? leader.items[0].units / leader.units : 0)} of the pieces sold.</>}</span></p>}
          <div className="seg no-print" role="group" aria-label="Rank categories by">
            <button className={catSort === 'units' ? 'on' : ''} onClick={() => setCatSort('units')}>By items sold</button>
            <button className={catSort === 'revenue' ? 'on' : ''} onClick={() => setCatSort('revenue')}>By sales $</button>
          </div>
          <ol className="cat-list">
            {cats.map((c, i) => {
              const open = openCat === c.name, showAll = allItems.has(c.name)
              const share = catSort === 'units' ? c.unitShare : c.revShare
              return (
                <li key={c.name} className={`cat-card${open ? ' open' : ''}`}>
                  <button className="cat-row" onClick={() => setOpenCat(open ? null : c.name)} aria-expanded={open}>
                    <span className="cat-rank">{i + 1}</span>
                    <span className="cat-main">
                      <span className="cat-name">{c.name}</span>
                      <span className="cat-track"><span style={{ width: `${Math.max(2, share * 100)}%` }} /></span>
                      <span className="cat-meta">{c.units} sold · {money(c.revenue)} · {pct(c.unitShare)} of items · {pct(c.revShare)} of sales</span>
                    </span>
                    <span className="cat-pct">{pct(share)}</span>
                    <span className="cat-chev no-print" aria-hidden>{open ? '−' : '+'}</span>
                  </button>
                  <div className="cat-items">
                    <span className="eyebrow">Inside {c.name}: share of the {c.units} piece{c.units === 1 ? '' : 's'} sold</span>
                    {c.items.map((it, n) => {
                      const sh = c.units ? it.units / c.units : 0
                      return (
                        <div key={it.name + n} className={`cat-item${n >= 5 && !showAll ? ' more' : ''}`}>
                          <span className="cat-item-name">{it.name}</span>
                          <span className="cat-item-track"><span style={{ width: `${Math.max(2, sh * 100)}%` }} /></span>
                          <span className="cat-item-num"><b>{pct(sh)}</b> <small className="muted">{it.units} · {money(it.revenue)}</small></span>
                        </div>
                      )
                    })}
                    {c.items.length > 5 && <button className="link-btn no-print" onClick={() => setAllItems(s => { const n = new Set(s); if (n.has(c.name)) n.delete(c.name); else n.add(c.name); return n })}>{showAll ? 'Show top 5' : `Show all ${c.items.length} pieces`}</button>}
                  </div>
                </li>
              )
            })}
          </ol>
          <p className="muted small no-print">Tap a category to see what sold inside it. Pieces with no category show as "No category"; add one on the item page.</p>
        </>}
      </section>

      <div className="chart-grid no-print">
        <section className="card stack">
          <div><h2>Sales by live</h2><span className="muted small">Hover a bar for the exact total</span></div>
          {byLive.size ? <ColumnChart label="Sales by live" format={n => money(n).replace(/\.\d\d$/, '')}
            data={[...byLive.entries()].sort((a, b) => a[0].localeCompare(b[0])).slice(-16).map(([d, v]) => ({ label: new Date(d + 'T12:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), value: v.revenue, detail: `${v.orders} orders` }))} />
            : <div className="chart-empty"><Icon name="reports" size={28} /><span className="muted small">No sales in this range yet.</span></div>}
        </section>
        <section className="card stack">
          <div><h2>Best sellers</h2><span className="muted small">Items sold</span></div>
          {top.size ? <BarList data={[...top.values()].sort((a, b) => b.units - a.units).slice(0, 6).map(v => ({ label: v.name, value: v.units }))} />
            : <div className="chart-empty"><Icon name="tag" size={28} /><span className="muted small">Nothing sold in this range yet.</span></div>}
        </section>
      </div>
      <section className="card stack no-print">
        <div><h2>Stock age</h2><span className="muted small">Items in stock by days since they arrived</span></div>
        <SegmentBar data={[[0, 30, 'Under 30 days'], [31, 60, '31–60'], [61, 90, '61–90'], [91, 180, '91–180'], [181, 1e9, '181+']].map(([a, b, l]) => ({ label: l as string, value: live.filter(r => r.ageDays >= (a as number) && r.ageDays <= (b as number)).reduce((x, r) => x + r.inStock, 0) }))} />
      </section>

      <div className="settings-grid report-tables">
        <Table title="Sales by live" head={['Live date', 'Orders', 'Items', 'Buyers', 'Sales']} file="sales-by-live.csv" cls={cls('lives')} onPrint={() => printOnly(['lives'])}
          rows={[...byLive.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([d, v]) => [new Date(d + 'T12:00').toLocaleDateString(), v.orders, v.units, v.customers.size, money(v.revenue)])} />
        <Table title="Best sellers" head={['Item', 'Sold', 'Sales']} file="best-sellers.csv" cls={cls('best')} onPrint={() => printOnly(['best'])}
          rows={[...top.values()].sort((a, b) => b.units - a.units).slice(0, 15).map(v => [v.name, v.units, money(v.revenue)])} />
        <Table title="Top customers" head={['Customer', 'Orders', 'Spent']} file="top-customers.csv" cls={cls('customers')} onPrint={() => printOnly(['customers'])}
          rows={[...topCust.values()].sort((a, b) => b.spent - a.spent).slice(0, 15).map(v => [v.name, v.orders, money(v.spent)])} />
        <Table title="Stock age" head={['Age', 'Items', 'Retail', 'Cost']} file="stock-age.csv" rows={buckets} cls={cls('stockAge')} onPrint={() => printOnly(['stockAge'])} />
        <Table title="Stock by category" head={['Category', 'Items', 'Retail', 'Cost', 'Margin']} file="stock-by-category.csv" cls={cls('stockCat')} onPrint={() => printOnly(['stockCat'])}
          rows={[...byCat.entries()].sort((a, b) => b[1].retail - a[1].retail).map(([k, v]) => [k, v.units, money(v.retail), money(v.cost), v.retail ? pct((v.retail - v.cost) / v.retail) : '—'])} />
        <Table title="Oldest stock" head={['Live #', 'Item', 'Days', 'In stock', 'Price']} file="oldest-stock.csv" cls={cls('oldest')} onPrint={() => printOnly(['oldest'])}
          rows={[...old].sort((a, b) => b.ageDays - a.ageDays).slice(0, 20).map(r => [r.live_number, `${r.item.name}${r.label !== 'One size' ? ` · ${r.label}` : ''}`, r.ageDays, r.inStock, money(r.price)])} />
        <Table title="Low margin items" head={['Live #', 'Item', 'Price', 'Cost', 'Margin']} file="low-margin.csv" cls={cls('lowMargin')} onPrint={() => printOnly(['lowMargin'])}
          rows={live.filter(r => margin(r) != null).sort((a, b) => margin(a)! - margin(b)!).slice(0, 15).map(r => [r.live_number, r.item.name, money(r.price), money(r.cost), pct(margin(r))])} />
        <Table title="Damage by reason" head={['Reason', 'Items']} file="damage.csv" rows={[...dmg.entries()].sort((a, b) => b[1] - a[1])} cls={cls('damage')} onPrint={() => printOnly(['damage'])} />
      </div>
    </div>
  )
}
