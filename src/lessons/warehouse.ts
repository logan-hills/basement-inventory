import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'warehouse', title: 'Set up your shelves and bins', track: 'Stock', icon: 'warehouse',
  why: 'When every piece has a bin, anyone on your team can find it in seconds.',
  route: { to: '/locations', label: 'Open Warehouse' },
  covers: ['src/pages/Warehouse.tsx', 'src/pages/BinDetail.tsx', 'src/pages/BinLabels.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Aisle, section, level, bin', text: 'Bins are named by where they sit: Aisle, Section, Level (A is the bottom) and Bin. The map shows each one and how full it is.' },
    { kind: 'learn', title: 'Build it once, change it anytime', text: 'Warehouse → Set up your warehouse makes all your bins at once. Use Edit layout to add bins or remove empty ones later.',
      screen: { title: 'Warehouse', buttons: ['Edit layout', 'Print bin labels'], highlight: 'Edit layout' } },
    { kind: 'learn', title: 'Bin labels', text: 'Print bin labels gives a big 4×6 landscape label with the bin code and a barcode. Stick one on each shelf spot.' },
    { kind: 'quiz', q: 'Level A is…', options: ['The bottom shelf', 'The top shelf', 'The first aisle'], answer: 0, why: 'Levels count up from the floor, so A is the bottom.' },
    { kind: 'quiz', q: 'Can you remove a bin that still has items in it?', options: ['No, empty it first', 'Yes, items are deleted too'], answer: 0, why: 'Only empty bins can be removed, so nothing goes missing.' },
  ],
}
export default lesson
