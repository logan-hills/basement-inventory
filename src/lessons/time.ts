import type { Lesson, Slide } from './types'

/* How long a lesson really takes, worked out from its content so the minutes on every card
   are honest. Reading pace is unhurried (people read, think, and look at the example), plus
   time to answer each practice and to write in the workbook.
   Keep in step with scripts/lessons-check.mjs, which uses the same numbers. */

export const WORDS_PER_MINUTE = 150
/** Seconds to do each kind of slide, on top of reading it. */
export const SECONDS_PER_KIND: Record<Slide['kind'], number> = {
  learn: 10, script: 30, tap: 15, order: 30, quiz: 15, scenario: 35, number: 45, reflect: 120, checklist: 45,
}

const words = (s?: string) => (s ? s.split(/\s+/).filter(Boolean).length : 0)

function slideWords(s: Slide): number {
  const n = words(s.nova)
  switch (s.kind) {
    case 'learn': return n + words(s.title) + words(s.text) + (s.points ?? []).reduce((a, p) => a + words(p), 0) + words(s.example) + words(s.tip)
      + (s.table ? [s.table.head, ...s.table.rows].flat().reduce((a, c) => a + words(c), 0) : 0) + (s.screen ? 10 : 0)
    case 'script': return n + words(s.title) + words(s.text) + s.lines.reduce((a, l) => a + words(l), 0) + words(s.tip)
    case 'tap': return n + words(s.prompt) + words(s.hint) + s.screen.buttons.length * 2
    case 'order': return n + words(s.prompt) + s.steps.reduce((a, x) => a + words(x), 0)
    case 'quiz': return n + words(s.q) + s.options.reduce((a, o) => a + words(o), 0) + words(s.why)
    // People read every option, then about half the feedback before they land on the best one.
    case 'scenario': return n + words(s.situation) + s.options.reduce((a, o) => a + words(o.text) + words(o.feedback) / 2, 0)
    case 'number': return n + words(s.q) + words(s.hint) + words(s.why)
    case 'reflect': return n + words(s.prompt) + words(s.example)
    case 'checklist': return n + words(s.prompt) + s.items.reduce((a, x) => a + words(x), 0)
  }
}

export function lessonMinutes(l: Lesson): number {
  const secs = l.slides.reduce((a, s) => a + (slideWords(s) / WORDS_PER_MINUTE) * 60 + SECONDS_PER_KIND[s.kind], 0)
  return Math.max(1, Math.round(secs / 60))
}
