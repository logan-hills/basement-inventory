import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'bot', title: 'Let the comment bot take the orders', track: 'Sell', icon: 'live',
  why: 'While you show the pieces, the bot writes down who claimed what, so nobody gets missed and nobody gets double sold.',
  route: { to: '/calendar', label: 'Open a live, then Comment bot' },
  covers: ['src/pages/LiveBot.tsx', 'src/lib/livebot.ts', 'src/lib/fbcomments.ts'], updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Where it lives', text: 'Open a live on your calendar and tap Comment bot. If you booked a slot on the shared Page, the On Air screen takes you straight there.',
      screen: { title: '$2 Tuesday', buttons: ['Edit', 'Planner & poster', 'Comment bot', 'Download bot CSV'], highlight: 'Comment bot' } },
    { kind: 'learn', title: 'How buyers claim', text: 'Tell viewers to comment the Live # they want. The bot understands all of these:',
      points: ['sold 4821', '4821', 'DD 4821 (your shop code, set under Claim words)', 'Wanted 4821 or Claim 4821 (the same words Loyal Shops uses)', 'Sold 4821 Blue M (extra words like a color or size are fine)', 'Sold #4821 x2 or Sold 4821 Q2 (two of them)', 'mine 4821 please', 'cancel 4821 (changed their mind)'],
      tip: 'Saying “sold 4821” twice does not buy two. They need to write x2 or Q2.' },
    { kind: 'learn', title: 'First come, first served', text: 'Each Live # sells as many as you planned for the live. When it sells out, the next people wait in line. If a buyer cancels, or you tap × to take it back, the next person in line moves up on their own.',
      screen: { title: 'Who got what', rows: ['#4821 Quilted Crossbody Bag · 1 of 1', 'Tasha Greene', 'Waiting in line: 1. Brenda Lewis'], buttons: ['×'] } },
    { kind: 'tap', title: 'Practice', prompt: 'You want to see how the bot works before your next live. What do you tap?',
      screen: { title: 'Start the bot', buttons: ['Start listening', 'Try a practice live', 'Claim words'] }, answer: 'Try a practice live', hint: 'Pretend buyers comment on your items, and nothing is real.' },
    { kind: 'learn', title: 'Done selling', text: 'Tap Make orders. Every buyer gets one order with all their pieces, ready in Pick and pack. Add each buyer’s address in Customers before you ship.',
      screen: { title: 'Done selling?', buttons: ['Download sales sheet', 'Make orders'], highlight: 'Make orders' },
      tip: 'Someone bought by message or in person? Use Add a claim by hand. It joins their order.' },
    { kind: 'order', title: 'Practice', prompt: 'Put a live night in order.', steps: ['Go live on the Page', 'Open Comment bot and tap Start listening', 'Viewers comment Live #s', 'Tap Make orders', 'Pick and pack the boxes'] },
    { kind: 'quiz', q: 'Two people comment “sold 4821” but you only have one. What happens?', options: ['The first one gets it, the second waits in line', 'Both get it', 'The bot ignores both'], answer: 0, why: 'First come, first served. The second buyer moves up if the first one drops out.' },
    { kind: 'learn', title: 'Watch the comments', text: 'The Comments column shows every comment as it comes in, so you can greet people by name while you sell. Claims glow gold. Tap Claims to see only the sales.' },
    { kind: 'quiz', q: 'A viewer types “DD 4821”. What happens?', options: ['They claim Live # 4821', 'Nothing, the bot ignores it'], answer: 0, why: 'DD is your shop code. Change it under Claim words.' },
    { kind: 'quiz', q: 'A viewer types “Sold 4821 Q2”. What do they get?', options: ['Two of Live # 4821', 'One of Live # 4821', 'Nothing'], answer: 0, why: 'Q2 means a quantity of two, the same way Loyal Shops reads it. x2 works too.' },
    { kind: 'quiz', q: 'Which word makes a buyer drop their claim?', options: ['cancel', 'sold', 'mine'], answer: 0, why: 'You can change these words under Claim words.' },
  ],
}
export default lesson
