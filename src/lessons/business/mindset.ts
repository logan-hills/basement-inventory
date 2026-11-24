import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'mindset', kind: 'course', school: 'Mindset and motivation', title: 'The CEO mindset: grow your shop by growing you', track: 'Business', icon: 'heart',
  why: "Your shop can only grow as fast as you do. How you talk to yourself after a slow live decides whether you quit or come back stronger.",
  outcomes: [
    'Spot fixed-mindset thoughts and flip them into growth thoughts',
    'Treat every live, good or bad, as information you can use',
    'Talk to yourself like a coach, not a critic',
    'Run a 10-minute after-live review that builds skill, not shame',
    'Build a daily mindset habit that fits a busy life',
  ],
  route: { to: '/reports', label: 'Open Reports' },
  sources: [
    { org: 'Harvard Business Review (Carol Dweck, Stanford University)', title: 'What having a "growth mindset" actually means', url: 'https://hbr.org/2016/01/what-having-a-growth-mindset-actually-means' },
    { org: 'Stanford Center for Teaching and Learning', title: 'Growth mindset', url: 'https://ctl.stanford.edu/students/growth-mindset' },
    { org: 'Harvard Business Review (Serena Chen)', title: 'Give yourself a break: the power of self-compassion', url: 'https://hbr.org/2018/09/give-yourself-a-break-the-power-of-self-compassion' },
    { org: 'American Psychological Association', title: 'Building your resilience', url: 'https://www.apa.org/topics/resilience/building-your-resilience' },
  ],
  queen: {
    welcome: "Before we talk about inventory or marketing, we have to talk about you. The way you speak to yourself after a slow live decides what happens next. I made this course first in the Mindset school because everything else grows from here.",
    signoff: "Catch the thought, check it, change it. Do that every day this week, and watch how differently you show up on camera. The CEO of your shop starts in your own head.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Two mindsets', kind: 'learn', title: 'Fixed or growth?', nova: "Grab a cup of something warm, boss. This one is about the most important tool in your shop: your mind.",
      text: "Stanford psychologist Carol Dweck spent decades studying why some people grow after setbacks while others stall. She found two broad beliefs. With a fixed mindset, you believe your talent is set: you either have it or you don't. With a growth mindset, you believe skills grow with effort, good strategies and help from others.",
      table: { head: ['Moment', 'Fixed mindset says', 'Growth mindset says'], rows: [
        ['Slow live', '"I\'m just not good at this."', '"What can I change next time?"'],
        ['Another seller is booming', '"She\'s a natural. I\'ll never be that."', '"What is she doing that I can learn?"'],
        ['Tech is confusing', '"I\'m too old for this."', '"I don\'t know it YET. Let me take the lesson."'],
        ['Mean comment', '"They\'re right about me."', '"Is there anything useful here? If not, delete and keep going."'],
      ] } },
    { kind: 'learn', title: 'What growth mindset is NOT', text: "In Harvard Business Review, Dweck warned about a \"false growth mindset.\" It isn't just being positive, praising effort that isn't working, or saying \"I have a growth mindset\" and changing nothing. Effort only counts when it is paired with new strategies and asking for help.",
      points: ['Not: "Just try harder" with the same plan', 'Not: pretending a bad live was great', 'Yes: "That didn\'t work. Here\'s what I\'ll try instead, and who I\'ll ask."'],
      tip: 'Everyone is a mix of both mindsets. The goal is to notice your fixed-mindset triggers, not to feel bad about having them.' },
    { kind: 'tap', title: 'Spot the mindset', prompt: '"I don\'t know how to make Reels YET, so I\'m taking the Reels course this week." Which mindset is this?', screen: { title: 'Which one?', buttons: ['Fixed mindset', 'Growth mindset'] }, answer: 'Growth mindset', hint: 'The word YET plus a plan to learn is growth mindset in action.' },
    { kind: 'tap', title: 'Spot it again', prompt: '"Live selling works for younger women. People like me just aren\'t built for it." Which mindset?', screen: { title: 'Which one?', buttons: ['Fixed mindset', 'Growth mindset'] }, answer: 'Fixed mindset', hint: 'It treats ability as fixed by age or type. Plenty of sellers in their 50s, 60s and 70s are thriving on live.' },

    { chapter: 'Flip the script', kind: 'learn', title: 'Catch it, check it, change it', text: "The American Psychological Association's resilience advice includes learning to notice unhelpful thoughts and replace them with more balanced ones. Here's a three-step way to do it in the moment.",
      points: ['CATCH it: notice the thought ("I\'m a failure at this")', 'CHECK it: is it a fact, or a feeling? What would I tell a friend?', 'CHANGE it: say a truer, more useful thought ("That live was slow. My last three averaged 12 sales. I\'ll try an earlier poster.")'] },
    { kind: 'script', title: 'Flip lines to keep handy', text: 'Write your favorites on a sticky note by your live setup.', lines: [
      '"I can\'t do this" → "I can\'t do this YET."',
      '"That was a disaster" → "That was a lesson. What did it teach me?"',
      '"She\'s so much better than me" → "She\'s further along. I can learn from her."',
      '"Nobody showed up" → "Eight people showed up for me. Let\'s give them a great show."',
      '"I\'m too old for tech" → "I learned harder things than this. One step at a time."',
    ] },
    { queen: "Never judge your business on the night of a bad live. Sleep on it, then look at the numbers in the morning light.", kind: 'scenario', title: 'After a rough night', situation: 'You went live for an hour and sold 3 pieces. Last week you sold 19. You are tempted to post "Guess nobody wants my stuff anymore 😒" on your Page.',
      options: [
        { text: 'Post it. People should know how you feel.', feedback: "Buyers want to shop with confident sellers. Venting on your Page can push away the people who did show up." },
        { text: 'Take a breath, thank your 3 buyers, then check Reports and the live time to see what was different', best: true, feedback: "You protect your brand, honor your buyers, and treat the slow night as information. That's the CEO move." },
        { text: 'Decide live selling is not for you and stop', feedback: "One night is one data point. Most sellers have slow nights, even very successful ones." },
      ] },

    { chapter: 'The comparison trap', queen: "Every seller you admire has a messy basement and a slow Tuesday too. Compare yourself to last month's you, nobody else.", kind: 'learn', title: 'Her highlight reel vs your behind-the-scenes', text: "Scrolling past a seller with 900 viewers can flip you right into a fixed mindset. Remember what you are really comparing: her best moments, edited and posted, against your whole messy day. The only fair comparison is you against you, three months ago.",
      table: { head: ['Compare this', 'Not this'], rows: [
        ['Your viewers now vs 3 months ago', 'Your viewers vs a seller with 5 years\' head start'],
        ['Your buy rate this month vs last', 'Her best night ever'],
        ['Skills you have now that you didn\'t last year', 'Her team of four helpers'],
      ] },
      tip: 'If someone\'s posts make you feel small every time, mute them for a while. Follow sellers who teach, not just show off.' },
    { kind: 'scenario', title: 'The app update', situation: "You're 63. The app you use for invoices changed overnight, and nothing is where it used to be. Your live starts in two hours.",
      options: [
        { text: 'Decide technology has passed you by and cancel the live', feedback: "That's the fixed-mindset voice talking. Change is confusing for everyone, at every age." },
        { text: 'Take a breath, write down the 3 things you need to find, look for the help page or a short video, and ask your seller buddy if you are still stuck', best: true, feedback: "Growth mindset in action: a strategy, a resource and a helper. You'll be the one teaching it next week." },
        { text: 'Skip invoices tonight and figure it out later', feedback: "Late invoices mean late payments and confused buyers. Better to give it 20 focused minutes now." },
      ] },
    { kind: 'reflect', title: 'Your triggers', prompt: 'What usually sets off your fixed-mindset voice? (A slow live, tech, another seller, a comment, money?) Write your top two and the flip line you will use for each.', placeholder: 'Trigger 1… Flip line… Trigger 2… Flip line…', example: 'Trigger: a quiet first 10 minutes. Flip: "People are still arriving. Bring the energy." Trigger: big sellers on my feed. Flip: "She\'s further along. What can I learn?"' },

    { chapter: 'Coach, not critic', kind: 'learn', title: 'Self-compassion is a business skill', text: "Psychologist Serena Chen, writing in Harvard Business Review, summarized research showing that people who treat their own mistakes with kindness (not excuses, kindness) are more likely to take responsibility, learn and try again. Harsh self-talk makes people hide mistakes; kind self-talk helps them fix them.",
      points: ['Talk to yourself the way you would talk to your best friend', 'Remember everyone in business makes mistakes; you are not alone', 'Name the feeling ("I\'m disappointed") without being swallowed by it', 'Then ask: what is one thing I can do better next time?'] },
    { kind: 'quiz', q: 'You shipped a buyer the wrong necklace. Which response is self-compassion, not excuse-making?', options: ['"It\'s not my fault, my labels are confusing."', '"I\'m so careless. I always mess things up."', '"I made a mistake, and that happens. I\'ll fix it today and scan every item before packing from now on."', '"She should have checked her order sooner."'], answer: 2, why: 'Self-compassion owns the mistake kindly and moves straight to a fix. No blame, no beating yourself up.' },

    { chapter: 'The after-live review', kind: 'learn', title: '10 minutes that make you better', text: "Pro athletes review the game tape. You can review your live. Do it the same day, while it's fresh, and keep it short.",
      table: { head: ['Question', 'Example answer'], rows: [
        ['What went well?', 'The bag pitch landed. 6 sold in 2 minutes.'],
        ['What surprised me?', 'Earrings sold better than tops.'],
        ['What will I change?', 'Start with accessories, post the poster earlier.'],
        ['What did I learn about my buyers?', 'They love gold and want more under $20.'],
        ['What am I proud of?', 'I stayed upbeat even when it was slow.'],
      ] } },
    { kind: 'order', title: 'Review in order', prompt: 'Put the after-live review in a helpful order.', steps: ['Name what went well', 'Look at the numbers in Reports', 'Pick one thing to change', 'Write what you learned about buyers', 'Say what you are proud of'] },
    { kind: 'reflect', title: 'Your last live', prompt: 'Answer the five review questions for your most recent live (or your practice live).', placeholder: 'Went well… Surprised me… Will change… Learned… Proud of…', example: 'Went well: big opener. Surprised: bags outsold jewelry. Change: show prices bigger. Learned: they want sets. Proud: I didn\'t quit when the phone froze.' },

    { chapter: 'A daily habit', kind: 'learn', title: 'Five minutes a morning', text: "Mindset is like a muscle. A small daily habit beats a big burst once a month.",
      points: ['1 minute: one thing I am grateful for in my business', '1 minute: one thing I am learning right now', '1 minute: my one most important task today', '2 minutes: read one win from my "proof file" (kind messages, first sale, best live)'],
      tip: 'Start a proof file today: screenshots of kind comments and great nights. Read it before a hard live.' },
    { kind: 'checklist', title: 'Your mindset plan', prompt: 'Tick what you will do this week.', items: ['Put my flip lines on a sticky note by my setup', 'Add YET to one "I can\'t" sentence', 'Do the 10-minute review after my next live', 'Start a proof file of wins and kind words', 'Try the 5-minute morning habit for 7 days'] },
  ],
}
export default lesson
