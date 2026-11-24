import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'customers', title: 'Know your customers', track: 'Grow', icon: 'users',
  why: 'Your regulars are your business. Knowing them lets you thank them and sell to them better.',
  outcomes: [
    'Find your top spenders, most loyal and newest buyers in seconds',
    'Work out your repeat rate and why it matters more than new followers',
    'Run a simple VIP program that costs almost nothing',
    'Win back buyers who stopped showing up',
    'Protect your customers\' personal details',
  ],
  route: { to: '/customers', label: 'Open Customers' },
  covers: ['src/pages/Customers.tsx', 'src/lib/customers.ts'], updated: '2026-11-23',
  slides: [
    { chapter: 'Your list builds itself', kind: 'learn', title: 'Built for you', nova: 'Every name on this page is a real person who chose YOU. Let\'s treat them that way.',
      text: 'Every sale you bring in adds or updates the customer: name, Facebook name, email, phone, address, and everything they\'ve bought. You never have to type a customer list.' },
    { kind: 'quiz', q: 'How do customers get into the app?', options: ['Automatically, from your sales', 'You type each one in'], answer: 0, why: 'Uploading sales (or the comment bot) creates and updates them.' },
    { kind: 'learn', title: 'Four ways to look', text: 'The Sort menu answers four different questions. Search finds anyone by name, Facebook name, email or phone.',
      table: { head: ['Sort', 'Answers', 'Use it to'], rows: [
        ['Top spenders', 'Who spends the most?', 'Pick VIPs and thank your biggest fans'],
        ['Most orders', 'Who comes back the most?', 'Find your most loyal regulars'],
        ['Most recent', 'Who just bought?', 'Welcome new buyers and spot who\'s gone quiet (scroll to the bottom)'],
        ['Name A–Z', 'Where is she?', 'Look someone up fast'],
      ] },
      tip: 'Buyers with 3 or more orders get a Repeat badge, so regulars stand out at a glance.' },
    { kind: 'tap', title: 'Practice', prompt: 'You want to send a thank-you gift to your 5 biggest spenders. Which sort?', screen: { title: 'Customers · Sort', buttons: ['Top spenders', 'Most recent', 'Most orders', 'Name A–Z'] }, answer: 'Top spenders', hint: 'Top spenders puts the most money spent at the top.' },

    { kind: 'learn', title: 'Fill in missing details', text: 'Buyers from a Loyal Shops file often come in with no address or email. Tap Needs details to see just those buyers, tap one, then tap Edit details, fill in what is missing and Save. Phone is optional, so it is never flagged.',
      screen: { title: 'Customers', rows: ['Renee Walker · Needs address, city, ZIP'], buttons: ['Needs details', 'Edit details', 'Save'], highlight: 'Needs details' } },
    { kind: 'tap', title: 'Practice', prompt: 'You want to see only the buyers you still need an address for. What do you tap?', screen: { title: 'Customers', buttons: ['Download CSV', 'Needs details', 'Top spenders'] }, answer: 'Needs details', hint: 'It filters the list to buyers missing an address or email.' },
    { chapter: 'Why regulars matter', kind: 'learn', title: 'The repeat rate', text: 'Your repeat rate is the share of your buyers who\'ve bought more than once. It\'s one of the healthiest numbers in your business: regulars cost nothing to bring back, buy more often, and bring friends.',
      table: { head: ['', 'Shop A', 'Shop B'], rows: [
        ['Buyers this month', '100', '100'],
        ['Repeat buyers', '15', '55'],
        ['Repeat rate', '15%', '55%'],
        ['What it means', 'Always chasing new people', 'A loyal crowd that shows up'],
      ] } },
    { kind: 'number', title: 'Your repeat rate', q: 'You have 80 customers. 28 of them have a Repeat badge or 2+ orders. What\'s your repeat rate?', answer: 35, tolerance: 0.5, suffix: '%', hint: 'Repeat buyers ÷ all buyers, times 100.', why: '28 ÷ 80 = 0.35, so 35%. Write it down and check it monthly. If it climbs, your service and thank-yous are working.' },
    { kind: 'quiz', q: 'Which usually grows a live-selling business faster?', options: ['1,000 new followers who never buy', 'Turning 20 one-time buyers into regulars', 'A new logo'], answer: 1, why: 'Regulars buy again and again and bring friends. Followers who never buy don\'t pay the bills.' },

    { chapter: 'Treat your VIPs', kind: 'learn', title: 'A VIP program for pennies', text: 'You don\'t need points, apps or punch cards. Pick a simple line, and give people who cross it a little extra.',
      table: { head: ['Level', 'Who', 'What they get'], rows: [
        ['Regular', '3+ orders (the Repeat badge)', 'Shout-out by name on live, a handwritten note'],
        ['VIP', 'Your top 10 spenders', 'First look at new hauls in your Group, a small freebie each month'],
        ['Birthday', 'Anyone who tells you', 'A birthday shout-out and a tiny gift in that month\'s box'],
      ] },
      tip: 'Make a "VIP freebie" bin: hair ties, small earrings, old stock near its floor. Pennies to you, a big smile for her.' },
    { kind: 'script', title: 'Thank-you messages', lines: [
      'FIRST ORDER: "Welcome to the family, [name]! 💛 Thank you for your first order. I hope you love it. See you [next live day]!"',
      'THIRD ORDER: "[Name], you\'re officially a regular! Thank you for coming back. There\'s a little something extra in your box this time 😉"',
      'TOP SPENDER: "I just want to say thank you, [name]. You\'re one of my favorite people to see in the comments. Your VIP gift ships with your next order!"',
    ] },
    { kind: 'reflect', title: 'Your VIP plan', prompt: 'Look at your Top spenders. Who are your top 5, and what will you do for them this month?', placeholder: 'My top 5 are…', example: 'Keisha, Monique, Tasha, Brenda, Denise. Each gets a handwritten note and a pair of earrings in their next box, and a shout-out Tuesday.' },

    { kind: 'learn', title: 'Sell like a personal shopper', text: 'Tap a customer to see her address, contact details and every order, and tap any order to see what was in it. That history is gold. When you know Monique always buys gold statement earrings and Keisha loves emerald, you can call them out on live when their kind of piece comes up.',
      example: '"Monique, I see you! I KNOW you want these gold drops, I saved them for the start just for you." That line sells the piece, and it tells every viewer you know your buyers.' },
    { kind: 'quiz', q: 'Keisha has bought 6 emerald pieces. You just got an emerald bag. What\'s the best move?', options: ['Wait and see if she notices it', 'Give her a heads-up message or call her out on live when it comes up', 'Hide it for yourself'], answer: 1, why: 'Her history tells you exactly what she loves. A personal heads-up feels like VIP service.' },
    { chapter: 'Win them back', kind: 'learn', title: 'Spot who went quiet', text: 'Sort by Most recent and scroll to the bottom. Those are buyers whose last order was the longest time ago. Someone who bought every week and stopped 6 weeks ago is worth a friendly message. Often she just got busy, and a personal note brings her right back.' },
    { kind: 'script', title: 'The "we miss you" message', lines: [
      '"Hi [name]! I haven\'t seen you in the comments in a while and I just wanted to say I miss you 💛 I just got in some [thing she usually buys] I think you\'d love. I\'m live [day] at [time] ET. Hope to see you there!"',
    ], tip: 'Make it personal: mention what she likes. A message that could go to anyone feels like spam.' },
    { kind: 'scenario', title: 'The buyer who stopped coming', situation: 'Brenda bought 9 times this summer, then nothing for 7 weeks. Her last order arrived 4 days late.',
      options: [
        { text: 'Leave her alone, she\'ll come back if she wants', feedback: 'Maybe, but that late box may be the reason she drifted. Silence lets it stand.' },
        { text: 'Send a personal note: you miss her, you\'re sorry her last box was slow, and you\'ve got something for her on Tuesday', best: true, feedback: 'You own the hiccup, show you noticed her, and give a reason to come back. Most buyers love being missed.' },
        { text: 'Tag her in every post until she responds', feedback: 'That feels pushy, and public. One kind private message beats ten tags.' },
      ] },

    { chapter: 'Protect their trust', kind: 'learn', title: 'Their details are private', text: 'Buyers trust you with their home address, phone and email. Guard them like your own.',
      points: ['Never post a screenshot that shows a buyer\'s address, phone or email', 'Don\'t share your customer list with other sellers or businesses', 'Only add helpers who need to see orders, each with their own sign-in', 'Download CSV is for your own records, so keep that file somewhere safe and delete old copies'] },
    { kind: 'quiz', q: 'Another seller asks for your customer list so she can invite them to her live. What do you say?', options: ['Sure, we\'re friends', 'No, their details were given to you, not her. Offer to shout out her live instead.', 'Send just the emails'], answer: 1, why: 'Buyers shared their details to shop with you. A shout-out helps her without breaking their trust.' },
    { kind: 'checklist', title: 'Customer habits', prompt: 'Tick the ones you\'ll start this month.', items: [
      'Check my repeat rate once a month',
      'Thank every first-time buyer by message',
      'Set up a VIP freebie bin',
      'Send 3 "we miss you" messages a week',
      'Never share screenshots with customer details',
    ] },
  ],
}
export default lesson
