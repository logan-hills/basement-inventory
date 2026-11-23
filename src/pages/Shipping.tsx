import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useToast } from '../lib/toast'
import { feedbackOk } from '../lib/feedback'
import { loadOrders, orderUnits, type Order } from '../lib/orders'
import { downloadFile, toCsv } from '../lib/csv'

export default function Shipping() {
  const toast = useToast()
  const [tab, setTab] = useState<'ready' | 'shipped'>('ready')
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [weights, setWeights] = useState<Record<string, number | null>>({})
  const [tracking, setTracking] = useState<Record<string, string>>({})
  const [sel, setSel] = useState<Set<string>>(new Set())

  const load = useCallback(async () => {
    setOrders(null); setSel(new Set())
    const list = await loadOrders({ status: tab === 'ready' ? ['packed'] : ['shipped'] })
    setOrders(tab === 'shipped' ? list.slice(0, 100) : list)
    const vids = [...new Set(list.flatMap(o => o.lines.map(l => l.variant_id).filter(Boolean)))] as string[]
    const { data } = vids.length ? await supabase.from('variants').select('id,weight_lb').in('id', vids) : { data: [] }
    const w = new Map((data ?? []).map((v: any) => [v.id, v.weight_lb]))
    const out: Record<string, number | null> = {}
    for (const o of list) {
      let total = 0, known = true
      for (const l of o.lines) { const per = l.variant_id ? w.get(l.variant_id) : null; if (per == null) known = false; else total += Number(per) * (l.picked || l.qty) }
      out[o.id] = known ? total : (total || null)
    }
    setWeights(out)
  }, [tab])
  useEffect(() => { load() }, [load])

  const list = orders ?? []
  const chosen = useMemo(() => list.filter(o => sel.has(o.id)), [list, sel])

  function pirateShipCsv() {
    const use = chosen.length ? chosen : list
    const rows = [['Order ID', 'Name', 'Address', 'Address Line 2', 'City', 'State', 'Zipcode', 'Country', 'Email', 'Phone', 'Pounds', 'Ounces', 'Items'],
      ...use.map(o => {
        const c = o.customer, lb = weights[o.id] ?? 0
        const whole = Math.floor(lb), oz = Math.round((lb - whole) * 16 * 10) / 10
        return [o.code, c?.name, c?.address1, c?.address2, c?.city, c?.state, c?.zip, c?.country || 'US', c?.email, c?.phone, lb ? whole : '', lb ? oz : '', orderUnits(o)]
      })]
    downloadFile(`pirate-ship-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows) + '\r\n')
  }

  async function ship(o: Order) {
    const t = (tracking[o.id] ?? '').trim()
    if (!t) return
    const { error } = await supabase.from('orders').update({ status: 'shipped', tracking: t, updated_at: new Date().toISOString() }).eq('id', o.id)
    if (error) { toast(error.message, { kind: 'bad' }); return }
    await supabase.from('units').update({ status: 'shipped' }).eq('order_id', o.id)
    feedbackOk()
    setOrders(l => (l ?? []).filter(x => x.id !== o.id))
    toast(`${o.code} shipped`, { kind: 'ok', undo: async () => { await supabase.from('orders').update({ status: 'packed' }).eq('id', o.id); await supabase.from('units').update({ status: 'packed' }).eq('order_id', o.id); load() } })
  }

  const missingAddr = list.filter(o => !o.customer?.address1 || !o.customer?.zip).length

  return (
    <div className="stack wide-gap">
      <div className="page-head">
        <div><span className="eyebrow">Sell</span><h1>Shipping</h1></div>
        {tab === 'ready' && <button className="btn primary" disabled={!list.length} onClick={pirateShipCsv}>Download for Pirate Ship{chosen.length ? ` (${chosen.length})` : ''}</button>}
      </div>
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={tab === 'ready'} className={tab === 'ready' ? 'on' : ''} onClick={() => setTab('ready')}>Ready to ship</button>
        <button role="tab" aria-selected={tab === 'shipped'} className={tab === 'shipped' ? 'on' : ''} onClick={() => setTab('shipped')}>Shipped</button>
      </div>
      {tab === 'ready' && (
        <ol className="how-list muted small">
          <li>Download the file and import it at Pirate Ship (Ship → Import Spreadsheet). Weights come from each item's weight.</li>
          <li>Buy the labels there, then paste each tracking number here and tap Shipped.</li>
        </ol>
      )}
      {tab === 'ready' && missingAddr > 0 && <p className="warn-box">{missingAddr} order{missingAddr === 1 ? ' is' : 's are'} missing an address. Open the order to check it.</p>}

      {!orders ? <div className="skeleton-list"><div /><div /></div> : list.length === 0 ? (
        <div className="empty card"><b>{tab === 'ready' ? 'Nothing waiting to ship' : 'Nothing shipped yet'}</b><span className="muted">Orders show up here once every item is picked into its box.</span><Link to="/orders" className="btn ghost">Pick and pack</Link></div>
      ) : (
        <div className="stack">
          {list.map(o => (
            <div key={o.id} className="card ship-row">
              {tab === 'ready' && <input type="checkbox" aria-label={`Select ${o.code}`} checked={sel.has(o.id)} onChange={() => setSel(s => { const n = new Set(s); if (n.has(o.id)) n.delete(o.id); else n.add(o.id); return n })} />}
              <div className="hit-text grow">
                <Link to={`/order/${o.code}`} className="mono gold">{o.code}</Link>
                <b>{o.customer?.name ?? '—'}</b>
                <span className="muted small">{[o.customer?.city, o.customer?.state].filter(Boolean).join(', ') || 'No address'} · {orderUnits(o)} item{orderUnits(o) === 1 ? '' : 's'}{weights[o.id] ? ` · ${weights[o.id]!.toFixed(1)} lb` : ''}</span>
              </div>
              {tab === 'ready' ? (
                <form className="input-suffix ship-track" onSubmit={e => { e.preventDefault(); ship(o) }}>
                  <input placeholder="Tracking number" value={tracking[o.id] ?? ''} onChange={e => setTracking(t => ({ ...t, [o.id]: e.target.value }))} />
                  <button className="btn primary small" disabled={!(tracking[o.id] ?? '').trim()}>Shipped</button>
                </form>
              ) : <span className="mono muted small">{o.tracking}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
