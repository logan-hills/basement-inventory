import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'damaged', title: 'Damage out broken pieces', track: 'Stock', icon: 'damaged',
  why: 'Taking broken pieces out of stock keeps you from selling something you can\'t ship.',
  route: { to: '/damaged', label: 'Open Damaged' },
  covers: ['src/pages/Damaged.tsx', 'src/components/DamageSheet.tsx', 'src/pages/ItemDetail.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'One, several, or a number', text: 'On an item page, swipe a tag left or tap Damage out. To do several at once, tick tags (or Select all) and Damage out, or choose how many.',
      screen: { title: 'Gold hoop set', rows: ['☑ 4821-002', '☑ 4821-005'], buttons: ['Damage out 2'], highlight: 'Damage out 2' } },
    { kind: 'learn', title: 'Pick a reason', text: 'Choose a reason and add a note. The Damaged page lists every piece with its reason, so you can spot what keeps breaking.' },
    { kind: 'learn', title: 'Mistakes are fixable', text: 'Tap Undo on the pop-up, or Put back from the Damaged page.' },
    { kind: 'quiz', q: 'You marked the wrong tag damaged yesterday. What now?', options: ['Put it back from the Damaged page', 'Receive it again as a new item'], answer: 0, why: 'Put back returns it to stock with its old tag.' },
  ],
}
export default lesson
