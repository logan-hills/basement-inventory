import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import Icon from './Icon'
import { seed, serial, type AwardStatus } from '../lessons/awards'

/* Dazzle University certificates. Each kind has its own look, and each award gets its own
   pattern (worked out from its id), so no two certificates are quite the same:
   - course: an ivory certificate with a guilloché border and a ribbon rosette
   - module: a boutique hang tag, like the lesson tags, with a gold string
   - orientation: a gold-foil diploma inside a laurel wreath
   - school: an honors banner with a laurel and a star
   - milestone: a medal on a ribbon */

const when = (d: string | null) => (d ? new Date(d) : new Date()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

/** Rings of overlapping ellipses, like the engraving on a banknote. */
function Guilloche({ id, r = 46, rings = 2, jewel = false }: { id: string; r?: number; rings?: number; jewel?: boolean }) {
  const s = seed(id)
  const n = 16 + Math.round(s * 14)
  const k = 0.3 + s * 0.35
  return (
    <g fill="none" stroke="currentColor" strokeWidth=".5">
      {Array.from({ length: rings }, (_, ring) => Array.from({ length: n }, (_, i) => (
        <ellipse key={`${ring}-${i}`} cx="0" cy="0" rx={r - ring * 9} ry={(r - ring * 9) * (k + ring * 0.12)} transform={`rotate(${(i * 180) / n + ring * 7})`} />
      )))}
      {jewel && <circle r={r * k * 0.55} fill="currentColor" stroke="none" />}
    </g>
  )
}

/** Two laurel branches meeting at the bottom. */
function Laurel({ size = 200 }: { size?: number }) {
  const R = 80
  const pt = (deg: number, r = R) => [Math.cos((deg * Math.PI) / 180) * r, Math.sin((deg * Math.PI) / 180) * r]
  const [x0, y0] = pt(96), [x1, y1] = pt(218)
  const leaves = Array.from({ length: 8 }, (_, i) => 104 + i * 15)
  const branch = (flip: 1 | -1) => (
    <g transform={`scale(${flip} 1)`}>
      <path d={`M${x0.toFixed(1)} ${y0.toFixed(1)} A${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      {leaves.map(d => [[R + 3, d + 90 - 40], [R - 3, d + 90 + 40]].map(([r, rot], j) => {
        const [x, y] = pt(d, r)
        return <path key={`${d}-${j}`} d="M0 0 C 6 -7 17 -7 24 0 C 17 7 6 7 0 0Z" fill="currentColor" transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot})`} />
      }))}
    </g>
  )
  return <svg className="cert-laurel" viewBox="-110 -80 220 180" width={size} aria-hidden="true">{branch(1)}{branch(-1)}</svg>
}

/** A rosette seal with ribbon tails and the award's icon in the middle. */
function Rosette({ a, size = 120 }: { a: AwardStatus; size?: number }) {
  const s = seed(a.id)
  const points = 20 + Math.round(s * 12)
  const star = Array.from({ length: points * 2 }, (_, i) => {
    const r = i % 2 ? 44 : 50
    const t = (Math.PI * i) / points
    return `${(Math.cos(t) * r).toFixed(1)},${(Math.sin(t) * r).toFixed(1)}`
  }).join(' ')
  return (
    <span className="cert-rosette" style={{ width: size, height: size * 1.25 }} aria-hidden="true">
      <svg viewBox="-60 -60 120 150" width={size}>
        <path d="M-22 30 L-34 88 L-20 78 L-10 92 L0 34Z" className="rib" />
        <path d="M22 30 L34 88 L20 78 L10 92 L0 34Z" className="rib" />
        <polygon points={star} className="edge" />
        <circle r="38" className="face" />
        <g className="engr"><Guilloche id={a.id} r={34} rings={1} /></g>
        <circle r="24" className="core" />
      </svg>
      <span className="cert-rosette-ico"><Icon name={a.icon} size={Math.round(size * 0.2)} /></span>
    </span>
  )
}

export function Medal({ a, size = 96 }: { a: AwardStatus; size?: number }) {
  return (
    <span className={`medal tone-${a.tone}${a.earned ? ' earned' : ''}`} style={{ width: size }}>
      <svg viewBox="-50 -70 100 130" width={size} aria-hidden="true">
        <path d="M-26 -70 L-6 -14 L6 -14 L-14 -70Z" className="rib a" />
        <path d="M26 -70 L6 -14 L-6 -14 L14 -70Z" className="rib b" />
        <circle cy="14" r="40" className="edge" />
        <circle cy="14" r="33" className="face" />
        <g transform="translate(0 14)" className="engr"><Guilloche id={a.id} r={30} rings={1} /></g>
      </svg>
      <span className="medal-ico"><Icon name={a.earned ? a.icon : 'clock'} size={Math.round(size * 0.28)} /></span>
    </span>
  )
}

/** The certificate itself, sized to fit a page when printed. */
export function Certificate({ a, shopName, shopId }: { a: AwardStatus; shopName: string; shopId?: string }) {
  const no = serial(a, shopId)
  const name = shopName || 'You'
  const sign = <span className="cert-sig"><b>Nova</b><small>Head of Dazzle University</small></span>
  const meta = <span className="cert-meta">{when(a.date)} · Nº {no}</span>

  if (a.kind === 'module') {
    const mod = a.line.match(/Module (\d+)/)?.[1] ?? ''
    return (
      <div className={`cert cert-tag tone-${a.tone}`}>
        <svg className="cert-tag-string" viewBox="0 0 60 70" aria-hidden="true"><path d="M30 70 C 6 46, 54 26, 30 0" /></svg>
        <div className="cert-tag-body">
          <span className="cert-tag-hole" aria-hidden="true" />
          <span className="cert-tag-band"><small>Dazzle University · Orientation</small><b>Module {mod}</b></span>
          <span className="cert-tag-ico"><Icon name={a.icon} size={34} /></span>
          <span className="cert-kick">This tag certifies that</span>
          <span className="cert-name">{name}</span>
          <span className="cert-kick">is officially a</span>
          <h2 className="cert-title">{a.title}</h2>
          <span className="cert-line">{a.line.replace(/^Orientation Module \d+: /, '')}</span>
          <svg className="cert-tag-pattern" viewBox="-50 -50 100 100" aria-hidden="true"><Guilloche id={a.id} r={46} rings={3} /></svg>
          {sign}
          {meta}
        </div>
      </div>
    )
  }

  if (a.kind === 'orientation' || a.kind === 'school' || (a.kind === 'milestone' && a.id === 'm-all')) {
    const diploma = a.kind !== 'school'
    return (
      <div className={`cert cert-diploma tone-${a.tone}${diploma ? ' foil' : ''}`}>
        <svg className="cert-corner tl" viewBox="-50 -50 100 100" aria-hidden="true"><Guilloche id={a.id} r={46} rings={3} jewel /></svg>
        <svg className="cert-corner br" viewBox="-50 -50 100 100" aria-hidden="true"><Guilloche id={`${a.id}x`} r={46} rings={3} jewel /></svg>
        <span className="cert-crest">Dazzle University</span>
        <span className="cert-kick">{diploma ? 'Diploma' : 'With honors from the School of'}</span>
        <h2 className="cert-title">{a.title}</h2>
        <div className="cert-wreath">
          <Laurel size={220} />
          <span className="cert-wreath-star"><Icon name={a.icon} size={34} /></span>
        </div>
        <span className="cert-kick">proudly awarded to</span>
        <span className="cert-name">{name}</span>
        <p className="cert-line">{a.line}</p>
        <div className="cert-foot">{sign}{meta}</div>
      </div>
    )
  }

  if (a.kind === 'milestone') {
    return (
      <div className={`cert cert-medal tone-${a.tone}`}>
        <Medal a={a} size={150} />
        <span className="cert-crest">Dazzle University milestone</span>
        <h2 className="cert-title">{a.title}</h2>
        <p className="cert-line">{a.line}</p>
        <span className="cert-kick">earned by</span>
        <span className="cert-name">{name}</span>
        {meta}
      </div>
    )
  }

  return (
    <div className={`cert cert-course tone-${a.tone}`}>
      <div className="cert-frame">
        <svg className="cert-corner tl" viewBox="-50 -50 100 100" aria-hidden="true"><Guilloche id={a.id} r={46} rings={2} jewel /></svg>
        <svg className="cert-corner tr" viewBox="-50 -50 100 100" aria-hidden="true"><Guilloche id={a.id} r={46} rings={2} jewel /></svg>
        <span className="cert-crest">Dazzle University</span>
        <span className="cert-kick">Certificate of completion · {a.line}</span>
        <span className="cert-kick soft">This certifies that</span>
        <span className="cert-name">{name}</span>
        <span className="cert-kick soft">has completed the course</span>
        <h2 className="cert-title">{a.title}</h2>
        {a.outcomes && <ul className="cert-outcomes-new">{a.outcomes.slice(0, 3).map(o => <li key={o}>{o}</li>)}</ul>}
        <div className="cert-foot">{sign}<Rosette a={a} size={96} />{meta}</div>
      </div>
    </div>
  )
}

/** A secondary window that shows one certificate with Print and Close. */
export function CertificateWindow({ a, shopName, shopId, onClose }: { a: AwardStatus; shopName: string; shopId?: string; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', k)
    document.body.classList.add('cert-open')
    return () => { document.removeEventListener('keydown', k); document.body.classList.remove('cert-open') }
  }, [onClose])
  return createPortal(
    <div className="cert-window" role="dialog" aria-modal="true" aria-label={`${a.title} certificate`} onClick={onClose}>
      <div className="cert-window-inner" onClick={e => e.stopPropagation()}>
        <Certificate a={a} shopName={shopName} shopId={shopId} />
        <div className="cert-window-actions">
          <button type="button" className="btn uni-cta" onClick={() => window.print()}><Icon name="print" size={20} /> Print or save as PDF</button>
          <button type="button" className="btn uni-ghost-dark" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
