import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'bulk', title: 'Bulk upload a delivery', track: 'Stock', icon: 'upload', minutes: 3,
  why: 'A big haul goes in all at once from a spreadsheet instead of one item at a time.',
  route: { to: '/receive/bulk', label: 'Bulk upload' },
  covers: ['src/pages/BulkReceive.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Spreadsheet in, tags out', text: 'Fill in one row per variation in Excel or Google Sheets, save it as CSV, and upload it. Every item, variation and tag is made for you.',
      screen: { title: 'Inventory', buttons: ['+ Add item', 'Bulk upload CSV'], highlight: 'Bulk upload CSV' } },
    { kind: 'learn', title: 'Use the template', text: 'Tap Download CSV template so your columns match. Fill in Name, Category, Tags, Price, Cost and Quantity, plus the UPC if the product has one.', tip: 'Separate several tags with a comma, like "Holiday, New arrival".' },
    { kind: 'learn', title: 'Check before importing', text: 'The app shows a preview of everything it will make. Fix anything that looks off, then import and print every tag in one go.' },
    { kind: 'order', title: 'Practice', prompt: 'Put the steps in order.', steps: ['Download the template', 'Fill it in and save as CSV', 'Upload it', 'Check the preview', 'Import and print tags'] },
    { kind: 'quiz', q: 'Where is the Bulk upload CSV button?', options: ['On the Inventory (Stock) page, next to Add item', 'In Shipping', 'In Reports'], answer: 0, why: 'It sits right by Add item on the Stock page.' },
  ],
}
export default lesson
