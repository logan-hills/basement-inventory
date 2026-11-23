import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'tiktok', kind: 'course', school: 'Platforms and trends', title: 'Selling on TikTok Shop', track: 'Business', icon: 'cart',
  why: "TikTok Shop puts your pieces in front of buyers who've never heard of you, and lets them check out without leaving the app.",
  outcomes: [
    'Know what it takes to open a shop, and what to have ready',
    'Price so you still profit after TikTok\'s fees and shipping',
    'Write listings that get found and bought',
    'Use shoppable videos, LIVE and affiliates to drive sales',
    'Protect your shop health with on-time shipping and synced stock',
  ],
  sources: [
    { org: 'TikTok Shop', title: 'Introducing TikTok Shop', url: 'https://business.tiktokshop.com/us/blog/detail/10020329' },
    { org: 'Federal Trade Commission', title: 'Disclosures 101 for social media influencers', url: 'https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Is it right for you?', kind: 'learn', title: 'A different kind of buyer', nova: "TikTok Shop is a whole new door. Let's walk through it together.",
      text: "Facebook Live is a room full of people who already know you. TikTok Shop is a busy mall full of strangers. That's a big opportunity, but it plays by different rules.",
      table: { head: ['', 'Your Facebook Live', 'TikTok Shop'], rows: [
        ['Who buys', 'Your regulars and their friends', 'Mostly strangers who found a video'],
        ['How they pay', 'Your invoice after the live', 'Checkout inside TikTok, right away'],
        ['Who sets the rules', 'You (and the shared Page guidelines)', 'TikTok: shipping deadlines, product rules, fees'],
        ['Best products', 'Anything you can show and talk about', 'Pieces that photograph well and ship small'],
      ] } },
    { kind: 'quiz', q: 'Which piece is the best fit to start with on TikTok Shop?', options: ['A one-of-a-kind vintage coat', 'Gold hoops you have 40 of, that ship in a small mailer', 'A heavy lamp'], answer: 1, why: 'Start with pieces you have plenty of, that look great on camera and are cheap to ship.' },

    { chapter: 'Open your shop', kind: 'learn', title: 'What to have ready', text: 'You sign up in TikTok Seller Center as an individual or a business. Gather these before you start so you can finish in one sitting.',
      points: ['Government ID', 'Business details (or your own, as an individual seller)', 'A bank account for payouts', 'A return address and the address you ship from', 'Your first 5 products, photographed and measured'],
      tip: 'Requirements, fees and approval steps change. Check Seller Center for today\'s rules before you start.' },
    { kind: 'learn', title: 'Rules to know first', text: "TikTok Shop is strict about some product types and about copies of name brands. Read the prohibited and restricted products list before you list anything. One bad listing can put your whole shop at risk.",
      points: ['No counterfeits, and never "inspired" or "dupe" listings of designer brands', 'Some categories need approval before you can list', 'Photos and descriptions must match exactly what ships', 'Keep your return address and policies up to date'] },
    { kind: 'quiz', q: 'Can you list a bag described as "designer inspired"?', options: ['Yes, if it\'s cheap', 'No, it breaks the rules and risks your shop', 'Only on weekends'], answer: 1, why: 'Brand copies get listings pulled and shops penalized.' },

    { chapter: 'Price it to profit', kind: 'learn', title: 'Work out your real take-home', text: "On TikTok Shop, a fee comes out of each sale, and you usually cover shipping or part of it. A price that works on your live can lose money here. Always do the math first. Here's a worked example using a made-up 8% fee. Check Seller Center for your real rate.",
      table: { head: ['', 'Amount'], rows: [
        ['Price', '$24.00'],
        ['Fee (example 8%)', '− $1.92'],
        ['Shipping you pay', '− $4.50'],
        ['Mailer and tissue', '− $0.60'],
        ['What you paid for it', '− $6.00'],
        ['Profit', '$10.98'],
      ] } },
    { kind: 'number', title: 'Your turn: is it worth it?', q: 'A scarf sells for $18. The fee is 8% ($1.44). Shipping costs you $4.50, packaging $0.50, and you paid $5 for it. What\'s your profit?', prefix: '$', answer: 6.56, tolerance: 0.02, hint: 'Start with $18 and subtract the fee, shipping, packaging and your cost.', why: '$18 − $1.44 − $4.50 − $0.50 − $5 = $6.56. Worth it, but notice how fast it shrinks. Under about $12, many pieces stop making sense on their own. Bundle them instead.' },
    { kind: 'learn', title: 'Bundles beat cheap singles', text: "Shipping costs about the same for one pair of earrings as for three. So low-priced pieces work best as sets.",
      example: 'Instead of three $6 earrings that each lose money after shipping, list "3-pair gold earring set, $19." Same mailer, same label, and now the profit is real.' },

    { chapter: 'Listings that sell', kind: 'learn', title: 'The perfect listing', text: 'Your listing is your salesperson when you\'re not on camera. Strangers can\'t ask you questions, so answer them before they ask.',
      points: ['Main photo: bright, on a plain background, the whole piece', 'More photos: close-ups, on a person, the size next to a hand', 'A short video of it being worn or used', 'Honest measurements, weight and materials', 'Any flaws, shown and named'] },
    { kind: 'learn', title: 'The title formula', text: 'Shoppers search with plain words. Put the words they\'d type into your title, most important first.',
      table: { head: ['Weak title', 'Strong title'], rows: [
        ['"Cute bag!!"', '"Emerald Green Quilted Crossbody Bag, Gold Chain Strap, Small Evening Purse"'],
        ['"Earrings"', '"Gold Hoop Earrings Set of 3, Lightweight, Hypoallergenic Posts, 30mm 40mm 50mm"'],
      ] },
      tip: 'Formula: color + material + what it is + key feature + size. No brand names unless it IS that brand.' },
    { kind: 'order', title: 'Build a listing', prompt: 'Order the listing steps.', steps: ['Take a bright main photo', 'Write a clear title', 'Add measurements and details', 'Set price and stock', 'Publish and post a video that tags it'] },

    { chapter: 'Drive the sales', kind: 'learn', title: 'Three engines', nova: "Here's where TikTok Shop gets fun.",
      text: 'Sales on TikTok Shop come from three places. Use all three, starting with videos.',
      points: ['Shoppable videos: tag the product in your video, and viewers buy from a little cart link', 'LIVE shopping: pin products while you sell on camera (just like your Facebook lives)', 'Affiliates: other creators promote your pieces for a commission you set'] },
    { kind: 'learn', title: 'Affiliates are your sales team', text: "Set a commission and invite creators whose followers look like your dream buyer. They post, you ship, everybody eats.",
      points: ['Look for creators with engaged comments, not just big follower counts', 'Send samples to the creators who match your style', 'Give them a short "what to say" note: price, best features, who it\'s for', 'Track who actually drives sales, and send them your new pieces first'] },
    { kind: 'script', title: 'The note you send with a sample', text: 'Creators get a lot of packages. A short, friendly note makes yours easy to post about.',
      lines: [
        '"Hi [creator name]! I\'m [your name] from [shop]. I love how you style [something they posted]. 💛',
        'Here\'s our [product] for you to keep. It\'s $[price] in our TikTok Shop, and you earn [commission]% on every sale.',
        'Best things about it: [feature 1], [feature 2], [feature 3]. It\'s perfect for [who it\'s for].',
        'No pressure at all, and if you post, tag us so we can share it. Thank you!"',
      ] },
    { kind: 'quiz', q: 'An affiliate is…', options: ['A creator who promotes your products for a commission', 'A TikTok employee', 'A shipping company'], answer: 0, why: 'Affiliates bring their audience to your products and only get paid when something sells.' },

    { chapter: 'Ship it right', kind: 'learn', title: 'Speed protects your shop', text: "TikTok tracks how fast you ship and how many orders arrive late or get canceled. Miss too often and your shop can be limited, or your products shown less. Know your ship-by deadline in Seller Center and beat it.",
      tip: 'Keep TikTok stock in step with this app, so a piece that sold on your Facebook live doesn\'t sell again on TikTok.' },
    { kind: 'scenario', title: 'Oops, it sold twice', situation: "Your last pearl set sold on Tuesday's Facebook live. Wednesday morning, a TikTok Shop order comes in for the same set.",
      options: [
        { text: 'Cancel the TikTok order and say nothing', feedback: 'Seller cancellations count against your shop health, and silence makes the buyer feel brushed off.' },
        { text: 'Message the TikTok buyer, offer a similar set or a refund, and lower TikTok stock to zero right away. Next time, update TikTok right after each live.', best: true, feedback: 'You treat the buyer right and fix the real problem: stock that wasn\'t synced.' },
        { text: 'Ship the Facebook buyer something else and send the set to TikTok', feedback: 'Your Facebook buyer claimed it first. Swapping her order breaks your promise to your regulars.' },
      ] },
    { kind: 'checklist', title: 'Your launch list', prompt: 'Tick each step as you finish it.', items: [
      'Read the prohibited and restricted products list',
      'Gather ID, bank account and addresses',
      'Find my real fee rate and ship-by deadline in Seller Center',
      'Price my first 5 pieces with the profit math',
      'Photograph and measure them',
      'Write titles with the formula',
      'Post one video that tags a product',
      'Set a reminder to update TikTok stock after every live',
    ] },
    { kind: 'reflect', title: 'Your first 5', prompt: 'Which five pieces would you list first, what would you price them at, and why?', placeholder: '1. …', example: 'Gold hoop 3-pack at $19 (I have 40), the emerald crossbody at $28, two scarf sets at $18, and the pearl bracelet at $16. They photograph well and ship small.' },
  ],
}
export default lesson
