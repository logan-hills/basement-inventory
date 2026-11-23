import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loadOrders, orderPicked, orderRemaining, orderUnits, STATUS_LABEL, type Order } from '../lib/orders'
import { money } from '../lib/data'

const TABS = [
  { key: 'todo', label: 'To pick', status: ['open', 'picking'] },
  { key: 'packed', label: 'Packed', status: ['packed'] },
  { key: 'shipped', label: 'Shipped', status: ['shipped'] },
  { key: 'all', label: 'All', status: undefined },
] as const

export default function Orders() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<typeof TABS[number]['key']>('todo')
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [q, setQ] = useState('')

  useEffect(() => {
    setOrders(null); setSel(new Set())
    const t = TABS.find(x => x.key === tab)!
    loadOrders({ status: t.status ? [...t.status] : undefined }).then(setOrders)
  }, [tab])

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase()
    return (orders ?? []).filter(o => !s || o.code.toLowerCase().includes(s) || (o.customer?.name ?? '').toLowerCase().includes(s) ||
      (o.customer?.handle ?? '').toLowerCase().includes(s) || (o.external_ref ?? '').toLowerCase().includes(s))
  }, [orders, q])

  const allSel = shown.length > 0 && shown.every(o => sel.has(o.id))
  const toggle = (id: string) => setSel(s => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const ids = [...sel]

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div><h1>Pick and pack</h1></div>
        <div className="row-gap">
          <Link to="/orders/upload" className="btn primary">Upload live sales</Link>
        </div>
      </div>

      <div className="row-gap">
        <div className="seg" role="tablist">
          {TABS.map(t => <button key={t.key} role="tab" aria-selected={tab === t.key} className={tab === t.key ? 'on' : ''} onClick={() => setTab(t.key)}>{t.label}</button>)}
        </div>
        <input type="search" className="search grow" placeholder="Search order ID, customer or bot order #" value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {sel.size > 0 && (
        <div className="action-bar">
          <span><b className="gold">{sel.size}</b> selected</span>
          <div className="row-gap">
            {tab === 'todo' && <button className="btn gold" onClick={() => navigate(`/pick?orders=${ids.join(',')}`)}>Pick {sel.size === 1 ? 'this order' : `these ${sel.size}`}</button>}
            <button className="btn ghost" onClick={() => navigate(`/box-labels?ids=${ids.join(',')}`)}>Print box labels</button>
            <button className="link-btn" onClick={() => setSel(new Set())}>Clear</button>
          </div>
        </div>
      )}

      {!orders ? <div className="skeleton-list"><div /><div /><div /></div> : shown.length === 0 ? (
        <div className="empty card"><b>{orders.length ? 'No orders match that search' : tab === 'todo' ? 'Nothing to pick' : 'No orders here yet'}</b>
          <span className="muted">After a live, upload the sales CSV from your bot. Each customer gets an order with its own ID, ready to pick and pack.</span>
          <Link to="/orders/upload" className="btn primary">Upload live sales</Link>
        </div>
      ) : (
        <>
          {tab === 'todo' && sel.size === 0 && (
            <div className="row-gap">
              <button className="btn outline-gold" onClick={() => navigate(`/pick?orders=${shown.map(o => o.id).join(',')}`)}>Pick all {shown.length} orders</button>
              <span className="muted small">or tick the orders you want to pick together</span>
            </div>
          )}
          <div className="table-box">
            <table className="data-table clickable">
              <thead><tr>
                <th><input type="checkbox" aria-label="Select all" checked={allSel} onChange={() => setSel(allSel ? new Set() : new Set(shown.map(o => o.id)))} /></th>
                <th>Order ID</th><th>Customer</th><th>Items</th><th className="hide-sm">Total</th><th className="hide-sm">Live</th><th>Status</th>
              </tr></thead>
              <tbody>
                {shown.map(o => {
                  const units = orderUnits(o), picked = orderPicked(o), left = orderRemaining(o)
                  return (
                    <tr key={o.id} onClick={() => navigate(`/order/${o.code}`)}>
                      <td onClick={e => e.stopPropagation()}><input type="checkbox" aria-label={`Select ${o.code}`} checked={sel.has(o.id)} onChange={() => toggle(o.id)} /></td>
                      <td className="mono gold">{o.code}</td>
                      <td>{o.customer?.name ?? '—'}{o.customer?.handle && o.customer.handle !== o.customer.name ? <span className="muted hide-sm"> · {o.customer.handle}</span> : null}</td>
                      <td>{o.status === 'open' || o.status === 'picking' ? `${picked}/${units}` : units}{left === 0 && units > 0 && o.status !== 'shipped' ? ' ✓' : ''}</td>
                      <td className="hide-sm">{money(o.total)}</td>
                      <td className="hide-sm muted">{o.live_date ? new Date(o.live_date + 'T12:00').toLocaleDateString() : ''}</td>
                      <td><span className={`status-pill ${o.status}`}>{STATUS_LABEL[o.status] ?? o.status}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
