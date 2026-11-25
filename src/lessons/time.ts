import type { Lesson, Slide, Visual } from './types'

/* How long a lesson really takes, worked out from its content so the minutes on every card
   are honest. Reading pace is an ordinary adult pace for learning material (about 200 words a
   minute; 2026-11-25 Logan found the old 150 too generous: lessons read in a third of the time),
   plus time to look at each picture, answer each practice and write in the workbook.
   Keep in step with scripts/lessons-check.mjs, which uses the same numbers. */

export const WORDS_PER_MINUTE = 200
/** Seconds to do each kind of slide, on top of reading it. */
export const SECONDS_PER_KIND: Record<Slide['kind'], number> = {
  learn: 10, howto: 20, recap: 10, script: 30, tap: 15, order: 30, quiz: 15, scenario: 35, number: 45, reflect: 120, checklist: 45,
}

const words = (s?: string) => (s ? s.split(/\s+/).filter(Boolean).length : 0)
const all = (xs: (string | undefined)[]) => xs.reduce((a, x) => a + words(x), 0)

/** Words in a picture, plus about 15 seconds (50 words' worth) to take it in. */
function visualWords(v?: Visual): number {
  if (!v) return 0
  const n = words(v.caption) + 50
  switch (v.type) {
    case 'flow': return n + all(v.steps.flatMap(x => [x.label, x.note]))
    case 'compare': return n + all([v.left.title, ...v.left.items, v.right.title, ...v.right.items])
    case 'bars': return n + all(v.bars.flatMap(x => [x.label, x.note])) + v.bars.length
    case 'stats': return n + all(v.stats.flatMap(x => [x.value, x.label]))
    case 'split': return n + words(v.total) + all(v.parts.flatMap(x => [x.label, x.note])) + v.parts.length
  }
}

function slideWords(s: Slide): number {
  const n = words(s.nova) + words(s.queen)
  switch (s.kind) {
    case 'learn': return n + words(s.title) + words(s.text) + (s.points ?? []).reduce((a, p) => a + words(p), 0) + words(s.example) + words(s.tip)
      + (s.table ? [s.table.head, ...s.table.rows].flat().reduce((a, c) => a + words(c), 0) : 0) + (s.screen ? 10 : 0) + visualWords(s.visual) + (s.term ? words(s.term.word) + words(s.term.meaning) : 0)
    case 'howto': return n + words(s.title) + words(s.text) + s.steps.reduce((a, x) => a + words(x.title) + words(x.detail) + words(x.example), 0) + words(s.tip)
    case 'recap': return n + words(s.title) + all(s.points)
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

/** Words a seller reads in a lesson (her own notes, pictures and practice time not counted).
    lessons:check flags lessons under DEEP_WORDS as thin: they need more real how-to. */
export const DEEP_WORDS = 2000
export function lessonWords(l: Lesson): number {
  return (l.queen ? words(l.queen.welcome) + words(l.queen.signoff) : 0) + l.slides.reduce((a, s) => a + slideWords(s), 0)
}

export function lessonMinutes(l: Lesson): number {
  const note = l.queen ? ((words(l.queen.welcome) + words(l.queen.signoff)) / WORDS_PER_MINUTE) * 60 : 0
  const secs = note + l.slides.reduce((a, s) => a + (slideWords(s) / WORDS_PER_MINUTE) * 60 + SECONDS_PER_KIND[s.kind], 0)
  return Math.max(1, Math.round(secs / 60))
}
