/* Live giveaways: a spin wheel weighted by slots, a lucky number draw, a countdown and mystery boxes.
   The seller runs everything from /giveaways. The same "show" is pushed to Supabase so the private
   overlay link (the one already used for the product card) can pop it up on stream in Prism, OBS
   or Streamlabs. Setup lives on this device (localStorage); nothing here is secret. */
import { supabase } from './supabase'

export type Game = 'wheel' | 'number' | 'countdown' | 'boxes'
export const GAMES: { id: Game; name: string; emoji: string; blurb: string }[] = [
  { id: 'wheel', name: 'Spin the wheel', emoji: '🎡', blurb: 'More slots bought, bigger slice of the wheel.' },
  { id: 'number', name: 'Lucky number', emoji: '🎲', blurb: 'Draw a number. Closest comment wins.' },
  { id: 'countdown', name: 'Countdown', emoji: '⏰', blurb: 'A big timer for "comment to enter" or flash deals.' },
  { id: 'boxes', name: 'Mystery boxes', emoji: '🎁', blurb: 'Buyers call a box, you open it on screen.' },
]

export type Entrant = { id: string; name: string; slots: number }
/** One spin: who won, where on their slice the pointer stops (degrees from the top, clockwise), when it started. */
export type Spin = { id: string; winnerId: string; stop: number; turns: number; at: number }
export type Roll = { id: string; value: number; at: number }

export type Show = {
  game: Game
  /** Shown on stream (overlay link) when true. */
  visible: boolean
  /** Where the popup sits on the overlay. */
  spot: 'middle' | 'corner'
  title: string
  prize: string
  wheel: { entrants: Entrant[]; spin: Spin | null }
  number: { min: number; max: number; roll: Roll | null }
  /** endsAt while running; left (ms) while paused or before it starts. */
  countdown: { seconds: number; message: string; endsAt: number | null; left: number }
  /** prizes stay on this device; only opened boxes go to the overlay. */
  boxes: { count: number; prizes: string; deck: string[]; opened: Record<string, string> }
  /** A big "We have a winner!" banner. */
  winner: { name: string; detail: string; at: number } | null
}

export const SPIN_MS = 7000
export const ROLL_MS = 3200

export const blankShow = (): Show => ({
  game: 'wheel', visible: false, spot: 'middle', title: 'Giveaway time!', prize: '',
  wheel: { entrants: [], spin: null },
  number: { min: 1, max: 100, roll: null },
  countdown: { seconds: 120, message: 'Comment ENTER to get in!', endsAt: null, left: 120000 },
  boxes: { count: 9, prizes: 'Free bag\nFree shipping\n$10 off\nMystery jewelry\nTry again', deck: [], opened: {} },
  winner: null,
})

/** Bright, high-contrast slice colors that read well on a phone stream. */
export const WHEEL_COLORS = ['#FF7A59', '#FFD36E', '#E85D8E', '#22B074', '#8E3BB8', '#3FA9F5', '#F2A93B', '#E8455B', '#14B8A6', '#B565E0', '#FF9F1C', '#2DD4BF']
/** Dark text on light slices, white on dark ones. */
export const sliceInk = (color: string) => ['#FFD36E', '#F2A93B', '#FF9F1C', '#2DD4BF', '#3FA9F5', '#14B8A6'].includes(color) ? '#2A1A0C' : '#FFFFFF'

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4)

/** A fair random number in [0, 1), from the browser's secure random source. */
export function fairRandom() {
  const a = new Uint32Array(1)
  crypto.getRandomValues(a)
  return a[0] / 2 ** 32
}

export const totalSlots = (list: Entrant[]) => list.reduce((s, e) => s + Math.max(0, e.slots), 0)

/** Each person's slice: start and end angle in degrees, clockwise from the top. */
export function slices(list: Entrant[]) {
  const total = totalSlots(list)
  let at = 0
  return list.filter(e => e.slots > 0).map((e, i) => {
    const size = total ? (e.slots / total) * 360 : 0
    const s = { entrant: e, start: at, end: at + size, color: WHEEL_COLORS[i % WHEEL_COLORS.length] }
    at += size
    return s
  })
}

/** Weighted pick: 3 slots = 3 chances. Returns a spin that lands somewhere inside the winner's slice. */
export function makeSpin(list: Entrant[]): Spin | null {
  const parts = slices(list)
  if (!parts.length) return null
  const point = fairRandom() * 360
  const hit = parts.find(p => point >= p.start && point < p.end) ?? parts[parts.length - 1]
  // Keep the pointer off the very edge of a slice, so nobody squints at a line.
  const size = hit.end - hit.start
  const pad = Math.min(size * 0.15, 4)
  const stop = hit.start + pad + fairRandom() * Math.max(0, size - pad * 2)
  return { id: uid(), winnerId: hit.entrant.id, stop, turns: 6 + Math.floor(fairRandom() * 3), at: Date.now() }
}

export function makeRoll(min: number, max: number): Roll {
  const lo = Math.min(min, max), hi = Math.max(min, max)
  return { id: uid(), value: lo + Math.floor(fairRandom() * (hi - lo + 1)), at: Date.now() }
}

/** Shuffle the prize list into the boxes. Empty boxes say "Try again". */
export function dealBoxes(count: number, prizes: string): string[] {
  const list = prizes.split('\n').map(s => s.trim()).filter(Boolean)
  const deck = Array.from({ length: count }, (_, i) => list[i] ?? list[list.length - 1] ?? 'Try again')
  for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(fairRandom() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]] }
  return deck
}

/** Read a pasted list, one person per line: "Tasha 3", "Tasha, 3", "Tasha x3" or just "Tasha" (1 slot).
    The same name twice adds the slots together. */
export function parseEntrants(text: string, existing: Entrant[] = []): Entrant[] {
  const out = existing.map(e => ({ ...e }))
  for (const raw of text.split(/\n|;/)) {
    const line = raw.trim()
    if (!line) continue
    const m = line.match(/^(.+?)(?:\s*[,:\-–]\s*|\s+)(?:x|×)?\s*(\d+)\s*(?:slots?|spots?)?$/i)
    const name = (m ? m[1] : line).trim()
    const slots = m ? Math.max(1, Math.min(999, parseInt(m[2], 10))) : 1
    const same = out.find(e => e.name.toLowerCase() === name.toLowerCase())
    if (same) same.slots += slots
    else out.push({ id: uid(), name, slots })
  }
  return out
}

export const pct = (n: number, total: number) => total ? `${(Math.round((n / total) * 1000) / 10).toString()}%` : '0%'

/* ---------- Saving ---------- */
const KEY = 'dz-giveaway-show'
const WINNERS = 'dz-giveaway-winners'

export function loadShow(): Show {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const b = blankShow(), s = JSON.parse(raw)
      return { ...b, ...s, wheel: { ...b.wheel, ...s.wheel }, number: { ...b.number, ...s.number }, countdown: { ...b.countdown, ...s.countdown }, boxes: { ...b.boxes, ...s.boxes } }
    }
  } catch { /* start fresh */ }
  return blankShow()
}
export function saveShow(s: Show) { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* private window */ } }

export type WinnerLog = { name: string; game: string; prize: string; at: number }
export function loadWinners(): WinnerLog[] { try { return JSON.parse(localStorage.getItem(WINNERS) || '[]') } catch { return [] } }
export function saveWinners(list: WinnerLog[]) { try { localStorage.setItem(WINNERS, JSON.stringify(list.slice(0, 200))) } catch { /* private window */ } }

/** What the stream sees. The hidden box prizes never leave this device. */
export function publicShow(s: Show) {
  return { ...s, boxes: { count: s.boxes.count, opened: s.boxes.opened }, sent_at: Date.now() }
}
export type PublicShow = ReturnType<typeof publicShow> & { saved_at?: number; server_now?: number }

/** Send the show to the overlay link. Returns false if the database step (015) hasn't been run yet. */
export async function pushShow(s: Show): Promise<boolean> {
  const { error } = await supabase.rpc('set_giveaway', { p_state: publicShow(s) })
  return !error
}

/** Turn a time from the seller's clock into this screen's clock (they can be different devices). */
export function clockShift(p: PublicShow, receivedAt: number) {
  if (!p.saved_at || !p.server_now) return 0
  return (p.saved_at - p.sent_at) - (p.server_now - receivedAt)
}

/* ---------- Sounds (a bonus: a soft tick while spinning, a fanfare for the winner) ---------- */
let ctx: AudioContext | null = null
function audio() {
  try {
    const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext
    ctx = ctx ?? new Ctx()
    return ctx
  } catch { return null }
}
export function tick() {
  const c = audio(); if (!c) return
  const o = c.createOscillator(), g = c.createGain(), t = c.currentTime
  o.type = 'triangle'; o.frequency.value = 1400
  g.gain.setValueAtTime(0.12, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.06)
}
export function fanfare() {
  const c = audio(); if (!c) return
  const notes = [523, 659, 784, 1047, 784, 1047]
  notes.forEach((f, i) => {
    const o = c.createOscillator(), g = c.createGain(), t = c.currentTime + i * 0.13
    o.type = 'square'; o.frequency.value = f
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + (i === notes.length - 1 ? 0.6 : 0.14))
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + 0.7)
  })
  navigator.vibrate?.([120, 60, 120])
}
