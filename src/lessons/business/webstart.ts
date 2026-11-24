import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'webstart', kind: 'course', school: 'Launching your website', title: 'Launching your website: pick the right builder', track: 'Business', icon: 'cart',
  why: 'Your lives sell for an hour. A website sells all week, while you sleep, and it\'s the one place online you own. This course helps you pick the right builder for your shop, plan your pages, and launch without wasting a month or a dollar.',
  outcomes: [
    'Explain what a website does for a live seller that Facebook can\'t',
    'Compare Square Online, Shopify, GoDaddy and AI builders on price, fees and ease',
    'Work out what a builder really costs each month, fees included',
    'Plan the six pages every boutique site needs',
    'Follow a 14-day launch plan from domain to first order',
  ],
  route: { to: '/inventory', label: 'Open Stock to download your list' },
  sources: [
    { org: 'NerdWallet', title: 'Square fees: calculator and pricing for 2026', url: 'https://www.nerdwallet.com/business/software/learn/square-fees' },
    { org: 'Square', title: 'A simpler way forward: the thinking behind our new pricing plans', url: 'https://squareup.com/us/en/the-bottom-line/inside-square/pricing-plans' },
    { org: 'NerdWallet', title: 'Shopify pricing and plans 2026', url: 'https://www.nerdwallet.com/article/small-business/shopify-pricing' },
    { org: 'Tech.co', title: 'GoDaddy pricing (October 2026)', url: 'https://tech.co/website-builders/godaddy-pricing' },
    { org: 'Fit Small Business', title: 'Best AI website builders', url: 'https://fitsmallbusiness.com/best-ai-website-builders/' },
  ],
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Why a website', kind: 'learn', title: 'Your shop, open all week', nova: 'Boss, Facebook is the party. Your website is your storefront. You need both!',
      text: 'Facebook and your lives bring the crowd. A website keeps selling after the live ends: the pieces you didn\'t get to, your restocks, gift cards, and the buyer who found you on Google at midnight. You own it, so a new algorithm or a locked account can\'t take it away.',
      table: { head: ['Only Facebook', 'Facebook plus a website'], rows: [
        ['Sales stop when the live ends', '"Shop the rest" link sells all week'],
        ['Buyers scroll past old posts', 'Every piece has its own page and photo'],
        ['A locked account stops your business', 'Your shop and buyer list are still yours'],
        ['Hard to find on Google', 'Buyers can search and find you'],
        ['Invoices by hand in Messenger', 'Checkout, payment and receipts happen on their own'],
      ] } },
    { kind: 'quiz', q: 'What\'s the biggest reason a live seller needs her own website?', options: ['Facebook doesn\'t allow selling', 'It keeps selling between lives, and it\'s a place online she owns', 'Websites are free forever'], answer: 1, why: 'Your website sells 24/7 and can\'t be taken away by a platform change. Lives and the site work together.' },

    { chapter: 'The four choices', kind: 'learn', title: 'Meet the builders', text: 'You don\'t need a web designer. These four kinds of builders cover almost every boutique. Prices are from November 2026 and change often, so check each company\'s pricing page before you sign up.',
      table: { head: ['Builder', 'Best for', 'Starts at', 'Online card fee'], rows: [
        ['Square Online', 'Sellers who already use Square or want a free start', 'Free; Plus $49/mo', '3.3% + 30¢ on Free, 2.9% + 30¢ on Plus'],
        ['Shopify', 'Serious online growth, lots of products, apps', 'Basic $29/mo yearly ($39 monthly)', '2.9% + 30¢ on Basic'],
        ['GoDaddy Airo', 'Domain and site in one place, AI does the first draft', 'About $10 to $25/mo first year', 'About 2.7% + 30¢ with GoDaddy Payments'],
        ['AI builders (Wix, Squarespace, Hostinger)', 'Fast, pretty sites from a short description', 'About $4 to $29/mo for selling plans', 'Varies by payment company'],
      ] },
      tip: 'Every builder charges a card fee on each sale. That fee often costs more than the monthly plan, so always compare both.' },
    { kind: 'learn', title: 'Which one fits you?', text: 'Answer these questions honestly. Your answers point to a builder.',
      table: { head: ['If this sounds like you…', 'Start with'], rows: [
        ['I already take payments with Square at events or pop-ups', 'Square Online (stock and sales stay in one place)'],
        ['I want to test a website for $0 first', 'Square Online Free'],
        ['I have 200+ pieces and want to grow online sales seriously', 'Shopify'],
        ['I want to sell from links in Facebook and Instagram, no full site yet', 'Shopify Starter ($5/mo)'],
        ['I already bought my domain at GoDaddy', 'GoDaddy Airo'],
        ['I want the prettiest site the fastest, and I\'ll edit it myself', 'An AI builder like Wix or Squarespace'],
      ] } },
    { kind: 'scenario', title: 'Pick for Tasha', situation: 'Tasha sells handbags on two lives a week. She takes cards at church vendor fairs with a Square reader, has about 80 pieces, and has never had a website. She wants to start cheap.',
      options: [
        { text: 'Shopify Advanced, so she never outgrows it', feedback: 'At $299 to $399 a month, that\'s a big bill for 80 pieces. She can move up later when sales prove it.' },
        { text: 'Square Online, starting on Free and moving to Plus for her own domain', best: true, feedback: 'Her Square reader, stock and sales stay in one place, and she can start at $0. Plus adds her own domain and removes Square ads when she\'s ready.' },
        { text: 'Build it herself in code to save money', feedback: 'Coding costs her weeks she could spend selling, and she\'d still need payments, security and hosting.' },
      ] },

    { chapter: 'The real cost', kind: 'learn', title: 'Monthly plan plus fees', text: 'The true cost of a website is the plan, plus card fees on every sale, plus your domain and any paid apps. Here\'s a month with $2,000 in online sales from 50 orders.',
      table: { head: ['Builder and plan', 'Plan', 'Card fees on $2,000 (50 orders)', 'About per month'], rows: [
        ['Square Online Free', '$0', '3.3% × $2,000 + 50 × 30¢ = $81', '$81'],
        ['Square Plus', '$49', '2.9% × $2,000 + 50 × 30¢ = $73', '$122'],
        ['Shopify Basic (yearly)', '$29', '2.9% × $2,000 + 50 × 30¢ = $73', '$102'],
        ['GoDaddy (first year)', 'About $25', '2.7% × $2,000 + 50 × 30¢ = $69', 'About $94'],
      ] },
      tip: 'Add a domain (about $16 to $23 a year) and any apps. Watch the renewal price too: GoDaddy\'s first-year prices go up when they renew.' },
    { kind: 'number', title: 'Do the math', q: 'You sell $1,000 online in a month, in 20 orders, on a plan that charges 2.9% + 30¢ per order. How much do you pay in card fees?', prefix: '$', answer: 35, hint: '2.9% of $1,000, plus 20 × $0.30.', why: '$29 + $6 = $35. That\'s on top of the monthly plan.' },
    { kind: 'learn', title: 'Watch for these extra costs', text: 'Most surprise bills come from the same few places. Know them before you click Buy.',
      points: ['Renewal prices: many first-year deals go up in year two', 'Paid themes: Shopify\'s premium themes run about $100 to $500 one time; free themes are fine to start', 'Apps: each one adds a monthly fee; add only what earns its keep', 'Using an outside payment company on Shopify adds a 0.6% to 2% fee per sale', 'Email at your own domain, like hello@yourshop.com, is often extra', 'Free plans show the builder\'s ads and usually can\'t use your own domain'] },

    { chapter: 'Your name online', kind: 'learn', title: 'Pick a domain buyers can remember', text: 'Your domain is your web address, like dazzlefinds.com. It costs about $16 to $23 a year and moves with you if you ever change builders, so it\'s the one thing to get right from the start.',
      table: { head: ['Do', 'Avoid'], rows: [
        ['Short and easy to say on a live', 'Long names buyers can\'t spell'],
        ['.com when you can get it', 'Odd endings buyers forget'],
        ['Your shop name, the same as your Facebook Page', 'A name that doesn\'t match your brand'],
        ['Buy it in your own name and account', 'Letting a helper or designer own it'],
      ] },
      tip: 'Turn on auto-renew for your domain. If it lapses, someone else can buy it.' },
    { kind: 'quiz', q: 'Who should own your domain?', options: ['The designer who set up your site', 'You, in your own account, with auto-renew on', 'Whoever is cheapest this year'], answer: 1, why: 'Your domain is your address online. Keep it in your name so you can move builders any time.' },

    { chapter: 'Plan your pages', kind: 'learn', title: 'The six pages every boutique needs', text: 'Keep it simple. Six pages cover almost everything a buyer looks for before she trusts you with her card.',
      table: { head: ['Page', 'What goes on it'], rows: [
        ['Home', 'Your best photo, one line on who you are, and a big Shop now button'],
        ['Shop', 'Every piece with real photos, price, size and condition'],
        ['About', 'Your face, your story, and why you started'],
        ['Lives', 'When you go live and a link to your Facebook Page'],
        ['Shipping and returns', 'How fast you ship, what it costs, and your return rule'],
        ['Contact and privacy', 'How to reach you, plus your privacy statement'],
      ] } },
    { kind: 'order', title: 'Put the launch in order', prompt: 'Put these launch steps in order.', steps: ['Pick your builder and plan', 'Buy or connect your domain', 'Choose a theme and add your logo and colors', 'Add your pieces with real photos', 'Write your shipping, returns and privacy pages', 'Turn on payments and taxes', 'Place a test order', 'Announce it on your next live'] },
    { kind: 'learn', title: 'Get your pieces in fast', text: 'You don\'t have to type every piece twice. In Dazzle Warehouse, open Stock, filter to what you want online, and tap Download this list. You get a spreadsheet of names, prices and sizes that you can tidy and import into Shopify or Square instead of typing each one.',
      points: ['Each builder has its own import template; copy your columns into theirs', 'Add photos after importing; real photos sell, so never skip them', 'Start with 20 to 30 of your best pieces, not everything'],
      tip: 'Keep your Live Numbers or item codes in the SKU column so online orders match your bins.' },

    { chapter: 'Launch in 14 days', kind: 'checklist', title: 'Your 14-day launch plan', prompt: 'Tick these off over the next two weeks.', items: ['Days 1 to 2: pick a builder and start the trial', 'Day 3: get your domain', 'Days 4 to 5: theme, logo, colors and Home page', 'Days 6 to 8: add your first 20 to 30 pieces with real photos', 'Day 9: About, Lives, Shipping and returns, Contact and privacy pages', 'Day 10: turn on payments and sales tax', 'Day 11: place a test order and refund it', 'Day 12: check every page on your phone', 'Day 13: add the link to Facebook, Instagram and your bio', 'Day 14: announce it on your live with a launch code'] },
    { kind: 'script', title: 'Announce it on your live', text: 'Say this near the start of the live, while the crowd is biggest.', lines: [
      '"Y\'all, big news! The boutique is officially online at [yourshop.com]."',
      '"Everything I don\'t get to tonight goes up there after the live."',
      '"Use code LAUNCH10 for 10% off this week only."',
      '"Save the link so you never miss a restock."',
    ], tip: 'Pin the link in your comments and put it in your Page\'s About section.' },
    { kind: 'reflect', title: 'Your pick', prompt: 'Which builder will you start with and why? What will your domain be?', placeholder: 'I\'ll start with… because… My domain:', example: 'Square Online Free, because I already use a Square reader at vendor fairs. My domain will be dazzlefindsboutique.com once I move to Plus.' },
  ],
}
export default lesson
