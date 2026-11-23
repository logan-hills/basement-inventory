import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'damaged', title: 'Damage out broken pieces', track: 'Stock', icon: 'damaged',
  why: 'Taking broken pieces out of stock keeps you from selling something you can\'t ship.',
  outcomes: [
    'Damage out one piece, several, or a number in seconds',
    'Damage out many items at once from Inventory, with a quantity for each',
    'Pick the right reason so your reports tell the truth',
    'Work out your shrink rate and know when it\'s too high',
    'Prevent the most common kinds of loss',
    'Decide what to do with damaged pieces: sell, fix, claim or donate',
  ],
  route: { to: '/damaged', label: 'Open Damaged' },
  covers: ['src/pages/Damaged.tsx', 'src/components/DamageSheet.tsx', 'src/components/DamageQtySheet.tsx', 'src/pages/Inventory.tsx', 'src/pages/ItemDetail.tsx'], updated: '2026-11-23',
  slides: [
    { chapter: 'Why it matters', kind: 'learn', title: 'The piece you can\'t ship', nova: 'Nobody likes this part, but it saves you from a bad night.',
      text: 'If a broken piece stays "in stock," it shows up in Get ready for live, someone claims it, and you find out at the packing table. Now you\'re messaging a buyer to cancel, and she\'s disappointed. Damaging it out the moment you spot it prevents all of that.' },
    { kind: 'learn', title: 'Shrink: the quiet profit leak', text: 'Stores call everything that disappears from stock without being sold "shrink": broken, stained, lost, or never arrived. Every shrunk piece is money you spent and will never get back. Most sellers have no idea how much they lose, because they never write it down.' },

    { chapter: 'Damage out', kind: 'learn', title: 'One, several, or a number', text: 'On an item page, swipe a tag left or tap Damage out. To do several at once, tick tags (or Select all) and Damage out, or say how many.',
      screen: { title: 'Gold hoop set', rows: ['☑ 4821-002', '☑ 4821-005'], buttons: ['Damage out 2'], highlight: 'Damage out 2' } },
    { kind: 'learn', title: 'Many items at once, with a quantity each', text: 'After a leak or a bad shipment, you may have damage across lots of items. In Inventory, tick every row that has damage (or Select all), then tap Damage out. You\'ll see each item with a − and + so you can say exactly how many of each are damaged: 2 of the hoops, 1 of the sunglasses, 0 of the scarf. Pick one reason and an optional note for the batch.',
      screen: { title: 'Damage out 3 items', rows: ['Gold hoop set #4810 · 2 on the shelf   [ − 2 + ]', 'Cat-eye sunglasses #4817 · 4 on the shelf   [ − 1 + ]', 'Silk scarf #4822 · 3 on the shelf   [ − 0 + ]'], buttons: ['1 of each', 'All of each', 'Remove 3 from stock'], highlight: 'Remove 3 from stock' },
      tip: 'A row left at 0 is skipped. The app takes the lowest tag numbers first. To pick exact tags, open the item and tick them instead.' },
    { kind: 'number', title: 'Count it up', q: 'A box got wet. In Damage out you set 3 for the scarves, 2 for the hoops, and 0 for the bangles. How many pieces come out of stock?', answer: 5, hint: 'Add up every row. Zero rows are skipped.', why: '3 + 2 + 0 = 5. The button says Remove 5 from stock so you can double-check before you tap.' },
    { kind: 'tap', title: 'Practice', prompt: 'You ticked 4 items in Inventory that got crushed in a fall. Tap the button that lets you set how many of each…', screen: { title: 'Inventory · 4 selected', buttons: ['Print tags', 'Sale tags', 'Damage out', 'Edit'] }, answer: 'Damage out', hint: 'Damage out opens a list of your ticked items with a quantity for each.' },
    { kind: 'learn', title: 'Put back several', text: 'On the Damaged page, tick the pieces that turned out fine (or the box at the top for all) and tap Put back. They go back in stock with their old tags.' },
    { kind: 'tap', title: 'Practice', prompt: 'You found two of the hoop sets tarnished. You ticked both tags. Tap…', screen: { title: 'Gold hoop set', rows: ['☑ 4821-002', '☑ 4821-005', '☐ 4821-006'], buttons: ['Reprint 2', 'Damage out 2', 'Print tags'] }, answer: 'Damage out 2', hint: 'Damage out takes the ticked tags out of stock with a reason.' },
    { kind: 'learn', title: 'Pick a reason', text: 'Choose a reason and add a note. The Damaged page lists every piece with its reason, and Reports shows Damage by reason, so you can spot what keeps going wrong.',
      table: { head: ['Reason', 'Use it when', 'Note example'], rows: [
        ['Damaged', 'Broken, bent, torn, cracked', '"Clasp snapped"'],
        ['Stained', 'Marks, makeup, discoloring, tarnish', '"Tarnish on 2 hoops"'],
        ['Missing', 'You can\'t find it after a real search', '"Not in bin, not in inbox"'],
        ['Defective', 'Came from the supplier that way', '"Stones missing on arrival, supplier X"'],
        ['Other', 'Anything else', 'Say what happened'],
      ] } },
    { kind: 'quiz', q: 'A necklace arrived from your supplier with a broken chain. Which reason?', options: ['Damaged', 'Defective', 'Missing'], answer: 1, why: 'It came that way, so it\'s Defective. That\'s the reason that tells you which suppliers to talk to, or stop using.' },
    { kind: 'learn', title: 'Mistakes are fixable', text: 'Tap Undo on the pop-up, or Put back from the Damaged page. The piece goes back in stock with its old tag.' },
    { kind: 'quiz', q: 'You marked the wrong tag damaged yesterday. What now?', options: ['Put it back from the Damaged page', 'Receive it again as a new item'], answer: 0, why: 'Put back returns it to stock with its old tag.' },

    { kind: 'scenario', title: 'It\'s not in the bin', situation: 'You\'re picking orders and Keisha\'s pearl set isn\'t in its bin. You checked the bins on either side too.',
      options: [
        { text: 'Damage it out as Missing right away', feedback: 'Too soon! It might be in the inbox spot, on the live table, or in someone else\'s box. Search first.' },
        { text: 'Tap Can\'t find it on the pick screen, check the inbox spot and the live table, and only damage it out as Missing if it\'s truly gone. Message Keisha either way.', best: true, feedback: 'You keep the order moving, search properly, and Keisha hears from you before she wonders.' },
        { text: 'Ship Keisha\'s box without it and hope she doesn\'t notice', feedback: 'She will notice. Tell her first, and offer a swap or refund.' },
      ] },
    { kind: 'quiz', q: 'You open a bag of 12 bangles and 3 have a scratch you can barely see. Best move?', options: ['Sell them at full price, nobody will notice', 'Damage them out and sell them in a flaw sale, showing the scratch on camera', 'Throw them away'], answer: 1, why: 'Honest flaw sales still bring in money, and buyers trust you more when you point out flaws yourself.' },
    { chapter: 'Know your number', kind: 'learn', title: 'Your shrink rate', text: 'Once a month, compare what you damaged out to what you received. That percent is your shrink rate. Reports shows your Damaged out count.',
      table: { head: ['Month', 'Pieces received', 'Damaged out', 'Shrink rate'], rows: [
        ['September', '400', '8', '2%'],
        ['October', '500', '25', '5%'],
        ['What it tells you', '', '', 'Something changed in October'],
      ] },
      tip: 'Many small sellers aim to keep shrink to about 2% or less. If yours jumps, look at the reasons first.' },
    { kind: 'number', title: 'Work it out', q: 'You received 320 pieces this month and damaged out 16. What\'s your shrink rate?', answer: 5, tolerance: 0.1, suffix: '%', hint: 'Damaged out ÷ received, times 100.', why: '16 ÷ 320 = 0.05, so 5%. Time to look at the reasons and find out what\'s causing it.' },

    { kind: 'quiz', q: 'Your shrink rate went from 2% to 6%. What should you look at first?', options: ['Your prices', 'The reasons on the Damaged page', 'Your live schedule'], answer: 1, why: 'The reasons tell you whether it\'s storage, try-ons, put-away habits or a supplier, and each has its own fix.' },
    { chapter: 'Prevent it', kind: 'learn', title: 'Fix the cause, not just the piece', text: 'Each reason has its own usual cause, and its own fix.',
      table: { head: ['If most are…', 'Look at', 'Try'], rows: [
        ['Damaged', 'Storage and packing', 'Don\'t over-stuff tubs, wrap fragile pieces'],
        ['Stained', 'Try-ons and storage', 'A face cover for try-ons, anti-tarnish strips in jewelry tubs, zip bags'],
        ['Missing', 'Put-away habits', 'Scan into bins right away, one inbox spot'],
        ['Defective', 'Your suppliers', 'Inspect on arrival, send photos, ask for credit'],
      ] } },
    { kind: 'scenario', title: 'Stains keep showing up', situation: 'Your Damage by reason chart shows 14 Stained this month, almost all light tops and scarves. Last month there were 2.',
      options: [
        { text: 'Raise prices on everything to cover it', feedback: 'That hides the problem instead of fixing it, and your buyers pay for it.' },
        { text: 'Look at what changed. You started trying tops on during lives this month, so you start using a face cover and doing try-ons over a fitted cami.', best: true, feedback: 'The reason pointed you right at the cause. Fix that and the stains stop.' },
        { text: 'Stop tracking stains so the chart looks better', feedback: 'The money is gone either way. The chart is how you get it back.' },
      ] },

    { chapter: 'What to do with it', kind: 'learn', title: 'Damaged isn\'t always worthless', text: 'Before you toss it, run down this list.',
      points: [
        'Supplier claim: if it arrived broken, photograph it and ask for a credit or refund right away',
        'Fix it: a new jump ring, a stain stick, a missing button',
        'Flaw sale: sell it as-is, clearly shown and named on camera ("small mark on the strap, $3")',
        'Bundle it as a bonus with another piece',
        'Donate it, and keep a note for your records',
      ],
      tip: 'Never sell a flawed piece without showing the flaw. Honesty is what makes a flaw sale work.' },
    { kind: 'script', title: 'Ask your supplier for credit', lines: [
      '"Hi [supplier], my order [order number] arrived on [date] and [number] pieces came damaged: [short description]. Photos are attached.',
      'Could you send a credit or replacement for those pieces? Thank you, I\'m looking forward to ordering again."',
    ], tip: 'Send it within a few days of delivery. Most suppliers have a short window for damage claims.' },
    { kind: 'reflect', title: 'Your damage plan', prompt: 'When will you check your shrink rate, and what will you do with damaged pieces from now on?', placeholder: 'I\'ll check…', example: 'First Saturday of each month. Supplier damage gets a claim the day it arrives, small flaws go in a $3 flaw bin on live.' },
    { kind: 'checklist', title: 'Damage habits', prompt: 'Tick the ones you\'ll start this week.', items: [
      'Inspect every haul the day it arrives',
      'Damage out a piece the moment I find a problem, with a reason',
      'Photograph supplier damage and send a claim',
      'Check my shrink rate once a month',
      'Set up a flaw bin for honest as-is sales',
    ] },
  ],
}
export default lesson
