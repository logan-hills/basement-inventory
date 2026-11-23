import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'shipfast', kind: 'course', title: 'Ship fast, keep them coming back', track: 'Business', icon: 'truck', minutes: 15,
  why: 'Fast shipping is the moment your buyer decides if she\'ll shop with you again.',
  outcomes: ['Set a ship-by promise you can keep', 'Run a weekly pack-and-ship routine', 'Make unboxing feel special on a budget'],
  route: { to: '/orders', label: 'Open Pick and pack' },
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Speed is service', kind: 'learn', title: 'Why speed wins', nova: 'Think about the last time a package took forever. How did you feel about that seller?',
      text: 'Buyers judge you most between "paid" and "delivered." Fast, tracked shipping builds trust that brings them back to your next live.' },
    { kind: 'learn', title: 'Pick a promise you can keep', text: 'Say it at every live: "Orders ship within X business days." Then beat it.',
      points: ['Under-promise, over-deliver', 'Say it at the start and end of your live', 'Put it in your invoice note'] },
    { kind: 'quiz', q: 'You usually ship in 2 days. What should you promise?', options: ['Same day', '3 business days, then beat it', 'No promise'], answer: 1, why: 'A promise you beat feels like a gift. One you miss feels like a lie.' },
    { chapter: 'Your routine', kind: 'learn', title: 'The pack-and-ship rhythm', text: 'Use the same routine every week so nothing slips.',
      points: ['Night after the live: upload sales, print box labels', 'Next day: pick and pack (scan item, scan box)', 'Buy labels in one batch through Pirate Ship', 'Drop off or schedule pickup', 'Mark shipped with tracking'] },
    { kind: 'order', title: 'Put it in order', prompt: 'Order the routine.', steps: ['Upload sales', 'Print box labels', 'Pick and pack', 'Buy labels in one batch', 'Drop off and mark shipped'] },
    { kind: 'learn', title: 'Unboxing on a budget', text: 'The box is the last thing your brand says. Make it count for pennies.',
      points: ['Tissue in your brand color', 'A handwritten "thank you, [name]"', 'A sticker or card with your live day', 'A tiny freebie for regulars'] },
    { kind: 'quiz', q: 'Cheapest way to make unboxing feel special?', options: ['A handwritten thank-you', 'Overnight shipping', 'A bigger box'], answer: 0, why: 'Personal beats expensive.' },
    { kind: 'reflect', title: 'Your ship-by promise', prompt: 'Write the shipping promise you\'ll say on every live.', placeholder: 'Orders ship within…', example: 'Orders ship within 3 business days of payment, with tracking sent to your inbox.' },
  ],
}
export default lesson
