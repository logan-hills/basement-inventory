import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Link, useSearchParams } from 'react-router-dom'
import JsBarcode from 'jsbarcode'
import { supabase } from '../lib/supabase'
import { money } from '../lib/data'
import CrispBarcode from '../components/CrispBarcode'
import SaveForPrinterApp from '../components/SaveForPrinterApp'
import PrintNudge from '../components/PrintNudge'
import DirectPrint from '../components/DirectPrint'
import { LabelPreview, LabelSheet, LabelSizePicker, pageCss, printedPage, sizeText, type LabelFormat } from '../components/LabelKit'

type Tag = { tag_code: string; live_number: string; name: string; variant: string; price: number | null; sale: number | null }
type Style = 'regular' | 'sale'
type SaleMode = 'item' | 'pct' | 'fixed'

// Label layouts. Sizes in inches, as you read the label.
const FORMATS = {
  roll2x1: {
    name: '2 × 1 in roll, one tag per label', sub: 'Recommended. White roll for tags, yellow for sale tags', group: 'thermal',
    page: { w: 2, h: 1 }, cols: 1, rows: 1,
    label: { w: 2, h: 1 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 },
  },
  roll: {
    name: '2¼ × 1¼ in roll, one tag per label', sub: 'Small thermal roll', group: 'thermal',
    page: { w: 2.25, h: 1.25 }, cols: 1, rows: 1,
    label: { w: 2.25, h: 1.25 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 },
  },
  thermal4x6: {
    name: '4 × 6 in shipping label, 12 tags', sub: 'Cut them apart. Uses the labels you already have', group: 'thermal',
    page: { w: 4, h: 6 }, cols: 2, rows: 6,
    label: { w: 2, h: 1 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 },
  },
  dymoThermal: {
    name: 'DYMO 1 × 2⅛ in (30336) in a 4 in thermal printer', sub: 'DYMO labels in the Core Innovations, Nelko and similar', group: 'thermal',
    page: { w: 2.125, h: 1 }, cols: 1, rows: 1,
    label: { w: 2.125, h: 1 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 }, turn: true,
  },
  dymo30336: {
    name: 'DYMO 1 × 2⅛ in (30336)', sub: 'For a DYMO LabelWriter printer. Labels from Staples', group: 'dymo',
    page: { w: 2.125, h: 1 }, cols: 1, rows: 1,
    label: { w: 2.125, h: 1 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 }, turn: true,
  },
  dymo30252: {
    name: 'DYMO 1⅛ × 3½ in (30252)', sub: 'Address labels. One roomy tag per label', group: 'dymo',
    page: { w: 3.5, h: 1.125 }, cols: 1, rows: 1,
    label: { w: 3.5, h: 1.125 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 }, turn: true,
  },
  sheet30: {
    name: 'Letter sheet, 30 per page', sub: 'Avery 5160 / 8160 size, any home printer', group: 'paper',
    page: { w: 8.5, h: 11 }, cols: 3, rows: 10,
    label: { w: 2.625, h: 1 }, margin: { top: 0.5, left: 0.1875 }, gap: { x: 0.125, y: 0 },
  },
} satisfies Record<string, LabelFormat>
type FormatKey = keyof typeof FORMATS

function Barcode({ value }: { value: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => {
    if (ref.current) JsBarcode(ref.current, value, { format: 'CODE128', displayValue: false, margin: 0, height: 40, width: 2 })
  }, [value])
  return <svg ref={ref} className="barcode" preserveAspectRatio="none" />
}

/** One-tag-per-label tag (2×1 thermal, DYMO). Pure black so it prints sharp on white or yellow rolls.
    DYMO LabelWriters print at 300 dots per inch, thermal shipping printers at 203. */
function RollTag({ t, sale, widthIn = 2, dpi = 203 }: { t: Tag; sale: number | null; widthIn?: number; dpi?: number }) {
  const name = `${t.name}${t.variant && t.variant !== 'One size' ? ` · ${t.variant}` : ''}`
  return (
    <div className={`tag21 ${sale != null ? 'is-sale' : ''} ${widthIn >= 3 ? 'wide' : ''}`}>
      <div className="tag21-top">
        {sale != null && <span className="tag21-sale">SALE</span>}
        <span className="tag21-live">#{t.live_number}</span>
        <span className="tag21-price">{money(sale ?? t.price)}</span>
      </div>
      <div className="tag21-name">
        <span>{name}</span>
        {sale != null && t.price != null && <s>{money(t.price)}</s>}
      </div>
      <CrispBarcode value={t.tag_code} heightIn={sale != null ? 0.32 : 0.36} maxWidthIn={Math.min(2.6, widthIn - 0.2)} dpi={dpi} maxDots={dpi > 250 ? 4 : 3} />
      <div className="tag21-code">{t.tag_code}</div>
    </div>
  )
}

function TagLabel({ t, sale }: { t: Tag; sale?: number | null }) {
  if (sale != null) return (
    <div className="tag is-sale">
      <div className="tag-top">
        <span className="tag-live"><span className="tag21-sale">SALE</span> #{t.live_number}</span>
        <span className="tag-price">{money(sale)} {t.price != null && <s>{money(t.price)}</s>}</span>
      </div>
      <div className="tag-name">{t.name}{t.variant && t.variant !== 'One size' ? ` · ${t.variant}` : ''}</div>
      <Barcode value={t.tag_code} />
      <div className="tag-code">{t.tag_code}</div>
    </div>
  )
  return (
    <div className="tag">
      <div className="tag-top">
        <span className="tag-live">#{t.live_number}</span>
        <span className="tag-price">{money(t.price)}</span>
      </div>
      <div className="tag-name">{t.name}{t.variant && t.variant !== 'One size' ? ` · ${t.variant}` : ''}</div>
      <Barcode value={t.tag_code} />
      <div className="tag-code">{t.tag_code}</div>
    </div>
  )
}

export default function Labels() {
  const [params] = useSearchParams()
  const itemId = params.get('item')
  const variantId = params.get('variant')
  const itemsParam = params.get('items')
  const tagsParam = params.get('tags')
  const variantsParam = params.get('variants')
  const [tags, setTags] = useState<Tag[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [format, setFormat] = useState<FormatKey>(() => { try { const f = localStorage.getItem('labelFormat') as FormatKey; return f && f in FORMATS ? f : 'roll2x1' } catch { return 'roll2x1' } })
  const [skip, setSkip] = useState(0)
  const [style, setStyle] = useState<Style>(params.get('style') === 'sale' ? 'sale' : 'regular')
  const [saleMode, setSaleMode] = useState<SaleMode>('item')
  const [saleVal, setSaleVal] = useState('')

  useEffect(() => { try { localStorage.setItem('labelFormat', format) } catch { /* ignore */ } }, [format])
  // Some DYMO setups turn the label themselves. Then the seller switches our turn off, once, on this device.
  const [noTurn, setNoTurn] = useState(() => { try { return localStorage.getItem('dymoNoTurn') === '1' } catch { return false } })
  useEffect(() => { try { localStorage.setItem('dymoNoTurn', noTurn ? '1' : '0') } catch { /* ignore */ } }, [noTurn])

  useEffect(() => {
    (async () => {
      let q = supabase
        .from('units')
        .select('tag_code, status, variant:variants!inner(*, item:items!inner(name))')
        .order('tag_code')
      // Reprinting specific tags works for any status; everything else prints in-stock tags only.
      if (tagsParam) q = q.in('tag_code', tagsParam.split(','))
      else q = q.eq('status', 'in_stock')
      if (tagsParam) { /* already filtered */ }
      else if (variantsParam) q = q.in('variant_id', variantsParam.split(','))
      else if (variantId) q = q.eq('variant_id', variantId)
      else if (itemId) q = q.eq('variant.item_id', itemId)
      else if (itemsParam) q = q.in('variant.item_id', itemsParam.split(','))
      const { data } = await q
      const list: Tag[] = (data ?? []).map((u: any) => ({
        tag_code: u.tag_code,
        live_number: u.variant.live_number,
        name: u.variant.item.name,
        variant: u.variant.label,
        price: u.variant.price,
        sale: u.variant.sale_price ?? null,
      }))
      setTags(list)
      setTitle(itemsParam || variantsParam || (list.length && new Set(list.map(t => t.name)).size > 1) ? `${new Set(list.map(t => t.name)).size} items` : (list[0]?.name ?? ''))
      setLoading(false)
    })()
  }, [itemId, variantId, itemsParam, tagsParam, variantsParam])

  // Some 4 in printers start printing a little way into each DYMO label, so the end of the tag spills onto the next
  // label and that label gets skipped. "Starts late by" shortens the tag by that much so it ends right at the label's end.
  const [late, setLate] = useState(() => { try { return Math.max(0, Math.min(20, Number(localStorage.getItem('dymoLateMm')) || 0)) } catch { return 0 } })
  useEffect(() => { try { localStorage.setItem('dymoLateMm', String(late)) } catch { /* ignore */ } }, [late])
  const f: LabelFormat = useMemo(() => {
    const base: LabelFormat = FORMATS[format]
    if (format !== 'dymoThermal' || !late) return base
    const w = +(2.125 - late / 25.4).toFixed(3)
    return { ...base, page: { w, h: 1 }, label: { w, h: 1 } }
  }, [format, late])
  const dymo = f.group === 'dymo'
  const turned = !!f.turn && !(dymo && noTurn)
  // DYMO rolls are 1 in wide. In a 4 in printer that sits the roll in the middle, a 1 in page prints on the left edge of the
  // print head, off the roll (a blank label). "Middle" mode prints a 4 in wide page with the tag in the middle, under the roll.
  const [rollMiddle, setRollMiddle] = useState(() => { try { return localStorage.getItem('dymoRollMiddle') === '1' } catch { return false } })
  useEffect(() => { try { localStorage.setItem('dymoRollMiddle', rollMiddle ? '1' : '0') } catch { /* ignore */ } }, [rollMiddle])
  const head4 = format === 'dymoThermal' && rollMiddle
  const printed = head4 ? { w: 4, h: f.page.w } : printedPage(f, turned)
  const perPage = f.cols * f.rows
  const single = perPage === 1
  const n = Number(saleVal.replace(/[$,%\s]/g, ''))
  const saleFor = (t: Tag): number | null => {
    if (style !== 'sale') return null
    if (saleMode === 'item') return t.sale ?? t.price
    if (!saleVal || Number.isNaN(n)) return t.sale ?? t.price
    if (saleMode === 'fixed') return n
    return t.price == null ? null : Math.round(t.price * (100 - Math.min(100, n))) / 100
  }
  const noSale = style === 'sale' && saleMode === 'item' ? tags.filter(t => t.sale == null).length : 0
  const slots: (Tag | null)[] = [...Array(single ? 0 : Math.min(skip, perPage - 1)).fill(null), ...tags]
  const pages: (Tag | null)[][] = []
  for (let i = 0; i < slots.length; i += perPage) pages.push(slots.slice(i, i + perPage))
  // "Print 1 test tag": prints only the first tag, so a new printer setting costs one label, not a whole batch.
  const [testOne, setTestOne] = useState(false)
  useEffect(() => { const off = () => setTestOne(false); window.addEventListener('afterprint', off); return () => window.removeEventListener('afterprint', off) }, [])
  const printTest = () => { flushSync(() => setTestOne(true)); window.print(); setTimeout(() => setTestOne(false), 1500) }
  const shownPages = testOne ? pages.slice(0, 1) : pages


  const tagFor = (t: Tag) => (single
    ? <RollTag t={t} sale={saleFor(t)} widthIn={f.label.w} dpi={dymo ? 300 : 203} />
    : <TagLabel t={t} sale={saleFor(t)} />)

  return (
    <div className="labels-page stack">
      <style>{head4 ? `@page { size: 4in ${f.page.w}in; margin: 0; }` : pageCss(f, turned)}</style>
      <h1 className="no-print">{style === 'sale' ? 'Sale tags' : tagsParam ? 'Reprint tags' : 'Print tags'}{title ? `: ${title}` : ''}</h1>
      {loading ? <p className="muted">Loading…</p> : tags.length === 0 ? (
        <p className="muted">No tags to print. <Link to="/inventory" className="link-text">Back to inventory</Link></p>
      ) : (
        <div className="label-print-layout">
          <div className="no-print stack">
            <section className="card stack">
              <h2 className="preview-title">1. Pick your label</h2>
              <LabelSizePicker formats={FORMATS} value={format} onChange={setFormat} />
              <div className="stack tight-gap">
                <span className="label-text">Tag style</span>
                <div className="seg" role="group" aria-label="Tag style">
                  <button className={style === 'regular' ? 'on' : ''} aria-pressed={style === 'regular'} onClick={() => setStyle('regular')}>{dymo || format === 'dymoThermal' ? 'Regular tag' : 'Regular (white roll)'}</button>
                  <button className={style === 'sale' ? 'on sale-on' : ''} aria-pressed={style === 'sale'} onClick={() => setStyle('sale')}>{dymo || format === 'dymoThermal' ? 'Sale tag' : 'Sale (yellow roll)'}</button>
                </div>
              </div>
              {style === 'sale' && (
                <div className="sale-box stack">
                  <div className="row2">
                    <label>Sale price
                      <select value={saleMode} onChange={e => setSaleMode(e.target.value as SaleMode)}>
                        <option value="item">Each item's own sale price</option>
                        <option value="pct">Percent off the regular price</option>
                        <option value="fixed">One price for all</option>
                      </select>
                    </label>
                    {saleMode !== 'item' && (
                      <label>{saleMode === 'pct' ? 'Percent off' : 'Sale price'}
                        <span className="input-suffix"><input inputMode="decimal" value={saleVal} onChange={e => setSaleVal(e.target.value.replace(/[^0-9.]/g, ''))} placeholder={saleMode === 'pct' ? '30' : '10.00'} /><span>{saleMode === 'pct' ? '% off' : '$'}</span></span>
                      </label>
                    )}
                  </div>
                  {noSale > 0 && <p className="small warn-text">{noSale} tag{noSale === 1 ? ' has' : 's have'} no sale price yet, so {noSale === 1 ? 'it shows' : 'they show'} the regular price. Set one on the item page, use Edit in Inventory, or pick Percent off.</p>}
                  <p className="muted small">{dymo || format === 'dymoThermal'
                    ? <>DYMO rolls are white, so the tag says <b>SALE</b> in a bold black box with the old price crossed out. Want color? DYMO sells colored labels too.</>
                    : <>Load the <b>yellow</b> roll before you print. The tag says SALE with the old price crossed out.</>}</p>
                </div>
              )}
              {!single && (
                <label>Skip used labels at the start of the sheet
                  <input inputMode="numeric" value={skip} onChange={e => setSkip(Math.max(0, parseInt(e.target.value.replace(/\D/g, '') || '0', 10)))} />
                </label>
              )}
            </section>
          </div>

          <LabelPreview f={f} turned={turned} pages={pages.length} labels={tags.length} areaClass={head4 ? 'head4' : ''}>
            {shownPages.map((p, pi) => (
              <LabelSheet key={pi} f={f} turned={turned}>
                {p.map((t, i) => <div key={i} className="slot">{t && tagFor(t)}</div>)}
              </LabelSheet>
            ))}
          </LabelPreview>

          <section className="card stack no-print">
            <h2 className="preview-title">2. Looks good? Print</h2>
            {dymo && (
              <div className="direct-print stack">
                <b>Is this DYMO roll in a Core Innovations or other shipping label printer?</b>
                <span className="small muted">This choice is for DYMO's own LabelWriter printer. For a shipping label printer, switch to the thermal printer setting to get Direct print, with no printer settings needed.</span>
                <button className="btn gold big" onClick={() => setFormat('dymoThermal')}>Yes, switch to my thermal printer</button>
              </div>
            )}
            {f.group === 'thermal' && (() => {
              const bf: LabelFormat = FORMATS[format]
              const base = printedPage(bf, !!bf.turn)
              return <DirectPrint w={base.w} h={base.h} turn={!!bf.turn} count={pages.length} sizeName={sizeText(bf.label.w, bf.label.h)}
                prepare={() => { if (late) setLate(0) }} />
            })()}
            {f.group === 'thermal' && <p className="small muted print-window-head">Or use your computer's print window:</p>}
            {format === 'roll2x1' && (
              <div className="printer-tip small">
                <b>Thermal printer setup (one time)</b>
                <ol>
                  <li>Load the 2×1 roll, then hold the printer's feed button until it feeds a label or two, so it learns the gap.</li>
                  <li>In the print window, choose your thermal printer and set paper size to <b>2 x 1 in</b> (50.8 x 25.4 mm). If it isn't listed, add it under the printer's Preferences or Paper size.</li>
                  <li>Scale <b>100%</b> (or Actual size), margins <b>None</b>, headers and footers off.</li>
                  <li>Print lands a little to one side? Open <b>Nudge it</b> below and line it up once. The app remembers it.</li>
                </ol>
                <span className="muted">Each tag prints on its own label. White roll for regular tags, yellow roll for sale tags.</span>
              </div>
            )}
            {format === 'dymoThermal' && (
              <details className="printer-tip small dymo-thermal-tip">
                <summary><b>Using the print window instead? One-time setup</b></summary>
                <p>Your printer feeds these labels the long way: <b>1 inch across, 2⅛ inches long</b>. The print window has to know that size, or one tag gets stretched over two labels.</p>
                <ol>
                  <li>Load the DYMO roll so the labels come out one after another, the long way. Slide the roll guides in snug so it can't wander. Hold the feed button until a label feeds out, so the printer finds the gaps.</li>
                  <li>Tap <b>Print 1 test tag</b> below. In the print window, pick your <b>Core Innovations</b> printer (or other shipping printer).</li>
                  <li>Set <b>Paper size</b> to <b>{rollMiddle ? '4 x 2.125 in' : '1 x 2.125 in'}</b> ({rollMiddle ? '101.6' : '25'} x 54 mm). Not there yet? Add it once:
                    <ul>
                      <li><b>Windows:</b> under More settings, click <i>Print using system dialog</i>, then Preferences. On the Page Setup or Paper tab, click New (or Custom), and make a size {rollMiddle ? '4.00' : '1.00'} in wide by 2.13 in tall ({rollMiddle ? '101.6' : '25'} by 54 mm). Save it and pick it.</li>
                      <li><b>Mac:</b> Paper Size, then Manage Custom Sizes, then +. Width {rollMiddle ? '4' : '1'} in, height 2.125 in, all margins 0. Pick your printer under Non-Printable Area, click OK and pick the new size.</li>
                    </ul>
                  </li>
                  <li>Layout <b>Portrait</b>, margins <b>None</b>, scale <b>100</b> (never Fit to page), headers and footers off.</li>
                  <li>One whole tag on one label? You're set. The computer remembers the paper size, so after this just tap Print.</li>
                </ol>
                <div className="roll-spot">
                  <b>Tag spills onto the next label, and one gets skipped?</b> Your printer starts a little way into each label. Measure how far the first letter sits from the label's edge, set it here, then print 1 test tag again:
                  <div className="late-pad" role="group" aria-label="Printer starts late by">
                    <button className="btn ghost" onClick={() => setLate(v => Math.max(0, v - 1))} disabled={!late} aria-label="Less">−</button>
                    <b>{late ? `Starts ${late} mm late` : 'Starts on time'}</b>
                    <button className="btn ghost" onClick={() => setLate(v => Math.min(20, v + 1))} disabled={late >= 20} aria-label="More">+</button>
                  </div>
                  {late > 0 && <p>The tag is now {Math.round(54 - late)} mm long, so it ends right at the label's end. If your print window asks for a paper size, make the custom size {rollMiddle ? '4' : '1'} in wide by <b>{(2.125 - late / 25.4).toFixed(2)} in</b> long ({rollMiddle ? '101.6' : '25'} x {Math.round(54 - late)} mm).</p>}
                </div>
                <div className="roll-spot">
                  <b>Test tag came out blank?</b> Your printer probably holds the roll in the <b>middle</b>, so the tag printed off to the side of it. Pick where your roll sits, then print 1 test tag again:
                  <div className="seg" role="group" aria-label="Where the roll sits">
                    <button className={!rollMiddle ? 'on' : ''} aria-pressed={!rollMiddle} onClick={() => setRollMiddle(false)}>Roll against the left side</button>
                    <button className={rollMiddle ? 'on' : ''} aria-pressed={rollMiddle} onClick={() => setRollMiddle(true)}>Roll in the middle</button>
                  </div>
                  {rollMiddle && <p>With the roll in the middle, set Paper size to <b>4 x 2.125 in</b> (101.6 x 54 mm) instead, Portrait. Add it once the same way as above. The app puts the tag right in the middle, under your roll.</p>}
                </div>
                <span className="muted">On a phone, tap <b>Save for printer app</b> and print the picture in the printer's app at 25 x 54 mm. Still a little off to one side? Use <b>Nudge it</b> below.</span>
              </details>
            )}
            {dymo && (
              <div className="printer-tip small">
                <b>DYMO LabelWriter setup (one time)</b>
                <ol>
                  <li>Install DYMO Connect from dymo.com and plug the LabelWriter into your computer with its USB cable.</li>
                  <li>Load the roll so the labels feed in the long way (that's how DYMO rolls go in). Your printer is fine as is. The app turns each tag to match.</li>
                  <li>In the print window, choose your DYMO and set paper size to <b>{format === 'dymo30336' ? '30336 (1 in x 2-1/8 in)' : '30252 (1-1/8 in x 3-1/2 in)'}</b>, layout <b>Portrait</b>.</li>
                  <li>Scale <b>100%</b> (or Actual size), margins <b>None</b>, headers and footers off.</li>
                </ol>
                <label className="check-line"><input type="checkbox" checked={noTurn} onChange={e => setNoTurn(e.target.checked)} />Tag came out sideways or cut off? Tick this to let the printer turn it instead, then print again.</label>
                <span className="muted">DYMO labels loaded in a Core Innovations, Nelko or other shipping label printer? <button className="link-btn" onClick={() => setFormat('dymoThermal')}>Use the thermal printer setting</button> instead.</span>
              </div>
            )}
            {!single && <p className="muted small">In the print window, set scale to 100% (or "Actual size") and margins to None.</p>}
            {single && tags.length > 1 && <button className="btn ghost big" onClick={printTest}>Print 1 test tag</button>}
            <button className={`btn big ${style === 'sale' ? 'sale-btn' : 'primary'}`} onClick={() => window.print()}>Print {tags.length} tag{tags.length === 1 ? '' : 's'}</button>
            <SaveForPrinterApp name={style === 'sale' ? 'sale-tags' : 'tags'} turn={turned && f.group === 'thermal'} />
            <PrintNudge w={printed.w} h={printed.h} label={dymo ? `DYMO ${format === 'dymo30336' ? '30336' : '30252'} labels` : format === 'dymoThermal' ? 'DYMO labels in your thermal printer' : undefined} />
            <p className="muted small">Need a printer or labels? See <Link to="/gear">Recommended gear</Link>.</p>
          </section>
        </div>
      )}
    </div>
  )
}
