import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'herpower', kind: 'course', school: 'Mindset and motivation', title: 'Her seat at the table: change the narrative', track: 'Business', icon: 'sparkle',
  why: "Business was long run as a man's world, and too many rooms still act like it. Women, and Black women most of all, are rewriting that story right now. This course helps you take your place in it with confidence.",
  outcomes: [
    'Know the real numbers on women and Black women in business today',
    'Reframe "imposter" feelings and the rooms that cause them',
    'Price and ask for your worth without apologizing',
    'Tell your story in a way that builds your brand',
    'Find the programs, money and networks built for women owners',
  ],
  route: { to: '/consult', label: 'Book time with the Queen' },
  sources: [
    { org: 'Wells Fargo (with Ventureneer, CoreWoman and WIPP)', title: '2025 Impact of Women-Owned Businesses', url: 'https://smallbusinessresources.wf.com/wp-content/uploads/2025/01/wells-fargo-2025-impact-of-women-owned-businesses.pdf' },
    { org: 'Harvard Business Review (Tulshyan and Burey)', title: 'Stop telling women they have imposter syndrome', url: 'https://hbr.org/2021/02/stop-telling-women-they-have-imposter-syndrome' },
    { org: 'U.S. Small Business Administration', title: "Women's Business Centers", url: 'https://www.sba.gov/local-assistance/resource-partners/womens-business-centers' },
    { org: 'U.S. Small Business Administration', title: 'Women-owned businesses', url: 'https://www.sba.gov/business-guide/grow-your-business/women-owned-businesses' },
  ],
  queen: {
    welcome: "This course is close to my heart. Women, and Black women especially, are building businesses at a pace the world has never seen. I want you to walk into every room, every vendor meeting and every live like you belong there, because you do.",
    signoff: "Price with confidence, ask for what you're worth, and tell your story proudly. Every time you go live, you're changing the picture for the women watching. Take your seat.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'The real story', kind: 'learn', title: 'Look how far we have come', nova: "Sis, this one is personal. Sit up tall. You belong in every room you walk into.",
      text: "For generations, women couldn't easily get a business loan or credit card in their own name. That changed in the U.S. only in 1974, with the Equal Credit Opportunity Act. Look where women are now. The 2025 Wells Fargo report on women-owned businesses counted about 14.5 million women-owned firms in 2024, nearly 4 in 10 U.S. businesses.",
      table: { head: ['Women-owned businesses (2024)', 'Number'], rows: [
        ['Firms', '14.5 million (39.2% of all firms)'],
        ['Revenue', '$3.3 trillion'],
        ['Growth in firms, 2019 to 2024', '+17.1% (men-owned: +11.9%)'],
        ['Growth in revenue, 2019 to 2024', '+53.8%'],
      ] } },
    { kind: 'learn', title: 'Black women are building', text: "The same report counted about 2 million businesses owned by Black women in 2024, with their revenue up about 81% since 2019. Black women-owned businesses with employees grew about 51% in number, roughly three times the rate for all women-owned employer firms.",
      points: ['The gap is real too: the average Black, Hispanic or Asian American woman-owned employer firm brings in about half what a white woman-owned one does', 'The report estimates that closing that gap would add $832 billion to the economy', 'That gap is about access to money, networks and buyers, not ability'],
      tip: "When someone says \"that's not for people like us,\" the numbers say otherwise. You're part of the fastest-moving story in American business." },
    { kind: 'quiz', q: 'According to the 2025 Wells Fargo report, about what share of U.S. businesses are women-owned?', options: ['About 1 in 10', 'About 2 in 10', 'Nearly 4 in 10', 'More than 7 in 10'], answer: 2, why: 'Women own 39.2% of U.S. firms, about 14.5 million businesses. You are in very good company.' },

    { chapter: "It's not you", kind: 'learn', title: 'Rethink "imposter syndrome"', text: "In a widely read Harvard Business Review article, Ruchika Tulshyan and Jodi-Ann Burey pointed out that the idea of imposter syndrome was first studied in high-achieving women, and that it tends to blame the woman for feeling out of place, instead of looking at rooms that were never built for her. Feeling unsure in a new role is normal. Feeling unwelcome is often about the room, not you.",
      points: ['Name it: "This is new," not "I\'m a fraud"', 'Notice the room: who built it, and who it was built for?', 'Collect proof: your sales, kind messages and finished courses', 'Find your people: rooms where women like you lead'] },
    { kind: 'scenario', title: 'The vendor meeting', situation: "At a wholesale market, a vendor keeps talking to your husband about pricing, even though it's your business and he's just carrying boxes.",
      options: [
        { text: 'Stay quiet and let your husband handle it so things stay smooth', feedback: "It keeps the peace today, but the vendor learns to bypass you, and you lose control of your own deals." },
        { text: 'Step in warmly and clearly: "I\'m the owner, so I\'ll be placing the order. Let\'s talk case pricing."', best: true, feedback: "Calm, confident, no drama. You set the record straight and get back to business. Ask your partner ahead of time to point vendors to you." },
        { text: 'Walk away and never use that vendor again', feedback: "That's your right, but try the direct line first. Many people correct course fast once they're told." },
      ] },
    { kind: 'script', title: 'Owner lines', text: 'Short, warm and clear. Practice them out loud.', lines: [
      '"I\'m the owner. I make the buying decisions."',
      '"Let\'s talk numbers. What\'s your best case price?"',
      '"That doesn\'t work for my business. Here\'s what does."',
      '"I\'ll think it over and get back to you by Friday."',
      '"Please send that in writing so I have it for my records."',
    ] },

    { chapter: 'Know your worth', queen: "Say your price, then stop talking. Silence after a price is confidence, not rudeness.", kind: 'learn', title: 'Stop apologizing for your prices', text: "Many women are taught to keep the peace, so they discount before anyone asks. In business, that habit costs real money. Your price pays for your time, your eye for style, your packing and your service.",
      table: { head: ['Instead of', 'Say'], rows: [
        ['"Sorry, I know it\'s a lot…"', '"This one is $32. It\'s real leather and it will last."'],
        ['"I can do it cheaper if you want"', '"Bundle it with the earrings and I\'ll do both for $40."'],
        ['"I hate to ask, but can you pay?"', '"Friendly reminder: your invoice is due today. Thank you!"'],
      ] } },
    { kind: 'number', title: 'What the discount costs', q: 'You habitually knock $3 off pieces that cost you $10 and sell for $25. You sell 40 a month. How much profit do the "just because" discounts cost you each month?', prefix: '$', answer: 120, hint: '$3 × 40.', why: "$120 a month is $1,440 a year, from habit alone. That's a new ring light, a month of supplies, or money in YOUR pocket." },

    { queen: "Always ask for one more thing: better terms, free shipping, first pick. The worst they can say is no, and they often say yes.", kind: 'learn', title: 'Negotiate like you mean it', text: "Negotiating isn't being pushy. It's business. Vendors expect it, and a few dollars per piece adds up fast.",
      points: ['Know your number before you walk in: the most you can pay and still keep your profit', 'Ask for case or volume pricing, free shipping over a set amount, or a first-order discount', 'Be quiet after you ask. Let them answer.', 'Get the deal in writing (an email or invoice)', 'Be ready to walk away kindly: "Thank you, that doesn\'t work for me this time."'] },
    { kind: 'number', title: 'A small ask, a big result', q: 'You negotiate $1.50 off each piece on a vendor order of 200 pieces. How much do you save?', prefix: '$', answer: 300, hint: '$1.50 × 200.', why: "$300 saved on one order, just by asking. Do that on four orders a year and that's $1,200 back in your business." },
    { kind: 'scenario', title: 'The comment on your live', situation: 'A stranger comments on your live: "Who told you that you could run a business? Stick to cooking." Your regulars see it.',
      options: [
        { text: 'Stop the live to argue with him', feedback: "That hands your stage, and your buyers' attention, to the one person who isn't buying." },
        { text: 'Hide or delete the comment, block him, and keep selling with a smile ("Back to business, ladies! Next up…")', best: true, feedback: "You protect your space and your energy, and your community watches you stay classy. That IS changing the narrative." },
        { text: 'Let it stay and feel bad the rest of the night', feedback: "You don't owe trolls space on your Page. Hide, block and move on." },
      ] },

    { chapter: 'Change the narrative', kind: 'learn', title: 'Your story is your brand', text: "People buy from people. The story of why you started, what you've overcome and who you serve is one of the strongest things your brand owns. Telling it changes the story for every woman watching you.",
      points: ['Where you started ("I started this in my basement with $300")', 'What you overcame (share only what you are comfortable sharing)', 'Who you do it for ("For the woman who thinks style isn\'t in her budget")', 'Where you are going ("Next year: my first storefront")'] },
    { kind: 'reflect', title: 'Write your story', prompt: 'Write your story in 4 sentences: where you started, what you overcame, who you serve, where you are going.', placeholder: 'I started… I overcame… I serve… I am going…', example: 'I started selling my own closet after I was laid off at 54. I learned live selling from YouTube at 2 AM. I serve grown women who still love to dress up. Next year I\'m hiring my niece.' },

    { kind: 'learn', title: 'Every live changes the picture', text: "When a woman sees someone who looks like her, sounds like her and is her age running a real business, it changes what she believes she can do. Each time you go live as the owner, you widen the picture of who a business owner is.",
      points: ['Say "my business," "my team," "my shop" with pride', 'Show the back room: your bins, your labels, your system', 'Celebrate milestones with your community so they share the win', 'Lift other women: shout out sellers you admire and share what you learn'] },

    { chapter: 'Get your support', kind: 'learn', title: 'Help built for women owners', text: "There are programs created just for women business owners. Most are free or low cost.",
      table: { head: ['Resource', 'What it offers'], rows: [
        ["SBA Women's Business Centers", 'Free or low-cost training, coaching and help finding funding, in person and online'],
        ['SBA women-owned business guide', 'Programs, certifications and contracting help for women owners'],
        ['SCORE', 'Free volunteer business mentors, including women mentors'],
        ['Local women\'s and Black business groups', 'Networks, events, referrals and grant alerts'],
        ['Time with the Queen (in the app)', 'One-on-one strategy from a seasoned woman founder'],
      ] },
      tip: 'Be careful with grant offers that ask you to pay a fee to apply. Real grants rarely charge to apply.' },
    { kind: 'checklist', title: 'Take your seat', prompt: 'Tick what you will do this month.', items: ['Practice my owner lines out loud', 'Stop discounting without a reason for one month', 'Write my 4-sentence story and pin it to my Page', 'Find my nearest Women\'s Business Center', 'Join one women\'s business group or network', 'Tell one woman about my journey and encourage her to start hers'] },
  ],
}
export default lesson
