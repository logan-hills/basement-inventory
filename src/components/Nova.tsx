import { useEffect, useRef, useState, type ReactNode } from 'react'

import novaAvatar from '../assets/nova-avatar.webp'
import type { Move, NovaHandle } from './nova3d'
export type { Move as NovaMove }

/* 3D Nova is loaded on first use and shared by every Nova on screen. Until it's ready, or on a
   device that can't run it (no WebGL, very old or slow), she shows as her picture. */
type Nova3D = typeof import('./nova3d')
let nova3d: Nova3D | null = null
let loading: Promise<Nova3D | null> | null = null
const load3d = () => (loading ??= import('./nova3d').then(m => (nova3d = m)).catch(() => null))

/* Nova: the Dazzle University teaching assistant, from the official Dynamic Dazzle art
   (green bag, gold bow and crown, cat-eye shades, DD crest). She's a real 3D handbag:
   drag to spin her, tap her for reactions, double tap for her signature Ka-ching!, press and
   hold for a curtsy. She turns to follow your finger or mouse and does little moves on her own.
   Moods change her face, how she moves and what sparkles around her. Pass `act` to make her do a
   move from code, e.g. act={['kaching', n]} (bump n to play it again). */
export type NovaMood = 'happy' | 'cheer' | 'think' | 'oops' | 'wow' | 'wink'

export function Nova({ mood = 'happy', size = 96, className = '', talking = false, act }: { mood?: NovaMood; size?: number; className?: string; talking?: boolean; act?: [Move, number] }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const handle = useRef<NovaHandle | null>(null)
  const [live, setLive] = useState(() => !!nova3d?.supported())
  const moodRef = useRef(mood)
  const [kaching, setKaching] = useState(0)

  useEffect(() => {
    let gone = false
    load3d().then(m => {
      if (gone || !m || !canvas.current) return
      handle.current = m.attach(canvas.current, moodRef.current, () => setLive(false))
      setLive(!!handle.current)
    })
    // Confetti when she shows off her bow or dances.
    const el = canvas.current
    const onPoke = (e: Event) => {
      const { part, x, y } = (e as CustomEvent<{ part: string; x: number; y: number }>).detail
      if (part === 'bow' || part === 'shoes') burst(x, y)
    }
    // Her signature move: a Ka-ching! pop and confetti as she lands the pose.
    const onMove = (e: Event) => {
      const { move, x, y } = (e as CustomEvent<{ move: Move; x: number; y: number }>).detail
      if (move === 'kaching') { setKaching(k => k + 1); burst(x, y) }
    }
    el?.addEventListener('novapoke', onPoke)
    el?.addEventListener('novamove', onMove)
    return () => { gone = true; el?.removeEventListener('novapoke', onPoke); el?.removeEventListener('novamove', onMove); handle.current?.detach(); handle.current = null }
  }, [])
  useEffect(() => { handle.current?.setTalking(talking) }, [talking, live])
  useEffect(() => { moodRef.current = mood; handle.current?.setMood(mood) }, [mood])
  useEffect(() => { if (act) handle.current?.play(act[0]) }, [act?.[0], act?.[1], live]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className={`nova nova-${mood} ${live ? 'nova-live' : ''} ${className}`} style={{ width: size, height: size }} role="img" aria-label={`Nova, ${mood}${live ? '. Drag to spin her. Tap her shades, bow, hand, bag or sneakers. Double tap for Ka-ching!' : ''}`}>
      <span className="nova-ring">
        <img src={novaAvatar} alt="" width={size} height={size} draggable={false} />
      </span>
      <canvas ref={canvas} className="nova-3d" aria-hidden="true" />
      {kaching > 0 && <span key={kaching} className="nova-kaching" aria-hidden="true">Ka-ching!</span>}
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
  const talkingNow = !!text && n < text.length
  return (
    <div className={`nova-says ${side}`}>
      {onNovaClick
        ? <button className="nova-btn" onClick={onNovaClick} aria-label="Ask Nova for another tip"><Nova mood={mood} size={size} talking={talkingNow} /></button>
        : <Nova mood={mood} size={size} talking={talkingNow} />}
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
