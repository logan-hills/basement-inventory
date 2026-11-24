import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'picking', kind: 'course', school: 'Operations', title: 'Pick and pack like the pros', track: 'Business', icon: 'pack',
  why: 'The pros pack hundreds of orders an hour by walking less, not by rushing more.',
  outcomes: [
    'Explain where picking time really goes, and cut the biggest piece',
    'Choose between one-at-a-time, batch, zone and wave picking for each live',
    'Walk one smart loop through your shelves with no backtracking',
    'Measure your orders per hour and your accuracy, and improve both',
    'Set up a packing station and a routine a helper can follow on day one',
  ],
  route: { to: '/orders', label: 'Open Pick and pack' },
  sources: [
    { org: 'Georgia Tech, Bartholdi and Hackman', title: 'Warehouse and Distribution Science (free textbook)', url: 'https://www2.isye.gatech.edu/~jjb/wh/book/' },
    { org: 'Oracle NetSuite', title: 'Order picking: methods and best practices', url: 'https://www.netsuite.com/portal/resource/articles/ecommerce/order-picking.shtml' },
    { org: 'Oracle NetSuite', title: 'What is batch picking?', url: 'https://www.netsuite.com/portal/resource/articles/inventory-management/batch-picking.shtml' },
    { org: 'Lean Enterprise Institute', title: 'Lean lexicon: standardized work', url: 'https://www.lean.org/explore-lean/lexicon-terms/' },
  ],
  queen: {
    welcome: "The pros don't pack faster by rushing; they walk less. I'll show you the playbook the big warehouses use, sized for your shop.",
    signoff: "Batch your picks, walk the S, and keep everything within arm's reach. You'll be done packing before you know it.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Where picking time goes', kind: 'learn', title: 'It\'s the walking', nova: 'I\'m a handbag, so trust me: I know a thing or two about being carried around. Let\'s make every trip count.',
      text: 'Warehouse researchers break a picker\'s time into four parts: walking between spots, searching for the item, grabbing it, and paperwork or setup. In study after study, walking is the biggest slice, often around half the time. The textbook Warehouse and Distribution Science from Georgia Tech calls travel the biggest single cost in picking. So the pros don\'t ask "how do I grab faster?" They ask "how do I walk less?"',
      table: { head: ['Part of picking', 'Typical share of time', 'How to shrink it'], rows: [
        ['Walking', 'About half', 'Batch orders, walk one loop, fast sellers up front'],
        ['Searching', 'About a fifth', 'Bin addresses and a list sorted by bin'],
        ['Grabbing', 'About a sixth', 'Golden zone, tidy bins'],
        ['Setup and paperwork', 'The rest', 'Printed labels and a ready cart before you start'],
      ] },
      tip: 'These shares vary by building, but the order almost never changes: walking first, searching second.' },
    { kind: 'quiz', q: 'Packing takes too long. Where should you look first?', options: ['Grab pieces faster', 'Cut down the walking', 'Buy fancier mailers'], answer: 1, why: 'Walking is usually the biggest slice of picking time. Fewer trips beats faster hands every time.' },

    { chapter: 'Four ways to pick', kind: 'learn', title: 'The pro playbook', text: 'Fulfillment centers choose a picking method based on how many orders they have and how many pieces each order holds. Here are the four you\'ll hear about, in live-seller terms.',
      table: { head: ['Method', 'How it works', 'Best when'], rows: [
        ['One at a time (discrete)', 'Pick one buyer\'s order, pack it, start the next', 'Fewer than 10 orders, or big multi-piece orders'],
        ['Batch', 'Pick many orders in one walk, then sort into boxes at the table', 'Lots of small orders (most live sales!)'],
        ['Zone', 'Each person owns an area and picks only from it', 'Two or more helpers, bigger space'],
        ['Wave', 'Release orders in groups by time, like "all paid by noon"', 'Several lives a week, or a daily ship cutoff'],
      ] } },
    { queen: "Pick for the whole live at once, not one buyer at a time. Your feet will thank you.", kind: 'learn', title: 'Batch picking is your superpower', text: 'Live sales are perfect for batch picking: lots of buyers, one or two pieces each. Instead of 30 walks for 30 orders, you take one walk with a cart, pull every piece in bin order, and then scan each piece into its buyer\'s box at the table. Pick and pack in this app is built for exactly this: scan the piece, then scan the box.',
      example: 'Tuesday\'s live has 32 orders and 51 pieces. One-at-a-time picking means 32 trips to the shelves. One batch walk with a laundry basket takes about 12 minutes, then 25 minutes of scanning into boxes. Done in under 40 minutes.',
      tip: 'Batch picking only works if you scan at the table. Without the second scan, two buyers\' pieces can land in the wrong boxes.' },
    { kind: 'scenario', title: 'Pick the method', situation: 'Thursday\'s live sold 46 orders, mostly one or two pieces each. Your cousin is coming to help, and your stock is split between the basement and the garage.',
      options: [
        { text: 'Each of you picks whole orders one at a time from both rooms', feedback: 'That\'s 46 trips, and you\'ll both keep crossing between rooms. Lots of walking, lots of bumping into each other.' },
        { text: 'Zone + batch: you batch-pick the basement, she batch-picks the garage, then you both scan into boxes at the table', best: true, feedback: 'That\'s how the pros do it. Nobody crosses rooms, each person learns her zone, and the table scan matches every piece to its buyer.' },
        { text: 'Wait until Saturday and do Tuesday and Thursday together', feedback: 'Waiting saves a walk but breaks your ship-by promise. Speed is part of the product.' },
      ] },
    { kind: 'learn', title: 'Waves keep shipping on time', text: 'A wave is a group of orders you release together. Many warehouses run a wave for each truck pickup. For you, a wave can be "everything paid by Wednesday noon" so it ships Wednesday afternoon. Anything paid later rides the next wave.',
      points: ['Pick one cutoff time per ship day and say it on every live', 'Pick and pack only paid orders in each wave', 'Late payments wait for the next wave, no special trips', 'A clear cutoff turns chaos into a calm routine'] },

    { chapter: 'One smart loop', kind: 'learn', title: 'Walk the S', nova: 'Imagine mowing a lawn. You don\'t zigzag. Same idea.',
      text: 'The simplest route the pros use is called an S-shape (or serpentine) route: go up one aisle, down the next, and never double back. Your pick list must be sorted in the same order as your walk. That\'s why bin addresses matter: sort the list by address and the route sorts itself.',
      points: ['Start and end at your packing table', 'Number racks in the order you walk past them', 'Sort the pick list by bin address, not by buyer', 'Skip aisles with nothing on the list', 'If a piece is missing, flag it and keep walking. Never stop the loop to hunt.'] },
    { kind: 'order', title: 'Sort the list', prompt: 'Your racks are numbered in walking order. Put these picks in the order you\'d grab them.', steps: ['A-01-3-B  Gold hoops', 'A-01-4-A  Pearl set', 'A-02-2-C  Red clutch', 'A-03-1-A  Leather tote', 'A-04-3-B  Silk scarf'] },
    { kind: 'learn', title: 'Pick to a cart', text: 'Carrying pieces in your arms means extra trips. Warehouses use carts with slots. You can make one for under $30.',
      points: ['A rolling cart or laundry basket with a few small bins', 'Your phone or scanner clipped on', 'A pen and a few sticky notes for "missing" flags', 'One bin for "found but damaged"'],
      tip: 'For tiny pieces like rings, use a divided bead box so nothing tangles or falls out.' },

    { chapter: 'Measure it', kind: 'learn', title: 'Two numbers the pros watch', text: 'Fulfillment managers watch two numbers above all: how many orders get done per hour, and how many go out right. Speed without accuracy just ships mistakes faster.',
      table: { head: ['Number', 'How to work it out', 'Good goal for a live seller'], rows: [
        ['Orders per hour', 'Orders packed ÷ hours spent picking and packing', 'Beat your own last week'],
        ['Accuracy', 'Orders with no mistake ÷ all orders × 100', '99% or better'],
        ['Mistakes per 100', 'Wrong or missing orders per 100 shipped', '1 or fewer'],
      ] } },
    { kind: 'number', title: 'Your speed', q: 'You packed 36 orders in 1.5 hours. How many orders per hour is that?', answer: 24, suffix: 'orders/hour', hint: 'Divide the orders by the hours.', why: '36 ÷ 1.5 = 24 orders an hour. Write it down. Next week try batch picking and a sorted list, then compare.' },
    { kind: 'number', title: 'Your accuracy', q: 'Last month you shipped 250 orders and 5 had a mistake. What was your accuracy, in percent?', answer: 98, tolerance: 0.2, suffix: '%', hint: '245 were right. Divide by 250, then multiply by 100.', why: '245 ÷ 250 = 98%. That sounds great, but it\'s 5 unhappy buyers a month. Scanning every piece into its box is how you get to 99% and beyond.' },

    { chapter: 'The packing station', kind: 'learn', title: 'Everything within arm\'s reach', text: 'At a pro packing station, the packer barely moves her feet. Supplies sit in the same spot every time, in the order she uses them. This is lean "standardized work": one best way, written down, so anyone can do it well.',
      table: { head: ['Zone of the table', 'What lives there'], rows: [
        ['Left (incoming)', 'The cart or basket of picked pieces'],
        ['Center', 'Scanner, the open box, tissue'],
        ['Right (outgoing)', 'Tape, thank-you cards, scale, finished boxes'],
        ['Under the table', 'Mailers sorted by size, refill tape'],
      ] },
      tip: 'Flow one direction: picked pieces come in on one side, sealed boxes leave on the other. Nothing crosses back.' },
    { queen: "Post a pack card at your station so every helper packs the same way. Consistent boxes build trust.", kind: 'script', title: 'A pack card for helpers', text: 'Print this and tape it to your table. A helper can follow it on her first day.', lines: [
      '1. Scan the piece.',
      '2. Scan the buyer\'s box label. Wait for the green check.',
      '3. Wrap the piece in tissue. Add the thank-you card.',
      '4. Weigh it. Write the weight on the label if asked.',
      '5. Seal it and move it to the "ready" side.',
      '6. Red X or missing piece? Put it in the problem bin and tell the boss.',
    ], tip: 'When something goes wrong twice, update the card, not just the person.' },
    { kind: 'scenario', title: 'The red X', situation: 'Halfway through packing, the app shows a red X: you scanned a gold bracelet into Dana\'s box, but the bracelet belongs to Tiara\'s order.',
      options: [
        { text: 'Drop it in Dana\'s box anyway, they look similar', feedback: 'Now two buyers are wrong. The red X just saved you $15 and a bad review. Listen to it.' },
        { text: 'Take the bracelet out, find Tiara\'s box, scan it there, and keep going', best: true, feedback: 'Exactly. The second scan is your safety net. Fix it on the spot and the mistake never leaves your table.' },
        { text: 'Stop everything and recount the whole batch', feedback: 'One red X doesn\'t mean the batch is wrong. Fix this piece and keep the flow going.' },
      ] },
    { kind: 'reflect', title: 'Your method', prompt: 'Think about your next live. Which picking method will you use, and what\'s your cutoff time for the first wave?', placeholder: 'I\'ll use…', example: 'Batch pick everything paid by Wednesday at noon, in one loop with my laundry basket. Then scan into boxes at the table.' },
    { kind: 'checklist', title: 'Pick like a pro this week', prompt: 'Tick what you\'ll try on your next pack day.', items: ['Time my picking and packing and work out orders per hour', 'Batch pick the whole live in one loop', 'Sort the pick list by bin address', 'Set a payment cutoff for each ship day', 'Set up the table left-to-right: incoming, scan, outgoing', 'Print the pack card for helpers'] },
  ],
}
export default lesson
