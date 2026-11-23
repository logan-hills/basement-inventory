import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'calendar', title: 'Schedule your lives', track: 'Sell', icon: 'calendar', minutes: 2,
  why: 'A steady schedule trains your buyers to show up.',
  route: { to: '/calendar', label: 'Open the calendar' },
  covers: ['src/pages/Calendar.tsx', 'src/components/LiveForm.tsx', 'src/pages/LiveDetail.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Put it on the calendar', text: 'Tap a day (or Schedule a live). Give it a title, theme, host, start time and length. Set it to repeat weekly for your regular show.' },
    { kind: 'learn', title: 'Projected total', text: 'Each live shows what it brings in if everything on its list sells, and the profit after cost.' },
    { kind: 'learn', title: 'Mark it done', text: 'After the show, open the live and tap Mark live as done. Your streak on Home grows with every live.' },
    { kind: 'quiz', q: 'You go live every Tuesday. Fastest way to add them all?', options: ['Set the live to repeat weekly', 'Add each one by hand'], answer: 0, why: 'Repeat weekly fills the calendar for you.' },
  ],
}
export default lesson
