import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'launch', title: 'Orientation: launch your shop in 30 days', track: 'Start here', icon: 'sparkle',
  why: 'A calm, planned launch beats a frantic one. Get the gear, the space and the habits right once, and every live after is easier.',
  outcomes: [
    'Buy the right starter gear without overspending',
    'Lay out your space in four zones: receive, store, sell, pack',
    'Know which lessons to take, in what order, for you and each helper',
    'Set first-month goals you can actually track in the app',
    'Run a 30-day launch plan, week by week',
  ],
  route: { to: '/', label: 'Go to Home' },
  sources: [
    { org: 'U.S. Small Business Administration', title: 'Manage your finances', url: 'https://www.sba.gov/business-guide/manage-your-business/manage-your-finances' },
    { org: 'U.S. Small Business Administration', title: 'Write your business plan', url: 'https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan' },
    { org: 'ASQ (American Society for Quality)', title: 'What is 5S?', url: 'https://asq.org/quality-resources/five-s-tutorial' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Welcome to Dazzle', kind: 'learn', title: 'You\'re building a real business', nova: 'Welcome to the family, boss! I\'m Nova, and I\'ll walk with you every step of the way.',
      text: 'Dazzle Warehouse runs the whole trip for every piece you sell: receive it, tag it, shelve it, plan it, sell it live, pick it, pack it, ship it, and see the money. This orientation gets your gear, your space and your first month set up so the app has something solid to run on.',
      points: ['Week 1: gear and space', 'Week 2: settings, shelves and your best sellers', 'Week 3: your first planned live', 'Week 4: review the numbers and tune up'] },
    { kind: 'learn', title: 'Learn it live with us', text: 'Orientation is more than these lessons. Every week the Dynamic Dazzle team teaches live classes, with a daytime and an evening time so you can come around work and family. Find the times and save your seat on the University page, under Orientation.',
      table: { head: ['When', 'Class', 'What you\'ll leave with'], rows: [
        ['Mondays', 'Implementation meeting', 'Settings done, tags printing, shelves labeled'],
        ['Wednesdays', 'How to go Live', 'A planned live, a calendar slot and the comment bot connected'],
        ['Any day', '1:1 coaching', 'Help with your own stock and your own questions'],
        ['Any day', 'Schedule time with the Queen', '1:1 business consulting on any topic (paid; first full hour 50% off)'],
      ] },
      tip: 'Take the matching lessons before each class. You\'ll spend class time on your questions instead of the basics.' },
    { kind: 'reflect', title: 'Why you\'re here', prompt: 'In one or two sentences: what do you want your shop to look like 6 months from now?', placeholder: 'In 6 months my shop…', example: 'Two lives a week, 50 orders each, packed in under 2 hours, and $2,000 profit a month so I can cut back my second job.' },

    { chapter: 'Your starter kit', kind: 'learn', title: 'The gear you actually need', text: 'You don\'t need fancy equipment to start. Here\'s a starter kit most sellers can put together for a few hundred dollars. Prices are rough and change often, so shop around.',
      table: { head: ['Gear', 'What to get', 'About'], rows: [
        ['Label printer', '4×6 direct thermal printer (does 2×1 tags too)', '$80 to $150'],
        ['Labels', 'White 2×1 roll for tags and bins, yellow 2×1 for sale, 4×6 for shipping', '$20 to $60 to start'],
        ['Scanner', 'USB or Bluetooth barcode scanner (or use your phone\'s camera free)', '$0 to $40'],
        ['Shelving', '1 or 2 steel shelving units', '$60 to $150 each'],
        ['Bins', 'Clear bins or open-front bins that fit your shelves', '$2 to $6 each'],
        ['Packing', 'Postal scale, tape gun, mailers in 2 or 3 sizes', '$40 to $80'],
        ['Live setup', 'Phone stand or tripod, ring light', '$25 to $60'],
      ] },
      tip: 'Your phone is a scanner on day one. Buy a handheld scanner when you\'re scanning more than about 50 pieces a week.' },
    { kind: 'number', title: 'Your launch budget', q: 'You buy a $90 printer, $45 of labels, a $30 scanner, two $75 shelving units and 30 bins at $3 each. What\'s your total?', prefix: '$', answer: 405, hint: '90 + 45 + 30 + (2 × 75) + (30 × 3).', why: '$90 + $45 + $30 + $150 + $90 = $405. Write it down as a business expense. The SBA recommends keeping business money separate from personal money from the very first purchase.' },
    { kind: 'learn', title: 'Keep the money separate', text: 'The U.S. Small Business Administration\'s first piece of advice on managing money: keep business and personal money apart. It makes taxes simpler, shows you the truth about profit, and protects you.',
      points: ['Open a separate checking account (many are free) for the shop', 'Pay for gear and stock from it, and send payouts into it', 'Save every receipt; snap a photo the day you buy', 'Put a little aside from every payout for taxes'] },

    { chapter: 'Set up your space', kind: 'learn', title: 'Four zones', nova: 'Even a spare bedroom can run like a mini warehouse. It\'s all about zones.',
      text: 'Big warehouses keep work moving in one direction: things come in one side, get stored, get picked, and leave the other side. You can do the same in a basement, a garage or a corner of a room.',
      table: { head: ['Zone', 'What happens there', 'Must-haves'], rows: [
        ['Receive', 'Hauls get unboxed, checked, priced and tagged', 'A table, the printer, a trash bag for packaging'],
        ['Store', 'Every piece lives in a bin with an address', 'Shelves, bins, bin labels'],
        ['Sell', 'Your live corner', 'Good light, a plain backdrop, a rack for tonight\'s pieces'],
        ['Pack', 'Orders get picked, scanned and boxed', 'Table, scale, mailers, scanner, printer within reach'],
      ] },
      tip: 'Put Pack closest to the door, so finished boxes leave without crossing the room. Put your fastest-selling stock on the shelves nearest Pack.' },
    { kind: 'scenario', title: 'One room, four zones', situation: 'Your whole shop is one 10×12 spare bedroom. The door is on the left wall and the window is on the far wall.',
      options: [
        { text: 'Live corner by the door, packing by the window', feedback: 'Finished boxes would cross the whole room to get out, and the door traffic would be behind you on camera.' },
        { text: 'Packing by the door, shelves down the middle wall, live corner by the window for natural light, receiving table next to the shelves', best: true, feedback: 'Boxes leave by the door, light is on your face for lives, and new stock goes straight from the receiving table onto shelves.' },
        { text: 'Keep everything in tubs and set up each zone when you need it', feedback: 'Setting up and tearing down every time is waste. Permanent zones save that time every single week.' },
      ] },
    { kind: 'checklist', title: 'Space setup', prompt: 'Tick these off during week 1.', items: ['Pick a spot for each of the four zones', 'Put the printer between Receive and Pack', 'Assemble shelves and number them in walking order', 'Clear out anything that isn\'t stock or supplies', 'Set up the live corner and test the light on camera'] },

    { chapter: 'Learn the system', kind: 'learn', title: 'Your lesson path', text: 'Take the University lessons in this order. Each one takes about 15 minutes and ends with a button to try it for real.',
      table: { head: ['Week', 'Lessons'], rows: [
        ['1', 'Welcome: how your shop flows · Make the app yours in Settings · Your seller profile and privacy'],
        ['2', 'Print 2×1 tags on your thermal printer · Set up your shelves and bins · Receive an item · Scan to put away and look up'],
        ['3', 'Plan a live that pops · Get ready for live · Let the comment bot take the orders · Bring in your live sales'],
        ['4', 'Pick and pack, grocery style · Ship with Pirate Ship · Know your customers · Read your money'],
      ] },
      tip: 'Then pick a business course a week. Start with Organize your stock like the big warehouses, it pays off fastest.' },
    { kind: 'learn', title: 'Bringing on helpers', text: 'Each helper signs in as themselves, so their lesson progress and certificates are their own. Give each person one job to own and the lessons for that job.',
      table: { head: ['Helper role', 'Their lessons'], rows: [
        ['Receiving', 'Receive an item, Bulk upload a delivery, Print 2×1 tags on your thermal printer'],
        ['Put-away and counts', 'Set up your shelves and bins, Scan to put away and look up, Damage out broken pieces'],
        ['Packing', 'Pick and pack grocery style, Ship with Pirate Ship, and the course Pick and pack like the pros'],
        ['Live co-host', 'Get ready for live, Let the comment bot take the orders, Run a sale on old stock'],
      ] } },
    { kind: 'quiz', q: 'Your sister will pack orders on Wednesdays. What\'s the best way to train her?', options: ['Let her watch you once', 'Give her her own sign-in and the Pick and pack lesson, then pack one live together', 'Share your password so she sees everything'], answer: 1, why: 'Her own sign-in keeps her progress and actions separate, the lesson teaches the steps, and one live together locks it in. Never share your password.' },

    { chapter: 'Your first month', kind: 'learn', title: 'Goals you can see', text: 'A goal you can\'t measure is a wish. Pick three numbers for your first month. All three show up in the app, so you\'ll know where you stand every day.',
      table: { head: ['Goal', 'Where you\'ll see it', 'A good first target'], rows: [
        ['Pieces tagged and shelved', 'Inventory count', 'Your next 2 lives\' worth'],
        ['Lives run on the system', 'Live Planner', '4 (one a week)'],
        ['Profit for the month', 'Home and Reports', 'Set it in Settings, then beat it'],
      ] } },
    { kind: 'order', title: 'Your 30 days', prompt: 'Put the launch weeks in order.', steps: ['Gear, space and four zones', 'Settings, shelves, and your best sellers tagged', 'First live planned and run on the system', 'Review Reports and tune up'] },
    { kind: 'scenario', title: 'The overwhelmed week', situation: 'It\'s week 2. You\'ve tagged 30 pieces, but 400 more are still in tubs, and you feel behind.',
      options: [
        { text: 'Stop lives until every piece is in the system', feedback: 'No sales means no money and no motivation. You don\'t need everything in to start.' },
        { text: 'Tag what you\'ll sell in the next live, run it on the system, and add one tub a week', best: true, feedback: 'That\'s the way. Every live adds to the system, and in a couple of months the tubs are gone.' },
        { text: 'Go back to the notebook, it was faster', feedback: 'It feels faster for one day. The system wins by the second live, when nothing gets lost.' },
      ] },
    { kind: 'checklist', title: 'Your launch plan', prompt: 'Tick each week as you finish it.', items: ['Week 1: buy gear, set up four zones, open a business bank account', 'Week 1: take the Start here lessons and fill in Settings', 'Week 2: print bin labels, tag and shelve my best sellers', 'Week 3: plan and run my first live on the system', 'Week 4: pick, pack and ship with scans, then check Reports', 'Week 4: start my first business course'] },
  ],
}
export default lesson
