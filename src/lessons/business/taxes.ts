import type { Lesson } from '../types'
import { NOT_ADVICE } from '../resources'

const lesson: Lesson = {
  id: 'taxes', kind: 'course', school: 'Make it official', title: 'Taxes made calm: records, deductions and tax time', track: 'Business', icon: 'reports',
  why: 'Good records all year turn tax time from a panic into a one-afternoon job, and can save you real money.',
  outcomes: [
    'Know how a live seller\'s profit is taxed (income tax plus self-employment tax)',
    'Keep the records the IRS expects, and keep them long enough',
    'Track costs of goods, shipping, supplies, mileage and home office',
    'Understand Form 1099-K and why all income counts anyway',
    'Set aside money and pay quarterly estimates on time',
    'Walk into tax season with a complete checklist',
  ],
  route: { to: '/reports', label: 'Open Reports' },
  sources: [
    { org: 'IRS', title: 'Self-employment tax (Social Security and Medicare)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/self-employment-tax-social-security-and-medicare-taxes' },
    { org: 'IRS', title: 'Estimated taxes', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/estimated-taxes' },
    { org: 'IRS', title: 'How long should I keep records?', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/how-long-should-i-keep-records' },
    { org: 'IRS', title: 'Form 1099-K threshold FAQs', url: 'https://www.irs.gov/newsroom/irs-issues-faqs-on-form-1099-k-threshold-under-the-one-big-beautiful-bill-dollar-limit-reverts-to-20000' },
    { org: 'IRS', title: 'Standard mileage rates', url: 'https://www.irs.gov/tax-professionals/standard-mileage-rates' },
    { org: 'IRS', title: 'Simplified option for home office deduction', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/simplified-option-for-home-office-deduction' },
  ],
  queen: {
    welcome: "Taxes feel big because nobody explains them. I want tax time to be one calm afternoon for you, not a week of panic. Good records all year are the whole secret.",
    signoff: "Save your receipts, set aside a share of every payout, and gather your tax packet by February. And remember, this is education, not tax advice, so find a good tax pro for your situation.",
  },
  covers: ['src/lessons/resources.ts'], updated: '2026-11-24',
  slides: [
    { chapter: 'How you\'re taxed', kind: 'learn', title: 'Profit, not sales', nova: 'Deep breath. Taxes feel big because nobody explains them. I\'ll keep it plain. And remember: this is education, not tax advice.',
      text: 'As a sole proprietor or single-member LLC, you\'re generally taxed on your profit: sales minus business costs. That profit goes on Schedule C with your personal return. You pay regular income tax on it, plus self-employment tax.',
      table: { head: ['Tax', 'What it is', 'The number'], rows: [
        ['Self-employment tax', 'Social Security and Medicare for people who work for themselves', '15.3% of net earnings, if they\'re $400 or more'],
        ['Income tax', 'Federal (and state) tax on your total income', 'Depends on your total income and bracket'],
        ['State and local', 'PA personal income tax, plus local earned income tax in many areas', 'Varies by where you live'],
      ] },
      tip: NOT_ADVICE },
    { kind: 'number', title: 'Self-employment tax', q: 'Your shop\'s profit for the year is $12,000. Roughly how much is 15.3% self-employment tax on that? (The real form uses 92.35% of profit, so this is a quick upper estimate.)', prefix: '$', answer: 1836, tolerance: 1, hint: '$12,000 × 0.153.', why: '$12,000 × 15.3% = $1,836 (the actual form comes out a little lower, about $1,695). That\'s before income tax, which is why setting money aside matters.' },
    { queen: "Move your tax set-aside the same day you're paid. Money left in checking has a way of getting spent.", kind: 'learn', title: 'Set aside every payout', text: 'A common rule of thumb for self-employed people is to set aside 25 to 30% of profit for taxes. Your real number depends on your situation; a tax pro can help you pick it.',
      example: 'Every Friday, move 25% of the week\'s profit into a "Tax" savings account. When estimates are due, the money is already there.' },

    { chapter: 'Records', kind: 'learn', title: 'What to keep', text: 'If it\'s not written down, it didn\'t happen, as far as the IRS is concerned. Keep proof of income and every business cost.',
      table: { head: ['Keep', 'Examples', 'Where the app helps'], rows: [
        ['Sales', 'Invoices, payouts, platform reports', 'Reports: sales by live and month, printable'],
        ['Cost of goods', 'Receipts for every haul and wholesale order', 'Item cost on each piece when you receive it'],
        ['Shipping', 'Label receipts (Pirate Ship history)', 'Shipping page'],
        ['Supplies', 'Mailers, tape, tissue, labels, printer', 'Snap receipts into a folder'],
        ['Equipment', 'Ring light, phone stand, shelving, scanner', 'Keep receipts; big items may be depreciated'],
        ['Mileage', 'Trips to the post office, vendors, sales', 'A mileage log app or notebook'],
      ] } },
    { kind: 'learn', title: 'How long to keep them', text: 'The IRS says to keep records at least 3 years after you file in most cases, and longer in some: 6 years if income was under-reported by more than 25%, at least 4 years for employment tax records, and indefinitely if a return was never filed. Many owners simply keep everything 7 years.',
      tip: 'Scan or photograph paper receipts the day you get them. Ink on thermal receipts fades.' },
    { kind: 'quiz', q: 'Generally, how long does the IRS say to keep business records after you file?', options: ['1 year', 'At least 3 years (longer in some cases)', 'Only until you get your refund'], answer: 1, why: 'At least 3 years in most cases, and longer in some situations. When in doubt, keep them longer.' },

    { chapter: 'Deductions', kind: 'learn', title: 'Costs that lower your profit', text: 'Ordinary and necessary business costs reduce your taxable profit. Common ones for live sellers:',
      points: ['Cost of goods sold: what you paid for the pieces you sold', 'Shipping labels and packing supplies', 'Platform and payment processing fees', 'Equipment: lights, phone stand, label printer, scanner, shelving', 'Software and subscriptions used for the business (including this app)', 'Business mileage: 76¢ a mile for July to December 2026 (72.5¢ January to June)', 'Home office, if a space is used only and regularly for business: the simplified method is $5 per sq ft, up to 300 sq ft'] },
    { kind: 'number', title: 'Home office', q: 'Your stock room is 12 by 15 feet, used only for the business. Using the simplified method at $5 per square foot, what\'s the deduction?', prefix: '$', answer: 900, hint: '12 × 15 = square feet. × $5.', why: '12 × 15 = 180 sq ft × $5 = $900. The space has to be used only and regularly for business to count.' },
    { kind: 'learn', title: 'Cost of goods: inventory counts', text: 'You generally deduct what you paid for the pieces you SOLD this year, not everything you bought. Unsold stock stays inventory until it sells. That\'s why the item cost you enter when receiving matters: it lets you see cost of goods sold for any period.',
      example: 'You bought $9,000 of stock this year and sold pieces that cost you $6,500. The $6,500 is this year\'s cost of goods sold. The other $2,500 is still on your shelves as inventory.' },

    { chapter: '1099-K and estimates', kind: 'learn', title: 'The 1099-K', text: 'Payment apps and marketplaces (like PayPal, Square or TikTok Shop) send Form 1099-K to sellers paid through them. Under the law passed in 2025, they generally send it when payments are over $20,000 AND there are over 200 transactions in the year.',
      tip: 'The IRS is clear: you must report all business income, whether or not you get a 1099-K.' },
    { kind: 'scenario', title: 'No 1099-K this year', situation: 'You made $14,000 in sales across Square and PayPal. Neither sent you a 1099-K. A friend says that means you don\'t need to report it.',
      options: [
        { text: 'Skip reporting it, no form means no tax', feedback: 'Not true. All business income must be reported. Skipping it risks penalties and interest later.' },
        { text: 'Report all $14,000 in sales on Schedule C, minus your business costs', best: true, feedback: 'Right. Your own records (Reports in this app, payout statements) are what you report from. Costs bring your taxable profit down.' },
        { text: 'Report only the Square part', feedback: 'All income counts, from every app, cash included.' },
      ] },
    { kind: 'learn', title: 'Quarterly estimated taxes', text: 'No employer is withholding tax from your shop profit, so the IRS expects you to pay during the year. Sole proprietors generally must make estimated payments if they expect to owe $1,000 or more. Paying at least 90% of this year\'s tax or 100% of last year\'s helps avoid an underpayment penalty (higher-income filers have a different rule).',
      table: { head: ['Due date', 'Covers'], rows: [
        ['April 15', 'January to March'],
        ['June 15', 'April and May'],
        ['September 15', 'June to August'],
        ['January 15 (next year)', 'September to December'],
      ] },
      tip: 'Pay online at IRS.gov (IRS Direct Pay or your IRS Online Account). Dates move to the next business day if they land on a weekend or holiday.' },

    { chapter: 'Tax time', kind: 'checklist', title: 'Your tax-time packet', prompt: 'Gather these by February so tax season is one calm afternoon.', items: ['Sales totals for the year (print from Reports)', 'Every 1099-K or 1099 form you received', 'Cost of goods sold (purchases and starting/ending inventory)', 'Shipping, supplies and fee totals', 'Equipment receipts with dates and prices', 'Mileage log total', 'Home office square footage', 'Estimated tax payments you made, with dates', 'Last year\'s tax return'] },
    { queen: "Ask other sellers who they use. A tax pro who understands live sellers is worth every penny.", kind: 'learn', title: 'Find a good tax pro', text: 'A good tax professional often saves more than they cost, especially your first year in business.',
      points: ['Look for an enrolled agent (EA) or CPA who works with small businesses', 'Ask: do you work with online sellers and inventory?', 'Bring your tax-time packet to the first meeting', 'Ask what to track differently next year', 'The IRS also lists free help programs for some taxpayers on IRS.gov'] },
    { kind: 'scenario', title: 'April panic', situation: 'It\'s April 10. You have a shoebox of receipts, no sales totals, and no estimated payments made.',
      options: [
        { text: 'Skip filing this year and catch up later', feedback: 'Not filing can add big penalties. File on time, or file for an extension.' },
        { text: 'File for an extension, pay what you reasonably can by the deadline, then organize your records and file properly', best: true, feedback: 'An extension gives you more time to file, not to pay. Paying what you can now limits penalties and interest.' },
        { text: 'Guess the numbers and file today', feedback: 'Guesses can mean paying too much or too little. Use real records.' },
      ] },
    { kind: 'reflect', title: 'Your system', prompt: 'How will you keep receipts and set money aside, starting this week?', placeholder: 'I\'ll keep receipts… I\'ll set aside…', example: 'Photo every receipt into a "2026 Shop Receipts" album right away. Move 25% of profit to my Tax savings every Friday. Estimates on my calendar.' },
  ],
}
export default lesson
