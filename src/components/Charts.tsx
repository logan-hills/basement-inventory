import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/* Quiet, single-hue charts in the Dynamic Dazzle palette.
   Marks carry the gold; every label, value and axis stays in text colors. */

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Counts up to a number when it first appears. */
export function CountUp({ value, format = (n: number) => Math.round(n).toLocaleString() }: { value: number; format?: (n: number) => string }) {
  const [shown, setShown] = useState(reduced() ? value : 0)
  const from = useRef(0)
  useEffect(() => {
    if (reduced()) { setShown(value); return }
    const start = performance.now(), a = from.current, dur = 700
    let raf = 0
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3)
      setShown(a + (value - a) * e)
      if (p < 1) raf = requestAnimationFrame(step); else from.current = value
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <>{format(shown)}</>
}

function niceMax(v: number) {
  if (v <= 0) return 1
  const p = Math.pow(10, Math.floor(Math.log10(v)))
  const n = v / p
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p
}
const tick = (n: number) => (n >= 10000 ? `${Math.round(n / 1000)}K` : n.toLocaleString())

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [w, setW] = useState(600)
  useLayoutEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setW(Math.max(240, Math.round(e.contentRect.width))))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, w] as const
}

export type Point = { label: string; value: number; detail?: string }

/** Vertical columns from one baseline, with hover tooltips and the peak labeled. */
export function ColumnChart({ data, format = (n: number) => n.toLocaleString(), height = 200, label }: { data: Point[]; format?: (n: number) => string; height?: number; label: string }) {
  const [ref, w] = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const padL = 44, padR = 8, padT = 22, padB = 26
  const max = niceMax(Math.max(0, ...data.map(d => d.value)))
  const ih = height - padT - padB, iw = w - padL - padR
  const band = iw / Math.max(1, data.length)
  const bw = Math.min(24, band * 0.6)
  const y = (v: number) => padT + ih - (v / max) * ih
  const peak = data.reduce((m, d, i) => (d.value > (data[m]?.value ?? -1) ? i : m), 0)
  const every = Math.ceil(data.length / Math.max(1, Math.floor(iw / 64)))
  const r = 4
  return (
    <div ref={ref} className="chart" role="img" aria-label={label}>
      <svg width={w} height={height}>
        {[0, .5, 1].map(f => (
          <g key={f}>
            <line x1={padL} x2={w - padR} y1={y(max * f)} y2={y(max * f)} className="chart-gridline" />
            <text x={padL - 8} y={y(max * f) + 4} textAnchor="end" className="chart-axis">{tick(max * f)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x = padL + band * i + (band - bw) / 2, top = y(d.value), h = Math.max(0, padT + ih - top)
          const rr = Math.min(r, h)
          const path = h <= 0 ? '' : `M${x},${padT + ih} V${top + rr} Q${x},${top} ${x + rr},${top} H${x + bw - rr} Q${x + bw},${top} ${x + bw},${top + rr} V${padT + ih} Z`
          return (
            <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onClick={() => setHover(h => (h === i ? null : i))}>
              <rect x={padL + band * i} y={padT} width={band} height={ih} fill="transparent" />
              {path && <path d={path} className={`chart-bar ${hover === i ? 'on' : hover != null ? 'dim' : ''}`} style={{ animationDelay: `${i * 40}ms` }} />}
              {i === peak && d.value > 0 && hover == null && <text x={x + bw / 2} y={top - 7} textAnchor="middle" className="chart-value">{format(d.value)}</text>}
              {((i % every === 0 && data.length - 1 - i >= every) || i === data.length - 1) && <text x={x + bw / 2} y={height - 8} textAnchor="middle" className="chart-axis">{d.label}</text>}
            </g>
          )
        })}
      </svg>
      {hover != null && data[hover] && (
        <div className="chart-tip" style={{ left: Math.min(w - 150, Math.max(0, padL + band * hover + band / 2 - 75)), top: Math.max(0, y(data[hover].value) - 58) }}>
          <b>{format(data[hover].value)}</b><span>{data[hover].label}{data[hover].detail ? ` · ${data[hover].detail}` : ''}</span>
        </div>
      )}
      <table className="sr-only"><tbody>{data.map((d, i) => <tr key={i}><th>{d.label}</th><td>{format(d.value)}</td></tr>)}</tbody></table>
    </div>
  )
}

/** Horizontal bars with the value at each tip. Good for categories. */
export function BarList({ data, format = (n: number) => n.toLocaleString(), max: maxIn }: { data: Point[]; format?: (n: number) => string; max?: number }) {
  const max = maxIn ?? Math.max(1, ...data.map(d => d.value))
  return (
    <div className="barlist">
      {data.map((d, i) => (
        <div key={d.label} className="barlist-row" title={d.detail ? `${d.label}: ${d.detail}` : undefined}>
          <span className="barlist-label">{d.label}</span>
          <div className="barlist-track"><span style={{ width: `${Math.max(1.5, (d.value / max) * 100)}%`, animationDelay: `${i * 50}ms` }} /></div>
          <span className="barlist-value">{format(d.value)}</span>
        </div>
      ))}
    </div>
  )
}

/** One bar split into ordered segments (sequential gold ramp), with a legend. */
const RAMP = ['#F3DC93', '#E2BE5A', '#B6973F', '#8A7333', '#5E4F26']
export function SegmentBar({ data, format = (n: number) => n.toLocaleString() }: { data: Point[]; format?: (n: number) => string }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  const [hover, setHover] = useState<number | null>(null)
  if (!total) return <p className="muted small">Nothing in stock yet.</p>
  return (
    <div className="stack tight-gap">
      <div className="segbar">
        {data.map((d, i) => d.value > 0 && (
          <span key={d.label} style={{ flexGrow: d.value, background: RAMP[i % RAMP.length] }} className={hover != null && hover !== i ? 'dim' : ''}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} title={`${d.label}: ${format(d.value)}`} />
        ))}
      </div>
      <div className="seg-legend">
        {data.map((d, i) => (
          <span key={d.label} className={hover === i ? 'on' : ''} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <i style={{ background: RAMP[i % RAMP.length] }} />{d.label} <b>{format(d.value)}</b>
          </span>
        ))}
      </div>
    </div>
  )
}

/** A progress ring with a big number in the middle. */
export function Ring({ value, label, children }: { value: number; label: string; children?: ReactNode }) {
  const v = Math.max(0, Math.min(1, value)), r = 42, c = 2 * Math.PI * r
  return (
    <div className="ring" role="img" aria-label={`${label}: ${Math.round(v * 100)}%`}>
      <svg viewBox="0 0 100 100" width="112" height="112">
        <circle cx="50" cy="50" r={r} className="ring-track" />
        <circle cx="50" cy="50" r={r} className="ring-fill" strokeDasharray={c} strokeDashoffset={c * (1 - v)} transform="rotate(-90 50 50)" />
      </svg>
      <div className="ring-center"><b><CountUp value={v * 100} format={n => `${Math.round(n)}%`} /></b>{children}</div>
    </div>
  )
}
