import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'liveprep', title: 'Get ready for live', track: 'Sell', icon: 'live', minutes: 4,
  why: 'Choosing what to sell ahead of time means a smooth show and a bot that\'s ready to take claims.',
  route: { to: '/live', label: 'Get ready for live' },
  covers: ['src/pages/LivePrep.tsx', 'src/lib/cart.ts', 'src/pages/LiveDetail.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Shop your own shelves', text: 'Get ready for live works like an online store. Filter by category or tag, sort by oldest or best profit. Each card shows how many are on your shelf.' },
    { kind: 'learn', title: 'Add to cart takes it all', text: 'Add to cart adds the whole quantity on your shelf, so you can say "I have 6 of these" on live. Sizes and colors sit side by side as their own cards.',
      screen: { title: 'Gold hoop set · Small', rows: ['6 on shelf', '$12'], buttons: ['Add to cart'], highlight: 'Add to cart' } },
    { kind: 'learn', title: 'Check out to a live', text: 'Open the cart, set any special live prices, choose the live, and check out. The items are now on that live\'s list.' },
    { kind: 'learn', title: 'Send the list to your bot', text: 'Open the live and tap Download bot CSV, then upload it to your bot. Change the columns in Settings → Bot CSV columns if your bot needs different names.' },
    { kind: 'order', title: 'Practice', prompt: 'Put the steps in order.', steps: ['Filter and pick items', 'Add to cart', 'Pick the live and check out', 'Download bot CSV'] },
    { kind: 'quiz', q: 'You have 4 Small and 2 Medium. You tap Add to cart on Small. How many go in?', options: ['4', '1', '6'], answer: 0, why: 'It adds everything on your shelf for that one variation.' },
  ],
}
export default lesson
