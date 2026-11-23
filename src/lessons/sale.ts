import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'sale', title: 'Run a sale on old stock', track: 'Sell', icon: 'clock', minutes: 2,
  why: 'Old stock is cash stuck on a shelf. A sale turns it back into money.',
  route: { to: '/live', label: 'Get ready for live' },
  covers: ['src/pages/LivePrep.tsx', 'src/pages/Home.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'The alert', text: 'When pieces pass your old-stock age (set in Settings), Home and Get ready for live show how many and nudge you to run a sale.',
      screen: { title: 'Home', rows: ['56 items have been in stock 60+ days'], buttons: ['Run a sale'], highlight: 'Run a sale' } },
    { kind: 'learn', title: 'Oldest first', text: 'Run a sale opens sale mode with the oldest items on top. Tap Add all to put them in your cart, then set your sale prices at checkout.' },
    { kind: 'quiz', q: 'What starts the old-stock alert?', options: ['Items older than your days in Settings', 'Items with no photo', 'Damaged items'], answer: 0, why: 'You set the age in Settings → Goals, alerts and defaults.' },
  ],
}
export default lesson
