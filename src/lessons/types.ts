/* Lesson format. Each feature has one lesson file in this folder.
   RULE: whenever a feature changes, update its lesson in the same change, bump `updated`,
   and keep `covers` pointing at the files the lesson teaches. `npm run lessons:check` lists
   lessons whose feature files changed after the lesson did. */

/** A simple pretend screen used in lessons: a title, some rows, and buttons. */
export type Screen = { title: string; rows?: string[]; buttons: string[]; highlight?: string }

export type Slide =
  | { kind: 'learn'; title: string; text: string; points?: string[]; screen?: Screen; tip?: string }
  /** Practice: tap the right button on a pretend screen. */
  | { kind: 'tap'; title: string; prompt: string; screen: Screen; answer: string; hint: string }
  /** Practice: tap the steps in the right order (shown shuffled). */
  | { kind: 'order'; title: string; prompt: string; steps: string[] }
  /** Quick check: one multiple-choice question. */
  | { kind: 'quiz'; q: string; options: string[]; answer: number; why: string }

export type Track = 'Start here' | 'Stock' | 'Sell' | 'Pack and ship' | 'Grow'

export type Lesson = {
  id: string
  title: string
  track: Track
  icon: string
  minutes: number
  /** One sentence on why this feature matters to the seller. */
  why: string
  /** Where to try it for real. */
  route?: { to: string; label: string }
  /** Source files this lesson teaches. Used by lessons:check. */
  covers: string[]
  /** Date the lesson was last brought up to date (YYYY-MM-DD). */
  updated: string
  slides: Slide[]
}

export const TRACKS: Track[] = ['Start here', 'Stock', 'Sell', 'Pack and ship', 'Grow']
