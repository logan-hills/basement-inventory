import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'growth', kind: 'course', school: 'Strategy and growth', title: 'Grow your audience and your sales', track: 'Business', icon: 'trend',
  why: 'More sales come from four levers: more viewers, more of them buying, bigger orders and buyers coming back. Pull all four.',
  outcomes: [
    'Use the sales equation to find your biggest growth lever',
    'Bring more viewers to every live without paying for ads',
    'Turn more watchers into buyers with clear claiming and real urgency',
    'Raise your average order with bundles and add-ons',
    'Track your numbers live by live and grow on purpose',
  ],
  route: { to: '/reports', label: 'Open Reports' },
  sources: [
    { org: 'U.S. Small Business Administration', title: 'Marketing and sales', url: 'https://www.sba.gov/business-guide/manage-your-business/marketing-sales' },
    { org: 'HubSpot Academy', title: 'Facebook marketing training (free)', url: 'https://academy.hubspot.com/courses/facebook-marketing-training' },
    { org: 'Harvard Business School Working Knowledge', title: 'The right way to manage churn for maximum profit', url: 'https://www.library.hbs.edu/working-knowledge/the-right-way-to-manage-churn-for-maximum-profit' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'The sales equation', kind: 'learn', title: 'Four numbers make your sales', nova: 'Growing isn\'t luck, boss. It\'s four numbers, and you can move every one of them.',
      text: 'Every live\'s sales come from the same simple math. If you know your four numbers, you know exactly where to push.',
      table: { head: ['Number', 'What it means', 'Where to find it'], rows: [
        ['Viewers', 'People who watched the live', 'Your Facebook or TikTok live stats'],
        ['Buy rate', 'Share of viewers who bought', 'Buyers ÷ viewers'],
        ['Average order', 'Dollars per buyer', 'Reports: sales ÷ orders'],
        ['Come-back rate', 'Buyers who buy again next month', 'Customers page'],
      ] },
      example: '120 viewers × 20% buy rate × $28 average order = $672 for the live. Raise each number by just 10% and that live becomes about $894. Small moves multiply.' },
    { kind: 'number', title: 'Run the equation', q: 'A live had 80 viewers, 25% of them bought, and the average order was $30. What were the sales?', prefix: '$', answer: 600, hint: '80 × 0.25 = buyers. Buyers × $30.', why: '80 × 0.25 = 20 buyers × $30 = $600. Now you can ask: is my weakest number viewers, buy rate or order size?' },
    { kind: 'reflect', title: 'Your four numbers', prompt: 'Look at your last live. Write your viewers, buyers, sales and orders. Which number looks weakest?', placeholder: 'Viewers… Buyers… Average order…', example: '90 viewers, 14 buyers (16%), $380 sales, $27 average. My buy rate is the weakest.' },

    { chapter: 'More viewers', kind: 'learn', title: 'Fill the room before you go live', text: 'Most viewers decide to show up before the live starts. The SBA\'s marketing advice applies here: know your customer, reach her where she already is, and repeat your message.',
      points: ['Same days, same time, every week. Habit is your best marketing.', 'Post a poster 2 days before and again 2 hours before', 'Post one Reel or short video of your best piece the day before', 'Ask regulars to tap "Share" in the first 5 minutes; tell them why it matters', 'Go live on time. Late starts train people to show up late, or not at all.'] },
    { kind: 'learn', title: 'Borrow audiences', text: 'The fastest way to grow is to get in front of people who already trust someone else.',
      table: { head: ['Move', 'How it works', 'Effort'], rows: [
        ['Co-host swap', 'Two sellers with different products each guest on the other\'s live', 'Low'],
        ['Shared Page slots', 'Go live on the community Page with its built-in followers', 'Low'],
        ['Facebook groups', 'Be helpful in groups your buyers already join; share lives where rules allow', 'Medium'],
        ['Giveaway with a partner', 'Each of you promotes; entrants follow both pages', 'Medium'],
      ] },
      tip: 'Giveaways must follow each platform\'s promotion rules, and partners who get paid or gifted must clearly disclose it (see the FTC\'s Disclosures 101).' },
    { kind: 'scenario', title: 'Viewers are flat', situation: 'Your lives have stuck at about 60 viewers for two months. You post the poster only the morning of the live.',
      options: [
        { text: 'Go live more often, every day', feedback: 'More lives with the same reach can spread the same 60 people thinner and wear you out.' },
        { text: 'Post the poster 2 days ahead and 2 hours before, add a Reel the day before, and book one co-host swap this month', best: true, feedback: 'You\'re reaching people earlier, more often and through a new audience. That\'s how the number moves.' },
        { text: 'Buy a big ad without a plan', feedback: 'Ads can help, but without a clear offer and a way to measure, it\'s money out the window.' },
      ] },

    { chapter: 'More buyers', kind: 'learn', title: 'Make it easy to say yes', text: 'Viewers who don\'t buy usually didn\'t understand how, didn\'t feel a reason to act now, or didn\'t see enough of the piece.',
      points: ['Say the claim rule every 10 minutes: "Type SOLD and the Live number"', 'Show the Live number big on screen and on the card', 'Show every piece three ways: close-up, on you, and the price', 'Use real urgency only: "I have 3" is true; fake countdowns lose trust', 'Let the comment bot catch every claim so nobody gets missed in a fast live'] },
    { kind: 'script', title: 'The 30-second piece pitch', text: 'Use this rhythm for every piece. It keeps lives moving and buyers clear.', lines: [
      'HOOK: "Ladies, look at this gold. It\'s giving church-to-brunch."',
      'SHOW: close-up, then on you, then turn it in the light.',
      'VALUE: "Retail on this is around $60. Tonight it\'s $22."',
      'HOW: "Type SOLD 4821. That\'s SOLD four-eight-two-one."',
      'SCARCITY (only if true): "I have three of these."',
      'CLOSE: "Sold to Keisha! Two left. Next up…"',
    ] },
    { kind: 'number', title: 'Buy rate', q: 'You had 150 viewers and 27 buyers. What\'s your buy rate in percent?', answer: 18, tolerance: 0.2, suffix: '%', hint: '27 ÷ 150 × 100.', why: '27 ÷ 150 = 18%. Track it every live. Clearer claiming and better showing can push it past 20%.' },

    { chapter: 'Bigger orders', kind: 'learn', title: 'Bundles and add-ons', text: 'It\'s easier to sell one more piece to someone already buying than to find a new buyer.',
      table: { head: ['Idea', 'Example', 'Why it works'], rows: [
        ['Bundle', 'Earrings + matching necklace, $35 instead of $40', 'One decision, a better deal'],
        ['Add-on table', '$5 pieces shown between big items', 'Easy yes for someone already buying'],
        ['Free shipping line', 'Free shipping on $75+', 'People add a piece to reach it'],
        ['Complete the look', 'Show the bag with the outfit', 'Helps her picture the whole thing'],
      ] } },
    { kind: 'number', title: 'Add-on math', q: 'You have 30 buyers in a live. If 1 in 3 adds a $6 add-on piece, how much extra do you make?', prefix: '$', answer: 60, hint: '30 ÷ 3 = 10 buyers × $6.', why: '10 × $6 = $60 a live. At two lives a week, that\'s over $6,000 a year from little $6 pieces.' },

    { chapter: 'Keep them coming back', kind: 'learn', title: 'Regulars are your engine', text: 'Research summarized by Harvard Business School shows keeping customers usually costs less than finding new ones, and loyal buyers often spend more over time. In live selling, regulars also comment, share and bring friends.',
      points: ['Say regulars\' names and remember what they love', 'Send a thank-you after a first order', 'Keep a VIP list in Customers and give them early looks', 'Fix problems fast and warmly (see Customer care courses)'] },
    { kind: 'learn', title: 'Use the comment bot to catch every sale', text: 'In a fast live, missed claims are lost sales and upset buyers. The comment bot reads claims like "SOLD 4821" as they come in, so you can keep selling instead of scrolling.',
      points: ['Open your live, tap Comment bot, and connect before you go live', 'Say the claim format often so the bot (and buyers) get it right', 'Glance at the bot\'s list between pieces to confirm sold-outs', 'After the live, turn the claims into orders in one step'],
      tip: 'The "Let the comment bot take the orders" lesson in Orientation walks through every button.' },
    { kind: 'scenario', title: 'Big night, missed claims', situation: 'Your best live ever: 220 viewers. Afterward, 9 buyers message that their claims were missed while you were reading comments by hand.',
      options: [
        { text: 'Apologize and hope it doesn\'t happen again', feedback: 'It will happen again, and on your best nights. Growth needs a system.' },
        { text: 'Honor the claims you can, apologize warmly, and run the comment bot on every live from now on', best: true, feedback: 'You fix the moment and the system. Bigger audiences need automation.' },
        { text: 'Tell viewers to comment slower', feedback: 'Excited buyers don\'t slow down, and you don\'t want them to.' },
      ] },
    { kind: 'reflect', title: 'Your lever', prompt: 'Which of the four levers (viewers, buy rate, average order, come-back rate) will you work on first, and with which two moves?', placeholder: 'Lever… Move 1… Move 2…', example: 'Average order. Move 1: a $5 add-on table. Move 2: bundles for earrings and necklaces.' },
    { kind: 'checklist', title: 'Your growth plan', prompt: 'Pick what you\'ll do in the next 30 days.', items: ['Write my four numbers after every live', 'Post the poster 2 days and 2 hours ahead', 'Book one co-host swap or shared Page slot', 'Use the 30-second pitch for every piece', 'Add a $5 add-on table to my next live', 'Start a VIP list from my top 20 buyers'] },
  ],
}
export default lesson
