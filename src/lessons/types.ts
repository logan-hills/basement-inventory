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

/** Fields any slide can carry: a chapter heading and Nova's own line for this slide. */
type Common = { chapter?: string; nova?: string }

export type Slide = Common & (
  /** Teach: a title, body text, optional bullet points, a worked table, a real-life example and a tip. */
  | { kind: 'learn'; title: string; text: string; points?: string[]; screen?: Screen; table?: Table; example?: string; tip?: string }
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
  /** Source files this lesson teaches. Used by lessons:check. */
  covers: string[]
  /** Date the lesson was last brought up to date (YYYY-MM-DD). */
  updated: string
  slides: Slide[]
}

export const TRACKS: Track[] = ['Start here', 'Stock', 'Sell', 'Pack and ship', 'Grow']
export const COURSE_TRACK: Track = 'Business'
