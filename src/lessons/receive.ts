import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'receive', title: 'Receive an item', track: 'Stock', icon: 'receive', minutes: 4,
  why: 'Every piece gets a tag, a photo and a price the moment it arrives, so nothing gets lost in a box.',
  route: { to: '/intake', label: 'Receive an item' },
  covers: ['src/pages/Intake.tsx', 'src/pages/ItemDetail.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Items, variations and tags', text: 'An item is the product (a gold hoop set). A variation is a size or color, and gets a 4-digit Live Number buyers type in comments. Every single piece gets its own tag, like 4821-003.',
      points: ['Item: what it is', 'Variation: size or color, with its Live #', 'Tag: one per piece, so you know exactly which one sold'] },
    { kind: 'learn', title: 'Add it', text: 'Stock → Add item. Name it, pick a category and tags, snap photos, then add each variation with its price, what you paid, and how many.',
      screen: { title: 'Receive items', rows: ['Name', 'Category', 'Photos', 'Variations'], buttons: ['Save and print tags'], highlight: 'Save and print tags' } },
    { kind: 'learn', title: 'Why "what you paid" matters', text: 'Your cost turns sales into profit. Reports, Home and Get ready for live all use it to show your real money.', tip: 'Guess if you have to. A close number beats no number.' },
    { kind: 'learn', title: 'Photos help your whole team', text: 'Anyone who scans or looks up a piece sees its photo, so helpers grab the right one fast.' },
    { kind: 'order', title: 'Practice', prompt: 'Put the steps in order.', steps: ['Tap Add item', 'Name it and pick a category', 'Snap photos', 'Add variations with price, cost and count', 'Save and print tags'] },
    { kind: 'quiz', q: 'You have the same top in Small, Medium and Large. How many variations?', options: ['1', '3', 'One per piece'], answer: 1, why: 'Each size is a variation with its own Live Number. Each piece still gets its own tag.' },
    { kind: 'quiz', q: 'What does a buyer type in the comments to claim a piece?', options: ['The Live Number', 'The tag code', 'The bin code'], answer: 0, why: 'The 4-digit Live Number is for buyers. Tags are for you.' },
  ],
}
export default lesson
