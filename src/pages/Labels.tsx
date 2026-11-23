import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import JsBarcode from 'jsbarcode'
import { supabase } from '../lib/supabase'
import { money } from '../lib/data'

type Tag = { tag_code: string; live_number: string; name: string; variant: string; price: number | null }

// Label layouts. Sizes in inches.
const FORMATS = {
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

function TagLabel({ t }: { t: Tag }) {
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
  const [tags, setTags] = useState<Tag[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [format, setFormat] = useState<FormatKey>(() => (localStorage.getItem('labelFormat') as FormatKey) || 'sheet30')
  const [skip, setSkip] = useState(0)

  useEffect(() => { try { localStorage.setItem('labelFormat', format) } catch { /* ignore */ } }, [format])

  useEffect(() => {
    (async () => {
      let q = supabase
        .from('units')
        .select('tag_code, status, variant:variants!inner(id,label,live_number,price,item_id, item:items!inner(name))')
        .eq('status', 'in_stock')
        .order('tag_code')
      if (variantId) q = q.eq('variant_id', variantId)
      else if (itemId) q = q.eq('variant.item_id', itemId)
      const { data } = await q
      const list: Tag[] = (data ?? []).map((u: any) => ({
        tag_code: u.tag_code,
        live_number: u.variant.live_number,
        name: u.variant.item.name,
        variant: u.variant.label,
        price: u.variant.price,
      }))
      setTags(list)
      setTitle(list[0]?.name ?? '')
      setLoading(false)
    })()
  }, [itemId, variantId])

  const f = FORMATS[format]
  const perPage = f.cols * f.rows
  const slots: (Tag | null)[] = [...Array(format === 'roll' ? 0 : Math.min(skip, perPage - 1)).fill(null), ...tags]
  const pages: (Tag | null)[][] = []
  for (let i = 0; i < slots.length; i += perPage) pages.push(slots.slice(i, i + perPage))

  const pageCss = `@page { size: ${f.page.w}in ${f.page.h}in; margin: 0; }`

  return (
    <div className="labels-page">
      <style>{pageCss}</style>
      <div className="no-print stack">
        <h1>Print tags{title ? `: ${title}` : ''}</h1>
        {loading ? <p className="muted">Loading…</p> : tags.length === 0 ? (
          <p className="muted">No tags to print. <Link to="/inventory" className="link-text">Back to inventory</Link></p>
        ) : (
          <div className="card stack">
            <label>Label type
              <select value={format} onChange={e => setFormat(e.target.value as FormatKey)}>
                {Object.entries(FORMATS).map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
            </label>
            {format !== 'roll' && (
              <label>Skip used labels at the start of the sheet
                <input inputMode="numeric" value={skip} onChange={e => setSkip(Math.max(0, parseInt(e.target.value.replace(/\D/g, '') || '0', 10)))} />
              </label>
            )}
            <p className="muted small">{tags.length} tag{tags.length === 1 ? '' : 's'} on {pages.length} page{pages.length === 1 ? '' : 's'}. In the print window, set scale to 100% (or "Actual size") and margins to None.</p>
            <button className="btn primary big" onClick={() => window.print()}>Print</button>
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
              {p.map((t, i) => <div key={i} className="slot">{t && <TagLabel t={t} />}</div>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
