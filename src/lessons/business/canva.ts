import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'canva', kind: 'course', school: 'Tools and apps', title: 'Design like a pro in Canva', track: 'Business', icon: 'sparkle',
  why: 'Polished graphics make a small shop look like a boutique. Canva makes that possible without a designer.',
  outcomes: [
    'Set up your brand colors, fonts and logo once',
    'Pick and customize templates so they look like you, not like everyone else',
    'Follow five design rules that make anything look more expensive',
    'Make a poster, a Reel cover and a price card in minutes',
    'Know what\'s free, what\'s Pro, and whether Pro is worth it for you',
  ],
  route: { to: '/planner', label: 'Open the poster maker' },
  sources: [
    { org: 'Canva', title: 'Canva pricing (Free vs Pro)', url: 'https://www.canva.com/pricing/' },
    { org: 'Canva', title: 'Connect Canva to an AI assistant', url: 'https://www.canva.com/help/mcp-agent-setup/' },
    { org: 'U.S. Small Business Administration', title: 'Marketing and sales', url: 'https://www.sba.gov/business-guide/manage-your-business/marketing-sales' },
  ],
  queen: {
    welcome: "Polished graphics make a small shop look like a boutique. Canva makes it possible without hiring a designer. Let's set up your brand once and design in minutes.",
    signoff: "Set up your brand kit, keep it simple and roomy, and reuse your best templates. Luxury looks calm, not crowded.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Set up once', kind: 'learn', title: 'Your brand in one place', nova: 'Ten minutes of setup and every design after looks on-brand. Let\'s do it.',
      text: 'Canva lets you save your colors, fonts and logo so every design starts on-brand. On the free plan, keep them in a "Brand" design you copy from. On Canva Pro, the Brand Kit applies them with one click.',
      points: ['Colors: your 60/30/10 palette from the brand course, with exact hex codes', 'Fonts: one headline font, one body font. That\'s it.', 'Logo: a version for light backgrounds and one for dark', 'Photos: a folder of your best styled shots'] },
    { kind: 'learn', title: 'Free or Pro?', text: 'Canva Free is plenty to start. Pro adds time-savers that matter once you post a lot. Prices change, so check canva.com/pricing.',
      table: { head: ['Feature', 'Free', 'Pro'], rows: [
        ['Templates and basic editing', 'Yes, lots', 'More templates and elements'],
        ['Brand Kit (one-click brand colors, fonts, logos)', 'Limited', 'Yes'],
        ['Resize a design for every platform at once', 'No', 'Yes'],
        ['Background remover', 'No', 'Yes'],
        ['Content planner (schedule posts)', 'No', 'Yes'],
      ] },
      tip: 'If background remover and resize save you more than an hour a month, Pro usually pays for itself. Try the free trial during your busiest month.' },

    { chapter: 'Look expensive', queen: "When in doubt, take something off the poster. Space is what makes a design look expensive.", kind: 'learn', title: 'Five rules luxury brands follow', text: 'Luxury design isn\'t about more. It\'s about less, done perfectly.',
      table: { head: ['Rule', 'Do', 'Avoid'], rows: [
        ['Space', 'Leave lots of empty space around the product', 'Filling every corner'],
        ['Fonts', 'Two fonts max; elegant serif for headlines', 'Five fonts, curly fonts for everything'],
        ['Color', 'Your 2 or 3 brand colors', 'Rainbow everything'],
        ['Photo first', 'One big, sharp product photo', 'Ten tiny photos'],
        ['Line up', 'Align everything to the same edges', 'Text floating at random'],
      ] } },
    { kind: 'scenario', title: 'The busy poster', situation: 'Your live poster has 12 product photos, 4 fonts, 3 starbursts that say "SALE!" and the date in small print at the bottom.',
      options: [
        { text: 'Add more sparkle so it stands out', feedback: 'More is what made it hard to read. The date, the most important part, is the smallest.' },
        { text: 'Keep one hero photo, two fonts, your brand colors, and make the day and time big', best: true, feedback: 'Now it reads in one glance: what, when, where. That\'s what makes people show up.' },
        { text: 'Switch to plain text, no photos', feedback: 'A beautiful hero photo is what makes people stop. Keep one great one.' },
      ] },
    { kind: 'quiz', q: 'What should be the biggest text on a live poster?', options: ['Your shop name', 'The day and time of the live', 'The hashtags'], answer: 1, why: 'The goal of a poster is to get people to show up. Make the when impossible to miss.' },

    { chapter: 'Make it fast', kind: 'learn', title: 'Templates without looking generic', text: 'Thousands of sellers use the same popular templates. Make one yours in three moves.',
      points: ['Swap in your brand colors and fonts first', 'Replace every stock photo with your own product photos', 'Move or remove one element so the layout is yours', 'Save it as your own template to reuse every week'] },
    { kind: 'order', title: 'A poster in 5 minutes', prompt: 'Put the steps in order.', steps: ['Open your saved poster template', 'Drop in the hero product photo', 'Change the theme name', 'Update the day and time', 'Download and post'] },
    { kind: 'learn', title: 'Must-have designs for live sellers', text: 'Build each of these once as a template, then reuse them.',
      table: { head: ['Design', 'Size', 'Use'], rows: [
        ['Live poster', '1080 × 1350 (portrait post)', 'Feed post 2 days before'],
        ['Story / Reel cover', '1080 × 1920', 'Stories, Reel covers, countdowns'],
        ['Price and Live # card', 'Half sheet, printed', 'Hold up on camera'],
        ['Thank-you card', '4 × 6 in', 'In every box'],
        ['Facebook cover', '851 × 315 (check current size)', 'Your page banner'],
      ] },
      tip: 'The Planner\'s poster maker in this app builds a themed live poster for you. Use Canva for everything else, or to customize further.' },

    { chapter: 'Canva plus AI', kind: 'learn', title: 'Design with an AI assistant', text: 'Canva has its own AI tools inside the editor. Canva can also connect to AI assistants such as Claude and ChatGPT, so you can ask the assistant to draft a design in Canva using your brand. Always review the result before posting.',
      example: 'You ask your assistant: "Make a portrait Instagram poster in Canva for my Thursday 7 PM \'Emerald City\' live, using my brand kit." It creates a draft in your Canva account, and you swap in your real product photo.' },
    { kind: 'reflect', title: 'Your template set', prompt: 'Which three designs will you build as templates first?', placeholder: '1… 2… 3…', example: '1. Live poster. 2. Reel cover with "LIVE TONIGHT." 3. Thank-you card with my logo and a coupon code.' },
    { kind: 'learn', title: 'Case study: before and after', text: 'One seller rebuilt her poster with the five rules.',
      table: { head: ['', 'Before', 'After'], rows: [
        ['Photos', '9 small photos', '1 hero photo, full width'],
        ['Fonts', '4, including a curly script for everything', 'Serif headline + clean body font'],
        ['Colors', 'Red, yellow, purple, green, glitter', 'Emerald, gold and cream'],
        ['Date and time', 'Small, bottom corner', 'Biggest text on the page'],
        ['Result', '"What time is it?" comments', 'Shared 3× more, more viewers on time'],
      ] } },
    { kind: 'learn', title: 'Photos that look expensive', text: 'The best template in the world can\'t save a dark, blurry photo.',
      points: ['Shoot by a window in daylight, or with a ring light in front', 'Use a plain backdrop: a white sheet, a neutral wall', 'Shoot from slightly above for bags, straight on for jewelry', 'Fill the frame with the piece', 'Use Canva\'s adjust tools lightly: a touch of brightness and warmth'] },
    { queen: "Get inspired by other sellers, never copy them. Your own look is the one buyers will remember.", kind: 'scenario', title: 'The copycat temptation', situation: 'You love a big brand\'s Instagram post and want your poster to look exactly like it, logo placement and all.',
      options: [
        { text: 'Recreate it exactly with your products', feedback: 'Copying a brand\'s design closely can confuse buyers and cause trouble. Get inspired, don\'t clone.' },
        { text: 'Note what you love (the space, the font style, one big photo) and apply those ideas with your own brand colors and photos', best: true, feedback: 'That\'s how designers work: learn the principle, make it yours.' },
        { text: 'Use their product photos too', feedback: 'Those photos belong to them, and buyers expect to see YOUR pieces.' },
      ] },
    { kind: 'reflect', title: 'Your brand basics', prompt: 'Write your brand colors (names or hex codes) and the two fonts you\'ll use.', placeholder: 'Colors… Fonts…', example: 'Emerald #0F6B4F, gold #D9A53A, cream #FFF8EF. Fonts: Playfair Display for headlines, Inter for text.' },
    { kind: 'quiz', q: "Your poster has 4 fonts, 6 colors and 3 prices. What's the fastest way to make it look more high end?", options: ["Add a gold glitter frame", "Cut to 2 fonts, your 3 brand colors and one clear price", "Make everything bigger"], answer: 1, why: "Luxury brands use fewer elements and lots of breathing room. Less on the page reads as more confident." },
    { kind: 'checklist', title: 'Canva setup', prompt: 'Tick what you\'ll do this week.', items: ['Save my brand colors (hex codes), fonts and logo', 'Make and save a live poster template', 'Make a Reel cover template', 'Make a thank-you card for my boxes', 'Apply the five luxury rules to my next poster', 'Decide if Pro is worth it after a month'] },
  ],
}
export default lesson
