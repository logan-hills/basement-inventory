/* Nova's motion: one smooth animation loop instead of CSS clips.
   Every frame we work out her pose from three things added together:
   1. Idle life: a slow float, breathing, a gentle sway, leaning toward your pointer.
   2. Moves (jump, spin, dance...): each is a smooth curve over time that starts and ends at rest,
      so a move grows out of her idle motion and melts back into it. A new move crossfades over
      the old one instead of snapping.
   3. Follow-through: her bow, her arm with the little bag and her shades hang on springs, so they
      flop, lag and settle on their own when her body moves (squash, stretch, overshoot).
   All numbers are in the art's own space (610 x 740), degrees for angles. */
import type { Face } from './novaArt'

export type NovaMove = 'jump' | 'spin' | 'curtsy' | 'kaching' | 'dance' | 'shimmy' | 'wave' | 'hop'

/** Offsets from her resting pose. sx/sy are added to a scale of 1; turn 1 = one full spin. */
export type Pose = { x: number; y: number; rot: number; sx: number; sy: number; turn: number; bow: number; arm: number; gx: number; gy: number }
export const ZERO: Pose = { x: 0, y: 0, rot: 0, sx: 0, sy: 0, turn: 0, bow: 0, arm: 0, gx: 0, gy: 0 }

// Little curve helpers. All return 0..1 and have smooth (zero-speed) ends.
const clamp01 = (v: number) => v < 0 ? 0 : v > 1 ? 1 : v
/** Smooth ramp from 0 at a to 1 at b. */
export const ramp = (t: number, a: number, b: number) => { const u = clamp01((t - a) / (b - a)); return u * u * u * (u * (u * 6 - 15) + 10) }
/** A smooth hump: 0 at a, 1 in the middle, 0 at b. */
export const hump = (t: number, a: number, b: number) => { const u = clamp01((t - a) / (b - a)); const s = Math.sin(Math.PI * u); return s * s }
/** Up at a..b, held, down at c..d. */
const hold = (t: number, a: number, b: number, c: number, d: number) => ramp(t, a, b) * (1 - ramp(t, c, d))
/** A jump arc: 0 at a, 1 at the top, 0 at b (a real parabola, so the hang time feels right). */
const arc = (t: number, a: number, b: number) => { const u = clamp01((t - a) / (b - a)); return 4 * u * (1 - u) }
const TAU = Math.PI * 2

type MoveDef = { ms: number; pose: (t: number, p: Pose, dir: number) => void; faces?: [number, Face][] }

/** Crouch before a jump and squash on landing, in one helper. */
function squash(p: Pose, amt: number) { p.sy -= 0.12 * amt; p.sx += 0.09 * amt; p.y += 14 * amt }
function stretch(p: Pose, amt: number) { p.sy += 0.08 * amt; p.sx -= 0.05 * amt }

/** The dance groove: sway side to side and bounce on every beat. */
function groove(t: number, p: Pose, w: number, beat: number) {
  const f = t / beat
  const bounce = (Math.cos(TAU * f) + 1) / 2 // 1 on every beat
  p.x += w * 30 * Math.sin(Math.PI * f)
  p.rot += w * -7 * Math.sin(Math.PI * f + 0.5) // her lean trails her hips a touch
  p.y += w * 13 * bounce
  p.sy -= w * 0.06 * bounce; p.sx += w * 0.04 * bounce
  p.arm += w * 20 * Math.sin(Math.PI * f + 1.1)
}
/** A fast shoulder shimmy. */
function shimmy(t: number, p: Pose, w: number) {
  p.x += w * 9 * Math.sin(TAU * 7 * t)
  p.rot += w * 2.5 * Math.sin(TAU * 7 * t + 1)
  p.arm += w * 10 * Math.sin(TAU * 3.5 * t)
  p.y += w * (8 + 4 * Math.sin(TAU * 3.5 * t))
  p.sy -= w * 0.03
}

export const MOVES: Record<NovaMove, MoveDef> = {
  hop: { ms: 620, pose: (t, p) => {
    squash(p, hump(t, 0, 0.14) + 0.7 * hump(t, 0.44, 0.62))
    p.y -= 46 * arc(t, 0.1, 0.48); stretch(p, hump(t, 0.1, 0.3))
  } },
  jump: { ms: 1050, pose: (t, p) => {
    squash(p, hump(t, 0, 0.24) + 0.9 * hump(t, 0.72, 0.98))
    p.y -= 140 * arc(t, 0.18, 0.78)
    stretch(p, hump(t, 0.16, 0.42) + 0.6 * hump(t, 0.56, 0.78))
    p.arm += 22 * hump(t, 0.12, 0.85)
    p.rot += 3 * Math.sin(TAU * t / 1.05) * hump(t, 0.2, 0.8)
  } },
  spin: { ms: 1150, pose: (t, p, dir) => {
    squash(p, 0.7 * hump(t, 0, 0.16) + 0.7 * hump(t, 0.88, 1.15))
    p.y -= 42 * arc(t, 0.1, 0.92)
    p.turn += dir * ramp(t, 0.1, 0.9)
    p.rot += dir * 6 * hump(t, 0.05, 1.0)
    p.x += dir * 18 * hump(t, 0.05, 1.1)
  } },
  curtsy: { ms: 1700, pose: (t, p) => {
    const d = hold(t, 0.05, 0.5, 1.05, 1.6)
    p.y += 36 * d; p.rot -= 8 * d; p.sy -= 0.07 * d; p.sx += 0.03 * d
    p.arm += 16 * d; p.gy += 10 * d
  }, faces: [[0, 'smile'], [0.45, 'wink'], [1.3, 'smile']] },
  kaching: { ms: 2100, pose: (t, p) => {
    // Wind up, double spin in the air, land, strike the pose, relax.
    const wind = hump(t, 0, 0.3)
    p.rot += 8 * wind; squash(p, 0.8 * wind)
    p.y -= 62 * arc(t, 0.2, 0.98)
    p.turn += 2 * ramp(t, 0.22, 0.95)
    stretch(p, hump(t, 0.2, 0.5))
    squash(p, hump(t, 0.92, 1.12))
    const pose = hold(t, 1.0, 1.15, 1.75, 2.1)
    p.rot -= 7 * pose; p.sx += 0.06 * pose; p.sy += 0.06 * pose; p.gy += 6 * pose
  }, faces: [[0, 'smile'], [1.05, 'sassy'], [1.8, 'smile']] },
  wave: { ms: 1500, pose: (t, p) => {
    // A swing that starts big and settles, like a real wave of a bag.
    p.arm += 24 * Math.exp(-2.2 * t) * Math.sin(TAU * 1.7 * t) * ramp(t, 0, 0.1) * (1 - ramp(t, 1.2, 1.5))
    p.rot += 2 * hump(t, 0, 1.4)
  } },
  shimmy: { ms: 1500, pose: (t, p) => {
    const w = hold(t, 0, 0.2, 1.2, 1.5)
    shimmy(t, p, w)
  }, faces: [[0, 'sassy'], [1.25, 'wink']] },
  dance: { ms: 4600, pose: (t, p, dir) => {
    const beat = 0.5
    // Four beats of groove, a shimmy, a twirl with a hop, then the pose.
    groove(t, p, hold(t, 0, 0.3, 1.8, 2.15), beat)
    shimmy(t, p, hold(t, 1.85, 2.15, 2.85, 3.1))
    squash(p, 0.8 * hump(t, 2.95, 3.15) + 0.8 * hump(t, 3.72, 3.95))
    p.y -= 56 * arc(t, 3.08, 3.8)
    p.turn += dir * ramp(t, 3.08, 3.78)
    stretch(p, hump(t, 3.08, 3.35))
    const pose = hold(t, 3.8, 4.0, 4.25, 4.6)
    p.rot -= 7 * pose; p.x -= 10 * pose; p.sx += 0.05 * pose; p.sy += 0.05 * pose; p.gy += 14 * pose; p.arm += 12 * pose
  }, faces: [[0, 'smile'], [1.85, 'sassy'], [3.0, 'smile'], [3.85, 'wink']] },
}

/** A damped spring: lags behind, overshoots a little, settles. */
export class Spring {
  v = 0; x = 0; k: number; c: number; lim: number
  constructor(k: number, c: number, lim: number) { this.k = k; this.c = c; this.lim = lim }
  step(target: number, force: number, dt: number) {
    const a = -this.k * (this.x - target) - this.c * this.v + force
    this.v += a * dt; this.x += this.v * dt
    if (this.x > this.lim) { this.x = this.lim; this.v = Math.min(this.v, 0) }
    if (this.x < -this.lim) { this.x = -this.lim; this.v = Math.max(this.v, 0) }
    return this.x
  }
  kick(v: number) { this.v += v }
}

/** Her idle life: float, breathe, sway. `t` in seconds. */
export function idle(t: number, p: Pose) {
  const f = TAU * t / 3.6
  p.y -= 10 * (Math.sin(f) + 1) / 2
  p.sy += 0.014 * Math.sin(f + Math.PI / 2); p.sx -= 0.008 * Math.sin(f + Math.PI / 2)
  p.rot += 1.4 * Math.sin(TAU * t / 5.3)
  p.arm += 2.5 * Math.sin(TAU * t / 4.2)
  p.bow += 2.5 * Math.sin(TAU * t / 3.2)
}

/** The talking mouth: an organic open-close, never exactly repeating. 0 = shut, 1 = wide. */
export const talk = (t: number) => clamp01(0.5 + 0.5 * Math.sin(TAU * 4.3 * t) * (0.6 + 0.4 * Math.sin(TAU * 1.3 * t + 1)))

/** How shut her eyes are during a blink that started `t` seconds ago (0 open, 1 shut). */
export const blinkAmount = (t: number) => t < 0 || t > 0.2 ? 0 : t < 0.07 ? ramp(t, 0, 0.07) : 1 - ramp(t, 0.09, 0.2)
