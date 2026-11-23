import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'labels', title: 'Print and reprint tags', track: 'Stock', icon: 'print', minutes: 3,
  why: 'A clean tag on every piece is what makes scanning, picking and counting fast.',
  route: { to: '/inventory', label: 'Open Stock' },
  covers: ['src/pages/Labels.tsx', 'src/pages/ItemDetail.tsx', 'src/pages/Inventory.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Three ways to print', text: 'Pick the one that fits.', points: ['One variation: open the item, tap Print tags', 'A few tags: tick them on the item page, tap Reprint', 'Many items: tick rows in Stock, tap Print tags for selected'] },
    { kind: 'learn', title: 'Line them up', text: 'In the print window set Scale to 100% (or Actual size), Margins to None, and turn off Headers and footers. Choose sheet labels or 4×6 thermal to match your paper.', tip: 'Using a half-used sheet? Enter how many labels to skip.' },
    { kind: 'tap', title: 'Practice', prompt: 'Two tags on one item got smudged. You ticked them. Now tap…', screen: { title: 'Gold hoop set', rows: ['☑ 4821-002', '☑ 4821-005', '☐ 4821-006'], buttons: ['Print tags', 'Reprint 2', 'Damage out'] }, answer: 'Reprint 2', hint: 'Reprint only prints the tags you ticked.' },
    { kind: 'quiz', q: 'Labels print shifted down the page. What do you check first?', options: ['Scale 100% and Margins None', 'Buy a new printer', 'Re-enter the item'], answer: 0, why: 'Browser scaling and margins are the usual culprit.' },
  ],
}
export default lesson
