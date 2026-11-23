import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'shipping', title: 'Ship with Pirate Ship', track: 'Pack and ship', icon: 'truck', minutes: 2,
  why: 'Buying all your labels in one go saves hours and money.',
  route: { to: '/shipping', label: 'Open Shipping' },
  covers: ['src/pages/Shipping.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'One file, every label', text: 'Shipping → Download for Pirate Ship makes a file with every packed box and address. Import it at Pirate Ship and buy the labels.',
      screen: { title: 'Shipping', buttons: ['Download for Pirate Ship', 'Shipped'], highlight: 'Download for Pirate Ship' } },
    { kind: 'learn', title: 'Close it out', text: 'Paste each tracking number back here and tap Shipped. The order moves to done and the customer\'s history is up to date.', tip: 'Add item weights when receiving and your shipping file is even more accurate.' },
    { kind: 'order', title: 'Practice', prompt: 'Put the steps in order.', steps: ['Download for Pirate Ship', 'Import at Pirate Ship and buy labels', 'Paste tracking numbers', 'Tap Shipped'] },
  ],
}
export default lesson
