import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'shipping', title: 'Ship with Pirate Ship', track: 'Pack and ship', icon: 'truck',
  why: 'Buying all your labels in one go saves hours and money.',
  outcomes: [
    'Turn every packed box into labels with one file',
    'Get weights right so you never overpay or get charged extra',
    'Choose a mail service and package size that fit the piece',
    'Close out orders with tracking so buyers stop asking "where\'s my stuff?"',
    'Handle returned, lost and damaged packages calmly',
  ],
  route: { to: '/shipping', label: 'Open Shipping' },
  queen: {
    welcome: "Shipping is the last impression of every order, so let's make it a good one. Pirate Ship saves you time and money. Here's how to do it all in one sitting.",
    signoff: "Weigh accurately, buy your labels in one batch, and send tracking right away. Fast, honest shipping keeps buyers coming back.",
  },
  covers: ['src/pages/Shipping.tsx'], updated: '2026-11-24',
  slides: [
    { chapter: 'One file, every label', kind: 'learn', title: 'Why Pirate Ship', nova: 'Shipping day used to take forever. Not anymore.',
      text: 'Pirate Ship is free to use and gives small sellers discounted USPS and UPS rates without a monthly fee. Better yet, it can import a whole spreadsheet of orders and buy every label in one go. The app makes that spreadsheet for you.' },
    { kind: 'learn', title: 'One file, every label', text: 'When every item in an order is picked into its box, it shows up under Ready to ship. Tap Download for Pirate Ship to get a file with every packed box, address and weight. At Pirate Ship, choose Ship → Import Spreadsheet and upload it.',
      screen: { title: 'Shipping', rows: ['Ready to ship · 14', 'Shipped'], buttons: ['Download for Pirate Ship', 'Shipped'], highlight: 'Download for Pirate Ship' } },
    { kind: 'learn', title: 'Close it out', text: 'Buy the labels at Pirate Ship, then paste each tracking number back here and tap Shipped. The order moves to done and the customer\'s history is up to date.' },
    { kind: 'order', title: 'Practice', prompt: 'Put the steps in order.', steps: ['Download for Pirate Ship', 'Import at Pirate Ship (Ship → Import Spreadsheet)', 'Check weights and buy the labels', 'Print and stick the labels', 'Paste tracking numbers and tap Shipped'] },

    { chapter: 'Weight is money', kind: 'learn', title: 'Where weights come from', text: 'The file uses the weight you saved on each item, in pounds, added up for every piece in the box. If a weight is missing or wrong, the label price is wrong too.',
      points: ['Weigh one piece in its usual mailer once, and save that as its weight', 'For jewelry, 0.25 lb (4 oz) is a common in-the-mailer weight, but weigh yours', 'Big order? Weigh the actual box before buying the label', 'Fix any weight at Pirate Ship before you buy if the box is heavier'],
      tip: 'If USPS finds a package weighs more than you paid for, they can bill the difference later. Weigh it right the first time.' },
    { kind: 'learn', title: 'Ounces add up', text: 'For light packages, USPS Ground Advantage prices go up in steps: up to 4 oz, up to 8 oz, up to 12 oz, up to 15.99 oz, then by the pound. A few ounces can push you into the next step.',
      table: { head: ['Box', 'Weight', 'Tier'], rows: [
        ['Earrings in a bubble mailer', '3 oz', 'Up to 4 oz'],
        ['Necklace in a gift box + mailer', '5 oz', 'Up to 8 oz'],
        ['Scarf in a poly mailer', '7 oz', 'Up to 8 oz'],
        ['Two tops in a poly mailer', '15 oz', 'Up to 15.99 oz'],
        ['Structured bag in a box', '1 lb 6 oz', '2 lb'],
      ] } },
    { kind: 'number', title: 'Ounces to pounds', q: 'A box weighs 1 lb 6 oz. What is that in ounces? (There are 16 ounces in a pound.)', answer: 22, suffix: 'oz', hint: '16 ounces for the pound, plus the 6.', why: '16 + 6 = 22 oz. Past 15.99 oz, USPS rounds up to the next whole pound, so this ships at the 2 lb price.' },

    { kind: 'quiz', q: 'A scarf weighs 7.5 oz in its mailer. You add a 1 oz gift box. Which tier is it in now?', options: ['Up to 4 oz', 'Up to 8 oz', 'Up to 12 oz'], answer: 2, why: '8.5 oz is just over 8, so it jumps to the up-to-12 oz price. Skip the gift box for soft pieces.' },
    { kind: 'scenario', title: 'No weight saved', situation: 'You open the Pirate Ship import and five orders show 0 lb because those items never had a weight saved.',
      options: [
        { text: 'Buy the labels at 0 lb, it\'ll be fine', feedback: 'USPS can charge you the difference later, and some labels won\'t even buy at 0.' },
        { text: 'Weigh those five boxes, fix the weights in Pirate Ship before buying, then save the item weights in the app so it\'s right next time', best: true, feedback: 'Fix today\'s labels and next week\'s at the same time.' },
        { text: 'Guess 1 lb for each', feedback: 'You\'d overpay on light boxes. A quick weigh is cheaper than guessing.' },
      ] },
    { chapter: 'Pick the service', kind: 'learn', title: 'Which service?', text: 'Pirate Ship shows you the price for each service side by side. A simple way to choose:',
      table: { head: ['Service', 'Usually best for'], rows: [
        ['USPS Ground Advantage', 'Most light packages under a pound or two. Tracking included.'],
        ['USPS Priority Mail', 'Heavier boxes, or when you want it there faster'],
        ['Priority Mail Cubic', 'Small but heavy boxes. Priced by size, not weight.'],
        ['UPS Ground', 'Bigger, heavier boxes. Compare it on Pirate Ship.'],
      ] },
      tip: 'Services and prices change. Let Pirate Ship compare, and pick the cheapest one that arrives within your promise.' },
    { kind: 'scenario', title: 'The heavy little box', situation: 'You\'re shipping a small 8×6×4 inch box with three heavy metal bangle sets. It weighs 2 lb 10 oz.',
      options: [
        { text: 'Always pick Ground Advantage, it\'s the cheap one', feedback: 'For light packages, yes. For a small, heavy box, another option can beat it.' },
        { text: 'Compare in Pirate Ship. For small, heavy boxes, Priority Mail Cubic is often cheaper because it\'s priced by size.', best: true, feedback: 'Exactly. Let the rates compare and pick the cheapest one that meets your promise.' },
        { text: 'Split it into three boxes', feedback: 'Three labels almost always cost more than one, and your buyer gets three packages.' },
      ] },
    { kind: 'learn', title: 'Pickup or drop-off', text: 'Once labels are on, you don\'t have to wait in line. USPS will pick up packages at your door for free when you schedule a pickup online at usps.com for the next mail day (check there for which services qualify). Or drop them at the counter, or in a blue box if they\'re small enough.' },

    { chapter: 'After it ships', queen: "Send tracking the same day you buy the label. Buyers who can see their package don't need to message you.", kind: 'learn', title: 'Tracking stops the questions', text: 'Pasting tracking and tapping Shipped keeps your records right. Send it to the buyer too. When buyers can see where their box is, "where\'s my stuff?" messages drop way down.' },
    { kind: 'quiz', q: 'You bought labels for 14 boxes. What\'s left to do in the app?', options: ['Nothing', 'Paste each tracking number and tap Shipped', 'Delete the orders'], answer: 1, why: 'Tracking + Shipped closes each order and updates the customer\'s history.' },
    { kind: 'scenario', title: 'Return to sender', situation: 'A box comes back marked "Return to sender: insufficient address." The buyer left out her apartment number.',
      options: [
        { text: 'Keep the piece, she should have given the right address', feedback: 'Technically fair, but she paid and wants her piece. A kind fix keeps her as a buyer.' },
        { text: 'Message her, get the full address, update it in Customers, and reship. Ask her to cover the new label, or cover it yourself for a regular.', best: true, feedback: 'Fair, friendly, and the address is fixed for every future order.' },
        { text: 'Reship to the same address and hope', feedback: 'It will just come back again.' },
      ] },
    { queen: "Take care of your buyer first, then deal with the carrier. Your buyer shouldn't have to wait on the post office.", kind: 'learn', title: 'Lost or damaged', text: 'Most "lost" packages are just slow. Give it a few business days past the expected date, then start a search with the carrier. If it\'s damaged, ask the buyer for photos.',
      points: ['Check what insurance your label includes, and add more on big orders', 'Keep the tracking number and label receipt', 'File claims through Pirate Ship or the carrier with photos', 'Keep the buyer updated the whole time (see the Communication course)'] },
    { kind: 'reflect', title: 'Your shipping day', prompt: 'Which day(s) will you ship, how will you get packages to USPS, and which items still need a weight saved?', placeholder: 'I ship on…', example: 'Wednesday and Friday. I schedule a free pickup the night before. I still need weights for my bags and the big scarves.' },
    { kind: 'checklist', title: 'Shipping setup', prompt: 'Tick each one.', items: [
      'Make a free Pirate Ship account',
      'Save weights on my best sellers',
      'Get a postal scale',
      'Do one test: download, import, check weights',
      'Pick my shipping days',
      'Paste tracking and tap Shipped every time',
    ] },
  ],
}
export default lesson
