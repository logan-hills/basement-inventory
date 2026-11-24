import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'finance', kind: 'course', school: 'Money and buying', title: 'Manage your money like a CEO', track: 'Business', icon: 'dollar',
  why: 'Sales feel good, but profit and cash are what keep the lights on. Know your numbers and you make every decision with confidence.',
  outcomes: [
    'Tell the difference between sales, profit and cash',
    'Work out your true profit per piece, after every cost',
    'Price for a healthy margin, not just "what feels fair"',
    'Run a simple monthly money routine with buckets for stock, taxes, you and growth',
    'Read three money reports and act on them',
  ],
  route: { to: '/reports', label: 'Open Reports' },
  sources: [
    { org: 'U.S. Small Business Administration', title: 'Manage your finances', url: 'https://www.sba.gov/business-guide/manage-your-business/manage-your-finances' },
    { org: 'SCORE (SBA mentoring partner)', title: 'Business planning and financial statements templates', url: 'https://www.score.org/resource/business-plan-template-established-business' },
    { org: 'IRS', title: 'Estimated taxes', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes' },
  ],
  queen: {
    welcome: "Sales feel good, but profit and cash keep the lights on. I want every seller of mine to know her numbers, because when you know your numbers, you make every decision with confidence.",
    signoff: "Split every payout into buckets, hold your money hour every month, and pay yourself on purpose. That's how a CEO runs her money.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Three different numbers', kind: 'learn', title: 'Sales, profit, cash', nova: 'Money talk! This is where hobby shops and real businesses part ways. You\'ve got this.',
      text: 'Lots of sellers watch only sales. But a $2,000 live can lose money, and a profitable month can still leave you with no cash to buy stock.',
      table: { head: ['Number', 'What it is', 'The question it answers'], rows: [
        ['Sales', 'Everything buyers paid', 'Are people buying?'],
        ['Profit', 'Sales minus every cost', 'Am I actually making money?'],
        ['Cash', 'Money in the bank right now', 'Can I pay for the next haul and my bills?'],
      ] } },
    { kind: 'quiz', q: 'You had $3,000 in sales this month, but you spent $3,200 on a big haul that hasn\'t sold yet. What\'s most likely true?', options: ['You lost money this month', 'Your profit may be fine, but your cash is tight', 'Sales and cash are the same thing'], answer: 1, why: 'Unsold stock is still worth money (it\'s inventory), so profit may be fine. But your cash went into the shelves, so you need to watch it.' },

    { chapter: 'True profit per piece', kind: 'learn', title: 'Every cost counts', text: 'Your real profit on a piece is the price minus everything it took to sell it.',
      table: { head: ['Item', 'Amount'], rows: [
        ['Sale price', '$28.00'],
        ['What you paid for it', '− $9.00'],
        ['Payment fee (about 3%)', '− $0.84'],
        ['Shipping you didn\'t charge for', '− $1.50'],
        ['Mailer, tissue, tag, thank-you card', '− $0.90'],
        ['True profit', '$15.76 (56% margin)'],
      ] } },
    { kind: 'number', title: 'Your margin', q: 'A scarf sells for $20. It cost you $6, fees are $0.60, and packing is $0.80. What\'s your profit margin in percent? (Profit ÷ price × 100)', answer: 63, tolerance: 0.5, suffix: '%', hint: '$20 − $6 − $0.60 − $0.80 = profit. Divide by $20.', why: '$20 − $7.40 = $12.60 profit. $12.60 ÷ $20 = 63%. Healthy!' },
    { kind: 'learn', title: 'Price on purpose', text: 'Many resale boutiques aim for the price to be at least 2.5 to 3 times what they paid, so there\'s room for fees, supplies, sales and slow movers. Start there, then adjust for the brand, condition and what buyers will pay.',
      points: ['Cost × 3 is a good starting point for most pieces', 'Designer and rare pieces can go higher', 'Price endings matter less than clarity; keep it simple on live', 'Never price below cost + fees + packing, except to clear very old stock'] },

    { chapter: 'Where the money goes', queen: "Name your buckets: Stock, Taxes, Bills, Me, Cushion. Names make the money harder to borrow from.", kind: 'learn', title: 'Buckets, not one pile', text: 'One bank balance makes it easy to spend tax money or stock money by accident. Split every payout into buckets. The SBA recommends separate business accounts; many owners add savings "buckets" too.',
      table: { head: ['Bucket', 'Share of each payout (example)', 'For'], rows: [
        ['Restock', '35%', 'Next hauls and wholesale orders'],
        ['Taxes', '15% of sales (about 25% of profit)', 'Quarterly estimates and sales tax'],
        ['Operating', '15%', 'Shipping supplies, app subscriptions, fees'],
        ['Owner pay', '25%', 'You. Yes, you get paid.'],
        ['Growth and safety', '10%', 'Emergency fund, new equipment, a big buy opportunity'],
      ] },
      tip: 'Adjust the shares to your own numbers, then keep them steady. The habit matters more than the exact percentages.' },
    { kind: 'number', title: 'Split a payout', q: 'This week\'s payout is $1,200. Using the example, how much goes to Restock (35%)?', prefix: '$', answer: 420, hint: '$1,200 × 0.35.', why: '$420 goes to Restock. The rest splits into Taxes $180, Operating $180, Owner pay $300 and Growth $120.' },
    { kind: 'scenario', title: 'The tempting haul', situation: 'A vendor offers a $2,500 designer haul at a great price. Your Restock bucket has $900, your Tax bucket has $1,400, and quarterly estimates are due in 3 weeks.',
      options: [
        { text: 'Use the tax money, you\'ll sell the haul in time', feedback: 'Maybe. And if it sells slowly, you\'re short on taxes with penalties coming. Tax money is not stock money.' },
        { text: 'Ask the vendor for a smaller lot within your $900, or a payment plan, and leave the tax bucket alone', best: true, feedback: 'You keep the relationship and the opportunity without gambling the tax money. Good vendors often split lots for reliable buyers.' },
        { text: 'Put it on a credit card and figure it out later', feedback: 'High-interest debt on inventory that might sell slowly is a risky habit. Use credit only with a clear plan to pay it off.' },
      ] },

    { chapter: 'Your money routine', kind: 'learn', title: 'Three reports to read', text: 'Look at these every month. They\'re all on the Reports page or Home.',
      table: { head: ['Report', 'What to look for', 'Action'], rows: [
        ['Profit by month', 'Is it going up? What margin?', 'If margin is falling, check costs and prices'],
        ['Top categories (% of sales)', 'Which categories earn the most?', 'Buy more of winners, less of losers'],
        ['Old stock', 'How much has sat 90+ days?', 'Run a sale and stop buying more of it'],
      ] } },
    { kind: 'order', title: 'Monthly money hour', prompt: 'Put your monthly money hour in order.', steps: ['Print or open last month\'s Reports', 'Check profit and margin', 'Check top categories and old stock', 'Move money into buckets and pay yourself', 'Set next month\'s buying budget'] },
    { kind: 'reflect', title: 'Your numbers', prompt: 'What was your profit last month, and what margin? If you don\'t know, what\'s missing to work it out?', placeholder: 'Last month my profit was…', example: 'I don\'t know yet. I\'m missing item costs on about half my stock, so I\'ll add costs when I receive from now on.' },
    { kind: 'learn', title: 'Cash flow: timing is everything', text: 'Cash comes in when buyers pay invoices; cash goes out when you buy stock, ship and pay bills. A cash flow plan looks a few weeks ahead so you\'re never surprised.',
      table: { head: ['Week', 'Cash in', 'Cash out', 'End balance'], rows: [
        ['1', '$1,400 (2 lives)', '$900 haul + $150 shipping', '$1,350'],
        ['2', '$1,300', '$160 shipping + $45 apps', '$2,445'],
        ['3', '$1,500', '$1,200 trade show + $170 shipping', '$2,575'],
        ['4', '$1,200', '$900 estimated tax + $150 shipping', '$2,725'],
      ] },
      example: 'Starting from $1,000, she can see the trade show and tax payment coming and never dips below zero.' },
    { kind: 'number', title: 'Break-even', q: 'Your monthly fixed costs (apps, storage rent, phone) are $300. Your average profit per piece is $12. How many pieces must you sell each month just to break even?', answer: 25, suffix: 'pieces', hint: '$300 ÷ $12.', why: '$300 ÷ $12 = 25 pieces. Everything after the 25th piece is real profit.' },
    { queen: "Pay yourself something, even a small amount, on a schedule. A business that never pays its owner is a very expensive hobby.", kind: 'scenario', title: 'Pay yourself?', situation: 'Your shop made $1,600 profit last month. You\'ve never paid yourself; everything goes back into stock.',
      options: [
        { text: 'Keep reinvesting everything forever', feedback: 'Reinvesting is good, but a business that never pays its owner can burn her out.' },
        { text: 'Pay yourself a set amount, even small, on a schedule, and reinvest the rest by plan', best: true, feedback: 'You prove the business works for you, and you keep growing. Raise your pay as profit grows.' },
        { text: 'Take all $1,600 out', feedback: 'Then there\'s nothing to restock or pay taxes with. Use buckets.' },
      ] },
    { kind: 'checklist', title: 'Money system', prompt: 'Tick what you\'ll set up this month.', items: ['Enter item cost on everything I receive', 'Work out true profit on my 5 best sellers', 'Open savings buckets for Restock, Taxes and Growth', 'Pay myself on a schedule', 'Do a monthly money hour with Reports', 'Set a buying budget before every haul'] },
  ],
}
export default lesson
