import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CrispBarcode from '../components/CrispBarcode'
import SaveForPrinterApp from '../components/SaveForPrinterApp'
import PrintNudge from '../components/PrintNudge'
import { loadOrderByCode, type Order } from '../lib/orders'
import { money } from '../lib/data'
import { useSession } from '../lib/session'

/* Order receipt for a mobile thermal receipt printer (58 mm or 80 mm roll), for pop-ups, markets
   and local pickup. Square sales print their own receipts from the Square app. */

const WIDTHS = {
  r58: { name: '2¼ in roll (58 mm)', w: 2.28, wide: false },
  r80: { name: '3⅛ in roll (80 mm)', w: 3.15, wide: true },
} as const
type W = keyof typeof WIDTHS

export default function Receipt() {
  const { code } = useParams()
  const { shop } = useSession()
  const [order, setOrder] = useState<Order | null | undefined>(undefined)
  const [width, setWidth] = useState<W>(() => { try { return (localStorage.getItem('receiptWidth') as W) in WIDTHS ? localStorage.getItem('receiptWidth') as W : 'r58' } catch { return 'r58' } })
  const ref = useRef<HTMLDivElement>(null)
  const [h, setH] = useState(6)
  useEffect(() => { if (code) loadOrderByCode(code).then(setOrder) }, [code])
  useEffect(() => { try { localStorage.setItem('receiptWidth', width) } catch { /* ignore */ } }, [width])
  // A receipt is as long as its items, so size the printed page to fit it exactly.
  useEffect(() => { if (ref.current) setH(Math.ceil((ref.current.scrollHeight / 96) * 10) / 10) }, [order, width])

  if (order === undefined) return <p className="muted">Loading…</p>
  if (order === null) return <div className="empty card"><b>No order with ID {code}</b><Link to="/orders" className="btn ghost">All orders</Link></div>

  const f = WIDTHS[width]
  const lines = order.lines.filter(l => l.qty > 0)
  const sum = lines.reduce((s, l) => s + (l.price ?? 0) * l.qty, 0)
  const total = order.total ?? sum

  return (
    <div className="labels-page">
      <style>{`@page { size: ${f.w}in ${h}in; margin: 0; }`}</style>
      <div className="no-print stack">
        <Link to={`/order/${order.code}`} className="back-link">‹ Order {order.code}</Link>
        <div className="page-head"><div><span className="eyebrow">Selling in person</span><h1>Print receipt</h1></div></div>
        <div className="card stack">
          <div className="stack tight-gap">
            <span className="label-text">Receipt paper</span>
            <div className="seg" role="group" aria-label="Receipt paper">
              {(Object.keys(WIDTHS) as W[]).map(k => <button key={k} className={k === width ? 'on' : ''} aria-pressed={k === width} onClick={() => setWidth(k)}>{WIDTHS[k].name}</button>)}
            </div>
          </div>
          <p className="muted small">From a computer: pick your receipt printer, paper size {width === 'r58' ? '58 mm' : '80 mm'} roll, scale 100%, margins None. From a phone: tap Save for printer app and open the picture in your printer's app.</p>
          <button className="btn primary big" onClick={() => window.print()}>Print</button>
          <SaveForPrinterApp name={`receipt-${order.code}`} />
          <PrintNudge w={f.w} h={0} label={width === 'r58' ? '58 mm receipts' : '80 mm receipts'} />
        </div>
      </div>
      <div className="print-area">
        <div className="sheet" ref={ref} style={{ width: `${f.w}in`, height: 'auto' }}>
          <div className={`receipt ${f.wide ? 'wide' : ''}`}>
            <div className="receipt-shop">{shop?.name ?? 'Thank you!'}</div>
            <div className="receipt-center">{new Date().toLocaleDateString()} · Order {order.code}</div>
            {order.customer?.name && <div className="receipt-center">For {order.customer.name}</div>}
            <div className="receipt-rule" />
            {lines.map(l => (
              <div key={l.id} className="receipt-line">
                <span>{l.qty > 1 ? `${l.qty} × ` : ''}{l.variant?.item.name ?? l.description ?? 'Item'}{l.variant?.label && l.variant.label !== 'One size' ? ` · ${l.variant.label}` : ''}{l.live_number ? ` · #${l.live_number}` : ''}</span>
                <span>{l.price != null ? money(l.price * l.qty) : ''}</span>
              </div>
            ))}
            <div className="receipt-rule" />
            <div className="receipt-line receipt-total"><span>Total</span><span>{money(total)}</span></div>
            <CrispBarcode value={order.code} heightIn={0.4} maxWidthIn={f.w - 0.4} />
            <div className="receipt-center">Thank you for shopping small!</div>
          </div>
        </div>
      </div>
    </div>
  )
}
