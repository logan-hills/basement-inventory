import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'moneymindset', kind: 'course', school: 'Mindset and motivation', title: 'Money mindset: pay yourself and keep it separate', track: 'Business', icon: 'dollar',
  why: "Plenty of busy shops still don't pay their owner. Usually it isn't the sales. It's old money habits and one big pile of mixed-up money. Change the habits, and your shop starts paying you.",
  outcomes: [
    'Spot the money story you grew up with and how it shows up in your shop',
    'Separate business and personal money for good',
    'Pay yourself first, on a schedule, with a number that fits',
    'Build an emergency cushion for your home and your shop',
    'Talk about money with family without guilt or fights',
  ],
  route: { to: '/reports', label: 'Open Reports' },
  sources: [
    { org: 'Federal Reserve Board', title: 'Economic Well-Being of U.S. Households (SHED report)', url: 'https://www.federalreserve.gov/consumerscommunities/shed.htm' },
    { org: 'Journal of Financial Therapy (Klontz and colleagues)', title: 'Money beliefs and financial behaviors: development of the Klontz Money Script Inventory', url: 'https://doi.org/10.4148/jft.v2i1.451' },
    { org: 'Consumer Financial Protection Bureau', title: 'Your Money, Your Goals toolkit', url: 'https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/' },
    { org: 'FDIC', title: 'Money Smart for Small Business', url: 'https://www.fdic.gov/consumer-resource-center/money-smart-small-business' },
    { org: 'U.S. Small Business Administration', title: 'Manage your finances', url: 'https://www.sba.gov/business-guide/manage-your-business/manage-your-finances' },
  ],
  queen: {
    welcome: "Baby, I want you to get paid. Not someday, not when the shop is bigger. This course is about the habits that decide whether your business feeds your family or quietly eats your money. Be honest with yourself as you go. Nobody sees your workbook but you.",
    signoff: "Open the separate account, set your pay day, and start your cushion with whatever you have. Paying yourself is not selfish. It's proof that what you're building works.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Your money story', queen: "Write your money script on a sticky note and put it where you price your pieces. Awareness is half the cure.", kind: 'learn', title: 'We all learned money somewhere', nova: "Let's start somewhere soft, love. Before we touch a single number, let's talk about where your money habits came from.",
      text: "Researchers Brad Klontz and colleagues found that most of us carry 'money scripts': beliefs about money we picked up as kids, often without noticing. These beliefs predict real behavior, like overspending, avoiding bills or hoarding cash. In a shop, they show up as underpricing, never paying yourself or spending every payout on new stock.",
      table: { head: ['Money script', 'Sounds like', 'How it shows up in a shop'], rows: [
        ['Money avoidance', '"Money is greedy. I don\'t need much."', 'Prices too low; feels guilty charging shipping'],
        ['Money worship', '"Just one more big month and everything will be fine."', 'Buys more stock instead of saving'],
        ['Money status', '"I have to look successful."', 'Spends on gear and looks before profit'],
        ['Money vigilance', '"Never spend, never tell anyone."', 'Saves well but won\'t invest in a helper or tools'],
      ] },
      tip: "None of these makes you a bad businesswoman. Knowing yours just helps you catch it." },
    { kind: 'reflect', title: 'Your money story', prompt: 'What did you learn about money growing up? Which money script sounds most like you, and where does it show up in your shop?', placeholder: 'Growing up, money was… The script that sounds like me… In my shop it shows up when…', example: 'Money was always tight and nobody talked about it. I\'m money avoidance. I feel bad charging full price to regulars, so I discount without thinking.' },
    { kind: 'learn', title: 'Why a cushion changes everything', text: "The Federal Reserve's yearly survey of household finances keeps finding that a large share of adults couldn't cover a surprise $400 expense with cash or its equivalent. When there's no cushion, every slow live feels like an emergency, and emergencies lead to bad money decisions, like dipping into tax money or selling stock at a loss.",
      tip: "A cushion isn't about being rich. It's about being calm. Calm owners make better choices." },
    { kind: 'quiz', q: 'Keisha feels uncomfortable charging shipping and often "eats" it for regulars. Which money script is most likely at work?', options: ['Money worship', 'Money avoidance', 'Money status', 'Money vigilance'], answer: 1, why: "Feeling guilty about charging what something costs is classic money avoidance. Noticing it is the first step to charging fairly." },

    { chapter: 'Two pots, not one', queen: "If opening a business account feels like a big step, that's exactly why you should do it this week. Big steps make it real.", kind: 'learn', title: 'Separate your money for good', nova: "This is the single biggest money upgrade most sellers can make. And it's free.",
      text: "The SBA advises keeping business and personal finances separate. When both live in one account, you can't tell if the shop is making money, tax time is a mess, and it's easy to spend business money on groceries without noticing.",
      points: ['Open a business checking account (many are free with an EIN or your SSN)', 'Every sale and payout goes into business checking', 'Every business cost is paid from business checking', 'You move money to personal checking only as a planned paycheck', 'Never pay personal bills straight from the business account'],
      example: "Dee used one account for everything for two years. She felt like she was working for free but couldn't prove it. After she split her accounts, she learned her shop made $640 a month in profit. Now she pays herself $400 of it on purpose." },
    { kind: 'order', title: 'Money flow, in order', prompt: 'Put a payout\'s journey in the right order.', steps: ['A buyer pays her invoice', 'The payout lands in business checking', 'You set aside taxes and stock money', 'You pay yourself on pay day', 'Your paycheck goes to personal checking for home bills'] },
    { kind: 'scenario', title: 'The grocery run', situation: "You're at the store and realize your personal card is low. Your business card has plenty, and it's only $85.",
      options: [
        { text: 'Use the business card this once; it\'s your money anyway', feedback: "It feels harmless, but 'just this once' is how the two pots blend back into one. It also muddies your records." },
        { text: 'Use your personal card, then move an early paycheck from business to personal if you truly need it, and write it down', best: true, feedback: "You keep the walls up. An early paycheck that you record is a plan. Grabbing the business card is a leak." },
        { text: 'Skip the groceries until pay day', feedback: "Your family still needs to eat! There's a cleaner way to get your own money." },
      ] },

    { chapter: 'Pay yourself first', queen: "Put your pay day on the calendar like a bill. Bills get paid. Wishes don't.", kind: 'learn', title: 'Your pay comes first, not last', text: "Most owners pay everything else first and keep whatever's left, which is usually nothing. Flip it. When a payout arrives, take your pay share right away, like a bill that must be paid. Then run the shop on what remains. Small business author Mike Michalowicz popularized this as 'Profit First,' and the idea is simple: what you take first, you protect.",
      table: { head: ['From each $1,000 of profit', 'Example split'], rows: [
        ['Owner pay (you!)', '$300'],
        ['Taxes', '$250'],
        ['Cushion', '$100'],
        ['Back into the shop (stock, supplies, tools)', '$350'],
      ] },
      tip: "Start where you are. If 30% feels impossible, start at 5% and raise it 1% each month. The habit matters more than the size." },
    { kind: 'number', title: 'Your first paycheck', q: 'Your shop made $1,800 in profit this month. You decide to pay yourself 20% to start. How much is your paycheck?', prefix: '$', answer: 360, hint: '$1,800 × 0.20.', why: '$1,800 × 20% = $360. That\'s $360 that becomes real money in your home, not just numbers in an app.' },
    { kind: 'learn', title: 'Draws, not salary (for most of you)', text: "If you're a sole proprietor or a single-member LLC, your paycheck is usually called an owner's draw. You move money from business to personal. A draw isn't a business expense and doesn't lower your taxes, because you're taxed on the shop's profit either way. That's why your tax set-aside comes out before your pay.",
      tip: 'If your shop is set up as a corporation (like an S corp), you pay yourself differently. Ask a tax pro. This is general education, not tax or legal advice.' },
    { kind: 'number', title: 'Set a monthly pay day', q: 'You want to pay yourself $500 a month. You go live 4 times a month and each live makes about $250 in profit. What share of each live\'s profit goes to your pay?', suffix: '%', answer: 50, hint: 'Four lives × $250 = $1,000 a month. What share of $1,000 is $500?', why: '$500 of $1,000 is 50%. That\'s high for a growing shop. You might start lower and raise it as sales grow, or add a fifth live.' },

    { chapter: 'Cushions and guilt', kind: 'learn', title: 'Two cushions: home and shop', text: "Keep two separate safety nets. Your shop cushion covers slow months. Your home cushion covers life: a car repair, a sick week. Mixing them means a broken car can shut down your shop.",
      table: { head: ['Cushion', 'Start with', 'Grow to'], rows: [
        ['Shop', '1 month of shop costs', '2 to 3 months'],
        ['Home emergency', '$500', '3 months of household basics'],
      ] },
      example: "Tanya saves $25 from every live into her shop cushion and $20 from every paycheck into her home cushion. In six months she had $1,100 between them, and a dead printer was a shrug, not a crisis." },
    { queen: "Loving your family and protecting your business are not opposites. A strong shop is how you keep showing up for them.", kind: 'learn', title: 'Money and the people you love', text: "Money guilt runs deep, especially for women who've always taken care of everyone else. You may feel guilty paying yourself while family needs help, or feel pressure to 'loan' shop money. The CFPB's Your Money, Your Goals toolkit suggests deciding your rules ahead of time, so you're not deciding under pressure.",
      points: ['Decide a yearly "giving" amount and give from your paycheck, not the shop', 'Say "the shop money is already spoken for" instead of a long explanation', 'Share your goal with your household: "When the cushion hits $1,000, we celebrate"', 'Remember: a strong shop helps your family longer than one emptied account'] },
    { kind: 'script', title: 'Kind words for hard money talks', lines: [
      '"I love you, and I can\'t take money out of the business. Let me see what I can do from my own pay."',
      '"The shop money is already spoken for this month. Can we look at it together next pay day?"',
      '"I\'m building something for all of us. Protecting it is how I take care of you long-term."',
    ] },
    { kind: 'scenario', title: 'The family loan', situation: "Your cousin asks to borrow $600 for rent. Your business account has $1,400, earmarked for sales tax and next week's stock order.",
      options: [
        { text: 'Lend the $600 from the business; you\'ll make it back', feedback: "That's tax money and stock money. If you can't pay the state or restock, the shop that helps your whole family is at risk." },
        { text: 'Say the shop money is spoken for, and offer what you can from your personal money or giving fund', best: true, feedback: "You protect the shop and still show love. Help from your own pay is a gift you can afford." },
        { text: 'Ignore the message', feedback: "Avoiding it usually makes it harder later. A kind, clear answer protects the relationship." },
      ] },
    { kind: 'checklist', title: 'Your money mindset plan', prompt: 'Tick what you will do in the next two weeks.', items: ['Name my money script and write one way I\'ll catch it', 'Open (or confirm) a separate business checking account', 'Pick my pay day and my starting pay percentage', 'Start a shop cushion and a home cushion, even with $10', 'Decide my yearly giving amount', 'Tell my household my money goal'] },
  ],
}
export default lesson
