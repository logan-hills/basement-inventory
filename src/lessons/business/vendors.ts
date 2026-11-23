import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'vendors', kind: 'course', school: 'Money and buying', title: 'Find great vendors and keep them', track: 'Business', icon: 'users',
  why: 'A vendor who knows and trusts you sends you first pick, better prices and second chances. That relationship is worth more than any one deal.',
  outcomes: [
    'Find wholesale and liquidation vendors in the right places',
    'Vet a vendor before you send money, and spot scams',
    'Make a professional first contact and first order',
    'Negotiate fairly: terms, minimums, and price',
    'Follow up and build a relationship that gets you first pick',
  ],
  route: { to: '/lessons', label: 'Back to Dazzle University' },
  sources: [
    { org: 'Federal Trade Commission', title: 'Business guidance', url: 'https://www.ftc.gov/business-guidance' },
    { org: 'SCORE (SBA mentoring partner)', title: 'Free business mentoring', url: 'https://www.score.org/' },
    { org: 'U.S. Small Business Administration', title: 'Marketing and sales', url: 'https://www.sba.gov/business-guide/manage-your-business/marketing-sales' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Where to find them', kind: 'learn', title: 'Look in the right places', nova: 'Vendors are people. Treat them like partners and they\'ll treat you like a VIP.',
      text: 'Good vendors rarely find you. You find them.',
      table: { head: ['Where', 'What you\'ll find'], rows: [
        ['Wholesale marketplaces (online)', 'Many brands in one place, small minimums, buyer reviews'],
        ['Trade shows and apparel markets', 'Meet reps face to face, see quality, show-only deals'],
        ['Brand websites ("wholesale" or "become a retailer" page)', 'Buy direct from small brands'],
        ['Liquidators and closeout companies', 'Overstock, returns and shelf pulls by the lot or pallet'],
        ['Other sellers and your community', 'Honest reviews and introductions'],
        ['Product tags and labels', 'The maker\'s name to search for wholesale'],
      ] } },
    { kind: 'reflect', title: 'Your dream vendor', prompt: 'Describe your ideal vendor: what they sell, price range, minimum order, and how fast they ship.', placeholder: 'My ideal vendor sells…', example: 'Brand-name handbags at 25 to 35% of retail, $300 minimum, ships in 3 days, and lets me pick by style.' },

    { chapter: 'Vet before you pay', kind: 'learn', title: 'Check them out', text: 'Most vendors are honest, but scams target new sellers. Ten minutes of checking can save hundreds of dollars.',
      points: ['A real business name, address and phone you can verify', 'Reviews from other sellers, and not only on their own site', 'Clear terms: returns, damages, shipping times', 'They ask for your resale certificate (legit wholesalers usually do)', 'They take payment methods with buyer protection (credit card, PayPal Goods & Services)', 'Start with a small test order'] },
    { kind: 'learn', title: 'Red flags', text: 'Walk away from these.',
      table: { head: ['Red flag', 'Why it\'s a problem'], rows: [
        ['Only takes wire transfer, gift cards, crypto or "friends and family" payments', 'No way to get your money back'],
        ['Prices that are far too good for real designer goods', 'Often counterfeit, which is illegal to sell'],
        ['Pressure: "today only, pay now"', 'Rushed buyers skip checking'],
        ['No address, no reviews, brand-new social page', 'Hard to find or hold accountable'],
        ['Stock photos only, refuses to send real photos or video', 'You may not get what\'s pictured'],
      ] } },
    { kind: 'scenario', title: 'Too good to be true?', situation: 'An Instagram account offers 50 "authentic" designer bags for $1,000, payment by Zelle only, ships "after payment clears." The page is 3 weeks old.',
      options: [
        { text: 'Pay, it\'s a steal', feedback: 'Real designer bags don\'t sell at $20 each, Zelle has little protection, and the page is brand new. High risk of a scam or counterfeits.' },
        { text: 'Pass. Ask for a business address, references and a card payment for a small test order; walk away if they refuse.', best: true, feedback: 'That\'s how pros protect themselves. Counterfeits can get your accounts banned and expose you legally.' },
        { text: 'Pay half now, half later', feedback: 'Half of a scam is still lost money.' },
      ] },

    { chapter: 'First contact', kind: 'script', title: 'Your first email', text: 'Short, professional and specific gets answered.', lines: [
      'Subject: Wholesale inquiry from [Shop name], live boutique in [city, state]',
      'Hi [Name],',
      'I run [Shop name], a live shopping boutique on Facebook with about [number] regular buyers each week. Your [product line] would be a great fit for my audience.',
      'Could you share your wholesale line sheet, minimums, and terms? I have a [state] sales tax license and can send a resale certificate.',
      'I\'d love to start with a test order and grow from there.',
      'Thank you, [Your name] · [Phone] · [Website or Facebook page]',
    ], tip: 'Include your sales tax number in your signature once you have it. It signals you\'re a real retailer.' },
    { kind: 'learn', title: 'Words you\'ll hear', text: 'Vendors use a few terms over and over.',
      table: { head: ['Term', 'Means'], rows: [
        ['MOQ', 'Minimum order quantity (or minimum order dollars)'],
        ['Line sheet', 'Their price list with photos, sizes and wholesale prices'],
        ['Net 30', 'Pay within 30 days of the invoice (offered to trusted buyers)'],
        ['Prepack', 'A set mix of sizes or colors sold together'],
        ['Manifested lot', 'A lot that comes with a list of what\'s inside'],
        ['MSRP', 'The suggested retail price'],
      ] } },
    { kind: 'quiz', q: 'A vendor says "MOQ $250, Net 30 after 3 orders." What does that mean?', options: ['You must spend at least $250 per order; after 3 orders you can pay within 30 days', 'You get 30% off after 3 orders', 'Orders ship in 30 days'], answer: 0, why: 'MOQ is the minimum order. Net 30 means payment is due 30 days after the invoice, a perk for trusted buyers.' },

    { chapter: 'Negotiate fairly', kind: 'learn', title: 'Ask for more than price', text: 'Price is only one lever. Vendors often have more room on the others.',
      points: ['Lower minimums for your first order', 'Free or reduced shipping over a certain amount', 'First look at new arrivals or new lots', 'Payment terms (like Net 30) once you\'ve built trust', 'Exclusive styles or colors for your area', 'A credit or partial refund process for damaged pieces'],
      tip: 'Always be polite and pay on time. Your reputation travels fast among vendors.' },

    { chapter: 'Build the relationship', kind: 'learn', title: 'Follow up like a pro', text: 'Most sellers order and disappear. Stand out by following up.',
      table: { head: ['When', 'What to send'], rows: [
        ['Order arrives', 'A quick thanks and confirmation it arrived (or photos of any damage within their window)'],
        ['After your live', 'What sold out and what buyers loved. A screenshot of happy comments goes a long way.'],
        ['Every month or two', 'A check-in: what\'s new, anything coming in that fits my buyers?'],
        ['Holidays', 'A short thank-you note'],
      ] } },
    { kind: 'script', title: 'After-live follow-up', lines: [
      'Hi [Name]! Just went live with your [product]. The [style] sold out in 6 minutes and buyers kept asking for more colors.',
      'Could I reorder [quantity] of the [style] in [colors]? And please keep me in mind for anything similar coming in.',
      'Thanks again for being so great to work with. [Your name]',
    ] },
    { kind: 'learn', title: 'Keep a vendor scorecard', text: 'Big retailers rate vendors on a few things every quarter. A simple version helps you know who deserves more of your budget.',
      table: { head: ['Rating', 'Question'], rows: [
        ['Quality', 'How many pieces were damaged or not as described?'],
        ['Speed', 'How many days from order to delivery?'],
        ['Sell-through', 'How fast did their pieces sell on my lives?'],
        ['Margin', 'What profit did I make per piece?'],
        ['Communication', 'Do they answer quickly and fix problems?'],
      ] } },
    { kind: 'scenario', title: 'The damaged shipment', situation: 'Your best vendor\'s latest box arrives with 8 of 40 bags scuffed. Their policy says report damage within 3 days.',
      options: [
        { text: 'Post an angry review right away', feedback: 'That can end a good relationship over one bad box. Try the fix first.' },
        { text: 'Photograph the damage today, damage them out in the app, and email the vendor calmly within their window asking for a credit', best: true, feedback: 'Professional and on time. Good vendors make it right, and they remember who was fair.' },
        { text: 'Say nothing and sell them as new', feedback: 'Buyers will notice, and you\'ve paid full price for damaged stock. Report it.' },
      ] },
    { kind: 'reflect', title: 'Your negotiation ask', prompt: 'Pick one vendor. What one thing besides price will you ask them for next time?', placeholder: 'I\'ll ask…', example: 'Free shipping over $400 and first look at new handbag lots.' },
    { kind: 'checklist', title: 'Vendor plan', prompt: 'Tick what you\'ll do this month.', items: ['List 5 possible vendors from at least 2 places', 'Vet each: address, reviews, payment protection', 'Send my first-contact email to my top 3', 'Place one small test order', 'Track each vendor\'s sell-through in Reports', 'Send an after-live follow-up to my best vendor'] },
  ],
}
export default lesson
