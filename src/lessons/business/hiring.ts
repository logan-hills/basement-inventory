import type { Lesson } from '../types'
import { NOT_ADVICE } from '../resources'

const lesson: Lesson = {
  id: 'hiring', kind: 'course', school: 'Build your team', title: 'Hiring your first helper', track: 'Business', icon: 'users',
  why: "There comes a point where the only way to grow is to stop doing everything yourself. The right first helper gives you back hours every week. The wrong hire, or the right person hired the wrong way, costs money and peace.",
  outcomes: [
    'Know when you\'re ready to hire, using your own numbers',
    'Choose the first job to hand off',
    'Find, interview and try out a helper fairly',
    'Pay them the right way (and know the basics of employee vs contractor)',
    'Train them in a week and give them their own sign-in through Team members',
  ],
  route: { to: '/settings/team', label: 'Open Team members' },
  sources: [
    { org: 'U.S. Small Business Administration', title: 'Hire and manage employees', url: 'https://www.sba.gov/counseling/manage-your-business/' },
    { org: 'IRS', title: 'Independent contractor (self-employed) or employee?', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/independent-contractor-self-employed-or-employee' },
    { org: 'IRS', title: 'Family employees', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/family-employees' },
    { org: 'U.S. Department of Labor', title: 'Minimum wage', url: 'https://www.dol.gov/agencies/whd/minimum-wage' },
    { org: 'U.S. Citizenship and Immigration Services', title: 'Form I-9, Employment Eligibility Verification', url: 'https://www.uscis.gov/i-9' },
    { org: 'Google re:Work', title: 'Hiring and onboarding guides', url: 'https://rework.withgoogle.com/intl/en/subjects/hiring' },
  ],
  queen: {
    welcome: "Hiring your first helper is a big step, and I'm proud of you for thinking about it. It means your shop is growing. In this course I'll walk you through it the way I'd want you to do it: with your numbers, a fair tryout, the right paperwork and a real training plan.",
    signoff: "Start with one job, hire slowly, train patiently, and give your helper their own sign-in. Your first hire is the first brick in the team that will carry your business further than you could alone.",
  },
  covers: ['src/components/TeamSettings.tsx'], updated: '2026-11-25',
  slides: [
    { chapter: 'Are you ready?', kind: 'learn', title: 'Signs it\'s time', nova: "Feeling stretched thin? That might be a growth signal, not a failure. Let's check.",
      text: "You don't need to be a big business to hire. You need a clear job, enough profit to pay for it, and a little time to train.",
      points: ['Orders wait more than your ship-by promise because packing takes too long', 'You skip lives because you\'re still packing the last one', 'You turn down good stock because you can\'t receive it fast enough', 'You haven\'t had a day off in weeks', 'Your profit could cover a few hours of help each week'] },
    { kind: 'learn', title: 'Pick the first job to hand off', text: "Hand off the job that's repeatable, easy to teach and eats your time, and keep the jobs only you can do: going live, buying and your buyer relationships.",
      table: { head: ['Good first jobs', 'Keep for yourself (for now)'], rows: [
        ['Picking and packing', 'Hosting lives'],
        ['Tagging and putting away new stock', 'Buying and pricing'],
        ['Printing labels and post office runs', 'Money and payouts'],
        ['Steaming, folding and photographing', 'Handling upset buyers'],
      ] },
      queen: "Hire for the job that drains you, not the job you love. Your energy belongs on camera and with your buyers." },
    { kind: 'number', title: 'Can you afford it?', q: 'Packing takes you 8 hours a week. You\'d pay a helper $15 an hour for those hours. If your lives make $35 profit per hour you spend selling, how much more profit could you make if you used those 8 freed-up hours for selling, after paying the helper?', prefix: '$', answer: 160, hint: 'Extra profit: 8 × $35 = $280. Helper cost: 8 × $15 = $120.', why: '$280 − $120 = $160 more each week. A helper pays for herself when your freed-up time earns more than her pay. If you\'d spend those hours resting, that\'s worth something too!' },

    { chapter: 'Find and choose', kind: 'learn', title: 'Where good helpers come from', text: "Your first helper is often closer than you think.",
      points: ['A loyal buyer who already loves your shop', 'Family members (with clear rules, see below)', 'A retired friend who wants a few hours a week', 'A student looking for flexible part-time work', 'Local church, community or neighborhood groups'],
      tip: 'Hiring a buyer? Make sure she understands that what happens behind the scenes stays private, especially other buyers\' names and addresses.' },
    { kind: 'learn', title: 'Interview the same way, every time', text: "Hiring research, including Google's re:Work guidance, finds that structured interviews, where every person gets the same questions and you score answers the same way, predict job performance better than casual chats. It's also fairer.",
      table: { head: ['Ask', 'Listen for'], rows: [
        ['"Tell me about a time you had a lot of small tasks to finish. How did you keep track?"', 'Organized, uses lists'],
        ['"What would you do if you couldn\'t find an item for an order?"', 'Asks, doesn\'t guess or skip'],
        ['"What days and hours can you count on every week?"', 'Clear, realistic availability'],
        ['"How do you feel about following a checklist exactly?"', 'Comfortable with your way'],
        ['"Why does this job appeal to you?"', 'Genuine interest, not just any job'],
      ] } },
    { kind: 'learn', title: 'A paid tryout', text: "Before you commit, do a short paid tryout: one packing night or one receiving session. Watch how they work, how they ask questions and whether they follow the checklist.",
      example: "Toni invited two candidates to pack a Thursday live, 3 hours each, paid. One rushed and mixed up two boxes. The other went slower, scanned every item and asked twice when unsure. Toni hired the second one, and four months later she packs faster than Toni ever did." },
    { kind: 'scenario', title: 'Your best friend wants the job', situation: "Your best friend is between jobs and asks to be your packer. She's fun and trustworthy, but often late.",
      options: [
        { text: 'Hire her right away; friendship comes first', feedback: "Kind, but late packing breaks your ship-by promise, and correcting a best friend is hard. Decide with eyes open." },
        { text: 'Offer her the same paid tryout and clear expectations as anyone, including start times', best: true, feedback: "Fair to her and to your business. If it works, great. If not, you both knew the rules from the start." },
        { text: 'Say no without explaining', feedback: "You might lose a good helper and hurt a friendship. A fair tryout is kinder." },
      ] },

    { kind: 'script', title: 'A job post to copy', text: 'Post it in your VIP group, your church bulletin or a local community group. Change the details to fit.', lines: [
      'Now hiring: part-time packing helper for [shop name]!',
      'Hours: [Tuesday and Friday evenings, about 6 hours a week], in [town].',
      'You\'ll: pick orders with a scanner, pack them beautifully and print labels.',
      'You\'re: organized, careful with details, and happy to follow a checklist.',
      'Pay: $[rate] an hour, paid every [week / two weeks]. Paid tryout night first.',
      'Interested? Message me with the days you\'re free and one sentence about why you\'d love it.',
    ] },
    { kind: 'reflect', title: 'Your job description', prompt: 'Write the first job you\'ll hand off: the tasks, the hours, the pay and what "done well" looks like.', placeholder: 'Tasks… Hours… Pay… Done well means…', example: 'Pick and pack Thursday and Sunday lives, about 6 hours a week, $15/hour. Done well: every item scanned twice, boxes sealed and labeled by noon the next day.' },
    { chapter: 'Pay it the right way', kind: 'learn', title: 'Employee or contractor: a quick recap', text: "The IRS looks at control, not titles. If you decide when, where and how the work is done (your basement, your schedule, your packing checklist), your helper is usually an employee. Employees mean payroll: withholding taxes, paying your share, and forms like the W-4 and I-9. Contractors run their own business and set their own methods.",
      table: { head: ['If they are…', 'At hiring', 'At year end'], rows: [
        ['Employee', 'W-4 for taxes, I-9 to verify they can work in the U.S.', 'W-2'],
        ['Contractor', 'W-9', '1099-NEC if you paid them $2,000 or more (2026 rule)'],
      ] },
      tip: NOT_ADVICE },
    { kind: 'learn', title: 'Make payroll easy', text: "If your helper is an employee, a payroll service does the hard parts: withholding, tax deposits and year-end forms. Many cost about $40 to $60 a month plus a few dollars per person. Also check your state's minimum wage (it may be higher than the federal $7.25), new-hire reporting and whether you need workers' compensation insurance.",
      points: ['Pick a payroll service (Square Payroll, Gusto and others)', 'Check your state minimum wage on the Department of Labor site', 'Ask your insurance agent about workers\' comp', 'Keep a simple timesheet, even for a few hours a week'],
      queen: "Pay your helper on time, every time, even when the week was slow. Trust on payday is the foundation of a good team." },
    { kind: 'learn', title: 'Hiring family', text: "The IRS has special rules for family help. For example, wages you pay your own child under 18 in a sole proprietorship generally aren't subject to Social Security and Medicare taxes, and a child can earn some money without owing income tax. The work must be real and the pay reasonable for the job.",
      example: "Your 15-year-old tags and photographs stock 5 hours a week for $12 an hour. You keep a timesheet, pay from the business account, and the work is real. Ask a tax pro to set it up right." },
    { kind: 'quiz', q: 'Your packer works in your basement, on your schedule, using your packing checklist. How is she most likely classified?', options: ['Contractor, because she\'s part-time', 'Employee, because you control when, where and how she works', 'Neither, if you pay in cash', 'Volunteer'], answer: 1, why: "Part-time doesn't matter, and cash doesn't change the rules. Control over the work is what the IRS looks at." },

    { chapter: 'Train and trust', kind: 'learn', title: 'A one-week training plan', text: "Good training is the difference between a helper who struggles and one who shines.",
      table: { head: ['Day', 'Focus'], rows: [
        ['1', 'Watch you do the job start to finish; ask questions'],
        ['2', 'Do it together, side by side'],
        ['3', 'They do it, you watch and coach'],
        ['4', 'They do it alone; you check every box before it ships'],
        ['5', 'They do it alone; you spot-check a few'],
      ] } },
    { kind: 'order', title: 'Set up their sign-in', prompt: 'Put the steps of adding your helper to the app in order.', steps: ['Open Settings, then Team members', 'Copy your shop\'s invite code', 'Your helper signs up with their own email', 'They enter the invite code to join your shop', 'Check they can see the jobs they need, like Pick and Scan'] },
    { kind: 'scenario', title: 'The first mistake', situation: "In week two, your helper ships a necklace to the wrong buyer.",
      options: [
        { text: 'Take over packing again yourself', feedback: "That undoes all your training, and you're back to doing everything." },
        { text: 'Fix it for the buyers first, then walk through what happened with your helper and add a check to the process', best: true, feedback: "Calm and fair. Most mistakes are process gaps. A second scan or a checklist line prevents the next one." },
        { text: 'Take the cost out of her pay', feedback: "This can break wage laws and trust. Mistakes are part of learning." },
      ] },
    { kind: 'checklist', title: 'Your first-hire plan', prompt: 'Tick what you\'ll do.', items: ['Name the first job I\'ll hand off', 'Do the "can I afford it" math', 'Write my 5 interview questions', 'Plan a paid tryout', 'Decide employee or contractor with a tax pro', 'Set up my helper in Team members', 'Print my one-week training plan'] },
  ],
}
export default lesson
