import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'marketing', kind: 'course', school: 'Brand and marketing', title: 'Market your brand without burning out', track: 'Business', icon: 'trend',
  why: "Great pieces don't sell if nobody knows about the live. Marketing is simply inviting people, on repeat.",
  outcomes: [
    'Write posts that answer What, When and Why every time',
    'Run the 4-touch week before every live, in about an hour total',
    'Write hooks that stop the scroll',
    'Run giveaways and referral nights that follow Facebook\'s rules',
    'Track one simple scorecard so you know what actually works',
  ],
  sources: [
    { org: 'U.S. Small Business Administration', title: 'Marketing and sales', url: 'https://www.sba.gov/business-guide/manage-your-business/marketing-sales' },
    { org: 'U.S. Small Business Administration', title: 'Marketing plan example', url: 'https://www.sba.gov/document/support-marketing-plan-example' },
    { org: 'HubSpot Academy', title: 'Facebook marketing training (free)', url: 'https://academy.hubspot.com/courses/facebook-marketing-training' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'The invite mindset', kind: 'learn', title: 'Marketing is an invitation', nova: "Forget \"being salesy.\" You're throwing a party and inviting your people.",
      text: "Most sellers post \"going live later!\" and wonder why nobody comes. Every invitation needs to answer three questions before the reader even thinks to ask them.",
      points: ['What: the theme and a sneak peek of 2 or 3 pieces', 'When: day, time AND time zone ("Tuesday 7 PM ET")', 'Why: the deal, the giveaway, the fun, the reason to come tonight instead of someday'] },
    { kind: 'learn', title: 'The path from scroll to sale', text: "Every buyer walks the same path. When a live feels slow, find the step where people are falling off and fix that step, not everything at once.",
      table: { head: ['Step', 'What it looks like', 'How you help'], rows: [
        ['See', 'She scrolls past your Reel or poster', 'Post often, hook in the first second'],
        ['Follow', 'She likes or follows your Page', 'Show your face and your personality'],
        ['Remember', 'She knows when you go live', 'Same days and times, reminders'],
        ['Show up', 'She joins the live', 'The 4-touch week (coming up next)'],
        ['Buy', 'She comments SOLD', 'Clear rules, good pieces, good energy'],
        ['Come back', 'She shops again', 'Fast shipping, thank-yous, shout-outs'],
      ] } },
    { kind: 'quiz', q: 'Which post is most likely to fill your live?', options: ['"Going live later!"', '"Tuesday 7 PM ET: $2 jewelry + a free tote giveaway. Tap Get reminder!"', '"New stuff coming soon"'], answer: 1, why: 'It tells her what, when, and why to come, and gives her one easy thing to do.' },

    { chapter: 'The 4-touch week', kind: 'learn', title: 'Four touches, about an hour total', nova: "Here's a rhythm you can keep even on your busiest week.",
      text: "Four touches before every live keeps you top of mind without posting all day. Each one has a different job.",
      table: { head: ['When', 'Post', 'Its job'], rows: [
        ['2 days before', 'The poster and the theme', 'Put it on her calendar'],
        ['1 day before', 'Sneak peek video of 3 pieces', 'Make her want something specific'],
        ['Morning of', '"Tonight!" reminder with the time', 'Turn intent into a plan'],
        ['1 hour before', '"We\'re setting up" behind the scenes', 'The last nudge, and it feels personal'],
      ] },
      tip: 'Schedule your live on Facebook ahead of time when you can. People who tap Get reminder get notified when you start.' },
    { kind: 'script', title: 'Copy-ready 4-touch posts', text: 'Change the words in brackets and these are ready to post.',
      lines: [
        '2 DAYS: "[Theme] is THIS [day] at [time] ET! 💎 [Price hook, like \'Everything gold is $2\'] + a free [giveaway]. Tap Get reminder so you don\'t miss it."',
        '1 DAY: "Sneak peek for tomorrow… 👀 This [piece] is going for [price]. Which one are you claiming? Comment 1, 2 or 3!"',
        'MORNING: "TONIGHT, [time] ET! Grab your tea and your phone. [One-line reason to come]."',
        '1 HOUR: "Setting up the table now 😍 See you in an hour! Who\'s coming? Drop a 💛"',
      ],
      tip: 'Asking a tiny question ("comment 1, 2 or 3") gets comments, and comments get your post shown to more people.' },
    { kind: 'order', title: 'Put the week in order', prompt: 'Order the four touches from first to last.', steps: ['Poster and theme', 'Sneak peek video', '"Tonight!" reminder', 'Behind-the-scenes, 1 hour before'] },

    { chapter: 'Hooks that stop the scroll', kind: 'learn', title: 'Five hook formulas', text: "People decide in about one second whether to keep watching or reading. Lead with your most exciting thing, never with \"Hey guys, so…\". Here are five formulas that work again and again for live sellers.",
      table: { head: ['Formula', 'Example'], rows: [
        ['The shocking price', '"This bag is $5. Yes, five."'],
        ['The secret', '"3 pieces I\'d never let go of… but tonight I am."'],
        ['The call-out', '"If you have a wedding to go to this spring, stop scrolling."'],
        ['The POV', '"POV: you found the basement with all the bargains."'],
        ['The challenge', '"Can I build a whole church outfit for under $20?"'],
      ] } },
    { kind: 'scenario', title: 'Pick the opening line', situation: "You're filming a sneak peek of a gorgeous emerald crossbody bag you'll sell for $12 tomorrow night.",
      options: [
        { text: '"Hey y\'all, so I just wanted to hop on real quick and show you guys some stuff…"', feedback: "By the time you get to the bag, most people have scrolled away. Never warm up on camera." },
        { text: '"This emerald bag looks like $120. Tomorrow night it\'s $12."', best: true, feedback: 'Shocking price plus a clear visual in the first second. That stops thumbs.' },
        { text: '"New inventory update!"', feedback: "It's true, but there's nothing in it to make anyone stop." },
      ] },
    { kind: 'reflect', title: 'Write two hooks', prompt: 'Write two hooks for your next live, using two different formulas from the table.', placeholder: '1. … 2. …', example: '1. "Every gold piece is $2 until the timer runs out." 2. "If you\'ve got a holiday party coming, stop scrolling."' },

    { chapter: 'Let buyers sell for you', kind: 'learn', title: 'Word of mouth, on purpose', nova: "Your happiest buyer is your best ad. Give her something to talk about.",
      text: "Word of mouth doesn't have to be luck. Make it easy and make it rewarding.",
      points: ['"Post your haul and tag the Page for a shout-out on the next live"', 'Share buyers\' photos (ask permission first, every time)', 'Bring-a-friend night: when a new buyer says who sent her, both get a small freebie in their box', 'Birthday month shout-outs and a tiny gift for regulars'] },
    { kind: 'learn', title: "Giveaways that don't get you in trouble", text: "Giveaways bring people in, but there are two rules sellers break all the time without knowing it.",
      points: [
        'Facebook\'s Page rules say you can\'t require people to share to their own timeline or tag friends to enter. Comment-to-enter and like-to-enter are fine.',
        'A giveaway where people must BUY to enter, and the winner is picked by chance, can count as an illegal lottery in many states. Keep chance-based giveaways free to enter.',
        'Say clearly how and when the winner is picked, then do exactly that on camera.',
      ],
      tip: 'Rules change. If you plan a big giveaway, read Facebook\'s current Pages promotion rules and your state\'s rules first.' },
    { kind: 'scenario', title: 'Plan the giveaway', situation: 'You want a free tote giveaway to bring more people to Thursday\'s live.',
      options: [
        { text: '"Share this post on your timeline and tag 3 friends to enter!"', feedback: "That breaks Facebook's Page promotion rules and can get your post or Page in trouble." },
        { text: '"Every $25 you spend tonight is one entry in the drawing."', feedback: 'Buy-to-enter plus a random pick can be an illegal lottery in many states. Keep chance giveaways free.' },
        { text: '"Comment TOTE during the live to enter. I\'ll pick a winner live at 7:45 with a random picker."', best: true, feedback: 'Free to enter, clear rules, picked on camera. Easy, fair, and it keeps people watching until 7:45.' },
      ] },
    { kind: 'quiz', q: "A buyer posts a sweet photo of her haul in the group. What's the best move?", options: ['Like it and move on', 'Ask if you can share it, then shout her out on the next live', 'Repost it without asking, she won\'t mind'], answer: 1, why: 'Asking first keeps trust. The shout-out makes her feel special and shows everyone else real buyers love you.' },

    { chapter: 'Know what works', kind: 'learn', title: 'Your one-minute scorecard', text: "After every live, write down five numbers. In a month you'll know exactly which themes, nights and posts pay off. Reports already shows sales by live, so you just add what you posted.",
      table: { head: ['Live', 'Posts', 'Most viewers at once', 'Buyers', 'Sales'], rows: [
        ['Bag Bonanza (Tue)', '4 touches + 1 Reel', '62', '19', '$486'],
        ['$2 Tuesday', '2 touches', '35', '11', '$148'],
        ['Holiday Glam (Thu)', '4 touches + giveaway', '88', '27', '$731'],
      ] } },
    { kind: 'number', title: 'What share of viewers bought?', q: 'Holiday Glam had 88 viewers at its peak and 27 buyers. What percent of viewers bought? (Round to the nearest whole number.)', answer: 31, tolerance: 1, suffix: '%', hint: 'Divide buyers by viewers, then multiply by 100.', why: '27 ÷ 88 = 0.31, so about 31 out of every 100 viewers bought. Track this live to live. When it drops, look at your pieces and prices. When viewers drop, look at your posts.' },
    { kind: 'quiz', q: 'Your Bag Bonanza live sold twice as much as usual. What do you do?', options: ['Repeat it, and write down exactly what you posted', 'Never do it again, it was luck', 'Change everything next week'], answer: 0, why: 'Do more of what works, and remember why it worked.' },

    { chapter: 'Without burning out', kind: 'learn', title: 'The one-hour Sunday', text: "Burnout comes from deciding what to post every single day. Decide once a week instead.",
      points: ['10 min: pick the theme for each live this week in the Live Planner', '20 min: make the posters', '20 min: film 3 or 4 short clips in one go (same outfit, same light)', '10 min: write the captions and schedule what you can'],
      tip: 'Done and consistent beats perfect and once a month.' },
    { kind: 'checklist', title: 'Your marketing plan for this week', prompt: "Tick what you'll do before your next live.", items: [
      'Pick the theme and make the poster',
      'Post the poster 2 days before',
      'Film and post a 3-piece sneak peek 1 day before',
      'Post a "Tonight!" reminder in the morning',
      'Post behind the scenes 1 hour before',
      'Plan one free-to-enter giveaway',
      'Fill in my scorecard after the live',
    ] },
  ],
}
export default lesson
