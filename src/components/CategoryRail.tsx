import type { ReactElement } from 'react'
/* Category art. `artFor` (gold line art) is used on sign-in; the rail below uses bright "pop" tiles. */

type Art = { tone: string; draw: ReactElement }

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const ART: Record<string, Art> = {
  jewelry: { tone: 'emerald', draw: <g {...S}><path d="M50 10 C30 10 22 34 32 52" /><path d="M50 10 C70 10 78 34 68 52" /><circle cx="32" cy="62" r="10" /><circle cx="68" cy="62" r="10" /><path d="M41 20 Q50 44 59 20" /><path d="M50 40 l5 7 -5 9 -5 -9 z" /><circle cx="32" cy="62" r="4" opacity=".6" /><circle cx="68" cy="62" r="4" opacity=".6" /></g> },
  bags: { tone: 'garnet', draw: <g {...S}><path d="M34 36 C34 14 66 14 66 36" /><path d="M22 36 H78 L84 82 Q84 88 78 88 H22 Q16 88 16 82 Z" /><path d="M20 36 H80 L77 48 Q50 58 23 48 Z" /><path d="M46 52 l2 2 2-3 2 3 2-2 -1 5 h-6 z" /><path d="M22 80 H78" strokeDasharray="2 3" opacity=".6" /></g> },
  apparel: { tone: 'violet', draw: <g {...S}><path d="M50 8 a5 5 0 1 1 5 5 v4" /><path d="M24 26 L50 17 L76 26" /><path d="M40 24 C42 32 58 32 60 24" /><path d="M40 24 L36 46 L22 88 H78 L64 46 L60 24" /><path d="M36 46 H64" /><path d="M30 70 Q50 76 70 70" opacity=".6" /></g> },
  accessories: { tone: 'onyx', draw: <g {...S}><path d="M10 46 H90" /><path d="M14 46 Q14 66 30 66 Q44 66 44 50 V46" /><path d="M56 46 V50 Q56 66 70 66 Q86 66 86 46" /><path d="M44 50 Q50 44 56 50" /><path d="M20 52 l8 -4" opacity=".6" /><path d="M62 52 l8 -4" opacity=".6" /><path d="M30 24 l3 6 6 3 -6 3 -3 6 -3 -6 -6 -3 6 -3z" opacity=".8" /></g> },
  shoes: { tone: 'cognac', draw: <g {...S}><path d="M14 70 C30 70 44 58 54 44 C58 40 64 40 66 46 L70 60 C74 66 82 68 88 70 Q90 76 84 78 H22 Q14 78 14 70 Z" /><path d="M66 46 L80 42 L82 78" /><path d="M24 74 H78" opacity=".5" strokeDasharray="2 3" /><circle cx="58" cy="52" r="2" /></g> },
  home: { tone: 'champagne', draw: <g {...S}><path d="M36 40 H64 V84 Q64 88 60 88 H40 Q36 88 36 84 Z" /><path d="M50 40 V32" /><path d="M50 30 C44 24 48 16 50 12 C52 16 56 24 50 30 Z" /><path d="M36 52 H64" opacity=".6" /><path d="M42 64 q8 6 16 0" opacity=".6" /></g> },
  beauty: { tone: 'garnet', draw: <g {...S}><rect x="40" y="48" width="20" height="40" rx="3" /><path d="M42 48 V36 H58 V48" /><path d="M44 36 V24 L56 18 V36" /><path d="M40 62 H60" opacity=".6" /></g> },
}

const ALIASES: [RegExp, string][] = [
  [/jewel|earring|necklace|ring|bracelet/i, 'jewelry'], [/bag|purse|tote|clutch/i, 'bags'],
  [/apparel|cloth|dress|top|shirt|wear|fashion/i, 'apparel'], [/access|sunglass|hat|scarf|belt|wig/i, 'accessories'],
  [/shoe|heel|boot|sneaker|sandal/i, 'shoes'], [/home|decor|candle|kitchen/i, 'home'], [/beauty|makeup|lip|skin|fragrance|perfume/i, 'beauty'],
]
const TONES = ['emerald', 'garnet', 'violet', 'onyx', 'cognac', 'champagne']

export function artFor(cat: string, i = 0): Art {
  const key = ALIASES.find(([re]) => re.test(cat))?.[1]
  if (key) return ART[key]
  const letter = (cat.trim()[0] ?? '?').toUpperCase()
  return { tone: TONES[i % TONES.length], draw: <g {...S}><path d="M50 12 L80 24 V52 C80 70 66 82 50 88 C34 82 20 70 20 52 V24 Z" /><path d="M50 18 L74 28 V52 C74 66 63 76 50 81" opacity=".5" /><text x="50" y="60" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="30" fontStyle="italic" fill="currentColor" stroke="none">{letter}</text></g> }
}

export type CatStat = { name: string; pieces: number; value?: number; photo?: string | null }

/* ===== Bright "pop" tiles: candy gradients, chunky white icons, floating bubbles. ===== */
const W = '#fff'
const POP: Record<string, { tone: string; icon: ReactElement }> = {
  all: { tone: 'sun', icon: <g><path d="M16 66 L22 32 L38 48 L50 22 L62 48 L78 32 L84 66 Z" fill={W} /><rect x="16" y="70" width="68" height="10" rx="5" fill={W} /><circle cx="22" cy="30" r="6" fill={W} /><circle cx="50" cy="19" r="7" fill={W} /><circle cx="78" cy="30" r="6" fill={W} /><circle cx="50" cy="56" r="6" fill="var(--ink)" /><circle cx="33" cy="60" r="4" fill="var(--ink)" opacity=".7" /><circle cx="67" cy="60" r="4" fill="var(--ink)" opacity=".7" /></g> },
  jewelry: { tone: 'pink', icon: <g><circle cx="50" cy="62" r="24" fill="none" stroke={W} strokeWidth="9" /><path d="M36 30 L42 18 H58 L64 30 L50 46 Z" fill={W} /><path d="M36 30 H64 M44 18 L50 30 L56 18 M50 30 V46" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" fill="none" opacity=".55" /><circle cx="76" cy="20" r="3" fill={W} /><circle cx="22" cy="40" r="2.5" fill={W} /></g> },
  bags: { tone: 'coral', icon: <g><path d="M34 40 C34 18 66 18 66 40" fill="none" stroke={W} strokeWidth="7" strokeLinecap="round" /><path d="M18 40 H82 L86 80 Q86 88 78 88 H22 Q14 88 14 80 Z" fill={W} /><path d="M18 40 H82 L80 52 Q50 62 20 52 Z" fill="var(--ink)" opacity=".25" /><rect x="44" y="50" width="12" height="10" rx="3" fill="var(--ink)" /></g> },
  apparel: { tone: 'violet', icon: <g><path d="M38 14 L50 22 L62 14 L66 34 L60 40 L80 86 H20 L40 40 L34 34 Z" fill={W} /><path d="M40 40 H60" stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" /><path d="M28 70 Q50 78 72 70" stroke="var(--ink)" strokeWidth="3" fill="none" opacity=".5" /><circle cx="50" cy="54" r="3" fill="var(--ink)" opacity=".6" /></g> },
  accessories: { tone: 'aqua', icon: <g><path d="M8 40 H92" stroke={W} strokeWidth="6" strokeLinecap="round" /><path d="M12 40 H44 V50 Q44 68 28 68 Q12 68 12 50 Z" fill={W} /><path d="M56 40 H88 V50 Q88 68 72 68 Q56 68 56 50 Z" fill={W} /><path d="M20 46 L30 44 M64 46 L74 44" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" opacity=".5" /><path d="M76 14 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill={W} /></g> },
  shoes: { tone: 'lime', icon: <g><path d="M12 76 C30 74 42 62 52 46 C56 40 64 40 66 48 L70 62 C74 68 84 70 90 72 Q92 82 84 82 H20 Q12 82 12 76 Z" fill={W} /><path d="M66 48 L82 44 L84 82" stroke={W} strokeWidth="6" strokeLinejoin="round" fill="none" /><circle cx="58" cy="54" r="4" fill="var(--ink)" /><path d="M18 22 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill={W} /></g> },
  home: { tone: 'sky', icon: <g><path d="M50 14 L88 44 H78 V84 H22 V44 H12 Z" fill={W} strokeLinejoin="round" /><path d="M42 84 V62 Q50 54 58 62 V84 Z" fill="var(--ink)" /><path d="M50 30 C46 34 47 40 50 42 C53 40 54 34 50 30 Z" fill="var(--ink)" opacity=".6" /></g> },
  beauty: { tone: 'rose', icon: <g><rect x="36" y="50" width="28" height="38" rx="5" fill={W} /><path d="M40 50 V34 Q40 30 44 30 H56 Q60 30 60 34 V50" fill={W} opacity=".85" /><path d="M44 30 V18 L56 12 V30 Z" fill="var(--ink)" /><path d="M36 64 H64" stroke="var(--ink)" strokeWidth="3" opacity=".4" /></g> },
}
const POP_TONES = ['pink', 'aqua', 'coral', 'violet', 'lime', 'sky', 'sun', 'rose']

function popFor(cat: string, i: number) {
  const key = ALIASES.find(([re]) => re.test(cat))?.[1]
  if (key && POP[key]) return POP[key]
  const letter = (cat.trim()[0] ?? '?').toUpperCase()
  return { tone: POP_TONES[i % POP_TONES.length], icon: <g><circle cx="50" cy="50" r="34" fill={W} /><text x="50" y="62" textAnchor="middle" fontFamily="Inter, system-ui, sans-serif" fontWeight="900" fontSize="36" fill="var(--ink)">{letter}</text></g> }
}

/** Shop-by-category tiles: bright, bubbly and easy to tap. Tap again to go back to everything. */
export default function CategoryRail({ cats, active, onPick, money, allLabel = 'Everything', compact }: { cats: CatStat[]; active: string; onPick: (c: string) => void; money?: (n: number) => string; allLabel?: string; /** Slim one-line tiles on phones, so the list shows sooner. */ compact?: boolean }) {
  const total = cats.reduce((s, c) => s + c.pieces, 0)
  const tile = (key: string, name: string, tone: string, icon: ReactElement, meta: string, sub: string, on: boolean, empty: boolean, pickValue: string) => (
    <button key={key} className={`pop-tile pop-${tone}${on ? ' on' : ''}${empty ? ' empty' : ''}`} onClick={() => onPick(pickValue)} aria-pressed={on}>
      <span className="pop-bubbles" aria-hidden="true"><i /><i /><i /></span>
      <span className="pop-icon" aria-hidden="true"><svg viewBox="0 0 100 100">{icon}</svg></span>
      <span className="pop-name">{name}</span>
      <span className="pop-meta">{meta}</span>
      {sub && <span className="pop-sub">{sub}</span>}
      {on && <span className="pop-check" aria-hidden="true">✓</span>}
    </button>
  )
  return (
    <div className={`pop-rail${compact ? ' compact' : ''}`} role="group" aria-label="Shop by category">
      {tile('__all', allLabel, POP.all.tone, POP.all.icon, `${total.toLocaleString()} pieces`, '', active === '', false, '')}
      {cats.map((c, i) => {
        const a = popFor(c.name, i)
        return tile(c.name, c.name, a.tone, a.icon, c.pieces ? `${c.pieces.toLocaleString()} pieces` : 'Coming soon',
          c.pieces && c.value != null && money ? money(c.value) : '', active === c.name, !c.pieces, active === c.name ? '' : c.name)
      })}
    </div>
  )
}
