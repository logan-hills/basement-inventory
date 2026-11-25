import { useEffect, useId, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import { Defs, FaceArt, HitAreas, Painted, PIVOT, VIEW, type Face, type Part } from './novaArt'
import { MOVES, Spring, ZERO, blinkAmount, idle, talk, type NovaMove, type Pose } from './novaMotion'

/* Nova: the Dazzle University teaching assistant, drawn from the official Dynamic Dazzle art
   (green bag, gold bow and crown, cat-eye shades low on her nose, DD crest, peace sign and her
   little "Deals, Good Vibes, Amazing People" bag). She's built from the logo's own layers, so she
   looks like the real Nova at every size and works on every phone.
   She moves with one smooth animation loop (see novaMotion.ts): she floats and breathes, leans
   toward your pointer, blinks, and her bow, bag and shades swing on springs when she moves.
   Tap her for reactions (shades, bow, bag), tap her sneakers and she dances, swipe to spin her,
   double tap for her signature Ka-ching!, press and hold for a curtsy. Now and then she does a
   little move on her own. Pass `act` to make her do a move from code,
   e.g. act={['dance', n]} (bump n to play it again). */
export type NovaMood = 'happy' | 'cheer' | 'think' | 'oops' | 'wow' | 'wink'
export type { NovaMove } from './novaMotion'

const MOOD_FACE: Record<NovaMood, Face> = { happy: 'wink', wink: 'wink', cheer: 'smile', think: 'think', oops: 'oops', wow: 'wow' }
// What she does when you tap each part: a face for a moment and a move.
const REACT: Record<Part, { face?: Face; ms: number; move?: NovaMove }> = {
  glasses: { face: 'sassy', ms: 1800 },
  bow: { face: 'smile', ms: 1200 },
  minibag: { face: 'heart', ms: 1800, move: 'wave' },
  body: { face: 'smile', ms: 1100, move: 'jump' },
  shoes: { ms: 0, move: 'dance' },
}
const SURPRISES: NovaMove[] = ['hop', 'spin', 'curtsy', 'kaching', 'dance', 'shimmy', 'wave', 'jump', 'hop', 'dance']
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const buzz = () => { try { navigator.vibrate?.(12) } catch { /* ignore */ } }
const n2 = (v: number) => Math.round(v * 100) / 100

type Playing = { m: NovaMove; start: number; dir: number; fadeAt?: number }

export function Nova({ mood = 'happy', size = 96, className = '', talking = false, act }: { mood?: NovaMood; size?: number; className?: string; talking?: boolean; act?: [NovaMove, number] }) {
  const id = 'nv' + useId().replace(/[^a-zA-Z0-9]/g, '')
  const wrap = useRef<HTMLSpanElement>(null)
  const root = useRef<SVGGElement>(null), eyes = useRef<SVGGElement>(null), mouth = useRef<SVGGElement>(null)
  const glasses = useRef<SVGGElement>(null), bow = useRef<SVGGElement>(null), arm = useRef<SVGGElement>(null), shadow = useRef<SVGEllipseElement>(null)
  const [move, setMove] = useState<{ m: NovaMove; n: number } | null>(null)
  const [moveFace, setMoveFace] = useState<Face | null>(null)
  const [react, setReact] = useState<{ part: Part; n: number } | null>(null)
  const [kaching, setKaching] = useState(0)
  const gesture = useRef({ x: 0, y: 0, t: 0, moved: false, held: false, lastTap: 0, hold: 0 })
  const timers = useRef<number[]>([])
  // Everything the animation loop needs between frames. Kept out of React so frames never re-render.
  const live = useRef({
    playing: [] as Playing[], talking, face: 'wink' as Face, lean: 0, leanTo: 0, talkW: 0,
    blinkAt: 0, nextBlink: 0, last: 0,
    bow: new Spring(170, 7, 30), arm: new Spring(140, 9, 34), gy: new Spring(260, 11, 18), jelly: new Spring(320, 13, 0.09),
  })
  useEffect(() => { live.current.talking = talking }, [talking])

  const play = (m: NovaMove, dir = Math.random() < 0.5 ? -1 : 1) => {
    if (reduced()) return
    const now = performance.now(), L = live.current
    L.playing.forEach(p => { p.fadeAt ??= now })
    L.playing.push({ m, start: now, dir })
    setMove(v => ({ m, n: (v?.n ?? 0) + 1 }))
    timers.current.forEach(clearTimeout)
    const def = MOVES[m]
    const faces = def.faces ?? (m === 'wave' ? [] : [[0, 'smile'] as [number, Face]])
    setMoveFace(null)
    timers.current = [
      ...faces.map(([s, f]) => window.setTimeout(() => setMoveFace(f), s * 1000)),
      window.setTimeout(() => { setMoveFace(null); setMove(null) }, def.ms),
    ]
    if (m === 'kaching') {
      setKaching(k => k + 1)
      const r = wrap.current?.getBoundingClientRect()
      if (r) timers.current.push(window.setTimeout(() => burst(r.left + r.width / 2, r.top + r.height * 0.3), 1050))
    }
  }
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  useEffect(() => { if (!react) return; const t = setTimeout(() => setReact(null), REACT[react.part].ms); return () => clearTimeout(t) }, [react])

  // Moods: a cheer makes her jump, a "wow" makes her spin.
  useEffect(() => { if (mood === 'cheer') play('jump'); if (mood === 'wow') play('spin') }, [mood]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (act) play(act[0]) }, [act?.[0], act?.[1]]) // eslint-disable-line react-hooks/exhaustive-deps

  // The animation loop. It only runs while she's on screen, and not at all for reduced motion.
  useEffect(() => {
    if (reduced()) return
    const L = live.current
    let raf = 0, onScreen = true, moveT = 0
    const at = (now: number) => {
      const p: Pose = { ...ZERO }
      idle(now / 1000, p)
      for (const pl of L.playing) {
        const def = MOVES[pl.m], t = (now - pl.start) / 1000
        if (t < 0 || t > def.ms / 1000) continue
        const w = pl.fadeAt === undefined ? 1 : Math.max(0, 1 - (now - pl.fadeAt) / 260)
        if (w <= 0) continue
        const q: Pose = { ...ZERO }
        def.pose(t, q, pl.dir)
        for (const k in q) p[k as keyof Pose] += q[k as keyof Pose] * w
      }
      p.rot += L.lean; p.x += L.lean * 3
      return p
    }
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(1 / 30, Math.max(1 / 240, (now - (L.last || now - 16)) / 1000)); L.last = now
      L.playing = L.playing.filter(pl => now - pl.start < MOVES[pl.m].ms && (pl.fadeAt === undefined || now - pl.fadeAt < 260))
      L.lean += (L.leanTo - L.lean) * (1 - Math.exp(-dt * 3))
      // Her pose now and a moment ago gives her body's acceleration, which drives the springs.
      const h = 1 / 60, p = at(now), p1 = at(now - h * 1000), p2 = at(now - 2 * h * 1000)
      const ay = (p.y - 2 * p1.y + p2.y) / (h * h), ax = (p.x - 2 * p1.x + p2.x) / (h * h)
      const bowA = L.bow.step(p.bow, ay * 0.45 + ax * 0.7, dt)
      const armA = L.arm.step(p.arm, ay * 0.3 + ax * 0.5, dt)
      const gy = L.gy.step(p.gy, ay * 0.4, dt)
      const jelly = L.jelly.step(0, -ay * 0.004, dt)
      // A spin is a turn of the whole bag: we see her edge-on halfway round.
      let c = Math.cos(Math.PI * 2 * p.turn)
      if (Math.abs(c) < 0.05) c = c < 0 ? -0.05 : 0.05
      const sx = (1 + p.sx - jelly * 0.6) * c, sy = 1 + p.sy + jelly
      const [fx, fy] = PIVOT.feet
      root.current?.setAttribute('transform', `translate(${n2(p.x)} ${n2(p.y)}) rotate(${n2(p.rot)} ${fx} ${fy}) translate(${fx} ${fy}) scale(${n2(sx * 1000) / 1000} ${n2(sy * 1000) / 1000}) translate(${-fx} ${-fy})`)
      bow.current?.setAttribute('transform', `rotate(${n2(bowA)} ${PIVOT.bow[0]} ${PIVOT.bow[1]})`)
      arm.current?.setAttribute('transform', `rotate(${n2(armA)} ${PIVOT.arm[0]} ${PIVOT.arm[1]})`)
      glasses.current?.setAttribute('transform', `translate(${n2(p.gx)} ${n2(gy)})`)
      const lift = Math.max(0, -p.y) / 220
      shadow.current?.setAttribute('transform', `translate(${n2(p.x * 0.9)} 0) translate(${PIVOT.shadow[0]} ${PIVOT.shadow[1]}) scale(${n2((1 - lift * 0.5) * Math.abs(c) ** 0.3 * 100) / 100} 1) translate(${-PIVOT.shadow[0]} ${-PIVOT.shadow[1]})`)
      shadow.current?.setAttribute('opacity', String(n2(1 - lift * 0.6)))
      // Blinks: a quick, smooth close and open, sometimes a double blink.
      if (now > L.nextBlink) { L.blinkAt = now; L.nextBlink = now + (Math.random() < 0.2 ? 260 : 2600 + Math.random() * 3400) }
      const shut = L.face === 'smile' || L.face === 'heart' ? 0 : blinkAmount((now - L.blinkAt) / 1000)
      eyes.current?.setAttribute('transform', `translate(0 ${PIVOT.eyes[1]}) scale(1 ${n2((1 - 0.9 * shut) * 100) / 100}) translate(0 ${-PIVOT.eyes[1]})`)
      // Talking: her mouth eases in and out of a natural chatter.
      L.talkW += ((L.talking ? 1 : 0) - L.talkW) * (1 - Math.exp(-dt * 12))
      const m = talk(now / 1000), w = L.talkW
      mouth.current?.setAttribute('transform', `translate(${PIVOT.mouth[0]} ${PIVOT.mouth[1]}) scale(${n2((1 + w * 0.06 * (1 - m)) * 100) / 100} ${n2((1 + w * (0.42 * m - 0.26)) * 100) / 100}) translate(${-PIVOT.mouth[0]} ${-PIVOT.mouth[1]})`)
    }
    const run = () => { if (!raf && onScreen && !document.hidden) { L.last = 0; raf = requestAnimationFrame(frame) } }
    const stop = () => { cancelAnimationFrame(raf); raf = 0 }
    const io = new IntersectionObserver(es => es.forEach(e => { onScreen = e.isIntersecting; if (onScreen) run(); else stop() }))
    if (wrap.current) io.observe(wrap.current)
    const vis = () => (document.hidden ? stop() : run())
    document.addEventListener('visibilitychange', vis)
    // She leans a little toward your mouse (computers only; phones have no pointer to follow).
    const hover = window.matchMedia?.('(hover: hover)').matches
    const look = (e: PointerEvent) => {
      const r = wrap.current?.getBoundingClientRect(); if (!r) return
      const dx = (e.clientX - (r.left + r.width / 2)) / Math.max(320, window.innerWidth / 2)
      L.leanTo = Math.max(-1, Math.min(1, dx)) * 4
    }
    if (hover) window.addEventListener('pointermove', look, { passive: true })
    const nextMove = () => { moveT = window.setTimeout(() => { if (onScreen && !document.hidden && !L.playing.length) play(SURPRISES[Math.floor(Math.random() * SURPRISES.length)]); nextMove() }, 14000 + Math.random() * 12000) }
    nextMove(); run()
    return () => { stop(); clearTimeout(moveT); io.disconnect(); document.removeEventListener('visibilitychange', vis); if (hover) window.removeEventListener('pointermove', look) }
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
      if (!g.held && Math.abs(dx) > 30) play('spin', dx < 0 ? -1 : 1)
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
    const r = REACT[part]
    if (r.face) setReact(v => ({ part, n: (v?.n ?? 0) + 1 }))
    if (r.move) play(r.move)
    if (part === 'bow') { live.current.bow.kick(Math.random() < 0.5 ? -260 : 260); burst(e.clientX, e.clientY) }
    if (part === 'glasses') live.current.gy.kick(160)
    if (part === 'shoes') burst(e.clientX, e.clientY)
    buzz()
  }

  const face: Face = (react && REACT[react.part].face) || moveFace || MOOD_FACE[mood]
  useEffect(() => { live.current.face = face }, [face])
  // Faces crossfade: the old one fades out while the new one fades in, no hard cut.
  const [faces, setFaces] = useState<{ cur: Face; prev: Face | null; n: number }>({ cur: face, prev: null, n: 0 })
  useEffect(() => {
    if (face === faces.cur) return
    setFaces(f => ({ cur: face, prev: reduced() ? null : f.cur, n: f.n + 1 }))
  }, [face]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!faces.prev) return; const t = setTimeout(() => setFaces(f => ({ ...f, prev: null })), 220); return () => clearTimeout(t) }, [faces.n]) // eslint-disable-line react-hooks/exhaustive-deps
  const art = FaceArt({ id, face: faces.cur, tag: `c${faces.n}` })
  const old = faces.prev ? FaceArt({ id, face: faces.prev, tag: `p${faces.n}` }) : null
  const dancing = move?.m === 'dance' || move?.m === 'shimmy'

  return (
    <span ref={wrap} className={`nova nova-art nova-${mood} ${talking ? 'nova-talking' : ''} ${className}`} style={{ width: size, height: size }}
      role="img" aria-label={`Nova, ${mood}. Tap her shades, bow, bag or sneakers. Double tap for Ka-ching!`}>
      <span className="nova-ring" aria-hidden="true" />
      <svg className="nova-stage" viewBox={VIEW} aria-hidden="true" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => clearTimeout(gesture.current.hold)}>
        <Defs id={id} />
        <ellipse ref={shadow} className="nv-shadow" cx="330" cy="712" rx="200" ry="22" fill={`url(#${id}shadow)`} />
        <g ref={root}>
          <Painted n="body" />
          <g ref={eyes}>
            {old && <g key={`p${faces.n}`} className="nv-fade-out">{old.eyes}</g>}
            <g key={`c${faces.n}`} className={faces.n ? 'nv-fade-in' : ''}>{art.eyes}</g>
          </g>
          <g ref={mouth}>
            {old && <g key={`p${faces.n}`} className="nv-fade-out">{old.mouth}</g>}
            <g key={`c${faces.n}`} className={faces.n ? 'nv-fade-in' : ''}>{art.mouth}</g>
          </g>
          <g ref={glasses}><g className="nv-glasses" style={{ transform: art.glasses || 'none' }}><Painted n="glasses" /></g></g>
          <g ref={bow}><Painted n="bow" /></g>
          <g ref={arm}><Painted n="arm" /></g>
          {move?.m === 'kaching' && <path key={move.n} className="nv-glint" d="M520,215 Q524,241 550,245 Q524,249 520,275 Q516,249 490,245 Q516,241 520,215Z" fill="#fff" filter={`url(#${id}glow)`} />}
          <HitAreas />
        </g>
      </svg>
      {kaching > 0 && <span key={`k${kaching}`} className="nova-kaching" aria-hidden="true">Ka-ching!</span>}
      {dancing && <span key={`n${move.n}`} className="nova-notes" style={{ fontSize: Math.max(14, size * 0.2) }} aria-hidden="true"><i>♪</i><i>♫</i><i>♪</i></span>}
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
