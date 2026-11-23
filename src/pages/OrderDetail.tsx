import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useToast } from '../lib/toast'
import { addressLines, lineRemaining, loadOrderByCode, orderRemaining, STATUS_LABEL, type Order } from '../lib/orders'
import { money } from '../lib/data'

export default function OrderDetail() {
  const { code } = useParams()
  const toast = useToast()
  const [order, setOrder] = useState<Order | null | undefined>(undefined)
  const [units, setUnits] = useState<any[]>([])
  const [tracking, setTracking] = useState('')

  const load = useCallback(async () => {
    const o = await loadOrderByCode(code!)
    setOrder(o)
    setTracking(o?.tracking ?? '')
    if (o) {
      const { data } = await supabase.from('units').select('id,tag_code,order_line_id,status').eq('order_id', o.id).order('tag_code')
      setUnits(data ?? [])
    }
  }, [code])
  useEffect(() => { load() }, [load])

  async function setStatus(status: string, extra: Record<string, unknown> = {}) {
    if (!order) return
    const { error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString(), ...extra }).eq('id', order.id)
    if (error) { toast(error.message, { kind: 'bad' }); return }
    if (status === 'shipped') await supabase.from('units').update({ status: 'shipped' }).eq('order_id', order.id)
    toast(`Order ${order.code}: ${STATUS_LABEL[status]}`, { kind: 'ok' })
    load()
  }

  if (order === undefined) return <p className="muted">Loading…</p>
  if (order === null) return <div className="empty card"><b>No order with ID {code}</b><Link to="/orders" className="btn ghost">All orders</Link></div>

  const left = orderRemaining(order)
  const c = order.customer

  return (
    <div className="stack wide-gap">
      <Link to="/orders" className="back-link">‹ Orders</Link>
      <div className="page-head">
        <div><span className="eyebrow">Order · {order.live_date ? `Live ${new Date(order.live_date + 'T12:00').toLocaleDateString()}` : 'Live sale'}{order.external_ref ? ` · Bot #${order.external_ref}` : ''}</span><h1 className="mono">{order.code}</h1></div>
        <div className="row-gap">
          <span className={`status-pill ${order.status}`}>{STATUS_LABEL[order.status]}</span>
          <Link className="btn ghost" to={`/box-labels?ids=${order.id}`}>Print box label</Link>
          <Link className="btn ghost" to={`/order/${order.code}/receipt`}>Print receipt</Link>
          {left > 0 && order.status !== 'cancelled' && <Link className="btn gold" to={`/pick?orders=${order.id}`}>Pick this order</Link>}
        </div>
      </div>

      <div className="detail-layout">
        <div className="stack">
          <div className="card stack">
            <span className="eyebrow">Items · {left === 0 ? 'all picked' : `${left} left to pick`}</span>
            {order.lines.map(l => {
              const tags = units.filter(u => u.order_line_id === l.id)
              const rem = lineRemaining(l)
              return (
                <div key={l.id} className="order-line">
                  <span className={l.variant ? 'live-num small-live' : 'live-num small-live danger-text'}>#{l.live_number ?? '—'}</span>
                  <div className="hit-text grow">
                    <b>{l.variant ? `${l.variant.item.name} · ${l.variant.label}` : (l.description ?? 'Item not in inventory')}</b>
                    <span className="muted small">{l.qty} × {money(l.price)}{tags.length ? ` · tags ${tags.map(t => t.tag_code).join(', ')}` : ''}</span>
                  </div>
                  <span className={rem === 0 ? 'ok-text' : 'muted'}>{l.short ? `${l.short} short` : rem === 0 ? 'Picked' : `${l.picked}/${l.qty}`}</span>
                </div>
              )
            })}
            <div className="row-between total-row"><span>Total</span><b className="gold">{money(order.total)}</b></div>
          </div>
        </div>
        <div className="stack">
          <div className="card stack">
            <span className="eyebrow">Customer</span>
            <b className="big-text">{c?.name ?? '—'}</b>
            {c?.handle && <span className="muted">{c.handle}</span>}
            {addressLines(c).map((a, i) => <span key={i}>{a}</span>)}
            {c?.email && <a href={`mailto:${c.email}`}>{c.email}</a>}
            {c?.phone && <a href={`tel:${c.phone}`}>{c.phone}</a>}
          </div>
          <div className="card stack">
            <span className="eyebrow">Shipping</span>
            <label>Tracking number (from Pirate Ship)
              <input value={tracking} onChange={e => setTracking(e.target.value)} placeholder="9400 1000 0000 0000 0000 00" />
            </label>
            <div className="row-gap">
              {order.status !== 'shipped' && <button className="btn primary" disabled={!tracking.trim()} onClick={() => setStatus('shipped', { tracking: tracking.trim() })}>Mark shipped</button>}
              {order.status === 'shipped' && tracking !== (order.tracking ?? '') && <button className="btn ghost" onClick={() => setStatus('shipped', { tracking: tracking.trim() })}>Save tracking</button>}
              {order.status !== 'cancelled' && order.status !== 'shipped' && <button className="link-btn danger-text" onClick={() => setStatus('cancelled')}>Cancel order</button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
