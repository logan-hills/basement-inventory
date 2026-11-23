import { useEffect, useState, type ReactNode } from 'react'

import novaAvatar from '../assets/nova-avatar.webp'

/* Nova: the Dazzle University teaching assistant, from the official Dynamic Dazzle art
   (green bag, gold bow and crown, cat-eye shades, DD crest). Moods change how she moves
   and what sparkles around her. */
export type NovaMood = 'happy' | 'cheer' | 'think' | 'oops' | 'wow' | 'wink'

export function Nova({ mood = 'happy', size = 96, className = '' }: { mood?: NovaMood; size?: number; className?: string }) {
  return (
    <span className={`nova nova-${mood} ${className}`} style={{ width: size, height: size }} role="img" aria-label={`Nova, ${mood}`}>
      <span className="nova-ring">
        <img src={novaAvatar} alt="" width={size} height={size} draggable={false} />
      </span>
      {(mood === 'cheer' || mood === 'wow') && (
        <svg className="nova-fx" viewBox="0 0 100 100" aria-hidden="true">
          <g fill="#FFD36E">
            <path d="M8 20 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
            <path d="M92 12 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" />
            <path d="M94 78 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2z" />
          </g>
        </svg>
      )}
      {mood === 'think' && <span className="nova-dots" aria-hidden="true"><i /><i /><i /></span>}
      {mood === 'oops' && <span className="nova-badge" aria-hidden="true">?</span>}
    </span>
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
