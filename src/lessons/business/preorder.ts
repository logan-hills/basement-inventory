import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'preorder', kind: 'course', school: 'Money and buying', title: 'Pre-orders and made-to-order: sell before you buy', track: 'Business', icon: 'tag',
  why: "Pre-orders let your buyers' demand pay for your stock, so you buy exactly what sold instead of guessing. They also come with real promises, and the law has rules about keeping them.",
  outcomes: [
    'Know when a pre-order or made-to-order drop makes sense',
    'Set a minimum order and a cutoff so the math always works',
    'Choose between full payment and a deposit, and say it clearly',
    'Keep your ship-date promise inside the FTC rule',
    'Keep buyers excited (not anxious) while they wait',
  ],
  route: { to: '/planner', label: 'Open the Live planner' },
  sources: [
    { org: 'Federal Trade Commission', title: "Business guide to the FTC's Mail, Internet, or Telephone Order Merchandise Rule", url: 'https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule' },
    { org: 'Square', title: 'Square Invoices: deposits, payment schedules and reminders', url: 'https://squareup.com/us/en/invoices' },
    { org: 'Consumer Financial Protection Bureau', title: 'How do I dispute a charge on my credit card bill?', url: 'https://www.consumerfinance.gov/ask-cfpb/how-do-i-dispute-a-charge-on-my-credit-card-bill-en-61/' },
    { org: 'U.S. Small Business Administration', title: 'Manage your finances', url: 'https://www.sba.gov/business-guide/manage-your-business/manage-your-finances' },
  ],
  queen: {
    welcome: "Pre-orders are one of my favorite tools for a growing shop, because your buyers tell you exactly what to buy. No guessing, no leftover bins in January. But a pre-order is a promise with a date on it, so let's learn to keep it beautifully.",
    signoff: "Pick a date you can beat, tell your buyers what's happening while they wait, and ship early when you can. Do that a few times, and your pre-orders will sell out before you finish describing them.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Sell first, buy second', kind: 'learn', title: 'How pre-orders work', nova: "Imagine never guessing how many to buy again. That's the magic of a pre-order, honey.",
      text: "In a pre-order, buyers claim and pay for an item that isn't in your hands yet. You buy or make only what sold, then ship it all on a promised date. Made-to-order is the same idea for things you make yourself, like custom tees, jewelry or candles.",
      table: { head: ['', 'Regular stock', 'Pre-order'], rows: [
        ['You pay for stock', 'Before you sell', 'After it sells'],
        ['Leftover stock risk', 'Yours', 'Almost none'],
        ['Buyer waits', '1 to 3 days', 'Usually 2 to 6 weeks'],
        ['Best for', 'Everyday pieces', 'Restocks, custom, seasonal and special pieces'],
      ] } },
    { kind: 'learn', title: 'When pre-orders shine', text: "Pre-orders work best when buyers already want the thing and know it's worth waiting for.",
      points: [
        'A best seller sold out and your vendor can restock in bulk',
        'Holiday or event pieces (Christmas pajamas, Mother\'s Day, game-day tees)',
        'Custom names, colors or sizes you make after the order',
        'Big-ticket pieces you can\'t afford to stock on a guess',
        'Testing a new product before you commit money',
      ],
      example: "Kendra's family Christmas pajama sets sold out in October. She opened pre-orders on her next live with a November 10 cutoff and a December 5 ship date. She sold 64 sets, ordered exactly 64, and had nothing left over in January." },
    { kind: 'quiz', q: 'Which is the best fit for a pre-order?', options: ['Everyday basics you always have on the shelf', 'A sold-out best seller your vendor can restock in 3 weeks', 'A one-of-a-kind vintage piece already in your hands', 'An item you need to ship tomorrow'], answer: 1, why: "Proven demand, a reliable restock and a wait buyers will accept. That's the pre-order sweet spot." },

    { chapter: 'Make the math work', queen: "Announce the minimum with a smile, not a worry. 'Help me get to 24, ladies!' turns your buyers into your sales team.", kind: 'learn', title: 'Your minimum and your cutoff', text: "Many vendors have a minimum order. Custom work has setup costs. So every pre-order needs two numbers decided ahead of time.",
      table: { head: ['Number', 'What it means', 'Example'], rows: [
        ['Minimum to run', 'The fewest orders that still make it worth doing', '24 sets (the vendor\'s minimum)'],
        ['Cutoff date', 'The last day to order', 'Sunday, November 10'],
        ['Ship date', 'When every order ships', 'By Friday, December 5'],
      ] },
      tip: 'Tell buyers the minimum up front: "If we don\'t reach 24 by Sunday, everyone gets a full refund on Monday." It builds trust and a little friendly urgency.' },
    { kind: 'number', title: 'Find your break-even', q: 'A custom tee costs you $9 each to print, plus a $120 setup fee for the design. You sell them for $25. Fees and packaging are $2 per tee. How many must you sell to cover the setup fee (break even)?', answer: 9, hint: 'Each tee leaves $25 − $9 − $2 = $14. How many $14s cover $120?', why: '$120 ÷ $14 = 8.6, so 9 tees. Set your minimum a bit above break-even, like 15, so the drop is worth your time.' },
    { kind: 'number', title: 'Your profit at the minimum', q: 'Same tees: $14 left from each sale after costs, and a $120 setup fee. You set your minimum at 15. What profit do you make if exactly 15 sell?', prefix: '$', answer: 90, hint: '15 × $14, minus $120.', why: '15 × $14 = $210, minus $120 = $90. Every tee after 15 adds another $14.' },

    { chapter: 'Deposit or pay in full?', queen: "Write your deposit rules on the invoice itself. When it's in writing before anyone pays, nobody argues about it later.", kind: 'learn', title: 'Two ways to take payment', text: "You can charge the full price at claim time, or take a deposit now and the rest before shipping. Square Invoices lets you set a deposit and a payment schedule on one invoice.",
      table: { head: ['', 'Pay in full', 'Deposit (often 30 to 50%)'], rows: [
        ['Cash for your vendor', 'All of it, right away', 'Part of it'],
        ['Buyer comfort', 'Some buyers hesitate on bigger items', 'Easier yes on big items'],
        ['Your work', 'One payment to track', 'Must collect the balance; some won\'t pay it'],
        ['Best for', 'Items under about $50', 'Big-ticket and custom pieces'],
      ] },
      tip: 'Decide ahead of time whether a deposit is refundable if the buyer changes her mind, and say it in writing. If YOU cancel or miss the date, the buyer gets everything back.' },
    { kind: 'scenario', title: 'The $180 custom jacket', situation: 'You offer custom painted denim jackets at $180, made to order in 4 weeks. Several buyers say they love them but "can\'t do $180 tonight."',
      options: [
        { text: 'Require full payment so you\'re not stuck chasing balances', feedback: "Safe for you, but you may lose most of the sales on a big custom item." },
        { text: 'Offer a 50% deposit tonight, balance due before you ship, written on the invoice with the ship date', best: true, feedback: "A deposit covers your materials, makes the yes easier, and the written balance date keeps everyone clear." },
        { text: 'Let them pay whenever they can', feedback: "Kind, but you'd be buying materials with no commitment. That's how makers lose money." },
      ] },

    { chapter: 'Keep the promise', queen: "Whatever your vendor tells you, add a week. Under-promise and over-deliver is still the oldest secret in retail.", kind: 'learn', title: 'The ship-date rule (it\'s the law)', text: "The FTC's Mail, Internet, or Telephone Order Merchandise Rule applies to pre-orders too.",
      points: [
        'Give a ship date you have a reasonable basis to meet',
        'If you give no date, you must ship within 30 days',
        'If you\'ll miss the date, tell buyers before it passes, give the new date and offer to cancel with a full refund',
        'Send refunds promptly',
      ],
      tip: "Build in a cushion. If your vendor says 3 weeks, promise 4. Shipping early delights buyers; shipping late breaks trust. This is general education, not legal advice." },
    { kind: 'number', title: 'Pick your ship date', q: 'Your vendor needs 18 days after you place the order. You need 3 days to sort and pack, and you add a 5-day cushion. If you place the order the day after your cutoff, how many days after the cutoff should your promised ship date be?', suffix: 'days', answer: 27, hint: '1 day to order + 18 + 3 + 5.', why: '1 + 18 + 3 + 5 = 27 days. Promise about 4 weeks from the cutoff and you\'ll almost always beat it.' },
    { kind: 'order', title: 'A pre-order drop, start to finish', prompt: 'Put the steps of a pre-order in order.', steps: ['Confirm the vendor\'s price, minimum and lead time', 'Announce the item, price, cutoff and ship date on your live', 'Take claims and payments (or deposits)', 'Close at the cutoff and count the orders', 'Place one order for the exact number sold', 'Send buyers updates while they wait', 'Receive, tag, pack and ship by the date'] },

    { chapter: 'Love them while they wait', queen: "Film the boxes arriving and show them on your next live. Nothing builds excitement for your next pre-order like watching this one come true.", kind: 'learn', title: 'Updates turn waiting into excitement', text: "Silence makes buyers nervous, and nervous buyers start card disputes. A simple update plan keeps them excited and keeps your Live comments full of anticipation.",
      table: { head: ['When', 'What to send'], rows: [
        ['Right after the cutoff', '"We did it! 64 sets ordered. Ship date is still December 5."'],
        ['Halfway', 'A photo or video from the vendor or your workbench'],
        ['When it arrives', 'An unboxing on your live or a Reel'],
        ['Ship day', 'Tracking for everyone'],
      ] },
      tip: 'Card disputes can arrive months after a sale. Keep the cutoff, ship date and every update in writing so you can show what was promised.' },
    { kind: 'script', title: 'Your pre-order announcement', lines: [
      '"Y\'all asked and I listened! The [item] is back as a pre-order."',
      '"Here\'s how it works: claim tonight through [cutoff day]. I order exactly what you claim, so nothing goes to waste."',
      '"Price is $[price]. [Full payment / A $[deposit] deposit] holds your spot."',
      '"Everything ships by [ship date]. If we don\'t reach [minimum], you get a full refund on [day]."',
      '"I\'ll send you pictures along the way. You\'re going to love it!"',
    ] },
    { kind: 'scenario', title: 'The vendor is late', situation: "You promised December 5. On November 28 the vendor says the sets will arrive December 12. Buyers wanted them for a Christmas photo.",
      options: [
        { text: 'Wait and see; maybe it will come sooner', feedback: "If you know you'll miss the date, the rule says tell buyers now and offer to cancel. Waiting only shortens their time to make other plans." },
        { text: 'Tell every buyer today: the new date, an apology, and a no-questions refund option', best: true, feedback: "That's the rule and the right thing. Many will still wait, especially if you add a little thank-you." },
        { text: 'Offer a 10% coupon but no refund', feedback: "A coupon is a nice touch, but you must also offer to cancel with a full refund." },
      ] },
    { kind: 'reflect', title: 'Your first pre-order', prompt: 'What item will you try as a pre-order? Write your minimum, cutoff, ship date and payment choice.', placeholder: 'Item… Minimum… Cutoff… Ship date… Full or deposit…', example: 'Valentine\'s heart earrings. Minimum 20, cutoff Jan 19, ships by Feb 7, pay in full at $24.' },
    { kind: 'checklist', title: 'Pre-order ready', prompt: 'Tick each one before you announce.', items: ['Vendor price, minimum and lead time confirmed in writing', 'Break-even worked out and my minimum set above it', 'Cutoff and ship date picked, with a cushion', 'Payment choice decided and refund rules written', 'Announcement script ready', 'Update plan on my calendar'] },
  ],
}
export default lesson
