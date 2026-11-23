import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import JsBarcode from 'jsbarcode'
import { addressLines, loadOrders, orderUnits, type Order } from '../lib/orders'
import { useSession } from '../lib/session'

const FORMATS = {
  thermal4x6: { name: '4×6 shipping label printer, 1 box per label', page: { w: 4, h: 6 }, cols: 1, rows: 1, label: { w: 4, h: 6 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 } },
  sheet4x2: { name: 'Letter sheet, 10 per page (4×2 in, Avery 5163 size)', page: { w: 8.5, h: 11 }, cols: 2, rows: 5, label: { w: 4, h: 2 }, margin: { top: 0.5, left: 0.156 }, gap: { x: 0.188, y: 0 } },
} as const
type FormatKey = keyof typeof FORMATS

function Barcode({ value, height }: { value: string; height: number }) {
  const ref = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => { if (ref.current) JsBarcode(ref.current, value, { format: 'CODE128', displayValue: false, margin: 0, height, width: 2 }) }, [value, height])
  return <svg ref={ref} className="barcode" preserveAspectRatio="none" />
}

export default function BoxLabels() {
  const [params] = useSearchParams()
  const ids = params.get('ids')?.split(',').filter(Boolean) ?? []
  const { shop } = useSession()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [format, setFormat] = useState<FormatKey>(() => { try { return (localStorage.getItem('boxLabelFormat') as FormatKey) || 'thermal4x6' } catch { return 'thermal4x6' } })
  useEffect(() => { try { localStorage.setItem('boxLabelFormat', format) } catch { /* ignore */ } }, [format])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadOrders({ ids }).then(setOrders) }, [params])

  const f = FORMATS[format]
  const per = f.cols * f.rows
  const list = orders ?? []
  const pages: Order[][] = []
  for (let i = 0; i < list.length; i += per) pages.push(list.slice(i, i + per))
  const big = format === 'thermal4x6'

  return (
    <div className="labels-page">
      <style>{`@page { size: ${f.page.w}in ${f.page.h}in; margin: 0; }`}</style>
      <div className="no-print stack">
        <div className="page-head"><div><span className="eyebrow">Pick and pack</span><h1>Customer box labels</h1></div></div>
        <div className="card stack">
          <label>Label type
            <select value={format} onChange={e => setFormat(e.target.value as FormatKey)}>
              {Object.entries(FORMATS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
            </select>
          </label>
          <p className="muted small">{orders === null ? 'Loading…' : `${list.length} label${list.length === 1 ? '' : 's'}.`} Stick one on each customer's box before you pick. Scanning it tells the app which box an item went into. Print at 100% / Actual size with margins set to None.</p>
          <button className="btn primary big" disabled={!list.length} onClick={() => window.print()}>Print</button>
        </div>
      </div>
      <div className="print-area">
        {pages.map((p, pi) => (
          <div key={pi} className="sheet" style={{ width: `${f.page.w}in`, height: `${f.page.h}in`, paddingTop: `${f.margin.top}in`, paddingLeft: `${f.margin.left}in` }}>
            <div className="sheet-grid" style={{ gridTemplateColumns: `repeat(${f.cols}, ${f.label.w}in)`, gridAutoRows: `${f.label.h}in`, columnGap: `${f.gap.x}in` }}>
              {p.map(o => (
                <div key={o.id} className="slot">
                  <div className={`box-label ${big ? 'big' : ''}`}>
                    <div className="box-label-head"><span>{shop?.name ?? ''}</span><span>{o.live_date ? `Live ${new Date(o.live_date + 'T12:00').toLocaleDateString()}` : ''}</span></div>
                    <div className="box-label-code">{o.code}</div>
                    <Barcode value={o.code} height={big ? 90 : 36} />
                    <div className="box-label-name">{o.customer?.name ?? 'Customer'}</div>
                    {big && <div className="box-label-addr">{addressLines(o.customer).map((a, i) => <div key={i}>{a}</div>)}</div>}
                    <div className="box-label-foot">
                      <span>{orderUnits(o)} item{orderUnits(o) === 1 ? '' : 's'}</span>
                      {o.external_ref && <span>Bot #{o.external_ref}</span>}
                      {o.customer?.handle && big && <span>{o.customer.handle}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
