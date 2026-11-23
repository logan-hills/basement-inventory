import { useEffect, useState } from 'react'
import { getNudge, nudgeCss, setNudge, sizeKey, NUDGE_LIMIT, type Nudge } from '../lib/printNudge'

/** Applies the saved nudge for this label size to printing, and offers big arrow buttons to adjust it.
    Put one on every print page, with the page's label size in inches. */
export default function PrintNudge({ w, h, label, open = false }: { w: number; h: number; label?: string; open?: boolean }) {
  const key = sizeKey(w, h)
  const name = label ?? `${w}×${h} in labels`
  // Re-read the saved nudge whenever any nudge control on the page changes it.
  const [, bump] = useState(0)
  useEffect(() => {
    const sync = () => bump(v => v + 1)
    window.addEventListener('print-nudge', sync)
    return () => window.removeEventListener('print-nudge', sync)
  }, [])
  const n: Nudge = getNudge(key)
  const move = (dx: number, dy: number) => setNudge(key, { x: n.x + dx, y: n.y + dy })
  const fmt = (v: number, neg: string, pos: string) => (v === 0 ? 'centered' : `${Math.abs(v)} mm ${v < 0 ? neg : pos}`)
  const atEdge = (v: number) => Math.abs(v) >= NUDGE_LIMIT

  return (
    <>
      <style>{nudgeCss(n)}</style>
      <details className="nudge no-print" open={open}>
        <summary>Print lands a little off the label? Nudge it</summary>
        <div className="nudge-body">
          <p className="muted small">Each tap moves the print ½ mm. Print one, check it, and nudge again until all of it sits on the label. The app remembers this for {name} on this device.</p>
          <div className="nudge-pad" role="group" aria-label="Nudge the print">
            <span />
            <button className="btn ghost" aria-label="Move print up" disabled={n.y <= -NUDGE_LIMIT} onClick={() => move(0, -0.5)}>▲ Up</button>
            <span />
            <button className="btn ghost" aria-label="Move print left" disabled={n.x <= -NUDGE_LIMIT} onClick={() => move(-0.5, 0)}>◀ Left</button>
            <button className="btn dim" onClick={() => setNudge(key, { x: 0, y: 0 })} disabled={!n.x && !n.y}>Reset</button>
            <button className="btn ghost" aria-label="Move print right" disabled={n.x >= NUDGE_LIMIT} onClick={() => move(0.5, 0)}>Right ▶</button>
            <span />
            <button className="btn ghost" aria-label="Move print down" disabled={n.y >= NUDGE_LIMIT} onClick={() => move(0, 0.5)}>▼ Down</button>
            <span />
          </div>
          <p className="small" role="status">Side to side: <b>{fmt(n.x, 'left', 'right')}</b> · Up and down: <b>{fmt(n.y, 'up', 'down')}</b>{atEdge(n.x) || atEdge(n.y) ? '. That\'s as far as it goes. If it\'s still off, slide the roll guides in snug and let the printer re-learn the label size.' : ''}</p>
        </div>
      </details>
    </>
  )
}
