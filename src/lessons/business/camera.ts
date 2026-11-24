import type { Lesson } from '../types'

const lesson: Lesson = {
  id: 'camera', kind: 'course', school: 'Brand and marketing', title: 'Confident on camera: light, voice and the empty room', track: 'Business', icon: 'live',
  why: "Buyers buy from people they trust, and on a live they decide in seconds. Good light, a warm voice and a plan for the quiet moments make you look and feel like the boutique owner you are, even with 3 viewers.",
  outcomes: [
    'Light your face and your pieces well for under $60',
    'Set up your phone, sound and background so you look polished',
    'Use your voice, pace and eye contact to keep people watching',
    'Know exactly what to do when nobody is watching yet',
    'Calm your nerves with a simple pre-live routine',
  ],
  route: { to: '/planner', label: 'Open the Live planner' },
  sources: [
    { org: 'Stanford Graduate School of Business (Matt Abrahams)', title: 'Think fast, talk smart: communication techniques', url: 'https://www.gsb.stanford.edu/insights/think-fast-talk-smart-communication-techniques' },
    { org: 'Harvard Business Review (Alison Wood Brooks)', title: 'Get excited: reappraising pre-performance anxiety as excitement', url: 'https://www.hbs.edu/faculty/Pages/item.aspx?num=45869' },
    { org: 'Meta for Creators', title: 'Facebook Live: best practices for going live', url: 'https://www.facebook.com/creators/tools/facebook-live' },
    { org: 'Nielsen Norman Group', title: 'Video usability: what keeps viewers watching', url: 'https://www.nngroup.com/articles/video-usability/' },
  ],
  queen: {
    welcome: "Nobody is born comfortable on camera. Every seller you admire had a first live where her hands shook. I made this course so you can skip years of trial and error: the light, the voice, and what to do when the room is empty. You belong in front of that camera.",
    signoff: "Fix your light, practice your opener, and go live even when it's quiet. Every live makes you better, and one day you'll watch an old replay and be proud of how far you've come.",
  },
  covers: [], updated: '2026-11-24',
  slides: [
    { chapter: 'Light and setup', kind: 'learn', title: 'Light is the cheapest glow-up', nova: "Honey, good light does more than any filter. Let's get you glowing.",
      text: "Phones make beautiful video when there's plenty of soft light on your face. Most dull, grainy lives are a lighting problem, not a phone problem.",
      points: ['Face your light: a window or ring light in front of you, never behind you', 'Soft beats bright: a light set to half power and a little higher than your eyes flatters everyone', 'Turn off the overhead light if it makes shadows under your eyes', 'Light your pieces too: a small second light pointed at the table shows true colors', 'Match your bulbs: all warm or all daylight, not a mix'],
      tip: 'Do a 30-second test video before every live and watch it back with the sound off. Your eyes catch what the mirror misses.' },
    { kind: 'learn', title: 'Your phone, your sound, your background', text: "A polished setup is about a few simple choices.",
      table: { head: ['Setup', 'Do this', 'Avoid this'], rows: [
        ['Phone height', 'At eye level on a tripod', 'Looking down into the lens'],
        ['Lens', 'Wipe it clean before every live', 'Fingerprint haze'],
        ['Sound', 'A $20 to $40 clip-on mic, or sit close to the phone', 'Echoey rooms and a TV in the background'],
        ['Background', 'Tidy racks, your logo, a plant, warm light', 'Laundry, open doors, busy clutter'],
        ['Internet', 'Wi-Fi close to your setup; test your speed', 'One weak bar in the basement'],
      ] },
      queen: "Your background is part of your brand. Spend one Saturday making that corner beautiful, and it will work for you on every single live." },
    { kind: 'number', title: 'A glow-up budget', q: 'You buy a ring light for $35, a tripod for $18 and a clip-on mic for $24. If your lives earn about $40 profit each, how many lives pay for the whole setup? (Round up.)', suffix: 'lives', answer: 2, hint: 'Total cost is $77. How many $40 lives cover it?', why: '$77 ÷ $40 = 1.9, so 2 lives. A setup that makes you look like a boutique pays for itself almost right away.' },
    { kind: 'quiz', q: 'Your live looks dark and grainy even though you bought a new phone. What should you try first?', options: ['Buy a newer phone', 'Put a soft light in front of you and turn off the light behind you', 'Add a beauty filter', 'Move the phone farther away'], answer: 1, why: "Light in front, nothing bright behind. Graininess is the phone struggling with low light. A $35 light usually fixes what a $1,000 phone can't." },

    { chapter: 'Voice and presence', kind: 'learn', title: 'Talk to one person', text: "Stanford communication lecturer Matt Abrahams teaches that great speakers aim for connection, not perfection. On a live, that means talking to one friend, not 'everyone out there.' Picture your favorite regular and talk to her.",
      points: ['Look at the lens when you\'re making a point, then glance at comments', 'Say people\'s names when they comment', 'Smile with your voice: it changes your tone even when you\'re reading a price', 'Slow down a little more than feels natural; nerves speed us up', 'Pause after a price. Silence gives people time to claim'],
      example: "Instead of 'Hey guys, so this is a top,' Angela says, 'Pam, you asked for green last week. Look at this emerald wrap top. It's a size large, $18, and it's going to look gorgeous on you.'" },
    { kind: 'script', title: 'Openers that pull people in', text: 'Your first 30 seconds should feel like the party already started. Pick one and make it yours.', lines: [
      '"Hey hey hey! Grab your coffee and come sit with me. Tonight I\'ve got [theme], and the first piece is my favorite."',
      '"I\'ve been waiting all week to show you this one, so let\'s go right to it."',
      '"Welcome in! Type your city in the comments so I can see who\'s here tonight."',
      '"If you\'re new, here\'s how to shop with me in ten seconds: type SOLD and the number."',
    ], queen: "Never open with 'let's wait for more people.' The people already there showed up for you. Give them your best from the first second." },
    { kind: 'learn', title: 'The 3-part piece pitch', text: "Every piece gets the same simple rhythm. It keeps you calm and keeps buyers listening.",
      table: { head: ['Part', 'What to say', 'Example'], rows: [
        ['See it', 'Show it close, turn it, name it', '"Look at this stitching. Real leather, gold hardware."'],
        ['Feel it', 'Where she\'ll wear or use it', '"This is your Sunday brunch bag. Fits your phone, keys and lipstick."'],
        ['Claim it', 'Price, size, how to claim, then pause', '"$24, one only. Type SOLD 1182." (Pause.)'],
      ] } },
    { kind: 'order', title: 'Pitch it in order', prompt: 'Put the piece pitch in the right order.', steps: ['Hold it close and turn it slowly', 'Name what makes it special', 'Say where she\'ll wear or use it', 'Say the price and the claim number', 'Pause and watch the comments'] },

    { chapter: 'The empty room', kind: 'learn', title: 'Nobody is watching yet. Now what?', text: "Every live seller goes live to a quiet room sometimes, especially at the start of a live or a new shop. Replays mean people watch later, and Facebook shares lives with more people when there's activity. Keep selling like the room is full.",
      points: ['Sell to the replay: say names and claim numbers clearly, because people watch later', 'Tell stories about the pieces; it fills quiet time and builds trust', 'Ask easy questions: "Gold or silver girl? Tell me!"', 'Share the live to your story and groups in the first 2 minutes', 'Never apologize for low numbers on camera'],
      queen: "I'd rather see you sell your heart out to three people than act disappointed in front of thirty. Energy is contagious, and so is disappointment." },
    { kind: 'scenario', title: 'Two viewers', situation: "You go live at 7:00 sharp. At 7:05 there are 2 viewers and no comments. You feel your face getting hot.",
      options: [
        { text: 'Say "Wow, nobody\'s here tonight, I\'ll try again tomorrow" and end the live', feedback: "Replays, late joiners and shares often bring the crowd at minute 10 or 15. Ending early guarantees zero sales." },
        { text: 'Keep your energy up, greet the two by name, share to your story and start your opener piece', best: true, feedback: "Exactly. You're selling to the two in the room AND to everyone who watches the replay. Many quiet starts turn into strong finishes." },
        { text: 'Wait silently until more people join', feedback: "Silence makes the two viewers leave too. Talk to them, they showed up for you." },
      ] },
    { kind: 'scenario', title: 'The comment that stings', situation: "Mid-live, someone you don't know comments: 'Why is your hair like that?' A few regulars go quiet.",
      options: [
        { text: 'Stop selling and argue back', feedback: "Now the whole live is about one rude stranger, and your buyers came to shop." },
        { text: 'Smile, say "Thanks for stopping by!", keep selling, and hide or ban the comment afterward', best: true, feedback: "Graceful and in control. Your regulars see a pro, and the troll gets nothing to feed on." },
        { text: 'End the live early because you\'re upset', feedback: "Understandable, but one stranger shouldn't cost you a whole night of sales. Take a breath and keep going." },
      ] },
    { kind: 'script', title: 'Lines for awkward moments', text: 'Keep these ready so you never freeze.', lines: [
      'Rude comment: "Thanks for stopping by! Okay ladies, next piece…"',
      'Tech glitch: "Y\'all, my phone is being dramatic tonight. Give me two seconds, don\'t go anywhere!"',
      'Dropped a piece: "That\'s how you know it\'s sturdy! Let me show you again."',
      'Forgot a price: "Hold that thought, let me check my list so I give you the right price."',
    ] },
    { kind: 'learn', title: 'Turn nerves into excitement', text: "Harvard Business School researcher Alison Wood Brooks found that telling yourself 'I am excited' before a nerve-racking performance worked better than trying to calm down. Nerves and excitement feel almost the same in the body: fast heartbeat, energy. Calling it excitement helps you use it.",
      example: "Before every live, Marcy stands up, rolls her shoulders and says out loud, 'I'm excited to show them this!' Then she hits Go Live." },
    { kind: 'checklist', title: 'Your 10-minute pre-live routine', prompt: 'Tick each step you\'ll do before your next live.', items: ['Wipe my lens and check my light with a test video', 'Water nearby, phone on Do Not Disturb', 'Lay out my pieces in order', 'Say my opener out loud once', 'Tell myself "I\'m excited"', 'Go live on time, even if it\'s quiet'] },
    { kind: 'reflect', title: 'Your on-camera goal', prompt: 'What is one thing about how you look or sound on camera that you want to improve, and what will you change this week?', placeholder: 'I want to improve… This week I will…', example: 'I talk too fast when I\'m nervous. This week I\'ll pause after every price and count to two.' },
  ],
}
export default lesson
