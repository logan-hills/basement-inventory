import type { Lesson } from '../types'
import { NOT_ADVICE } from '../resources'

const lesson: Lesson = {
  id: 'aitrust', kind: 'course', school: 'AI know-how', title: 'Be upfront: AI, your buyers and your fine print', track: 'Business', icon: 'users',
  why: 'Buyers forgive a lot, but not feeling fooled. Telling them plainly when and how you use AI, and protecting their information, keeps their trust and keeps you on the right side of the FTC and state laws.',
  outcomes: [
    'Know the FTC rules that apply when you use AI: no fake reviews, no misleading photos, no exaggerated AI claims',
    'Know when a bot or auto-reply should say it\'s automated',
    'Label AI-made images the honest way, on Facebook and in your listings',
    'Add a plain AI section to your terms of use and privacy statement',
    'Check any AI tool\'s data rules before you trust it with business information',
  ],
  route: { to: '/settings', label: 'Open Settings' },
  sources: [
    { org: 'Federal Trade Commission', title: 'Consumer Reviews and Testimonials Rule: questions and answers', url: 'https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers' },
    { org: 'Federal Trade Commission', title: 'AI (and other) companies: quietly changing your terms of service could be unfair or deceptive', url: 'https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2024/02/ai-other-companies-quietly-changing-your-terms-service-could-be-unfair-or-deceptive' },
    { org: 'Federal Trade Commission', title: 'Artificial intelligence: business guidance and cases', url: 'https://www.ftc.gov/industry/artificial-intelligence' },
    { org: 'Meta', title: 'Our approach to labeling AI-generated content', url: 'https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/' },
    { org: 'Morgan Lewis', title: 'New California AI disclosure rules become operative (August 2026)', url: 'https://www.morganlewis.com/pubs/2026/08/new-california-ai-disclosure-rules-become-operative' },
    { org: 'DLA Piper', title: 'FTC AI-washing action (May 2026)', url: 'https://www.dlapiper.com/insights/publications/2026/05/ftc-ai-washing-action-underscores-enforcement-in-business-to-business-context' },
  ],
  queen: {
    welcome: "Buyers forgive a lot, but not feeling fooled. This course helps you use AI openly and honestly, protect your buyers' information, and stay on the right side of the rules.",
    signoff: "Real photos, real reviews, honest labels and clear fine print. Trust is your best inventory, so protect it.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Why honesty wins', kind: 'learn', title: 'Trust is your best inventory', nova: 'Your buyers come back because they trust you. Let\'s keep it that way, AI and all.',
      text: 'Using AI isn\'t wrong. Hiding it in ways that mislead people is. The Federal Trade Commission (FTC) has one simple rule underneath everything: don\'t deceive buyers. That rule covers words and pictures whether a person or a computer made them.',
      table: { head: ['Using AI is fine for…', 'It crosses the line when…'], rows: [
        ['Drafting captions and descriptions you check', 'The description promises something the item isn\'t'],
        ['Making a live poster or giveaway graphic', 'An AI image stands in for the real item you\'re selling'],
        ['Auto-replies that answer common questions', 'A bot pretends to be you to push a sale'],
        ['Summarizing your sales totals', 'You paste buyers\' private information into a tool that may keep it'],
      ] },
      tip: NOT_ADVICE },
    { kind: 'quiz', q: 'What\'s the FTC\'s main rule underneath AI use in selling?', options: ['Never use AI for any business task', 'Don\'t mislead buyers, no matter who or what made the content', 'Only big companies have to follow it'], answer: 1, why: 'The FTC Act applies to every business, any size. AI is a tool; misleading people is the problem.' },

    { chapter: 'Rules to know', queen: "One fake review can undo years of real ones. Earn every star.", kind: 'learn', title: 'No fake reviews, ever', text: 'Since October 2024, an FTC rule bans fake reviews and testimonials, including reviews written by AI and posted as if they came from real customers. Breaking it can bring civil penalties for each violation.',
      points: ['Don\'t post AI-written "customer" reviews or comments', 'Don\'t buy reviews or followers', 'Don\'t pay for good reviews, or only ask happy buyers to post', 'Don\'t hide bad reviews and show only the good ones as if that\'s all there is', 'Do share real buyer words, with permission, exactly as they wrote them'],
      tip: 'Real reviews from your regulars beat anything a computer can write. Ask after the box arrives: "If you love it, would you leave a quick review?"' },
    { queen: "If you edit a photo, the piece should still look exactly like what arrives. Disappointment ends loyalty.", kind: 'learn', title: 'Photos must show the real thing', text: 'AI can make a bag look new, change its color, or put it on a model who never wore it. In a listing, that misleads buyers about what they\'ll get. Keep your item photos real, and use AI images only for decoration.',
      table: { head: ['OK', 'Not OK'], rows: [
        ['Brightening a photo, cleaning up the background', 'Removing scratches, stains or wear from the item'],
        ['An AI-made poster that says "Thursday Purse Party"', 'An AI picture of a bag you\'ll ship as if it\'s the real one'],
        ['A styled AI scene clearly labeled "AI illustration"', 'Changing the color so it matches what\'s trending'],
      ] } },
    { kind: 'learn', title: 'Don\'t oversell your AI', text: 'The FTC calls it "AI-washing": claiming AI does more than it does. By May 2026 the FTC had brought 13 AI-washing cases since 2024. For a seller, it usually shows up as big promises.',
      points: ['Don\'t say "AI-verified authentic" unless a real authentication service checked it', 'Don\'t say "AI-picked just for you" if it\'s just your best sellers', 'Don\'t promise buyers anything an AI "guarantees"', 'Say what really happens, in plain words'] },
    { kind: 'scenario', title: 'The "verified" badge', situation: 'An AI app scans a photo of a Michael Kors bag and says "likely authentic." Jade wants to add "AI Verified Authentic ✔" to the listing.',
      options: [
        { text: 'Add the badge; the app said it', feedback: 'A photo scan isn\'t authentication. That claim could mislead buyers, which is exactly what the FTC looks for.' },
        { text: 'Describe what she knows: tags, serial, where she sourced it, and her return policy', best: true, feedback: 'Honest facts build trust, and her return policy backs them up.' },
        { text: 'Say "100% genuine guaranteed" instead', feedback: 'That\'s a bigger promise with the same thin proof.' },
      ] },

    { chapter: 'Bots and labels', kind: 'learn', title: 'When a bot talks to buyers', text: 'If an automated bot or auto-reply talks to buyers, it\'s safest to say so. California law has required bots used to encourage a sale to disclose that they\'re bots since 2019. Utah requires a business to tell a customer they\'re dealing with generative AI if the customer asks. More states are adding rules.',
      table: { head: ['Where', 'An easy honest line'], rows: [
        ['Messenger auto-reply', '"Hi! This is an automatic reply. I\'ll answer personally after the live."'],
        ['Comment bot confirming a claim', '"✅ Auto-confirm: you claimed #12. I\'ll invoice you after the live."'],
        ['AI chat helper on a website', '"I\'m an AI helper for Dazzle Finds. Want a real person? Type HUMAN."'],
      ] },
      tip: 'A real bonus: buyers relax when they know which messages are automatic and which are you.' },
    { kind: 'learn', title: 'AI pictures on Facebook', text: 'Meta (Facebook and Instagram) adds an "AI info" label to content it detects as AI-made, and asks you to label realistic AI video and audio yourself. Since August 2026, California\'s AI Transparency Act requires big AI image makers to build a hidden label into their pictures, video and audio, which helps platforms spot them.',
      points: ['If an AI-made image looks like a real photo, label it yourself: "AI illustration"', 'Don\'t try to remove or hide AI labels', 'Never use AI to make a real person say or do something they didn\'t', 'Your poster can be AI; your product photos should be real'] },
    { kind: 'tap', title: 'Practice: label it', prompt: 'You made a realistic AI scene of a handbag on a beach for a promo. Which caption is the honest one?', screen: { title: 'Pick a caption', buttons: ['Shot on location in Miami!', 'Beach vibes ☀️ (AI illustration)', 'Real customer photo', 'No caption needed'] }, answer: 'Beach vibes ☀️ (AI illustration)', hint: 'It looks real, so say it\'s AI.' },

    { chapter: 'Your fine print', kind: 'learn', title: 'Add AI to your terms and privacy statement', text: 'Your terms of use and privacy statement should match what you really do. If you use AI tools, say so plainly, and say what information goes into them. The FTC warned in 2024 that quietly changing your terms to use people\'s data for AI could be unfair or deceptive. If you change how you use data, tell people first.',
      table: { head: ['Put this in…', 'Say plainly'], rows: [
        ['Privacy statement', 'Which AI tools you use, what goes in (product notes, sales totals), and what never goes in (names, addresses, payment details)'],
        ['Privacy statement', 'Whether your AI tools can train on what you share, and that you turned that off if you did'],
        ['Terms of use', 'That some replies are automated, and how to reach a real person'],
        ['Terms of use', 'That product photos show the actual item; any AI images are labeled'],
        ['Both', 'The date it was last updated, and that you\'ll tell buyers before big changes'],
      ] } },
    { kind: 'script', title: 'Sample wording to make your own', text: 'Plain-language starting points. Have a lawyer review your final policies.', lines: [
      'PRIVACY: "We use AI writing and design tools to help create captions, product descriptions and graphics. We never put your name, address, phone number or payment details into these tools."',
      'PRIVACY: "Where our AI tools offer it, we turn off using our content to train their models."',
      'TERMS: "Some messages, like claim confirmations and after-hours replies, are automatic. Reply HUMAN anytime to reach us personally."',
      'TERMS: "Every product photo shows the actual item you\'ll receive. Any AI-made image is labeled \'AI illustration.\'"',
      'UPDATES: "Last updated [date]. If we change how we use your information, we\'ll tell you before it takes effect."',
    ], tip: 'Dazzle Warehouse has its own Terms and Privacy pages. Read them so you know what the app does with your shop\'s data, too.' },
    { kind: 'order', title: 'Update your fine print', prompt: 'Put these steps in order.', steps: ['List every AI tool you use', 'Write down what information goes into each', 'Turn off training where you can', 'Add a plain AI section to your privacy statement and terms', 'Post the update and tell your buyers'] },

    { chapter: 'Due diligence on AI tools', kind: 'learn', title: 'Check a tool before you trust it', text: 'Diligence means doing your homework before you hand over information. Before you put business data into any AI tool, spend ten minutes on its privacy page and settings.',
      table: { head: ['Check', 'What you want to see'], rows: [
        ['Does it train on my chats?', 'A setting to turn it off, or a business plan that doesn\'t train'],
        ['How long does it keep my data?', 'A clear time, and a way to delete chats'],
        ['Who else sees it?', 'No selling of your data; named service providers only'],
        ['Where\'s the company?', 'A real business address and support contact'],
        ['What happens if it changes?', 'They promise to notify you before changing their terms'],
      ] } },
    { kind: 'scenario', title: 'The handy spreadsheet', situation: 'Rochelle wants AI to help sort 300 buyers into "regulars" and "one-timers." Her spreadsheet has names, addresses and phone numbers.',
      options: [
        { text: 'Paste the whole sheet into a free AI chat', feedback: 'That puts private buyer information into a tool that may keep it. Not worth the risk.' },
        { text: 'Remove names, addresses and phones, keep a customer number and order counts, then ask for help', best: true, feedback: 'Same insight, no private data. That\'s diligence.' },
        { text: 'Post the sheet in a seller group and ask for help', feedback: 'That shares buyers\' private details with strangers. Never.' },
      ] },
    { kind: 'quiz', q: 'You change your privacy statement so buyer messages can be used to train an AI tool. What should you do?', options: ['Change it quietly; no one reads those', 'Tell buyers clearly before the change takes effect', 'Hide it at the bottom of the terms'], answer: 1, why: 'The FTC has warned that quietly changing terms to use people\'s data for AI can be unfair or deceptive. Tell them first, plainly.' },
    { kind: 'reflect', title: 'Your AI disclosure', prompt: 'Write the two or three sentences you\'ll add to your privacy statement or Facebook "About" section about how you use AI.', placeholder: 'I use AI to… I never… Real person…', example: 'I use AI to help write captions and design posters. I never put your name, address or payment details into AI tools. Every product photo is the real item, and I answer every message myself.' },
    { kind: 'checklist', title: 'Honest AI checklist', prompt: 'Tick these off this month.', items: ['Keep every product photo real', 'Label realistic AI images "AI illustration"', 'Make sure bots and auto-replies say they\'re automatic', 'Add an AI section to my privacy statement and terms', 'Turn off AI training on my chats where I can', 'Never paste buyer names, addresses or payment info into AI'] },
  ],
}
export default lesson
