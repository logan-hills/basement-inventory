import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'planner', title: 'Plan a live that pops', track: 'Sell', icon: 'sparkle',
  why: 'A theme, a poster and a plan bring more people to your live, and more people means more sales.',
  route: { to: '/planner', label: 'Open the Live Planner' },
  covers: ['src/pages/Planner.tsx', 'src/pages/LivePlan.tsx', 'src/components/PosterMaker.tsx', 'src/lib/planner.ts'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Start from an idea', text: 'The Idea bank has themes like Holiday Glam, Bag Bonanza and Self-Care Sunday. Tap Plan this live and the live is made with the theme, colors and hooks filled in.',
      screen: { title: 'Idea bank', rows: ['$2 Tuesday', 'Holiday Glam', 'Bag Bonanza'], buttons: ['Plan this live →'], highlight: 'Plan this live →' } },
    { kind: 'learn', title: 'Can\'t decide? Spin!', text: 'Tap Spin for a theme and Nova picks one for you. Like it? Tap Plan this live. Not feeling it? Spin again.',
      screen: { title: 'Live Planner', rows: ['Tonight\'s theme: Mystery Bag Madness'], buttons: ['Spin again', 'Plan this live →'], highlight: 'Spin again' } },
    { kind: 'learn', title: 'Every live has a plan', text: 'Open a live\'s plan to work through four tabs.', points: ['Plan: vibe, colors, outfit, music, giveaway, run of show', 'Inspiration: photos, links and notes', 'Poster: make a post to share', 'Checklist: before, during and after'] },
    { kind: 'learn', title: 'Make the poster', text: 'Pick a style and a size (post, square or story), type your headline, add a photo from your Inspiration board, and tap Download. Post it a day ahead and again an hour before.', tip: 'Story size is made for Facebook and Instagram stories.' },
    { kind: 'learn', title: 'Checklists keep you calm', text: 'Tick each step as you go. Your progress ring fills up, and Home shows what\'s next. Change the default steps in Settings.' },
    { kind: 'tap', title: 'Practice', prompt: 'You want a picture to share in your Facebook story. Which tab?', screen: { title: 'Holiday Glam plan', buttons: ['Plan', 'Inspiration', 'Poster', 'Checklist'] }, answer: 'Poster', hint: 'The Poster tab makes and downloads the picture.' },
    { kind: 'quiz', q: 'Where do you change the checklist steps every new live starts with?', options: ['Settings → Live checklists', 'Each poster', 'Reports'], answer: 0, why: 'Settings holds the defaults. You can still add extra steps to one live.' },
    { kind: 'quiz', q: 'Why use a theme?', options: ['It gives buyers a reason to show up', 'The app requires it', 'It changes your prices'], answer: 0, why: 'A theme turns "another live" into an event people plan for.' },
  ],
}
export default lesson
