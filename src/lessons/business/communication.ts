import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'communication', kind: 'course', title: 'Communication is key', track: 'Business', icon: 'users',
  why: 'Delays happen. Silence is what loses customers. When you speak up early, most buyers stay loyal.',
  outcomes: ['Spot a delay before the buyer does', 'Send a clear, kind update in minutes', 'Turn a problem into a reason she trusts you more'],
  covers: [], updated: '2026-11-23',
  slides: [
    { chapter: 'Why it matters', kind: 'learn', title: 'Silence is the real problem', nova: 'Real talk: a late package rarely loses a customer. Ghosting her does.',
      text: 'When something goes wrong, buyers mostly want to know you see it and you\'re handling it. Speak up first, and most will happily wait and come back.' },
    { kind: 'quiz', q: 'A box will ship two days late. When do you tell the buyer?', options: ['When she asks', 'As soon as you know', 'Never, it\'s only two days'], answer: 1, why: 'Telling her first shows respect, and stops the worry before it starts.' },
    { chapter: 'The update formula', kind: 'learn', title: 'Own it, explain it, fix it', text: 'Every update has four short parts.',
      points: ['Own it: "Hey Keisha, I want to give you a heads-up."', 'Explain simply: "My label printer went down."', 'Give the new plan: "Your box ships Thursday with tracking."', 'Add a little love: "I added a surprise for your patience."'] },
    { kind: 'order', title: 'Build the message', prompt: 'Put the update in order.', steps: ['Greet her by name', 'Own the delay', 'Give the new date', 'Add a thank-you or small extra'] },
    { kind: 'learn', title: 'Words that calm', text: 'Use clear, warm words. Skip excuses and blame.',
      points: ['Say: "I\'m on it," "Here\'s the plan," "Thank you for your patience"', 'Avoid: "Not my fault," "The post office…," or no reply at all'] },
    { kind: 'quiz', q: 'Which message keeps a customer?', options: ['"Shipping is slow, not my fault."', '"Hi Monique! Your order is running 2 days behind. It ships Friday with tracking, and I tucked in a little thank-you."', 'No message'], answer: 1, why: 'Name, honesty, a plan and some love.' },
    { chapter: 'Rules of the road', kind: 'learn', title: 'Set expectations up front', text: 'State your rules at the start and end of every live: how invoicing works, when payment is due, how buyers can pay, and what\'s on the invoice. Clear rules prevent most problems.' },
    { kind: 'learn', title: 'Never ghost', text: 'Answer messages within a day, even if it\'s "I\'m checking and will get back to you by tomorrow." On Dynamic Dazzle, sellers reported for ghosting customers can\'t book lives.' },
    { kind: 'reflect', title: 'Write your delay message', prompt: 'Write the message you\'d send if a box were running late.', placeholder: 'Hi [name]…', example: 'Hi Keisha! Quick heads-up: your order is running a day behind. It ships tomorrow with tracking, and there\'s a little extra in there for your patience. Thank you!' },
  ],
}
export default lesson
