import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'strategy1', kind: 'course', school: 'Strategy and growth', title: 'Strategic planning, part 1: know where you stand', track: 'Business', icon: 'trend',
  why: 'A strategy is the few big choices that decide everything else. It starts with an honest look at where you are today.',
  outcomes: [
    'Explain what strategic planning is, and how it\'s different from a to-do list',
    'Write a one-sentence mission and a 3-year vision for your shop',
    'Run a SWOT: your strengths, weak points, opportunities and threats',
    'Back up your SWOT with real numbers from Reports and Customers',
    'Pick the two or three issues that matter most this year',
  ],
  route: { to: '/reports', label: 'Open Reports' },
  sources: [
    { org: 'SCORE (SBA mentoring partner)', title: 'How to craft a strategic plan for your small business', url: 'https://www.score.org/resource/blog-post/how-craft-a-strategic-plan-your-small-business' },
    { org: 'U.S. Small Business Administration', title: 'Write your business plan', url: 'https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan' },
    { org: 'IMD Business School', title: 'SWOT analysis: how to do it, with examples', url: 'https://www.imd.org/reflections/swot-analysis-how-to-do-it-4-examples/' },
  ],
  queen: {
    welcome: "Strategy sounds like a big-company word, but it simply means choosing on purpose. This is how I want every seller to start planning: with an honest look at where you stand today.",
    signoff: "Your SWOT is the mirror, and your top three issues are the map. Bring them into part 2, and we'll turn them into goals.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'What strategy is', kind: 'learn', title: 'Strategy is choosing', nova: 'This is the course that sets the bar, boss. Get comfy. We\'re going to think like a CEO.',
      text: 'A to-do list says what you\'ll do today. A strategy says where your shop is going and what you will (and won\'t) do to get there. SCORE, the SBA\'s free mentoring partner, describes a strategic plan as your road map: where you are, where you want to be, and how you\'ll close the gap.',
      table: { head: ['', 'To-do list', 'Strategy'], rows: [
        ['Time frame', 'Today, this week', '1 to 3 years'],
        ['Question', 'What do I do next?', 'Where are we going, and why?'],
        ['Example', 'Post the poster, pack Tuesday\'s orders', 'Become the go-to live shop for church and event accessories in our region'],
        ['Says no to', 'Nothing', 'Anything that doesn\'t move the goal'],
      ] } },
    { kind: 'learn', title: 'The planning cycle', text: 'Strategic planning isn\'t a one-time document that sits in a drawer. It\'s a loop you run every year, with check-ins every quarter.',
      points: ['1. Know where you stand (this course): mission, vision, SWOT, numbers', '2. Choose where to go: 3 to 5 big goals', '3. Plan the moves: projects, owners, deadlines', '4. Review every quarter: what worked, what didn\'t, adjust', '5. Repeat each year'],
      tip: 'Part 2 of this series covers steps 2 through 5. Do part 1 first; the goals come out of what you find here.' },
    { kind: 'quiz', q: 'Which of these is a strategic choice, not a to-do?', options: ['Print tags for Monday\'s haul', 'Stop selling furniture and focus on accessories', 'Reply to Keisha\'s message'], answer: 1, why: 'Choosing what to focus on, and what to stop, shapes every week after. That\'s strategy.' },

    { chapter: 'Mission and vision', kind: 'learn', title: 'Mission: why you exist', text: 'Your mission is one sentence: who you serve, what you give them, and how it feels. It helps you say no to the wrong things.',
      table: { head: ['Weak', 'Strong'], rows: [
        ['We sell stuff online', 'We help busy women look put-together for every occasion, at prices that feel like a win'],
        ['Best deals ever!!!', 'Brand-name bargains, honest descriptions and fast shipping, served with a smile on every live'],
      ] } },
    { kind: 'learn', title: 'Vision: where you\'ll be', text: 'Your vision is a picture of your shop 3 years from now, with numbers. It should stretch you a little and excite you a lot.',
      example: 'In 3 years: two lives a week with 300 regular viewers, $8,000 profit a month, a 1,200 sq ft space with two part-time helpers, and our own label of signature handbags.' },
    { kind: 'reflect', title: 'Write yours', prompt: 'Write your mission in one sentence, then your 3-year vision with at least two numbers.', placeholder: 'Mission: … Vision: in 3 years…', example: 'Mission: we bring boutique style to everyday budgets. Vision: in 3 years, 250 regulars, $6,000 profit a month, and my sister running packing full time.' },

    { chapter: 'SWOT', queen: "Write the weaknesses you'd rather not say out loud. Those are the ones holding you back.", kind: 'learn', title: 'Four boxes, honest answers', text: 'SWOT is one of the most widely used strategy tools in business schools like IMD. Strengths and weaknesses are inside your shop (you control them). Opportunities and threats are outside (you respond to them).',
      table: { head: ['', 'Helpful', 'Harmful'], rows: [
        ['Inside your shop', 'Strengths: what you do better than most', 'Weaknesses: what holds you back'],
        ['Outside your shop', 'Opportunities: openings you could grab', 'Threats: things that could hurt you'],
      ] } },
    { kind: 'learn', title: 'A live seller\'s SWOT', text: 'Here\'s an example for a seller who goes live twice a week.',
      table: { head: ['Box', 'Examples'], rows: [
        ['Strengths', 'Big personality on camera; loyal regulars; great eye for designer bags; fast shipping'],
        ['Weaknesses', 'Stock is disorganized; no money tracking; lives start late; only one person packs'],
        ['Opportunities', 'Holiday season; Facebook Reels paying creators; a church conference in town; co-host swaps'],
        ['Threats', 'New sellers copying the format; price changes from suppliers; burnout; platform rule changes'],
      ] } },
    { kind: 'tap', title: 'Sort it', prompt: '"Our lives keep starting 20 minutes late." Which SWOT box does that belong in?', screen: { title: 'SWOT', buttons: ['Strength', 'Weakness', 'Opportunity', 'Threat'] }, answer: 'Weakness', hint: 'It\'s inside your shop and it hurts you, so it\'s a weakness. The good news: you control it.' },
    { kind: 'tap', title: 'Sort it again', prompt: '"A big new seller in our area just started doing $1 lives." Which box?', screen: { title: 'SWOT', buttons: ['Strength', 'Weakness', 'Opportunity', 'Threat'] }, answer: 'Threat', hint: 'It comes from outside and could hurt you. You can\'t control it, only respond to it.' },

    { chapter: 'Back it with numbers', queen: "When your feelings and your Reports disagree, trust the Reports, then ask why you felt differently.", kind: 'learn', title: 'Feelings vs facts', text: 'A SWOT built only on feelings can be wrong. Check every box against your numbers. The app already tracks most of them.',
      table: { head: ['Question', 'Where to check'], rows: [
        ['What sells best? (strength)', 'Reports: top sellers and top categories with % breakdown'],
        ['What doesn\'t sell? (weakness)', 'Home: old stock; Inventory filtered by age'],
        ['Who keeps coming back? (strength)', 'Customers: repeat buyers and VIPs'],
        ['Where does time go? (weakness)', 'Your value stream map from the lean course'],
        ['Are we profitable? (either!)', 'Reports and Home: profit by month'],
      ] } },
    { kind: 'scenario', title: 'The surprise in Reports', situation: 'You always thought clothing was your strength. Reports shows accessories were 62% of sales last quarter and clothing only 21%, with clothing taking most of your shelf space.',
      options: [
        { text: 'Ignore it; clothing is what you love', feedback: 'Passion matters, but your buyers are voting with their money. Ignoring it leaves profit on the table.' },
        { text: 'Write "accessories" as a strength and "clothing takes space but sells little" as a weakness, then decide in part 2 what to do', best: true, feedback: 'That\'s an honest SWOT. The numbers don\'t make the decision for you, but they make sure you decide with your eyes open.' },
        { text: 'Stop selling clothing tomorrow', feedback: 'Too fast. Finish the SWOT and set goals first. Maybe the fix is fewer, better clothing pieces.' },
      ] },
    { kind: 'number', title: 'Space vs sales', q: 'Clothing takes 60% of your shelves but brings in 21% of sales. Accessories take 25% of shelves and bring in 62%. How many times more sales per shelf does accessories earn than clothing? (Round to 1 decimal.)', answer: 7.1, tolerance: 0.15, suffix: '×', hint: 'Accessories: 62 ÷ 25. Clothing: 21 ÷ 60. Divide the first by the second.', why: '62 ÷ 25 = 2.48; 21 ÷ 60 = 0.35; 2.48 ÷ 0.35 ≈ 7.1. Each shelf of accessories earns about seven times what a shelf of clothing does. That\'s a strategic fact.' },

    { chapter: 'Pick what matters', kind: 'learn', title: 'From SWOT to strategic issues', text: 'Now connect the boxes. The best strategies use a strength to grab an opportunity, or fix a weakness before a threat exploits it.',
      table: { head: ['Combine', 'Ask', 'Example'], rows: [
        ['Strength + Opportunity', 'How do we use what we\'re great at to grab this?', 'Our designer-bag eye + holiday season = a "Designer Holiday" live series'],
        ['Weakness + Opportunity', 'What must we fix to grab this?', 'Disorganized stock blocks a bigger holiday push, so organize first'],
        ['Strength + Threat', 'How do our strengths protect us?', 'Loyal regulars + fast shipping beat cheaper new sellers'],
        ['Weakness + Threat', 'Where could we get hurt worst?', 'One person packing + holiday rush = burnout. Train a helper.'],
      ] } },
    { kind: 'reflect', title: 'Your top 3 issues', prompt: 'Look at your SWOT and the combinations. Write the 3 issues that matter most for your shop this year.', placeholder: '1… 2… 3…', example: '1. Lean into accessories, they earn 7× per shelf. 2. Organize stock before the holidays. 3. Train my cousin to pack so I don\'t burn out.' },
    { kind: 'checklist', title: 'Before part 2', prompt: 'Have these ready, then start Strategic planning, part 2.', items: ['My mission in one sentence', 'My 3-year vision with numbers', 'A full SWOT with at least 3 items per box', 'Each SWOT item checked against my numbers', 'My top 3 strategic issues'] },
  ],
}
export default lesson
