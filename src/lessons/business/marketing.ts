import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'marketing', kind: 'course', title: 'Market your brand without burning out', track: 'Business', icon: 'trend',
  why: 'Great pieces don\'t sell if nobody knows about the live. Marketing is simply inviting people, on repeat.',
  outcomes: ['Plan a simple weekly promo rhythm', 'Write posts that get people to show up', 'Turn buyers into your best marketers'],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'The invite mindset', kind: 'learn', title: 'Marketing is an invitation', nova: 'Forget "being salesy." You\'re throwing a party and inviting your people.',
      text: 'Every post answers three questions: What is it? When is it? Why should I come?',
      points: ['What: the theme and a sneak peek', 'When: day, time and time zone', 'Why: the deal, the giveaway, the fun'] },
    { kind: 'quiz', q: 'Which post is most likely to fill your live?', options: ['"Going live later!"', '"Tuesday 7 PM ET: $2 jewelry + a free tote giveaway. Set your reminder!"', '"New stuff coming"'], answer: 1, why: 'It tells them what, when, and why to come.' },
    { chapter: 'Your weekly rhythm', kind: 'learn', title: 'The 4-touch week', nova: 'Here\'s a rhythm you can keep even on a busy week.',
      text: 'Four touches before every live keeps you top of mind without posting all day.',
      points: ['2 days before: the poster and the theme', '1 day before: a sneak peek video of 3 pieces', 'Morning of: a "tonight!" reminder with the time', '1 hour before: "we\'re setting up" behind-the-scenes'] },
    { kind: 'order', title: 'Put the week in order', prompt: 'Order the four touches from first to last.', steps: ['Poster and theme', 'Sneak peek video', '"Tonight!" reminder', 'Behind-the-scenes, 1 hour before'] },
    { kind: 'learn', title: 'Hooks that stop the scroll', text: 'The first second decides if people keep watching. Lead with the most exciting thing.',
      points: ['"This bag is $5. Yes, five."', '"3 pieces I\'d never let go of… but tonight I am."', '"POV: you found the basement with all the bargains."'] },
    { kind: 'reflect', title: 'Write your hook', prompt: 'Write a one-line hook for your next live.', placeholder: 'Tonight…', example: 'Tonight only: every gold piece is $2 until the timer runs out.' },
    { chapter: 'Let buyers sell for you', kind: 'learn', title: 'Word of mouth is free', nova: 'Your happiest buyer is your best ad. Give her something to talk about.',
      text: 'Ask happy buyers to post their haul and tag you. Shout them out on your next live. Reward referrals with a small freebie.',
      points: ['"Post your haul and tag me for a shout-out"', 'Share buyers\' photos (with permission)', 'Bring-a-friend nights: both get a bonus'] },
    { kind: 'learn', title: 'Track what works', text: 'After each live, write down how many came, what you posted, and what sold. Reports shows sales by live, so you can see which themes and promos win.' },
    { kind: 'quiz', q: 'Your Bag Bonanza live sold twice as much as usual. What do you do?', options: ['Repeat it and note what you posted', 'Never do it again', 'Change everything next week'], answer: 0, why: 'Do more of what works, and remember why it worked.' },
    { kind: 'quiz', q: 'Best time for a "we\'re setting up" post?', options: ['A week before', 'About an hour before', 'After the live'], answer: 1, why: 'It\'s the last nudge while people can still make plans.' },
  ],
}
export default lesson
