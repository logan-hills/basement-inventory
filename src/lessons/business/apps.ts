import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'apps', kind: 'course', school: 'Tools and apps', title: 'Apps that run your shop', track: 'Business', icon: 'settings',
  why: 'The right handful of apps saves hours a week. The wrong pile of subscriptions quietly eats your profit.',
  outcomes: [
    'Build a simple "tool stack" for every job in your shop',
    'Know free options before you pay for anything',
    'Judge any app with a quick hours-saved test',
    'Run a subscription check every quarter',
    'Keep your accounts and customer data safe',
  ],
  route: { to: '/settings', label: 'Open Settings' },
  sources: [
    { org: 'U.S. Small Business Administration', title: 'Manage your finances', url: 'https://www.sba.gov/business-guide/manage-your-business/manage-your-finances' },
    { org: 'Pirate Ship', title: 'Buy batches of labels at one time', url: 'https://support.pirateship.com/en/articles/1068423-can-i-buy-batches-of-multiple-labels-at-one-time' },
    { org: 'Federal Trade Commission', title: 'Cybersecurity for small business', url: 'https://www.ftc.gov/business-guidance/small-businesses/cybersecurity' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Your tool stack', kind: 'learn', title: 'One app per job', nova: 'Apps are like handbags: you need a few great ones, not a closet full you never use.',
      text: 'List the jobs in your shop, then pick one tool for each. Here\'s a starting stack many live sellers use. Prices change, so always check.',
      table: { head: ['Job', 'Popular tools', 'Free option?'], rows: [
        ['Inventory, lives, picking, reports', 'Dazzle Warehouse (this app)', 'Free Stream plan; full tools from Gem'],
        ['Invoices and payments', 'Square, PayPal', 'Free to use; fees per payment'],
        ['Shipping labels', 'Pirate Ship', 'Free; you pay for postage'],
        ['Design', 'Canva', 'Yes, Canva Free'],
        ['Video editing', 'CapCut, built-in Reels editors', 'Yes'],
        ['Scheduling posts', 'Meta Business Suite', 'Yes'],
        ['Bookkeeping', 'QuickBooks, Wave, a spreadsheet', 'Some free options'],
        ['Mileage', 'Mileage tracker apps or a notebook', 'Yes'],
        ['AI assistant', 'Claude, ChatGPT', 'Free tiers; paid plans for more'],
      ] } },
    { kind: 'reflect', title: 'Your stack today', prompt: 'List every app and subscription your shop uses now and what each costs a month.', placeholder: 'App, job, $ per month…', example: 'Canva Pro $15 design, CapCut free video, Square free + fees, Pirate Ship free, an old editing app $12 I never open.' },

    { chapter: 'Is it worth it?', kind: 'learn', title: 'The hours-saved test', text: 'Before you pay for an app, put a value on your time. If the app saves more time (or makes more money) than it costs, it earns its spot.',
      example: 'You value your time at $20 an hour. A $15-a-month app saves you 2 hours a month = $40 of time. Worth it. A $30 app that saves 30 minutes = $10 of time. Not worth it, unless it makes you money another way.' },
    { kind: 'number', title: 'Run the test', q: 'You value your time at $25 an hour. A $29-a-month app saves you 3 hours a month. How much value does it create after its cost?', prefix: '$', answer: 46, hint: '3 hours × $25 = value. Subtract $29.', why: '3 × $25 = $75 of time, minus $29 = $46 a month ahead. Keep it.' },
    { kind: 'scenario', title: 'The shiny new app', situation: 'An ad promises an app that "automates your whole live" for $79 a month. You already use this app for lives and Pirate Ship for shipping.',
      options: [
        { text: 'Sign up, automation sounds great', feedback: 'It may duplicate tools you already pay for. $79 a month is nearly $950 a year.' },
        { text: 'List what it does that your current tools don\'t, use the free trial on one live, then run the hours-saved test', best: true, feedback: 'You only pay for real gaps, with proof. Set a reminder to cancel before the trial ends if it doesn\'t pass.' },
        { text: 'Ignore every new app forever', feedback: 'Some new tools really do save time. Test them, don\'t ban them.' },
      ] },

    { chapter: 'Subscription check', kind: 'learn', title: 'The quarterly app audit', text: 'Subscriptions creep. Every quarter, look at every charge on your business account.',
      points: ['Did I use it this month?', 'Does another tool I pay for already do this?', 'Is there a cheaper plan, or a yearly price that saves money?', 'Cancel anything that fails, today', 'Put the next audit on your calendar'] },
    { kind: 'number', title: 'Creep adds up', q: 'You find three forgotten subscriptions: $12, $9 and $19 a month. How much do you save in a year by canceling them?', prefix: '$', answer: 480, hint: 'Add them, then × 12.', why: '$40 a month × 12 = $480 a year back in your pocket. That\'s a haul of new stock.' },

    { chapter: 'Stay safe', kind: 'learn', title: 'Protect your accounts', text: 'Your Facebook page, payment apps and email are your business. The FTC\'s small business cybersecurity guidance comes down to a few habits.',
      points: ['Turn on two-step verification everywhere, especially Facebook and payments', 'Use a password manager; never reuse passwords', 'Give helpers their own logins instead of sharing yours', 'Be suspicious of messages asking you to "verify your page" through a link', 'Keep customer addresses and phone numbers inside your tools, not in screenshots or group chats'] },
    { kind: 'quiz', q: 'You get a Messenger message: "Your page will be disabled in 24 hours, verify here," with a link. What do you do?', options: ['Click and verify fast', 'Ignore the link and check alerts inside Facebook\'s own settings', 'Forward it to your helpers to deal with'], answer: 1, why: 'This is a common phishing scam. Real account alerts show up in your account settings. Never log in through a link in a message.' },
    { kind: 'learn', title: 'Case study: a $40 stack', text: 'Here\'s a lean monthly stack for a seller doing two lives a week.',
      table: { head: ['Job', 'Tool', 'Cost'], rows: [
        ['Run the shop', 'Dazzle Warehouse (Gem plan)', 'Your plan price'],
        ['Design', 'Canva Pro', 'About $15'],
        ['Video', 'CapCut free', '$0'],
        ['Shipping', 'Pirate Ship', '$0 + postage'],
        ['AI writing', 'Claude or ChatGPT paid plan', 'About $20'],
        ['Scheduling', 'Meta Business Suite', '$0'],
        ['Bookkeeping', 'A spreadsheet + Reports', '$0'],
      ] } },
    { kind: 'scenario', title: 'The helper\'s login', situation: 'Your niece will help with posting. She asks for your Facebook password.',
      options: [
        { text: 'Text it to her', feedback: 'Shared passwords spread, can\'t be taken back easily, and can trigger security locks.' },
        { text: 'Add her as a person with limited access in your Page settings, using her own account', best: true, feedback: 'She gets what she needs, you keep control, and you can remove her any time.' },
        { text: 'Do all the posting yourself forever', feedback: 'You don\'t have to. Page roles make helping safe.' },
      ] },
    { kind: 'learn', title: 'Back up what matters', text: 'If your phone dies tomorrow, what do you lose? Make sure the answer is "nothing."',
      points: ['Turn on cloud backup for photos and videos', 'Export Reports and customer lists from time to time', 'Keep receipts in a cloud folder, not just your camera roll', 'Store your brand files (logo, fonts, templates) in one shared folder'] },
    { kind: 'reflect', title: 'Your audit', prompt: 'Which app will you cancel, and which one (if any) will you add after running the hours-saved test?', placeholder: 'Cancel… Add…', example: 'Cancel the editing app I never use ($12). Add a mileage tracker, since I drive to the post office 3 times a week.' },
    { kind: 'checklist', title: 'Tool plan', prompt: 'Tick what you\'ll do this month.', items: ['Write my one-app-per-job stack', 'Run the hours-saved test on every paid app', 'Cancel anything that fails', 'Turn on two-step verification on Facebook, email and payments', 'Set up a password manager', 'Put a quarterly app audit on my calendar'] },
  ],
}
export default lesson
