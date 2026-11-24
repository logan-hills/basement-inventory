import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'social', kind: 'course', school: 'Social media', title: 'Social media that sells', track: 'Business', icon: 'live',
  why: 'Social media is your storefront window. Done right, it fills your lives while you sleep.',
  outcomes: [
    'Pick the one or two platforms worth your time',
    'Set up a Page that turns visitors into live viewers',
    'Film Reels that sell with just a phone and a window',
    'Use five proven video ideas for live sellers',
    'Plan a full week of posts in one sitting',
  ],
  sources: [
    { org: 'HubSpot Academy', title: 'Facebook marketing training (free)', url: 'https://academy.hubspot.com/courses/facebook-marketing-training' },
    { org: 'Federal Trade Commission', title: 'Disclosures 101 for social media influencers', url: 'https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers' },
  ],
  queen: {
    welcome: "Social media is your storefront window, and it can fill your lives while you sleep. I'll show you what to post, how often, and how to stay out of trouble.",
    signoff: "Keep your Page fresh, post videos people want to watch, and answer every 'price?' comment kindly. Your window is open for business.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Pick your platforms', kind: 'learn', title: 'Go where your buyers are', nova: "You don't need to be everywhere. You need to be where SHE is.",
      text: "Pick one home base and one helper. Do those two well for 90 days before you add anything else. Spreading thin across six apps is the fastest way to burn out and grow nowhere.",
      points: ['Home base: where you go live and sell (for most of our sellers, Facebook)', 'Helper: where new people discover you (Facebook Reels, Instagram Reels or TikTok)', 'Everything else: only after the first two are steady'] },
    { kind: 'quiz', q: "You're just starting. How many platforms should you post on daily?", options: ['All of them', 'One or two, done well', 'None until you\'re famous'], answer: 1, why: 'Consistency on two beats burnout on six.' },

    { chapter: 'A Page that works for you', queen: "Update your cover photo for every season or big live. A fresh window tells people the shop is open.", kind: 'learn', title: 'Your Page is your storefront', text: "When someone new taps your name, you have about five seconds to tell them what you sell, when you go live, and why they should follow. Check these four spots today.",
      points: [
        'Profile photo: your smiling face or a clear logo. Same photo on every platform.',
        'Cover photo: your live days and times, in big letters ("LIVE Tue & Thu 7 PM ET")',
        'Bio or intro: who it\'s for, what you sell, price range, when you\'re live',
        'Pinned post: "How to shop my lives" (copy one on the next slide)',
      ] },
    { kind: 'script', title: 'Bio and pinned post, ready to copy', lines: [
      'BIO: "Boutique jewelry & bags at basement prices 💎 Most pieces under $20 · LIVE Tue & Thu 7 PM ET · Ships in 3 business days"',
      'PINNED POST: "New here? Welcome! 💛 Here\'s how to shop my lives:',
      '1. Tap Follow and turn on notifications so you see when I go live (Tue & Thu, 7 PM ET).',
      '2. Comment SOLD and the Live Number to claim a piece. First comment wins.',
      '3. Your invoice comes after the live. Pay within 24 hours to keep your pieces.',
      '4. Orders ship within 3 business days with tracking.',
      'Questions? Message me any time. I answer within a day."',
    ], tip: 'Your pinned post answers the questions you get asked 20 times a week. It saves you hours.' },

    { chapter: 'Content that converts', kind: 'learn', title: 'Show, tell, sell', text: "If every post is \"buy, buy, buy,\" people tune out. Mix three kinds through the week. A good ratio is 3 show, 1 tell, 1 sell.",
      table: { head: ['Kind', 'What it is', 'Examples'], rows: [
        ['Show (3)', 'The pieces, in action', 'Try-ons, "3 ways to wear this scarf," close-ups, unboxing a new haul'],
        ['Tell (1)', 'You and your story', 'Why you started, packing orders, your grandkids helping, a win'],
        ['Sell (1)', 'The invitation', 'The poster, the countdown, the "last chance" before the live'],
      ] } },
    { kind: 'learn', title: 'Five video ideas that work for live sellers', text: 'Never stare at a blank screen again. Rotate these.',
      points: [
        'The haul: "I just got 200 new pieces. Here are my top 5."',
        'Style it 3 ways: one bag, three outfits (work, church, date night)',
        'The under-$20 challenge: build a full look and show the total',
        'Pack an order with me: tissue, thank-you card, tape. Quiet, satisfying, no talking needed',
        'Real buyer love: a buyer\'s photo or message (with permission) and "this is why I do it"',
      ] },
    { kind: 'reflect', title: 'Your first three videos', prompt: 'Using the five ideas, write down the next three videos you\'ll film and which piece goes in each.', placeholder: '1. …', example: '1. Style the emerald crossbody 3 ways. 2. Pack an order for a regular. 3. Under-$20 church look with the pearl set.' },

    { chapter: 'Film a Reel that sells', kind: 'learn', title: 'The phone-only setup', nova: 'Grab your phone. Natural light. Let\'s go.',
      text: "You don't need gear. You need light, steadiness and the right shape.",
      points: ['Face a window in the daytime. Light on your face, not behind you.', 'Hold the phone upright (vertical) and wipe the lens', 'Lean it on books or a $15 tripod so it doesn\'t shake', 'Film 10 to 30 seconds. Short gets watched to the end, and finished videos get shown to more people.', 'Turn on auto-captions: most people watch with the sound off'] },
    { kind: 'learn', title: 'The 4-beat Reel recipe', text: 'Every selling Reel has the same four beats. Here\'s a worked example for a $12 bag.',
      table: { head: ['Seconds', 'Beat', 'Example'], rows: [
        ['0 to 2', 'Hook', 'On screen: "This bag looks like $120." You hold it up.'],
        ['2 to 8', 'Close-up', 'Hardware, stitching, inside pockets. Slow and steady.'],
        ['8 to 14', 'On you', 'Over your shoulder, walk two steps, turn.'],
        ['14 to 18', 'The invite', 'On screen: "$12 · Live Thursday 7 PM ET"'],
      ] } },
    { kind: 'order', title: 'Reel recipe', prompt: 'Put the Reel in order.', steps: ['Hook: "This bag looks like $120…"', 'Close-up of the piece', 'Show it styled on you', 'Live day, time and price'] },
    { kind: 'quiz', q: 'Why add captions to your videos?', options: ['Most people scroll with the sound off', 'It\'s required by law', 'It makes the video longer'], answer: 0, why: 'Captions keep silent scrollers watching.' },

    { chapter: 'Talk back and stay safe', kind: 'learn', title: 'The first hour matters', text: "Answer comments in the first hour after you post. Every reply tells the app people care about the post, so it shows it to more people. It also tells buyers you're real and paying attention.",
      points: ['Reply to every comment with a question back ("Which color would you pick?")', '"Price?" gets the price AND the live time, every time', 'Thank people by name. It costs nothing and they remember.'] },
    { queen: "Answer every price comment warmly and invite them to the live. That comment is a buyer raising her hand.", kind: 'scenario', title: 'The "price?" comment', situation: 'Someone you\'ve never seen before comments "price?" on your Reel of a pearl set.',
      options: [
        { text: 'Ignore it. If she really wants it she\'ll come to the live.', feedback: 'Curious strangers are your next regulars. Silence sends them to another seller.' },
        { text: '"Hi Angela! It\'s $14, and it\'s on Thursday\'s live at 7 PM ET. Tap Follow so you get the reminder 💛"', best: true, feedback: 'Name, price, when, and one easy next step. That\'s how a stranger becomes a buyer.' },
        { text: '"DM me"', feedback: "It makes her do extra work, and everyone else with the same question scrolls on." },
      ] },
    { kind: 'learn', title: 'A Group for your regulars', text: "Once you have a handful of loyal buyers, start a Facebook Group linked to your Page (\"Dazzle Fam VIPs\"). Groups feel like a living room instead of a storefront. Members see more of your posts, talk to each other, and bring friends.",
      points: ['Post early sneak peeks there first ("VIPs see it before anyone")', 'Ask for opinions: "Which color should I order more of?"', 'Share buyer hauls and birthdays', 'Keep the rules short and pinned: kindness, no spam, no selling by members'],
      tip: "A Group is a bonus, not a must. Start one when you have about 25 regulars, not before." },
    { kind: 'quiz', q: 'Your Reel has 2 seconds to grab someone. What goes first?', options: ['"Hey y\'all, welcome back to my page"', 'Your logo for 3 seconds', 'The most exciting thing: the price, the piece, or a bold line'], answer: 2, why: 'Lead with the best part. Intros and logos are when people swipe away.' },
    { kind: 'learn', title: 'Stay out of trouble', text: 'A few habits keep your Page, your Reels and your lives safe.',
      points: [
        'No designer brand names, and never call a piece "inspired" by a brand. Describe it instead: "quilted chain crossbody."',
        'No copyrighted music in lives. It gets your video muted or taken down.',
        'For Reels, use the app\'s own sound library, which is cleared for use there.',
        'Post your own videos. Re-uploads with another app\'s watermark usually get shown to fewer people.',
      ] },
    { kind: 'quiz', q: 'Which caption is safe for a quilted bag with a chain strap?', options: ['"Chanel-inspired bag, $15"', '"Quilted chain crossbody, looks like a million, $15"', '"Designer dupe, $15"'], answer: 1, why: 'Describe what it IS. Brand names and "inspired" or "dupe" can get posts removed and accounts flagged.' },

    { chapter: 'Plan the week', kind: 'learn', title: 'A sample week', text: 'Sit down once and plan it out. Film three or four clips at once. Here\'s a week for someone who goes live Tuesday and Thursday.',
      table: { head: ['Day', 'Post', 'Kind'], rows: [
        ['Mon', 'Style it 3 ways Reel', 'Show'],
        ['Tue', 'Morning "Tonight!" + live', 'Sell'],
        ['Wed', 'Pack an order with me', 'Tell'],
        ['Thu', 'Sneak peek Reel + live', 'Show + Sell'],
        ['Sat', 'Under-$20 challenge Reel', 'Show'],
      ] } },
    { kind: 'reflect', title: 'Your posting week', prompt: 'Which days will you post, and what kind of post (show, tell or sell) goes on each?', placeholder: 'Mon: …', example: 'Mon try-on (show), Tue poster + live (sell), Thu packing video (tell), Sat sneak peek (show).' },
  ],
}
export default lesson
