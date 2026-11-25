import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'pick', title: 'Pick and pack, grocery style', track: 'Pack and ship', icon: 'pack',
  why: 'Scanning each piece into the right box means no wrong items and no angry buyers.',
  outcomes: [
    'Set up a packing area so boxes never get mixed up',
    'Pick a whole live in one walk, in bin order',
    'Scan item, then box, so every piece lands with the right buyer',
    'Handle missing pieces and no-scanner days without stopping',
    'Pack each box so it arrives looking like a gift',
  ],
  route: { to: '/orders', label: 'Open Pick and pack' },
  queen: {
    welcome: "Picking is where the promise of your live becomes a real box at someone's door. The grocery-store way keeps it fast and accurate. Let's get every piece in the right box.",
    signoff: "Label the boxes first, scan every piece into its box, and pack like it's a gift. Accurate boxes are how you keep your regulars.",
  },
  covers: ['src/pages/Pick.tsx', 'src/pages/Orders.tsx', 'src/pages/BoxLabels.tsx', 'src/pages/OrderDetail.tsx', 'src/pages/Receipt.tsx', 'src/components/FreeCameraTip.tsx'], updated: '2026-11-25',
  slides: [
    { chapter: 'Why scan twice', kind: 'learn', title: 'The grocery store way', nova: 'This is the part that makes buyers trust you. Let\'s make it foolproof.',
      text: 'At the grocery store, every item gets scanned at the register, so you pay for exactly what\'s in your cart. Pick and pack works the same way: scan the piece, then scan the buyer\'s box. The two scans together prove the right piece went to the right person.' },
    { kind: 'learn', title: 'What one mistake costs', text: 'A swapped box doesn\'t just cost you postage. It costs you two unhappy buyers at once.',
      table: { head: ['Cost of one wrong box', 'About'], rows: [
        ['Return label for the wrong piece', '$4 to $5'],
        ['New label for the right piece', '$4 to $5'],
        ['A little extra to say sorry', '$2 to $5'],
        ['Your time messaging and repacking', '20 to 30 minutes'],
        ['Total, before counting the trust you lose', '$10 to $15'],
      ] } },
    { kind: 'number', title: 'Add it up', q: 'You pack 200 boxes a month. Without scanning, 2% go wrong. At about $12 each, what do mistakes cost you a month?', prefix: '$', answer: 48, hint: '2% of 200 boxes is how many? Then multiply by $12.', why: '200 × 0.02 = 4 wrong boxes × $12 = $48 a month, plus 4 buyers who may not come back. Two quick scans make it nearly zero.' },

    { chapter: 'Set up', queen: "Boxes before pieces, every time. A labeled box can't get mixed up.", kind: 'learn', title: 'Label the boxes first', text: 'Go to Pick and pack and tap Print box labels for the orders you\'re packing. Each label has the customer\'s name and the order barcode (DD-…). Print on a 4×6 shipping label printer (one box per label, roll or fan-fold) or a letter sheet of 10. Selling at a pop-up or doing local pickup? Open the order and tap Print receipt for a receipt on a 2¼ or 3⅛ inch receipt roll.',
      screen: { title: 'Orders', rows: ['To pick · 14', 'Packed · 0'], buttons: ['Print box labels', 'Upload live sales'], highlight: 'Print box labels' } },
    { kind: 'learn', title: 'Lay out the boxes', text: 'Stick a label on each open mailer or box and line them up in one place, in the same order as the labels. You\'ll walk the shelves with the pieces, then come back and drop each one in.',
      points: ['A long table, or the floor along a wall', 'Labels facing you so you can read the names', 'Bigger orders at the end of the row, so they don\'t block the small ones', 'Thank-you cards and tissue already within reach'] },

    { chapter: 'Pick', kind: 'learn', title: 'Big and clear on your phone', text: 'Tap Pick. The next item fills the screen: its photo, the big Live #, and exactly where it lives in four big boxes: Aisle, Section, Shelf and Bin. If the product has a UPC, its barcode shows too.',
      points: ['Walk the list in order: it\'s sorted by bin, so you never double back', 'Clip a scanner onto your iPhone and scan the tag or the product barcode', 'Then scan the customer\'s box'],
      screen: { title: 'Picking', rows: ['#4821 Gold hoop set', 'Aisle 1 · Section 2 · Shelf B · Bin 03', 'For Keisha J.'], buttons: ['Picked it', 'Can\'t find it', 'Skip for now'], highlight: 'Picked it' } },
    { kind: 'learn', title: 'Pick the whole live at once', text: 'Picking order by order means walking to the same bin again and again. Pick the whole live in one walk instead: the list groups every buyer who needs the same piece, so you grab all 4 pairs of hoops at once, then drop each pair in its box.',
      example: 'A 30-order live used to take one seller three trips around the basement per order. Picking in bin order, it\'s one walk of about 15 minutes, then 30 minutes at the boxes.' },
    { kind: 'quiz', q: 'Four buyers each bought the gold hoops. What\'s the fastest way to pick them?', options: ['Four separate trips, one per order', 'Grab all four pairs in one stop at the bin, then drop each pair in its box', 'Pick them last'], answer: 1, why: 'The pick list is sorted by bin, so one stop covers every buyer who needs that piece.' },
    { kind: 'order', title: 'Practice', prompt: 'Put the steps in order.', steps: ['Print box labels', 'Stick a label on each box and line them up', 'Tap Pick', 'Walk the list in bin order and scan each piece', 'Scan its box and drop it in'] },
    { kind: 'learn', title: 'Scan the bin to check you\'re in the right spot', text: 'Big warehouses have pickers scan the bin before they grab. You can too. Standing at a bin? Scan its label. Right bin: a green "Right bin! Grab 2 of #4821" and a happy beep. Wrong bin: a buzz and the bin you should be at. It\'s optional, but it catches mix-ups before a piece leaves the shelf.',
      screen: { title: 'Picking', rows: ['1 · Scan bin, then item', 'Right bin! Grab 2 of #4821 from A1-S2-B-03'], buttons: ['Picked it'] } },
    { kind: 'quiz', q: 'You scan the bin label at A1-S1-A-02 and the app buzzes "Wrong bin". What now?', options: ['Grab the piece anyway', 'Go to the bin it names, then scan that one', 'Mark it short'], answer: 1, why: 'The buzz means the piece you need lives somewhere else. Walk to the bin it shows you.' },
    { kind: 'learn', title: 'Wrong box? It tells you', text: 'Scan the wrong box and the app buzzes and shows the right one. Scan a piece nobody in this pick needs and it tells you to put it back. If a piece isn\'t in a bin yet, it says to check the "No bin" pile.' },
    { kind: 'quiz', q: 'Why scan the box after the piece?', options: ['To prove it went in the right box', 'To print a label', 'To mark it damaged'], answer: 0, why: 'The two scans together match the piece to the buyer.' },

    { kind: 'quiz', q: 'You scan Keisha\'s hoops, then scan Monique\'s box by mistake. What happens?', options: ['The hoops go in Monique\'s order', 'The app buzzes and shows you Keisha\'s box is the right one', 'Both orders get deleted'], answer: 1, why: 'The second scan is the safety check. A wrong box is caught before anything goes in it.' },
    { chapter: 'When things go sideways', kind: 'learn', title: 'No scanner? Use your camera for free', text: 'Your phone or iPad camera is a free scanner. On the Picking screen, the gold note says No scanner? Your camera is free. Tap Use camera, then tap Allow the first time your phone asks. Scan each tag, then the box label, just like with a scanner. Tap Got it to hide the note once you know.',
      screen: { title: 'Picking', rows: ['No scanner? Your camera is free.'], buttons: ['Use camera', 'Got it'], highlight: 'Use camera' } },
    { kind: 'learn', title: 'No scanner? Tap Picked it', text: 'Tap Picked it to pick without scanning. If only one customer needs it, it goes straight in her box. If several do, tap the right box under "No scanner? Tap the box".', tip: 'Skip for now moves to the next item and comes back later.' },
    { kind: 'quiz', q: 'Your scanner battery died. How do you keep picking?', options: ['Tap Picked it, then tap her box', 'Stop until it charges', 'Type every tag by hand'], answer: 0, why: 'Picked it works without any scanner.' },
    { kind: 'learn', title: 'Can\'t find it', text: 'Can\'t find a piece? Tap Can\'t find it. It\'s marked short so you know to follow up, and the rest of the order keeps moving.' },
    { kind: 'tap', title: 'Practice', prompt: 'The list says Keisha\'s hoops, but the bin is empty. Tap…', screen: { title: 'Picking', rows: ['#4821 Gold hoops → Keisha J.'], buttons: ['Picked it', 'Can\'t find it', 'Delete order'] }, answer: 'Can\'t find it', hint: 'Can\'t find it marks it short so you can follow up with her.' },
    { kind: 'scenario', title: 'After Can\'t find it', situation: 'You marked Keisha\'s hoops short. Her box has two other pieces ready.',
      options: [
        { text: 'Ship the two pieces and hope she doesn\'t notice', feedback: 'She will notice, and she paid for three. Tell her first.' },
        { text: 'Search the inbox spot and the live table. If it\'s truly gone, message Keisha: offer a similar piece or a refund for the hoops, then ship her box on time.', best: true, feedback: 'Her order still ships on time, and she hears it from you first. That\'s how you keep a buyer through a mistake.' },
        { text: 'Hold her whole box until the hoops turn up', feedback: 'Her other pieces would ship late for something that may never turn up. Ship what you have and make the rest right.' },
      ] },

    { chapter: 'Pack it pretty', queen: "A handwritten thank-you note costs pennies and gets remembered for months.", kind: 'learn', title: 'Pack like it\'s a gift', text: 'Once a box is complete, pack it the same way every time, so it\'s fast and always looks good.',
      points: ['Wrap in tissue in your brand color', 'Jewelry in its little bag, so it can\'t tangle', 'Handwritten "Thank you, [name]!" card with your next live day', 'Shake test: nothing should rattle or slide', 'Seal it and set it in the "ready to ship" spot'],
      tip: 'When every piece in an order is picked, the order moves to Packed and shows up in Shipping on its own.' },
    { kind: 'reflect', title: 'Your packing area', prompt: 'Where will you line up boxes, and what does your "pack it pretty" routine include?', placeholder: 'I\'ll line boxes up on…', example: 'On the folding table by the stairs, labels facing me. Every box gets emerald tissue, a handwritten card, and a sticker with "Tuesdays 7 PM ET".' },
    { kind: 'checklist', title: 'Pick-and-pack setup', prompt: 'Tick what\'s ready.', items: [
      'A spot to line up labeled boxes',
      'Box labels printed for today\'s orders',
      'Scanner charged, or I know to use Picked it',
      'Tissue, thank-you cards and stickers within reach',
      'A "ready to ship" spot by the door',
    ] },
  ],
}
export default lesson
