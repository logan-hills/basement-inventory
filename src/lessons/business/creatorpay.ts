import type { Lesson } from '../types'
import { PAY_TRENDS as T } from './trends'

const lesson: Lesson = {
  id: 'creatorpay', kind: 'course', title: 'Who pays creators right now', track: 'Business', icon: 'dollar',
  why: 'Your videos can sell your lives AND pay you for views. Put your energy where the money is.',
  outcomes: [`Know today's top pick (${T.topPick})`, 'Understand how each platform pays', 'Make every video do double duty'],
  covers: ['src/lessons/business/trends.ts'], updated: '2026-11-23',
  slides: [
    { chapter: `The picture in ${T.asOf}`, kind: 'learn', title: `Nova's pick: ${T.topPick}`, nova: `Here's the tea as of ${T.asOf}.`,
      text: T.topPickWhy, tip: T.checkIt },
    ...T.platforms.map(p => ({ kind: 'learn' as const, title: p.name, text: p.how, tip: p.fit })),
    { kind: 'quiz', q: `As of ${T.asOf}, which platform does Nova say pays sellers the most for Reels?`, options: [T.topPick, ...T.platforms.filter(p => p.name !== T.topPick).slice(0, 2).map(p => p.name)], answer: 0, why: T.topPickWhy },
    { chapter: 'Double-duty videos', kind: 'learn', title: 'One video, three jobs', text: 'Every Reel should 1) earn views, 2) show off a piece, and 3) invite people to your next live.',
      points: ['Film once, post to your home base first', 'Repost to your helper platform without another app\'s watermark', 'Always end with your live day and time'] },
    { kind: 'learn', title: 'Money changes fast', text: 'Creator programs change their rules, minimums and rates often. The steady money is your own sales. Treat creator pay as a bonus, not the plan.' },
    { kind: 'quiz', q: 'What\'s the steadiest money for a live seller?', options: ['Creator payouts', 'Your own sales and repeat buyers', 'Going viral once'], answer: 1, why: 'Programs change. Your buyers stay.' },
    { kind: 'reflect', title: 'Your plan', prompt: 'Which platform will you post Reels on this week, and how many?', placeholder: 'I\'ll post…', example: 'Three Facebook Reels this week, each ending with "Tuesday 7 PM ET".' },
  ],
}
export default lesson
