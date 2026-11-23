import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'communication', kind: 'course', school: 'Customer care', title: 'Communication is key', track: 'Business', icon: 'users',
  why: 'Delays happen. Silence is what loses customers. When you speak up early, most buyers stay loyal.',
  outcomes: [
    'Set your shop rules so most problems never happen',
    'Send a clear, kind update in two minutes with the 4-part formula',
    'Use ready-made messages for the eight situations every seller faces',
    'Turn an upset buyer into a loyal one with L.A.S.T.',
    'Handle non-payers fairly and keep your boundaries',
  ],
  sources: [
    { org: 'Harvard Business School Working Knowledge', title: 'The right way to manage churn for maximum profit', url: 'https://www.library.hbs.edu/working-knowledge/the-right-way-to-manage-churn-for-maximum-profit' },
    { org: 'U.S. Small Business Administration', title: 'Marketing and sales', url: 'https://www.sba.gov/business-guide/manage-your-business/marketing-sales' },
  ],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Why it matters', kind: 'learn', title: 'Silence is the real problem', nova: 'Real talk: a late package rarely loses a customer. Ghosting her does.',
      text: "When something goes wrong, buyers mostly want two things: to know you see it, and to know you're handling it. Speak up first and most will happily wait and come back. Go quiet and even a small problem feels like a scam.",
      points: ['Speaking up first shows respect', 'A date calms worry, even if it\'s a later date', 'Every public reply is watched by future buyers'] },
    { kind: 'quiz', q: 'A box will ship two days late. When do you tell the buyer?', options: ['When she asks', 'As soon as you know', 'Never, it\'s only two days'], answer: 1, why: 'Telling her first shows respect and stops the worry before it starts.' },

    { chapter: 'Rules prevent problems', kind: 'learn', title: 'Set expectations up front', text: 'Most "problems" are surprises. Say your rules at the start and end of every live, put them in your pinned post, and put them on your invoice.',
      table: { head: ['Rule', 'Example'], rows: [
        ['When invoices go out', 'Right after the live'],
        ['When payment is due', 'Within 24 hours'],
        ['What happens if she doesn\'t pay', 'Pieces go to the next person in line'],
        ['How she can pay', 'Your Square invoice link'],
        ['When it ships', 'Within 3 business days of payment'],
        ['Problems with an order', 'Message within 3 days with a photo'],
        ['When you answer messages', 'Within one day, Monday to Saturday'],
      ] } },
    { kind: 'reflect', title: 'Write your shop rules', prompt: 'Write your rules for payment, shipping, and problems in three short lines you could read out on a live.', placeholder: 'Payment: … Shipping: … Problems: …', example: 'Payment: within 24 hours of your invoice. Shipping: within 3 business days of payment, with tracking. Problems: message me within 3 days with a photo and I\'ll make it right.' },

    { chapter: 'The update formula', kind: 'learn', title: 'Own it, explain it, fix it, love it', text: 'Every update has four short parts. Two or three sentences is plenty.',
      points: ['Own it: "Hey Keisha, I want to give you a heads-up."', 'Explain simply: "My label printer went down." (One sentence. No long story.)', 'Give the new plan with a date: "Your box ships Thursday with tracking."', 'Add a little love: "I tucked in a surprise for your patience."'] },
    { kind: 'order', title: 'Build the message', prompt: 'Put the update in order.', steps: ['Greet her by name', 'Own the delay', 'Explain in one sentence', 'Give the new date', 'Add a thank-you or small extra'] },
    { kind: 'learn', title: 'Words that calm, words that burn', text: 'Small word choices change how the whole message feels.',
      table: { head: ['Instead of', 'Say'], rows: [
        ['"Not my fault, the post office…"', '"I\'m on it, and here\'s the plan."'],
        ['"Calm down."', '"I completely understand why you\'re frustrated."'],
        ['"That\'s our policy."', '"Here\'s what I can do for you."'],
        ['"I\'ll try."', '"I\'ll have an answer for you by Friday."'],
        ['(no reply)', '"Got your message! Checking now, I\'ll update you by tomorrow."'],
      ] } },
    { kind: 'quiz', q: 'Which message keeps a customer?', options: ['"Shipping is slow, not my fault."', '"Hi Monique! Your order is running 2 days behind. It ships Friday with tracking, and I tucked in a little thank-you."', 'No message'], answer: 1, why: 'Name, honesty, a date, and some love.' },

    { chapter: 'Ready-made messages', kind: 'script', title: 'Payment reminder and thank-you', text: 'Save these in Messenger or Meta Business Suite as saved replies, so you can send them in one tap.',
      lines: [
        'REMINDER (at 12 hours): "Hi [name]! Just a friendly reminder your invoice from [live] is waiting for you 💛 Pay by [time] tomorrow to keep your pieces. Here\'s the link: [link]"',
        'THANK-YOU (after payment): "Got it, [name], thank you! Your order ships by [day] and I\'ll send tracking as soon as it\'s on the way."',
        'SHIPPED: "Your box is on the way! 📦 Tracking: [number]. Can\'t wait for you to see it. Post a pic and tag us for a shout-out!"',
      ] },
    { kind: 'script', title: 'Delay, wrong item, and damage', lines: [
      'DELAY: "Hi [name], I want to give you a heads-up: your order is running [1 or 2] days behind because [one short reason]. It ships [day] with tracking, and I added a little something for your patience. Thank you!"',
      'WRONG ITEM: "[Name], I am so sorry, that\'s my mistake! I\'m shipping the right piece today, and here\'s a prepaid label for the other one. Keep an eye out for tracking."',
      'DAMAGED: "Oh no, [name], thank you for the photo. I\'m so sorry it arrived that way. Would you like a replacement or a refund? Either way, no need to send it back."',
    ], tip: 'For low-priced pieces, "no need to send it back" saves you both postage and feels generous.' },
    { kind: 'script', title: 'Non-payer and "I changed my mind"', lines: [
      'FINAL NOTICE (at 24 hours): "Hi [name], your invoice from [live] is past due, so I\'ll release your pieces to the next buyer at [time] today. If something came up, just let me know, I understand!"',
      'CHANGED MIND (before paying): "No problem at all, [name]! I\'ll pass it to the next person in line. See you at the next live 💛"',
    ], tip: 'Keep a simple note of non-payers. Two strikes, and you can ask them to pay right away on future claims, or stop accepting their claims. Say this rule in your pinned post.' },

    { chapter: 'When someone is upset', kind: 'learn', title: 'L.A.S.T.: the four steps', text: "When a buyer is upset, don't defend. Walk through L.A.S.T. It works on the phone, in messages, and in public comments.",
      points: ['Listen: let her finish. Read the whole message twice.', 'Apologize: for how she feels, even if you did nothing wrong. "I\'m so sorry this happened."', 'Solve: offer a clear fix, or two choices', 'Thank: "Thank you for telling me. It helps me do better."'] },
    { kind: 'scenario', title: 'The angry message', situation: 'At 10 PM you get: "This is the THIRD time I\'ve asked where my order is!!! I want my money back." You check: it shipped yesterday, and you never sent tracking.',
      options: [
        { text: '"It shipped yesterday. You didn\'t have to be rude about it."', feedback: 'She\'s upset because she was left in the dark. Pushing back makes it a fight.' },
        { text: '"Keisha, I\'m so sorry I missed your messages, that\'s on me. It shipped yesterday, here\'s tracking: [number]. If you still want a refund, I\'ll do that right away, no problem."', best: true, feedback: 'Listen, apologize, solve, and give her the choice. Most buyers keep the order once they see you care.' },
        { text: 'Wait until morning so you\'re not answering upset', feedback: 'Calming down is wise, but a one-line "I see this, checking now!" tonight stops it from getting worse.' },
      ] },
    { kind: 'scenario', title: 'A complaint in public', situation: 'A buyer comments on your Page post: "Ordered 2 weeks ago and still nothing. Be careful y\'all." It already has 6 likes.',
      options: [
        { text: 'Delete the comment and block her', feedback: 'People already saw it. Deleting looks like hiding, and she may post screenshots.' },
        { text: 'Reply publicly: "Tasha, I\'m so sorry! Sending you a message right now to fix this today." Then fix it in private and, once solved, ask if she\'d update her comment.', best: true, feedback: 'Everyone watching sees a seller who responds fast and takes care of people. The details stay private.' },
        { text: 'Reply publicly with her order details to prove she\'s wrong', feedback: 'Never post a buyer\'s details in public, and winning the argument still loses the room.' },
      ] },

    { chapter: 'Boundaries and habits', kind: 'learn', title: 'Never ghost, but have hours', text: 'Answer messages within a day, even if it\'s "I\'m checking and will get back to you by tomorrow." But you\'re a person, not a 24-hour call center.',
      points: ['Pick message hours (for example 9 AM to 8 PM, Monday to Saturday) and say them in your pinned post', 'Set an away message for after hours', 'Block two short message times a day instead of answering all day long', 'On Dynamic Dazzle, sellers reported for ghosting customers can lose their booking privileges'] },
    { kind: 'checklist', title: 'Your communication setup', prompt: 'Tick what you\'ll do this week.', items: [
      'Write my shop rules and pin them',
      'Read my rules at the start and end of every live',
      'Save the reminder, thank-you, shipped and delay messages as saved replies',
      'Set my message hours and an away message',
      'Start a simple non-payer note',
      'Send tracking to every buyer the day it ships',
    ] },
  ],
}
export default lesson
