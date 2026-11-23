import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import JsBarcode from 'jsbarcode'
import { loadBins, type Bin } from '../lib/locations'

const FORMATS = {
  sheet10: { name: 'Letter sheet, 10 per page (4×2 in, Avery 5163 size)', page: { w: 8.5, h: 11 }, cols: 2, rows: 5, label: { w: 4, h: 2 }, margin: { top: 0.5, left: 0.156 }, gap: { x: 0.188, y: 0 } },
  thermal4x6: { name: '4×6 shipping label printer, 1 bin per label', page: { w: 4, h: 6 }, cols: 1, rows: 1, label: { w: 4, h: 6 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 } },
  thermal4x6x3: { name: '4×6 shipping label printer, 3 bins per label (cut apart)', page: { w: 4, h: 6 }, cols: 1, rows: 3, label: { w: 4, h: 2 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 } },
} as const
type FormatKey = keyof typeof FORMATS

function Barcode({ value, height }: { value: string; height: number }) {
  const ref = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => { if (ref.current) JsBarcode(ref.current, value, { format: 'CODE128', displayValue: false, margin: 0, height, width: 2 }) }, [value, height])
  return <svg ref={ref} className="barcode" preserveAspectRatio="none" />
}

export default function BinLabels() {
  const [params] = useSearchParams()
  const ids = params.get('ids')?.split(',') ?? null
  const [bins, setBins] = useState<Bin[]>([])
  const [aisle, setAisle] = useState<string>('all')
  const [format, setFormat] = useState<FormatKey>(() => {
    try { return (localStorage.getItem('binLabelFormat') as FormatKey) || 'sheet10' } catch { return 'sheet10' }
  })
  useEffect(() => { try { localStorage.setItem('binLabelFormat', format) } catch { /* ignore */ } }, [format])
  useEffect(() => { loadBins().then(setBins) }, [])

  const aisles = [...new Set(bins.map(b => b.aisle).filter(a => a != null))] as number[]
  const list = useMemo(() => bins.filter(b => (ids ? ids.includes(b.id) : aisle === 'all' || String(b.aisle) === aisle)), [bins, ids, aisle])

  const f = FORMATS[format]
  const per = f.cols * f.rows
  const pages: Bin[][] = []
  for (let i = 0; i < list.length; i += per) pages.push(list.slice(i, i + per))
  const tall = f.label.h >= 4

  return (
    <div className="labels-page">
      <style>{`@page { size: ${f.page.w}in ${f.page.h}in; margin: 0; }`}</style>
      <div className="no-print stack">
        <div className="page-head"><div><span className="eyebrow">Warehouse</span><h1>Bin labels</h1></div></div>
        <div className="card stack">
          <label>Label type
            <select value={format} onChange={e => setFormat(e.target.value as FormatKey)}>
              {Object.entries(FORMATS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
            </select>
          </label>
          {!ids && aisles.length > 1 && (
            <label>Which bins
              <select value={aisle} onChange={e => setAisle(e.target.value)}>
                <option value="all">All aisles</option>
                {aisles.map(a => <option key={a} value={a}>Aisle {a}</option>)}
              </select>
            </label>
          )}
          <p className="muted small">{list.length} label{list.length === 1 ? '' : 's'} on {pages.length} page{pages.length === 1 ? '' : 's'}. Print at 100% / Actual size with margins set to None.</p>
          <button className="btn primary big" disabled={!list.length} onClick={() => window.print()}>Print</button>
        </div>
      </div>
      <div className="print-area">
        {pages.map((p, pi) => (
          <div key={pi} className="sheet" style={{ width: `${f.page.w}in`, height: `${f.page.h}in`, paddingTop: `${f.margin.top}in`, paddingLeft: `${f.margin.left}in` }}>
            <div className="sheet-grid" style={{ gridTemplateColumns: `repeat(${f.cols}, ${f.label.w}in)`, gridAutoRows: `${f.label.h}in`, columnGap: `${f.gap.x}in` }}>
              {p.map(b => (
                <div key={b.id} className="slot">
                  <div className={`bin-label ${tall ? 'tall' : ''}`}>
                    <div className="bin-label-code">{b.code}</div>
                    <Barcode value={b.code} height={tall ? 120 : 50} />
                    <div className="bin-label-name">Aisle {b.aisle} · Section {b.section} · Level {b.level} · Bin {b.bin_no}</div>
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
