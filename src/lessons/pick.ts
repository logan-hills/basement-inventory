import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'pick', title: 'Pick and pack, grocery style', track: 'Pack and ship', icon: 'pack', minutes: 4,
  why: 'Scanning each piece into the right box means no wrong items and no angry buyers.',
  route: { to: '/orders', label: 'Open Pick and pack' },
  covers: ['src/pages/Pick.tsx', 'src/pages/Orders.tsx', 'src/pages/BoxLabels.tsx', 'src/pages/OrderDetail.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Label the boxes first', text: 'Print box labels for the orders you\'re packing and stick one on each box. Each label has the customer\'s name and order barcode.' },
    { kind: 'learn', title: 'Walk the list', text: 'Tap Pick. The list is sorted by bin so you walk each aisle once. Scan the piece, then scan the box it goes in.',
      screen: { title: 'Picking', rows: ['A1-02-B · 4821 Gold hoops → Keisha J.', 'A1-03-A · 3310 Tote → Monique R.'], buttons: ['Short'], highlight: 'Short' } },
    { kind: 'learn', title: 'Wrong box? It tells you', text: 'Scan the wrong box and the app buzzes and shows the right one. Can\'t find a piece? Tap Short so you know to follow up.' },
    { kind: 'order', title: 'Practice', prompt: 'Put the steps in order.', steps: ['Print box labels', 'Stick a label on each box', 'Tap Pick', 'Scan the piece', 'Scan its box'] },
    { kind: 'tap', title: 'Practice', prompt: 'The list says Keisha\'s hoops, but the bin is empty. Tap…', screen: { title: 'Picking', rows: ['4821 Gold hoops → Keisha J.'], buttons: ['Short', 'Skip forever', 'Delete order'] }, answer: 'Short', hint: 'Short marks it missing so you can follow up with her.' },
    { kind: 'quiz', q: 'Why scan the box after the piece?', options: ['To prove it went in the right box', 'To print a label', 'To mark it damaged'], answer: 0, why: 'The two scans together match the piece to the buyer.' },
  ],
}
export default lesson
