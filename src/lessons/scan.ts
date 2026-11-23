import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'scan', title: 'Scan to put away and look up', track: 'Stock', icon: 'scan', minutes: 3,
  why: 'Scanning records where every piece lives without typing a thing.',
  route: { to: '/scan', label: 'Open Scan' },
  covers: ['src/pages/Scan.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Scan the bin, then the pieces', text: 'Scan a bin label and a gold banner shows the bin you are filling. Every tag you scan next is put in that bin. Tap Done when you move on.',
      screen: { title: 'Scan', rows: ['Filling bin A1-02-B-3', '✓ 4821-003', '✓ 4821-004'], buttons: ['Done'], highlight: 'Done' } },
    { kind: 'learn', title: 'Scan anything to look it up', text: 'Scan a tag to see the item, a bin to see its contents, or an order ID (DD-…) to open the order.' },
    { kind: 'learn', title: 'Which scanner?', text: 'Any USB or Bluetooth scanner works. Android scanner phones work in the browser. On an iPhone, tap Use camera.', tip: 'Keep the scan box focused and never touch the mouse: bin, scan, scan, scan.' },
    { kind: 'order', title: 'Practice', prompt: 'Put away three pieces. Tap the steps in order.', steps: ['Open Scan', 'Scan the bin label', 'Scan each tag', 'Tap Done'] },
    { kind: 'quiz', q: 'You scan a tag with no bin scanned first. What happens?', options: ['It opens the item so you can look it up', 'It deletes the tag', 'Nothing'], answer: 0, why: 'With no bin active, a scan is a lookup.' },
  ],
}
export default lesson
