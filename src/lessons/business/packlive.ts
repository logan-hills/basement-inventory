import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'packlive', kind: 'course', school: 'Operations', title: 'Pack in real time: ship while you sell', track: 'Business', icon: 'pack',
  why: 'The fastest sellers start packing before the live ends. Warehouse science from Georgia Tech and lean methods from Toyota show you how to do it without mistakes.',
  outcomes: [
    'Explain "flow" and why packing in small waves beats one giant pile',
    'Set up a live-packing station your helper can run during the show',
    'Use the claim, pay, pack cycle so paid orders ship the same day',
    'Handle unpaid, cancelled and swapped orders without slowing down',
    'Measure ship time and keep your promise to buyers and the law',
  ],
  route: { to: '/orders', label: 'Open Pick and pack' },
  sources: [
    { org: 'Georgia Tech, Bartholdi and Hackman', title: 'Warehouse and Distribution Science (free textbook)', url: 'https://www2.isye.gatech.edu/~jjb/wh/book/' },
    { org: 'Lean Enterprise Institute', title: 'Lean lexicon: flow, takt time, standardized work', url: 'https://www.lean.org/explore-lean/lexicon-terms/' },
    { org: 'Toyota', title: 'Toyota Production System', url: 'https://global.toyota/en/company/vision-and-philosophy/production-system/' },
    { org: 'Federal Trade Commission', title: 'Business guide to the Mail, Internet, or Telephone Order Merchandise Rule', url: 'https://www.ftc.gov/business-guidance/resources/business-guide-ftcs-mail-internet-or-telephone-order-merchandise-rule' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Why pack in real time', kind: 'learn', title: 'The pile problem', nova: 'Picture 60 sold pieces in a heap at 10 PM. Now picture 40 of them already boxed. That\'s what we\'re building.',
      text: 'Most sellers sell for an hour, then face a mountain: every piece, every buyer, all at once. Lean thinkers call this batch-and-queue: work piles up, then waits. Toyota built its system on the opposite idea, called flow: move work along in small steps so nothing sits. For a live seller, flow means packing paid orders during and right after the live, in small waves, instead of one giant pile the next day.',
      points: ['Less sorting: fewer pieces on the table at once means fewer mix-ups', 'Faster shipping: paid orders can leave the same day', 'Calmer nights: you go to bed with most of the work done', 'Happier buyers: "It shipped already?!" is great marketing'] },
    { kind: 'quiz', q: 'In lean terms, what is "flow"?', options: ['Doing everything as one big batch at the end', 'Moving work along in small steps so nothing sits waiting', 'Working as fast as possible'], answer: 1, why: 'Flow is about small, steady steps with little waiting. It isn\'t rushing. It\'s removing the pile.' },

    { chapter: 'Set up the station', kind: 'learn', title: 'A packing station next to the set', text: 'Georgia Tech\'s warehouse textbook shows that most picking time is walking and searching. During a live, the sold pieces come off your rack right next to the camera, so put the packing station there too. No walking, no searching.',
      table: { head: ['Spot', 'What lives there'], rows: [
        ['Sold tray (by the host)', 'Each sold piece goes here, Live # card face up'],
        ['Helper\'s table, left', 'Sold tray, scanner, printed box labels'],
        ['Helper\'s table, center', 'Open mailers, tissue, thank-you cards'],
        ['Helper\'s table, right', 'Tape, scale, sealed boxes waiting for payment check'],
        ['Shelf below', 'Mailers by size, spare tape, extra labels'],
      ] },
      tip: 'Keep the packing table out of the camera frame but within arm\'s reach of the sold tray.' },
    { kind: 'learn', title: 'Two jobs, two people', text: 'If you have a helper, split the jobs. You sell. She packs. Lean calls this balancing the line: each person has a steady job and nobody waits on the other.',
      table: { head: ['Host', 'Helper'], rows: [
        ['Shows and sells each piece', 'Takes the sold piece from the tray'],
        ['Calls the buyer\'s name: "Sold to Keisha!"', 'Checks the claim in the comment bot list'],
        ['Keeps the show moving', 'Scans the piece into the buyer\'s order'],
        ['Reminds people to pay', 'Packs paid orders as payments come in'],
      ] },
      example: 'No helper? You can still flow: drop each sold piece in a bag labeled with the buyer\'s name, then pack in waves during short breaks and right after you end the live.' },
    { kind: 'order', title: 'One sold piece, start to finish', prompt: 'Put the steps for one sold piece in order during a live.', steps: ['Host says "Sold to Keisha" and puts the piece on the sold tray', 'Helper checks the claim in the comment bot list', 'Helper scans the piece into Keisha\'s order', 'Keisha pays her invoice', 'Helper packs, labels and seals the box', 'Box goes on the ready-to-ship shelf'] },

    { chapter: 'Claim, pay, pack', kind: 'learn', title: 'Only pack what\'s paid', nova: 'Boxing up an unpaid order is like baking a cake for someone who might not come to the party.',
      text: 'Packing before payment feels fast, but unpaid orders have to be unpacked and restocked if the buyer backs out. The rule the pros use: claim at the live, invoice right away, and pack in waves as payments land.',
      points: ['Send invoices during or right after the live, not the next day', 'Set a clear pay-by time and say it on every live, like "Pay by 10 AM tomorrow"', 'Pack a wave every time 5 to 10 payments come in', 'Unpaid by the deadline? Send one friendly reminder, then return the piece to stock', 'Never ship before payment clears'] },
    { kind: 'scenario', title: 'The rush of payments', situation: 'It\'s 9:15 PM, the live ended 15 minutes ago, and 18 buyers just paid. You have 2 hours before bed.',
      options: [
        { text: 'Wait until tomorrow and do them all at once', feedback: 'That rebuilds the pile you were trying to avoid, and pushes shipping back a day.' },
        { text: 'Pack the 18 paid orders in two waves of 9, scanning each piece into its box', best: true, feedback: 'Right. Small waves keep the table clear and the scan catches mix-ups. Tomorrow you only pack the late payers.' },
        { text: 'Pack everything sold, paid or not, to save time', feedback: 'Any buyer who doesn\'t pay means unpacking and restocking. Pack what\'s paid.' },
      ] },
    { kind: 'learn', title: 'Takt time: your packing beat', text: 'Lean factories use takt time: how often one unit must be finished to keep up with demand. You can use the same idea at the packing table.',
      table: { head: ['Step', 'Example'], rows: [
        ['Time you have', '2 hours after the live = 120 minutes'],
        ['Orders to pack', '30 paid orders'],
        ['Takt time', '120 ÷ 30 = 4 minutes per order'],
        ['If you take longer', 'Prep more before the live: labels printed, mailers folded, cards signed'],
      ] } },
    { kind: 'number', title: 'Your beat', q: 'You have 90 minutes after a live and 36 paid orders to pack. How many minutes per order is your takt time?', answer: 2.5, tolerance: 0.05, suffix: 'min', hint: 'Divide the minutes by the orders.', why: '90 ÷ 36 = 2.5 minutes per order. Time yourself on 5 orders. If it takes 4 minutes each, set up more before the live.' },

    { chapter: 'Handle the curveballs', kind: 'learn', title: 'Swaps, cancels and missed claims', text: 'Real lives get messy. Decide the rules before the live so you never have to think about it while packing.',
      table: { head: ['What happens', 'Your rule'], rows: [
        ['Two people claim the same piece', 'First claim in the comment bot list wins; offer the second buyer a similar piece'],
        ['Buyer cancels after packing', 'Unpack, scan the piece back to its bin, update the order'],
        ['Buyer wants to add a piece', 'Add it to her order before packing; combine shipping'],
        ['Piece is damaged when you pull it', 'Tell the buyer right away and offer a swap or refund'],
        ['Buyer never pays', 'One reminder, then cancel and restock at the deadline'],
      ] } },
    { kind: 'scenario', title: 'Two buyers, one bracelet', situation: 'Mid-live, Tasha and Monique both type SOLD 4821 within a second of each other. You\'re not sure who was first.',
      options: [
        { text: 'Give it to whoever spends more', feedback: 'That feels unfair to buyers, and they will notice. Use a clear rule.' },
        { text: 'Check the comment bot list for the first claim, give it to her, and offer the other buyer a similar piece on the spot', best: true, feedback: 'Right. A clear, fair rule keeps trust, and offering a backup often saves the second sale.' },
        { text: 'Ask both to fight it out in the comments', feedback: 'That slows the live and can sour the mood for everyone watching.' },
      ] },
    { kind: 'learn', title: 'The second scan is your safety net', text: 'When you\'re packing fast, mistakes happen. The answer is not "be careful." It\'s a check built into the process, what Toyota calls poka-yoke, or mistake-proofing. In Pick and pack, scanning the piece and then the box label is that check: a green check means the right box, a red X means stop.',
      points: ['Scan every piece, every time, even when you\'re sure', 'A red X: take the piece out, find the right box, scan again', 'Never "fix it later": a mistake that leaves the table becomes a return'] },

    { chapter: 'Keep your promise', kind: 'learn', title: 'Ship time is part of the product', text: 'The FTC\'s Mail Order Rule says that when you sell by mail or online, you must have a reasonable basis for any shipping time you promise. If you don\'t state a time, you\'re expected to ship within 30 days. If you\'ll be late, you must tell the buyer and give her the option to cancel for a full refund.',
      points: ['Promise a ship time you can beat, like "Ships within 3 business days"', 'Say it on every live and in your invoice', 'If something delays you, message buyers before they ask', 'Track your real ship time so your promise stays honest'],
      tip: 'This is a plain-language summary, not legal advice. Read the FTC guide linked in Sources for the full rule.' },
    { kind: 'number', title: 'Same-day rate', q: 'Last week 48 orders were paid on live night and 36 of them shipped the next morning. What percent shipped by the next morning?', answer: 75, tolerance: 0.5, suffix: '%', hint: '36 ÷ 48 × 100.', why: '36 ÷ 48 = 75%. Packing in waves during the live is how sellers push this toward 90% or more.' },
    { kind: 'learn', title: 'Case study: the Tuesday night switch', text: 'Here\'s an example of how flow changes one seller\'s week, with the same number of orders.',
      table: { head: ['Old way', 'Packing in real time'], rows: [
        ['Pack everything Wednesday afternoon', 'Helper packs paid orders during the live'],
        ['3 hours of sorting a pile', 'About 40 minutes of waves after the live'],
        ['Ships Thursday', 'Most ships Wednesday morning'],
        ['2 or 3 mix-ups a month', 'Scan-to-box catches them on the table'],
      ] },
      tip: 'An example to show the idea. Time your own pack night before and after so you can see your real savings.' },
    { kind: 'reflect', title: 'Your live-packing plan', prompt: 'Where will your packing station go during the live, who packs, and what\'s your pay-by time?', placeholder: 'Station… Who packs… Pay by…', example: 'Folding table to the left of my ring light. My daughter packs paid orders during the live. Pay by 10 AM the next day; anything paid by then ships that afternoon.' },
    { kind: 'checklist', title: 'Pack in real time', prompt: 'Tick what you\'ll set up before your next live.', items: ['Set up a packing station within reach of the sold tray', 'Print box labels and fold mailers before the live', 'Agree on host and helper jobs', 'Set and say a pay-by time', 'Pack paid orders in waves of 5 to 10', 'Scan every piece into its box', 'Write down my real ship time'] },
  ],
}
export default lesson
