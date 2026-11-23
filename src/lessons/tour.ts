import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'tour', title: 'Welcome: how your shop flows', track: 'Start here', icon: 'sparkle', minutes: 3,
  why: 'Knowing the path from box to buyer means you always know what to do next.',
  route: { to: '/', label: 'Go to Home' },
  covers: ['src/App.tsx', 'src/pages/Home.tsx'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'One app, one flow', text: 'Every piece you sell travels the same road. This app has a stop for each part of the trip.',
      points: ['Receive it and give it a tag', 'Give it a home on a shelf', 'Plan it into a live', 'Sell it on live', 'Pick it into the customer\'s box', 'Ship it, then see your money in Reports'] },
    { kind: 'learn', title: 'Your dock', text: 'On a laptop, the icons down the left side take you everywhere you go every day. On a phone they sit along the bottom. Everything else is under More (or Menu).',
      screen: { title: 'Dock', buttons: ['Home', 'Stock', 'Scan', 'Planner', 'Sell', 'Pack', 'Ship', 'Money', 'More'], highlight: 'More' } },
    { kind: 'learn', title: 'Home is your coach', text: 'Home counts down to your next live, shows your monthly goal, the money sitting on your shelves, and the checklist for your next show. Tick steps right there.',
      tip: 'Your monthly goal lives in Settings. Set one that stretches you a little.' },
    { kind: 'learn', title: 'Meet Nova', text: 'Nova the handbag is your guide. She shares a tip on Home every day (tap her for another one) and teaches every lesson and course in Dazzle Academy.' },
    { kind: 'order', title: 'Practice: the flow', prompt: 'Tap the stops in the order a piece travels.', steps: ['Receive it', 'Put it on a shelf', 'Plan it into a live', 'Sell it on live', 'Pick it into a box', 'Ship it'] },
    { kind: 'tap', title: 'Practice: find your way', prompt: 'You want to plan this week\'s theme and poster. Which dock button?', screen: { title: 'Dock', buttons: ['Stock', 'Scan', 'Planner', 'Pack', 'Money'] }, answer: 'Planner', hint: 'Themes, posters and checklists all live in the Planner.' },
    { kind: 'quiz', q: 'Where do you see how much money is sitting on your shelves right now?', options: ['Home', 'Scan', 'Shipping'], answer: 0, why: 'Home shows profit sitting on the shelf, plus your goal and next live.' },
  ],
}
export default lesson
