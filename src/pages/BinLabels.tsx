import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SaveForPrinterApp from '../components/SaveForPrinterApp'
import PrintNudge from '../components/PrintNudge'
import DirectPrint from '../components/DirectPrint'
import JsBarcode from 'jsbarcode'
import { loadBins, type Bin } from '../lib/locations'
import { useSession } from '../lib/session'
import CrispBarcode from '../components/CrispBarcode'
import { LabelPreview, LabelSheet, LabelSizePicker, pageCss, printedPage, sizeText, type LabelFormat } from '../components/LabelKit'

function LandscapeBin({ b, shop }: { b: Bin; shop: string }) {
  const parts: [string, string | number | null][] = [['Aisle', b.aisle], ['Section', b.section], ['Level', b.level], ['Bin', b.bin_no]]
  return (
    <div className="bin-land">
      <div className="bin-land-head"><span>{shop}</span><span>Bin location</span></div>
      <div className="bin-land-code" style={{ fontSize: `${Math.min(64, Math.floor(380 / (b.code.length * 0.64)))}pt`, whiteSpace: 'nowrap' }}>{b.code}</div>
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
  roll4x4: { name: '4 × 4 in roll, one bin per label', sub: 'Recommended. Big and easy to scan from across the room', group: 'thermal', page: { w: 4, h: 4 }, cols: 1, rows: 1, label: { w: 4, h: 4 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 } },
  landscape4x6: { name: '4 × 6 in shipping label, landscape', sub: 'The labels most sellers already have. Printed wide and bold', group: 'thermal', page: { w: 6, h: 4 }, cols: 1, rows: 1, label: { w: 6, h: 4 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 }, turn: true },
  thermal4x6: { name: '4 × 6 in shipping label, standing up', sub: 'One tall bin label', group: 'thermal', page: { w: 4, h: 6 }, cols: 1, rows: 1, label: { w: 4, h: 6 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 } },
  thermal4x6x3: { name: '4 × 6 in shipping label, 3 bins', sub: 'Cut apart. Great for small shelf edges', group: 'thermal', page: { w: 4, h: 6 }, cols: 1, rows: 3, label: { w: 4, h: 2 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 } },
  roll2x1: { name: '2 × 1 in roll, one bin per label', sub: 'Same roll as your item tags', group: 'thermal', page: { w: 2, h: 1 }, cols: 1, rows: 1, label: { w: 2, h: 1 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 } },
  dymo30252: { name: 'DYMO 1⅛ × 3½ in (30252)', sub: 'Address labels. Nice for shelf edges', group: 'dymo', page: { w: 3.5, h: 1.125 }, cols: 1, rows: 1, label: { w: 3.5, h: 1.125 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 }, turn: true },
  dymo30336: { name: 'DYMO 1 × 2⅛ in (30336)', sub: 'Same roll as your DYMO item tags', group: 'dymo', page: { w: 2.125, h: 1 }, cols: 1, rows: 1, label: { w: 2.125, h: 1 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 }, turn: true },
  paper2: { name: 'Plain paper, 2 big labels per page', sub: 'No labels needed. Cut apart and tape them on', group: 'paper', page: { w: 8.5, h: 11 }, cols: 1, rows: 2, label: { w: 6, h: 4 }, margin: { top: 1.25, left: 1.25 }, gap: { x: 0, y: 0.5 } },
  sheet10: { name: 'Letter sheet, 10 per page', sub: '4 × 2 in, Avery 5163 size', group: 'paper', page: { w: 8.5, h: 11 }, cols: 2, rows: 5, label: { w: 4, h: 2 }, margin: { top: 0.5, left: 0.156 }, gap: { x: 0.188, y: 0 } },
} satisfies Record<string, LabelFormat>
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

  const f: LabelFormat = FORMATS[format]
  const dymo = f.group === 'dymo'
  const [noTurn, setNoTurn] = useState(() => { try { return localStorage.getItem('dymoNoTurn') === '1' } catch { return false } })
  useEffect(() => { try { localStorage.setItem('dymoNoTurn', noTurn ? '1' : '0') } catch { /* ignore */ } }, [noTurn])
  const turned = !!f.turn && !(dymo && noTurn)
  const printed = printedPage(f, turned)
  const per = f.cols * f.rows
  const pages: Bin[][] = []
  for (let i = 0; i < list.length; i += per) pages.push(list.slice(i, i + per))
  const shopName = shop?.name ?? ''

  const labelFor = (b: Bin): ReactNode => {
    if (format === 'roll4x4') return <SquareBin b={b} shop={shopName} />
    if (format === 'landscape4x6' || format === 'paper2') return <LandscapeBin b={b} shop={shopName} />
    if (f.label.h <= 1.25) return (
      <div className={`bin21 ${f.label.w >= 3 ? 'wide' : ''}`}>
        <div className="bin21-code">{b.code}</div>
        <CrispBarcode value={b.code} heightIn={0.42} maxWidthIn={Math.min(3, f.label.w - 0.2)} dpi={dymo ? 300 : 203} maxDots={dymo ? 4 : 3} minDotsToThin={3} />
        <div className="bin21-name">Aisle {b.aisle} · Sec {b.section} · Lvl {b.level} · Bin {b.bin_no}</div>
      </div>
    )
    const tall = f.label.h >= 4
    return (
      <div className={`bin-label ${tall ? 'tall' : ''}`}>
        <div className="bin-label-code">{b.code}</div>
        <Barcode value={b.code} height={tall ? 120 : 50} />
        <div className="bin-label-name">Aisle {b.aisle} · Section {b.section} · Level {b.level} · Bin {b.bin_no}</div>
      </div>
    )
  }

  const paperTip: Partial<Record<FormatKey, string>> = {
    roll4x4: 'Load the 4×4 roll and set paper size to 4 x 4 in (101.6 x 101.6 mm) in the print window.',
    landscape4x6: 'Load your 4×6 shipping labels and set paper size to 4 x 6 in. The app turns each label sideways for the printer, so keep the layout on Portrait.',
    thermal4x6: 'Load your 4×6 shipping labels and set paper size to 4 x 6 in.',
    thermal4x6x3: 'Load your 4×6 shipping labels and set paper size to 4 x 6 in. Cut along the lines after.',
    roll2x1: 'Use the same 2×1 roll as your item tags: set paper size to 2 x 1 in (50.8 x 25.4 mm). A bigger label is easier to scan from a distance.',
    dymo30252: 'Choose your DYMO and paper size 30252 (1-1/8 in x 3-1/2 in), layout Portrait. The app turns each label to match how DYMO feeds.',
    dymo30336: 'Choose your DYMO and paper size 30336 (1 in x 2-1/8 in), layout Portrait. The app turns each label to match how DYMO feeds.',
    paper2: 'Any home printer and plain letter paper. Cut along the outline and tape it on, or slip it in a clear sleeve.',
    sheet10: 'Letter paper size, any home printer. Load the label sheet face up.',
  }

  return (
    <div className="labels-page stack">
      <style>{pageCss(f, turned)}</style>
      <div className="page-head no-print"><div><span className="eyebrow">Warehouse</span><h1>Bin labels</h1></div></div>
      <div className="label-print-layout">
        <div className="no-print stack">
          <section className="card stack">
            <h2 className="preview-title">1. Pick your label size</h2>
            <p className="muted small">Use whatever labels you have. Every size here works, and you'll see a preview before anything prints.</p>
            <LabelSizePicker formats={FORMATS} value={format} onChange={setFormat} />
            {!ids && aisles.length > 1 && (
              <label>Which bins
                <select value={aisle} onChange={e => setAisle(e.target.value)}>
                  <option value="all">All aisles</option>
                  {aisles.map(a => <option key={a} value={a}>Aisle {a}</option>)}
                </select>
              </label>
            )}
          </section>
        </div>

        {list.length ? (
          <LabelPreview f={f} turned={turned} pages={pages.length} labels={list.length}>
            {pages.map((p, pi) => (
              <LabelSheet key={pi} f={f} turned={turned}>
                {p.map(b => <div key={b.id} className={`slot ${format === 'paper2' ? 'cut' : ''}`}>{labelFor(b)}</div>)}
              </LabelSheet>
            ))}
          </LabelPreview>
        ) : (
          <section className="card empty no-print"><b>No bins yet</b><span className="muted">Add bins in <Link to="/warehouse">Warehouse</Link>, then print their labels here.</span></section>
        )}

        <section className="card stack no-print">
          <h2 className="preview-title">2. Looks good? Print</h2>
          {f.group === 'thermal' && <DirectPrint w={printed.w} h={printed.h} turn={turned} count={pages.length} sizeName={sizeText(printed.w, printed.h)} />}
          {f.group === 'thermal' && <p className="small muted print-window-head">Or use your computer's print window:</p>}
          <p className="muted small">{paperTip[format]} Print at <b>100%</b> (Actual size) with margins set to <b>None</b>.</p>
          {dymo && <label className="check-line"><input type="checkbox" checked={noTurn} onChange={e => setNoTurn(e.target.checked)} />Label came out sideways or cut off? Tick this to let the printer turn it instead, then print again.</label>}
          <button className="btn primary big" disabled={!list.length} onClick={() => window.print()}>Print {list.length} label{list.length === 1 ? '' : 's'}</button>
          <SaveForPrinterApp name="bin-labels" disabled={!list.length} turn={turned && f.group === 'thermal'} />
          <PrintNudge w={printed.w} h={printed.h} />
          <p className="muted small">Need a printer or labels? See <Link to="/gear">Recommended gear</Link>.</p>
        </section>
      </div>
    </div>
  )
}
