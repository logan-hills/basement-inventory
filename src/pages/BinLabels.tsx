import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SaveForPrinterApp from '../components/SaveForPrinterApp'
import PrintNudge from '../components/PrintNudge'
import JsBarcode from 'jsbarcode'
import { loadBins, type Bin } from '../lib/locations'
import { useSession } from '../lib/session'
import CrispBarcode from '../components/CrispBarcode'

function LandscapeBin({ b, shop }: { b: Bin; shop: string }) {
  const parts: [string, string | number | null][] = [['Aisle', b.aisle], ['Section', b.section], ['Level', b.level], ['Bin', b.bin_no]]
  return (
    <div className="bin-land">
      <div className="bin-land-head"><span>{shop}</span><span>Bin location</span></div>
      <div className="bin-land-code">{b.code}</div>
      <div className="bin-land-parts">
        {parts.map(([k, v]) => <div key={k}><span>{k}</span><b>{v ?? '—'}</b></div>)}
      </div>
      <Barcode value={b.code} height={70} />
      <div className="bin-land-foot">Scan this label, then scan items to put them away here.</div>
    </div>
  )
}

/** 4×4 bin label: our recommended bin size (MUNBYN 4×4 roll). Big code you can read across the room. */
function SquareBin({ b, shop }: { b: Bin; shop: string }) {
  const parts: [string, string | number | null][] = [['Aisle', b.aisle], ['Sec', b.section], ['Level', b.level], ['Bin', b.bin_no]]
  return (
    <div className="bin44">
      <div className="bin44-head"><span>{shop}</span><span>Bin</span></div>
      <div className="bin44-code" style={{ fontSize: `${Math.min(60, Math.floor(250 / (b.code.length * 0.64)))}pt` }}>{b.code}</div>
      <div className="bin44-parts">
        {parts.map(([k, v]) => <div key={k}><span>{k}</span><b>{v ?? '—'}</b></div>)}
      </div>
      <CrispBarcode value={b.code} heightIn={1.05} maxWidthIn={3.5} maxDots={4} />
      <div className="bin44-foot">Scan this label, then scan items to put them away here.</div>
    </div>
  )
}

const FORMATS = {
  roll4x4: { name: 'Thermal roll 4×4 in, one bin per label (recommended)', page: { w: 4, h: 4 }, cols: 1, rows: 1, label: { w: 4, h: 4 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 } },
  landscape4x6: { name: '4×6 shipping label printer, landscape, 1 bin per label', page: { w: 4, h: 6 }, cols: 1, rows: 1, label: { w: 4, h: 6 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 } },
  roll2x1: { name: 'Thermal roll 2×1 in, one bin per label', page: { w: 2, h: 1 }, cols: 1, rows: 1, label: { w: 2, h: 1 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 } },
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
  const { shop } = useSession()
  const [bins, setBins] = useState<Bin[]>([])
  const [aisle, setAisle] = useState<string>('all')
  const [format, setFormat] = useState<FormatKey>(() => {
    try { const f = localStorage.getItem('binLabelFormat') as FormatKey; return f && f in FORMATS ? f : 'roll4x4' } catch { return 'roll4x4' }
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
  const land = format === 'landscape4x6'

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
          <p className="muted small">{list.length} label{list.length === 1 ? '' : 's'} on {pages.length} page{pages.length === 1 ? '' : 's'}. Print at 100% / Actual size with margins set to None.{land ? ' Landscape labels are turned sideways for the printer automatically.' : ''}{format === 'roll4x4' ? ' Load the 4×4 roll and set paper size to 4 x 4 in (101.6 x 101.6 mm) in the print window.' : ''}{format === 'roll2x1' ? ' Use the same 2×1 roll as your item tags: set paper size to 2 x 1 in (50.8 x 25.4 mm) in the print window. Tip: a bigger bin label is easier to scan from a distance; the 4×4 roll is our recommended bin size.' : ''}</p>
          <button className="btn primary big" disabled={!list.length} onClick={() => window.print()}>Print</button>
          <SaveForPrinterApp name="bin-labels" disabled={!list.length} />
          <PrintNudge w={f.page.w} h={f.page.h} />
          <p className="muted small">Need a printer or labels? See <Link to="/gear">Recommended gear</Link>.</p>
        </div>
      </div>
      <div className="print-area">
        {land && list.map(b => (
          <div key={b.id} className="sheet land-sheet"><div className="land-rot"><LandscapeBin b={b} shop={shop?.name ?? ''} /></div></div>
        ))}
        {!land && pages.map((p, pi) => (
          <div key={pi} className="sheet" style={{ width: `${f.page.w}in`, height: `${f.page.h}in`, paddingTop: `${f.margin.top}in`, paddingLeft: `${f.margin.left}in` }}>
            <div className="sheet-grid" style={{ gridTemplateColumns: `repeat(${f.cols}, ${f.label.w}in)`, gridAutoRows: `${f.label.h}in`, columnGap: `${f.gap.x}in` }}>
              {p.map(b => format === 'roll4x4' ? (
                <div key={b.id} className="slot"><SquareBin b={b} shop={shop?.name ?? ''} /></div>
              ) : format === 'roll2x1' ? (
                <div key={b.id} className="slot">
                  <div className="bin21">
                    <div className="bin21-code">{b.code}</div>
                    <CrispBarcode value={b.code} heightIn={0.42} maxWidthIn={1.8} />
                    <div className="bin21-name">Aisle {b.aisle} · Sec {b.section} · Lvl {b.level} · Bin {b.bin_no}</div>
                  </div>
                </div>
              ) : (
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
