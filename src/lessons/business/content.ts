import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'content', kind: 'course', school: 'Social media', title: 'A month of posts in one afternoon', track: 'Business', icon: 'calendar',
  why: 'Posting every day feels impossible until you batch it. One afternoon a month keeps your page busy and your lives full.',
  outcomes: [
    'Build a content mix that sells without feeling salesy',
    'Plan a month of posts around your live calendar',
    'Batch-create photos, captions and videos in one session',
    'Schedule everything with free tools',
    'Recycle your best content instead of starting from zero',
  ],
  route: { to: '/planner', label: 'Open Live Planner' },
  sources: [
    { org: 'HubSpot Academy', title: 'Facebook marketing training (free)', url: 'https://academy.hubspot.com/courses/facebook-marketing-training' },
    { org: 'U.S. Small Business Administration', title: 'Marketing and sales', url: 'https://www.sba.gov/business-guide/manage-your-business/marketing-sales' },
    { org: 'Lean Enterprise Institute', title: 'Lean lexicon (batching and flow)', url: 'https://www.lean.org/explore-lean/lexicon-terms/' },
  ],
  queen: {
    welcome: "Posting every day feels impossible until you batch it. One afternoon a month can keep your page busy and your lives full. Let me show you how I'd plan it.",
    signoff: "Anchor your posts around your lives, keep an idea bank, and show your face. One afternoon a month, and your page runs itself.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'The content mix', kind: 'learn', title: 'Not every post is a sales pitch', nova: 'If every post says "buy," people tune out. Mix it up and they\'ll lean in.',
      text: 'Strong small-business pages mix a few kinds of posts. A simple split many marketers use: most posts give value or build connection, and a smaller share asks for the sale.',
      table: { head: ['Type', 'Share', 'Examples'], rows: [
        ['Show (product)', 'About 40%', 'Sneak peeks, new arrivals, styled photos'],
        ['Teach (value)', 'About 20%', 'How to style a scarf, how to spot real leather'],
        ['Connect (you)', 'About 20%', 'Behind the scenes, your story, packing day'],
        ['Celebrate (buyers)', 'About 10%', 'Customer photos (with permission), reviews, shout-outs'],
        ['Sell (the ask)', 'About 10%', 'Live posters, "tonight at 7!" reminders'],
      ] } },
    { kind: 'tap', title: 'Name the type', prompt: '"3 ways to tie a silk scarf for fall" is which type?', screen: { title: 'Content mix', buttons: ['Show', 'Teach', 'Connect', 'Sell'] }, answer: 'Teach', hint: 'It gives buyers useful know-how. Teaching posts get saved and shared.' },

    { chapter: 'Plan around lives', kind: 'learn', title: 'Your live is the anchor', text: 'Plan backwards from each live. The Live Planner already gives you a theme and a poster; your posts warm people up for it.',
      table: { head: ['Day', 'Post'], rows: [
        ['Live minus 3 days', 'Teach or connect post related to the theme'],
        ['Live minus 2 days', 'Poster from the Planner + sneak peek Reel'],
        ['Live minus 1 day', 'Show post: 3 hero pieces'],
        ['Live day, morning', '"Tonight at 7!" reminder'],
        ['Live day, 15 min before', 'Story or post: "Going live soon"'],
        ['Day after', 'Live highlight Reel + celebrate buyers'],
      ] } },
    { kind: 'order', title: 'Warm-up order', prompt: 'Put this week\'s posts in order for a Thursday live.', steps: ['Monday: teach post on the theme', 'Tuesday: poster and sneak peek Reel', 'Wednesday: 3 hero pieces', 'Thursday morning: "Tonight at 7" reminder', 'Friday: live highlight and buyer shout-outs'] },

    { chapter: 'Batch it', queen: "Batch on the same afternoon every month, with music and a snack. Make it a ritual, not a chore.", kind: 'learn', title: 'The batching afternoon', text: 'Switching between tasks wastes time (the lean course calls it waste). Do all of one kind of task at once.',
      table: { head: ['Block', 'Time', 'What you make'], rows: [
        ['1. Plan', '30 min', 'Calendar of 20 to 30 posts mapped to your lives'],
        ['2. Shoot photos', '60 min', 'All product and styled photos in one lighting setup'],
        ['3. Film', '60 min', 'All Reels and short clips'],
        ['4. Write', '45 min', 'Every caption, with hashtags and calls to action'],
        ['5. Design', '30 min', 'Posters and graphics in Canva or the Planner'],
        ['6. Schedule', '30 min', 'Load it all into the scheduler'],
      ] } },
    { kind: 'number', title: 'Time saved', q: 'Posting one thing at a time takes you about 25 minutes per post. Batching takes about 4 hours for 24 posts. How many hours a month do you save?', answer: 6, tolerance: 0.05, suffix: 'hours', hint: '24 × 25 minutes = minutes one at a time. Convert to hours and subtract 4.', why: '24 × 25 = 600 minutes = 10 hours. 10 − 4 = 6 hours saved every month.' },

    { chapter: 'Captions and scheduling', kind: 'script', title: 'Caption formula', text: 'Use this shape for most captions.', lines: [
      'LINE 1 (hook): "The bag everyone asked about is BACK."',
      'LINE 2 to 3 (details): "Emerald pebbled leather, gold hardware, fits a tablet."',
      'LINE 4 (why it matters): "Holds everything, goes with everything."',
      'CALL TO ACTION: "Thursday 7 PM live. Set your reminder!"',
      'HASHTAGS: 3 to 5 that your buyers actually search',
    ] },
    { kind: 'learn', title: 'Schedule for free', text: 'Facebook and Instagram posts and Reels can be scheduled free in Meta Business Suite. TikTok lets business and creator accounts schedule from a computer. Canva also has a content planner on paid plans.',
      points: ['Schedule at the times your buyers are online (check your insights)', 'Leave room for real-time posts: sellouts, surprises', 'Check comments daily even when posts are scheduled'] },
    { kind: 'learn', title: 'Recycle your winners', text: 'Your best post from 3 months ago is new to most of today\'s followers.',
      points: ['Reshare your top 5 posts each quarter with a fresh caption', 'Turn a great carousel into a Reel, or a Reel into a carousel', 'Save top-performing hooks in a note and reuse the pattern'] },
    { kind: 'reflect', title: 'Your batching day', prompt: 'Pick the date of your first batching afternoon and the lives it will cover.', placeholder: 'On … I\'ll batch posts for…', example: 'Sunday the 30th, 1 to 5 PM. Covers all 8 lives in December.' },
    { kind: 'learn', title: 'Case study: a December plan', text: 'Here\'s a real-feel month for a seller with Tuesday and Thursday lives.',
      table: { head: ['Week', 'Theme', 'Teach post', 'Connect post'], rows: [
        ['1', 'Holiday Glam', '3 ways to wear sequins', 'Our holiday tradition'],
        ['2', 'Gifts Under $25', 'How to pick a gift she\'ll love', 'Packing gift orders'],
        ['3', 'Last-Minute Gifts', 'Ship-by dates explained', 'Meet my helper'],
        ['4', 'New Year Sparkle', 'Jewelry care tips', 'Thank you for this year'],
      ] } },
    { kind: 'scenario', title: 'Out of ideas', situation: 'It\'s Sunday, you sat down to batch, and you have no ideas.',
      options: [
        { text: 'Skip this month', feedback: 'Then your page goes quiet before your lives, and viewers drop.' },
        { text: 'Look at last month\'s top posts, your live themes and buyer questions, and turn each into a post', best: true, feedback: 'Your buyers\' questions and your own winners are an endless idea bank.' },
        { text: 'Copy another seller\'s posts word for word', feedback: 'It\'s not your voice, and it can be a copyright problem. Get inspired, then make it yours.' },
      ] },
    { kind: 'learn', title: 'An idea bank', text: 'Keep a running note of ideas so batching day starts full.',
      points: ['Every question a buyer asks is a teach post', 'Every sellout is a celebrate post', 'Every haul is an unboxing Reel', 'Every behind-the-scenes moment is a connect post', 'Every holiday and season is a theme'] },
    { queen: "Your face is your brand. Posts with you in them build trust that product photos alone can't.", kind: 'learn', title: 'Show your face', text: "Posts where buyers see you, not just the product, tend to build trust faster, because people buy from people. You don't need to be on camera all day. One face post for every two product posts is a good rhythm.",
      points: ["A 15-second 'what I found today' clip from the thrift run", "A photo of you wearing the piece of the week", "A thank-you to a buyer (with her permission)", "A quick story about why you started selling"] },
    { kind: 'scenario', title: 'Nobody comments', situation: "Your posts get likes but almost no comments, and the Facebook algorithm seems to be showing them to fewer people each week.",
      options: [
        { text: "Post more product photos with prices", feedback: "More of the same gets the same result. Price lists don't start conversations." },
        { text: "Ask easy questions: 'Gold or silver? Tell me below,' and answer every comment in the first hour", best: true, feedback: "Right. Easy questions get easy answers, and replying fast keeps the conversation going while the post is fresh." },
        { text: "Turn off comments so the post looks cleaner", feedback: "That hides the very signal that tells people your page is alive." },
      ] },
    { kind: 'reflect', title: 'Your next 7 posts', prompt: "Plan next week's posts around your live. Write one line for each day: what type (help, show, story or sell) and what it is.", placeholder: "Mon: … Tue: … Wed: …", example: "Mon: story, my thrift find. Tue: help, how to clean gold. Wed: show, poster. Thu: live! Fri: sell, leftovers. Sat: face post. Sun: rest." },
    { kind: 'checklist', title: 'Content system', prompt: 'Tick what you\'ll set up.', items: ['Write my content mix percentages', 'Map 4 weeks of posts to my live calendar', 'Block one batching afternoon a month', 'Set up Meta Business Suite scheduling', 'Save my caption formula as a note', 'Recycle my top 5 posts next quarter'] },
  ],
}
export default lesson
