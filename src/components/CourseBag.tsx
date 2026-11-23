import { Link } from 'react-router-dom'

/* A business course, dressed as a luxury boutique shopping bag: rope handles, a glossy
   jewel-tone body, a gold DD crest, and a hang tag that shows New, In progress or Certified. */

export function Crest({ size = 44 }: { size?: number }) {
  return (
    <svg className="crest" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="bagfoil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#B8862B" /><stop offset=".35" stopColor="#FFE7A3" /><stop offset=".55" stopColor="#D9A53A" /><stop offset=".8" stopColor="#FFF4CF" /><stop offset="1" stopColor="#C29435" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#bagfoil)" strokeWidth="2.2">
        <circle cx="50" cy="54" r="34" />
        <path d="M34 25 l5 -10 6 7 5 -11 5 11 6 -7 5 10 z" fill="url(#bagfoil)" stroke="none" />
      </g>
      <text x="50" y="66" textAnchor="middle" fontFamily="'Bodoni Moda', Didot, Georgia, serif" fontSize="30" fontWeight="700" fill="url(#bagfoil)" letterSpacing="-3">DD</text>
    </svg>
  )
}

export default function CourseBag({ to, n, title, minutes, chapters, why, tone, status }: {
  to: string; n: number; title: string; minutes: number; chapters: number; why: string; tone: string; status?: 'done' | 'started'
}) {
  const tag = status === 'done' ? 'Certified' : status === 'started' ? 'In progress' : 'Start'
  return (
    <Link to={to} className={`bag-wrap tone-${tone}${status ? ` is-${status}` : ''}`} aria-label={`${title}, ${minutes} minutes, ${tag}`}>
      <span className="bag">
        <svg className="bag-handles" viewBox="0 0 200 70" aria-hidden="true">
          <path d="M58 70 V44 Q58 6 100 6 Q142 6 142 44 V70" />
        </svg>
        <span className="bag-body">
          <span className="bag-fold" aria-hidden="true" />
          <span className="bag-no">Nº {String(n + 1).padStart(2, '0')}</span>
          <Crest />
          <b className="bag-title">{title}</b>
          <span className="bag-rule" aria-hidden="true" />
          <span className="bag-meta">{chapters} chapters · {minutes} min</span>
          <span className="bag-by">Taught by Nova</span>
        </span>
        <span className={`bag-tag${status ? ` ${status}` : ''}`}>{tag}</span>
      </span>
      <span className="bag-why">{why}</span>
    </Link>
  )
}
