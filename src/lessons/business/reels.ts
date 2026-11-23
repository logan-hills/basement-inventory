import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'reels', kind: 'course', school: 'Social media', title: 'Reels that sell: hooks, filming and editing on your phone', track: 'Business', icon: 'live',
  why: 'One great 20-second video can bring more new buyers to your live than a week of posts, and it can even pay you.',
  outcomes: [
    'Write a hook that stops the scroll in the first 2 seconds',
    'Use five proven Reel formats that fit live selling',
    'Film with your phone: light, sound and framing that look premium',
    'Edit fast in a free app with captions and trending audio',
    'Read your Reel numbers and make the next one better',
  ],
  route: { to: '/planner', label: 'Open Live Planner' },
  sources: [
    { org: 'Meta for Creators', title: 'Facebook Content Monetization', url: 'https://creators.facebook.com/tools/facebook-content-monetization' },
    { org: 'HubSpot Academy', title: 'Facebook marketing training (free)', url: 'https://academy.hubspot.com/courses/facebook-marketing-training' },
    { org: 'Federal Trade Commission', title: 'Disclosures 101 for social media influencers', url: 'https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Why short video', kind: 'learn', title: 'Your 24-hour billboard', nova: 'Lights, camera, Nova! Short videos are your storefront window, and they work while you sleep.',
      text: 'Feeds now favor short vertical video, and Reels are shown to people who don\'t follow you yet. That makes them the cheapest way to reach new buyers. On Facebook, eligible creators can also earn from views through Meta\'s content monetization program.',
      points: ['Reach: shown to non-followers', 'Proof: buyers see the piece moving, on a real person', 'Reminder: every Reel can end with your next live day and time', 'Bonus: some Reels earn money on their own'] },

    { chapter: 'The hook', kind: 'learn', title: 'Two seconds to win', text: 'Most people decide in the first second or two whether to keep watching. Your hook is the first line AND the first picture.',
      table: { head: ['Hook type', 'Example'], rows: [
        ['Price shock', '"This bag retails for $180. I\'m selling it Tuesday for $35."'],
        ['Question', '"Would you wear this to church or to brunch?"'],
        ['Before and after', 'Plain outfit, snap, styled with the piece'],
        ['Secret', '"The one accessory that makes a $20 dress look expensive"'],
        ['Countdown', '"3 pieces you\'ll see first on Thursday\'s live"'],
      ] },
      tip: 'Put the hook in big text on screen too. Many people watch with the sound off.' },
    { kind: 'quiz', q: 'Which opening is the strongest hook?', options: ['"Hi y\'all, so um, today I wanted to show…"', '"This $12 bracelet looks like $200. Watch."', 'Five seconds of your logo'], answer: 1, why: 'It starts with a surprising promise in the first second. Greetings and logos make people scroll.' },

    { chapter: 'Five formats', kind: 'learn', title: 'Formats that fit live sellers', text: 'Rotate these so your feed stays fresh.',
      table: { head: ['Format', 'Length', 'How'], rows: [
        ['Sneak peek', '10 to 20 sec', '3 pieces from the next live, ending with day and time'],
        ['Style it 3 ways', '20 to 30 sec', 'One piece, three outfits, quick cuts'],
        ['Unboxing a haul', '20 to 40 sec', 'Open the box, react to the best finds'],
        ['Pack an order', '15 to 25 sec', 'Wrap a piece with care, add the thank-you card'],
        ['Live highlight', '15 to 30 sec', 'The best moment from your last live: a sellout, a laugh, a big reveal'],
      ] } },
    { kind: 'learn', title: 'Live to Reels', text: 'Your lives are full of Reels. After each live, save the replay and cut 2 or 3 short highlights. One live becomes a week of content.',
      example: 'Tuesday live ends. Wednesday morning you clip the moment the gold set sold out in 30 seconds, add "SOLD OUT in 30 seconds. Thursday 7 PM, more coming," and post it.' },

    { chapter: 'Filming', kind: 'learn', title: 'Look premium on a phone', text: 'Luxury brands shoot simply: good light, clean background, steady camera.',
      points: ['Light: face a window, or a ring light at eye level. Never a window behind you.', 'Background: plain wall or a tidy rack. Remove clutter.', 'Steady: phone on a stand or tripod, vertical (9:16)', 'Close-ups: hardware, stitching, logos and texture sell luxury', 'Sound: quiet room; a $20 clip-on mic helps a lot', 'Wipe the lens before you shoot'] },
    { kind: 'scenario', title: 'The dark video', situation: 'You filmed a gorgeous emerald bag at night in your basement under one ceiling light. On the video it looks dark and muddy.',
      options: [
        { text: 'Post it anyway, the bag is great', feedback: 'Buyers can\'t see what you see. A muddy video makes a luxury piece look cheap.' },
        { text: 'Reshoot by a window in daylight, or with the ring light in front of the bag, and add close-ups', best: true, feedback: 'Light is the difference between "meh" and "I need it." Ten minutes of reshooting pays for itself.' },
        { text: 'Turn the brightness all the way up in editing', feedback: 'That helps a little, but it often makes the video grainy. Fix the light, not the file.' },
      ] },

    { chapter: 'Editing', kind: 'learn', title: 'Edit in 10 minutes', text: 'Free apps like CapCut, or the editors built into Instagram, Facebook and TikTok, do everything you need.',
      points: ['Trim dead air: cut every pause and "um"', 'Add captions (auto-captions, then fix spelling)', 'Add the hook as big text in the first second', 'Use trending audio low under your voice, or music only for silent clips', 'End with a clear call to action: day, time, where', 'Save your own template so the next one is faster'],
      tip: 'If a brand gave you the product or paid you, say so clearly in the video and caption, like "#ad" or "Gifted by…" (FTC Disclosures 101).' },
    { kind: 'order', title: 'Build a Reel', prompt: 'Put the Reel in order.', steps: ['Hook in the first 2 seconds', 'Show the piece close up', 'Show it styled on you', 'Say the price or the deal', 'Call to action: live day, time and where'] },

    { chapter: 'Read the numbers', kind: 'learn', title: 'What to watch', text: 'Open your Reel insights 2 days after posting.',
      table: { head: ['Number', 'What it tells you', 'If it\'s low'], rows: [
        ['Views', 'How far it traveled', 'Stronger hook, post when your buyers are online'],
        ['Average watch time', 'Whether people stayed', 'Cut it shorter, faster cuts'],
        ['Shares and saves', 'Whether people loved it', 'More useful or surprising content'],
        ['Live viewers that week', 'Whether it brought buyers', 'Clearer call to action'],
      ] } },
    { kind: 'number', title: 'Watch rate', q: 'Your 20-second Reel has an average watch time of 9 seconds. What percent of the Reel do people watch on average?', answer: 45, tolerance: 0.5, suffix: '%', hint: '9 ÷ 20 × 100.', why: '9 ÷ 20 = 45%. To lift it, tighten the first 3 seconds and cut anything slow.' },
    { kind: 'learn', title: 'Case study: one week of Reels', text: 'One seller posted one Reel a day for a week, all cut from her own lives and hauls.',
      table: { head: ['Day', 'Reel', 'Result'], rows: [
        ['Mon', 'Haul unboxing', '1,200 views'],
        ['Tue', 'Sneak peek for tonight', '2,400 views; live had 30% more viewers than usual'],
        ['Wed', 'Sold out in 30 seconds highlight', '6,800 views, 90 shares'],
        ['Thu', 'Style one bag 3 ways', '3,100 views, many saves'],
        ['Fri', 'Packing an order', '1,900 views'],
      ] },
      example: 'The "sold out" highlight did best: it showed proof that people buy, and made viewers want in next time.' },
    { kind: 'scenario', title: 'The Reel that flopped', situation: 'Your Reel got 180 views. The first 4 seconds are you saying hello and adjusting the camera.',
      options: [
        { text: 'Delete it and give up on Reels', feedback: 'One flop is data, not a verdict.' },
        { text: 'Cut the first 4 seconds, start on the best shot with a text hook, and repost a version next week', best: true, feedback: 'The hook is almost always the fix. Same footage, new opening, often very different results.' },
        { text: 'Post the same Reel again tomorrow', feedback: 'The same weak opening usually gets the same result.' },
      ] },
    { kind: 'reflect', title: 'Your hooks', prompt: 'Write three hooks for pieces in your next live.', placeholder: '1… 2… 3…', example: '1. "This $15 bag fooled my sister." 2. "The jewelry set that sold out last week is back." 3. "Church Sunday, styled in 20 seconds."' },
    { kind: 'quiz', q: "Your Reel had 2,000 views but almost everyone left in the first 2 seconds. What should you change first?", options: ["The music", "The opening shot and first words", "The hashtags"], answer: 1, why: "Early drop-off means the hook didn't land. Open on the most beautiful moment, with a line that makes her want to see the rest." },
    { kind: 'learn', title: 'Rights and rules', text: "Use music from the app's own library, which is cleared for use on that app. Music you download elsewhere can get your video muted or taken down. If a brand sends you free product, say so clearly in the caption, as the FTC's endorsement guides ask.",
      points: ["Pick music inside Reels or TikTok, not from your own files", "Tag free or gifted pieces: '#gifted' or 'Sent to me by…'", "Only film buyers who said yes"] },
    { kind: 'checklist', title: 'Your Reel week', prompt: 'Tick what you\'ll do this week.', items: ['Write 5 hooks for my next live\'s best pieces', 'Set up a filming spot with good light', 'Film one sneak peek and one style-it-3-ways', 'Edit with captions and a call to action', 'Clip 2 highlights from my next live replay', 'Check insights after 2 days and write one lesson learned'] },
  ],
}
export default lesson
