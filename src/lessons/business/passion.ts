import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'passion', kind: 'course', school: 'Mindset and motivation', title: 'Passion that lasts: keep it a joy, not a job', track: 'Business', icon: 'heart',
  why: "If you're not excited about your shop, the long haul will feel like work. This course helps you protect the spark so you're still in love with it years from now.",
  outcomes: [
    'Tell healthy passion from the kind that burns you out',
    'Find your real "why" and keep it in front of you',
    'Shape your week around the parts of the work you love',
    'Hand off or simplify the parts that drain you',
    'Set boundaries so your shop fits your life, not the other way around',
  ],
  route: { to: '/planner', label: 'Open the Live planner' },
  sources: [
    { org: 'American Psychological Association', title: 'The power and perils of passion (Vallerand, 2024)', url: 'https://www.apa.org/pubs/highlights/spotlight/passion-self-growth' },
    { org: 'Harvard Business School Working Knowledge', title: 'How small wins unleash creativity (Amabile and Kramer)', url: 'https://www.library.hbs.edu/working-knowledge/how-small-wins-unleash-creativity' },
    { org: 'World Health Organization', title: 'Burn-out an "occupational phenomenon"', url: 'https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases' },
    { org: 'Stanford University', title: "Why 'Find your passion!' may be bad advice", url: 'https://news.stanford.edu/stories/2018/06/find-passion-may-bad-advice' },
  ],
  queen: {
    welcome: "You started this because you love it. I want you to still love it five years from now. This course is about protecting that spark while the business grows.",
    signoff: "Guard your shop hours, delegate what drains you, and celebrate your small wins out loud. A joyful seller is a magnetic seller.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Two kinds of passion', kind: 'learn', title: 'Not all passion is good for you', nova: "I love this job, boss, and I want YOU to love yours for a long, long time. Let's protect that.",
      text: "Psychologist Robert Vallerand has studied passion for over twenty years. The American Psychological Association summarized his work in 2025: there are two kinds. Harmonious passion is when you freely choose the work and it fits in balance with the rest of your life. Obsessive passion is when you feel controlled by the very thing you love: you can't stop, you feel guilty resting, and it crowds out everything else.",
      table: { head: ['Harmonious passion', 'Obsessive passion'], rows: [
        ['"I get to go live tonight!"', '"I have to go live or I\'m failing."'],
        ['Rests without guilt', 'Feels guilty on a day off'],
        ['Family and health still fit', 'Skips meals, sleep and family'],
        ['Bounces back from a slow night', 'A slow night ruins the week'],
      ] } },
    { kind: 'learn', title: 'What the research found', text: "Vallerand's research found both kinds can lead to high performance. The difference is what it costs you. Harmonious passion goes with more happiness, better health and relationships, and stronger, more flexible persistence. Obsessive passion carries risks like neglecting yourself and making risky decisions.",
      tip: "You don't have to choose between loving your shop and having a life. The research says the balanced kind is the one that lasts." },
    { kind: 'tap', title: 'Which kind?', prompt: 'Carla checks her shop messages at 2 AM, skipped her grandson\'s game for a live, and feels anxious on days off. Which kind of passion is showing?', screen: { title: 'Which one?', buttons: ['Harmonious', 'Obsessive'] }, answer: 'Obsessive', hint: 'Feeling controlled by the work and letting it crowd out family and rest are signs of obsessive passion.' },
    { kind: 'reflect', title: 'Check yourself', prompt: 'Think about the last two weeks. Where did your passion feel harmonious? Where did it start to feel obsessive?', placeholder: 'Harmonious when… Obsessive when…', example: 'Harmonious: styling looks for Tuesday live, I lost track of time in a good way. Obsessive: answering messages during Sunday dinner.' },

    { chapter: 'Your why', kind: 'learn', title: 'Dig to your real why', text: "\"To make money\" is a fine start, but it won't get you out of bed on a cold Monday. Ask \"why does that matter?\" a few times until you hit something that moves you.",
      example: "Why sell? \"To make extra money.\" Why does that matter? \"So I'm not stressed about bills.\" Why does that matter? \"So I can help my daughter through school.\" Why does that matter? \"Because nobody did that for me, and I want her to have more.\" THAT is the why to tape to your mirror." },
    { kind: 'reflect', title: 'Your three whys', prompt: 'Start with "I sell because…" and ask "why does that matter?" three times. Write where you land.', placeholder: 'I sell because… Why? … Why? … Why? …', example: 'I sell because I love fashion. Why? Dressing up makes women feel seen. Why? I felt invisible for years. Why? I want every woman on my live to feel beautiful tonight.' },

    { kind: 'learn', title: "Passion is grown, not found", text: "Researchers at Stanford (Paul O'Keefe, Carol Dweck and Gregory Walton) tested the popular advice to \"find your passion.\" People who believed passion is something you find, fully formed, were quicker to lose interest when an activity got hard. People who believed interests are developed stuck with it longer and grew more interested over time.",
      points: ['Don\'t wait to feel passionate before you start; passion grows as you get good', 'Expect the hard middle part; it doesn\'t mean you picked the wrong thing', 'Feed your interest: learn more about your product, your buyers and your craft', 'Try new corners of the work (styling, theme nights, Reels) to find what lights you up'] },
    { kind: 'quiz', q: 'The packing and bookkeeping parts of your shop feel boring. What does the Stanford research suggest?', options: ['You picked the wrong business and should quit', 'Hard and boring parts are normal; passion grows as you build skill and shape the work', 'Real passion means loving every single task', 'Wait until you feel passionate again before going live'], answer: 1, why: 'Interest is developed. Every business has dull parts. Shape the work, build skill, and your passion has room to grow.' },

    { chapter: 'Love the work', queen: "Do your most draining job right before something you love. The reward on the other side makes it go faster.", kind: 'learn', title: 'Sort your tasks by energy', text: "Every shop has parts you love and parts you dread. Write them down. The goal is a week with more of the first and less of the second.",
      table: { head: ['Lights me up', 'Neutral', 'Drains me'], rows: [
        ['Styling looks on live', 'Pricing and tagging', 'Chasing unpaid invoices'],
        ['Chatting with regulars', 'Shelving stock', 'Printing labels at midnight'],
        ['Finding treasures at the vendor', 'Posting the schedule', 'Bookkeeping'],
      ] },
      tip: "Then for each draining task ask: can I automate it, simplify it, batch it, or hand it to a helper? The app's comment bot, picking list and team members exist for exactly this." },
    { kind: 'scenario', title: 'The draining task', situation: 'You love your lives but dread packing. Lately you put it off, orders ship late and you feel guilty all week.',
      options: [
        { text: 'Force yourself to pack every night after the live', feedback: "Willpower alone wears out. You'll end up dreading live night too." },
        { text: 'Batch packing into two set blocks a week with music on, use the pick list, and add a helper as a team member when sales allow', best: true, feedback: "You simplify it, put it on a schedule so it stops hanging over you, and plan to hand it off. The love stays in the lives." },
        { text: 'Stop promising a ship time', feedback: "Late shipping loses buyers, and the FTC expects you to ship in the time you state (or 30 days if you state none)." },
      ] },
    { kind: 'learn', title: 'Small wins keep the fire lit', text: "Harvard Business School's Teresa Amabile and Steven Kramer studied about 12,000 daily diary entries from 238 people at seven companies. The single biggest lift to people's mood and motivation on a good day was making progress on meaningful work, even small progress. Setbacks hit 2 to 3 times harder than wins, so it pays to notice the wins on purpose.",
      points: ['End each live by naming one win out loud', 'Keep a "done" list, not just a to-do list', 'Celebrate firsts: first $500 live, first 100 followers, first regular'] },

    { chapter: 'Boundaries', kind: 'learn', title: 'Your shop hours', text: "The World Health Organization describes burnout as coming from chronic work stress that hasn't been managed: exhaustion, feeling distant or cynical about the work, and feeling less effective. Boundaries are how you manage it before it manages you.",
      points: ['Set message hours and post them ("I answer messages 9 AM to 7 PM")', 'Pick one full day a week with no shop work', 'Turn off notifications during family time', 'Plan your lives a week ahead so nothing is last-minute', 'Say no to "just one more" live when you are tired'] },
    { queen: "You can be kind and still say 'my shop is closed for the night.' Boundaries are how you stay kind long-term.", kind: 'script', title: 'Kind boundary lines', text: 'Copy these. Boundaries sound warm when you say them with love.', lines: [
      'Auto-reply: "Thank you for your message! I answer between 9 AM and 7 PM, and I\'ll get back to you soon. 💛"',
      'On live: "Tonight is our last live of the week, ladies. I\'m resting Sunday so I can bring you my best Tuesday!"',
      'To a pushy buyer: "I want to get this right for you, so I\'ll look into it first thing in the morning."',
    ] },
    { kind: 'quiz', q: 'Which choice protects harmonious passion?', options: ['Answering every message within 5 minutes, day or night', 'Posting shop hours and taking one day a week fully off', 'Going live every night to keep up with bigger sellers', 'Skipping lunch to tag more stock'], answer: 1, why: "Rest and clear hours keep the work something you choose, not something that controls you. That's what lets you last." },
    { kind: 'checklist', title: 'Protect your spark', prompt: 'Tick what you will do this week.', items: ['Write my real why and put it where I see it', 'Sort my tasks into lights me up, neutral and drains me', 'Pick one draining task to automate, batch or hand off', 'Post my message hours', 'Choose my weekly day off', 'Start a "done" list of small wins'] },
  ],
}
export default lesson
