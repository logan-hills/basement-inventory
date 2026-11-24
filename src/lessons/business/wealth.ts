import type { Lesson } from '../types'
import { NOT_ADVICE } from '../resources'

const lesson: Lesson = {
  id: 'wealth', kind: 'course', school: 'Life and legacy', title: 'Build generational wealth through your shop', track: 'Business', icon: 'trend',
  why: "Income pays this month's bills. Wealth is what's still working for your family after you stop. Your shop can be the start of it: retirement savings, assets you own, kids who learn money early and a plan for what happens to the business.",
  outcomes: [
    'Know the difference between income and wealth, and why it matters for our families',
    'Use a SEP IRA or solo 401(k) to save for retirement and lower taxes',
    'Watch compound growth turn small, steady savings into real money',
    'Teach and include your children (and pay them the right way)',
    'Start a simple legacy plan: will, beneficiaries and what happens to the shop',
  ],
  route: { to: '/reports', label: 'Open Reports' },
  sources: [
    { org: 'Federal Reserve Board', title: 'Survey of Consumer Finances', url: 'https://www.federalreserve.gov/econres/scfindex.htm' },
    { org: 'IRS', title: '401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500', url: 'https://www.irs.gov/node/152316' },
    { org: 'IRS', title: 'SEP contribution limits', url: 'https://www.irs.gov/node/5958' },
    { org: 'IRS', title: 'One-participant 401(k) plans', url: 'https://www.irs.gov/retirement-plans/one-participant-401k-plans' },
    { org: 'U.S. Securities and Exchange Commission, Investor.gov', title: 'Compound interest calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator' },
    { org: 'IRS', title: 'Family employees', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/family-employees' },
  ],
  queen: {
    welcome: "This one is about legacy. For many of our families, nobody handed us a head start, so we have to build it ourselves. I want your shop to do more than pay the bills. I want it to be the reason your grandchildren have choices. Let's plant those seeds today.",
    signoff: "Open the retirement account, automate a little every month, teach the kids, and write the plan down. Wealth is built quietly and patiently, one steady habit at a time. Your family will feel what you start today for generations.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Income vs wealth', kind: 'learn', title: 'Income pays now; wealth pays later', nova: "Ooh, I love this one. We're talking about the long game, sis.",
      text: "Income is money coming in. Wealth is what you own minus what you owe: savings, retirement accounts, a home, a business with value. The Federal Reserve's Survey of Consumer Finances has long shown large wealth gaps between families, with typical Black and Hispanic families holding far less wealth than typical white families. One big reason is that wealth is often passed down. Building it on purpose changes what you pass down.",
      table: { head: ['Income', 'Wealth'], rows: [
        ['Your weekly payout', 'Your retirement account balance'],
        ['Spent on bills', 'Keeps growing while you sleep'],
        ['Stops when you stop working', 'Can be passed to your children'],
      ] },
      tip: NOT_ADVICE },
    { kind: 'quiz', q: 'Which of these is wealth, not just income?', options: ['This week\'s Square payout', 'A retirement account you add to every month', 'A great Black Friday live', 'Your tax refund'], answer: 1, why: "A retirement account is something you own that grows over time. The others are income: money that comes in and usually goes right back out." },

    { chapter: 'Pay future you', kind: 'learn', title: 'Retirement accounts for shop owners', text: "As a self-employed seller, nobody offers you a 401(k) at work, but you can open your own. These accounts can lower your taxes now and grow for years.",
      table: { head: ['Account', 'Good for', '2026 limits (from IRS)'], rows: [
        ['Roth or traditional IRA', 'Anyone with earned income; easy to start', 'Up to $7,500 ($8,600 if 50 or older)'],
        ['SEP IRA', 'Owners who want simple, flexible savings', 'Up to 25% of compensation (about 20% of net self-employment profit), within the IRS yearly cap'],
        ['Solo 401(k)', 'Owners with no employees except a spouse; can save more at lower profits', 'Up to $24,500 as "employee" ($32,500 if 50+, $35,750 if 60 to 63), plus a profit-sharing part'],
      ] },
      example: "Most big brokerages let you open these online in under an hour. Ask a tax pro which one fits your profit and goals." },
    { kind: 'number', title: 'A SEP IRA example', q: 'Your net self-employment profit, after the self-employment tax adjustment, works out to about $30,000. A sole proprietor can generally put about 20% of that into a SEP IRA. About how much can you contribute?', prefix: '$', answer: 6000, tolerance: 1, hint: '$30,000 × 20%.', why: 'About $6,000. That money grows for your future, and it can lower this year\'s taxable income. Your tax pro or the IRS worksheet gives the exact number.' },
    { kind: 'learn', title: 'Small, steady and automatic', text: "You don't need a big sum to start. Compound growth means your money earns returns, and then those returns earn returns. The SEC's Investor.gov calculator lets you try your own numbers. Investments can lose value, so this is a long-term habit, not a get-rich plan.",
      table: { head: ['Save each month', 'After 10 years', 'After 20 years', 'After 30 years'], rows: [
        ['$50', 'about $8,200', 'about $23,100', 'about $50,200'],
        ['$100', 'about $16,400', 'about $46,200', 'about $100,500'],
        ['$250', 'about $41,000', 'about $115,500', 'about $251,100'],
      ] },
      tip: 'Example assumes a 6% average yearly return, compounded monthly, for illustration only. Real returns go up and down.',
      queen: "Set it up to move automatically on the 1st of every month. The money you never see in checking is the money you never miss." },
    { kind: 'number', title: 'Find your monthly amount', q: 'You want to save $1,800 a year into your IRA. How much is that per month?', prefix: '$', answer: 150, hint: '$1,800 ÷ 12.', why: '$150 a month. Two good lives a month could cover it. Put it on autopilot and let time do the heavy lifting.' },

    { kind: 'quiz', q: 'Why does starting early matter so much for retirement savings?', options: ['Accounts charge less when you\'re young', 'Compound growth means early money has more years to earn returns on its returns', 'You can only open an IRA before age 40', 'Early savings are guaranteed to grow'], answer: 1, why: "Time is the secret ingredient. Money saved in your 30s or 40s has decades to grow; the same amount saved later has less time. But it's never too late to start." },
    { chapter: 'Bring the kids in', kind: 'learn', title: 'Raise owners, not just shoppers', text: "Children who see money handled openly learn it early. The shop is a living classroom.",
      points: ['Let them count stock, help price and see the profit math', 'Give older kids a real job and real pay, tracked on a timesheet', 'Talk about why you save, not just what you buy', 'Let them run a small "kid table" at a pop-up and keep the profit'] },
    { kind: 'learn', title: 'Pay your kids, then help them save', text: "The IRS has special rules for family help. In a sole proprietorship, wages you pay your own child under 18 generally aren't subject to Social Security and Medicare taxes. A child with earned income can also contribute to a custodial Roth IRA, up to what they earned (or the yearly IRA limit, if less). The work must be real and the pay reasonable.",
      example: "Your 14-year-old tags and photographs stock for 3 hours a week at $12 an hour, about $1,800 a year. You help her put $1,000 of it into a custodial Roth IRA. If it grew at 6% a year until she's 65, that one year's $1,000 could be about $19,500.",
      tip: NOT_ADVICE },
    { kind: 'scenario', title: 'Paying your son', situation: "You want to pay your 16-year-old $3,000 this year from the shop and help him start saving. A friend says to just call it his allowance.",
      options: [
        { text: 'Call it allowance and pay cash', feedback: "Allowance isn't earned income, so he can't use it for a Roth IRA, and you lose the business deduction." },
        { text: 'Have him do real shop work, keep a timesheet, pay from the business account, and ask a tax pro to set it up', best: true, feedback: "Real job, real records, real pay. That opens the door to a custodial Roth IRA and teaches him how work and money connect." },
        { text: 'Pay him $3,000 for one afternoon of work', feedback: "The pay must be reasonable for the work. Overpaying for little work can cause problems with the IRS." },
      ] },

    { chapter: 'Your legacy plan', kind: 'learn', title: 'Write it down', text: "A legacy plan doesn't have to be fancy. It just has to exist. Without one, your family may be left guessing.",
      points: ['A will (and guardians named for minor children)', 'Beneficiaries named on every retirement account and life insurance policy', 'A "shop binder": passwords stored safely, suppliers, how to pause or close the shop', 'Who could run or sell the shop if you couldn\'t', 'Life insurance, if people depend on your income'],
      queen: "Fill out your beneficiaries the same day you open any account. It takes two minutes, and it's one of the most loving things you'll ever do." },
    { kind: 'learn', title: 'Your shop can be an asset', text: "A shop with steady sales, good records, loyal buyers and simple systems has value. Someday it could be passed to a child, sold, or folded into something bigger. The habits in this University, like clean records, written processes and a trained helper, are exactly what make a business worth something without you.",
      table: { head: ['Makes your shop worth more', 'Makes it hard to pass on'], rows: [
        ['Clean books and separate accounts', 'Mixed personal and business money'],
        ['Written checklists and trained helpers', 'Everything lives in your head'],
        ['A loyal buyer list and group', 'Sales depend only on you being on camera'],
        ['Brand name you own', 'A name someone else trademarked'],
      ] } },
    { kind: 'reflect', title: 'Your wealth plan', prompt: 'Write the retirement account you\'ll look into, your monthly amount, one way you\'ll include your children, and the first legacy step you\'ll take.', placeholder: 'Account… Monthly amount… Kids… First legacy step…', example: 'Open a SEP IRA, $150 a month on the 1st. My daughter tags stock for pay and starts a Roth IRA. Name beneficiaries this week and make a will by March.' },
    { kind: 'checklist', title: 'Start building', prompt: 'Tick what you\'ll do in the next 30 days.', items: ['Choose an IRA, SEP IRA or solo 401(k) with a tax pro', 'Set up an automatic monthly contribution', 'Name beneficiaries on every account', 'Start my shop binder', 'Have a money talk with my kids', 'Book an appointment to make or update my will'] },
  ],
}
export default lesson
