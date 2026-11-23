import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'brand', kind: 'course', title: 'Build a brand they remember', track: 'Business', icon: 'sparkle', minutes: 20,
  why: 'People forget a price. They remember how you made them feel. Your brand is that feeling, on purpose.',
  outcomes: ['Write your brand promise in one sentence', 'Pick a name, colors and a voice that fit you', 'Show up the same way everywhere, every live'],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'What a brand really is', kind: 'learn', title: 'A brand is a promise', nova: 'Let\'s start with the heart of it. Your brand is not your logo, sis.',
      text: 'Your brand is what people expect every time they deal with you. The logo and colors only remind them of it.',
      points: ['Promise: what buyers can count on (fair prices, real quality, good vibes)', 'Personality: how you sound and show up', 'Proof: every order, box and live that keeps the promise'] },
    { kind: 'learn', title: 'Why it pays', text: 'A clear brand turns one-time buyers into regulars. Regulars buy more often, tell friends, and forgive the occasional slow week.',
      tip: 'Dynamic Dazzle\'s promise is right in the name: a bargain party in the basement. You know what you\'re walking into.' },
    { kind: 'quiz', q: 'Which of these is your brand?', options: ['Your logo', 'The feeling and promise people expect from you', 'Your price list'], answer: 1, why: 'The logo is a reminder. The promise is the brand.' },
    { chapter: 'Find your lane', kind: 'learn', title: 'Who are you selling to?', nova: 'You can\'t be everybody\'s favorite. Be somebody\'s obsession.',
      text: 'Picture one real buyer. How old is she? What does she do on a Tuesday night? What does she need to feel good walking into church, work, or brunch?',
      points: ['Her budget', 'Her style', 'Where she scrolls', 'What makes her trust a seller'] },
    { kind: 'reflect', title: 'Meet your dream buyer', prompt: 'Describe your dream buyer in two or three sentences.', placeholder: 'She is…', example: 'She\'s 45, works at the hospital, loves a statement earring, and shops my lives after her shift with a cup of tea.' },
    { kind: 'learn', title: 'What makes you different', text: 'Buyers have a hundred lives to choose from. Give them a reason to pick yours.',
      points: ['Your taste: you pick pieces they\'d never find', 'Your price: real bargains, always', 'Your energy: the party, the jokes, the shout-outs', 'Your care: fast shipping and real answers'] },
    { kind: 'reflect', title: 'Your brand promise', prompt: 'Finish this sentence: "When you shop with me, you can always count on…"', placeholder: 'When you shop with me…', example: 'When you shop with me, you can always count on quality pieces under $20 and a live that feels like a girls\' night.' },
    { chapter: 'Look and sound like you', kind: 'learn', title: 'Name, colors, voice', nova: 'Now the fun part. Let\'s dress your brand up.',
      text: 'Pick two or three colors and use them on your flyers, posters and boxes. Choose words that sound like you on live, and use them in your captions too.',
      points: ['Colors: two main, one accent', 'Fonts: one fancy, one easy to read', 'Voice: 3 words that describe how you talk (warm, funny, real)'],
      tip: 'The Live Planner\'s palettes and poster maker keep every flyer on-brand without a designer.' },
    { kind: 'order', title: 'Build it in order', prompt: 'Put the brand-building steps in order.', steps: ['Know your dream buyer', 'Write your promise', 'Choose your colors and voice', 'Use them everywhere, every time'] },
    { kind: 'learn', title: 'Consistency is the secret', text: 'Same intro, same sign-off, same colors, same days. When people know what to expect, they plan around you.',
      points: ['Go live on the same days and times', 'Open every live the same way', 'Use the same packaging touch (a thank-you card, tissue, a sticker)'] },
    { kind: 'quiz', q: 'You go live Tuesday one week, Saturday the next, then skip two weeks. What happens?', options: ['Buyers can\'t build a habit around you', 'Nothing, it doesn\'t matter', 'You get more viewers'], answer: 0, why: 'A steady schedule trains buyers to show up.' },
    { kind: 'quiz', q: 'What\'s the cheapest brand-builder you have?', options: ['A paid ad', 'A thank-you note in every box', 'A new logo'], answer: 1, why: 'Small, personal touches turn buyers into fans for pennies.' },
    { kind: 'reflect', title: 'Your three voice words', prompt: 'Write three words for how you want buyers to describe you.', placeholder: 'Warm, funny, honest', example: 'Generous, fun, trustworthy.' },
  ],
}
export default lesson
