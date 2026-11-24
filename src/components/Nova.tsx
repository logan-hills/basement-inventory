import { useEffect, useId, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import { Defs, FaceArt, HitAreas, ORIGIN, Painted, VIEW, type Face, type Part } from './novaArt'

/* Nova: the Dazzle University teaching assistant, drawn from the official Dynamic Dazzle art
   (green bag, gold bow and crown, cat-eye shades low on her nose, DD crest, peace sign and her
   little "Deals, Good Vibes, Amazing People" bag). She's built from the logo's own layers, so she
   looks like the real Nova at every size and works on every phone.
   Tap her for reactions (shades, bow, bag, sneakers), swipe to spin her, double tap for her
   signature Ka-ching!, press and hold for a curtsy. She blinks, talks while she types, bobs,
   and now and then does a little move on her own. Pass `act` to make her do a move from code,
   e.g. act={['kaching', n]} (bump n to play it again). */
export type NovaMood = 'happy' | 'cheer' | 'think' | 'oops' | 'wow' | 'wink'
export type NovaMove = 'jump' | 'spin' | 'curtsy' | 'kaching'

const MOVE_MS: Record<NovaMove, number> = { jump: 1000, spin: 1000, curtsy: 1500, kaching: 1900 }
const MOOD_FACE: Record<NovaMood, Face> = { happy: 'wink', wink: 'wink', cheer: 'smile', think: 'think', oops: 'oops', wow: 'wow' }
// What she does when you tap each part: a face for a moment and a little move.
const REACT: Record<Part, { face: Face; ms: number; move?: NovaMove; anim?: string }> = {
  glasses: { face: 'sassy', ms: 1800 },
  bow: { face: 'smile', ms: 1200, anim: 'nv-bow-wiggle' },
  minibag: { face: 'heart', ms: 1800, anim: 'nv-arm-swing' },
  body: { face: 'smile', ms: 1100, move: 'jump' },
  shoes: { face: 'smile', ms: 1100, move: 'jump' },
}
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const buzz = () => { try { navigator.vibrate?.(12) } catch { /* ignore */ } }

export function Nova({ mood = 'happy', size = 96, className = '', talking = false, act }: { mood?: NovaMood; size?: number; className?: string; talking?: boolean; act?: [NovaMove, number] }) {
  const id = 'nv' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const wrap = useRef<HTMLSpanElement>(null)
  const [move, setMove] = useState<{ m: NovaMove; n: number } | null>(null)
  const [react, setReact] = useState<{ part: Part; n: number } | null>(null)
  const [blink, setBlink] = useState(false)
  const [kaching, setKaching] = useState(0)
  const visible = useRef(true)
  const gesture = useRef({ x: 0, y: 0, t: 0, moved: false, held: false, lastTap: 0, hold: 0 })

  const play = (m: NovaMove) => {
    if (reduced()) return
    setMove(v => ({ m, n: (v?.n ?? 0) + 1 }))
    if (m === 'kaching') {
      setKaching(k => k + 1)
      const r = wrap.current?.getBoundingClientRect()
      if (r) setTimeout(() => burst(r.left + r.width / 2, r.top + r.height * 0.3), 900)
    }
  }
  useEffect(() => { if (!move) return; const t = setTimeout(() => setMove(null), MOVE_MS[move.m]); return () => clearTimeout(t) }, [move])
  useEffect(() => { if (!react) return; const t = setTimeout(() => setReact(null), REACT[react.part].ms); return () => clearTimeout(t) }, [react])

  // Moods: a cheer makes her jump, a "wow" makes her spin.
  useEffect(() => { if (mood === 'cheer') play('jump'); if (mood === 'wow') play('spin') }, [mood]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (act) play(act[0]) }, [act?.[0], act?.[1]]) // eslint-disable-line react-hooks/exhaustive-deps

  // Blinks, and a surprise move every so often while she's on screen.
  useEffect(() => {
    if (reduced()) return
    let blinkT = 0, moveT = 0
    const nextBlink = () => { blinkT = window.setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 140); nextBlink() }, 2600 + Math.random() * 3400) }
    const nextMove = () => { moveT = window.setTimeout(() => { if (visible.current && !document.hidden) play((['jump', 'spin', 'curtsy', 'kaching', 'jump', 'curtsy'] as NovaMove[])[Math.floor(Math.random() * 6)]); nextMove() }, 14000 + Math.random() * 12000) }
    nextBlink(); nextMove()
    const io = new IntersectionObserver(es => es.forEach(e => { visible.current = e.isIntersecting }))
    if (wrap.current) io.observe(wrap.current)
    return () => { clearTimeout(blinkT); clearTimeout(moveT); io.disconnect() }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const onDown = (e: RPointerEvent<SVGSVGElement>) => {
    const g = gesture.current
    g.x = e.clientX; g.y = e.clientY; g.t = e.timeStamp; g.moved = false; g.held = false
    clearTimeout(g.hold)
    g.hold = window.setTimeout(() => { if (!g.moved) { g.held = true; play('curtsy'); buzz() } }, 550)
  }
  const onMove = (e: RPointerEvent<SVGSVGElement>) => {
    const g = gesture.current
    if (Math.abs(e.clientX - g.x) > 8 || Math.abs(e.clientY - g.y) > 8) { g.moved = true; clearTimeout(g.hold) }
  }
  const onUp = (e: RPointerEvent<SVGSVGElement>) => {
    const g = gesture.current
    clearTimeout(g.hold)
    const dx = e.clientX - g.x
    if (g.moved || g.held) {
      if (!g.held && Math.abs(dx) > 30) play('spin')
      // A swipe or hold shouldn't also press whatever button she's sitting in.
      const eat = (ev: MouseEvent) => { ev.stopPropagation(); ev.preventDefault() }
      window.addEventListener('click', eat, { capture: true, once: true })
      setTimeout(() => window.removeEventListener('click', eat, { capture: true }), 0)
      return
    }
    const now = e.timeStamp
    if (now - g.lastTap < 380) { g.lastTap = 0; setReact(null); play('kaching'); buzz(); return }
    g.lastTap = now
    const part = ((e.target as Element).getAttribute?.('data-part') as Part | null) ?? 'body'
    setReact(r => ({ part, n: (r?.n ?? 0) + 1 }))
    const r = REACT[part]
    if (r.move) play(r.move)
    if (part === 'bow' || part === 'shoes') burst(e.clientX, e.clientY)
    buzz()
  }

  const face: Face = react ? REACT[react.part].face : move?.m === 'kaching' ? 'smile' : move?.m === 'jump' || move?.m === 'curtsy' ? 'smile' : MOOD_FACE[mood]
  const art = FaceArt({ id, face, blink: blink && !move })
  const reactAnim = react ? REACT[react.part].anim : undefined

  return (
    <span ref={wrap} className={`nova nova-art nova-${mood} ${talking ? 'nova-talking' : ''} ${className}`} style={{ width: size, height: size }}
      role="img" aria-label={`Nova, ${mood}. Tap her shades, bow, bag or sneakers. Double tap for Ka-ching!`}>
      <span className="nova-ring" aria-hidden="true" />
      <svg className="nova-stage" viewBox={VIEW} aria-hidden="true" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => clearTimeout(gesture.current.hold)}>
        <Defs id={id} />
        <ellipse className="nv-shadow" cx="330" cy="712" rx="200" ry="22" fill={`url(#${id}shadow)`} />
        <g key={move ? `${move.m}${move.n}` : 'idle'} className={`nv-move ${move ? `nv-${move.m}` : ''}`} style={{ transformOrigin: ORIGIN.feet }}>
          <g className="nv-bob">
            <Painted n="body" />
            {art.eyes}
            <g className="nv-mouth" style={{ transformOrigin: ORIGIN.mouth }}>{art.mouth}</g>
            <g className="nv-glasses" style={{ transform: art.glasses || 'none' }}><Painted n="glasses" /></g>
            <g key={reactAnim === 'nv-bow-wiggle' ? `b${react?.n}` : 'bow'} className={`nv-bow ${reactAnim === 'nv-bow-wiggle' ? 'nv-bow-wiggle' : ''}`} style={{ transformOrigin: ORIGIN.bow }}><Painted n="bow" /></g>
            <g key={reactAnim === 'nv-arm-swing' ? `a${react?.n}` : 'arm'} className={`nv-arm ${reactAnim === 'nv-arm-swing' ? 'nv-arm-swing' : ''}`} style={{ transformOrigin: ORIGIN.arm }}><Painted n="arm" /></g>
            {move?.m === 'kaching' && <path className="nv-glint" d="M520,215 Q524,241 550,245 Q524,249 520,275 Q516,249 490,245 Q516,241 520,215Z" fill="#fff" filter={`url(#${id}glow)`} />}
          </g>
          <HitAreas />
        </g>
      </svg>
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
