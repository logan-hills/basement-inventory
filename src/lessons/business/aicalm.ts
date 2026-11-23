import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'aicalm', kind: 'course', school: 'AI know-how', title: 'Don\'t drown in AI: a calm, simple system', track: 'Business', icon: 'sparkle',
  why: 'New AI apps show up every week, and every one promises to change your life. The sellers who win pick a few, use them on purpose, and keep their own judgment in charge.',
  outcomes: [
    'Know what the newest research says about AI overload, and why more tools can mean less done',
    'Pick no more than three AI tools, each with one clear job',
    'Batch your AI work into set times so it doesn\'t eat your day',
    'Spot the signs of "AI brain fry" and know what to do about it',
    'Ignore the hype and judge any new AI app in five minutes',
  ],
  route: { to: '/planner', label: 'Open Live Planner' },
  sources: [
    { org: 'Harvard Business Review and BCG', title: 'When using AI leads to "brain fry" (March 2026)', url: 'https://www.bcg.com/news/5march2026-when-using-ai-leads-brain-fry' },
    { org: 'Fortune', title: '"AI brain fry" is making workers more exhausted (March 2026)', url: 'https://fortune.com/2026/03/10/ai-brain-fry-workplace-productivity-bcg-study/' },
    { org: 'Federal Reserve Bank of San Francisco', title: 'Early findings on small business use of AI (2026)', url: 'https://www.frbsf.org/research-and-insights/publications/community-articles/2026/03/ai-and-small-businesses/' },
    { org: 'JPMorganChase Institute', title: 'The AI adoption gap by gender and generation among small business owners (May 2026)', url: 'https://www.jpmorganchase.com/institute/all-topics/business-growth-and-entrepreneurship/ai-adoption-gap-gender-generation-among-small-business-owners' },
    { org: 'Yale School of Management', title: 'Teaching through a technological revolution (2026)', url: 'https://som.yale.edu/story/2026/teaching-through-technological-revolution' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Where things stand', kind: 'learn', title: 'You are not behind', nova: 'Deep breath, boss. You don\'t need every app. You need a plan.',
      text: 'It can feel like everybody else already uses AI for everything. The numbers say otherwise. Most small business owners are still figuring it out, and the ones who started slow and steady are doing just fine.',
      table: { head: ['What the research found', 'Source'], rows: [
        ['About 4 in 10 small businesses were using AI or planning to', 'Federal Reserve Bank of San Francisco, 2026'],
        ['At the end of 2025, about 17% of women-owned small businesses paid for an AI tool, versus about 20% of men-owned', 'JPMorganChase Institute, May 2026'],
        ['Baby Boomer owners paid for AI about half as often as Millennials (10% vs 22%)', 'JPMorganChase Institute, May 2026'],
        ['The top reasons owners hold back: privacy worries, wrong answers, and not knowing how to start', 'Federal Reserve Bank of San Francisco, 2026'],
      ] },
      tip: 'The gap is closing fast. Learning a little now, on purpose, puts you ahead of most sellers your size.' },
    { kind: 'quiz', q: 'According to the San Francisco Fed, what\'s one of the top reasons small business owners haven\'t started with AI?', options: ['AI is illegal for small businesses', 'Not knowing how to start', 'It only works on computers made this year'], answer: 1, why: 'Owners named privacy, accuracy and simply not knowing how to begin. This course fixes the last one.' },

    { chapter: 'AI brain fry is real', kind: 'learn', title: 'More tools, less done', text: 'In March 2026, Harvard Business Review published a study by Boston Consulting Group of 1,488 U.S. workers. The researchers named a new problem: "AI brain fry," the mental fatigue that comes from juggling too many AI tools and constantly checking their work.',
      table: { head: ['Finding', 'What it means for you'], rows: [
        ['People got more done with three or fewer AI tools', 'Pick a small set and stop shopping'],
        ['With four or more tools, productivity dropped sharply', 'Every new app costs attention, even a free one'],
        ['Heavy checking of AI work meant 14% more mental effort and 19% more information overload', 'Give AI jobs that are easy to check'],
        ['People with brain fry made more mistakes and were more likely to want to quit', 'Overload shows up in your orders and your mood'],
        ['Brain fry went down when people got training and a clear plan', 'A system beats more apps'],
      ] } },
    { kind: 'learn', title: 'The signs of brain fry', text: 'It sneaks up on you. If two or more of these sound familiar, you\'re using AI in a way that costs more than it saves.',
      points: ['You open three AI apps to write one caption', 'You spend longer fixing AI drafts than writing it yourself would take', 'You keep re-asking the same question hoping for a better answer', 'You feel foggy or snappy after a long AI session', 'You can\'t remember which app holds which saved chat', 'You signed up for a free trial you forgot to cancel'],
      tip: 'The fix is never "try harder." It\'s fewer tools, clearer jobs and set times.' },
    { kind: 'scenario', title: 'Tasha\'s app pile', situation: 'Tasha pays for four AI apps: one for captions, one for photos, one for planning and one "all-in-one." She feels busier than before she started.',
      options: [
        { text: 'Add a fifth app that promises to organize the other four', feedback: 'That\'s the trap. More tools was exactly the problem in the research.' },
        { text: 'Keep one assistant for writing and planning, one for images, and cancel the rest', best: true, feedback: 'Two tools with clear jobs. She saves money and her brain gets quiet again.' },
        { text: 'Quit AI for good', feedback: 'She\'d lose the hours it really does save. Trimming beats quitting.' },
      ] },

    { chapter: 'The three-tool rule', kind: 'learn', title: 'One tool, one job', text: 'Give each AI tool one clear job, like hiring a person. If you can\'t say its job in one sentence, you don\'t need it yet. Most live sellers need two, and never more than three.',
      table: { head: ['Job', 'One good choice', 'Skip if…'], rows: [
        ['Writing and planning: captions, scripts, emails, themes', 'One AI assistant, such as Claude or ChatGPT', 'Never skip. This one saves the most time'],
        ['Designs: posters, graphics, thumbnails', 'Canva (with its built-in AI)', 'You already like your poster templates'],
        ['Photos: brighter pictures, clean backgrounds', 'Your phone\'s built-in photo editor', 'Your photos already look good'],
      ] },
      tip: 'Before you add anything new, ask: which tool does this replace? If the answer is "none," wait a month.' },
    { kind: 'order', title: 'Trim your tools', prompt: 'Put these steps in order for cleaning up your AI apps.', steps: ['List every AI app you use or pay for', 'Write the one job each one does', 'Circle the one that does each job best', 'Cancel or delete the rest', 'Save your best prompts in one note'] },
    { kind: 'number', title: 'What the pile costs', q: 'You pay for four AI apps at $20, $12, $15 and $10 a month. You keep only the $20 one. How much do you save in a year?', prefix: '$', answer: 444, hint: 'Add up the three you cancel, then times 12.', why: '$12 + $15 + $10 = $37 a month, times 12 = $444 a year. That\'s a lot of inventory.' },

    { chapter: 'Batch it', kind: 'learn', title: 'Set AI hours, not all-day AI', text: 'The same research found that people did better when they grouped AI-heavy work into set blocks of time, and took a break before big decisions. For a live seller, two short blocks a week covers almost everything.',
      table: { head: ['Block', 'When', 'What you do with AI'], rows: [
        ['Plan block (30 minutes)', 'Sunday evening', 'Live themes, posters, captions for the week, vendor emails'],
        ['Polish block (20 minutes)', 'The morning of a live', 'Your pitch lines, a giveaway post, a last-minute fix'],
        ['No-AI time', 'During the live and while packing', 'You, your buyers and your boxes'],
      ] },
      example: 'Dee used to open her AI app twenty times a day. Now she does one Sunday block. Same captions, and she gets her evenings back.' },
    { kind: 'learn', title: 'Give AI work that\'s easy to check', text: 'Checking is the tiring part. So hand AI the jobs where you can tell at a glance if it\'s right, and keep the jobs where a mistake is costly and hard to spot.',
      table: { head: ['Easy to check (great for AI)', 'Hard to check (do it yourself or verify)'], rows: [
        ['Ten caption ideas', 'Sales tax rates and filing dates'],
        ['A polite vendor email', 'Whether a brand piece is authentic'],
        ['Live theme ideas for the month', 'Legal wording in your terms'],
        ['Shortening a long post', 'Shipping costs and weight limits'],
      ] } },
    { kind: 'tap', title: 'Practice: the right job', prompt: 'Which job is the best fit for your AI assistant?', screen: { title: 'Pick one for AI', buttons: ['Look up PA sales tax rules', 'Draft 10 hooks for Thursday', 'Check if a bag is real Coach', 'Decide your profit margin'] }, answer: 'Draft 10 hooks for Thursday', hint: 'Pick the one you can check at a glance.' },

    { chapter: 'Stay the boss', kind: 'learn', title: 'You decide, AI assists', text: 'Yale School of Management added an AI course to its MBA core in 2026. Their teachers say the skill that matters now is deciding what problem to solve and telling whether the answer is right. Yale also warns that AI tends to flatter you. It agrees too easily.',
      points: ['Ask "What\'s wrong with this idea?" not "Is this a good idea?"', 'Ask it to argue the other side before you decide', 'Think first, then ask. Write your own rough answer before you open the app', 'If it sounds too good, check it'],
      tip: 'Try this prompt: "Be my tough business coach. Here\'s my plan: [plan]. Give me the three biggest risks, honestly."' },
    { kind: 'scenario', title: 'The flattering answer', situation: 'You ask an AI, "Is raising all my prices by $10 a good idea?" It says, "What a smart move! Your buyers will love the premium feel."',
      options: [
        { text: 'Raise every price tonight', feedback: 'AI tends to agree with you. One cheerful answer isn\'t a business decision.' },
        { text: 'Ask it: "Give me the three biggest risks of this, and a safer way to test it"', best: true, feedback: 'Exactly what Yale suggests. Make it push back, then test on a few pieces first.' },
        { text: 'Ask four other AI apps and average the answers', feedback: 'That\'s brain fry in the making, and they can all flatter you the same way.' },
      ] },

    { chapter: 'Skip the hype', kind: 'learn', title: 'The five-minute test for any new AI app', text: 'Someone in a group swears by a new AI app. Before you sign up, run it through five quick questions. Two "no" answers and you can let it go with a clear conscience.',
      table: { head: ['Question', 'A good sign'], rows: [
        ['What one job would it do for me?', 'You can say it in one sentence'],
        ['Which tool would it replace?', 'It replaces one, it doesn\'t add one'],
        ['What does it do with my data?', 'A plain privacy page; you can turn off training on your chats'],
        ['What does it cost after the trial?', 'The real monthly price is easy to find'],
        ['Who\'s behind it?', 'A real company with a support page, not just ads'],
      ] },
      tip: 'Be extra careful with any AI app that promises guaranteed income. The FTC has brought many cases against AI "make money" schemes aimed at small business owners.' },
    { kind: 'quiz', q: 'A new AI app promises it will "run your whole business on autopilot and guarantee $5,000 a month." What\'s the best move?', options: ['Sign up before the price goes up', 'Skip it; guaranteed-income promises are a classic red flag', 'Buy it and cancel your other apps'], answer: 1, why: 'Real tools describe a job they do. Promises of guaranteed earnings are exactly what the FTC has gone after.' },
    { kind: 'reflect', title: 'Your AI line-up', prompt: 'Write your two or three AI tools and the one job each one does. Then write which day and time your AI block will be.', placeholder: 'Tool 1: … job: … Tool 2: … My AI block: …', example: 'Claude: captions, scripts and vendor emails. Canva: posters. My AI block: Sunday 7 to 7:30 PM.' },
    { kind: 'checklist', title: 'Calm AI plan', prompt: 'Tick these off this week.', items: ['List every AI app I have', 'Keep three or fewer, one job each', 'Cancel trials and apps I don\'t need', 'Set my weekly AI block on my calendar', 'Save my best prompts in one note', 'Ask AI for the risks, not just the praise'] },
  ],
}
export default lesson
