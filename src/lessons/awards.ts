import type { Progress } from '../lib/lessonProgress'
import { LESSONS, COURSES } from './index'
import { SCHOOLS, TRACKS, TRACK_TONE } from './types'

/* Milestones and certificates in Dazzle University. Everything is worked out from lesson
   progress, so there's nothing extra to save. Add a milestone here and it shows up on the
   My certificates page, and on the finish screen of the lesson that earns it. */

export type AwardKind = 'milestone' | 'module' | 'orientation' | 'course' | 'school'
export type Award = {
  id: string
  kind: AwardKind
  /** Big name on the certificate or badge. */
  title: string
  /** What it's for, in one line. */
  line: string
  tone: string
  icon: string
  /** The lessons or courses that earn it. */
  lessons: string[]
  /** How many of `lessons` must be done (all of them, unless set). */
  need: number
  /** What the seller can now do (course certificates list these). */
  outcomes?: string[]
}
export type AwardStatus = Award & { have: number; earned: boolean; date: string | null }

const ids = (l: { id: string }[]) => l.map(x => x.id)

export const MODULE_TITLES: Record<string, string> = {
  'Start here': 'Shop Founder', Stock: 'Stock Room Pro', Sell: 'Live Selling Star', 'Pack and ship': 'Shipping Ace', Grow: 'Growth Getter', Business: '',
}

export const AWARDS: Award[] = [
  { id: 'm-first', kind: 'milestone', title: 'First Step', line: 'Finished your very first lesson', tone: 'fuchsia', icon: 'sparkle', lessons: ids(LESSONS), need: 1 },
  { id: 'm-five', kind: 'milestone', title: 'On a Roll', line: 'Five orientation lessons done', tone: 'violet', icon: 'trend', lessons: ids(LESSONS), need: 5 },
  ...TRACKS.map((t, i): Award => ({
    id: `mod-${i + 1}`, kind: 'module', title: MODULE_TITLES[t], line: `Orientation Module ${i + 1}: ${t}`, tone: TRACK_TONE[t], icon: LESSONS.find(l => l.track === t)?.icon ?? 'sparkle',
    lessons: ids(LESSONS.filter(l => l.track === t)), need: LESSONS.filter(l => l.track === t).length,
  })),
  { id: 'orientation', kind: 'orientation', title: 'Orientation Graduate', line: 'Every orientation lesson, start to finish', tone: 'gold', icon: 'lessons', lessons: ids(LESSONS), need: LESSONS.length },
  { id: 'm-course1', kind: 'milestone', title: 'Business Student', line: 'Finished your first business course', tone: 'gold', icon: 'reports', lessons: ids(COURSES), need: 1 },
  { id: 'm-course5', kind: 'milestone', title: 'Dean\'s List', line: 'Five business courses done', tone: 'cobalt', icon: 'trend', lessons: ids(COURSES), need: 5 },
  { id: 'm-course10', kind: 'milestone', title: 'Honor Roll', line: 'Ten business courses done', tone: 'emerald', icon: 'dollar', lessons: ids(COURSES), need: 10 },
  { id: 'm-course20', kind: 'milestone', title: 'Boss Scholar', line: 'Twenty business courses done', tone: 'crimson', icon: 'gift', lessons: ids(COURSES), need: 20 },
  ...SCHOOLS.filter(s => COURSES.some(c => c.school === s.id)).map((s): Award => ({
    id: `school-${s.tone}`, kind: 'school', title: s.id, line: `Every course in the School of ${s.id}`, tone: s.tone, icon: s.icon,
    lessons: ids(COURSES.filter(c => c.school === s.id)), need: COURSES.filter(c => c.school === s.id).length,
  })),
  { id: 'm-all', kind: 'milestone', title: 'Summa Cum Dazzle', line: 'Every lesson and every course in the University', tone: 'plum', icon: 'sparkle', lessons: ids([...LESSONS, ...COURSES]), need: LESSONS.length + COURSES.length },
  ...COURSES.map((c): Award => ({
    id: `course-${c.id}`, kind: 'course', title: c.title, line: c.school ? `School of ${c.school}` : 'Business course', tone: SCHOOLS.find(s => s.id === c.school)?.tone ?? 'gold', icon: c.icon,
    lessons: [c.id], need: 1, outcomes: c.outcomes,
  })),
]

/** Every award with how far along it is. The date is when the last needed lesson was finished. */
export function awardStatus(progress: Record<string, Progress | undefined>): AwardStatus[] {
  return AWARDS.map(a => {
    const dates = a.lessons.map(id => progress[id]?.completed_at).filter((d): d is string => !!d).sort()
    const earned = dates.length >= a.need
    return { ...a, have: Math.min(dates.length, a.need), earned, date: earned ? dates[a.need - 1] : null }
  })
}

/** A short serial for the certificate, like DU-4127. Same award, same shop, same number. */
export function serial(a: Award, shopId = ''): string {
  let h = 7
  for (const ch of a.id + shopId) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return `DU-${(h % 9000) + 1000}`
}

/** A number from 0 to 1 that's always the same for an award: used to vary each certificate's pattern. */
export function seed(id: string): number {
  let h = 2166136261
  for (const ch of id) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0
  return (h % 1000) / 1000
}
