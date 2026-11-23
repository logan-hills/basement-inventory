import { useEffect, useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { PALETTES, POSTER_SIZES, type Poster } from '../lib/planner'

/** Renders a poster at full size (1080px wide) and shows it scaled down. Download makes a PNG. */
export function PosterArt({ p, photoUrl, shop, innerRef }: { p: Poster; photoUrl?: string | null; shop: string; innerRef?: React.Ref<HTMLDivElement> }) {
  const size = POSTER_SIZES[p.size]
  const [a, b, accent, ink] = PALETTES[p.palette]?.c ?? PALETTES[0].c
  return (
    <div ref={innerRef} className={`poster-art t-${p.template}`} style={{ width: size.w, height: size.h, color: ink, ['--a' as any]: a, ['--b' as any]: b, ['--acc' as any]: accent, ['--ink' as any]: ink }}>
      {p.template === 'block' && <div className="pa-stripes" />}
      {p.template === 'regal' && <div className="pa-frame" />}
      {p.template === 'glow' && <><div className="pa-orb one" /><div className="pa-orb two" /></>}
      <div className="pa-content">
        <div className="pa-kicker">{p.kicker}</div>
        {photoUrl && <div className="pa-photo" style={{ backgroundImage: `url(${photoUrl})` }} />}
        <div className="pa-headline">{p.headline}</div>
        <div className="pa-when">{p.when}</div>
        {p.tagline && <div className="pa-tagline">{p.tagline}</div>}
        <div className="pa-footer"><span>♛</span>{p.footer || shop}</div>
      </div>
    </div>
  )
}

export default function PosterMaker({ p, photoUrl, shop, fileName }: { p: Poster; photoUrl?: string | null; shop: string; fileName: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.4)
  const [busy, setBusy] = useState(false)
  const size = POSTER_SIZES[p.size]
  useEffect(() => {
    if (!boxRef.current) return
    const ro = new ResizeObserver(([e]) => setScale(Math.min(e.contentRect.width / size.w, 640 / size.h)))
    ro.observe(boxRef.current)
    return () => ro.disconnect()
  }, [size.w, size.h])

  async function download() {
    if (!artRef.current) return
    setBusy(true)
    try {
      const url = await toPng(artRef.current, { width: size.w, height: size.h, pixelRatio: 1, cacheBust: true, style: { transform: 'none' } })
      const a = document.createElement('a'); a.href = url; a.download = fileName; a.click()
    } finally { setBusy(false) }
  }

  return (
    <div className="stack">
      <div ref={boxRef} className="poster-stage" style={{ height: size.h * scale }}>
        <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: size.w, height: size.h }}>
          <PosterArt p={p} photoUrl={photoUrl} shop={shop} innerRef={artRef} />
        </div>
      </div>
      <button className="btn gold big" onClick={download} disabled={busy}>{busy ? 'Making your poster…' : 'Download poster (PNG)'}</button>
      <p className="muted small">Post it to your Facebook page and groups a day ahead, and again an hour before you go live.</p>
    </div>
  )
}
