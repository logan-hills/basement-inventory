import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'familybalance', kind: 'course', school: 'Life and legacy', title: 'Business and family: make room for both', track: 'Business', icon: 'heart',
  why: "A home business can swallow your evenings, your kitchen table and your weekends without you noticing. The shops that last are run by owners who protect family time on purpose, and bring family in where it fits.",
  outcomes: [
    'See where your shop spills into family time, using a simple time audit',
    'Choose your style: keep work and home separate, or blend them on purpose',
    'Set shop hours, a shop space and a weekly family plan',
    'Bring kids and partners into the business in healthy ways',
    'Handle guilt, busy seasons and family emergencies without losing the shop',
  ],
  route: { to: '/calendar', label: 'Open the Calendar' },
  sources: [
    { org: 'Harvard Business Review (Ashley Whillans)', title: 'Time for happiness', url: 'https://hbr.org/2019/01/time-for-happiness' },
    { org: 'Harvard Business Review (Leslie Perlow and Jessica Porter)', title: 'Making time off predictable, and required', url: 'https://hbr.org/2009/10/making-time-off-predictable-and-required' },
    { org: 'Knowledge at Wharton (Nancy Rothbard)', title: 'Integrators and segmentors: managing work and home boundaries', url: 'https://knowledge.wharton.upenn.edu/article/integrators-segmentors-managing-remote-workers/' },
    { org: 'American Psychological Association', title: 'Stress in America survey', url: 'https://www.apa.org/news/press/releases/stress' },
    { org: 'IRS', title: 'Family employees', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/family-employees' },
  ],
  queen: {
    welcome: "I built this course for every seller who has packed orders with a baby on her hip or missed a ball game for a live. Your family is the reason so many of us started. Let's make sure the business serves them, instead of the other way around.",
    signoff: "Set your shop hours, guard your family time like it's a top buyer, and let your loved ones be part of it where it fits. A business that honors your family is a business you'll never resent.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Where the time goes', kind: 'learn', title: 'The shop that ate the kitchen table', nova: "Let's take an honest peek at your week. No judgment, just facts.",
      text: "When home is the office, work leaks into every corner: replying to buyers at dinner, tagging stock during movie night, a live during a birthday. Harvard Business School professor Ashley Whillans studies 'time poverty,' the feeling of having too much to do and not enough time, and finds that people who choose time over more money tend to be happier.",
      points: ['Count every hour of shop work for one week, including "quick" messages', 'Mark which hours overlapped with family time', 'Circle the jobs only you can do; the rest can move, batch or go to a helper'] },
    { kind: 'number', title: 'Your hidden hours', q: 'You check buyer messages about 12 times a day, 4 minutes each time, every day of the week. How many hours a week is that?', suffix: 'hours', answer: 5.6, tolerance: 0.05, hint: '12 × 4 = 48 minutes a day. × 7 days, then ÷ 60.', why: '48 × 7 = 336 minutes, about 5.6 hours a week, much of it during family time. Answering in two set windows a day can give most of that back.' },
    { kind: 'reflect', title: 'Your time audit', prompt: 'Where did shop work spill into family time this week? Which one would you fix first?', placeholder: 'It spilled into… The one I\'ll fix first…', example: 'Messages at dinner every night and tagging during movie night Saturday. First fix: phone in the shop room from 6 to 8 PM.' },

    { chapter: 'Pick your style', kind: 'learn', title: 'Separate or blend?', text: "Wharton professor Nancy Rothbard's research on boundaries finds there's no one right way. Some people are 'segmenters' who feel best keeping work and home apart. Others are 'integrators' who are fine mixing them. Trouble starts when your setup doesn't match your style.",
      table: { head: ['', 'Segmenter', 'Integrator'], rows: [
        ['Feels best when', 'Work stays in its place and time', 'Work and family flow together'],
        ['Shop space', 'A door that closes', 'Shared spaces are fine'],
        ['Messages', 'Set windows only', 'Quick replies are okay, but with off-limits times'],
        ['Kids helping', 'On set jobs, at set times', 'Often, as part of family life'],
      ] },
      queen: "Know yourself, then build the shop around who you are. There's no prize for copying somebody else's routine." },
    { kind: 'quiz', q: 'Renee gets stressed when buyer messages pop up during family dinner, but feels fine tagging stock while her kids do homework beside her. What\'s the best move?', options: ['Quit selling at home', 'Keep blending, but set dinner as a no-phone time', 'Answer every message instantly so they stop', 'Do everything after the kids are asleep'], answer: 1, why: "She's mostly an integrator with one boundary that matters to her. Protect that one time and keep what works." },

    { chapter: 'Build the boundaries', kind: 'learn', title: 'Shop hours, shop space, shop phone', text: "Three simple boundaries do most of the work.",
      table: { head: ['Boundary', 'How', 'Example'], rows: [
        ['Shop hours', 'Post them; answer messages in set windows', '"I answer messages 10 to 11 AM and 4 to 5 PM."'],
        ['Shop space', 'A corner, closet or room that is the shop', 'Stock stays in the basement, never on the couch'],
        ['Shop phone time', 'Notifications off outside shop hours', 'Messenger on Do Not Disturb after 8 PM'],
      ] } },
    { kind: 'learn', title: 'Protected time works', text: "In a study at Boston Consulting Group, Harvard's Leslie Perlow and Jessica Porter had consulting teams take one predictable night off each week. People were happier, more likely to stay, and the work did not suffer. For a home seller, 'predictable time off' means family nights your buyers know about.",
      example: "Robin posts in her group: 'Sunday is family day in my house. I'll see your messages Monday at 10!' Her buyers love it, and some say it makes them trust her more." },
    { kind: 'script', title: 'Tell your buyers kindly', lines: [
      '"Shop hours: I answer messages 10 to 11 AM and 4 to 5 PM, Monday to Saturday. Sunday is family day!"',
      '"I\'m off for my son\'s graduation this Thursday, so no live this week. See you Sunday with something special!"',
      '"Got your message! I\'ll reply in my 4 o\'clock shop window. Thank you for your patience."',
    ] },
    { kind: 'checklist', title: 'Boundaries to set', prompt: 'Tick the boundaries you\'ll start this week.', items: ['Post my shop hours in my group and pinned post', 'Pick two message windows a day', 'Turn on Do Not Disturb for Messenger after my last window', 'Choose one protected family night a week', 'Keep stock in the shop space only'] },

    { chapter: 'Family in the business', kind: 'learn', title: 'Let them in, the healthy way', text: "Kids and partners can be wonderful helpers, and kids learn real business skills watching you. Keep it healthy:",
      points: ['Give real, age-right jobs: folding, tagging, taping boxes, counting stock', 'Set a start and stop time; it\'s a job, not all day', 'Pay them when it\'s real work (the IRS has special rules for hiring your own child; ask a tax pro)', 'Celebrate together when the shop hits a goal', 'Let them say no sometimes. A helper who\'s forced starts to resent the shop'],
      queen: "Let your children see you count the money, not just pack the boxes. That's how you raise the next business owner in your family." },
    { kind: 'scenario', title: 'The big game', situation: "Your daughter's championship game is Thursday at 7, exactly when your best weekly live happens.",
      options: [
        { text: 'Go live as usual; the shop pays the bills', feedback: "One live won't make or break your month, but missing the championship stays with both of you." },
        { text: 'Move the live to Friday, announce it early, and go to the game', best: true, feedback: "Your buyers will follow a schedule change you announce. You won't get that game back." },
        { text: 'Go live from the bleachers', feedback: "Neither the live nor the game gets your best. Choose one on purpose." },
      ] },
    { kind: 'learn', title: 'Busy seasons and emergencies', text: "Some seasons the shop needs more, like October to December. Some weeks the family needs everything, like an illness. Plan for both ahead of time.",
      points: ['Tell your family before the busy season: "November is my Christmas rush; December 26 we celebrate"', 'Keep a "pause plan": a pinned message, a helper who can ship paid orders, and your cushion', 'In an emergency, pause lives, ship what\'s paid and tell buyers simply', 'Come back with a welcome-back live; your community will be there'] },
    { kind: 'script', title: 'When family needs you', lines: [
      '"Hi friends, my family needs me this week, so lives are paused until [date]. All paid orders are still shipping. Thank you for your love and patience."',
    ] },
    { kind: 'reflect', title: 'Your family plan', prompt: 'Write your shop hours, your protected family time and one way you\'ll include your family in the business.', placeholder: 'Shop hours… Family time… How my family joins in…', example: 'Shop hours 10 to 11 and 4 to 5. Sunday is family day. My son tapes boxes Friday nights for $10 and picks the pizza.' },
  ],
}
export default lesson
