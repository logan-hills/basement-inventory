import { supabase } from './supabase'

export type Phase = 'before' | 'during' | 'after'
export type Inspo = { id: string; kind: 'image' | 'link' | 'note'; path?: string; url?: string; text?: string }
export type Segment = { id: string; time: string; title: string }
export type Poster = {
  template: 'glow' | 'block' | 'regal'
  palette: number
  size: 'portrait' | 'square' | 'story'
  kicker: string
  headline: string
  when: string
  tagline: string
  footer: string
  photo?: string | null
}
export type Plan = {
  vibe?: string
  colors?: string[]
  ideas?: string
  giveaway?: string
  outfit?: string
  music?: string
  segments?: Segment[]
  inspiration?: Inspo[]
  checked?: Record<string, boolean>
  extra?: { phase: Phase; text: string }[]
  poster?: Partial<Poster>
}

export async function savePlan(liveId: string, plan: Plan) {
  const { error } = await supabase.from('lives').update({ plan }).eq('id', liveId)
  if (error) throw error
}

export const uid = () => Math.random().toString(36).slice(2, 10)

/** Every checklist step for a live: the shop's standard steps plus any extras added just for it. */
export function steps(standard: Record<Phase, string[]>, plan: Plan) {
  const out: { phase: Phase; text: string; extra: boolean }[] = []
  for (const phase of ['before', 'during', 'after'] as Phase[]) {
    standard[phase].forEach(text => out.push({ phase, text, extra: false }))
    ;(plan.extra ?? []).filter(e => e.phase === phase).forEach(e => out.push({ phase, text: e.text, extra: true }))
  }
  return out
}
export const stepKey = (phase: Phase, text: string) => `${phase}:${text}`

export function progress(standard: Record<Phase, string[]>, plan: Plan) {
  const all = steps(standard, plan)
  const done = all.filter(s => plan.checked?.[stepKey(s.phase, s.text)]).length
  return { done, total: all.length, pct: all.length ? done / all.length : 0 }
}

/** Poster palettes: [background A, background B, accent, ink]. */
export const PALETTES: { name: string; c: [string, string, string, string] }[] = [
  { name: 'Golden Hour', c: ['#FF7A59', '#8E3BB8', '#FFD36E', '#FFFFFF'] },
  { name: 'Emerald Crown', c: ['#0E7A47', '#06301D', '#F2C14E', '#FFF8EA'] },
  { name: 'Rose Gold', c: ['#F7C6C7', '#E58F9E', '#7A2E3A', '#3B141B'] },
  { name: 'Midnight Glam', c: ['#121212', '#2B2118', '#E2BE5A', '#F7EEDC'] },
  { name: 'Sunflower', c: ['#FFC83D', '#FF8F3D', '#1F1A14', '#1F1A14'] },
  { name: 'Berry Pop', c: ['#C2185B', '#5E1B7A', '#FFD36E', '#FFFFFF'] },
]

export const POSTER_SIZES = { portrait: { w: 1080, h: 1350, label: 'Facebook / Instagram post (4:5)' }, square: { w: 1080, h: 1080, label: 'Square post' }, story: { w: 1080, h: 1920, label: 'Story (9:16)' } }

/** Starter ideas for themes. Each comes with a vibe, palette and a few hooks. */
export const IDEA_BANK: { title: string; vibe: string; palette: number; hooks: string[] }[] = [
  { title: '$2 Tuesday', vibe: 'Fast, fun, everything two dollars', palette: 4, hooks: ['Speed round: 30 seconds per piece', 'Bundle 5 for $8', 'First 10 buyers get a surprise gift'] },
  { title: 'Holiday Glam', vibe: 'Sparkle, sequins and party-ready pieces', palette: 3, hooks: ['Style three looks from the same dress', 'Gift-wrap upgrade for $1', '12 Days of Deals countdown'] },
  { title: "Queen's Picks", vibe: 'The host\'s personal favorites of the week', palette: 1, hooks: ['Tell the story behind each find', 'Viewers vote on the next piece', 'One "crown jewel" saved for last'] },
  { title: 'Bag Bonanza', vibe: 'Totes, crossbodies and clutches', palette: 5, hooks: ['What\'s in my bag game', 'Bag + jewelry bundle price', 'Mystery bag at the end'] },
  { title: 'Jewelry Night', vibe: 'Stack, layer and shine', palette: 3, hooks: ['Build a stack challenge', 'Earring try-on close-ups', 'Buy 3, pick a free ring'] },
  { title: 'Self-Care Sunday', vibe: 'Cozy, soft and treat-yourself', palette: 2, hooks: ['Lounge sets and cozy knits first', 'Affirmation of the night', 'Calm music and candles on set'] },
  { title: 'Customer Appreciation Night', vibe: 'Thank you to the regulars', palette: 0, hooks: ['Shout out top buyers by name', 'Loyalty giveaway draw', 'Free shipping for repeat buyers'] },
  { title: 'Mystery Bag Madness', vibe: 'Surprise bundles, big reveals', palette: 5, hooks: ['Open one bag live to show value', 'Tiered bags: $10, $20, $30', 'Golden ticket hidden in one bag'] },
  { title: 'Clearance Blowout', vibe: 'Oldest stock, lowest prices', palette: 4, hooks: ['Price drops every 10 minutes', 'Fill-a-box flat price', 'Last call countdown'] },
  { title: 'Juneteenth Celebration', vibe: 'Honor, celebrate and support Black-owned', palette: 1, hooks: ['Spotlight Black-owned brands in your stock', 'Share what freedom means to you', 'Donate a portion to a local cause'] },
  { title: "Valentine's Treat Yourself", vibe: 'Reds, pinks and self-love', palette: 2, hooks: ['Galentine\'s bundles', 'Love-note with every order', 'Matching sets for you and your bestie'] },
  { title: 'Back to School Fits', vibe: 'Fresh looks for kids, teens and teachers', palette: 1, hooks: ['Outfit of the day builds', 'Teacher appreciation picks', 'Backpack + accessory bundles'] },
  { title: 'Spring Refresh', vibe: 'Bright colors and new arrivals', palette: 0, hooks: ['Closet clean-out tips', 'Color of the season spotlight', 'Swap a piece, save a dollar'] },
  { title: "Mother's Day Gifts", vibe: 'Gifts for the queens who raised us', palette: 2, hooks: ['Gift picks by budget', 'Tell us about your mom in the comments', 'Free gift note card'] },
  { title: 'Black Friday Doorbusters', vibe: 'The biggest deals of the year', palette: 3, hooks: ['Doorbuster every 15 minutes', 'Spin the wheel discounts', 'Early-bird bonus for the first 50 viewers'] },
  { title: 'Summer Brunch Fits', vibe: 'Sundresses, sandals and sunshine', palette: 4, hooks: ['Style a brunch look under $20', 'Mimosa-hour flash deals', 'Hat and shades bundles'] },
]

export const ENGAGEMENT_IDEAS = [
  'First to comment "SOLD" on the opening piece gets $1 off',
  'Guess the price: closest guess wins the piece',
  'Spin the wheel for a mystery discount',
  'Share the live, comment "SHARED", enter the giveaway',
  'Trivia break: right answer wins free shipping',
  'Viewers vote between two pieces, the winner goes up next',
  'Shout out everyone celebrating a birthday this week',
  'Hide a "golden ticket" in one order',
]

export const INSPIRATION = [
  'Small shop, big crown. Every box you pack is a promise kept.',
  'You don\'t need a big warehouse to build a big dream.',
  'Show up, sparkle, sell out. Repeat.',
  'Your customers are your community. Treat every comment like a hug.',
  'Consistency is the real flex. Same time, every week.',
  'Every piece has a story. Tell it.',
  'Build the business your grandmother would brag about.',
  'Rest is part of the hustle, Queen.',
  'One live at a time, one box at a time, one dream at a time.',
  'Your light is somebody\'s inspiration tonight.',
]

export const inspirationOfTheDay = () => INSPIRATION[Math.floor(Date.now() / 864e5) % INSPIRATION.length]
