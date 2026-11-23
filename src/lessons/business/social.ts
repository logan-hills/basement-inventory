import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'social', kind: 'course', title: 'Social media that sells', track: 'Business', icon: 'live',
  why: 'Social media is your storefront window. Done right, it fills your lives while you sleep.',
  outcomes: ['Pick the one or two platforms worth your time', 'Plan a week of posts in 20 minutes', 'Film Reels that sell with just a phone'],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Pick your platforms', kind: 'learn', title: 'Go where your buyers are', nova: 'You don\'t need to be everywhere. You need to be where SHE is.',
      text: 'Pick one home base and one helper platform. Do those well before adding more.',
      points: ['Home base: where you go live and sell (usually Facebook)', 'Helper: where new people discover you (Reels, TikTok)', 'Everything else: only when the first two are steady'] },
    { kind: 'quiz', q: 'You\'re just starting. How many platforms should you post on daily?', options: ['All of them', 'One or two, done well', 'None until you\'re famous'], answer: 1, why: 'Consistency on two beats burnout on six.' },
    { chapter: 'Content that converts', kind: 'learn', title: 'The 3 kinds of posts', text: 'Mix these through the week so your page isn\'t all "buy, buy, buy."',
      points: ['Show: try-ons, unboxings, styling ("3 ways to wear this scarf")', 'Tell: your story, behind the scenes, why you started', 'Sell: the poster, the countdown, the "last chance"'] },
    { kind: 'learn', title: 'Film a Reel that sells', nova: 'Grab your phone. Natural light. Let\'s go.',
      text: 'Short, vertical, and starts with the best moment. You don\'t need fancy gear.',
      points: ['Face a window for light', 'Hook in the first second', 'Show the piece up close, then on you', 'End with when the live is', 'Add captions: most people watch on mute'] },
    { kind: 'order', title: 'Reel recipe', prompt: 'Put the Reel in order.', steps: ['Hook: "This $5 bag…"', 'Close-up of the piece', 'Show it styled on you', 'Live day and time'] },
    { kind: 'learn', title: 'Stay out of trouble', text: 'Keep your account and your lives safe.',
      points: ['No designer names or the word "inspired" on dupes', 'No copyrighted music in lives (it gets flagged)', 'Use each app\'s built-in sounds for Reels'] },
    { kind: 'quiz', q: 'Why add captions to your videos?', options: ['Most people scroll with the sound off', 'It\'s required by law', 'It makes the video longer'], answer: 0, why: 'Captions keep silent scrollers watching.' },
    { chapter: 'Plan the week', kind: 'learn', title: 'The 20-minute Sunday plan', text: 'Sit down once a week and plan it out. Batch-film three or four clips at once.',
      points: ['Mon: a try-on Reel', 'Tue: live day poster + "tonight!"', 'Wed: haul shout-outs from buyers', 'Thu: behind the scenes', 'Fri: sneak peek for the next live'] },
    { kind: 'reflect', title: 'Your posting days', prompt: 'Which days will you post, and what will you post on each?', placeholder: 'Mon: …', example: 'Mon try-on, Tue poster, Thu behind the scenes, Sat sneak peek.' },
    { kind: 'learn', title: 'Talk back', text: 'Answer comments in the first hour. Every reply tells the app people care, and tells buyers you\'re real.' },
    { kind: 'quiz', q: 'Someone comments "price?" on your Reel. Best move?', options: ['Ignore it', 'Reply with the price and the live time', 'Delete the comment'], answer: 1, why: 'Fast answers turn curious scrollers into buyers.' },
  ],
}
export default lesson
