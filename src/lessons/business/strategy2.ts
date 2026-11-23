import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'strategy2', kind: 'course', school: 'Strategy and growth', title: 'Strategic planning, part 2: set goals and fix weak spots', track: 'Business', icon: 'trend',
  why: 'A plan only works if it turns into goals, owners, deadlines and a habit of checking in. This is where the bar gets set.',
  outcomes: [
    'Turn your top issues into 3 to 5 SMART goals for the year',
    'Break each goal into quarterly projects and weekly actions',
    'Use root-cause thinking to fix a weak point for good',
    'Track a handful of key numbers on a one-page scorecard',
    'Run a 60-minute quarterly review and adjust the plan',
  ],
  route: { to: '/reports', label: 'Open Reports' },
  sources: [
    { org: 'SCORE (SBA mentoring partner)', title: 'How to craft a strategic plan for your small business', url: 'https://www.score.org/resource/blog-post/how-craft-a-strategic-plan-your-small-business' },
    { org: 'U.S. Small Business Administration', title: 'Write your business plan', url: 'https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan' },
    { org: 'Lean Enterprise Institute', title: 'Lean lexicon (PDCA, root cause)', url: 'https://www.lean.org/explore-lean/lexicon-terms/' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Goals that work', kind: 'learn', title: 'Make them SMART', nova: 'Bring your part 1 workbook. We\'re turning it into a plan you can actually follow.',
      text: 'A wish says "I want to grow." A goal says exactly what, by how much, and by when. A common way to check a goal is SMART.',
      table: { head: ['Letter', 'Means', 'Question'], rows: [
        ['S', 'Specific', 'What exactly?'],
        ['M', 'Measurable', 'What number tells me I made it?'],
        ['A', 'Achievable', 'Can I really do it with my time and money?'],
        ['R', 'Relevant', 'Does it fix one of my top issues?'],
        ['T', 'Time-bound', 'By when?'],
      ] },
      example: 'Wish: "Sell more accessories." SMART: "Grow accessories from 62% to 75% of sales by June 30 by moving accessories to the golden zone and running a weekly accessories-only live."' },
    { kind: 'quiz', q: 'Which goal is SMART?', options: ['Be the best shop on Facebook', 'Get more viewers soon', 'Average 150 viewers per live by March 31 with posters 2 days ahead and two co-host swaps a month'], answer: 2, why: 'It has a number (150), a date (March 31) and the moves to get there.' },
    { kind: 'learn', title: 'Fewer goals, done well', text: 'Most small businesses do best with 3 to 5 goals for the year. More than that and nothing gets enough attention. Cover the areas that match your top issues.',
      table: { head: ['Area', 'Example goal'], rows: [
        ['Sales', 'Average $900 per live by Q2'],
        ['Profit', 'Keep 35% profit margin every month'],
        ['Customers', 'Grow repeat buyers from 30% to 45% of orders'],
        ['Operations', 'Pack any live in under 2 hours, 99% accuracy'],
        ['You', 'Take one full day off every week'],
      ] } },

    { chapter: 'From goals to moves', kind: 'learn', title: 'Year, quarter, week', text: 'Big goals get done in small pieces. Break each one into quarterly projects, and each project into weekly actions you can put on your calendar.',
      table: { head: ['Level', 'Example'], rows: [
        ['Year goal', 'Grow repeat buyers to 45% of orders'],
        ['Q1 project', 'Launch a VIP list and early-look lives'],
        ['Q2 project', 'Start a thank-you and follow-up routine'],
        ['This week', 'Pull my top 40 buyers from Customers and write the VIP invite'],
      ] },
      tip: 'Every project needs one owner and one deadline. "We" doesn\'t own anything; a name does.' },
    { kind: 'order', title: 'Build the ladder', prompt: 'Put these from biggest to smallest.', steps: ['3-year vision', 'This year\'s goal', 'This quarter\'s project', 'This week\'s action', 'Today\'s task'] },
    { kind: 'reflect', title: 'Your first goal', prompt: 'Turn your #1 strategic issue from part 1 into a SMART goal. Then write the Q1 project and this week\'s first action.', placeholder: 'Goal… Q1 project… This week…', example: 'Goal: accessories to 75% of sales by June 30. Q1: re-slot accessories into the golden zone and launch a Thursday accessories live. This week: move the jewelry rack next to the packing table.' },

    { chapter: 'Fix the weak spots', kind: 'learn', title: 'Weak points have causes', text: 'A weak point keeps coming back until you fix its cause. Use the "5 whys" from the lean course, then pick a fix you control.',
      points: ['Weak point: lives start late', 'Why? Pieces aren\'t pulled in time', 'Why? Pulling takes 2 hours', 'Why? Half the stock has no bin address', 'Why? New hauls get stacked on the floor', 'Fix: tag and shelve every haul within 48 hours, and pull the night before'] },
    { kind: 'learn', title: 'Pick the right kind of fix', text: 'Not every weak point is worth the same effort. Sort fixes by impact and effort, and start in the top-left box.',
      table: { head: ['', 'Low effort', 'High effort'], rows: [
        ['High impact', 'DO NOW (quick wins)', 'PLAN IT (make it a quarterly project)'],
        ['Low impact', 'FIT IN when there\'s time', 'SKIP for now'],
      ] },
      example: 'Starting lives on time: high impact, low effort, so do it now. Moving to a bigger space: high impact, high effort, so plan it as a Q3 project.' },
    { kind: 'scenario', title: 'Two weak points', situation: 'Your SWOT shows two weak points: you don\'t track money (you\'re not sure you\'re profitable), and your posters look plain. You have about 3 extra hours a week.',
      options: [
        { text: 'Spend the hours on gorgeous posters first', feedback: 'Better posters may bring viewers, but if you\'re losing money on each sale, more sales means losing more.' },
        { text: 'Fix money tracking first: record costs and check profit weekly in Reports. Then use the Planner\'s poster maker as a quick win.', best: true, feedback: 'Know your profit first, it affects every other decision. The poster maker is a low-effort fix you can fit in alongside it.' },
        { text: 'Try to fix both completely this week', feedback: 'Doing two big fixes at once in 3 hours usually means finishing neither.' },
      ] },

    { chapter: 'Your scorecard', kind: 'learn', title: 'One page, a few numbers', text: 'Pick 5 to 7 numbers that tell you if the plan is working, and look at them every week. Most come straight from the app.',
      table: { head: ['Number', 'Where', 'Target example'], rows: [
        ['Sales per live', 'Reports', '$900'],
        ['Profit margin', 'Reports', '35%'],
        ['Viewers per live', 'Facebook live stats', '150'],
        ['Repeat buyers', 'Customers', '45%'],
        ['Hours to pack a live', 'Your timer', 'Under 2'],
        ['Old stock (90+ days)', 'Home', 'Under 15%'],
      ] } },
    { kind: 'number', title: 'Are you on pace?', q: 'Your goal is $10,800 in sales this quarter (13 weeks). After 6 weeks you\'re at $4,500. To hit the goal, how much do you need per week for the last 7 weeks? (Round to the nearest dollar.)', prefix: '$', answer: 900, tolerance: 1, hint: '$10,800 − $4,500 = what\'s left. Divide by 7.', why: '$6,300 ÷ 7 = $900 a week. Now you know exactly what each week needs, instead of hoping.' },

    { chapter: 'Review and adjust', kind: 'learn', title: 'The quarterly review', text: 'Once a quarter, take 60 minutes with your scorecard. SCORE mentors recommend revisiting your plan regularly instead of filing it away. Use the same agenda every time.',
      points: ['10 min: what did we hit, what did we miss? (scorecard)', '15 min: why? Celebrate wins, find causes for misses', '15 min: update the SWOT: anything new outside or inside?', '15 min: next quarter\'s 2 or 3 projects, with owners and deadlines', '5 min: put the next review on the calendar'] },
    { kind: 'script', title: 'Your one-page plan', text: 'Copy this onto one page and keep it where you pack.', lines: [
      'MISSION: ______________________',
      'VISION (3 years): ______________',
      'THIS YEAR\'S GOALS (3 to 5, SMART): 1.___ 2.___ 3.___',
      'THIS QUARTER\'S PROJECTS (owner, deadline): ___',
      'SCORECARD NUMBERS + TARGETS: ___',
      'NEXT REVIEW DATE: ___',
    ], tip: 'Get a free SCORE mentor to look it over. It\'s one of the best free resources a small business has.' },
    { kind: 'learn', title: 'Case study: a plan that worked', text: 'Here\'s how one seller turned a SWOT into a year plan.',
      table: { head: ['From part 1', 'Became'], rows: [
        ['Strength: designer-bag eye', 'Goal: designer bags at 40% of sales by Q3'],
        ['Weakness: lives start late', 'Q1 project: pull pieces the night before; owner: me'],
        ['Opportunity: holiday season', 'Q4 project: a 4-week "Designer Holiday" series'],
        ['Threat: burnout', 'Goal: one full day off a week; train a packer by March'],
      ] },
      example: 'By the end of the year she hit 37% designer bags (not quite 40%), started every live on time, and took Sundays off. Missing one target by a little still moved the whole shop forward.' },
    { kind: 'scenario', title: 'The missed quarter', situation: 'At your Q2 review, sales are 20% below target. Viewers were steady, but your buy rate dropped from 20% to 14%.',
      options: [
        { text: 'Lower the yearly goal right away', feedback: 'Maybe later. First find out why the buy rate fell. The goal might still be reachable.' },
        { text: 'Use 5 whys on the buy-rate drop, pick a fix as a Q3 project, and keep the goal for now', best: true, feedback: 'You treat the miss as information. Often it\'s something fixable, like unclear claiming or prices that crept up.' },
        { text: 'Add three new goals to make up for it', feedback: 'More goals spread you thinner. Fix the one number that slipped.' },
      ] },
    { kind: 'reflect', title: 'Your scorecard', prompt: 'Write the 5 numbers you\'ll track every week, with a target for each.', placeholder: '1… 2… 3… 4… 5…', example: 'Sales per live $900; margin 35%; viewers 150; repeat buyers 45%; pack time under 2 hours.' },
    { kind: 'checklist', title: 'Lock it in', prompt: 'Tick what you\'ll finish in the next two weeks.', items: ['Write 3 to 5 SMART goals from my top issues', 'Break each into Q1 projects with owners and deadlines', 'Sort my weak points into do now / plan it / fit in / skip', 'Make a one-page scorecard and check it weekly', 'Put my first quarterly review on the calendar', 'Book a free SCORE mentor session'] },
  ],
}
export default lesson
