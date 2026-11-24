import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'shipprice', kind: 'course', school: 'Money and buying', title: "Price your shipping so it doesn't eat your profit", track: 'Business', icon: 'truck',
  why: "Shipping is where quiet losses hide: a few ounces over a tier, a box one inch too big, a 'free shipping' promise nobody did the math on. Get your shipping price right once, and every order keeps more of your profit.",
  outcomes: [
    'Add up your true cost to ship an order, not just the label',
    'Use weight tiers, box size and cubic pricing to pay less per label',
    'Choose between flat, weight-based and combined shipping for your lives',
    'Work out a free-shipping threshold that still makes money',
    'Plan for rate changes and holiday surcharges ahead of time',
  ],
  route: { to: '/shipping', label: 'Open Shipping' },
  sources: [
    { org: 'USPS Newsroom', title: 'USPS recommends competitive price changes for July 2026', url: 'https://about.usps.com/newsroom/national-releases/2026/0511-usps-recommends-competitive-price-changes-for-july-2026.htm' },
    { org: 'USPS Newsroom', title: 'USPS announces temporary price change for 2026 holiday shipping season', url: 'https://about.usps.com/newsroom/national-releases/2026/0825-usps-announces-temporary-price-change-for-2026-holiday-shipping-season.htm' },
    { org: 'Pirate Ship Support', title: 'July 2026 USPS rate and rule changes', url: 'https://support.pirateship.com/en/articles/15453569-july-2026-usps-rate-and-rule-changes' },
    { org: 'Federal Trade Commission', title: "Business guide to the FTC's Mail, Internet, or Telephone Order Merchandise Rule", url: 'https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule' },
    { org: 'Harvard Business School Working Knowledge', title: 'The right way to manage churn for maximum profit', url: 'https://www.library.hbs.edu/working-knowledge/the-right-way-to-manage-churn-for-maximum-profit' },
  ],
  queen: {
    welcome: "I've seen sellers sell out a whole live and still lose money, and shipping was the leak almost every time. This course is about plugging that leak without making your buyers feel nickel-and-dimed. Grab a recent order and your kitchen scale. We're going to do real math.",
    signoff: "Know your true cost, weigh every box, and price shipping on purpose. Your buyers will feel taken care of, and your profit will finally stay in your pocket.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'The true cost', queen: "Count your time when you price shipping. If you don't value your time, nobody else will either.", kind: 'learn', title: 'The label is only part of it', nova: "Most sellers know their label price. Almost nobody knows their real shipping cost. Let's find yours.",
      text: "Every order you ship costs more than the label. Add it all up once, and you'll know what your shipping charge needs to cover.",
      table: { head: ['One small order', 'Example'], rows: [
        ['Label (Ground Advantage, 10 oz, example rate)', '$5.40'],
        ['Poly mailer', '$0.22'],
        ['Tissue, sticker and thank-you card', '$0.35'],
        ['Tape and label paper', '$0.08'],
        ['Your time: 4 minutes at $15/hour', '$1.00'],
        ['Total cost to ship', '$7.05'],
      ] },
      tip: "Label prices in this course are examples. USPS changes rates during the year, so check Pirate Ship for today's price." },
    { kind: 'number', title: 'Your true cost', q: 'Your label costs $6.10. Your box is $0.85, packing paper and tape are $0.20, and your thank-you card and sticker are $0.30. Packing takes you 6 minutes and you value your time at $15 an hour. What does it really cost to ship this order?', prefix: '$', answer: 8.95, tolerance: 0.02, hint: '6 minutes is a tenth of an hour, so $1.50 of time.', why: '$6.10 + $0.85 + $0.20 + $0.30 + $1.50 = $8.95. If you charge $7 for shipping, you\'re quietly paying almost $2 on every box.' },
    { kind: 'learn', title: 'Why it matters more than it looks', text: "A $2 shipping gap doesn't sound like much. But it happens on every single order. Over a year it can wipe out the profit from a whole category.",
      example: "Brenda ships about 60 orders a week and undercharged by $1.75 each. That's $105 a week, or about $5,460 a year. It was her whole holiday profit, gone into boxes." },

    { chapter: 'Pay less per label', queen: "Keep a small digital scale right at your packing station. Guessing weights is how money slips away.", kind: 'learn', title: 'Weight tiers: ounces are money', text: "USPS Ground Advantage is priced by weight tiers. Going one ounce over a tier can bump you into the next price. Under 1 pound, the common tiers are 4, 8, 12 and 15.99 ounces. Then it goes by the pound, and distance (zone) matters too.",
      table: { head: ['Package weighs', 'You pay the price for'], rows: [
        ['3.5 oz', 'Up to 4 oz'],
        ['8.2 oz', 'Up to 12 oz (just missed 8!)'],
        ['15.5 oz', 'Up to 15.99 oz'],
        ['16.2 oz', '1 pound (just missed!)'],
      ] },
      tip: "Weigh the packed box, not just the item. The mailer, tissue and card count too." },
    { kind: 'quiz', q: 'Your packed mailer weighs 8.3 oz. What is the easiest way to save on the label?', options: ['Add more tissue so it looks nicer', 'Switch to a lighter mailer or skip the heavy card so it drops to 8 oz or less', 'Pay for Priority Mail instead', 'Round down when you type the weight'], answer: 1, why: "Trimming a few tenths of an ounce can drop you a whole tier. Never type a lower weight than the real one, though. The carrier can charge you the difference later." },
    { kind: 'learn', title: 'Box size and cubic pricing', text: "Size matters as well as weight. Big, light boxes can be charged by size (called dimensional weight) once they pass a certain size. Small, heavy boxes are the opposite: through apps like Pirate Ship, cubic pricing charges by how big the box is, not how heavy, which can make a small box of jewelry or shoes much cheaper.",
      points: ['Use the smallest box or mailer the item fits in safely', 'Keep a few sizes on hand instead of one big box for everything', 'For small, heavy orders, compare the cubic price in Pirate Ship', 'Measure boxes to the nearest quarter inch and enter them honestly'],
      example: "A 3-pound pair of boots in a snug 12 × 8 × 5 box can come out cheaper with cubic pricing than by weight. The same boots in a roomy 16-inch box cost more and rattle around." },
    { kind: 'scenario', title: 'The roomy box', situation: "You've been shipping every order in the same 14 × 10 × 6 box because it's easy. Most of your orders are a top or a set of earrings.",
      options: [
        { text: 'Keep the one box; it\'s simpler', feedback: "Simple, but you're paying for air on most orders, plus heavier packing." },
        { text: 'Stock two or three sizes: a poly mailer, a small box and the big one for bundles', best: true, feedback: "Smart. Most orders drop to a lighter, cheaper package, and you still have the big box when it's needed." },
        { text: 'Squeeze everything into the smallest mailer', feedback: "Cheap, but crushed items cost you refunds and regulars. Fit the item safely first." },
      ] },

    { chapter: 'What to charge', kind: 'learn', title: 'Three ways to charge for shipping', text: "Pick one method, say it on every live and put it in your pinned post. Buyers trust what's consistent.",
      table: { head: ['Method', 'How it works', 'Good for'], rows: [
        ['Flat rate', 'One price per order, like $7.99', 'Mostly light items of similar size'],
        ['By weight', 'Price tiers by total weight or item type', 'Mixed stock: jewelry to boots'],
        ['Combined week', 'Pay shipping once, add more all week from any live', 'Shops with several lives a week and regulars'],
      ] } },
    { kind: 'number', title: 'Set a flat rate', q: 'Your last 20 orders cost you a total of $148 to ship, including supplies and time. What flat rate covers your average order, rounded to the nearest cent?', prefix: '$', answer: 7.4, tolerance: 0.01, hint: '$148 ÷ 20.', why: '$148 ÷ 20 = $7.40 per order. Many sellers round up to $7.99 to cover heavier days and holiday surcharges.' },
    { queen: "Combined shipping is a love note to your regulars. Just put the rules in writing so love doesn't turn into confusion.", kind: 'learn', title: 'Combined shipping, done right', text: "Combined shipping is a gift your regulars love, and it's also how you sell more pieces per box. It only works if you set clear limits.",
      points: [
        'Name the window: "Pay shipping once, everything you add through Sunday ships together"',
        'Set a cap: "Up to 3 pounds; over that, I\'ll message you the difference"',
        'Ship on one day, so held orders don\'t pile up',
        'Write it in your shop rules and repeat it on every live',
      ],
      tip: "Under the FTC rule, ship within the time you promise. If you hold orders for combined shipping, include the hold in the ship time you state." },
    { kind: 'script', title: 'Say it on your live', lines: [
      '"Shipping is $7.99 and covers everything you claim this week. Add as much as you like through Sunday!"',
      '"Already paid shipping on Tuesday? You\'re covered tonight too, ladies."',
      '"Everything ships Monday with tracking. Bundles over 3 pounds, I\'ll message you first."',
    ] },

    { chapter: 'Free shipping math', queen: "Offer free shipping as a reward with a minimum, never as a default. Make it something buyers reach for.", kind: 'learn', title: '"Free" shipping is never free', text: "Somebody always pays for shipping. If you offer free shipping, the cost comes out of your price. That can be a great sales tool, as long as you set a minimum that covers it.",
      table: { head: ['Free shipping over $50', 'Example'], rows: [
        ['Order total', '$52.00'],
        ['Cost of the pieces', '− $18.00'],
        ['Payment fees (about 3%)', '− $1.56'],
        ['Your true shipping cost', '− $8.50'],
        ['Profit', '$23.94'],
      ] },
      tip: 'Set the minimum a little above your average order. It nudges buyers to add one more piece.' },
    { kind: 'number', title: 'Find your threshold', q: 'Your true shipping cost is about $8. Your pieces cost you 35% of the price on average, and fees are about 3%. You want at least $20 profit on any free-shipping order. What is the smallest order total that works? (Round up to the nearest dollar.)', prefix: '$', answer: 45, tolerance: 0.5, hint: 'You keep 62% of each dollar (100% − 35% − 3%). You need $20 + $8 = $28 from that 62%.', why: '$28 ÷ 0.62 = $45.16, so about $45 to $46. Most sellers would pick $50 to give themselves room.' },
    { kind: 'learn', title: 'Plan for rate changes', text: "USPS usually changes prices more than once a year, and in recent years it has added a temporary holiday price increase from early October into January for packages like Ground Advantage. When rates change, your shipping charge should too.",
      points: ['Check Pirate Ship\'s rate-change notes when USPS announces new prices', 'Re-run your true-cost math twice a year', 'Raise your shipping charge before the holiday season, not after', 'Tell buyers early: "Holiday postage went up, so shipping is $8.49 through January"'] },
    { kind: 'scenario', title: 'Buyers push back', situation: 'After you raise shipping from $6.99 to $7.99, a regular comments: "Shipping is too high now!"',
      options: [
        { text: 'Delete the comment', feedback: "Others saw it and will wonder. A kind answer builds trust." },
        { text: 'Thank her, explain postage went up, and remind her shipping covers everything she adds all week', best: true, feedback: "Honest and helpful. Most buyers are fine once they see the value of combined shipping." },
        { text: 'Lower it back to $6.99 for everyone', feedback: "That puts the loss back on you on every order. Explain the value instead." },
      ] },
    { kind: 'reflect', title: 'Your shipping price', prompt: 'Write your true cost to ship an average order, the method you\'ll use, and what you\'ll charge.', placeholder: 'My true cost… My method… I\'ll charge… My free-shipping minimum (if any)…', example: 'True cost about $7.60. Combined week, Monday ship day. $7.99 covers everything through Sunday, up to 3 lbs. No free shipping yet.' },
    { kind: 'checklist', title: 'Shipping profit checklist', prompt: 'Tick each one this week.', items: ['Work out my true cost to ship from my last 20 orders', 'Stock two or three box and mailer sizes', 'Weigh every packed order on a real scale', 'Pick my shipping method and write it in my pinned post', 'Set a reminder to re-check rates before the holidays', 'Test cubic pricing on my next heavy small order'] },
  ],
}
export default lesson
