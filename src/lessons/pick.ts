import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'pick', title: 'Pick and pack, grocery style', track: 'Pack and ship', icon: 'pack', minutes: 4,
  why: 'Scanning each piece into the right box means no wrong items and no angry buyers.',
  route: { to: '/orders', label: 'Open Pick and pack' },
  covers: ['src/pages/Pick.tsx', 'src/pages/Orders.tsx', 'src/pages/BoxLabels.tsx', 'src/pages/OrderDetail.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Label the boxes first', text: 'Print box labels for the orders you\'re packing and stick one on each box. Each label has the customer\'s name and order barcode.' },
    { kind: 'learn', title: 'Big and clear on your phone', text: 'Tap Pick. The next item fills the screen: its photo, the big Live #, and exactly where it lives in four big boxes: Aisle, Section, Shelf and Bin. If the product has a UPC, its barcode shows too.',
      points: ['Walk the list in order: it\'s sorted by bin', 'Clip a scanner onto your iPhone and scan the tag or the product barcode', 'Then scan the customer\'s box'],
      screen: { title: 'Picking', rows: ['#4821 Gold hoop set', 'Aisle 1 · Section 2 · Shelf B · Bin 3', 'For Keisha J.'], buttons: ['Picked it', 'Can\'t find it', 'Skip for now'], highlight: 'Picked it' } },
    { kind: 'learn', title: 'No scanner? Tap Picked it', text: 'Tap Picked it to pick without scanning. If only one customer needs it, it goes straight in her box. If several do, tap the right box.', tip: 'Skip for now moves to the next item and comes back later.' },
    { kind: 'learn', title: 'Wrong box? It tells you', text: 'Scan the wrong box and the app buzzes and shows the right one. Can\'t find a piece? Tap Can\'t find it so you know to follow up.' },
    { kind: 'order', title: 'Practice', prompt: 'Put the steps in order.', steps: ['Print box labels', 'Stick a label on each box', 'Tap Pick', 'Scan the piece', 'Scan its box'] },
    { kind: 'tap', title: 'Practice', prompt: 'The list says Keisha\'s hoops, but the bin is empty. Tap…', screen: { title: 'Picking', rows: ['#4821 Gold hoops → Keisha J.'], buttons: ['Picked it', 'Can\'t find it', 'Delete order'] }, answer: 'Can\'t find it', hint: 'Can\'t find it marks it missing so you can follow up with her.' },
    { kind: 'quiz', q: 'Your scanner battery died. How do you keep picking?', options: ['Tap Picked it, then tap her box', 'Stop until it charges', 'Type every tag by hand'], answer: 0, why: 'Picked it works without any scanner.' },
    { kind: 'quiz', q: 'Why scan the box after the piece?', options: ['To prove it went in the right box', 'To print a label', 'To mark it damaged'], answer: 0, why: 'The two scans together match the piece to the buyer.' },
  ],
}
export default lesson
