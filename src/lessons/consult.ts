import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'consult', title: 'Get the most from time with the Queen', track: 'Grow', icon: 'sparkle',
  why: 'A 1:1 consult is an investment. Walk in prepared and you\'ll walk out with a plan, tools and answers you can use the same week.',
  outcomes: [
    'Know what a consult with the Queen covers and how pricing works',
    'Work out the cost of any session length, and why the full hour is the best value',
    'Prepare a one-page snapshot of your business and your numbers',
    'Turn a vague worry into sharp questions that get useful answers',
    'Know the 50% deposit that books your time: $25 for a full first hour',
    'Send a request from Time with the Queen and follow up after',
  ],
  route: { to: '/consult', label: 'Open Time with the Queen' },
  sources: [
    { org: 'SCORE', title: 'How to craft a strategic plan for your small business', url: 'https://www.score.org/resource/blog-post/how-craft-a-strategic-plan-your-small-business' },
    { org: 'U.S. Small Business Administration', title: 'Write your business plan', url: 'https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan' },
  ],
  queen: {
    welcome: "When you book time with me, I want you to walk away with a real plan. This lesson shows you how to come prepared so we can use every minute on what matters most to your business.",
    signoff: "Bring your snapshot, bring your three sharpest questions, and bring your open mind. I'll bring the rest. I can't wait to work with you.",
  },
  covers: ['src/pages/Consult.tsx', 'src/lessons/classes.ts'], updated: '2026-11-25',
  slides: [
    { chapter: 'What a consult is', kind: 'learn', title: 'Your business, her expertise, one hour', nova: 'Boss, this is the closest thing to having a CEO in your corner. Let\'s make every minute count.',
      text: 'Time with the Queen is a private 1:1 business consult. She holds an MBA in business project planning from Capella University, and she works through your challenges with you on any business topic, then gives you tools to tackle them. When a question needs more digging, she can follow up with research and written solutions.',
      table: { head: ['Bring her…', 'Walk away with…'], rows: [
        ['A pricing problem', 'A pricing rule you can use on every piece'],
        ['Flat sales', 'The one lever to pull first, and two moves for it'],
        ['A messy week', 'A routine that gives you your evenings back'],
        ['Big plans', 'Goals, milestones and the first step for this month'],
        ['Questions about going official', 'A clear order of steps and who to call (not legal or tax advice)'],
      ] } },
    { kind: 'quiz', q: 'Which topics can you bring to a consult with the Queen?', options: ['Only strategic planning', 'Any business topic: money, buying, marketing, lives, operations and more', 'Only problems with the app'], answer: 1, why: 'It\'s business consulting on whatever you need. App questions are best for the free live classes and 1:1 coaching.' },

    { chapter: 'How pricing works', queen: "The first full hour is the best value I offer, and it's the time we need to really dig in.", kind: 'learn', title: 'Use the full hour. It\'s worth it!', text: 'Sessions are $100 an hour. Your first full hour is 50% off, so it\'s $50. Time after that is prorated by the minute at $100 an hour. A session shorter than one hour doesn\'t get the discount: it\'s prorated at $100 an hour, so 30 minutes costs $50, the same as a full first hour.',
      table: { head: ['Session length', 'What you pay'], rows: [
        ['30 minutes', '$50 (no discount on partial hours)'],
        ['1 hour', '$50 (first hour 50% off)'],
        ['1½ hours', '$100 ($50 + $50 for 30 more minutes)'],
        ['2 hours', '$150'],
        ['Follow-up research', 'About $25 an hour, estimated before it starts'],
      ] },
      tip: 'Rates are shown on the Time with the Queen page and may change. The page always shows the current price as you pick a length.' },
    { kind: 'learn', title: 'Half down books your time', text: 'To book, you pay a 50% deposit up front. The balance is due after your session. The deposit comes from the price after your first-hour credit, so a full first hour is $50 and the deposit is just $25. The Queen replies to your request with a time and how to pay. Your spot is held once the deposit is in.',
      table: { head: ['Session length', 'Price', 'Deposit to book', 'After the session'], rows: [
        ['1 hour', '$50', '$25', '$25'],
        ['1½ hours', '$100', '$50', '$50'],
        ['2 hours', '$150', '$75', '$75'],
      ] } },
    { kind: 'number', title: 'Your deposit', q: 'You book a full first hour. With the credit it costs $50. How much is due up front to book it?', prefix: '$', answer: 25, hint: 'The deposit is 50% of the price after the credit.', why: '50% of $50 is $25. You pay the other $25 after your session.' },
    { kind: 'number', title: 'Price a session', q: 'You book 2½ hours with the Queen. What does the session cost?', prefix: '$', answer: 200, hint: 'First hour $50, then 1½ more hours at $100 an hour.', why: '$50 + $150 = $200. The first hour is always the bargain, so plan to use all of it.' },
    { kind: 'number', title: 'The short session', q: 'You book 45 minutes. Short sessions are prorated at $100 an hour with no discount. What does it cost?', prefix: '$', answer: 75, hint: '45 minutes is 0.75 of an hour.', why: '0.75 × $100 = $75. A full first hour would be only $50. That\'s why the Queen says: use the full hour, it\'s worth it!' },
    { kind: 'scenario', title: 'Thirty minutes or an hour?', situation: 'You only have one question about pricing your handbags, so you\'re thinking of booking 30 minutes.',
      options: [
        { text: 'Book 30 minutes to save money', feedback: 'Thirty minutes is $50, the same as a full first hour. You\'d get half the time for the same price.' },
        { text: 'Book the full hour, and add two more questions you\'ve been putting off', best: true, feedback: 'Right. Same $50, double the time. Use the extra 30 minutes on your next biggest challenge.' },
        { text: 'Skip the consult and keep guessing', feedback: 'Guessing on price can cost you far more than $50 in a single live.' },
      ] },

    { chapter: 'Come prepared', kind: 'learn', title: 'Your one-page snapshot', text: 'SCORE and the SBA both say the same thing about planning: start from an honest picture of where you are. Bring a one-page snapshot so the Queen can skip the basics and get to the good part.',
      table: { head: ['On your page', 'Example'], rows: [
        ['What you sell and to whom', 'Vintage bags and jewelry for women 40+, on the shared Page and my own'],
        ['How often you go live', 'Two lives a week, Tuesday and Thursday'],
        ['Your four numbers', '90 viewers, 16% buy rate, $27 average order, 40% come back'],
        ['Your business plan', 'Bring it, even if it\'s one page or still in progress'],
        ['What you tried already', 'Raised prices $3; sales stayed flat'],
        ['Your biggest challenge', 'I sell out of jewelry but not bags'],
      ] },
      tip: 'Pull your numbers from Reports the day before. Real numbers get real answers.' },
    { queen: "Send me your questions ahead of time. The more I know before we meet, the more we get done together.", kind: 'learn', title: 'Sharp questions get sharp answers', text: '"How do I make more money?" is hard to answer in an hour. A sharp question names the goal, the number and the thing you already tried.',
      table: { head: ['Vague', 'Sharp'], rows: [
        ['How do I sell more?', 'My buy rate is 12%. What two changes would push it to 18%?'],
        ['Should I raise prices?', 'My average bag costs me $9. I sell at $25. Am I leaving money on the table?'],
        ['How do I get organized?', 'Packing 40 orders takes me 3 hours. Where should I cut first?'],
        ['Should I hire help?', 'I make about $1,800 profit a month. When can I afford a $15/hour helper?'],
      ] } },
    { kind: 'order', title: 'Build a sharp question', prompt: 'Put the parts of a sharp question in order.', steps: ['Name the goal', 'Give the number today', 'Say what you already tried', 'Ask what to do next'] },
    { kind: 'script', title: 'Open your consult strong', text: 'Use your first two minutes like this. It sets the agenda and saves your paid time.', lines: [
      '"Thank you for meeting with me! Here\'s my one-page snapshot."',
      '"My goal for today is ______."',
      '"My three questions, in order, are ______."',
      '"If we only get through one, I most need help with ______."',
      '"By the end, I\'d love to leave with ______."',
    ], tip: 'Take notes, or ask if you can record the audio for yourself.' },

    { chapter: 'Book it', kind: 'learn', title: 'Send your request in the app', text: 'Open More, then Time with the Queen. Follow the three numbered steps. 1: tap the topic cards you want (a gold check shows each pick). 2: tap any topic ideas that fit (they drop right into your request) and write what you want to work on and what you\'re doing now, say whether you have a business plan, pick daytime or evening, and choose a length. 3: pick a time and length. The checklist at the top shows what\'s left, and if something is missing, the button at the bottom takes you right to it. The page shows your price and your 50% deposit. Tap Send my request and it opens as an email to the Queen with everything filled in. She replies with a time and how to pay the deposit, and your time is booked once it\'s paid.',
      screen: { title: 'Time with the Queen', buttons: ['Strategy and planning', 'Money and pricing', '+ Price my pieces so I make a real profit', '1 hour · $50 · $25 to book', 'Send my request'], highlight: 'Send my request' } },
    { kind: 'tap', title: 'Practice: pick the best value', prompt: 'You want the most time for the best price on your first consult. Which length do you pick?', screen: { title: 'How long?', buttons: ['30 minutes · $50', '1 hour · $50', '1.5 hours · $100', '2 hours · $150'] }, answer: '1 hour · $50', hint: 'Partial hours don\'t get the discount. The first full hour does.' },
    { kind: 'learn', title: 'After the session', text: 'The consult is the start, not the finish. What you do in the next seven days decides what it was worth.',
      points: ['Write your top three action steps that night', 'Put each one on your calendar this week', 'If she offered follow-up research, decide yes or no within a day (about $25 an hour, estimated first)', 'Try the steps for two to four weeks, track your numbers, then book a check-in', 'Add what worked to your pre-live checklist or pack card'] },
    { kind: 'reflect', title: 'Your three questions', prompt: 'Write the three sharp questions you\'d bring to the Queen today, most important first.', placeholder: '1. … 2. … 3. …', example: '1. My buy rate is 12%; what two changes would raise it? 2. Bags cost me $9 and sell at $25; should I price higher? 3. Packing takes 3 hours for 40 orders; where do I cut?' },
    { kind: 'checklist', title: 'Ready for the Queen', prompt: 'Tick these off before your session.', items: ['Write my one-page snapshot', 'Pull my four numbers from Reports', 'Bring my business plan, even if it\'s rough', 'Write three sharp questions', 'Book the full hour', 'Block 15 minutes after to write my action steps'] },
  ],
}
export default lesson
