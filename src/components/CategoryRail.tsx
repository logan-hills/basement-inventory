import type { ReactElement } from 'react'
/* Category tiles: jewel-toned boutique cards with hand-drawn gold line art.
   Each category gets its own drawing and tone; unknown categories get a monogram crest. */

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

export type CatStat = { name: string; pieces: number; value?: number }

export default function CategoryRail({ cats, active, onPick, money, allLabel = 'Everything' }: { cats: CatStat[]; active: string; onPick: (c: string) => void; money?: (n: number) => string; allLabel?: string }) {
  const total = cats.reduce((s, c) => s + c.pieces, 0)
  return (
    <div className="cat-rail" role="group" aria-label="Shop by category">
      <button className={`cat-tile tone-all${active === '' ? ' on' : ''}`} onClick={() => onPick('')} aria-pressed={active === ''}>
        <span className="cat-no">The Collection</span>
        <span className="cat-art all-art" aria-hidden="true"><svg viewBox="0 0 100 100"><g {...S}><path d="M18 62 l10 -24 14 16 8 -28 8 28 14 -16 10 24 z" /><path d="M18 70 H82" /></g></svg></span>
        <span className="cat-name">{allLabel}</span>
        <span className="cat-meta">{total.toLocaleString()} pieces</span>
      </button>
      {cats.map((c, i) => {
        const a = artFor(c.name, i)
        return (
          <button key={c.name} className={`cat-tile tone-${a.tone}${active === c.name ? ' on' : ''}${c.pieces ? '' : ' empty'}`} onClick={() => onPick(active === c.name ? '' : c.name)} aria-pressed={active === c.name}>
            <span className="cat-no">No. {String(i + 1).padStart(2, '0')}</span>
            <span className="cat-art" aria-hidden="true"><svg viewBox="0 0 100 100">{a.draw}</svg></span>
            <span className="cat-name">{c.name}</span>
            <span className="cat-meta">{c.pieces ? `${c.pieces.toLocaleString()} on the shelf${c.value != null && money ? ` · ${money(c.value)}` : ''}` : 'Nothing in stock yet'}</span>
          </button>
        )
      })}
    </div>
  )
}
