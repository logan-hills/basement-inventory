import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'brandkit', kind: 'course', school: 'Brand and marketing', title: 'Your brand kit: logo, colors and signature catchphrase', track: 'Business', icon: 'tag',
  why: "Buyers should know it's your live before they hear your name: the colors, the logo in the corner, the line you say every time. A simple brand kit makes that happen, and protecting your name keeps it yours.",
  outcomes: [
    'Know what a brand kit holds and why consistency sells',
    'Brief or make a simple logo that works on a tiny label and a big banner',
    'Pick a color palette and two fonts you\'ll use everywhere',
    'Write a signature catchphrase people repeat back to you',
    'Check that your name is free to use, and know when to trademark it',
  ],
  route: { to: '/settings', label: 'Open Settings' },
  sources: [
    { org: 'Ehrenberg-Bass Institute (Jenni Romaniuk)', title: 'Building distinctive brand assets', url: 'https://marketingscience.info/' },
    { org: 'U.S. Patent and Trademark Office', title: 'Trademark basics', url: 'https://www.uspto.gov/trademarks/basics' },
    { org: 'U.S. Patent and Trademark Office', title: 'Search trademarks', url: 'https://tmsearch.uspto.gov/' },
    { org: 'U.S. Small Business Administration', title: 'Choose your business name', url: 'https://www.sba.gov/business-guide/launch-your-business/choose-your-business-name' },
    { org: 'Canva Help Center', title: 'Set up a Brand Kit', url: 'https://www.canva.com/help/brand-kit/' },
  ],
  queen: {
    welcome: "In 'Build a brand they remember' we found your promise and your dream buyer. Now let's put it in a box you can hand to anybody: your logo, your colors, your fonts and the line your buyers will say back to you. This is where your shop starts to look as good as it feels.",
    signoff: "Put your brand kit in one folder, use it on everything for 90 days without changing a thing, and check that your name is yours to keep. Consistency is what turns a cute shop into a brand.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'What\'s in the kit', kind: 'learn', title: 'Your brand in one folder', nova: "Let's pack your brand's suitcase. Everything you need, nothing you don't.",
      text: "A brand kit is a simple folder (and a Canva Brand Kit) with everything that makes your shop look and sound like you. When it's in one place, every poster, label and post matches, even when a helper makes it.",
      table: { head: ['In the kit', 'Example'], rows: [
        ['Logo, main and simple versions', 'Full logo for banners; a small icon or initials for labels'],
        ['Colors (3 to 5)', 'Deep plum, champagne gold, blush, cream, black'],
        ['Fonts (2)', 'One fancy for headlines, one easy-to-read for details'],
        ['Catchphrase', '"Claim it, queen!"'],
        ['Photo style', 'Warm light, cream background, pieces styled on a hanger'],
        ['Voice words (3)', 'Warm, bold, playful'],
      ] } },
    { kind: 'learn', title: 'Why consistency pays', text: "Marketing scientist Jenni Romaniuk of the Ehrenberg-Bass Institute calls things like colors, logos, characters and taglines 'distinctive brand assets.' Her research shows they help buyers spot and remember a brand quickly, but only once people have seen them consistently, over and over. Changing your colors every month resets that memory.",
      example: "Think of a famous coffee shop's green, or a home store's red bullseye. You know them without reading a word. Your shop can have that on a smaller scale with your buyers.",
      queen: "Pick your colors and stick with them for at least a year. You'll get bored of them long before your buyers even notice them." },
    { kind: 'quiz', q: 'According to brand research, what makes a logo or color work as a brand asset?', options: ['Being trendy this season', 'Being seen consistently, over and over, with your brand', 'Being very detailed', 'Changing it often to stay fresh'], answer: 1, why: "Repetition builds recognition. A simple logo used everywhere for years beats a clever one you keep changing." },

    { chapter: 'Logo and colors', kind: 'learn', title: 'A logo that works tiny and big', text: "Your logo has to work on a 2-inch label, a phone screen and a banner. Simple wins.",
      points: ['Test it at the size of a postage stamp: can you still read it?', 'Make sure it works in one color (black on white, white on dark)', 'Have two versions: the full logo and a simple icon or initials', 'Avoid thin script fonts for the main word; they disappear when small', 'Get the files as PNG with a clear background, and SVG if you can'],
      tip: 'Canva and AI tools can draft logo ideas. Use them for ideas, then make sure the final design is simple, original and not copied from another brand.' },
    { kind: 'learn', title: 'Colors with a job', text: "Give each color a job, so your designs always look balanced.",
      table: { head: ['Job', 'How much', 'Example'], rows: [
        ['Main color', 'About 60% (backgrounds, big areas)', 'Cream'],
        ['Second color', 'About 30% (headings, frames)', 'Deep plum'],
        ['Accent', 'About 10% (buttons, prices, sparkle)', 'Champagne gold'],
      ] },
      example: "Save your colors as hex codes (like #4A1D3F) in your Canva Brand Kit and in a note on your phone. Then 'my plum' is exactly the same everywhere." },
    { kind: 'scenario', title: 'The rainbow shop', situation: "Jasmine uses a different color scheme for every live poster because she loves variety. Her regulars say her posts 'all look like different shops.'",
      options: [
        { text: 'Keep switching; variety is fun', feedback: "Fun for her, confusing for buyers scrolling fast. Recognition comes from repetition." },
        { text: 'Pick 3 to 5 brand colors, and let each live theme add one accent color on top', best: true, feedback: "Best of both: her brand stays recognizable, and themes still feel fresh." },
        { text: 'Use only black and white forever', feedback: "Consistent, but it may not match her warm, colorful brand. Pick colors that feel like her." },
      ] },
    { kind: 'reflect', title: 'Your palette', prompt: 'Write your 3 to 5 brand colors (with a job for each) and your two fonts.', placeholder: 'Main… Second… Accent… Headline font… Body font…', example: 'Main: cream #FFF8EE. Second: plum #4A1D3F. Accent: champagne #D9B36C. Headlines: Playfair Display. Details: Inter.' },

    { chapter: 'Your catchphrase', kind: 'learn', title: 'A line they say back to you', text: "A signature catchphrase is a brand asset you can hear. The best ones are short, fun to say, and tied to a moment in your live.",
      points: ['3 to 6 words', 'Easy to type in a comment', 'Tied to a moment: the opener, a sold piece, the sign-off', 'Sounds like you, not a corporation', 'Not already a famous slogan'],
      example: "One seller ends every claim with 'Bagged and tagged, baby!' Within a month, buyers were typing it in the comments before she could say it." },
    { kind: 'script', title: 'Catchphrase ideas to remix', text: 'Use these to spark your own. The best one will sound like something you already say.', lines: [
      '"Claim it, queen!"',
      '"Bagged and tagged, baby!"',
      '"Basement to your doorstep!"',
      '"If it sparkles, it\'s spoken for!"',
      '"Snatched! Next!"',
      '"Y\'all know the rules: see it, love it, claim it!"',
    ], queen: "Say your catchphrase every single live for a month, even when it feels silly. The day your buyers type it before you do, you'll know your brand has arrived." },
    { kind: 'reflect', title: 'Write yours', prompt: 'Write three catchphrase ideas and circle the one that sounds most like you. When in your live will you say it?', placeholder: 'Idea 1… Idea 2… Idea 3… My pick and when I say it…', example: '"Pretty and paid for!" after every claim. "Treat yourself, sis" at the opener. Picking "Pretty and paid for!"' },

    { chapter: 'Protect your name', kind: 'learn', title: 'Check your name before you build on it', text: "Before you print 500 stickers, make sure nobody else already owns your name for the same kind of business. The SBA suggests checking your state's business records, and the USPTO has a free trademark search.",
      points: ['Search the USPTO trademark database for your shop name and catchphrase', 'Search your state business registry', 'Search Facebook, Instagram and TikTok for the handle', 'Check if the website domain is free', 'Google your name plus "boutique" or "shop"'] },
    { kind: 'learn', title: 'Trademark basics, in plain words', text: "A trademark protects a name, logo or slogan that identifies who sells a product. You get some rights just by using a name in business in your area, but a federal registration with the USPTO gives nationwide protection and makes it much easier to stop copycats. Filing costs money per class of goods, and the USPTO encourages working with a trademark attorney.",
      table: { head: ['', 'Just using it', 'Federal registration'], rows: [
        ['Cost', 'Free', 'USPTO filing fee per class, plus attorney if you use one'],
        ['Protection', 'Mostly local, where you actually sell', 'Nationwide; can use the ® symbol'],
        ['Good time to file', 'Starting out', 'When your name is established and growing'],
      ] },
      tip: 'You can use ™ with your brand name any time. Only use ® once the USPTO registers it. This is general education, not legal advice.' },
    { kind: 'scenario', title: 'The same name', situation: "You've sold as 'Glam Basement' for a year. You find an online boutique with the same name that registered a federal trademark two years ago.",
      options: [
        { text: 'Ignore it; you\'re small and they\'ll never notice', feedback: "Risky. If they notice, you could be told to stop using the name after investing even more in it." },
        { text: 'Talk to a trademark attorney about your options, and start thinking about a new name now while you\'re still small', best: true, feedback: "Wise. Renaming is easier now than later. An attorney can tell you what's really at risk." },
        { text: 'Register the same name yourself in your state', feedback: "A state registration doesn't override their federal trademark." },
      ] },
    { kind: 'checklist', title: 'Build your brand kit', prompt: 'Tick each one as you finish it.', items: ['Make a "Brand kit" folder on my phone and computer', 'Save my logo in full and simple versions', 'Save my colors as hex codes', 'Pick my two fonts', 'Choose my catchphrase and when I say it', 'Set up my Canva Brand Kit', 'Search USPTO and social handles for my name'] },
  ],
}
export default lesson
