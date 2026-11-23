import { Link } from 'react-router-dom'

/* A cloth-bound hardcover for each business course: linen cover, gold-foil title,
   DD crown crest, corner flourishes, raised spine bands, page edges and a satin ribbon. */

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

export function Crest({ size = 54 }: { size?: number }) {
  return (
    <svg className="crest" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8A6A2A" /><stop offset=".35" stopColor="#F5D58A" /><stop offset=".55" stopColor="#B8862B" /><stop offset=".75" stopColor="#FFF1C1" /><stop offset="1" stopColor="#9C7A33" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#foil)" strokeWidth="1.6" strokeLinejoin="round">
        <circle cx="50" cy="54" r="36" />
        <circle cx="50" cy="54" r="31" strokeWidth=".8" />
        <path d="M34 24 l5 -10 6 7 5 -11 5 11 6 -7 5 10 z" fill="url(#foil)" stroke="none" />
      </g>
      <text x="50" y="66" textAnchor="middle" fontFamily="'Bodoni Moda', Didot, Georgia, serif" fontSize="30" fontWeight="700" fill="url(#foil)" letterSpacing="-3">DD</text>
    </svg>
  )
}

function Corner({ className }: { className: string }) {
  return <svg className={`tome-corner ${className}`} viewBox="0 0 40 40" aria-hidden="true"><path d="M2 38 V14 Q2 2 14 2 H38 M8 38 V18 Q8 8 18 8 H38 M14 14 q6 0 6 6 q0 6 -6 6" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
}

export default function Tome({ to, n, title, minutes, chapters, why, tone, status }: { to: string; n: number; title: string; minutes: number; chapters: number; why: string; tone: string; status?: 'done' | 'started' }) {
  return (
    <Link to={to} className={`tome-wrap${status === 'done' ? ' done' : ''}`}>
      <span className={`tome tone-${tone}`}>
        <span className="tome-pages" aria-hidden="true" />
        <span className="tome-cover">
          <span className="tome-spine" aria-hidden="true"><i /><i /><i /><i /></span>
          <span className="tome-frame" aria-hidden="true"><Corner className="tl" /><Corner className="tr" /><Corner className="bl" /><Corner className="br" /></span>
          <span className="tome-vol">Volume {ROMAN[n] ?? n + 1}</span>
          <Crest />
          <b className="tome-title foil">{title}</b>
          <svg className="tome-flourish" viewBox="0 0 120 12" aria-hidden="true"><path d="M2 6 H46 M74 6 H118 M52 6 q8 -8 16 0 q-8 8 -16 0" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
          <span className="tome-sub">{chapters} chapters · {minutes} minutes</span>
          <span className="tome-by">Taught by Nova</span>
        </span>
        <span className="tome-ribbon" aria-hidden="true" />
        {status === 'done' && <span className="tome-seal" aria-label="Certified">Certified</span>}
      </span>
      <span className="tome-caption">{why}{status === 'started' && <em> · In progress</em>}</span>
    </Link>
  )
}
