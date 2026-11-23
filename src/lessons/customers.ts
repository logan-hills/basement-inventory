import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'customers', title: 'Know your customers', track: 'Grow', icon: 'users',
  why: 'Your regulars are your business. Knowing them lets you thank them and sell to them better.',
  route: { to: '/customers', label: 'Open Customers' },
  covers: ['src/pages/Customers.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Built for you', text: 'Every sale you bring in adds or updates the customer: name, Facebook name, address, and everything they\'ve bought.' },
    { kind: 'learn', title: 'Spot your VIPs', text: 'Sort by spend to find your top buyers. Shout them out on live, or save a piece they\'d love.', tip: 'A thank-you by name on live is the cheapest marketing there is.' },
    { kind: 'quiz', q: 'How do customers get into the app?', options: ['Automatically, from your sales', 'You type each one in'], answer: 0, why: 'Uploading sales (or the comment bot) creates and updates them.' },
  ],
}
export default lesson
