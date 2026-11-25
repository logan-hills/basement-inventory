/* Lesson format. Each feature has one lesson file in this folder.
   RULE: whenever a feature changes, update its lesson in the same change, bump `updated`,
   and keep `covers` pointing at the files the lesson teaches. `npm run lessons:check` lists
   lessons whose feature files changed after the lesson did, and lessons that run short.

   DEPTH RULE: every lesson and course is built to take about 15 to 20 minutes. Teach the
   feature AND the business know-how behind it: worked examples, scripts sellers can copy,
   real scenarios, practice, quick checks and workbook prompts. Time is worked out from the
   content itself (see time.ts), so the number on the card is always honest. */

/** A simple pretend screen used in lessons: a title, some rows, and buttons. */
export type Screen = { title: string; rows?: string[]; buttons: string[]; highlight?: string }

/** A small table for worked numbers (prices, profit, timing). */
export type Table = { head: string[]; rows: string[][] }

/** A picture drawn from the lesson's own data, shown on a learn slide (like the diagrams in a work training).
    flow: steps joined by arrows. compare: two columns side by side (do/don't, before/after).
    bars: a simple bar chart. stats: big numbers. split: one bar cut into parts (where each dollar goes). */
export type Visual = { caption?: string } & (
  | { type: 'flow'; steps: { label: string; note?: string }[] }
  | { type: 'compare'; style?: 'dodont' | 'beforeafter' | 'plain'; left: { title: string; items: string[] }; right: { title: string; items: string[] } }
  | { type: 'bars'; unit?: string; prefix?: string; max?: number; bars: { label: string; value: number; note?: string; hl?: boolean }[] }
  | { type: 'stats'; stats: { value: string; label: string }[] }
  | { type: 'split'; total?: string; parts: { label: string; value: number; note?: string }[] }
)

/** Fields any slide can carry: a chapter heading, Nova's own line for this slide, and a tip in the Queen's own voice.
    QUEEN RULE: the Queen (our CEO) curates every lesson. Give each lesson a `queen` note and at least two slides a `queen` tip:
    practical, warm advice in her voice, the kind she'd tell her own sellers. Never invent facts about her life. */
type Common = { chapter?: string; nova?: string; queen?: string }

export type Slide = Common & (
  /** Teach: a title, body text, optional bullet points, a worked table, a real-life example and a tip. */
  | { kind: 'learn'; title: string; text: string; points?: string[]; screen?: Screen; table?: Table; visual?: Visual; term?: { word: string; meaning: string }; example?: string; tip?: string }
  /** Step by step: a numbered walkthrough, each step with what to do and how (optionally an example). */
  | { kind: 'howto'; title: string; text?: string; steps: { title: string; detail: string; example?: string }[]; tip?: string }
  /** Key takeaways: the short summary that closes a module, like a work training. */
  | { kind: 'recap'; title: string; points: string[] }
  /** A ready-to-use script or template the seller can copy and make her own. */
  | { kind: 'script'; title: string; text?: string; lines: string[]; tip?: string }
  /** Practice: tap the right button on a pretend screen. */
  | { kind: 'tap'; title: string; prompt: string; screen: Screen; answer: string; hint: string }
  /** Practice: tap the steps in the right order (shown shuffled). */
  | { kind: 'order'; title: string; prompt: string; steps: string[] }
  /** Quick check: one multiple-choice question. */
  | { kind: 'quiz'; q: string; options: string[]; answer: number; why: string }
  /** Real-life scenario: pick what you'd do. Every option explains itself; keep trying until you find the best one. */
  | { kind: 'scenario'; title: string; situation: string; options: { text: string; best?: boolean; feedback: string }[] }
  /** Do the math: type a number. Right if within `tolerance` of `answer`. */
  | { kind: 'number'; title: string; q: string; answer: number; tolerance?: number; prefix?: string; suffix?: string; hint: string; why: string }
  /** Workbook: the seller writes her own answer (saved on this device). Any honest answer counts. */
  | { kind: 'reflect'; title: string; prompt: string; placeholder?: string; example?: string }
  /** Workbook: an action plan she ticks off (saved on this device). */
  | { kind: 'checklist'; title: string; prompt: string; items: string[] }
)

export type SlideKind = Slide['kind']
/** Slides that are scored on the first try. */
export const GRADED: SlideKind[] = ['tap', 'order', 'quiz', 'scenario', 'number']
/** Slides that need an answer before Next unlocks. */
export const INTERACTIVE: SlideKind[] = [...GRADED, 'reflect', 'checklist']

/** A reputable source a course draws on. Shown on the course cover and the finish page. */
export type Source = { org: string; title: string; url: string }

/** Business courses are grouped into schools on the University page. */
export type School = 'Strategy and growth' | 'Make it official' | 'Money and buying' | 'Brand and marketing' | 'Launching your website' | 'Social media' | 'Tools and apps' | 'AI know-how' | 'Platforms and trends' | 'Operations' | 'Customer care' | 'Mindset and motivation' | 'Life and legacy' | 'Build your team'
export const SCHOOLS: { id: School; blurb: string; tone: string; icon: string }[] = [
  { id: 'Mindset and motivation', blurb: 'Grow the business by growing you: mindset, passion that lasts, staying power, and taking your seat at the table.', tone: 'rose', icon: 'heart' },
  { id: 'Life and legacy', blurb: 'The owner behind the shop: make room for family, rest without guilt, and build wealth that outlasts you.', tone: 'garnet', icon: 'heart' },
  { id: 'Build your team', blurb: 'From one-woman show to boss: build the hiring process, interview like a hiring manager, onboard your first employee and grow a team.', tone: 'cognac', icon: 'users' },
  { id: 'Strategy and growth', blurb: 'Plan like a CEO: find your strengths and weak spots, set the goals, grow on purpose, and stay ahead.', tone: 'onyx', icon: 'trend' },
  { id: 'Make it official', blurb: 'Licenses, EIN, sales tax and calm tax seasons. Run it like a real business.', tone: 'gold', icon: 'reports' },
  { id: 'Money and buying', blurb: 'Manage your money, buy smarter and build vendors who look out for you.', tone: 'teal', icon: 'dollar' },
  { id: 'Brand and marketing', blurb: 'Look like the boutique buyers trust, grow your audience and fill every live.', tone: 'fuchsia', icon: 'sparkle' },
  { id: 'Launching your website', blurb: 'Open a shop that sells between lives: pick a builder, then launch step by step with Square, Shopify, GoDaddy or AI.', tone: 'sky', icon: 'cart' },
  { id: 'Social media', blurb: 'Reels, posts and a content plan that sells while you sleep.', tone: 'violet', icon: 'live' },
  { id: 'Tools and apps', blurb: 'Canva and the apps worth paying for, minus the ones that aren\'t.', tone: 'crimson', icon: 'settings' },
  { id: 'AI know-how', blurb: 'Use AI without drowning in it, make it work for your shop, and stay honest with your buyers.', tone: 'plum', icon: 'sparkle' },
  { id: 'Platforms and trends', blurb: 'Sell where the buyers are, get paid for content, and stay ahead of the industry.', tone: 'cobalt', icon: 'trend' },
  { id: 'Operations', blurb: 'Store, pick and pack like the big warehouses, minus the waste.', tone: 'emerald', icon: 'warehouse' },
  { id: 'Customer care', blurb: 'Ship fast, talk warm, and turn buyers into regulars.', tone: 'tangerine', icon: 'users' },
]

export type Track = 'Start here' | 'Stock' | 'Sell' | 'Pack and ship' | 'Grow' | 'Business'

export type Lesson = {
  id: string
  title: string
  track: Track
  icon: string
  /** One sentence on why this feature matters to the seller. */
  why: string
  /** 'course' = an in-depth business course; default is an app lesson. */
  kind?: 'app' | 'course'
  /** What the seller can do afterwards (shown on the cover and the certificate). */
  outcomes?: string[]
  /** Where to try it for real. */
  route?: { to: string; label: string }
  /** Which school a business course belongs to. */
  school?: School
  /** Reputable sources the lesson draws on, cited in the lesson. */
  sources?: Source[]
  /** Source files this lesson teaches. Used by lessons:check. */
  covers: string[]
  /** The Queen's personal note: `welcome` opens the lesson on its cover, `signoff` sends the seller off on the finish page. */
  queen?: { welcome: string; signoff: string }
  /** Courses that touch law or taxes show a not-advice note on the cover and finish page: 'tax' for taxes and licenses, 'hiring' for hiring, pay and employees. */
  legal?: 'tax' | 'hiring'
  /** Date the lesson was last brought up to date (YYYY-MM-DD). */
  updated: string
  slides: Slide[]
}

/** One bright color per track, used on the University page and lesson covers. */
export const TRACK_TONE: Record<Track, string> = { 'Start here': 'violet', Stock: 'emerald', Sell: 'fuchsia', 'Pack and ship': 'cobalt', Grow: 'tangerine', Business: 'gold' }
/** The color for a lesson: its school's for a course, its track's for an app lesson. */
export const lessonTone = (l: Lesson) => SCHOOLS.find(s => s.id === l.school)?.tone ?? TRACK_TONE[l.track]

export const TRACKS: Track[] = ['Start here', 'Stock', 'Sell', 'Pack and ship', 'Grow']
export const COURSE_TRACK: Track = 'Business'
