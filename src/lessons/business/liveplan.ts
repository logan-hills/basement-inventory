import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'liveplan', kind: 'course', school: 'Strategy and growth', title: 'Plan a live that sells out', track: 'Business', icon: 'live',
  why: 'The best lives look easy because the work happened the day before. Research from Wharton, McKinsey and Nielsen Norman Group shows why live selling works, and how to plan for it.',
  outcomes: [
    'Explain why live shopping works, using research from Wharton, McKinsey and Nielsen Norman Group',
    'Build a run of show: the order of pieces, the energy curve and the breaks',
    'Pick and price pieces so every live has openers, stars and add-ons',
    'Prep the room, the gear and the team with one checklist',
    'Review every live with numbers and make the next one better',
  ],
  route: { to: '/planner', label: 'Open Live planner' },
  sources: [
    { org: 'Knowledge at Wharton (University of Pennsylvania)', title: 'Why livestream commerce is on the rise', url: 'https://knowledge.wharton.upenn.edu/article/why-livestream-commerce-is-on-the-rise/' },
    { org: 'McKinsey & Company', title: 'It\'s showtime! How live commerce is transforming the shopping experience', url: 'https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/its-showtime-how-live-commerce-is-transforming-the-shopping-experience' },
    { org: 'McKinsey & Company', title: 'Ready for prime time? The state of live commerce', url: 'https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/ready-for-prime-time-the-state-of-live-commerce' },
    { org: 'Nielsen Norman Group', title: 'Livestream e-commerce: lessons from China', url: 'https://www.nngroup.com/articles/livestream-ecommerce-china/' },
  ],
  queen: {
    welcome: "The lives that look effortless are the ones planned the day before. I'll walk you through how I'd plan a live that sells out, with the research behind why it works.",
    signoff: "Plan your energy, price ahead, nail your opening 60 seconds, and look at your five numbers after every live. Do that, and your lives will get better every week.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Why lives sell', kind: 'learn', title: 'Shopping plus a show', nova: 'Here\'s a secret, boss: your live isn\'t a catalog. It\'s a show where people can buy. Let\'s plan it like one.',
      text: 'Researchers at Wharton describe livestream shopping as a mix of entertainment and buying, where viewers can ask questions and get answers in real time. McKinsey\'s research on live commerce found that the format can turn watchers into buyers far better than a regular online store, because shoppers see the product in use, hear a trusted host, and feel the energy of other people buying.',
      points: ['People come for the host as much as the product', 'Seeing a piece on a real person answers questions a photo can\'t', 'Live questions and answers build trust fast', 'Watching others buy makes it feel safe to buy too', 'Limited time and limited stock create honest urgency'] },
    { kind: 'learn', title: 'What shoppers told the researchers', text: 'Nielsen Norman Group, a leading user-experience research firm, studied how people shop on livestreams in China, where the format grew first and biggest. Their findings line up with what top live sellers do here.',
      table: { head: ['What viewers want', 'What it means for your live'], rows: [
        ['To see the product in real use', 'Try it on, turn it in the light, open the bag and show the inside'],
        ['A host they trust', 'Be honest about flaws and sizing, every time'],
        ['To ask and get answers now', 'Read questions out loud and answer by name'],
        ['A good deal', 'Say the value clearly: retail price vs your price'],
        ['Fun', 'Music, stories, games and giveaways between pieces'],
      ] },
      tip: 'Research is a guide, not a script. Your regulars will tell you what they love if you ask them.' },
    { kind: 'quiz', q: 'According to the research, why do live shoppers often buy more readily than on a regular website?', options: ['Prices are always lower on live', 'They see the piece in use and can ask a trusted host questions in real time', 'Websites don\'t allow returns'], answer: 1, why: 'Seeing it, asking about it and trusting the person showing it removes the doubts that stop people on a regular product page.' },

    { chapter: 'Pick the pieces', kind: 'learn', title: 'Openers, stars and add-ons', text: 'A live sells best when the pieces are chosen on purpose. Think of three kinds.',
      table: { head: ['Kind', 'What it is', 'How many in a 60-minute live'], rows: [
        ['Openers', 'Fun, low-priced pieces that get the first SOLD comments going', '5 to 8'],
        ['Stars', 'Your best, most wanted pieces. The reason people tune in.', '6 to 10'],
        ['Middles', 'Solid sellers at your usual price', '20 to 30'],
        ['Add-ons', '$5 to $10 pieces shown between bigger items', '8 to 12'],
      ] },
      example: 'A 60-minute jewelry live: 6 openers at $8, 8 star pieces at $35 to $60, 25 middles at $15 to $25, and a $5 add-on tray between every star.' },
    { kind: 'learn', title: 'Price before you go live', text: 'Pricing on the spot slows you down and leads to uneven prices. Price every piece the day before, with one simple rule so you never freeze on camera.',
      points: ['Know your cost for each piece, including shipping supplies', 'Aim for at least 2 to 3 times your cost on most pieces', 'Round to easy numbers: $12, $15, $20, $25', 'Write the price on the Live # card so you can read it on camera', 'Decide your sale or bundle deals ahead of time, not mid-live'] },
    { kind: 'number', title: 'How many pieces to pull', q: 'You show about one piece every 90 seconds. How many pieces do you need for a 60-minute live? (Round to the nearest whole piece.)', answer: 40, tolerance: 0, suffix: 'pieces', hint: '60 minutes is 3,600 seconds. Divide by 90.', why: '3,600 ÷ 90 = 40 pieces. Pull about 45 so you have a few backups. Pulling 150 "just in case" means an hour of putting things away.' },

    { chapter: 'The run of show', kind: 'learn', title: 'Plan the energy, not just the list', nova: 'TV shows plan every minute. You can plan yours in 15.',
      text: 'A run of show is the order of everything that happens on your live. TV producers use them so the energy never sags. Plan yours in blocks, with your best pieces spread out so people stay to the end.',
      table: { head: ['Time', 'Block', 'Goal'], rows: [
        ['0 to 5 min', 'Welcome, rules, quick giveaway', 'Let people arrive; teach "Type SOLD and the Live #"'],
        ['5 to 15 min', 'Openers, then first star', 'Get the first wave of SOLDs'],
        ['15 to 40 min', 'Middles with a star every 10 minutes', 'Keep the energy up'],
        ['40 to 50 min', 'Biggest star pieces', 'Reward people who stayed'],
        ['50 to 60 min', 'Last calls, bundles, thank-yous', 'Close strong and tease the next live'],
      ] } },
    { kind: 'order', title: 'Build the run of show', prompt: 'Put these blocks of a live in the best order.', steps: ['Welcome and claim rules', 'Openers at low prices', 'First star piece', 'Middles with stars spread out', 'Biggest star pieces', 'Last calls and next live date'] },
    { kind: 'scenario', title: 'Everyone left early', situation: 'You showed your three best handbags in the first 10 minutes. By minute 30, viewers dropped from 90 to 25.',
      options: [
        { text: 'Show the best pieces first again next time, that\'s when people are there', feedback: 'That gives people every reason to leave once the stars are gone.' },
        { text: 'Spread stars across the live and say what\'s coming: "At 8:40 I\'m showing the Coach bag"', best: true, feedback: 'Right. A reason to stay, said out loud, keeps people watching. TV calls it a tease, and it works.' },
        { text: 'Make the live shorter, only 15 minutes', feedback: 'Short lives can work, but you\'d still lose people after the stars. Plan the energy instead.' },
      ] },

    { chapter: 'Get the word out', kind: 'learn', title: 'Fill the room ahead of time', text: 'McKinsey notes that live commerce works best when the event is promoted ahead, like a TV premiere. Most viewers decide to show up before you hit Go Live.',
      points: ['Same day and time every week so it becomes a habit', 'Poster 2 days before and again 2 hours before', 'A short video of one star piece the night before', 'A reminder in your VIP group or text list 30 minutes before', 'Book your slot on the shared calendar early so you get your favorite time'] },
    { queen: "Open with energy and your best piece teased, not with 'let's wait for people to join.' The people watching now matter most.", kind: 'script', title: 'Your opening 60 seconds', text: 'The first minute sets the tone. Say this, then go.', lines: [
      '"Hey, hey! Welcome in, y\'all. Say hi and tell me where you\'re watching from!"',
      '"Tonight I\'ve got 8 gold pieces, 4 designer bags, and a $5 tray you\'re going to love."',
      '"Here\'s how to claim: type SOLD and the Live number. SOLD four-eight-two-one."',
      '"Share the live in the first 5 minutes and you\'re in tonight\'s giveaway."',
      '"At 8:40 I\'m showing the Coach bag, so don\'t go anywhere."',
    ], tip: 'Check your giveaway follows Facebook\'s promotion rules. Never require shares to enter if the platform doesn\'t allow it; check the current Page terms first.' },

    { chapter: 'Prep the room', kind: 'learn', title: 'The day-before checklist', text: 'Professional crews prep the set so the host only has to host. Do the same.',
      table: { head: ['Area', 'Get ready'], rows: [
        ['Pieces', 'Pulled in show order, on a rack or tray within reach, Live # cards on'],
        ['Light', 'Ring light or window light in front of you, never behind'],
        ['Sound', 'Quiet room; a $20 clip-on mic beats the phone mic'],
        ['Phone', 'Charged and plugged in, on a stand, Do Not Disturb on'],
        ['Internet', 'Close to the router, or use a wired adapter'],
        ['Comment bot', 'Connected and tested with a practice comment'],
        ['Helper', 'Knows her job: hand you pieces, watch for missed claims, answer questions'],
      ] } },
    { kind: 'tap', title: 'Name the fix', prompt: 'On your last live, viewers kept typing "can\'t see it." Your window was behind you. What do you fix first?', screen: { title: 'Prep checklist', buttons: ['Sound', 'Light', 'Internet', 'Helper'] }, answer: 'Light', hint: 'A bright window behind you turns you into a shadow. Light belongs in front of you.' },

    { chapter: 'Review and improve', queen: "Write your five numbers down the same night. Memory makes good lives sound better and bad lives sound worse.", kind: 'learn', title: 'Five numbers after every live', text: 'McKinsey advises brands to track live commerce with clear numbers so each event gets better. You only need five, and the Reports page gives you most of them.',
      table: { head: ['Number', 'What it tells you'], rows: [
        ['Peak viewers', 'Did your promotion work?'],
        ['Buyers', 'How many people said yes'],
        ['Buy rate (buyers ÷ viewers)', 'Did your pitch and claim rules work?'],
        ['Average order', 'Did add-ons and bundles work?'],
        ['Sell-through (sold ÷ shown)', 'Did you pick the right pieces?'],
      ] } },
    { kind: 'number', title: 'Sell-through', q: 'You showed 44 pieces and sold 33. What was your sell-through, in percent?', answer: 75, tolerance: 0.5, suffix: '%', hint: '33 ÷ 44 × 100.', why: '33 ÷ 44 = 75%. Look at the 11 that didn\'t sell. Were they the same style, the same price range or shown in the same slow block? That\'s your next fix.' },
    { kind: 'learn', title: 'Case study: from 22 sales to 41', text: 'Here\'s how one seller used planning, with nothing else changed but her prep.',
      table: { head: ['Before', 'After 4 weeks of planning'], rows: [
        ['Pulled pieces the hour before', 'Pulled and priced the day before, in show order'],
        ['Best bags shown first', 'Stars spread out, with a tease for the biggest one'],
        ['Poster the morning of', 'Poster 2 days and 2 hours ahead, plus a Reel'],
        ['No numbers kept', 'Five numbers written after every live'],
        ['22 sales, 58 peak viewers', '41 sales, 96 peak viewers'],
      ] },
      tip: 'This is an example to show how the pieces fit together. Your numbers will be your own. Track them and watch them move.' },
    { kind: 'reflect', title: 'Your next run of show', prompt: 'Plan your next live in blocks. Write your openers, your star pieces and when you\'ll show them, and your tease line.', placeholder: 'Openers… Stars at… My tease…', example: 'Openers: 6 pairs of $8 earrings. Stars at 8:15, 8:25, 8:40 and 8:50. Tease: "At 8:50 I\'m showing the vintage Dooney, so stay with me."' },
    { kind: 'checklist', title: 'Plan like a pro', prompt: 'Tick what you\'ll do for your next live.', items: ['Pick openers, stars, middles and add-ons', 'Price every piece the day before', 'Write a run of show in blocks', 'Post the poster 2 days and 2 hours ahead', 'Run the day-before prep checklist', 'Write my five numbers after the live'] },
  ],
}
export default lesson
