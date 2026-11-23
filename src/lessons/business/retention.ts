import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'retention', kind: 'course', school: 'Customer care', title: 'Keep customers for life', track: 'Business', icon: 'users',
  why: 'Regulars are the heart of a live business. Research from Bain, Harvard Business School and MIT Sloan shows why keeping them pays, and how to do it.',
  outcomes: [
    'Explain why keeping buyers is worth more than finding new ones, with the research behind it',
    'Work out what a loyal buyer is worth to your shop over a year',
    'Spot buyers who are drifting away before they\'re gone',
    'Turn a problem into a stronger relationship with a proven recovery routine',
    'Build a simple VIP and follow-up system that runs every week',
  ],
  route: { to: '/customers', label: 'Open Customers' },
  sources: [
    { org: 'Bain & Company, Frederick Reichheld', title: 'Prescription for cutting costs: loyal relationships', url: 'https://media.bain.com/Images/BB_Prescription_cutting_costs.pdf' },
    { org: 'Harvard Business School Working Knowledge', title: 'The right way to manage churn for maximum profit', url: 'https://www.library.hbs.edu/working-knowledge/the-right-way-to-manage-churn-for-maximum-profit' },
    { org: 'Harvard Business School Working Knowledge', title: 'A smarter way to reduce customer defections', url: 'https://www.library.hbs.edu/working-knowledge/a-smarter-way-to-reduce-customer-defections' },
    { org: 'MIT Sloan Management Review', title: 'Recovering and learning from service failure', url: 'https://sloanreview.mit.edu/article/recovering-and-learning-from-service-failure' },
    { org: 'MIT Sloan Management Review', title: 'What unhappy customers want', url: 'https://sloanreview.mit.edu/article/what-unhappy-customers-want' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Why regulars matter', kind: 'learn', title: 'The research on loyalty', nova: 'Your regulars aren\'t just buyers, boss. They\'re your hype team, your word of mouth and your steady paycheck.',
      text: 'Frederick Reichheld of Bain & Company, who created the Net Promoter Score, studied loyalty across industries. His widely cited finding: raising customer retention by just 5 percentage points raised profits by 25% to 95% in the businesses studied. Why so much? Loyal customers tend to buy more over time, cost less to serve, and send friends your way.',
      points: ['They already trust you, so they buy faster', 'They spend more as they get to know your style', 'They need less explaining: they know the claim rules and pay on time', 'They bring friends, which costs you nothing'],
      tip: 'Those numbers came from large businesses. The lesson still holds for a small shop: keeping a buyer usually costs far less than finding a new one.' },
    { kind: 'learn', title: 'Not every buyer is the same', text: 'Harvard Business School research on churn (customers leaving) adds a smart twist: the goal isn\'t to keep everyone at any cost. It\'s to focus your effort on the buyers who are both likely to leave and worth keeping. A small, well-aimed effort beats discounts thrown at everyone.',
      table: { head: ['Buyer type', 'What to do'], rows: [
        ['Loyal and happy', 'Thank them, give early looks, ask for referrals'],
        ['Valuable but drifting', 'Reach out personally, this is where effort pays most'],
        ['New, first order', 'Make the first experience great so she comes back'],
        ['Always unhappy, always returning', 'Be kind and fair, but don\'t bend your rules to keep her'],
      ] } },
    { kind: 'quiz', q: 'According to the Harvard research on churn, where should you put most of your retention effort?', options: ['Big discounts for every buyer', 'Buyers who are valuable and showing signs of leaving', 'Only brand-new buyers'], answer: 1, why: 'Effort pays most where a buyer is worth keeping and might leave. Blanket discounts mostly reward people who would have stayed anyway.' },

    { chapter: 'What a buyer is worth', kind: 'learn', title: 'Customer lifetime value, the simple way', text: 'Customer lifetime value (CLV) is what a buyer is worth to you over time, not just today. Business schools teach long formulas, but a live seller can use a simple one.',
      table: { head: ['Piece', 'Example'], rows: [
        ['Average order', '$32'],
        ['Orders per month', '2'],
        ['Months she keeps buying', '12'],
        ['Profit margin', '50%'],
        ['Profit from her in a year', '$32 × 2 × 12 × 50% = $384'],
      ] },
      example: 'When a $384-a-year buyer has a $6 problem, the right move is obvious: fix it generously.' },
    { kind: 'number', title: 'Work out a regular', q: 'A regular\'s average order is $25, she buys 3 times a month, and your margin is 40%. What profit does she bring in a year?', prefix: '$', answer: 360, hint: '$25 × 3 × 12, then × 0.40.', why: '$25 × 3 × 12 = $900 in sales; 40% of that is $360 profit. Now picture losing her over a $4 shipping mix-up.' },

    { chapter: 'Spot drifting buyers', kind: 'learn', title: 'The warning signs', text: 'Buyers rarely announce they\'re leaving. They just fade. The HBS work on reducing defections shows that acting early, while she\'s still reachable, works far better than trying to win her back later.',
      points: ['She used to buy every week and hasn\'t in a month', 'She watches but stops commenting', 'She left one unhappy comment and went quiet', 'She stopped opening your messages or group posts', 'Her orders are getting smaller'],
      tip: 'The Customers page shows each buyer\'s last order date. Sort by it once a week and look at your regulars who haven\'t bought in 30 days.' },
    { kind: 'script', title: 'The "we miss you" message', text: 'Personal beats promotional. Send this to drifting regulars, by name, one at a time.', lines: [
      '"Hey Denise! I haven\'t seen you on live in a minute and I miss your comments."',
      '"I just got in a gold set that made me think of you, it\'s very you."',
      '"I\'m going live Thursday at 8. I\'ll hold it for you until 9 if you want first look!"',
      '"Hope you\'re doing well either way 💛"',
    ], tip: 'No guilt, no pressure, no big discount. A real note from a real person is the whole point.' },
    { kind: 'scenario', title: 'A top buyer goes quiet', situation: 'Shonda bought almost every week for six months. You realize she hasn\'t bought in five weeks. Her last order arrived with a broken clasp, and she mentioned it but you were busy.',
      options: [
        { text: 'Send a 20%-off code to your whole list', feedback: 'That doesn\'t touch the real problem, and it trains everyone to wait for discounts.' },
        { text: 'Message her personally: apologize for the clasp, offer to fix or refund it, and invite her to Thursday\'s live', best: true, feedback: 'Right. You fix the real cause, show her she matters, and give her a reason to come back.' },
        { text: 'Wait and hope she comes back', feedback: 'Drifting buyers rarely come back on their own. The earlier you reach out, the better your odds.' },
      ] },

    { chapter: 'Turn problems into loyalty', kind: 'learn', title: 'What unhappy customers want', text: 'Research published in MIT Sloan Management Review on service failures found that how a business handles a complaint shapes loyalty more than the problem itself. Customers judge three things: was the outcome fair, was the process quick and easy, and was I treated with respect?',
      table: { head: ['What they judge', 'What it looks like for you'], rows: [
        ['A fair outcome', 'Refund, replacement or credit that matches the problem'],
        ['An easy process', 'One message from her, you handle the rest; no forms, no runaround'],
        ['Respect', 'A real apology, by name, without blaming her or the post office'],
      ] } },
    { kind: 'order', title: 'The recovery routine', prompt: 'A buyer messages that her necklace arrived tangled and broken. Put your recovery steps in order.', steps: ['Reply fast and thank her for telling you', 'Apologize by name without making excuses', 'Offer a fair fix: replacement, refund or credit', 'Make it easy: no need to mail it back for a small piece', 'Follow through the same day', 'Check in after the fix arrives'] },
    { kind: 'learn', title: 'Learn from every complaint', text: 'The same MIT Sloan research stresses learning from failures, not just fixing them one by one. Keep a simple problem log. When the same problem shows up twice, fix the cause, using the "5 whys" from the lean course.',
      points: ['Write down every complaint: date, buyer, what happened', 'Once a month, look for patterns', 'Broken clasps twice? Wrap clasps in tissue or check them before packing', 'Late shipping twice? Change your ship-by promise or your pack day'] },

    { chapter: 'Build the system', kind: 'learn', title: 'A VIP circle', text: 'Loyalty programs work best when they feel personal, not like a points card. For a live seller, a VIP circle is simple.',
      points: ['Your top 20 buyers by spending over the last 3 months', 'First look: a sneak peek photo the day before each live', 'A birthday note (ask for the month only, never the full date of birth)', 'A thank-you handwritten card every few orders', 'Ask them what they want you to find next'],
      tip: 'Keep your VIP list in the Customers page so it\'s always up to date and anyone helping you can see it.' },
    { kind: 'learn', title: 'The weekly loyalty hour', text: 'Retention isn\'t a one-time project. Block one hour a week.',
      table: { head: ['Minutes', 'Task'], rows: [
        ['10', 'Sort Customers by last order; list regulars quiet for 30+ days'],
        ['20', 'Send personal "we miss you" messages'],
        ['10', 'Send first-order thank-yous to new buyers'],
        ['10', 'Check the problem log for patterns'],
        ['10', 'Post the VIP sneak peek for the next live'],
      ] } },
    { kind: 'number', title: 'Win back the math', q: 'You message 10 drifting regulars a month and 3 come back. Each is worth about $300 profit a year. What\'s that hour a week worth over a year, in profit, if you win back 3 every month for 12 months? (Count each buyer\'s full $300.)', prefix: '$', answer: 10800, hint: '3 buyers × 12 months = 36 buyers. Then × $300.', why: '36 × $300 = $10,800. Even if your real numbers are half that, one hour a week is some of the best-paid time in your business.' },
    { kind: 'learn', title: 'Case study: the first-order thank-you', text: 'Here\'s an example of a small habit that compounds. A seller started sending every first-time buyer a short thank-you message with a photo of her order being packed.',
      table: { head: ['Before', 'After 3 months'], rows: [
        ['About 1 in 4 first-time buyers came back', 'About 2 in 5 came back'],
        ['New buyers rarely commented', 'New buyers said hi by name on the next live'],
        ['No idea why some never returned', 'A few replied with feedback she could act on'],
      ] },
      tip: 'An example to show how the habit works. Track your own come-back rate on the Customers page before and after.' },
    { kind: 'reflect', title: 'Your loyalty plan', prompt: 'Name three regulars you\'ll reach out to this week, and one thing you\'ll add for your VIPs.', placeholder: 'Regulars… VIP perk…', example: 'Denise, Shonda and Pat haven\'t bought in a month. VIP perk: a sneak peek photo in a private group the night before every live.' },
    { kind: 'checklist', title: 'Keep them for life', prompt: 'Tick what you\'ll start this month.', items: ['Work out what my average regular is worth in a year', 'Sort Customers by last order every week', 'Send personal "we miss you" messages', 'Use the recovery routine for every problem', 'Start a problem log', 'Start a VIP circle of my top 20', 'Send a thank-you after every first order'] },
  ],
}
export default lesson
