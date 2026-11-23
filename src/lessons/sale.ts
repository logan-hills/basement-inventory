import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'sale', title: 'Run a sale on old stock', track: 'Sell', icon: 'clock',
  why: 'Old stock is cash stuck on a shelf. A sale turns it back into money.',
  outcomes: [
    'Explain why old stock costs you money every week it sits',
    'Use a simple markdown ladder at 30, 60 and 90 days',
    'Find your floor price so a sale never loses money',
    'Pick the right sale format: mixed in, clearance live, bundles or $2 rounds',
    'Know when to stop discounting and let a piece go',
  ],
  route: { to: '/live', label: 'Get ready for live' },
  covers: ['src/pages/LivePrep.tsx', 'src/pages/Home.tsx'], updated: '2026-11-23',
  slides: [
    { chapter: 'Why old stock hurts', kind: 'learn', title: 'Cash on a shelf', nova: 'Let\'s get that money moving, sis.',
      text: 'Every piece on your shelf is money you already spent. While it sits, it can\'t buy the new pieces your buyers are asking for. The longer it sits, the less it\'s worth: trends move on, seasons pass, and it starts to look tired.',
      points: ['It ties up cash you could use for fresh stock', 'It takes up bins your best sellers need', 'Buyers who\'ve seen it three lives in a row stop noticing it', 'Some pieces date: holiday, trends, colors of the season'] },
    { kind: 'learn', title: 'The math of waiting', text: 'Holding out for full price often costs more than a sale. Compare two choices for 20 bags you paid $8 each for.',
      table: { head: ['', 'Wait for full price ($25)', 'Sale now ($15)'], rows: [
        ['Sold this month', '4', '16'],
        ['Money in this month', '$100', '$240'],
        ['Cash still stuck on the shelf (at cost)', '$128', '$32'],
        ['What you can buy with it now', '$100 of new stock', '$240 of new stock'],
      ] },
      tip: 'Fresh stock is what keeps buyers coming back. Moving old stock pays for it.' },

    { chapter: 'The alert', kind: 'learn', title: 'The alert', text: 'When pieces pass your old-stock age (set in Settings), Home and Get ready for live show how many and nudge you to run a sale.',
      screen: { title: 'Home', rows: ['56 items have been in stock 60+ days'], buttons: ['Run a sale'], highlight: 'Run a sale' } },
    { kind: 'learn', title: 'Oldest first', text: 'Run a sale opens Sale mode: oldest stock first. Tap Add all to put them in your cart, or pick the ones you want, then set your sale prices at checkout as live prices.' },
    { kind: 'quiz', q: 'What starts the old-stock alert?', options: ['Items older than your days in Settings', 'Items with no photo', 'Damaged items'], answer: 0, why: 'You set the age in Settings → Goals, alerts and defaults.' },
    { kind: 'tap', title: 'Practice', prompt: 'Home says 56 items are past 60 days. You want to start a sale. Tap…', screen: { title: 'Home', rows: ['56 items have been in stock 60+ days'], buttons: ['Plan a live', 'Run a sale', 'Reports'] }, answer: 'Run a sale', hint: 'Run a sale opens Get ready for live in sale mode, oldest first.' },

    { chapter: 'Price it right', kind: 'learn', title: 'A markdown ladder', text: 'Don\'t guess every time. Decide your steps once, then follow them. Here\'s a ladder many resellers use, counting from the day it arrived.',
      table: { head: ['Age', 'Price', 'Where'], rows: [
        ['0 to 30 days', 'Full price', 'Featured in regular lives'],
        ['30 to 60 days', '20 to 25% off', 'Mixed into regular lives'],
        ['60 to 90 days', '40 to 50% off', 'Clearance segment or clearance live'],
        ['90+ days', 'Floor price, bundle, or let it go', '$2 rounds, bundles, donate'],
      ] } },
    { kind: 'learn', title: 'Your floor price', text: 'Your floor is the lowest price where you don\'t lose money on the sale itself: what you paid, plus the fee, plus packaging. Below the floor, you\'re paying the buyer to take it.',
      table: { head: ['', 'Example'], rows: [
        ['What you paid', '$6.00'],
        ['Packaging', '$0.50'],
        ['Fee (about 3% of a ~$7 price)', '$0.21'],
        ['Floor price', 'about $6.71, so $7'],
      ] },
      tip: 'Anything you bought for pennies in a big lot (like $2 Tuesday stock) has a low floor, so $2 rounds still make money.' },
    { kind: 'number', title: 'Find the floor', q: 'You paid $9 for a bag. Packaging is $0.60. Ignore the fee for now. What\'s the lowest price that covers your costs?', prefix: '$', answer: 9.6, tolerance: 0.01, hint: 'Add what you paid and the packaging.', why: '$9 + $0.60 = $9.60. With a small fee on top, call it $10. Any sale price from $10 up is still money in your pocket.' },
    { kind: 'number', title: '40% off', q: 'A top is $20. It\'s 70 days old, so it moves to 40% off on your ladder. What\'s the sale price?', prefix: '$', answer: 12, hint: '40% of $20 is $8. Take that off.', why: '$20 − $8 = $12. Check it\'s above your floor, then it\'s good to go.' },

    { chapter: 'Pick a format', kind: 'learn', title: 'Four ways to run a sale', text: 'How you sell old stock matters as much as the price.',
      table: { head: ['Format', 'How it works', 'Best for'], rows: [
        ['Mixed in', 'A few old pieces between fresh ones in a regular live', 'Light markdowns, every live'],
        ['Clearance live', 'A whole themed live: "Basement Clearance, everything under $10"', 'Clearing a lot at once'],
        ['Bundles', '"Fill the bag: any 3 for $15"', 'Small, low-priced pieces'],
        ['Flash $2 rounds', '2 minutes, $2 each, go!', 'Pieces at or near their floor'],
      ] } },
    { kind: 'scenario', title: 'Twelve scarves won\'t move', situation: 'You have 12 scarves, 95 days old, that you paid $2 each for. You\'ve shown them on three lives at $10 with no takers.',
      options: [
        { text: 'Keep showing them at $10, someone will want them eventually', feedback: 'Three lives with no takers is your answer. Keeping the price is keeping your cash stuck.' },
        { text: 'Make them a bundle: "Add any scarf to your order for $3" or "3 for $8"', best: true, feedback: 'Still above your $2 floor, easy yeses, and they raise your average order. Bundles are made for this.' },
        { text: 'Throw them out', feedback: 'They still have value. Bundle or flash them first, and donate only what\'s left.' },
      ] },
    { kind: 'script', title: 'Announce a clearance live', lines: [
      'POST: "🚨 BASEMENT CLEARANCE 🚨 Thursday 7 PM ET. I\'m making room for new arrivals, so EVERYTHING is under $10, bags, jewelry, scarves. When it\'s gone, it\'s gone!"',
      'ON LIVE: "Family, these are pieces I love, I just need the room. Tonight\'s the lowest they\'ll ever be. Let\'s clear these shelves together!"',
    ], tip: 'Frame it as making room for new pieces, not as "stuff nobody wanted."' },

    { chapter: 'Keep it healthy', kind: 'learn', title: 'Let it go', text: 'Some pieces just won\'t sell to your crowd, and that\'s okay. Past 120 days and below your floor? Donate it, give it away as a free bonus to regulars, or sell it in a bulk lot to another reseller. Then learn from it: what made you buy it, and will you buy that kind of piece again?' },
    { kind: 'quiz', q: 'Half your clearance pile is neon tops. What\'s the lesson for next time?', options: ['Buy more neon to try again', 'Your crowd doesn\'t go for neon, so buy less of it (or none) next haul', 'Lower prices on everything'], answer: 1, why: 'Old stock is feedback about buying. Reports → Best sellers and Oldest stock show you what to buy more of, and less of.' },
    { kind: 'quiz', q: 'When is a sale price too low?', options: ['When it\'s below your floor price', 'When it\'s under $10', 'Never, any sale is good'], answer: 0, why: 'Below the floor you lose money on the sale itself. Bundle or donate instead.' },
    { kind: 'reflect', title: 'Your markdown ladder', prompt: 'Write your own markdown steps: what discount at what age, and what you\'ll do with anything past 90 or 120 days.', placeholder: '30 days: … 60 days: … 90 days: …', example: '30 days: 20% off, mixed in. 60 days: 40% off in a clearance segment. 90 days: bundles and $2 rounds. 120 days: donate and write down why it didn\'t sell.' },
    { kind: 'checklist', title: 'Run your first sale', prompt: 'Tick each step.', items: [
      'Check my old-stock days in Settings',
      'Tap Run a sale and review the oldest pieces',
      'Set sale prices from my ladder, above my floor',
      'Pick a format: mixed in, clearance live, bundles or flash rounds',
      'Post about it 2 days ahead',
      'After the live, note what still didn\'t sell',
    ] },
  ],
}
export default lesson
