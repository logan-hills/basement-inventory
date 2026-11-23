import type { Lesson } from '../types'
import { PAY_TRENDS as T } from './trends'

const lesson: Lesson = {
  id: 'creatorpay', kind: 'course', title: 'Who pays creators right now', track: 'Business', icon: 'dollar',
  why: 'Your videos can sell your lives AND pay you for views. Put your energy where the money is.',
  outcomes: [
    `Know today's top pick (${T.topPick}) and why`,
    'Understand the three ways creators get paid',
    'Make every video do three jobs at once',
    'Turn one live into a week of videos',
    'Keep creator money in its place: a bonus, tracked for taxes',
  ],
  covers: ['src/lessons/business/trends.ts'], updated: '2026-11-23',
  slides: [
    { chapter: 'How creators get paid', kind: 'learn', title: 'Three kinds of creator money', nova: "Let's get clear on where the money actually comes from.",
      text: "When people say \"I get paid for my videos,\" they mean one of three things. Knowing which is which keeps you from chasing the wrong one.",
      table: { head: ['Kind', 'How it works', 'Steady?'], rows: [
        ['Views pay', 'The platform shares money based on how much your videos are watched', 'Comes and goes. Rules change often.'],
        ['Commission', 'You earn a cut when people buy through your link or shop', 'Steady if you sell good products'],
        ['Your own sales', 'Videos send people to your live, where they buy from you', 'The steadiest. You own it.'],
      ] } },
    { kind: 'quiz', q: "What's the steadiest money for a live seller?", options: ['Views payouts', 'Your own sales and repeat buyers', 'Going viral once'], answer: 1, why: 'Programs change. Your buyers stay.' },

    { chapter: `The picture in ${T.asOf}`, kind: 'learn', title: `Nova's pick: ${T.topPick}`, nova: `Here's the tea as of ${T.asOf}.`,
      text: T.topPickWhy, tip: T.checkIt },
    ...T.platforms.map(p => ({ kind: 'learn' as const, title: p.name, text: p.how, tip: p.fit })),
    { kind: 'quiz', q: `As of ${T.asOf}, which platform does Nova say pays our sellers the most for Reels?`, options: [T.topPick, ...T.platforms.filter(p => p.name !== T.topPick).slice(0, 2).map(p => p.name)], answer: 0, why: T.topPickWhy },
    { kind: 'learn', title: 'Getting switched on', text: "Most views-pay programs follow the same pattern, even when the details change. Get the basics in place now so you're ready when you're eligible or invited.",
      points: [
        'Use a professional or creator account (on Facebook, turn on Professional mode for your profile, or post from your Page)',
        'Post your own, original videos. Re-uploads of other people\'s clips don\'t qualify and can get you penalized.',
        'Post steadily. Programs look at your recent activity and followers.',
        'Follow the community and monetization rules: no copyrighted music, no misleading claims',
        'Check the app\'s monetization or creator page for the current requirements and whether you\'ve been invited',
      ] },

    { chapter: 'One video, three jobs', kind: 'learn', title: 'Make every video earn three ways', text: "A smart seller never films \"just for views.\" Every video should do three jobs at the same time.",
      points: ['Earn views (and views pay, where you qualify)', 'Show off a piece so people want it', 'Invite people to your next live, with the day and time'],
      example: "A 20-second Reel of the emerald bag styled three ways gets 4,000 views. The views pay a little. Thirty people comment \"price?\". Eight of them come to Thursday's live and buy. The views paid for your coffee. The live paid your light bill." },
    { kind: 'number', title: 'What did the Reel really earn?', q: 'A Reel brings 8 new buyers to your live. Each spends $22 on average. How much in sales did the Reel bring?', prefix: '$', answer: 176, hint: 'Multiply the number of buyers by what each spent.', why: 'That\'s 8 × $22. And if even half of them come back next week, that one Reel keeps paying. That\'s why the invite at the end matters more than the views.' },
    { kind: 'scenario', title: 'Where does the Reel go?', situation: 'You filmed a great try-on Reel. You want to post it on Facebook and TikTok.',
      options: [
        { text: 'Post it on TikTok, download it, and upload the same file (with the TikTok watermark) to Facebook', feedback: 'Watermarks from another app usually get your video shown to fewer people, and it can hurt eligibility for views pay.' },
        { text: 'Save the clean video from your phone\'s camera roll and post that file to each app, with that app\'s own caption', best: true, feedback: 'Clean file, native post, fresh caption. Each app treats it like an original.' },
        { text: 'Only post it on one app so it stays special', feedback: 'You did the work once. Let it reach twice the people.' },
      ] },

    { chapter: 'Your content engine', kind: 'learn', title: 'One live, a week of videos', text: "You're already on camera for an hour every live. Turn that hour into a week of short videos. Plan it before you go live so you capture the good stuff.",
      points: [
        'Before: film a 15-second "setting up the table" clip',
        'During: have a helper film the piece you\'re holding from a second phone, or screen-record the best minute',
        'After: film a 20-second "packing your orders" clip',
        'Next day: a "the piece everybody fought over" Reel with the price and next live',
      ],
      tip: 'If you clip your live, cut out any part with background music or TV playing.' },
    { kind: 'scenario', title: 'The best clip has a song in it', situation: "Your best moment from Tuesday's live is a buyer screaming in the comments over a bag. But the radio was playing a popular song in the background.",
      options: [
        { text: 'Post it anyway. It\'s only a few seconds of music.', feedback: 'Even a few seconds of a copyrighted song can get the video muted, blocked, or kept out of views pay.' },
        { text: 'Re-film the moment: hold up the bag, read the comment out loud with the same excitement, and post that', best: true, feedback: 'You keep the story and lose the risk. And next live, turn the radio off.' },
        { text: 'Turn the video volume all the way down and post it', feedback: 'The app can still detect the song, and a silent clip of you talking loses the magic.' },
      ] },
    { kind: 'learn', title: 'A realistic weekly rhythm', text: "Three to five short videos a week is plenty if you keep it up. Here's a rhythm that takes about two hours a week, total.",
      table: { head: ['Day', 'Video', 'Time'], rows: [
        ['Sunday', 'Batch-film 3 clips in one outfit', '45 min'],
        ['Monday', 'Post clip 1 (style it 3 ways)', '10 min'],
        ['Live day', 'Post the setup clip, film live highlights', '15 min'],
        ['After live', 'Post the "everybody fought over" Reel', '20 min'],
        ['Weekend', 'Post clip 3 + reply to comments', '30 min'],
      ] } },
    { kind: 'order', title: 'Build the invite into the video', prompt: 'Put the parts of a double-duty Reel in order.', steps: ['Hook in the first second', 'Show the piece up close', 'Show it on you', 'Live day, time and price on screen'] },

    { chapter: 'Keep the money right', kind: 'learn', title: 'Treat it like business income', text: "Creator payouts are income, just like your sales. Keep it clean from day one so tax time isn't scary.",
      points: ['Have payouts sent to your business bank account if you have one', 'Write down each payout and the date in one place', 'Platforms may send you a tax form when you earn enough', 'Ask a tax professional how to report it in your state'],
      tip: 'This is general information, not tax advice. A local tax pro can answer for your situation.' },
    { kind: 'quiz', q: 'Views pay dropped by half this month because the program changed. What should you do?', options: ['Quit making videos', 'Keep posting, because the videos still bring buyers to your lives', 'Post ten times a day to make it up'], answer: 1, why: 'Views pay was always the bonus. The buyers your videos bring are the real paycheck.' },
    { kind: 'checklist', title: 'Get your account ready', prompt: 'Tick what you\'ve done. The rest is your list for this week.', items: [
      'My profile is in Professional mode, or I post from my Page',
      'My bio says what I sell and when I go live',
      'I save clean copies of my videos (no other app\'s watermark)',
      'I\'ve checked the app\'s monetization page for today\'s requirements',
      'I write down every payout and its date',
    ] },
    { kind: 'reflect', title: 'Your video plan', prompt: 'Which platform will you post on this week, how many videos, and which of your lives will you clip?', placeholder: 'I\'ll post…', example: 'Three Facebook Reels this week, each ending with "Tuesday 7 PM ET", plus a clip of the bag everybody fought over on Tuesday.' },
  ],
}
export default lesson
