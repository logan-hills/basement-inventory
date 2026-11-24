import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'launchbiz', kind: 'course', school: 'Strategy and growth', title: 'Launch your live-selling business: the first 30 days', track: 'Business', icon: 'live',
  why: "Most new shops don't fail for lack of talent. They fail from no plan, no cushion and no rhythm. This course gives you all three before your first live.",
  outcomes: [
    'Pick a lane (who you sell to and what) that you can own',
    'Work out a starter budget and a first buy you can afford to lose',
    'Price your first pieces so every sale pays you',
    'Set up the basics: name, Page, payments, shipping and policies',
    'Run a 30-day launch plan, with your first three lives on the calendar',
  ],
  route: { to: '/planner', label: 'Open the Live planner' },
  sources: [
    { org: 'U.S. Small Business Administration', title: '10 steps to start your business', url: 'https://www.sba.gov/business-guide/10-steps-start-your-business' },
    { org: 'U.S. Bureau of Labor Statistics', title: '34.7 percent of business establishments born in 2013 were still operating in 2023', url: 'https://www.bls.gov/opub/ted/2024/34-7-percent-of-business-establishments-born-in-2013-were-still-operating-in-2023.htm' },
    { org: 'Federal Trade Commission', title: "Business guide to the FTC's Mail, Internet, or Telephone Order Merchandise Rule", url: 'https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule' },
    { org: 'SCORE (SBA mentoring partner)', title: 'Free small business mentoring', url: 'https://www.score.org/' },
  ],
  queen: {
    welcome: "The first 30 days set the tone for everything after. I've put together the plan I'd hand any seller starting today: a clear lane, a real budget and a rhythm you can keep.",
    signoff: "Write your one-sentence shop, protect your cushion, and do your first live even if it's quiet. Every big shop started with a small first night.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Start on purpose', kind: 'learn', title: 'Why the first 30 days matter', nova: "Welcome, future CEO! I'm so proud of you for starting. Let's do this the smart way so you're still smiling a year from now.",
      text: "The U.S. Bureau of Labor Statistics follows new businesses year by year. Of the businesses that opened in 2013, about 80% were still open one year later, about half made it to year five, and about a third were still going at year ten. That isn't a reason to be scared. It's a reason to start with a plan, because the shops that last usually got a few basics right early.",
      table: { head: ['Years open', 'Still open (BLS, 2013 class)'], rows: [['1 year', '79.6%'], ['5 years', '50.6%'], ['10 years', '34.7%']] },
      tip: 'The SBA lists 10 steps to start a business. This course walks the ones a live seller needs first, in plain words.' },
    { kind: 'learn', title: "The three things new shops run out of", text: "When small sellers quit, it is usually one of these three. Plan for each one now.",
      points: ['Money: they spend it all on stock and have nothing left for supplies, shipping or a slow week', 'Time: they go live at random and burn out packing until 2 AM', 'Buyers: they open the doors before anyone knows they exist'],
      example: "Tasha spent her whole $800 on one wholesale lot, had no money for mailers, and missed shipping by a week. Her first 20 buyers never came back. Same seller, same stock, with a $200 cushion and a packing plan, and those 20 buyers become her first regulars." },

    { chapter: 'Pick your lane', kind: 'learn', title: 'Who, what and why you', text: "Shoppers follow a seller they can describe in one sentence. Pick a lane you love, that buyers want, and that you can stock again and again.",
      table: { head: ['Question', 'Weak answer', 'Strong answer'], rows: [
        ['Who do you serve?', 'Everyone', 'Grown women who dress up for church, brunch and events'],
        ['What do you sell?', 'A little of everything', 'Bags, jewelry and statement accessories under $40'],
        ['Why you?', 'Cheap prices', 'Boutique looks on a budget, styled live by someone who gets it'],
        ['Can you restock it?', 'One closet clean-out', 'Two wholesale vendors plus thrift and closeouts'],
      ] },
      tip: "A lane isn't a cage. You can add later. Starting narrow makes your first lives easier to plan and easier to share." },
    { kind: 'scenario', title: 'Picking a lane', situation: "Renee loves shoes, has a cousin who wholesales hair accessories, and her friends always ask her for outfit advice. She has $600 to start.",
      options: [
        { text: 'Sell shoes, hair pieces, clothes and home decor so there is something for everyone', feedback: "Four lanes on $600 means a thin selection of each. Buyers can't tell what she's known for." },
        { text: 'Start with styled accessories (hair pieces plus a few bags and jewelry) that she can show on herself, and add shoes once sales are steady', best: true, feedback: "She has a supply line, a skill (styling) and a lane people can describe. Shoes can come later when the cash allows." },
        { text: 'Only sell shoes because she loves them most', feedback: 'Love matters, but shoes need lots of sizes, which ties up cash fast. Start where your supply and skills already line up.' },
      ] },
    { queen: "If you can't say what you sell and who it's for in one sentence, your buyers can't either. Keep editing until it's simple.", kind: 'reflect', title: 'Your one-sentence shop', prompt: 'Finish this: "I help ___ find ___ so they can ___."', placeholder: 'I help… find… so they can…', example: 'I help busy grown women find boutique bags and jewelry under $40 so they can walk in feeling like a million bucks.' },

    { chapter: 'Money first', kind: 'learn', title: 'The starter budget', text: "Split your starting money before you buy a single piece. A simple split many small sellers use: about half on stock, a quarter on supplies and setup, and a quarter kept back as a cushion.",
      table: { head: ['Bucket', 'Share', 'On a $1,000 start'], rows: [
        ['First stock', '50%', '$500'],
        ['Supplies and setup (mailers, labels, light, phone stand)', '25%', '$250'],
        ['Cushion (shipping, a slow week, mistakes)', '25%', '$250'],
      ] },
      tip: "Only spend what you could lose without hurting your bills. Grow with profit from sales, not with credit cards." },
    { kind: 'number', title: 'Split your start', q: 'You have $1,200 to start. Using the 50 / 25 / 25 split, how much goes to first stock?', prefix: '$', answer: 600, hint: 'Half of $1,200.', why: '$600 on stock, $300 on supplies and setup, $300 kept back. That cushion is what lets you survive a slow first month.' },
    { kind: 'learn', title: 'Price so every sale pays you', text: "New sellers often price by feel and lose money without knowing it. Add up what one piece really costs you, then price for profit.",
      table: { head: ['Cost of one piece', 'Example'], rows: [
        ['What you paid', '$6.00'],
        ['Share of shipping to you', '$0.75'],
        ['Tag, bag and mailer', '$0.60'],
        ['Payment fee (about 3%) on a $20 sale', '$0.60'],
        ['True cost', '$7.95'],
      ] },
      example: "Sell it at $20 and you keep about $12. Sell it at $10 because it \"feels fair\" and you keep about $2, before your time." },
    { kind: 'number', title: 'Find the profit', q: 'A bag costs you $9 delivered. Tag and mailer are $1, and the payment fee on a $28 sale is about $0.85. What do you keep if it sells for $28? (Round to the nearest dollar.)', prefix: '$', answer: 17, tolerance: 0.6, hint: '$28 minus $9 minus $1 minus $0.85.', why: '$28 − $10.85 = $17.15. Knowing this number for every piece is how you stay in business.' },

    { chapter: 'Set up the basics', kind: 'learn', title: 'Your launch setup list', text: "You don't need everything on day one. You need the basics done right.",
      points: [
        'A name you can say out loud on a live and that is free on Facebook, Instagram and TikTok',
        'A Facebook Page (lives sell from a Page, not a personal profile), with a clear profile photo and cover',
        'A way to get paid (Square, PayPal or your invoicing app) in the business name',
        'Shipping: a scale, mailers, and a Pirate Ship or similar account for cheaper labels',
        'Simple written policies: how to claim, when to pay, when you ship, and what happens with returns',
        'The "Make it official" courses next: license, EIN and sales tax for your state',
      ] },
    { kind: 'learn', title: 'Promise a ship time you can keep', text: "The Federal Trade Commission's Mail, Internet, or Telephone Order Rule says that when you sell by mail you need a reasonable basis for any shipping time you state. If you don't state one, the rule expects shipping within 30 days. If you can't make it, you must tell the buyer and give her the choice to cancel for a full refund.",
      tip: 'Say "ships within 5 business days" and beat it. Under-promise and over-deliver.' },
    { kind: 'script', title: 'Your pinned "how to shop with me" post', text: 'Copy, fill in, and pin it to the top of your Page.', lines: [
      'Welcome to [Shop name]! Here is how shopping with me works:',
      '1. I go live [days] at [time]. Tap Follow so you get the alert.',
      '2. To claim a piece, type SOLD and the Live number (example: SOLD 4821).',
      '3. Your invoice comes by [text / email / Messenger] after the live. Please pay within 24 hours.',
      '4. Orders ship within [number] business days. I send tracking every time.',
      '5. Questions? Message the Page. I answer within one day.',
    ] },
    { kind: 'order', title: 'Setup in order', prompt: 'Put these launch steps in a smart order.', steps: ['Pick your lane and shop name', 'Set your starter budget', 'Open your Page and payment account', 'Buy your first stock', 'Tag, price and shelve it', 'Announce your first live'] },

    { chapter: 'Your first 30 days', kind: 'learn', title: 'The 30-day launch plan', text: "Lives that start from a warm audience do better. Spend the first two weeks building buzz, then go live on a steady schedule.",
      table: { head: ['Week', 'Focus', 'Do this'], rows: [
        ['1', 'Get ready', 'Lane, budget, Page, payments, policies. Receive and tag your first stock in the app.'],
        ['2', 'Build buzz', 'Post daily sneak peeks, ask 20 friends to follow and share, announce your first live date.'],
        ['3', 'First two lives', 'Same day and time each week. 45 to 60 minutes. Ship within your promise.'],
        ['4', 'Learn and adjust', 'Check Reports, ask buyers what they want, plan live 3 and 4.'],
      ] } },
    { queen: "Treat your first quiet lives as rehearsals. Practice your openings, your pitches and your thank-yous. The crowd comes later.", kind: 'scenario', title: 'The quiet first live', situation: 'Your first live had 11 viewers and 4 sales. You feel embarrassed and want to cancel next week.',
      options: [
        { text: 'Cancel and wait until you have more followers', feedback: "Followers come from showing up. Waiting usually means you never start." },
        { text: 'Go live again same day and time, thank your 4 buyers by name, ask them to share, and post their (happy) unboxings', best: true, feedback: "Four buyers is four people who trusted you. Consistency plus gratitude is how 11 viewers becomes 50." },
        { text: 'Slash every price in half next time', feedback: "Cheap prices train buyers to wait for cheaper, and you lose money. Fix reach first, not price." },
      ] },
    { kind: 'quiz', q: 'Which habit matters most in your first month?', options: ['Going live whenever you feel like it', 'Going live on the same days and times every week', 'Going live only when you have lots of new stock', 'Going live on as many apps as possible at once'], answer: 1, why: 'A steady schedule trains buyers to show up. It is the cheapest marketing you will ever do.' },
    { kind: 'learn', title: "Don't go it alone", text: "SCORE, the SBA's mentoring partner, offers free business mentors, and your local Small Business Development Center or Women's Business Center gives free or low-cost help. Inside the app, the Monday orientation class and the Wednesday \"How to go Live\" class are built for exactly this month.",
      tip: 'Book one free mentor session in your first 30 days. Bring your budget and your one-sentence shop.' },
    { kind: 'checklist', title: 'Your launch checklist', prompt: 'Tick what you will finish in the next 30 days.', items: ['Write my one-sentence shop', 'Split my start into stock, supplies and cushion', 'Work out the true cost and profit of my first 10 pieces', 'Open my Page and payment account in the shop name', 'Pin my "how to shop with me" post', 'Put my first three lives on the calendar, same day and time', 'Book a free SCORE or Women\'s Business Center session'] },
  ],
}
export default lesson
