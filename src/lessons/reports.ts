import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'reports', title: 'Read your money', track: 'Grow', icon: 'reports',
  why: 'Knowing what sells and what sits helps you buy smarter and earn more.',
  route: { to: '/reports', label: 'Open Reports' },
  covers: ['src/pages/Reports.tsx', 'src/pages/Home.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'The big numbers', text: 'Reports (Money in the dock) shows sales, profit, what\'s sitting on your shelves, and your monthly goal.' },
    { kind: 'learn', title: 'Sales by live', text: 'Each bar is one live. Hover or tap a bar for the total. Look for which themes and nights bring in the most.' },
    { kind: 'learn', title: 'Best sellers and stock age', text: 'Best sellers tells you what to buy more of. Stock age shows how much has been sitting, with the oldest in the darkest gold.' },
    { kind: 'quiz', q: 'Which live night earned the most? Where do you look?', options: ['Sales by live', 'Stock age', 'Settings'], answer: 0, why: 'Sales by live shows each show\'s total.' },
  ],
}
export default lesson
