import { useEffect, useMemo, useRef, useState } from 'react'
import { slices, sliceInk, totalSlots, pct, tick, SPIN_MS, ROLL_MS, type Entrant, type Spin, type PublicShow } from '../lib/giveaway'

/** A clock that re-renders while something is moving. */
function useNow(active: boolean, every = 100) {
  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    if (!active) return
    const t = setInterval(() => setNow(Date.now()), every)
    return () => clearInterval(t)
  }, [active, every])
  return now
}

const short = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + '…' : s)
const pt = (r: number, deg: number) => [r * Math.sin((deg * Math.PI) / 180), -r * Math.cos((deg * Math.PI) / 180)]
function arc(r: number, a0: number, a1: number) {
  const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1)
  return `M0 0L${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}Z`
}

/** The wheel. Each person's slice is sized by their slots. Turns with requestAnimationFrame so the
    seller's screen and the stream overlay land on the same slice, and ticks as it passes each name. */
export function Wheel({ entrants, spin, shift = 0, sound = false, onSpin }: { entrants: Entrant[]; spin: Spin | null; shift?: number; sound?: boolean; onSpin?: () => void }) {
  const parts = useMemo(() => slices(entrants), [entrants])
  const [angle, setAngle] = useState(() => (spin ? 360 - spin.stop : 0))
  const rest = useRef(angle)
  const seen = useRef<string | null>(spin && Date.now() - (spin.at + shift) > SPIN_MS ? spin.id : null)
  const partsRef = useRef(parts), shiftRef = useRef(shift), soundRef = useRef(sound)
  partsRef.current = parts; shiftRef.current = shift; soundRef.current = sound

  const spinRef = useRef(spin)
  spinRef.current = spin
  useEffect(() => {
    const spin = spinRef.current
    if (!spin || seen.current === spin.id) return
    seen.current = spin.id
    const start = spin.at + shiftRef.current
    const from = rest.current
    const delta = spin.turns * 360 + ((((360 - spin.stop) - from) % 360) + 360) % 360
    let raf = 0, last = -1
    const step = () => {
      const t = Math.min(1, Math.max(0, (Date.now() - start) / SPIN_MS))
      const eased = 1 - Math.pow(1 - t, 4)
      const a = from + delta * eased
      setAngle(a)
      if (soundRef.current) {
        const p = ((360 - (a % 360)) % 360)
        const i = partsRef.current.findIndex(s => p >= s.start && p < s.end)
        if (i !== last) { if (last !== -1) tick(); last = i }
      }
      if (t < 1) raf = requestAnimationFrame(step)
      else rest.current = (360 - spin.stop) % 360
    }
    raf = requestAnimationFrame(step)
    return () => { cancelAnimationFrame(raf); rest.current = (360 - spin.stop) % 360; setAngle(rest.current) }
  }, [spin?.id])

  const many = parts.length > 14
  return (
    <div className="gw-wheel-wrap">
      <svg className="gw-wheel" viewBox="-120 -120 240 240" role="img" aria-label={`Giveaway wheel with ${parts.length} people`}>
        <defs>
          <radialGradient id="gw-hub" cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#FFF1C2" /><stop offset=".55" stopColor="#FFD36E" /><stop offset="1" stopColor="#C98A1E" /></radialGradient>
          <linearGradient id="gw-rim" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFE29A" /><stop offset=".5" stopColor="#C98A1E" /><stop offset="1" stopColor="#FFD36E" /></linearGradient>
        </defs>
        <circle r="116" fill="url(#gw-rim)" />
        <circle r="106" fill="#2A1A0C" />
        <g transform={`rotate(${angle})`}>
          {parts.length === 0 && <circle r="104" fill="#3A2A20" />}
          {parts.length === 1 && <circle r="104" fill={parts[0].color} />}
          {parts.length > 1 && parts.map(s => <path key={s.entrant.id} d={arc(104, s.start, s.end)} fill={s.color} stroke="#2A1A0C" strokeWidth=".8" />)}
          {parts.map(s => {
            const size = s.end - s.start
            if (size < (many ? 5 : 7)) return null
            const mid = (s.start + s.end) / 2
            const fs = Math.max(6, Math.min(13, size * 0.55, 150 / Math.max(6, s.entrant.name.length)))
            return (
              <text key={s.entrant.id} transform={`rotate(${mid - 90}) translate(96 0)`} textAnchor="end" dominantBaseline="central"
                fontSize={fs} fontWeight="800" fill={sliceInk(s.color)} style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
                {short(s.entrant.name, many ? 12 : 16)}
              </text>
            )
          })}
        </g>
        {Array.from({ length: 24 }, (_, i) => { const [x, y] = pt(111, i * 15); return <circle key={i} cx={x} cy={y} r="2.6" className={`gw-bulb ${i % 2 ? 'b' : 'a'}`} /> })}
        <g className={onSpin ? 'gw-hub-btn' : undefined} onClick={onSpin} role={onSpin ? 'button' : undefined} aria-label={onSpin ? 'Spin' : undefined}>
          <circle r="24" fill="url(#gw-hub)" stroke="#2A1A0C" strokeWidth="2" />
          <text textAnchor="middle" dominantBaseline="central" fontSize="11" fontWeight="900" fill="#2A1A0C" letterSpacing="1">SPIN</text>
        </g>
        <path d="M0 -100 L-11 -124 L11 -124 Z" fill="#FFFFFF" stroke="#2A1A0C" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

/** Falling confetti for a winner. Pure CSS. */
export function Confetti({ seed }: { seed: string }) {
  const bits = useMemo(() => Array.from({ length: 46 }, (_, i) => ({
    left: (i * 37 + seed.length * 13) % 100, delay: ((i * 53) % 40) / 20, dur: 2.4 + ((i * 29) % 20) / 10, color: ['#FFD36E', '#FF7A59', '#E85D8E', '#22B074', '#8E3BB8', '#FFFFFF'][i % 6], rot: (i * 47) % 360,
  })), [seed])
  return (
    <div className="gw-confetti" aria-hidden="true">
      {bits.map((b, i) => <i key={i} style={{ left: `${b.left}%`, animationDelay: `${b.delay}s`, animationDuration: `${b.dur}s`, background: b.color, transform: `rotate(${b.rot}deg)` }} />)}
    </div>
  )
}

function fmt(ms: number) {
  const s = Math.ceil(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

type Props = {
  show: PublicShow
  /** Seller-clock to this-screen-clock difference (ms). 0 on the seller's own screen. */
  shift?: number
  variant: 'panel' | 'full' | 'overlay'
  sound?: boolean
  onSpin?: () => void
  onOpenBox?: (n: number) => void
}

/** What viewers see: the same on the seller's screen, full screen and the stream overlay. */
export default function GiveawayStage({ show, shift = 0, variant, sound, onSpin, onOpenBox }: Props) {
  const spin = show.wheel.spin
  const roll = show.number.roll
  const cd = show.countdown
  const spinning = show.game === 'wheel' && !!spin && Date.now() - (spin.at + shift) < SPIN_MS + 200
  const rolling = show.game === 'number' && !!roll && Date.now() - (roll.at + shift) < ROLL_MS + 200
  const counting = show.game === 'countdown' && !!cd.endsAt
  const now = useNow(spinning || rolling || counting || !!show.winner, rolling ? 60 : 200)

  const landed = !!spin && now - (spin.at + shift) >= SPIN_MS
  const spinWinner = spin && landed ? show.wheel.entrants.find(e => e.id === spin.winnerId) : undefined
  const total = totalSlots(show.wheel.entrants)

  const rollDone = !!roll && now - (roll.at + shift) >= ROLL_MS
  const lo = Math.min(show.number.min, show.number.max), hi = Math.max(show.number.min, show.number.max)
  const shown = !roll ? null : rollDone ? roll.value : lo + Math.floor(Math.random() * (hi - lo + 1))

  const left = cd.endsAt ? Math.max(0, cd.endsAt + shift - now) : cd.left
  const frac = cd.seconds > 0 ? Math.min(1, left / (cd.seconds * 1000)) : 0

  // A manual "we have a winner" banner wins over everything for 30 seconds after it's sent.
  const banner = show.winner && now - (show.winner.at + shift) < 30000 ? show.winner : null
  const auto = show.game === 'wheel' && spinWinner ? { name: spinWinner.name, detail: `${spinWinner.slots} slot${spinWinner.slots === 1 ? '' : 's'} · ${pct(spinWinner.slots, total)} chance`, key: spin!.id } : null
  const winner = banner ? { name: banner.name, detail: banner.detail, key: String(banner.at) } : auto

  return (
    <div className={`gw-stage gw-${variant} gw-game-${show.game}`}>
      <div className="gw-head">
        <span className="gw-badge">{show.game === 'wheel' ? '🎡' : show.game === 'number' ? '🎲' : show.game === 'countdown' ? '⏰' : '🎁'} GIVEAWAY</span>
        <b className="gw-title">{show.title || 'Giveaway time!'}</b>
        {show.prize && <span className="gw-prize">Prize: {show.prize}</span>}
      </div>

      {show.game === 'wheel' && (
        <div className="gw-body">
          <Wheel entrants={show.wheel.entrants} spin={spin} shift={shift} sound={sound} onSpin={onSpin} />
          <p className="gw-foot">{show.wheel.entrants.length ? `${show.wheel.entrants.length} in · ${total} slot${total === 1 ? '' : 's'}` : 'Add names to fill the wheel'}</p>
        </div>
      )}

      {show.game === 'number' && (
        <div className="gw-body">
          <div className={`gw-number ${rollDone ? 'done' : roll ? 'rolling' : ''}`} key={roll?.id}>{shown ?? '?'}</div>
          <p className="gw-foot">{rollDone ? 'Closest comment wins!' : `Pick a number from ${lo} to ${hi}`}</p>
        </div>
      )}

      {show.game === 'countdown' && (
        <div className="gw-body">
          <p className="gw-message">{cd.message}</p>
          <div className={`gw-timer ${left === 0 && cd.endsAt ? 'up' : left <= 10000 && cd.endsAt ? 'hurry' : ''}`}>
            <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" className="gw-timer-track" /><circle cx="60" cy="60" r="52" className="gw-timer-fill" style={{ strokeDasharray: 326.7, strokeDashoffset: 326.7 * (1 - frac) }} /></svg>
            <b>{left === 0 && cd.endsAt ? "Time's up!" : fmt(left)}</b>
          </div>
        </div>
      )}

      {show.game === 'boxes' && (
        <div className="gw-body">
          <div className={`gw-boxes n${Math.min(show.boxes.count, 16)}`}>
            {Array.from({ length: show.boxes.count }, (_, i) => {
              const n = String(i + 1), prize = show.boxes.opened[n]
              return (
                <button key={n} type="button" className={`gw-box ${prize ? 'open' : ''}`} disabled={!onOpenBox || !!prize} onClick={() => onOpenBox?.(i + 1)}>
                  {prize ? <><span className="gw-box-n">#{n}</span><b>{prize}</b></> : <><span className="gw-box-gift">🎁</span><b>{n}</b></>}
                </button>
              )
            })}
          </div>
          <p className="gw-foot">Comment a box number to pick it!</p>
        </div>
      )}

      {winner && (
        <Confetti key={`c${winner.key}`} seed={winner.key} />
      )}
      {winner && (
        <div className="gw-winner" key={winner.key} role="status">
          <span className="gw-winner-tag">🎉 WE HAVE A WINNER! 🎉</span>
          <b className="gw-winner-name">{winner.name}</b>
          {winner.detail && <span className="gw-winner-detail">{winner.detail}</span>}
        </div>
      )}
    </div>
  )
}
