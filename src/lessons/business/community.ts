import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'community', kind: 'course', school: 'Brand and marketing', title: 'A following that stays: build a community, not just followers', track: 'Business', icon: 'users',
  why: "Followers can scroll past you. A community shows up, buys, shares and defends you. That is what keeps a shop alive through slow seasons and app changes.",
  outcomes: [
    'Know the difference between an audience and a community',
    'Move people up the ladder from stranger to superfan',
    'Run simple weekly rituals that make people feel they belong',
    'Keep your group warm, kind and safe with clear rules',
    'Track whether your following is growing in the ways that matter',
  ],
  route: { to: '/customers', label: 'Open Customers' },
  sources: [
    { org: 'Harvard Business Review (Fournier and Lee)', title: 'Getting brand communities right', url: 'https://hbr.org/2009/04/getting-brand-communities-right' },
    { org: 'Harvard Business Review', title: 'Turn your customers into your community', url: 'https://hbr.org/2020/01/turn-your-customers-into-your-community' },
    { org: 'Kevin Kelly, The Technium', title: '1,000 true fans', url: 'https://kk.org/thetechnium/1000-true-fans/' },
    { org: 'Federal Trade Commission', title: 'Disclosures 101 for social media influencers', url: 'https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers' },
  ],
  queen: {
    welcome: "Followers can scroll past you, but a community shows up. In this course, I want to help you build the kind of shop people feel they belong to.",
    signoff: "Start your rituals, let your members shine, and protect your group with kind house rules. A community is the strongest business asset you'll ever own.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Audience vs community', kind: 'learn', title: 'Two very different things', nova: "Followers are nice, boss. But a community? That's family. Family shows up.",
      text: "An audience watches you. A community is connected to you AND to each other. Researchers Susan Fournier and Lara Lee, writing in Harvard Business Review, found that strong brand communities are built around what members get from each other, not just from the brand. People stay for the people.",
      table: { head: ['Audience', 'Community'], rows: [
        ['Talks to you', 'Talks to each other too'],
        ['Leaves when a cheaper seller shows up', 'Stays because they belong'],
        ['Needs a new post to remember you', 'Reminds each other about your live'],
        ['Measured in followers', 'Measured in people who come back and take part'],
      ] } },
    { kind: 'learn', title: 'You need fewer people than you think', text: "Writer Kevin Kelly's well-known \"1,000 true fans\" idea says a creator can earn a living from a modest number of people who love what they do and buy most of what they make. For a live seller, the number can be even smaller.",
      example: "If 150 regulars each spend $40 a month, that is $6,000 a month in sales. You don't need 50,000 followers. You need 150 people who would be sad if you stopped." },
    { kind: 'number', title: 'Your true fan math', q: 'You want $4,500 a month in sales. Your regulars spend about $30 a month each. How many regulars do you need?', answer: 150, hint: '$4,500 ÷ $30.', why: '$4,500 ÷ $30 = 150 regulars. That is a room full of friends, not a stadium. Very doable.' },

    { chapter: 'The ladder', kind: 'learn', title: 'From stranger to superfan', text: "Everyone starts at the bottom. Your job is to give people an easy next step up.",
      table: { head: ['Step', 'Who they are', 'Your next move'], rows: [
        ['Stranger', 'Saw a Reel or a share', 'A clear bio and a pinned "how to shop with me" post'],
        ['Follower', 'Tapped Follow', 'Invite them to your next live by day and time'],
        ['Viewer', 'Watched a live', 'Say their name, answer their question'],
        ['Buyer', 'Bought once', 'Fast shipping and a thank-you message'],
        ['Regular', 'Buys most months', 'Invite to the VIP group, early looks'],
        ['Superfan', 'Shares, defends, brings friends', 'Spotlight them, ask their opinion, say thank you publicly'],
      ] } },
    { kind: 'tap', title: 'Next step up', prompt: 'Monique bought for the first time last night. Which move fits her step on the ladder?', screen: { title: 'Pick a move', buttons: ['Invite to VIP group', 'Fast shipping + thank-you', 'Ask her to co-host', 'Nothing yet'] }, answer: 'Fast shipping + thank-you', hint: 'She is a first-time buyer. Earn the second order first. The VIP invite comes when she becomes a regular.' },
    { kind: 'reflect', title: 'Your ladder today', prompt: 'Roughly how many people do you have at each step: followers, viewers, buyers, regulars, superfans? Where is the biggest drop?', placeholder: 'Followers… Viewers… Buyers… Regulars… Superfans…', example: '900 followers, 60 viewers, 18 buyers a live, 25 regulars, 5 superfans. Biggest drop: followers to viewers.' },

    { chapter: 'Rituals', kind: 'learn', title: 'Rituals make people belong', text: "Communities run on things that happen the same way every time. Rituals give people something to look forward to and something to talk about.",
      points: ['A live opener: the same greeting and song every time ("Hey hey, Dazzle Fam!")', 'Roll call: "Type where you\'re watching from!"', 'A weekly theme night (Tuesday Bling, Friday Bag Night)', 'A first-timer welcome: "First time here? Type FIRST and I\'ll say hi!"', 'A monthly thank-you giveaway for regulars (follow platform rules)', 'A name for your people (Dazzle Fam, Bling Sisters)'] },
    { kind: 'script', title: 'Lines that build belonging', text: 'Use these in every live. Make them sound like you.', lines: [
      '"Hey Dazzle Fam! Drop a heart if you made it, and tell me where you\'re watching from."',
      '"Brenda in Ohio! Girl, you never miss. Thank you."',
      '"First time here? Type FIRST. Welcome to the family. Here\'s how it works…"',
      '"Who already got last week\'s pearl set? Show the ladies how you styled it!"',
      '"Share the live and tag a friend who needs this bag in her life."',
    ] },
    { queen: "Feature a buyer's photo wearing her piece every week. People love to be celebrated, and others love to join them.", kind: 'learn', title: 'Let members shine', text: "Harvard Business Review's writing on customer communities keeps coming back to a simple truth: people engage more when they can contribute, not just consume. Give your members a stage.",
      points: ['Repost customer photos (with permission) as "Styled by the Fam"', 'Ask opinions: "Which color should I order more of?"', 'Feature a "Regular of the Month"', 'Let superfans help welcome new people in the group'] },

    { chapter: 'Your VIP group', queen: "Post your house rules on day one. It's much easier to keep a group kind than to fix one that isn't.", kind: 'learn', title: 'A group with house rules', text: "A Facebook Group for regulars works best when it feels warm and safe. Clear rules keep it that way and make moderating easy.",
      points: ['Be kind. No bashing other members or other sellers.', 'No selling your own items or links without asking', 'Keep personal info (addresses, phone numbers) out of the group; use private messages', 'Problems with an order? Message the Page so we can fix it fast', 'Paid or gifted partners say so clearly (the FTC requires clear disclosure)'] },
    { kind: 'scenario', title: 'Drama in the group', situation: 'Two members start arguing in the VIP group over who claimed a bag first. Others are taking sides.',
      options: [
        { text: 'Ignore it, it will blow over', feedback: "Unmanaged drama makes quiet members leave. A community is only as safe as its host." },
        { text: 'Post a calm comment ("Let\'s take this to messages, ladies, I\'ll sort it out"), turn off comments on that post, and message both privately with the facts from the claim list', best: true, feedback: "You protect the room, fix it in private, and use your records instead of opinions." },
        { text: 'Remove both members right away', feedback: "That may be needed for repeat issues, but for a first mix-up it feels harsh and others will notice." },
      ] },

    { kind: 'script', title: 'Your VIP group welcome post', text: 'Pin this to the top of your group. Short, warm and clear.', lines: [
      'Welcome to the [Group name], our inner circle! 💛',
      'This is where you get first looks, VIP-only deals and good company.',
      'House rules: be kind, keep personal info private, and message the Page for order help.',
      'Say hi below: tell us your name, where you live and your favorite thing you\'ve bought from us!',
      'New sneak peeks drop the night before every live. Turn on notifications so you don\'t miss them.',
    ] },
    { kind: 'scenario', title: 'Your biggest fan', situation: 'Tanya shares every live, answers newcomers\' questions in the group and has brought in at least eight new buyers. She has never asked for anything.',
      options: [
        { text: 'Nothing. She clearly enjoys it.', feedback: "She does, but people who feel unseen eventually drift. Superfans need to know they matter." },
        { text: 'Thank her publicly on the next live, send a handwritten note with a small gift in her next order, and ask her opinion on new stock', best: true, feedback: "Recognition, a personal touch and a voice in the shop. That's how superfans stay superfans." },
        { text: 'Pay her to promote you without telling anyone', feedback: "If you pay or gift someone to promote you, the FTC expects that relationship to be clearly disclosed. Keep it honest." },
      ] },
    { kind: 'reflect', title: 'Your rituals', prompt: 'Pick your community name, your live opener and one weekly ritual. Write them down.', placeholder: 'Our name… Our opener… Weekly ritual…', example: 'Name: the Bling Sisters. Opener: "Hey hey, Sisters, grab your coffee!" Ritual: Friday Bag Night with a $10 bag in every live.' },

    { chapter: 'Keep it growing', kind: 'learn', title: 'Measure what matters', text: "Follower counts feel good, but they don't pay the bills. Watch the numbers that show a real community.",
      table: { head: ['Number', 'Why it matters', 'Where to see it'], rows: [
        ['Repeat buyers this month', 'Your community spending', 'Customers'],
        ['Returning viewers', 'People who come back', 'Your live stats'],
        ['Comments per live', 'People taking part', 'Your live stats'],
        ['Shares per live', 'Members recruiting for you', 'Your live stats'],
        ['Group posts by members', 'People talking to each other', 'Group insights'],
      ] } },
    { kind: 'quiz', q: 'Which number tells you the most about your community?', options: ['Total followers', 'How many buyers came back this month', 'How many posts you made', 'How many Reels went viral'], answer: 1, why: 'Repeat buyers show people trust you enough to come back. Followers can be bought or lost overnight; regulars are earned.' },
    { kind: 'checklist', title: 'Build your community', prompt: 'Tick what you will start this month.', items: ['Give my people a name', 'Pick a live opener and use it every time', 'Add a first-timer welcome to every live', 'Start or tidy my VIP group with house rules', 'Feature one customer photo a week (with permission)', 'Track repeat buyers and shares each month'] },
  ],
}
export default lesson
