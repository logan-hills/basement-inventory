import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'shipfast', kind: 'course', title: 'Ship fast, keep them coming back', track: 'Business', icon: 'truck',
  why: 'Fast shipping is the moment your buyer decides if she\'ll shop with you again.',
  outcomes: [
    'Set a ship-by promise you can keep, and beat it',
    'Run a weekly pack-and-ship routine that fits around your lives',
    'Pick the right mailer and stay in the cheapest weight tier',
    'Handle combined orders, lost packages and damage calmly',
    'Make unboxing feel special for pennies',
  ],
  route: { to: '/orders', label: 'Open Pick and pack' },
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Speed is service', kind: 'learn', title: 'Why speed wins', nova: 'Think about the last time a package took forever. How did you feel about that seller?',
      text: "Buyers judge you most in the days between \"paid\" and \"delivered.\" That's when excitement turns into either trust or worry. Fast, tracked shipping builds the trust that brings her back to your next live.",
      points: ['Fast shipping turns one purchase into a habit', 'Slow shipping makes buyers hesitate to claim next time', 'Tracking answers "where\'s my stuff?" before she has to ask'] },
    { kind: 'learn', title: 'Pick a promise you can keep', text: 'Say it at every live: "Orders ship within X business days of payment." Then beat it, every time.',
      points: ['Under-promise, over-deliver', 'Count business days, not calendar days', 'Say it at the start and end of every live', 'Put it in your pinned post and your invoice note'] },
    { kind: 'quiz', q: 'You usually ship in 2 days. What should you promise?', options: ['Same day', '3 business days, then beat it', 'No promise'], answer: 1, why: 'A promise you beat feels like a gift. One you miss feels like a lie.' },

    { chapter: 'Your weekly routine', kind: 'learn', title: 'Build it around your lives', text: 'Use the same routine every week so nothing slips. Here\'s one for a seller who goes live Tuesday and Thursday at 7 PM.',
      table: { head: ['When', 'What happens'], rows: [
        ['Tue night, after the live', 'Make orders, send invoices'],
        ['Wed', 'Payment deadline. Print box labels, pick and pack Tuesday\'s paid orders'],
        ['Thu morning', 'Buy labels in one batch, schedule pickup or drop off'],
        ['Thu night', 'Live #2, make orders, send invoices'],
        ['Fri', 'Pick, pack and ship Thursday\'s paid orders'],
        ['Sat', 'Mark everything shipped with tracking. Day off from packing!'],
      ] } },
    { kind: 'order', title: 'Put it in order', prompt: 'Order one live\'s shipping routine.', steps: ['Make orders and send invoices', 'Payment deadline passes', 'Print box labels', 'Pick and pack (scan item, scan box)', 'Buy labels in one batch', 'Drop off and mark shipped'] },
    { kind: 'learn', title: 'Set up a packing station', text: 'Packing goes twice as fast when everything is in arm\'s reach and in the same spot every time.',
      points: ['A clear table at waist height', 'Mailers in two or three sizes, sorted', 'Tape gun, scissors, a pen and thank-you cards', 'A shipping scale (a $20 kitchen-style postal scale works)', 'Your phone or scanner for scanning items into boxes', 'A bin for "packed, waiting for label"'] },

    { chapter: 'Mailers and weight', kind: 'learn', title: 'Pick the right mailer', text: 'The right packaging protects the piece and keeps the postage low.',
      table: { head: ['Piece', 'Best mailer', 'Why'], rows: [
        ['Jewelry', 'Small bubble mailer, piece in a little bag', 'Light, padded, cheapest tier'],
        ['Scarves, tops, soft goods', 'Poly mailer', 'Weighs almost nothing, can\'t break'],
        ['Structured bags', 'Box, or a poly mailer with tissue stuffed inside the bag', 'Keeps the shape from getting crushed'],
        ['Anything fragile', 'Box with padding on every side', 'Shake test: nothing should move'],
      ] } },
    { kind: 'learn', title: 'Weight tiers are where the money is', text: "For light packages, USPS Ground Advantage is priced in steps of ounces: up to 4 oz, up to 8 oz, up to 12 oz, and up to 15.99 oz. Above that it goes by the pound. A package that weighs 8.1 oz pays the 12 oz price. Weigh everything, mailer included.",
      example: 'A bag weighs 8.3 oz in a box. Switch it to a poly mailer with tissue and it drops to 7.6 oz. Same bag, now in the 8 oz tier, and you save on every one you ship.',
      tip: 'Add the weight to each item in the app when you receive it, and your shipping file fills it in for you.' },
    { kind: 'number', title: 'Which tier?', q: 'A jewelry set weighs 3.2 oz and the bubble mailer weighs 1.1 oz. What\'s the total weight in ounces?', answer: 4.3, tolerance: 0.05, suffix: 'oz', hint: 'Add the piece and the mailer together.', why: 'That\'s just over 4 oz, so it pays the up-to-8 oz price. A lighter mailer, or the piece without its gift box, could bring it under 4 oz and into the cheapest tier.' },
    { kind: 'learn', title: 'Buy labels in one batch', text: "Pirate Ship lets you import one file with every order and buy all the labels at once, at discounted rates. The Shipping page in this app makes that file for you. Then USPS will even pick up from your door: schedule a free package pickup at usps.com for the next mail day (check there for which services qualify)." },

    { chapter: 'When things get tricky', kind: 'learn', title: 'Combined shipping', text: "Regulars often buy on more than one live a week. Decide your rule, say it on every live, and stick to it.",
      points: ['Option A: every live ships on its own, fast', 'Option B: "Shop Tuesday and Thursday, it all ships together Friday, one shipping charge"', 'Whichever you pick, put it in your pinned post'],
      tip: 'Option B saves your buyers money and you mailers, but only if you still ship by the day you promised.' },
    { kind: 'scenario', title: 'Tracking hasn\'t moved', situation: 'A buyer messages you: her tracking has said "In transit" for 6 days and hasn\'t updated.',
      options: [
        { text: '"It\'s out of my hands once it\'s at the post office, sorry."', feedback: 'True, but it sounds like you don\'t care. She\'ll remember the feeling.' },
        { text: '"I\'m so sorry, Keisha! I\'m opening a search with USPS today and I\'ll update you Friday. If it doesn\'t turn up, I\'ll make it right."', best: true, feedback: 'You own it, take action, give a date, and promise a solution. That keeps her for life.' },
        { text: 'Ship a replacement right away without checking anything', feedback: 'Generous, but many "stuck" packages show up a few days later. Start a search first, and give it a few days.' },
      ] },
    { kind: 'scenario', title: 'The wrong earrings', situation: 'Two buyers message the same morning: Monique got Tasha\'s earrings, and Tasha got Monique\'s. The boxes were swapped.',
      options: [
        { text: 'Ask both of them to mail the earrings to each other', feedback: 'You made the mistake, and now you\'ve given them a chore. That\'s how sellers lose two buyers at once.' },
        { text: 'Apologize to both, send each a prepaid return label, and ship the right pieces today with a little extra. Then scan every piece into its box from now on.', best: true, feedback: 'Fast, generous, and you fixed the cause. Scanning item then box is exactly what stops swaps.' },
        { text: 'Tell them both to keep what they got', feedback: 'Sometimes fine for tiny prices, but they each wanted the piece they picked. Ask first, then decide together.' },
      ] },
    { kind: 'script', title: 'Say it on every live', text: 'Read this near the start and again near the end of each live, so nobody is ever surprised.',
      lines: [
        '"Quick shipping notes, family! Invoices go out right after the live. Pay within 24 hours to keep your pieces."',
        '"Everything ships within 3 business days of payment, with tracking sent right to you."',
        '"Shopping Tuesday AND Thursday? It all ships together Friday with one shipping charge."',
        '"Anything wrong with your order? Message me within 3 days and I\'ll make it right."',
      ] },
    { kind: 'learn', title: 'Protect yourself', text: 'A few habits make lost and damaged packages much less painful.',
      points: ['Always ship with tracking. Never skip it to save a few cents.', 'Take a quick photo of each packed box with its label for high-value orders', 'Check what insurance your label includes, and add more for big orders', 'Keep your packing slips and label receipts for at least a few months'] },

    { chapter: 'The unboxing', kind: 'learn', title: 'Unboxing on a budget', text: 'The box is the last thing your brand says. Make it count for pennies.',
      table: { head: ['Touch', 'About what it costs'], rows: [
        ['Tissue in your brand color', '5 to 10 cents a sheet'],
        ['Handwritten "Thank you, [name]!"', 'A minute of your time'],
        ['Card with your next live day and time', '5 to 15 cents printed at home'],
        ['A sticker sealing the tissue', 'A few cents'],
        ['A tiny freebie for regulars (a hair tie, a candy)', '10 to 50 cents'],
      ] } },
    { kind: 'quiz', q: 'Cheapest way to make unboxing feel special?', options: ['A handwritten thank-you', 'Overnight shipping', 'A bigger box'], answer: 0, why: 'Personal beats expensive, every time.' },
    { kind: 'reflect', title: 'Your ship-by promise and routine', prompt: 'Write the shipping promise you\'ll say on every live, and which days you\'ll pack and ship.', placeholder: 'Orders ship within…', example: 'Orders ship within 3 business days of payment, with tracking. I pack Wednesday and Friday, and ship Thursday and Friday.' },
    { kind: 'checklist', title: 'Shipping upgrades this month', prompt: 'Tick the ones you\'ll do.', items: [
      'Buy a postal scale',
      'Stock two sizes of poly mailers and small bubble mailers',
      'Add weights to my items when I receive them',
      'Set up a packing station in one spot',
      'Print thank-you cards with my live day and time',
      'Put my shipping promise in my pinned post',
    ] },
  ],
}
export default lesson
