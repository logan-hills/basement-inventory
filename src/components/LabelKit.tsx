import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/* Shared pieces for every label print page (item tags, bin labels):
   a size picker with little label pictures, a sheet that can be turned sideways for printers
   that feed labels the long way (DYMO), and a fit-to-screen preview before printing. */

export type LabelGroup = 'thermal' | 'dymo' | 'paper'
export const GROUP_NAMES: Record<LabelGroup, string> = {
  thermal: 'Thermal label printer',
  dymo: 'DYMO LabelWriter',
  paper: 'Home printer (paper sheets)',
}

export type LabelFormat = {
  name: string
  /** One plain line under the name, like "Staples, DYMO 30336". */
  sub: string
  group: LabelGroup
  /** The page as you read it on screen, in inches. */
  page: { w: number; h: number }
  cols: number
  rows: number
  /** One label as you read it, in inches. */
  label: { w: number; h: number }
  margin: { top: number; left: number }
  gap: { x: number; y: number }
  /** The printer feeds this label the long way, so the app turns it sideways when it prints. */
  turn?: boolean
}

/** The page size the printer actually gets, in inches. */
export const printedPage = (f: LabelFormat, turned: boolean) => (turned ? { w: f.page.h, h: f.page.w } : f.page)
export const pageCss = (f: LabelFormat, turned: boolean) => {
  const p = printedPage(f, turned)
  return `@page { size: ${p.w}in ${p.h}in; margin: 0; }`
}

const frac = (n: number) => {
  const whole = Math.floor(n); const r = +(n - whole).toFixed(3)
  const map: Record<string, string> = { '0.125': '⅛', '0.25': '¼', '0.375': '⅜', '0.5': '½', '0.625': '⅝', '0.75': '¾', '0.875': '⅞' }
  return r === 0 ? String(whole) : map[String(r)] ? `${whole || ''}${map[String(r)]}` : String(n)
}
/** "4 × 6 in", "1 × 2⅛ in" */
export const sizeText = (w: number, h: number) => `${frac(w)} × ${frac(h)} in`

/** Big, tappable size choices, grouped by the kind of printer, each with a little picture of the label's shape. */
export function LabelSizePicker<K extends string>({ formats, value, onChange }: { formats: Record<K, LabelFormat>; value: K; onChange: (k: K) => void }) {
  const keys = Object.keys(formats) as K[]
  const groups = (Object.keys(GROUP_NAMES) as LabelGroup[]).filter(g => keys.some(k => formats[k].group === g))
  return (
    <div className="size-pick" role="radiogroup" aria-label="Label size">
      {groups.map(g => (
        <div key={g} className="size-pick-group">
          <span className="label-text">{GROUP_NAMES[g]}</span>
          <div className="size-pick-grid">
            {keys.filter(k => formats[k].group === g).map(k => {
              const f = formats[k]
              const s = 40 / Math.max(f.page.w, f.page.h)
              return (
                <button key={k} type="button" role="radio" aria-checked={value === k} className={`size-tile ${value === k ? 'on' : ''}`} onClick={() => onChange(k)}>
                  <span className="size-shape" aria-hidden="true">
                    <i style={{ width: Math.max(10, f.page.w * s), height: Math.max(8, f.page.h * s) }}>
                      {f.cols * f.rows > 1 && <em style={{ backgroundSize: `${100 / f.cols}% ${100 / f.rows}%` }} />}
                    </i>
                  </span>
                  <span className="size-words"><b>{f.name}</b><small>{f.sub}</small></span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/** One printed page. Shown upright on screen; when `turned`, it prints sideways onto the printer's page. */
export function LabelSheet({ f, turned, children }: { f: LabelFormat; turned: boolean; children: ReactNode }) {
  const grid = (
    <div className="sheet-grid" style={{
      gridTemplateColumns: `repeat(${f.cols}, ${f.label.w}in)`,
      gridAutoRows: `${f.label.h}in`,
      columnGap: `${f.gap.x}in`, rowGap: `${f.gap.y}in`,
      paddingTop: `${f.margin.top}in`, paddingLeft: `${f.margin.left}in`,
    }}>{children}</div>
  )
  if (!turned) return <div className="sheet" style={{ width: `${f.page.w}in`, height: `${f.page.h}in` }}>{grid}</div>
  return (
    <div className="sheet turn-sheet" style={{ '--dw': `${f.page.w}in`, '--dh': `${f.page.h}in` } as CSSProperties}>
      <div className="turn-rot">{grid}</div>
    </div>
  )
}

const SHOW = 4

/** Fit-to-screen preview of the pages that will print. Every page still prints; only the first few show until you tap Show all. */
export function LabelPreview({ f, turned, pages, labels, children }: { f: LabelFormat; turned: boolean; pages: number; labels: number; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState(1)
  const [all, setAll] = useState(false)
  useLayoutEffect(() => {
    const el = box.current
    if (!el) return
    const measure = () => setFit(Math.min(f.page.w <= 2.5 ? 2.2 : 1, Math.max(0.2, (el.clientWidth - 2) / (f.page.w * 96))))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [f.page.w])
  useEffect(() => setAll(false), [f])
  const p = printedPage(f, turned)
  const per = f.cols * f.rows
  return (
    <section className="card stack label-preview-card">
      <div className="no-print row-between">
        <div><span className="eyebrow">Preview</span><h2 className="preview-title">Here's how {labels === 1 ? 'it' : 'they'} will look</h2></div>
        <span className="chip-mini">{sizeText(f.label.w, f.label.h)}</span>
      </div>
      {turned && <p className="no-print muted small preview-turn">↻ This printer feeds labels the long way, so the app turns {per > 1 ? 'the page' : 'each label'} sideways when it prints ({sizeText(p.w, p.h)} page). Once it's stuck on, it reads just like this.</p>}
      <div ref={box} className={`print-area preview-area ${all ? 'show-all' : ''}`} style={{ '--fit': fit } as CSSProperties}>
        {children}
      </div>
      {pages > SHOW && (
        <button type="button" className="btn ghost no-print" onClick={() => setAll(a => !a)}>
          {all ? 'Show fewer' : `Showing ${SHOW} of ${pages} ${per > 1 ? 'pages' : 'labels'}. Show all`}
        </button>
      )}
      <p className="no-print muted small">{labels} label{labels === 1 ? '' : 's'}{per > 1 ? ` on ${pages} page${pages === 1 ? '' : 's'}` : ''}. Everything prints, even the ones not shown here.</p>
    </section>
  )
}
