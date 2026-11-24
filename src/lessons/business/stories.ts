import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'stories', kind: 'course', school: 'Brand and marketing', title: 'Selling stories: describe it so they feel it', track: 'Business', icon: 'sparkle',
  why: "Two sellers can show the same sweater. One says 'cute sweater, $20.' The other makes you feel the first cold morning you'll wear it. The second one sells out. Describing with stories and senses is a skill, and you can learn it.",
  outcomes: [
    'Explain why stories make people value a piece more',
    'Describe any piece with the senses, the moment and the person',
    'Write short, honest descriptions for lives, posts and your website',
    'Avoid claims that get you in trouble with buyers or the FTC',
    'Build a bank of story starters you can use on any live',
  ],
  route: { to: '/inventory', label: 'Open Inventory' },
  sources: [
    { org: 'Harvard Business Review (Paul J. Zak)', title: 'Why your brain loves good storytelling', url: 'https://hbr.org/2014/10/why-your-brain-loves-good-storytelling' },
    { org: 'Significant Objects project (Rob Walker and Joshua Glenn)', title: 'Thrift-store objects resold with stories', url: 'http://significantobjects.com/about/' },
    { org: 'Federal Trade Commission', title: 'Advertising FAQs: a guide for small business', url: 'https://www.ftc.gov/business-guidance/resources/advertising-faqs-guide-small-business' },
    { org: 'Nielsen Norman Group', title: 'Ecommerce product pages: how to write product descriptions', url: 'https://www.nngroup.com/articles/product-page-descriptions/' },
  ],
  queen: {
    welcome: "This is one of my favorite skills to teach, because it costs nothing and it changes everything. When you learn to describe a piece so a buyer can feel it, you stop competing on price. Let's find the story in every piece you own.",
    signoff: "Every piece on your shelf has a story waiting. Use the senses, picture the moment, keep it honest, and watch your buyers fall in love before you even say the price.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Why stories sell', kind: 'learn', title: 'Stories change what things are worth', nova: "Okay, story time! And I mean that as a business strategy.",
      text: "In the Significant Objects project, writers Rob Walker and Joshua Glenn bought thrift-store knickknacks for about $1.25 each, then had writers invent a short story for each one and resold them online, clearly labeled as fiction. Items bought for about $129 in total sold for over $3,600. The objects didn't change. The stories did.",
      tip: 'Our stories should always be true! The lesson is how much meaning adds to value, not to make things up.' },
    { kind: 'learn', title: 'Your brain on a story', text: "Neuroeconomist Paul Zak, writing in Harvard Business Review, describes research showing that character-driven stories cause people's brains to release oxytocin, a chemical tied to empathy and trust, and that people who felt more for a story were more willing to give money afterward. On a live, a short true story about a piece, or about the buyer who'll wear it, builds that same trust.",
      example: "'This bracelet' gets a shrug. 'My aunt wore a bracelet just like this to every church anniversary, and she always said gold should jingle when you wave' gets 'SOLD!'" },
    { kind: 'quiz', q: 'What was the big lesson of the Significant Objects project?', options: ['Thrift stores underprice everything', 'Meaning and story can make people value the same item much more', 'You should make up stories about your stock', 'Only antiques have stories'], answer: 1, why: "The same objects sold for many times more once they carried a story. For us, that means finding the TRUE story, the moment and the meaning, in every piece." },

    { chapter: 'The recipe', kind: 'learn', title: 'Senses, moment, person', text: "Every good description has three ingredients. Use one or all three.",
      table: { head: ['Ingredient', 'Ask yourself', 'Example'], rows: [
        ['Senses', 'How does it feel, sound, smell, move?', '"Butter-soft, and the fringe swishes when you walk."'],
        ['Moment', 'Where will she be when she wears or uses it?', '"Picture the first cool morning at the football game."'],
        ['Person', 'Who is this perfect for?', '"For the grandma who loves to be the best-dressed at Sunday dinner."'],
      ] },
      queen: "Before every live, pick up each piece and say one sense word out loud. If you can't find one, you haven't held it long enough." },
    { kind: 'learn', title: 'Words that work, words that don\'t', text: "Some words make people feel; some just fill space.",
      table: { head: ['Instead of', 'Try'], rows: [
        ['Cute', 'Flirty, polished, playful, darling'],
        ['Nice material', 'Buttery, crisp, cloud-soft, heavyweight, silky'],
        ['Goes with everything', '"Wear it with jeans Saturday and slacks Monday"'],
        ['Good quality', '"Double-stitched seams and a real metal zipper"'],
        ['Pretty color', 'Merlot, champagne, sage, cobalt, honey'],
      ] } },
    { kind: 'script', title: 'Story starters for your live', text: 'Keep these near your setup. Fill in the blanks with the truth about the piece.', lines: [
      '"Close your eyes for a second and picture…"',
      '"The minute I unpacked this, I thought of…"',
      '"Feel this… (rub it near the mic) …hear that? That\'s real…"',
      '"This is for the lady who…"',
      '"Where are you wearing this first? Tell me in the comments!"',
      '"My regular [name] has this in black, and she told me…"',
    ] },
    { kind: 'order', title: 'Build a description', prompt: 'Put the parts of a live description in a strong order.', steps: ['Name it with a sense word', 'Paint the moment she\'ll use it', 'Give one true detail that proves quality', 'Say who it\'s perfect for', 'Price, size and claim number'] },

    { kind: 'scenario', title: 'The plain black tee', situation: "You have twelve plain black tees. They're good quality but not exciting. Which description will sell the most, honestly?",
      options: [
        { text: '"Black tee, $12, all sizes."', feedback: "True, but nobody can feel it. It sounds like every other tee on the internet." },
        { text: '"The tee you\'ll reach for every single morning. Heavy cotton that doesn\'t go see-through, and it hangs just right with your favorite jeans. $12, sizes S to 3X."', best: true, feedback: "Moment, sense and a true quality detail. Even a basic becomes a must-have." },
        { text: '"The best black tee ever made, designer quality!"', feedback: "Big claims you can't prove make buyers suspicious, and can be a false claim." },
      ] },
    { chapter: 'Write it down', kind: 'learn', title: 'Written descriptions that sell', text: "For posts and your website, buyers skim. Nielsen Norman Group's ecommerce research shows shoppers scan product pages for key facts and leave when they can't find them. Lead with the feeling, then give the facts in an easy list.",
      example: "Honey-gold crossbody | Brunch-ready and hands-free.\nFits phone, keys, lipstick and cards.\n• Vegan leather, gold hardware\n• 9 × 6 × 2 in., 22-inch adjustable strap\n• Like new, no marks\n$28 | Live #1182",
      tip: 'Always include size, measurements, condition and any flaws. Facts prevent returns.' },
    { kind: 'learn', title: 'Keep it honest', text: "The FTC's advertising rules apply to small shops too: claims must be truthful and you need proof for objective claims. A story can be emotional, but the facts in it must be true.",
      points: ['Don\'t say "genuine leather," "real gold" or "designer" unless you know it\'s true', 'Don\'t say "authentic" for brand-name goods unless you can back it up', 'Point out flaws on camera; buyers trust sellers who do', 'Health and safety claims ("hypoallergenic," "cures") need real proof', 'If a story is about how you feel, say so: "I think…" is honest'],
      queen: "Show the flaw before they find it. A buyer who hears 'there's a tiny mark on the back' from you trusts every other word you say." },
    { kind: 'scenario', title: 'Is it real leather?', situation: "A gorgeous bag from a liquidation lot has no tag. It feels like leather. A buyer asks: 'Is it real leather?'",
      options: [
        { text: '"Yes, real leather!" since it feels like it', feedback: "If it turns out to be faux, you've made a false claim, and that buyer won't trust you again." },
        { text: '"No tag, so I can\'t promise. It feels soft and leather-like to me. Here\'s a close-up of the grain."', best: true, feedback: "Honest, helpful and still selling. Your buyer decides with real information." },
        { text: 'Ignore the question and move on', feedback: "Unanswered questions turn into hesitation, and hesitation turns into no sale." },
      ] },
    { kind: 'quiz', q: 'Which description is the strongest AND honest?', options: ['"Cute top, $15."', '"Designer silk top, worth $200, $15!" (no tag, unsure of fabric)', '"Silky-feel wrap top in deep merlot. Ties at the waist, so it flatters every shape. Size L, like new, $15."', '"Best top ever, will change your life!"'], answer: 2, why: "Sense words, a real benefit, the facts and no claims you can't prove. That's the recipe." },
    { kind: 'learn', title: 'Tell your own story too', text: "Your shop has a story: why you started, who you sell for, what you love. Buyers who know your story root for you. Share it in small pieces: a sentence at the start of a live, a pinned post, a 'meet the seller' Reel.",
      example: "'I started this shop at my kitchen table to help pay for my daughter's braces. Two years later, y'all helped me pay for her college books. Every claim tonight means something to me.'" },
    { kind: 'reflect', title: 'Practice on a real piece', prompt: 'Pick one piece you\'ll sell next. Write its description with a sense word, a moment and a person.', placeholder: 'Sense… Moment… Perfect for… Price and claim number…', example: 'Cloud-soft sage cardigan. Picture curling up with your coffee on the first chilly Saturday. Perfect for the friend who\'s always cold. Size M, $22, Live #2041.' },
    { kind: 'checklist', title: 'Storyteller habits', prompt: 'Tick what you\'ll practice.', items: ['Say one sense word for every piece on my next live', 'Keep my story starters near my setup', 'Show flaws on camera before buyers ask', 'Write post descriptions as feeling first, facts in a list', 'Share one sentence of my shop story every live', 'Replace "cute" with a better word all week'] },
  ],
}
export default lesson
