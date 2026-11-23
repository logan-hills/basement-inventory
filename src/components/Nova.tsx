import { useEffect, useState, type ReactNode } from 'react'

/* Nova: the Dazzle Academy teaching assistant. A gold-and-rose handbag with a crown clasp.
   Moods change her face; she floats, blinks, and bounces when she cheers. */
export type NovaMood = 'happy' | 'cheer' | 'think' | 'oops' | 'wow' | 'wink'

export function Nova({ mood = 'happy', size = 96, className = '' }: { mood?: NovaMood; size?: number; className?: string }) {
  const eyesClosed = mood === 'cheer'
  return (
    <svg className={`nova nova-${mood} ${className}`} width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`Nova the handbag, ${mood}`}>
      <defs>
        <linearGradient id="novaBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFB86B" /><stop offset=".55" stopColor="#FF7A59" /><stop offset="1" stopColor="#E85D8E" />
        </linearGradient>
        <linearGradient id="novaFlap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE29A" /><stop offset="1" stopColor="#FFC24D" />
        </linearGradient>
      </defs>
      <g className="nova-bob">
        {/* handle */}
        <path d="M38 42 C38 14, 82 14, 82 42" fill="none" stroke="#FFD36E" strokeWidth="7" strokeLinecap="round" />
        <path d="M38 42 C38 14, 82 14, 82 42" fill="none" stroke="#B8862B" strokeWidth="2" strokeLinecap="round" opacity=".4" />
        {/* body */}
        <path d="M22 44 H98 L106 100 Q106 108 98 108 H22 Q14 108 14 100 Z" fill="url(#novaBody)" />
        <path d="M22 44 H98 L106 100 Q106 108 98 108 H22 Q14 108 14 100 Z" fill="none" stroke="#2A1A0C" strokeOpacity=".18" strokeWidth="2" />
        {/* flap */}
        <path d="M20 44 H100 L96 60 Q60 72 24 60 Z" fill="url(#novaFlap)" />
        {/* crown clasp */}
        <path d="M52 62 l4 4 4-7 4 7 4-4 -2 9 h-12 z" fill="#2A1A0C" opacity=".85" />
        <circle cx="60" cy="58" r="1.6" fill="#FFF6E0" />
        {/* stitches */}
        <path d="M20 100 H100" stroke="#FFF6E0" strokeOpacity=".35" strokeDasharray="3 4" strokeWidth="1.5" />
        {/* face */}
        <g className="nova-face">
          {mood === 'oops' && <><path d="M38 72 l10 3" stroke="#2A1A0C" strokeWidth="2.5" strokeLinecap="round" /><path d="M82 72 l-10 3" stroke="#2A1A0C" strokeWidth="2.5" strokeLinecap="round" /></>}
          {eyesClosed ? (
            <><path d="M38 82 q6 -7 12 0" fill="none" stroke="#2A1A0C" strokeWidth="3" strokeLinecap="round" /><path d="M70 82 q6 -7 12 0" fill="none" stroke="#2A1A0C" strokeWidth="3" strokeLinecap="round" /></>
          ) : (
            <g className="nova-eyes">
              <ellipse cx="44" cy={mood === 'think' ? 78 : 81} rx="5" ry={mood === 'wow' ? 7 : 6} fill="#2A1A0C" />
              {mood === 'wink'
                ? <path d="M70 82 q6 -6 12 0" fill="none" stroke="#2A1A0C" strokeWidth="3" strokeLinecap="round" />
                : <ellipse cx="76" cy={mood === 'think' ? 78 : 81} rx="5" ry={mood === 'wow' ? 7 : 6} fill="#2A1A0C" />}
              <circle cx="46" cy={mood === 'think' ? 76 : 79} r="1.8" fill="#fff" />
              {mood !== 'wink' && <circle cx="78" cy={mood === 'think' ? 76 : 79} r="1.8" fill="#fff" />}
            </g>
          )}
          <ellipse cx="34" cy="92" rx="6" ry="3.5" fill="#FF3D7F" opacity=".35" />
          <ellipse cx="86" cy="92" rx="6" ry="3.5" fill="#FF3D7F" opacity=".35" />
          {mood === 'wow' && <ellipse cx="60" cy="95" rx="5" ry="6" fill="#2A1A0C" />}
          {mood === 'oops' && <path d="M50 97 q5 -4 10 0 q5 4 10 0" fill="none" stroke="#2A1A0C" strokeWidth="2.5" strokeLinecap="round" />}
          {mood === 'think' && <path d="M53 96 h12" stroke="#2A1A0C" strokeWidth="2.5" strokeLinecap="round" />}
          {(mood === 'happy' || mood === 'wink') && <path d="M50 92 q10 9 20 0" fill="none" stroke="#2A1A0C" strokeWidth="3" strokeLinecap="round" />}
          {mood === 'cheer' && <path d="M48 90 q12 14 24 0 z" fill="#2A1A0C" />}
        </g>
      </g>
      {(mood === 'cheer' || mood === 'wow') && (
        <g className="nova-sparkles" fill="#FFD36E">
          <path d="M10 30 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
          <path d="M108 24 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" />
          <path d="M106 70 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z" />
        </g>
      )}
      {mood === 'think' && <g fill="#FFD36E" opacity=".8"><circle cx="100" cy="40" r="2.5" /><circle cx="106" cy="30" r="3.5" /><circle cx="112" cy="18" r="4.5" /></g>}
    </svg>
  )
}

/** Nova with a speech bubble. The text types on so she feels like she's talking. */
export function NovaSays({ mood = 'happy', children, size = 84, side = 'left', typing = true, onNovaClick }: { mood?: NovaMood; children: ReactNode; size?: number; side?: 'left' | 'right'; typing?: boolean; onNovaClick?: () => void }) {
  const text = typeof children === 'string' ? children : null
  const [n, setN] = useState(text && typing ? 0 : Infinity)
  useEffect(() => {
    if (!text || !typing || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setN(Infinity); return }
    setN(0)
    const t = setInterval(() => setN(x => { if (x >= text.length) { clearInterval(t); return x } return x + 2 }), 16)
    return () => clearInterval(t)
  }, [text, typing])
  return (
    <div className={`nova-says ${side}`}>
      {onNovaClick
        ? <button className="nova-btn" onClick={onNovaClick} aria-label="Ask Nova for another tip"><Nova mood={mood} size={size} /></button>
        : <Nova mood={mood} size={size} />}
      <div className="nova-bubble" aria-live="polite">
        <span className="nova-name">Nova</span>
        {text ? <span>{text.slice(0, n)}<span className="nova-ghost">{text.slice(n)}</span></span> : children}
      </div>
    </div>
  )
}

/** A little confetti burst from a point (or the screen center). Skipped for reduced motion. */
export function burst(x?: number, y?: number) {
  if (typeof document === 'undefined' || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  const colors = ['#FFD36E', '#FF7A59', '#E85D8E', '#8E3BB8', '#22B074', '#FBEFDC']
  const box = document.createElement('div')
  box.className = 'confetti'
  box.style.left = `${x ?? window.innerWidth / 2}px`
  box.style.top = `${y ?? window.innerHeight / 3}px`
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('i')
    const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 120
    s.style.setProperty('--dx', `${Math.cos(a) * d}px`)
    s.style.setProperty('--dy', `${Math.sin(a) * d - 60}px`)
    s.style.setProperty('--r', `${Math.random() * 720 - 360}deg`)
    s.style.background = colors[i % colors.length]
    s.style.animationDelay = `${Math.random() * 80}ms`
    box.appendChild(s)
  }
  document.body.appendChild(box)
  setTimeout(() => box.remove(), 1400)
}

export const NOVA_CHEERS = ['Yes, queen!', 'You got it!', 'That\'s my seller!', 'Ooh, look at you go!', 'Nailed it!', 'Bargain brain activated!', 'Period. Next!']
export const NOVA_OOPS = ['Close! Try again.', 'Not quite, but you\'re learning.', 'Ooh, so close. Look again.', 'No worries, everybody misses one.']
export const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
