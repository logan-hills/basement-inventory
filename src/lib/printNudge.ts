/* Print alignment ("nudge"). Some thermal printers, like the Core Innovations and Nelko 4 inch printers,
   place a small roll (2×1) a few millimeters off center, or start each label a hair high or low.
   The seller nudges the print once per label size and the app remembers it on this device.
   Saved in millimeters, per page size like "2x1" or "4x4". */

export type Nudge = { x: number; y: number }
const KEY = 'printNudge'
export const NUDGE_LIMIT = 6

export const sizeKey = (w: number, h: number) => `${+w.toFixed(2)}x${+h.toFixed(2)}`

let mem: Record<string, Nudge> = {}
function all(): Record<string, Nudge> {
  try { return { ...mem, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return mem }
}

export function getNudge(key: string): Nudge {
  const n = all()[key]
  return n && Number.isFinite(n.x) && Number.isFinite(n.y) ? n : { x: 0, y: 0 }
}

export function setNudge(key: string, n: Nudge) {
  const clamp = (v: number) => Math.max(-NUDGE_LIMIT, Math.min(NUDGE_LIMIT, Math.round(v * 2) / 2))
  const next = { ...all(), [key]: { x: clamp(n.x), y: clamp(n.y) } }
  mem = next
  try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* private mode: the nudge lasts this visit */ }
  window.dispatchEvent(new Event('print-nudge'))
}

/** CSS that shifts what's printed inside each label by the saved nudge. Only affects printing, never the screen.
    Uses the `translate` property, so it stacks with the turn on landscape labels, and the page size never changes. */
export const nudgeCss = (n: Nudge) =>
  n.x || n.y ? `@media print { .print-area .sheet > * { translate: ${n.x}mm ${n.y}mm; } }` : ''
