import { supabase } from './supabase'

export type Phase = 'before' | 'during' | 'after'
export type Inspo = { id: string; kind: 'image' | 'link' | 'note'; path?: string; url?: string; text?: string }
export type Segment = { id: string; time: string; title: string }
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

/** Poster palettes: [background A, background B, accent, ink]. Keep the order: saved posters point at these by number. */
export const PALETTES: { name: string; c: [string, string, string, string] }[] = [
  { name: 'Golden Hour', c: ['#FF7A59', '#8E3BB8', '#FFD36E', '#FFFFFF'] },
  { name: 'Emerald Crown', c: ['#0E7A47', '#06301D', '#F2C14E', '#FFF8EA'] },
  { name: 'Rose Gold', c: ['#F7C6C7', '#E58F9E', '#7A2E3A', '#3B141B'] },
  { name: 'Midnight Glam', c: ['#121212', '#2B2118', '#E2BE5A', '#F7EEDC'] },
  { name: 'Sunflower', c: ['#FFC83D', '#FF8F3D', '#1F1A14', '#1F1A14'] },
  { name: 'Berry Pop', c: ['#C2185B', '#5E1B7A', '#FFD36E', '#FFFFFF'] },
  { name: 'Champagne Noir', c: ['#1C1915', '#3A2F23', '#E9CF8F', '#F8F1E2'] },
  { name: 'Ivory Pearl', c: ['#FBF6EE', '#EADFCB', '#A9834B', '#2B2420'] },
  { name: 'Sapphire Night', c: ['#0E1B3D', '#1F3A7A', '#D9B76A', '#F4F1EA'] },
  { name: 'Burgundy Velvet', c: ['#6A1024', '#2A0710', '#E7C27D', '#FCEFE3'] },
  { name: 'Blush Marble', c: ['#F8EAE6', '#E9CFC9', '#A8707C', '#3A2328'] },
  { name: 'Onyx Emerald', c: ['#06140E', '#0B3B27', '#D4AF37', '#F3EBD8'] },
  { name: 'Lavender Haze', c: ['#D6C4F2', '#8A68C9', '#4A2A86', '#21163A'] },
  { name: 'Ocean Pearl', c: ['#0E5E6F', '#073B4C', '#F6D7A7', '#FFFFFF'] },
  { name: 'Pumpkin Spice', c: ['#C4571B', '#5A2A12', '#F7D08A', '#FFF6EA'] },
  { name: 'Holiday Red', c: ['#B3121E', '#4A0A0F', '#F4D06F', '#FFFFFF'] },
  { name: 'Cotton Candy', c: ['#FFC6E0', '#A5D8FF', '#7A2E8A', '#2B1440'] },
  { name: 'Heritage', c: ['#E8A200', '#0B6B3A', '#C8102E', '#FFFFFF'] },
]

export const POSTER_SIZES = {
  portrait: { w: 1080, h: 1350, label: 'Facebook / Instagram post', short: 'Post 4:5' },
  square: { w: 1080, h: 1080, label: 'Square post', short: 'Square' },
  story: { w: 1080, h: 1920, label: 'Story or Reel cover', short: 'Story 9:16' },
  event: { w: 1920, h: 1005, label: 'Facebook event cover', short: 'Event cover' },
}

export type PosterTemplate = 'glow' | 'block' | 'regal' | 'couture' | 'deco' | 'noir' | 'marble' | 'editorial' | 'minimal'
export type PosterFont = 'auto' | 'didone' | 'royal' | 'elegant' | 'warm' | 'modern'

/** The poster looks, in the order they show in the style gallery. */
export const POSTER_STYLES: { id: PosterTemplate; name: string; blurb: string; palette: number; luxe?: boolean }[] = [
  { id: 'noir', name: 'Black Tie', blurb: 'Gold foil on black satin, arched photo', palette: 6, luxe: true },
  { id: 'couture', name: 'Couture Cover', blurb: 'A fashion magazine cover with your photo', palette: 3, luxe: true },
  { id: 'deco', name: 'Art Deco', blurb: 'Gatsby gold sunburst and a framed photo', palette: 11, luxe: true },
  { id: 'marble', name: 'Soft Marble', blurb: 'Ivory marble, rose gold and a script line', palette: 10, luxe: true },
  { id: 'editorial', name: 'Editorial', blurb: 'Big photo on top, clean magazine type', palette: 7, luxe: true },
  { id: 'minimal', name: 'Gallery', blurb: 'Quiet and expensive, lots of space', palette: 7, luxe: true },
  { id: 'regal', name: 'Regal', blurb: 'A royal frame, everything centered', palette: 1 },
  { id: 'glow', name: 'Golden Glow', blurb: 'Warm glow and a big friendly headline', palette: 0 },
  { id: 'block', name: 'Bold', blurb: 'Loud, fun, made for deal nights', palette: 4 },
]

export const POSTER_FONTS: { id: PosterFont; name: string; css: string }[] = [
  { id: 'auto', name: 'Match the style', css: '' },
  { id: 'didone', name: 'Vogue', css: '"Bodoni Moda", Georgia, serif' },
  { id: 'royal', name: 'Royal', css: 'Cinzel, Georgia, serif' },
  { id: 'elegant', name: 'Elegant', css: '"Cormorant Garamond", Georgia, serif' },
  { id: 'warm', name: 'Warm', css: 'Fraunces, Georgia, serif' },
  { id: 'modern', name: 'Modern', css: 'Inter, sans-serif' },
]

export type Poster = {
  template: PosterTemplate
  palette: number
  size: keyof typeof POSTER_SIZES
  font?: PosterFont
  kicker: string
  headline: string
  when: string
  tagline: string
  footer: string
  /** Social handle or page name, like @dynamicdazzle. */
  handle?: string
  /** Short price seal, like "ALL $2" or "50% OFF". */
  badge?: string
  /** Up to three little extras: "Free giveaway", "New arrivals"… */
  perks?: string[]
  /** Gold foil lettering on the headline. */
  foil?: boolean
  /** Up to three photos (storage paths). `photo` is the older single-photo field. */
  photos?: string[]
  photo?: string | null
}

/** All the photos on a poster, old or new style, max three. */
export const posterPhotos = (p: Partial<Poster>) => (p.photos ?? (p.photo ? [p.photo] : [])).slice(0, 3)

/** "Design it for me": pick a feeling, get a finished look. Tap again for the next one. */
export const POSTER_FEELS: { name: string; blurb: string; looks: { template: PosterTemplate; palette: number; font: PosterFont; foil: boolean }[] }[] = [
  { name: 'Luxe and gold', blurb: 'Black, gold foil, red-carpet', looks: [
    { template: 'noir', palette: 6, font: 'didone', foil: true }, { template: 'deco', palette: 11, font: 'royal', foil: true }, { template: 'noir', palette: 9, font: 'elegant', foil: true }, { template: 'couture', palette: 3, font: 'didone', foil: true }] },
  { name: 'Soft and pretty', blurb: 'Blush, pearl, a touch of script', looks: [
    { template: 'marble', palette: 10, font: 'elegant', foil: true }, { template: 'minimal', palette: 7, font: 'didone', foil: false }, { template: 'marble', palette: 12, font: 'elegant', foil: false }, { template: 'editorial', palette: 2, font: 'didone', foil: false }] },
  { name: 'Classic and clean', blurb: 'Magazine style, simple and sharp', looks: [
    { template: 'editorial', palette: 7, font: 'didone', foil: false }, { template: 'minimal', palette: 6, font: 'elegant', foil: true }, { template: 'couture', palette: 8, font: 'didone', foil: false }, { template: 'editorial', palette: 1, font: 'elegant', foil: true }] },
  { name: 'Royal', blurb: 'Crowns, frames, jewel colors', looks: [
    { template: 'regal', palette: 1, font: 'royal', foil: true }, { template: 'deco', palette: 8, font: 'royal', foil: true }, { template: 'regal', palette: 9, font: 'royal', foil: true }, { template: 'noir', palette: 11, font: 'royal', foil: true }] },
  { name: 'Bold and loud', blurb: 'Big letters for big deals', looks: [
    { template: 'block', palette: 4, font: 'modern', foil: false }, { template: 'block', palette: 15, font: 'modern', foil: false }, { template: 'glow', palette: 5, font: 'warm', foil: false }, { template: 'block', palette: 17, font: 'modern', foil: false }] },
  { name: 'Fun and bright', blurb: 'Glowing color, warm and friendly', looks: [
    { template: 'glow', palette: 0, font: 'warm', foil: false }, { template: 'glow', palette: 16, font: 'warm', foil: false }, { template: 'glow', palette: 13, font: 'warm', foil: false }, { template: 'editorial', palette: 5, font: 'warm', foil: false }] },
]

export const PERK_IDEAS = ['Free giveaway', 'New arrivals', 'Bundle deals', 'Mystery bags', 'Free shipping over $50', 'Steal of the Night', 'Door prizes', 'Name-brand finds']

/** A ready-to-paste Facebook caption to go with the poster. */
export function posterCaption(p: Poster) {
  const perks = (p.perks ?? []).filter(Boolean)
  return [
    `✨ ${p.headline} ✨`,
    p.when ? `🗓 ${p.when}` : '',
    p.tagline || '',
    perks.length ? perks.map(x => `💎 ${x}`).join('\n') : '',
    'Tap "Follow" and turn on notifications so you don\'t miss the first piece. Share this with a friend who loves a good find!',
    p.handle || p.footer || '',
    '#FacebookLive #ShopSmall #LiveShopping',
  ].filter(Boolean).join('\n\n')
}

export type ThemeCat = 'Holidays & seasons' | 'Deals & games' | 'Style & fashion' | 'Luxury & brands' | 'Community & heart'
export const THEME_CATS: ThemeCat[] = ['Holidays & seasons', 'Deals & games', 'Style & fashion', 'Luxury & brands', 'Community & heart']
/** When a theme makes sense. A theme with no days, event or season fits any date, and `why` says so. */
export type Fit = {
  /** Weekdays it's made for, 0 = Sunday. */
  days?: number[]
  /** A dated event: its day each year, and how many days before or after it the theme fits. */
  event?: { name: string; on: (y: number) => Date; before: number; after: number }
  /** A season or month: the date ranges it fits each year, and a few words on why. */
  season?: { why: string; ranges: (y: number) => [Date, Date][] }
  /** Why it fits (for any-day themes and weekday themes). */
  why?: string
}
export type Idea = { title: string; vibe: string; palette: number; hooks: string[]; cat: ThemeCat; fit: Fit; poster?: PosterTemplate }

/* ---- Dates for the calendar of themes ---- */
const md = (y: number, m: number, d: number) => new Date(y, m - 1, d)
const dayStart = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const DAY = 864e5
const daysBetween = (a: Date, b: Date) => Math.round((dayStart(b).getTime() - dayStart(a).getTime()) / DAY)
/** The nth weekday of a month, e.g. the 2nd Sunday of May. */
function nthWeekday(y: number, m: number, weekday: number, n: number) {
  const first = md(y, m, 1)
  return md(y, m, 1 + ((weekday - first.getDay() + 7) % 7) + (n - 1) * 7)
}
const thanksgiving = (y: number) => nthWeekday(y, 11, 4, 4)
const blackFriday = (y: number) => new Date(thanksgiving(y).getTime() + DAY)
const smallBizSaturday = (y: number) => new Date(thanksgiving(y).getTime() + 2 * DAY)
const cyberMonday = (y: number) => new Date(thanksgiving(y).getTime() + 4 * DAY)
/** Easter Sunday (Western), using the standard Gregorian calculation. */
function easter(y: number) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1
  return md(y, month, day)
}
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const cap = (s: string) => s[0].toUpperCase() + s.slice(1)
const shortDate = (d: Date) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

const H: ThemeCat = 'Holidays & seasons', D: ThemeCat = 'Deals & games', S: ThemeCat = 'Style & fashion', L: ThemeCat = 'Luxury & brands', C: ThemeCat = 'Community & heart'

/** Starter ideas for themes. Each comes with a vibe, palette, poster look and a few hooks. Months are 1 to 12. */
export const IDEA_BANK: Idea[] = [
  // Deals & games
  { cat: D, fit: { days: [2] }, title: '$2 Tuesday', vibe: 'Fast, fun, everything two dollars', palette: 4, poster: 'block', hooks: ['Speed round: 30 seconds per piece', 'Bundle 5 for $8', 'First 10 buyers get a surprise gift'] },
  { cat: D, fit: { why: 'Surprise bags sell any night of the year' }, title: 'Mystery Bag Madness', vibe: 'Surprise bundles, big reveals', palette: 5, hooks: ['Open one bag live to show the value', 'Tiered bags: $10, $20, $30', 'Golden ticket hidden in one bag'] },
  { cat: D, fit: { why: 'Clears old stock any time and makes room for new pieces' }, title: 'Clearance Blowout', vibe: 'Oldest stock, lowest prices', palette: 4, poster: 'block', hooks: ['Price drops every 10 minutes', 'Fill-a-box flat price', 'Last call countdown'] },
  { cat: D, fit: { days: [5], why: 'Friday is payday for lots of your buyers' }, title: 'Payday Friday', vibe: 'Treat yourself, you earned it', palette: 1, hooks: ['Open with three "you deserve it" pieces', 'Spend $40, get a free accessory', 'Payday bundle of the hour'] },
  { cat: D, fit: { why: 'One easy price works any night' }, title: 'Everything $5', vibe: 'One price, no math, just shopping', palette: 0, poster: 'block', hooks: ['Show two pieces at once, $5 each', 'Buy 4, get the 5th free', 'Lightning round at the halfway mark'] },
  { cat: D, fit: { why: 'A guessing game gets comments going any night' }, title: 'Price Is Right Night', vibe: 'Guess the price, win the piece', palette: 5, hooks: ['Closest guess without going over wins', 'Show the tag reveal slowly', 'Winner picks the next piece'] },
  { cat: D, fit: { why: 'A game night works any time of year' }, title: 'Spin the Wheel', vibe: 'Every spin, a new deal', palette: 16, hooks: ['Spin for $1 off, free shipping or a freebie', 'Spin after every 10 sales', 'One "jackpot" slot on the wheel'] },
  { cat: D, fit: { why: 'A game night works any time of year' }, title: 'Bingo Night', vibe: 'Shop and play along', palette: 13, hooks: ['Post a bingo card before the live', 'Call a square with every sale', 'Bingo winner gets a mystery bag'] },
  { cat: D, fit: { why: 'Moves lots of pieces fast, any time' }, title: 'Fill-a-Bag Flat Price', vibe: 'Stuff it full, one low price', palette: 14, hooks: ['Show how much fits in one bag', 'Buyers call out what goes in', 'Upgrade to the big bag for $10 more'] },
  { cat: D, fit: { why: 'Fast, fun pricing for any night' }, title: 'Beat the Clock', vibe: 'Prices drop as the timer runs', palette: 15, hooks: ['Start high, drop $1 every 10 seconds', 'First SOLD locks the price', 'Big timer on screen'] },
  { cat: D, fit: { why: 'Bidding fun for any night' }, title: 'Dollar Dash', vibe: 'Starting bids at one dollar', palette: 4, poster: 'block', hooks: ['Every piece starts at $1', 'Highest bid when the timer ends wins', 'Save your best piece for the final dash'] },
  { cat: D, fit: { why: 'Works any time, and shines before birthdays and holidays' }, title: 'Buy One, Gift One', vibe: 'Shop for you, treat a friend', palette: 2, hooks: ['Second piece half off when you tag a friend', 'Free gift wrap on the second piece', 'Read the gift notes out loud'] },
  { cat: D, fit: { event: { name: 'Black Friday', on: blackFriday, before: 6, after: 0 } }, title: 'Black Friday Doorbusters', vibe: 'The biggest deals of the year', palette: 3, hooks: ['Doorbuster every 15 minutes', 'Spin the wheel discounts', 'Early-bird bonus for the first 50 viewers'] },
  { cat: D, fit: { event: { name: 'Cyber Monday', on: cyberMonday, before: 0, after: 0 } }, title: 'Cyber Monday Steals', vibe: 'Online-only deals, one night', palette: 8, hooks: ['Code word on screen unlocks a bonus deal', 'Steal of the Hour', 'Free shipping all night'] },

  // Holidays & seasons
  { cat: H, fit: { season: { why: 'Party-season sparkle', ranges: y => [[md(y, 11, 15), md(y, 12, 31)]] } }, title: 'Holiday Glam', vibe: 'Sparkle, sequins and party-ready pieces', palette: 3, poster: 'noir', hooks: ['Style three looks from the same dress', 'Gift-wrap upgrade for $1', '12 Days of Deals countdown'] },
  { cat: H, fit: { event: { name: 'Thanksgiving', on: thanksgiving, before: 21, after: 0 } }, title: 'Friendsgiving Finds', vibe: 'Cozy, grateful and dinner-party ready', palette: 14, hooks: ['Thank three loyal buyers by name', 'Bring-a-friend bundle', 'Gratitude giveaway'] },
  { cat: H, fit: { event: { name: 'Small Business Saturday', on: smallBizSaturday, before: 0, after: 0 } }, title: 'Small Business Saturday', vibe: 'Shop small, shop us', palette: 1, hooks: ['Tell how your shop started', 'Spotlight other small brands you love', 'Share the live to enter the giveaway'] },
  { cat: H, fit: { event: { name: 'Christmas', on: y => md(y, 12, 25), before: 24, after: 0 } }, title: '12 Days of Deals', vibe: 'A new deal every day', palette: 15, hooks: ['One "day" deal every 5 minutes', 'Collect all 12 for a prize', 'Gift guide by price'] },
  { cat: H, fit: { event: { name: 'Christmas', on: y => md(y, 12, 25), before: 24, after: 0 } }, title: 'Ugly Sweater Party', vibe: 'Silly, cozy and festive', palette: 15, hooks: ['Wear your ugliest sweater on camera', 'Viewers vote on the best one', 'Cocoa-and-cozy bundles'] },
  { cat: H, fit: { event: { name: "New Year's Eve", on: y => md(y, 12, 31), before: 5, after: 0 } }, title: "New Year's Eve Sparkle", vibe: 'Sequins, gold and midnight glam', palette: 6, poster: 'deco', hooks: ['Countdown deals to "midnight"', 'Champagne-gold pieces first', 'Resolution giveaway'] },
  { cat: H, fit: { season: { why: 'A fresh-start pick', ranges: y => [[md(y, 1, 1), md(y, 1, 31)]] } }, title: 'New Year, New You', vibe: 'Fresh starts and closet refreshes', palette: 7, poster: 'minimal', hooks: ['Out with the old: clearance corner', 'Goal-setting chat with viewers', 'Starter wardrobe bundles'] },
  { cat: H, fit: { event: { name: "Valentine's Day", on: y => md(y, 2, 14), before: 14, after: 0 } }, title: "Valentine's Treat Yourself", vibe: 'Reds, pinks and self-love', palette: 2, hooks: ["Galentine's bundles", 'Love note with every order', 'Matching sets for you and your bestie'] },
  { cat: H, fit: { season: { why: 'A Black History Month pick', ranges: y => [[md(y, 2, 1), md(y, 3, 0)]] } }, title: 'Black History Month Spotlight', vibe: 'Celebrate, honor and buy Black-owned', palette: 17, hooks: ['Feature Black-owned brands in your stock', 'Share a history moment each segment', 'Give back to a local cause'] },
  { cat: H, fit: { season: { why: "A Women's History Month pick", ranges: y => [[md(y, 3, 1), md(y, 3, 31)]] } }, title: "Women's History Month", vibe: 'Honoring the women who built us', palette: 9, hooks: ['Shout out women who inspire your viewers', 'Boss-lady bundles', 'Feature women-owned brands'] },
  { cat: H, fit: { season: { why: 'A bright spring pick', ranges: y => [[md(y, 3, 15), md(y, 5, 15)]] } }, title: 'Spring Refresh', vibe: 'Bright colors and new arrivals', palette: 0, hooks: ['Closet clean-out tips', 'Color of the season spotlight', 'Swap a piece, save a dollar'] },
  { cat: H, fit: { event: { name: 'Easter', on: easter, before: 21, after: 0 } }, title: 'Easter Sunday Best', vibe: 'Pastels, hats and church-ready looks', palette: 12, hooks: ['Hat-and-bag pairings', 'Kids and grown-ups matching looks', 'Egg hunt: hidden prize numbers'] },
  { cat: H, fit: { event: { name: "Mother's Day", on: y => nthWeekday(y, 5, 0, 2), before: 21, after: 0 } }, title: "Mother's Day Gifts", vibe: 'Gifts for the queens who raised us', palette: 2, poster: 'marble', hooks: ['Gift picks by budget', 'Tell us about your mom in the comments', 'Free gift note card'] },
  { cat: H, fit: { season: { why: 'A graduation-season pick', ranges: y => [[md(y, 5, 1), md(y, 6, 20)]] } }, title: 'Graduation Glow', vibe: 'Dress the grad and the proud family', palette: 8, hooks: ['Cap-and-gown accessories', 'Proud-mama outfits', 'Gift sets for the grad'] },
  { cat: H, fit: { event: { name: 'Juneteenth', on: y => md(y, 6, 19), before: 18, after: 0 } }, title: 'Juneteenth Celebration', vibe: 'Honor, celebrate and support Black-owned', palette: 17, hooks: ['Spotlight Black-owned brands in your stock', 'Share what freedom means to you', 'Donate a portion to a local cause'] },
  { cat: H, fit: { event: { name: "Father's Day", on: y => nthWeekday(y, 6, 0, 3), before: 21, after: 0 } }, title: "Father's Day Finds", vibe: 'Gifts for the kings', palette: 8, hooks: ['Wallets, watches and cologne-ready gifts', 'Tell us about your dad', 'Gift bundles under $25'] },
  { cat: H, fit: { season: { why: 'A sunny summer pick', ranges: y => [[md(y, 6, 1), md(y, 8, 31)]] } }, title: 'Summer Brunch Fits', vibe: 'Sundresses, sandals and sunshine', palette: 4, hooks: ['Style a brunch look under $20', 'Mimosa-hour flash deals', 'Hat and shades bundles'] },
  { cat: H, fit: { event: { name: 'the Fourth of July', on: y => md(y, 7, 4), before: 14, after: 0 } }, title: 'Fourth of July Fireworks', vibe: 'Red, white and big deals', palette: 15, hooks: ['Firework deal every 10 minutes', 'Cookout-ready outfits', 'Star-spangled giveaway'] },
  { cat: H, fit: { season: { why: 'A reunion-season pick', ranges: y => [[md(y, 6, 1), md(y, 8, 31)]] } }, title: 'Family Reunion Ready', vibe: 'Show up looking like the favorite cousin', palette: 13, hooks: ['Group-order discount for families', 'Matching colors for photos', 'Comfy-but-cute travel looks'] },
  { cat: H, fit: { season: { why: 'A back-to-school pick', ranges: y => [[md(y, 7, 15), md(y, 9, 10)]] } }, title: 'Back to School Fits', vibe: 'Fresh looks for kids, teens and teachers', palette: 1, hooks: ['Outfit of the day builds', 'Teacher appreciation picks', 'Backpack and accessory bundles'] },
  { cat: H, fit: { season: { why: 'A cozy fall pick', ranges: y => [[md(y, 9, 1), md(y, 11, 30)]] } }, title: 'Fall Into Fashion', vibe: 'Layers, boots and warm tones', palette: 14, hooks: ['Layering how-to on camera', 'Boot-and-bag pairings', 'Pumpkin spice bundle'] },
  { cat: H, fit: { days: [5, 6, 0], season: { why: 'A homecoming-season weekend pick', ranges: y => [[md(y, 9, 15), md(y, 11, 10)]] } }, title: 'Homecoming Weekend', vibe: 'HBCU pride and tailgate style', palette: 9, hooks: ['School-color outfit builds', 'Shout out viewers\' schools', 'Tailgate bundles'] },
  { cat: H, fit: { event: { name: 'Halloween', on: y => md(y, 10, 31), before: 30, after: 0 } }, title: 'Spooky Steals', vibe: 'Treats, no tricks', palette: 14, hooks: ['Trick-or-treat mystery prices', 'Costume-ready accessories', 'Spooky giveaway at the end'] },

  // Style & fashion
  { cat: S, fit: { why: 'Your favorites make sense any week' }, title: "Queen's Picks", vibe: "The host's personal favorites of the week", palette: 1, poster: 'regal', hooks: ['Tell the story behind each find', 'Viewers vote on the next piece', 'One "crown jewel" saved for last'] },
  { cat: S, fit: { why: 'Bags sell all year long' }, title: 'Bag Bonanza', vibe: 'Totes, crossbodies and clutches', palette: 5, hooks: ["What's in my bag game", 'Bag and jewelry bundle price', 'Mystery bag at the end'] },
  { cat: S, fit: { why: 'Jewelry sells all year and makes an easy gift' }, title: 'Jewelry Night', vibe: 'Stack, layer and shine', palette: 3, poster: 'noir', hooks: ['Build a stack challenge', 'Earring try-on close-ups', 'Buy 3, pick a free ring'] },
  { cat: S, fit: { days: [6, 0], why: 'Sunday best, so it fits a Saturday or Sunday live' }, title: 'Church Hat Sunday', vibe: 'Crowns for the Lord\'s day', palette: 9, poster: 'regal', hooks: ['Hat try-ons with matching bags', 'First Lady looks', 'Sunday best bundles'] },
  { cat: S, fit: { days: [4, 5, 6], why: 'Right before the weekend, when people plan date nights' }, title: 'Date Night Ready', vibe: 'Look good, feel good, go out', palette: 9, hooks: ['Three looks: dinner, movie, dancing', 'Lipstick-red accessories', 'Date-night bundle'] },
  { cat: S, fit: { season: { why: 'A travel-season pick', ranges: y => [[md(y, 3, 1), md(y, 9, 30)]] } }, title: 'Girls Trip Packing List', vibe: 'Pack it, slay it, take the pictures', palette: 13, hooks: ['Day-to-night outfits', 'Carry-on friendly bundles', 'Travel-size giveaway'] },
  { cat: S, fit: { days: [3] }, title: 'Workwear Wednesday', vibe: 'Boss looks for the 9 to 5', palette: 8, poster: 'editorial', hooks: ['Blazer three ways', 'Desk-to-dinner swaps', 'Laptop-bag spotlight'] },
  { cat: S, fit: { why: 'Fit help is welcome any time' }, title: 'Curvy Queens Night', vibe: 'Plus-size style that fits and flatters', palette: 5, hooks: ['Try-on of every piece', 'Fit tips for every shape', 'Viewer style questions answered'] },
  { cat: S, fit: { days: [6] }, title: 'Shoe Shop Saturday', vibe: 'Heels, flats, sneakers and boots', palette: 3, hooks: ['Close-ups of soles and stitching', 'Shoe-and-bag pairings', 'Size-run lightning round'] },
  { cat: S, fit: { why: 'A one-color night works any time' }, title: 'Color Party: All Red', vibe: 'One color, every shade', palette: 15, hooks: ['Only show pieces in one color', 'Viewers pick next week\'s color', 'Wear the color on camera'] },
  { cat: S, fit: { why: 'A chic look for any season' }, title: 'Monochrome Magic', vibe: 'Head-to-toe one color, very chic', palette: 7, poster: 'minimal', hooks: ['Build a full outfit in one shade', 'Neutrals night: cream, camel, black', 'Styling tips for tone-on-tone'] },
  { cat: S, fit: { season: { why: 'A cozy cold-weather pick', ranges: y => [[md(y, 1, 1), md(y, 3, 31)], [md(y, 10, 1), md(y, 12, 31)]] } }, title: 'Cozy Lounge Night', vibe: 'Soft sets, knits and slippers', palette: 12, hooks: ['Lounge sets first', 'Matching mom-and-me sets', 'Candles and calm music on set'] },
  { cat: S, fit: { season: { why: 'A wedding-season pick', ranges: y => [[md(y, 4, 1), md(y, 10, 31)]] } }, title: 'Wedding Guest Glam', vibe: 'Outfits for every invitation', palette: 10, poster: 'marble', hooks: ['Dress code decoder: cocktail, formal, garden', 'Clutch-and-earring pairings', 'Never-wear-white reminder'] },

  // Luxury & brands
  { cat: L, fit: { why: 'Name brands sell any time' }, title: 'Designer Steals', vibe: 'Name brands at basement prices', palette: 6, poster: 'noir', hooks: ['Show the tags and authenticity details', 'Retail price vs. tonight\'s price', 'One grail piece saved for last'] },
  { cat: L, fit: { why: 'A glam night works any time' }, title: 'Red Carpet Night', vibe: 'Dress like the star you are', palette: 9, poster: 'couture', hooks: ['Walk the "carpet" with each look', 'Viewers vote best dressed', 'Paparazzi photo giveaway'] },
  { cat: L, fit: { why: 'Timeless pieces fit any season' }, title: 'Old Money Elegance', vibe: 'Quiet luxury, pearls and camel coats', palette: 7, poster: 'minimal', hooks: ['Timeless pieces that never go out of style', 'Pearl-and-gold styling', 'Investment piece of the night'] },
  { cat: L, fit: { why: 'Gold sells all year long' }, title: 'Gold Rush', vibe: 'All gold everything', palette: 11, poster: 'deco', hooks: ['Only gold-tone pieces', 'Stacking challenge', 'Gold ticket in one order'] },
  { cat: L, fit: { why: 'Classic shine for any time of year' }, title: 'Pearls and Diamonds', vibe: 'Classic shine for every day', palette: 7, poster: 'marble', hooks: ['Layering pearls with gold', 'Gift boxes ready to give', 'Grandma\'s jewelry box stories'] },
  { cat: L, fit: { why: 'Best when you have a big batch of new stock' }, title: 'Boutique Grand Opening', vibe: 'New collection, red ribbon energy', palette: 1, poster: 'couture', hooks: ['Ribbon-cutting moment on camera', 'First 25 buyers get a gift', 'Behind-the-scenes of the new pieces'] },
  { cat: L, fit: { why: 'Rewarding your best buyers works any week' }, title: 'Velvet Rope VIP Night', vibe: 'Invite-only feel, top buyers first', palette: 9, poster: 'noir', hooks: ['VIPs get first claim for 10 minutes', 'Thank-you gift in VIP boxes', 'Exclusive piece just for tonight'] },
  { cat: L, fit: { why: 'Glam for any night, and perfect near New Year\'s' }, title: 'Great Gatsby Gala', vibe: 'Roaring twenties glamour', palette: 3, poster: 'deco', hooks: ['Fringe, pearls and feathers', 'Jazz playlist on set', 'Gala giveaway at midnight'] },
  { cat: L, fit: { season: { why: 'A fashion-week pick', ranges: y => [[md(y, 2, 1), md(y, 3, 0)], [md(y, 9, 1), md(y, 9, 30)]] } }, title: 'Fashion Week at Home', vibe: 'Runway looks, living room prices', palette: 6, poster: 'couture', hooks: ['"Runway walk" for each outfit', 'Trend report from this season', 'Viewers judge like a fashion panel'] },
  { cat: L, fit: { why: 'Name brands sell any time' }, title: 'Brand Name Bonanza', vibe: 'Coach, Michael Kors, Kate Spade and more', palette: 8, poster: 'editorial', hooks: ['Group pieces by brand', 'How to spot the real thing', 'Brand bundle of the night'] },

  // Community & heart
  { cat: C, fit: { why: 'Thanking your regulars works any week' }, title: 'Customer Appreciation Night', vibe: 'Thank you to the regulars', palette: 0, hooks: ['Shout out top buyers by name', 'Loyalty giveaway draw', 'Free shipping for repeat buyers'] },
  { cat: C, fit: { days: [0] }, title: 'Self-Care Sunday', vibe: 'Cozy, soft and treat-yourself', palette: 2, hooks: ['Lounge sets and cozy knits first', 'Affirmation of the night', 'Calm music and candles on set'] },
  { cat: C, fit: { why: 'Your buyers chose it, so it fits any week' }, title: 'Customer Picks', vibe: 'You chose it, we found it', palette: 13, hooks: ['Poll this week: what should we sell?', 'Show the winning category', 'Credit the viewer who asked'] },
  { cat: C, fit: { why: 'Use it on your shop\'s birthday, or any party night' }, title: 'Birthday Bash', vibe: 'The shop is celebrating, you get the gifts', palette: 16, hooks: ['Birthday buyers get a free gift', 'Cake-and-candles countdown', 'Party favor in every box'] },
  { cat: C, fit: { season: { why: 'A Breast Cancer Awareness Month pick', ranges: y => [[md(y, 10, 1), md(y, 10, 31)]] } }, title: 'Breast Cancer Awareness', vibe: 'Think pink, give back', palette: 2, hooks: ['Pink pieces, part of sales donated', 'Share survivor stories with care', 'Pink-ribbon giveaway'] },
  { cat: C, fit: { why: 'Matching sets work any time' }, title: 'Mommy and Me', vibe: 'Matching looks for moms and minis', palette: 12, hooks: ['Matching set spotlight', 'Kids help pick the next piece', 'Family bundle price'] },
  { cat: C, fit: { why: 'Giving back fits any week' }, title: 'Pay It Forward', vibe: 'Every order helps someone', palette: 1, hooks: ['Donate one piece for every 10 sold', 'Viewers nominate someone to surprise', 'Read the nominations live'] },
  { cat: C, fit: { days: [4] }, title: 'Throwback Thursday', vibe: '70s, 80s and 90s favorites', palette: 14, hooks: ['Old-school playlist', 'Guess the decade game', 'Vintage-look bundle'] },
  { cat: C, fit: { why: 'Style questions come up all year' }, title: 'Ask the Stylist', vibe: 'Bring your style questions', palette: 8, hooks: ['Viewers ask, you style a look on camera', 'Body-shape tips', 'Stylist\'s pick of the night'] },
  { cat: C, fit: { why: 'Lifting each other up fits any week' }, title: 'Sister Circle', vibe: 'Shop, laugh and lift each other up', palette: 9, hooks: ['Tag a sister to enter the giveaway', 'Share a win from this week', 'Sister bundle: two of a kind'] },
]

/** Whether a theme makes sense for a live on this date, why, and how strong a match it is. */
export function ideaFit(i: Idea, date: Date): { fits: boolean; why: string; score: number } {
  const f = i.fit
  const d = dayStart(date)
  const dayOk = !f.days || f.days.includes(d.getDay())
  if (f.event) {
    // Check this year's event and next year's (a late-December live can lead up to a January date).
    for (const y of [d.getFullYear(), d.getFullYear() + 1]) {
      const on = dayStart(f.event.on(y))
      const diff = daysBetween(d, on) // days until the event
      if (diff <= f.event.before && -diff <= f.event.after && dayOk) {
        const name = f.event.name
        const why = diff === 0 ? `Your live is on ${name}` : diff === 1 ? `The day before ${name}` : diff > 1 ? `${diff} days before ${name}` : diff === -1 ? `The day after ${name}` : `${-diff} days after ${name}`
        return { fits: true, why: cap(why), score: 100 - Math.abs(diff) }
      }
    }
    return { fits: false, why: '', score: 0 }
  }
  if (f.season) {
    const inside = f.season.ranges(d.getFullYear()).some(([s, e]) => d >= dayStart(s) && d <= dayStart(e))
    if (!inside || !dayOk) return { fits: false, why: '', score: 0 }
    const part = d.getDate() <= 10 ? 'early' : d.getDate() <= 20 ? 'mid' : 'late'
    return { fits: true, why: `${f.season.why} for ${part} ${MONTHS[d.getMonth()]}`, score: f.days ? 70 : 50 }
  }
  if (f.days) return dayOk ? { fits: true, why: f.why ?? `Made for ${WEEKDAYS[d.getDay()]} lives`, score: 80 } : { fits: false, why: '', score: 0 }
  return { fits: true, why: f.why ?? 'Works any time of year', score: 10 }
}

/** When a theme fits, in a few words: "Tuesdays", "Nov 28 only", "Nov 1 to Nov 26". */
export function fitLabel(i: Idea, from = new Date()) {
  const f = i.fit
  if (f.event) {
    const next = nextFitDate(i, from)
    if (!next) return ''
    const on = f.event.on(next.getFullYear() + (dayStart(f.event.on(next.getFullYear())) < dayStart(next) ? 1 : 0))
    const s = new Date(on.getTime() - f.event.before * DAY)
    const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return f.event.before === 0 && f.event.after === 0 ? `${fmt(on)} only` : `${fmt(s)} to ${fmt(new Date(on.getTime() + f.event.after * DAY))}`
  }
  const days = f.days ? f.days.map(n => WEEKDAYS[n] + 's').join(', ').replace(/, ([^,]*)$/, ' or $1') : ''
  if (f.season) {
    const ranges = f.season.ranges(from.getFullYear()).map(([s, e]) => `${MONTHS[s.getMonth()].slice(0, 3)} ${s.getDate()} to ${MONTHS[e.getMonth()].slice(0, 3)} ${e.getDate()}`).join(' and ')
    return days ? `${days}, ${ranges}` : ranges
  }
  return days || 'Any day'
}

/** The first date on or after `from` that a theme fits (within a year). */
export function nextFitDate(i: Idea, from = new Date()) {
  const d = dayStart(from)
  for (let n = 0; n <= 400; n++) {
    const t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
    if (ideaFit(i, t).fits) return t
  }
  return null
}

/** Every theme that makes sense for a live on this date, best match first. */
export function ideasForDate(date: Date) {
  return IDEA_BANK.map(i => ({ idea: i, ...ideaFit(i, date) })).filter(x => x.fits).sort((a, b) => b.score - a.score)
}

/** Holiday and event themes coming up soon that don't fit this date, with the first day they do. */
export function upcomingIdeas(date: Date, withinDays = 21) {
  return IDEA_BANK.filter(i => i.fit.event && !ideaFit(i, date).fits).map(i => ({ idea: i, on: nextFitDate(i, date) }))
    .filter((x): x is { idea: Idea; on: Date } => !!x.on && daysBetween(date, x.on) <= withinDays)
    .sort((a, b) => a.on.getTime() - b.on.getTime())
}

/** "Mon, Nov 23" for showing a live date. */
export const liveDayLabel = shortDate

/** Finds an idea by its title (used by links like /planner?idea=Gold%20Rush). */
export const findIdea = (title: string | null) => (title ? IDEA_BANK.find(i => i.title === title) ?? null : null)

/** Everything a new live gets from an idea: theme, vibe, hooks and a matching poster look. */
export function ideaPreset(i: Idea) {
  return {
    title: i.title, theme: i.title,
    plan: { vibe: i.vibe, ideas: i.hooks.map(h => `• ${h}`).join('\n'), poster: { palette: i.palette, headline: i.title, ...(i.poster ? { template: i.poster } : {}) } } as Plan,
  }
}

/** The background swatch for an idea card. */
export const swatch = (palette: number) => {
  const c = (PALETTES[palette] ?? PALETTES[0]).c
  return { background: `linear-gradient(135deg, ${c[0]}, ${c[1]} 70%, ${c[2]})`, color: c[3] }
}

export const ENGAGEMENT_IDEAS = [
  'First to comment "SOLD" on the opening piece gets $1 off',
  'Guess the price: closest guess wins the piece',
  'Spin the wheel for a mystery discount',
  'Share the live, comment "SHARED", enter the giveaway',
  'Trivia break: right answer wins free shipping',
  'Viewers vote between two pieces, the winner goes up next',
  'Shout out everyone celebrating a birthday this week',
  'Hide a "golden ticket" in one order',
  'Ask "Gold or silver girls? Drop a G or an S!"',
  'Flash $2 minute whenever the comments slow down',
  'Comment your city: shout out the farthest viewer',
  'Hit 50 likes and the next piece drops $5',
  'Show the "before" price, then reveal tonight\'s price',
  'Mystery number: buyer whose order hits it wins a gift',
  'Let a regular pick the next piece from two choices',
  'Read a five-star review from a happy buyer',
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
