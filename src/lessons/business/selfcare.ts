import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'selfcare', kind: 'course', school: 'Life and legacy', title: 'Self-care for sellers: rest is part of the plan', track: 'Business', icon: 'heart',
  why: "Your shop runs on you: your voice, your energy, your eye. When you run on empty, the lives get flat, mistakes creep in and the joy goes. Taking care of yourself isn't a luxury. It's how the business keeps going.",
  outcomes: [
    'Spot the early signs of burnout before they become a crisis',
    'Understand the "strong woman" pressure and how to put some of it down',
    'Build a weekly rhythm with real rest, sleep and movement',
    'Protect your body during long lives and packing nights',
    'Know where to turn when it\'s more than tired',
  ],
  route: { to: '/calendar', label: 'Open the Calendar' },
  sources: [
    { org: 'World Health Organization', title: 'Burn-out an "occupational phenomenon": International Classification of Diseases', url: 'https://www.who.int/news/item/28-05-2019-burn-out-an-occupational-phenomenon-international-classification-of-diseases' },
    { org: 'Qualitative Health Research (Cheryl Woods-Giscombé)', title: 'Superwoman schema: African American women\'s views on stress, strength, and health', url: 'https://pubmed.ncbi.nlm.nih.gov/20150434/' },
    { org: 'Centers for Disease Control and Prevention', title: 'About sleep', url: 'https://www.cdc.gov/sleep/about/index.html' },
    { org: 'American Heart Association', title: 'Recommendations for physical activity in adults', url: 'https://www.heart.org/en/healthy-living/fitness/fitness-basics/aha-recs-for-physical-activity-in-adults' },
    { org: '988 Suicide and Crisis Lifeline', title: 'Call or text 988, any time', url: 'https://988lifeline.org/' },
  ],
  queen: {
    welcome: "I want you in this business for the long run, and that means I care about you, not just your sales. So many of us were raised to take care of everyone else first. Today, we take care of you. Read this one slowly.",
    signoff: "Rest without guilt, sleep like it's part of your job, move your body and ask for help when you need it. You are the most valuable thing in your shop. Treat yourself that way.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Know the signs', kind: 'learn', title: 'Burnout is real, and it has a name', nova: "Hey love. Before we start: how are you, really?",
      text: "The World Health Organization describes burnout as the result of chronic workplace stress that hasn't been successfully managed. It has three signs. Home businesses can be especially prone because work never leaves the house.",
      table: { head: ['Sign', 'How it can look for a seller'], rows: [
        ['Exhaustion', 'Dreading every live; tired even after sleep'],
        ['Distance or cynicism', '"I don\'t even care what sells anymore." Snapping at buyers'],
        ['Feeling less effective', 'More mistakes, slower packing, lives feel flat'],
      ] },
      tip: 'Burnout is a sign the load is too heavy, not a sign that you are weak.' },
    { kind: 'reflect', title: 'Check in with yourself', prompt: 'On a scale of 1 to 10, how full is your tank this month? Which sign, if any, have you noticed?', placeholder: 'My tank is at… I\'ve noticed…', example: 'About a 4. I dread Sunday packing and I snapped at a buyer last week. That\'s not me.' },

    { chapter: 'The strong woman', kind: 'learn', title: 'You don\'t have to carry it all', text: "Nursing researcher Cheryl Woods-Giscombé described the 'Superwoman schema': the expectation many Black women feel to show strength at all times, hide emotions, resist help and put everyone else first. Women in her study said it helped them survive and succeed, and also that it took a toll on their health. Knowing the pattern helps you choose when to put it down.",
      points: ['Strength includes asking for help', 'Rest is not something you earn after everyone else is cared for', 'Saying "I\'m tired" out loud is honest, not weak', 'Your shop is stronger when it doesn\'t depend on you never stopping'],
      queen: "I've had to learn this one myself: you can be the strong one and still lean on somebody. Pick one person this week and let them help you." },
    { kind: 'quiz', q: 'Which of these is a healthy kind of strength for a seller?', options: ['Never missing a live, even when sick', 'Answering buyers at 2 AM so nobody waits', 'Asking a friend to pack one night so you can rest', 'Hiding how tired you are from your family'], answer: 2, why: "Asking for help keeps you and the shop going. The others look strong but drain the tank." },

    { kind: 'learn', title: 'Guilt is not a schedule', text: "Many owners feel guilty resting while there's still work to do. But in a home business there is always more to do. If you wait until everything is finished to rest, you never rest. Decide your stopping time ahead, the way an employer would, and stop when it comes.",
      points: ['Write tomorrow\'s top three jobs before you stop, so your brain can let go', 'Say out loud: "The shop is closed for today"', 'Notice the guilt, name it, and rest anyway. It fades with practice', 'Remember: a rested you sells better tomorrow'] },
    { kind: 'script', title: 'Ways to say no, kindly', text: 'Protecting your energy sometimes means saying no to good things.', lines: [
      '"Thank you for thinking of me! I can\'t take that on right now, but I\'d love to help another time."',
      '"I\'m at capacity this month. Can we look again in January?"',
      '"That sounds wonderful, and my answer is no for now. I\'m protecting my rest."',
      '"I can\'t do the whole thing, but I can do [smaller piece]."',
    ] },
    { chapter: 'Rest on purpose', kind: 'learn', title: 'Sleep is a business tool', text: "The CDC says adults generally need 7 or more hours of sleep a night. Too little sleep affects mood, memory, focus and long-term health. For a seller, short sleep shows up as flat lives, packing mistakes and short patience.",
      points: ['End lives early enough to wind down', 'Pack the morning after instead of until 1 AM', 'Keep your phone out of the bedroom or on Do Not Disturb', 'Same wake time every day, even after late lives'] },
    { kind: 'number', title: 'The late-night math', q: 'After every Thursday and Sunday live you pack until 1 AM and wake at 6. If you need 7 hours, how many hours of sleep do you lose each week from those two nights?', suffix: 'hours', answer: 4, hint: '1 AM to 6 AM is 5 hours. You need 7. That\'s per night.', why: '2 hours short × 2 nights = 4 hours a week, more than half a night of sleep. Packing the next morning gives it back.' },
    { kind: 'order', title: 'A wind-down after a live', prompt: 'Put a calm after-live wind-down in a good order.', steps: ['Say thank you and end the live on time', 'Mark the live done and jot tomorrow\'s top three jobs', 'Put your phone on Do Not Disturb', 'Have water and a small snack', 'Something calm: a shower, a show, a prayer', 'Lights out at your bedtime'] },
    { kind: 'learn', title: 'Move your body, protect your back', text: "The American Heart Association recommends at least 150 minutes of moderate activity a week for adults, like brisk walking, plus muscle strengthening twice a week. Live selling means long stretches of standing or sitting, lifting boxes and bending over bins.",
      points: ['A 20-minute walk five days a week reaches 100 of those minutes', 'Stand on a cushioned mat during lives', 'Lift boxes with your legs and keep them close to your body', 'Put your most-used bins at waist height (the golden zone helps your back too)', 'Stretch your neck, shoulders and wrists between packing batches'],
      queen: "Your post office walk counts! Park a little farther away and call it your meeting with yourself." },
    { kind: 'learn', title: 'A weekly rhythm with rest built in', text: "Rest works best when it's on the calendar like a live.",
      table: { head: ['Day', 'Shop', 'Rest'], rows: [
        ['Mon', 'Receive and tag', '20-minute walk'],
        ['Tue', 'Live night', 'Early bedtime'],
        ['Wed', 'Pack and ship', 'Evening off'],
        ['Thu', 'Plan, post, buy', 'Walk + call a friend'],
        ['Fri', 'Live night', 'Pack Saturday morning'],
        ['Sat', 'Pack and ship (morning)', 'Afternoon off'],
        ['Sun', 'Closed', 'Family, faith, fun'],
      ] } },
    { kind: 'scenario', title: 'The full week', situation: "It's December. You've done 5 lives this week, you're behind on packing, and you have a cold. Tonight is your Friday live.",
      options: [
        { text: 'Push through; December is too important to skip', feedback: "A sick, exhausted seller has a weaker live and is more likely to make packing mistakes that cost more later." },
        { text: 'Post that tonight\'s live moves to Sunday, ship what\'s paid, and rest tonight', best: true, feedback: "You protect your health and your buyers' orders. One moved live in December won't hurt; a week in bed would." },
        { text: 'Go live but keep it short and quiet', feedback: "Better than pushing through, but rest is what your body is asking for." },
      ] },

    { chapter: 'Joy and help', kind: 'learn', title: 'Refill the tank', text: "Self-care isn't only bubble baths, though those count! It's anything that gives you energy back.",
      points: ['A hobby that has nothing to do with selling', 'Time with people who make you laugh', 'Faith, prayer, meditation or quiet time', 'A day where you buy nothing for the shop and just browse for fun', 'Celebrating milestones: your 100th sale deserves a treat'] },
    { kind: 'scenario', title: 'The day off that feels lazy', situation: "It's your planned day off. The shop is quiet, but you keep thinking you should be tagging the new haul.",
      options: [
        { text: 'Tag \'just a few\' pieces, which turns into four hours', feedback: "That's how days off disappear. The haul will still be there tomorrow." },
        { text: 'Write the haul on tomorrow\'s list, close the shop door, and do something you enjoy', best: true, feedback: "You honor your plan and give your brain a place to put the worry. That's real rest." },
        { text: 'Stay on the couch scrolling other sellers\' lives', feedback: "It feels like rest, but comparing yourself to other shops often drains more than it refills." },
      ] },
    { kind: 'learn', title: 'When it\'s more than tired', text: "Sometimes it's more than a busy season. If you feel hopeless, can't sleep or eat, or have thoughts of harming yourself, please reach out to a doctor, counselor or someone you trust. In the U.S., you can call or text 988 any time to reach the 988 Suicide and Crisis Lifeline. Talking to someone is a strong, smart step.",
      tip: 'If you are in danger right now, call 911.' },
    { kind: 'checklist', title: 'Your self-care plan', prompt: 'Tick what you\'ll put on your calendar this week.', items: ['A bedtime that gives me 7 hours, even on live nights', 'Pack the morning after late lives', 'Three 20-minute walks', 'One full day off', 'One thing just for joy', 'Tell one person how I\'m really doing'] },
  ],
}
export default lesson
