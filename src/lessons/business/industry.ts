import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'industry', kind: 'course', school: 'Strategy and growth', title: 'Stay ahead of the industry', track: 'Business', icon: 'sparkle',
  why: 'Platforms, shipping rates, tax rules and buyer expectations change every year. The sellers who keep up are the ones still standing.',
  outcomes: [
    'Know the five kinds of change that hit live sellers hardest',
    'Follow the official sources, not rumors',
    'Meet the standards buyers now expect, and the rules sellers must follow',
    'Test new platform features early and cheaply',
    'Run a 30-minute weekly "industry hour" that keeps you ahead',
  ],
  route: { to: '/lessons', label: 'Back to Dazzle University' },
  sources: [
    { org: 'Federal Trade Commission', title: 'Business guide to the Mail, Internet, or Telephone Order Merchandise Rule', url: 'https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule' },
    { org: 'Federal Trade Commission', title: 'Disclosures 101 for social media influencers', url: 'https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers' },
    { org: 'Meta', title: 'Meta Newsroom', url: 'https://about.fb.com/news/' },
    { org: 'IRS', title: 'Form 1099-K threshold FAQs', url: 'https://www.irs.gov/newsroom/irs-issues-faqs-on-form-1099-k-threshold-under-the-one-big-beautiful-bill-dollar-limit-reverts-to-20000' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'What changes', kind: 'learn', title: 'Five kinds of change', nova: 'The rules of this game change constantly. Let\'s make sure you hear about it first, not last.',
      text: 'Almost every surprise that hurts a live seller comes from one of five places. Watch all five and very little catches you off guard.',
      table: { head: ['Kind', 'Real examples', 'What it can do to you'], rows: [
        ['Platform rules', 'Live features, creator pay programs, what can be sold', 'Lost reach or a blocked account'],
        ['Money and tax', '1099-K reporting thresholds, sales tax rules', 'Surprise tax bills or penalties'],
        ['Shipping', 'Postage price changes, new services', 'Margins shrink overnight'],
        ['Buyer habits', 'Video-first shopping, fast shipping expectations', 'Lives feel dated, buyers drift'],
        ['Competition', 'New sellers, new formats, price wars', 'Viewers split between shops'],
      ] } },
    { kind: 'learn', title: 'A real rule that changed', text: 'Form 1099-K, which payment apps send to sellers, is a good example. The reporting threshold was set to drop to $600, then the IRS phased it in, and in 2025 a new law moved it back to more than $20,000 and more than 200 transactions. Sellers who followed rumors were confused for years. Sellers who checked IRS.gov knew exactly where they stood.',
      tip: 'One thing never changed: all business income is taxable whether or not you get a 1099-K. The IRS says so plainly.' },
    { kind: 'quiz', q: 'You hear in a seller group that "Facebook is banning live sales next month." What do you do first?', options: ['Panic and move everything to another app', 'Check Meta\'s official newsroom and help center', 'Share the post so everyone knows'], answer: 1, why: 'Go to the source. Rumors spread fast in seller groups. Official pages tell you what is actually changing and when.' },

    { chapter: 'Follow the source', kind: 'learn', title: 'Your official source list', text: 'Bookmark these. When something big changes, it shows up here first.',
      table: { head: ['Topic', 'Official source'], rows: [
        ['Facebook and Instagram', 'Meta Newsroom (about.fb.com/news) and Meta for Creators'],
        ['TikTok Shop', 'TikTok Shop Seller Center announcements and Seller University'],
        ['Shipping prices', 'USPS newsroom and your shipping app\'s updates (Pirate Ship emails rate changes)'],
        ['Taxes', 'IRS.gov newsroom; your state Department of Revenue'],
        ['Selling rules', 'FTC Business Guidance (ftc.gov/business-guidance)'],
        ['This app', 'The Dazzle University "What\'s new" lessons and Nova\'s tips'],
      ] } },
    { kind: 'scenario', title: 'Postage just went up', situation: 'Your shipping app emails that USPS Ground Advantage prices go up next month. Your average label will cost about $0.40 more.',
      options: [
        { text: 'Do nothing and absorb it', feedback: '$0.40 × 300 boxes a month is $120 a month gone from profit, quietly.' },
        { text: 'Check your shipping charge, adjust it or your free-shipping line, and announce it kindly before it starts', best: true, feedback: 'You protect your margin and your buyers hear it from you first, with notice. That\'s professional.' },
        { text: 'Raise every item price by $5', feedback: 'An overcorrection. Buyers notice, and it\'s far more than the real change.' },
      ] },
    { kind: 'number', title: 'What a small change costs', q: 'Labels go up $0.40 each and you ship 300 boxes a month. How much is that per year?', prefix: '$', answer: 1440, hint: '$0.40 × 300 × 12.', why: '$0.40 × 300 = $120 a month, × 12 = $1,440 a year. Small changes are big money when you multiply them out.' },

    { chapter: 'Standards buyers expect', kind: 'learn', title: 'The bar keeps rising', text: 'Big retailers have trained buyers to expect certain things. You don\'t need to match Amazon, but you do need to meet the basics.',
      points: ['Tracking on every package, shared without being asked', 'A clear ship-by promise, kept', 'Honest photos and descriptions, flaws shown', 'A written return or problem policy', 'Quick, kind replies (same day if you can)', 'Easy payment and a real invoice'] },
    { kind: 'learn', title: 'The rules you must follow', text: 'Some standards are law. Two FTC rules matter most to live sellers.',
      table: { head: ['Rule', 'What it says, in plain words'], rows: [
        ['Mail, Internet, or Telephone Order Rule', 'Ship within the time you state. If you state no time, ship within 30 days. If you can\'t, tell the buyer and give them the choice to cancel for a refund.'],
        ['Endorsement Guides (Disclosures 101)', 'If a brand pays you or gives you free products, say so clearly, every time you promote them.'],
      ] },
      tip: 'This isn\'t legal advice. When in doubt, read the FTC\'s plain-language business guides or ask a professional.' },
    { kind: 'quiz', q: 'You promised "ships in 5 business days," but a vendor delay means you can\'t. What does the FTC rule expect?', options: ['Ship whenever it arrives, no message', 'Tell the buyer about the delay and offer to cancel for a refund', 'Cancel every order without asking'], answer: 1, why: 'When you can\'t meet your stated shipping time, the rule expects you to tell the buyer and give them the choice to wait or cancel for a refund.' },

    { chapter: 'Test early', kind: 'learn', title: 'Try new features small', text: 'Platforms often reward early users of new features with extra reach. Test new things in a small, low-risk way and keep what works.',
      points: ['Pick one new feature a month to try', 'Test it on one live or one post, not your whole week', 'Write down what you expect, then what happened', 'Keep it, change it or drop it'] },
    { kind: 'reflect', title: 'Your experiment', prompt: 'Name one new feature, format or idea you\'ll test this month, and how you\'ll know if it worked.', placeholder: 'I\'ll test… I\'ll know it worked if…', example: 'Post a 30-second Reel of my best piece the morning of each live. It worked if viewers go up 10% over 4 lives.' },
    { kind: 'learn', title: 'Where live commerce is heading', text: 'Researchers at the Wharton School and consultants at McKinsey describe live commerce as shopping plus entertainment: real people, real time, and buying without leaving the video. It grew huge in China first and keeps growing in the US.',
      points: ['Hosts who teach and entertain sell more than hosts who only list prices', 'Trust and community drive repeat buying', 'Short videos feed viewers into lives', 'Tools like comment bots, overlays and instant checkout keep getting better'],
      tip: 'Read the Wharton and McKinsey articles in the sources below. They\'re free and written for business owners.' },
    { kind: 'scenario', title: 'The new feature', situation: 'A platform adds an "instant checkout" button to lives. Your regulars are used to commenting SOLD and getting an invoice.',
      options: [
        { text: 'Ignore it, your way works', feedback: 'It works now. Buyers who get used to one-tap checkout elsewhere may expect it from you.' },
        { text: 'Test it on one live, keep SOLD comments working too, and compare sales and buyer feedback', best: true, feedback: 'Low risk, real data. Then decide.' },
        { text: 'Switch everything over tonight', feedback: 'Big changes overnight confuse regulars. Test first.' },
      ] },
    { kind: 'learn', title: 'Keep learning on purpose', text: 'Industry leaders treat learning as part of the job. Build it into your week the same way you build in packing.',
      points: ['One University course a month', 'One industry article a week from your source list', 'One conversation a month with another seller or a SCORE mentor', 'One experiment a month, written down'] },
    { kind: 'reflect', title: 'Your source list', prompt: 'Write the 5 official sources you\'ll bookmark and check weekly.', placeholder: '1… 2… 3… 4… 5…', example: 'Meta Newsroom, TikTok Shop Seller Center, USPS news, IRS newsroom, FTC business guidance.' },
    { kind: 'checklist', title: 'Your weekly industry hour', prompt: 'Block 30 minutes every week. Tick what you\'ll include.', items: ['Skim my official source list for changes', 'Check my numbers for anything unusual', 'Watch one competitor or inspiring seller\'s live for ideas', 'Take one Dazzle University lesson or course', 'Write one experiment to try this week', 'Update prices or policies if something changed'] },
  ],
}
export default lesson
