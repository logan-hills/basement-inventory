import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'tiktok', kind: 'course', title: 'Selling on TikTok Shop', track: 'Business', icon: 'cart', minutes: 25,
  why: 'TikTok Shop puts your pieces in front of buyers who\'ve never heard of you, and lets them check out without leaving the app.',
  outcomes: ['Know what it takes to open a shop', 'List products that sell', 'Use LIVE, videos and affiliates to drive sales', 'Ship on time to protect your shop'],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Open your shop', kind: 'learn', title: 'What you need', nova: 'TikTok Shop is a whole new door. Let\'s walk through it together.',
      text: 'You sign up in TikTok Seller Center as an individual or a business, verify your identity, and link a bank account for payouts.',
      points: ['Government ID', 'Business info (or your own, as an individual seller)', 'Bank account for payouts', 'A return address and where you ship from'],
      tip: 'Requirements and fees change. Check Seller Center for today\'s rules before you start.' },
    { kind: 'learn', title: 'Rules to know', text: 'TikTok Shop is strict about some product types and about copies of name brands. Read the prohibited and restricted products list before you list anything.',
      points: ['No counterfeits or "inspired" designer pieces', 'Some categories need approval', 'Clear, honest photos and descriptions'] },
    { kind: 'quiz', q: 'Can you list a bag described as "designer inspired"?', options: ['Yes, if it\'s cheap', 'No, it breaks the rules and risks your shop', 'Only on weekends'], answer: 1, why: 'Copies of brands get listings pulled and shops penalized.' },
    { chapter: 'List products that sell', kind: 'learn', title: 'The perfect listing', text: 'Your listing is your salesperson when you\'re not on camera.',
      points: ['Bright main photo on a clean background', 'Title with what it is, color, size, material', 'A short video of it in use', 'Honest measurements', 'A fair price including shipping'] },
    { kind: 'order', title: 'Build a listing', prompt: 'Order the listing steps.', steps: ['Take a bright main photo', 'Write a clear title', 'Add measurements and details', 'Set price and stock', 'Publish and share a video'] },
    { chapter: 'Drive the sales', kind: 'learn', title: 'Three engines', nova: 'Here\'s where TikTok Shop gets fun.',
      text: 'Sales on TikTok Shop come from three places.',
      points: ['Shoppable videos: tag the product in your video', 'LIVE shopping: pin products while you sell on camera', 'Affiliates: other creators sell your pieces for a commission'] },
    { kind: 'learn', title: 'Affiliates are your sales team', text: 'Set a commission and invite creators who fit your style. They post, you ship, everybody eats. Send samples to the creators who match your dream buyer.' },
    { kind: 'quiz', q: 'An affiliate is…', options: ['A creator who promotes your products for a commission', 'A TikTok employee', 'A shipping company'], answer: 0, why: 'Affiliates bring their audience to your products.' },
    { chapter: 'Ship it right', kind: 'learn', title: 'Speed protects your shop', text: 'TikTok tracks how fast you ship and how many orders are late or canceled. Miss too often and your shop gets limited. Keep stock counts accurate so you never sell what you don\'t have.',
      tip: 'Keep TikTok stock in sync with this app so a piece that sold on your Facebook live doesn\'t sell again on TikTok.' },
    { kind: 'quiz', q: 'A piece sold on your Facebook live. It\'s still listed on TikTok Shop. What do you do?', options: ['Leave it', 'Update or remove the TikTok listing right away', 'Wait for a TikTok order, then cancel it'], answer: 1, why: 'Canceling orders hurts your shop health. Update stock right away.' },
    { kind: 'reflect', title: 'Your first 5', prompt: 'Which five pieces would you list first, and why?', placeholder: '1. …', example: 'My best-selling gold hoops, two totes, a scarf set, and the pearl bracelet. They photograph well and ship small.' },
  ],
}
export default lesson
