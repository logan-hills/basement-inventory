import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import JsBarcode from 'jsbarcode'
import { supabase } from '../lib/supabase'
import { money } from '../lib/data'
import CrispBarcode from '../components/CrispBarcode'
import SaveForPrinterApp from '../components/SaveForPrinterApp'
import PrintNudge from '../components/PrintNudge'

type Tag = { tag_code: string; live_number: string; name: string; variant: string; price: number | null; sale: number | null }
type Style = 'regular' | 'sale'
type SaleMode = 'item' | 'pct' | 'fixed'

// Label layouts. Sizes in inches.
const FORMATS = {
  roll2x1: {
    name: 'Thermal roll 2×1 in, one tag per label (recommended)',
    page: { w: 2, h: 1 }, cols: 1, rows: 1,
    label: { w: 2, h: 1 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 },
  },
  sheet30: {
    name: 'Letter sheet, 30 per page (Avery 5160 / 8160 size)',
    page: { w: 8.5, h: 11 }, cols: 3, rows: 10,
    label: { w: 2.625, h: 1 }, margin: { top: 0.5, left: 0.1875 }, gap: { x: 0.125, y: 0 },
  },
  thermal4x6: {
    name: '4×6 shipping label printer, 12 tags per label (cut apart)',
    page: { w: 4, h: 6 }, cols: 2, rows: 6,
    label: { w: 2, h: 1 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 },
  },
  roll: {
    name: 'Small thermal roll, 2.25×1.25 (one tag per label)',
    page: { w: 2.25, h: 1.25 }, cols: 1, rows: 1,
    label: { w: 2.25, h: 1.25 }, margin: { top: 0, left: 0 }, gap: { x: 0, y: 0 },
  },
} as const
type FormatKey = keyof typeof FORMATS

function Barcode({ value }: { value: string }) {
  const ref = useRef<SVGSVGElement>(null)
  useLayoutEffect(() => {
    if (ref.current) JsBarcode(ref.current, value, { format: 'CODE128', displayValue: false, margin: 0, height: 40, width: 2 })
  }, [value])
  return <svg ref={ref} className="barcode" preserveAspectRatio="none" />
}

/** 2×1 thermal tag. Pure black so it prints sharp on white or yellow rolls. */
function RollTag({ t, sale }: { t: Tag; sale: number | null }) {
  const name = `${t.name}${t.variant && t.variant !== 'One size' ? ` · ${t.variant}` : ''}`
  return (
    <div className={`tag21 ${sale != null ? 'is-sale' : ''}`}>
      <div className="tag21-top">
        {sale != null && <span className="tag21-sale">SALE</span>}
        <span className="tag21-live">#{t.live_number}</span>
        <span className="tag21-price">{money(sale ?? t.price)}</span>
      </div>
      <div className="tag21-name">
        <span>{name}</span>
        {sale != null && t.price != null && <s>{money(t.price)}</s>}
      </div>
      <CrispBarcode value={t.tag_code} heightIn={sale != null ? 0.32 : 0.36} maxWidthIn={1.8} />
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

  const f = FORMATS[format]
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

  const pageCss = `@page { size: ${f.page.w}in ${f.page.h}in; margin: 0; }`

  return (
    <div className="labels-page">
      <style>{pageCss}</style>
      <div className="no-print stack">
        <h1>{style === 'sale' ? 'Sale tags' : tagsParam ? 'Reprint tags' : 'Print tags'}{title ? `: ${title}` : ''}</h1>
        {loading ? <p className="muted">Loading…</p> : tags.length === 0 ? (
          <p className="muted">No tags to print. <Link to="/inventory" className="link-text">Back to inventory</Link></p>
        ) : (
          <div className="card stack">
            <label>Label type
              <select value={format} onChange={e => setFormat(e.target.value as FormatKey)}>
                {Object.entries(FORMATS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
            </label>
            <div className="stack tight-gap">
              <span className="label-text">Tag style</span>
              <div className="seg" role="group" aria-label="Tag style">
                <button className={style === 'regular' ? 'on' : ''} aria-pressed={style === 'regular'} onClick={() => setStyle('regular')}>Regular (white roll)</button>
                <button className={style === 'sale' ? 'on sale-on' : ''} aria-pressed={style === 'sale'} onClick={() => setStyle('sale')}>Sale (yellow roll)</button>
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
                <p className="muted small">Load the <b>yellow</b> roll before you print. The tag says SALE with the old price crossed out.</p>
              </div>
            )}
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
            {!single && (
              <label>Skip used labels at the start of the sheet
                <input inputMode="numeric" value={skip} onChange={e => setSkip(Math.max(0, parseInt(e.target.value.replace(/\D/g, '') || '0', 10)))} />
              </label>
            )}
            <p className="muted small">{tags.length} tag{tags.length === 1 ? '' : 's'} on {pages.length} page{pages.length === 1 ? '' : 's'}. In the print window, set scale to 100% (or "Actual size") and margins to None.</p>
            <button className={`btn big ${style === 'sale' ? 'sale-btn' : 'primary'}`} onClick={() => window.print()}>Print</button>
            <SaveForPrinterApp name={style === 'sale' ? 'sale-tags' : 'tags'} />
            <PrintNudge w={f.page.w} h={f.page.h} />
            <p className="muted small">Need a printer or labels? See <Link to="/gear">Recommended gear</Link>.</p>
          </div>
        )}
      </div>

      <div className="print-area">
        {pages.map((p, pi) => (
          <div key={pi} className="sheet" style={{ width: `${f.page.w}in`, height: `${f.page.h}in`, paddingTop: `${f.margin.top}in`, paddingLeft: `${f.margin.left}in` }}>
            <div className="sheet-grid" style={{
              gridTemplateColumns: `repeat(${f.cols}, ${f.label.w}in)`,
              gridAutoRows: `${f.label.h}in`,
              columnGap: `${f.gap.x}in`, rowGap: `${f.gap.y}in`,
            }}>
              {p.map((t, i) => <div key={i} className="slot">{t && (format === 'roll2x1' ? <RollTag t={t} sale={saleFor(t)} /> : <TagLabel t={t} sale={saleFor(t)} />)}</div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
