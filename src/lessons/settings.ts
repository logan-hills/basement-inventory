import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'settings', title: 'Make the app yours in Settings', track: 'Start here', icon: 'settings', minutes: 3,
  why: 'Your categories, tags, themes and checklists show up in every dropdown, so setting them once saves typing forever.',
  route: { to: '/settings', label: 'Open Settings' },
  covers: ['src/pages/Settings.tsx', 'src/lib/settings.ts'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Your lists, your words', text: 'Settings holds the lists the whole app uses. Add, rename or remove anything.',
      points: ['Categories (Jewelry, Bags, Apparel…)', 'Item tags (Holiday, Plus size, New arrival…)', 'Live themes and hosts', 'Bot CSV columns'],
      screen: { title: 'Customize your shop', rows: ['Categories', 'Item tags', 'Live themes', 'Hosts'], buttons: ['Add'], highlight: 'Add' } },
    { kind: 'learn', title: 'Goals, alerts and defaults', text: 'Set your monthly sales goal (Home tracks it), how many days before stock counts as "old" (it triggers Run a sale), and how long your lives usually run.' },
    { kind: 'learn', title: 'Your live checklists', text: 'Write the steps you do before, during and after every live. Each new live starts with this checklist in its Planner, and Home shows the next few steps.', tip: 'Add the things you tend to forget, like "charge the ring light".' },
    { kind: 'tap', title: 'Practice', prompt: 'You started selling shoes. Where do you add "Shoes" so it shows in the dropdown when receiving items?', screen: { title: 'Customize your shop', buttons: ['Categories', 'Hosts', 'Live themes', 'Bot CSV columns'] }, answer: 'Categories', hint: 'The kind of product is a category. Tags are extra labels like "Holiday".' },
    { kind: 'quiz', q: 'Stock starts showing in Run a sale when…', options: ['It passes your "old stock" days in Settings', 'It has no photo', 'It is in the cart'], answer: 0, why: 'You choose the number of days in Settings → Goals, alerts and defaults.' },
    { kind: 'quiz', q: 'Your bot wants a column called "SKU" instead of "Live #". What do you do?', options: ['Rename it in Settings → Bot CSV columns', 'Edit every item', 'Nothing can be done'], answer: 0, why: 'Bot CSV columns let you match whatever your bot expects.' },
  ],
}
export default lesson
