import { useEffect, useRef, useState } from 'react'
import { toBlob, toPng } from 'html-to-image'
import Icon from './Icon'
import { burst } from './Nova'
import { tap } from '../lib/feedback'
import { PALETTES, PERK_IDEAS, POSTER_FEELS, POSTER_FONTS, POSTER_SIZES, POSTER_STYLES, posterCaption, posterPhotos, type Poster } from '../lib/planner'

/** The poster fonts as one CSS block with the font files inlined, so a downloaded PNG keeps the fancy lettering.
 *  (The image maker can't read Google's stylesheet on its own.) Only the Latin letters are pulled in, and only once. */
let fontCss: Promise<string> | null = null
function posterFontCss() {
  fontCss ??= (async () => {
    const href = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].map(l => l.href).find(h => h.includes('fonts.googleapis.com'))
    if (!href) return ''
    const css = await (await fetch(href)).text()
    const blocks = css.split(/(?=\/\* )/).filter(b => b.startsWith('/* latin */'))
    const toData = async (url: string) => {
      const blob = await (await fetch(url)).blob()
      return await new Promise<string>(r => { const fr = new FileReader(); fr.onload = () => r(String(fr.result)); fr.readAsDataURL(blob) })
    }
    const out = await Promise.all(blocks.map(async b => {
      const m = b.match(/url\((https:[^)]+)\)/)
      return m ? b.replace(m[1], await toData(m[1])) : b
    }))
    return out.join('\n')
  })().catch(() => { fontCss = null; return '' })
  return fontCss
}

/** Headlines shrink a little as they get longer, so they always fit. */
function headlineScale(text: string) {
  const n = text.length
  return n <= 10 ? 1 : n <= 16 ? 0.86 : n <= 24 ? 0.72 : n <= 34 ? 0.6 : 0.5
}

/** Renders a poster at full size and shows it scaled down. Every style works at every size. */
export function PosterArt({ p, photoUrls, shop, innerRef }: { p: Poster; photoUrls: string[]; shop: string; innerRef?: React.Ref<HTMLDivElement> }) {
  const size = POSTER_SIZES[p.size] ?? POSTER_SIZES.portrait
  const [a, b, accent, ink] = PALETTES[p.palette]?.c ?? PALETTES[0].c
  const font = POSTER_FONTS.find(f => f.id === p.font && f.id !== 'auto')?.css
  const photos = photoUrls.filter(Boolean).slice(0, 3)
  const cover = p.template === 'couture' && photos.length > 0
  const inline = cover ? photos.slice(1) : photos
  const perks = (p.perks ?? []).filter(Boolean).slice(0, 3)
  const style: Record<string, string | number> = { width: size.w, height: size.h, color: ink, '--a': a, '--b': b, '--acc': accent, '--ink': ink, '--hs': headlineScale(p.headline) }
  if (font) style['--hf'] = font
  return (
    <div ref={innerRef} className={`poster-art t-${p.template} s-${p.size} ${inline.length ? 'with-photos' : 'no-photos'} ${cover ? 'cover' : ''} ${p.foil ? 'foil-on' : ''}`} style={style as React.CSSProperties}>
      {cover && <div className="pa-cover" style={{ backgroundImage: `url(${photos[0]})` }} />}
      {p.template === 'block' && <div className="pa-stripes" />}
      {p.template === 'regal' && <div className="pa-frame" />}
      {p.template === 'glow' && <><div className="pa-orb one" /><div className="pa-orb two" /></>}
      {p.template === 'deco' && <><div className="pa-sunburst" /><div className="pa-deco-frame"><i /><i /><i /><i /></div></>}
      {p.template === 'noir' && <><div className="pa-sheen" /><div className="pa-hairline" /></>}
      {p.template === 'marble' && <><div className="pa-veins" /><div className="pa-hairline" /></>}
      {p.template === 'minimal' && <div className="pa-hairline" />}
      {cover && <div className="pa-shade" />}
      <div className="pa-content">
        <div className="pa-kicker">{p.kicker}</div>
        {inline.length > 0 && (
          <div className={`pa-photos n${inline.length}`}>
            {inline.map((u, i) => <div key={i} className="pa-ph" style={{ backgroundImage: `url(${u})` }} />)}
          </div>
        )}
        <div className="pa-text">
          <div className="pa-headline"><span>{p.headline}</span></div>
          <div className="pa-rule"><span /><b>♛</b><span /></div>
          <div className="pa-when">{p.when}</div>
          {p.tagline && <div className="pa-tagline">{p.tagline}</div>}
          {perks.length > 0 && <div className="pa-perks">{perks.map(x => <span key={x}>{x}</span>)}</div>}
        </div>
        <div className="pa-footer"><span className="pa-crown">♛</span><span>{p.footer || shop}</span>{p.handle && <em>{p.handle}</em>}</div>
      </div>
      {p.badge && <div className="pa-badge"><span>{p.badge}</span></div>}
    </div>
  )
}

type PhotoChoice = { path: string; url: string; label?: string }

/** A big, friendly section header with a number. */
const Step = ({ n, title, sub }: { n: number; title: string; sub?: string }) => (
  <div className="ps-step"><span className="ps-num">{n}</span><div><b>{title}</b>{sub && <span className="muted small">{sub}</span>}</div></div>
)

/** Small live preview of a style, drawn with the seller's own words and photo. */
function StyleThumb({ p, photoUrls, shop, on, name, onPick }: { p: Poster; photoUrls: string[]; shop: string; on: boolean; name: string; onPick: () => void }) {
  const size = POSTER_SIZES.portrait
  const s = 132 / size.w
  return (
    <button className={`ps-style ${on ? 'on' : ''}`} onClick={onPick} aria-pressed={on}>
      <div className="ps-thumb" style={{ height: size.h * s }}>
        <div style={{ transform: `scale(${s})`, transformOrigin: 'top left', width: size.w, height: size.h }}>
          <PosterArt p={{ ...p, size: 'portrait' }} photoUrls={photoUrls} shop={shop} />
        </div>
      </div>
      <b>{name}</b>
    </button>
  )
}

export default function PosterStudio({ poster, setPoster, photoChoices, onUpload, onOpenInspo, shop, fileName }: {
  poster: Poster
  setPoster: (patch: Partial<Poster>) => void
  /** Photos the seller can use: their mood board and the pieces picked for this live. */
  photoChoices: PhotoChoice[]
  onUpload: (files: FileList) => Promise<string[]>
  onOpenInspo: () => void
  shop: string
  fileName: string
}) {
  const boxRef = useRef<HTMLDivElement>(null)
  const artRef = useRef<HTMLDivElement>(null)
  const allRef = useRef<Record<string, HTMLDivElement | null>>({})
  const [scale, setScale] = useState(0.4)
  const [busy, setBusy] = useState<'' | 'one' | 'all' | 'share'>('')
  const [feel, setFeel] = useState<{ i: number; n: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const [renderAll, setRenderAll] = useState(false)
  const size = POSTER_SIZES[poster.size] ?? POSTER_SIZES.portrait
  const chosen = posterPhotos(poster)
  const urlOf = (path: string) => photoChoices.find(c => c.path === path)?.url ?? ''
  const photoUrls = chosen.map(urlOf).filter(Boolean)

  useEffect(() => {
    if (!boxRef.current) return
    const ro = new ResizeObserver(([e]) => setScale(Math.min(e.contentRect.width / size.w, 680 / size.h)))
    ro.observe(boxRef.current)
    return () => ro.disconnect()
  }, [size.w, size.h])

  // Start fetching the fonts as soon as the studio opens, so Download is quick.
  useEffect(() => { posterFontCss() }, [])
  const opts = async (w: number, h: number) => {
    const fontEmbedCSS = await posterFontCss()
    return { width: w, height: h, pixelRatio: 1, cacheBust: true, style: { transform: 'none' }, ...(fontEmbedCSS ? { fontEmbedCSS } : {}) }
  }
  const save = (url: string, name: string) => { const el = document.createElement('a'); el.href = url; el.download = name; el.click() }

  async function download() {
    if (!artRef.current) return
    setBusy('one')
    try { save(await toPng(artRef.current, await opts(size.w, size.h)), fileName) } finally { setBusy('') }
  }

  async function downloadAll() {
    setBusy('all'); setRenderAll(true)
    try {
      await new Promise(r => setTimeout(r, 400))
      for (const [k, v] of Object.entries(POSTER_SIZES)) {
        const el = allRef.current[k]
        if (el) save(await toPng(el, await opts(v.w, v.h)), fileName.replace(/\.png$/, `-${k}.png`))
      }
    } finally { setRenderAll(false); setBusy('') }
  }

  async function share() {
    if (!artRef.current) return
    setBusy('share')
    try {
      const blob = await toBlob(artRef.current, await opts(size.w, size.h))
      if (!blob) return
      const file = new File([blob], fileName, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text: posterCaption(poster) })
      else save(URL.createObjectURL(blob), fileName)
    } catch { /* closed the share sheet */ } finally { setBusy('') }
  }

  function designForMe(i: number, e?: { clientX: number; clientY: number }) {
    const n = feel && feel.i === i ? (feel.n + 1) % POSTER_FEELS[i].looks.length : 0
    setFeel({ i, n }); tap()
    setPoster({ ...POSTER_FEELS[i].looks[n] })
    if (e) burst(e.clientX, e.clientY)
  }

  function surprise(e: { clientX: number; clientY: number }) {
    const st = POSTER_STYLES[Math.floor(Math.random() * POSTER_STYLES.length)]
    const pal = Math.random() < 0.5 ? st.palette : Math.floor(Math.random() * PALETTES.length)
    const fonts = POSTER_FONTS.filter(f => f.id !== 'auto')
    setPoster({ template: st.id, palette: pal, font: Math.random() < 0.5 ? 'auto' : fonts[Math.floor(Math.random() * fonts.length)].id, foil: !!st.luxe })
    setFeel(null); tap(); burst(e.clientX, e.clientY)
  }

  function togglePhoto(path: string) {
    const has = chosen.includes(path)
    setPoster({ photos: has ? chosen.filter(x => x !== path) : [...chosen, path].slice(-3), photo: null })
  }

  const perks = [...(poster.perks ?? []), '', '', ''].slice(0, 3)
  const setPerk = (i: number, v: string) => { const next = [...perks]; next[i] = v; setPoster({ perks: next }) }

  return (
    <div className="poster-layout">
      <section className="card stack ps-panel">
        <Step n={1} title="Pick how it should feel" sub="Tap a feeling and Nova designs it. Tap again for another look." />
        <div className="ps-feels">
          {POSTER_FEELS.map((f, i) => (
            <button key={f.name} className={`ps-feel ${feel?.i === i ? 'on' : ''}`} onClick={e => designForMe(i, e)}>
              <b>{f.name}</b><span>{f.blurb}</span>
              {feel?.i === i && <small>Look {feel.n + 1} of {f.looks.length} · tap for another</small>}
            </button>
          ))}
        </div>
        <button className="btn glass big" onClick={surprise}><Icon name="sparkle" size={18} />Surprise me</button>

        <Step n={2} title="Or choose a style" sub="Each one shows your own words and photo." />
        <div className="ps-styles">
          {POSTER_STYLES.map(st => (
            <StyleThumb key={st.id} name={st.name} on={poster.template === st.id} shop={shop} photoUrls={photoUrls}
              p={{ ...poster, template: st.id, foil: poster.template === st.id ? poster.foil : !!st.luxe }}
              onPick={() => { setPoster({ template: st.id, foil: poster.template === st.id ? poster.foil : !!st.luxe }); setFeel(null); tap() }} />
          ))}
        </div>

        <Step n={3} title="Colors and lettering" />
        <div className="palette-row">
          {PALETTES.map((p, i) => <button key={p.name} className={`palette ${poster.palette === i ? 'on' : ''}`} onClick={() => setPoster({ palette: i })} title={p.name}><span style={{ background: `linear-gradient(135deg, ${p.c[0]}, ${p.c[1]} 70%, ${p.c[2]})` }} /><small>{p.name}</small></button>)}
        </div>
        <span className="label-text">Lettering</span>
        <div className="ps-fonts">
          {POSTER_FONTS.map(f => <button key={f.id} className={`chip ${(poster.font ?? 'auto') === f.id ? 'on' : ''}`} style={f.css ? { fontFamily: f.css } : undefined} onClick={() => setPoster({ font: f.id })}>{f.name}</button>)}
        </div>
        <label className="ps-switch"><input type="checkbox" checked={!!poster.foil} onChange={e => setPoster({ foil: e.target.checked })} /><span>Gold foil headline</span></label>

        <Step n={4} title="Photos" sub="Up to three. Tap to add or remove." />
        {photoChoices.length > 0 ? (
          <div className="ps-photos">
            {photoChoices.map(c => {
              const n = chosen.indexOf(c.path)
              return (
                <button key={c.path} className={`ps-photo ${n >= 0 ? 'on' : ''}`} onClick={() => togglePhoto(c.path)} aria-pressed={n >= 0} title={c.label}>
                  <img src={c.url} alt={c.label ?? ''} loading="lazy" />
                  {n >= 0 && <span className="ps-photo-n">{n + 1}</span>}
                </button>
              )
            })}
          </div>
        ) : <p className="muted small">Add pieces to this live, or photos to your mood board, and they show up here.</p>}
        <div className="row-gap">
          <label className="btn ghost file-btn"><Icon name="upload" size={18} />Upload a photo<input type="file" accept="image/*" multiple onChange={async e => { const f = e.target.files; e.target.value = ''; if (f?.length) { const added = await onUpload(f); if (added.length) setPoster({ photos: [...chosen, ...added].slice(-3), photo: null }) } }} /></label>
          <button className="link-btn" onClick={onOpenInspo}>Open mood board</button>
        </div>

        <Step n={5} title="Words" sub="Short and big reads best on a phone." />
        <label>Top line<input value={poster.kicker} onChange={e => setPoster({ kicker: e.target.value })} placeholder="LIVE TONIGHT" /></label>
        <label>Headline<input value={poster.headline} onChange={e => setPoster({ headline: e.target.value })} /></label>
        <label>Day and time<input value={poster.when} onChange={e => setPoster({ when: e.target.value })} /></label>
        <label>Tagline<input value={poster.tagline} onChange={e => setPoster({ tagline: e.target.value })} placeholder="Everything $2 to $15" /></label>
        <label>Price seal (optional)<input value={poster.badge ?? ''} onChange={e => setPoster({ badge: e.target.value })} placeholder="ALL $2" maxLength={14} /></label>
        <span className="label-text">Little extras (optional)</span>
        {perks.map((v, i) => <input key={i} aria-label={`Extra ${i + 1}`} value={v} onChange={e => setPerk(i, e.target.value)} placeholder={PERK_IDEAS[i]} />)}
        <div className="chip-list">{PERK_IDEAS.filter(x => !perks.includes(x)).slice(0, 5).map(x => <button key={x} className="idea-chip" onClick={() => { const i = perks.findIndex(v => !v); if (i >= 0) setPerk(i, x) }}>+ {x}</button>)}</div>
        <label>Bottom line<input value={poster.footer} onChange={e => setPoster({ footer: e.target.value })} /></label>
        <label>Page or handle (optional)<input value={poster.handle ?? ''} onChange={e => setPoster({ handle: e.target.value })} placeholder="@yourshop" /></label>
      </section>

      <section className="card stack ps-preview">
        <h2 className="ps-title">Your poster</h2>
        <div className="ps-sizes">
          {Object.entries(POSTER_SIZES).map(([k, v]) => (
            <button key={k} className={`ps-size ${poster.size === k ? 'on' : ''}`} onClick={() => setPoster({ size: k as Poster['size'] })}>
              <i style={{ aspectRatio: `${v.w} / ${v.h}` }} /><b>{v.short}</b><span>{v.label}</span>
            </button>
          ))}
        </div>
        <div ref={boxRef} className="poster-stage-wrap">
          <div className="poster-stage" style={{ height: size.h * scale, width: size.w * scale }}>
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: size.w, height: size.h }}>
              <PosterArt p={poster} photoUrls={photoUrls} shop={shop} innerRef={artRef} />
            </div>
          </div>
        </div>
        <button className="btn gold big" onClick={download} disabled={!!busy}><Icon name="print" size={18} />{busy === 'one' ? 'Making your poster…' : 'Download poster'}</button>
        <div className="row-gap">
          <button className="btn glass grow" onClick={share} disabled={!!busy}>{busy === 'share' ? 'Getting it ready…' : 'Share'}</button>
          <button className="btn ghost grow" onClick={downloadAll} disabled={!!busy}>{busy === 'all' ? 'Making all four…' : 'All four sizes'}</button>
        </div>
        <div className="ps-caption">
          <div className="row-between"><b>Caption to paste with it</b><button className="link-btn" onClick={() => { navigator.clipboard?.writeText(posterCaption(poster)); setCopied(true); setTimeout(() => setCopied(false), 1800) }}>{copied ? 'Copied ✓' : 'Copy'}</button></div>
          <pre>{posterCaption(poster)}</pre>
        </div>
        <p className="muted small">Post it two days ahead, then again an hour before you go live. Use the event cover on your Facebook event.</p>
      </section>

      {renderAll && (
        <div className="ps-offscreen" aria-hidden>
          {Object.keys(POSTER_SIZES).map(k => (
            <PosterArt key={k} p={{ ...poster, size: k as Poster['size'] }} photoUrls={photoUrls} shop={shop} innerRef={el => { allRef.current[k] = el }} />
          ))}
        </div>
      )}
    </div>
  )
}
