import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'host', title: 'Live classes and Queen sessions, start to finish', track: 'Start here', icon: 'live',
  why: 'A live class only helps if you can get in the room. Learn exactly how to join a class or a 1:1 with the Queen, and how the Queen and her Founder team run them from the Host desk.',
  outcomes: [
    'Save a seat and join a live class with one tap, 15 minutes before the start',
    'Join a booked Time with the Queen session from the app or your calendar',
    'Know what Zoom, Google Meet and Microsoft Teams ask of you as a guest',
    'For Founders: save a meeting link once and start every class from the Host desk',
    'For Founders: book a paid consult so the client gets her own Join button',
    'For Founders: give team members\' shops every feature free',
  ],
  route: { to: '/lessons', label: 'Open Dazzle University' },
  queen: {
    welcome: "I want every one of you in the room with me, not stuck looking for a link. This lesson shows you how to get into class with one tap, and how my team and I run it on our side.",
    signoff: "Save your seat, put it on your calendar, and come with your questions. When that Join button lights up, tap it. I'll be right there waiting for you.",
  },
  covers: ['src/pages/HostDesk.tsx', 'src/lib/meetings.ts', 'src/components/JoinNow.tsx', 'supabase/020_host_desk.sql', 'supabase/021_founder_from_host_desk.sql', 'src/lib/requests.ts', 'src/components/CoachingRequest.tsx', 'supabase/022_founder_host_desk_and_requests.sql'], updated: '2026-11-25',
  slides: [
    /* ---------- Module 1: how it fits together ---------- */
    { chapter: 'Module 1 · How live classes work', kind: 'learn', title: 'One link, saved once, used every week', nova: 'Hey love! Ever had a class start while you were still digging through email for the link? Not here. Let me show you.',
      text: 'Every week the Queen and her team teach two free live orientation classes, each with a daytime and an evening time, plus private paid sessions called Time with the Queen. These happen on a video call, the same kind of call you may already use with family. The Queen saves her meeting link in the app once. From then on the app hands it to the right people at the right time: a big Start button for her, and a Join button for everyone with a seat. Nobody has to forward links, and nobody gets left in the hallway.',
      visual: { type: 'flow', caption: 'How a class gets from the Queen to you', steps: [
        { label: 'The Queen saves her link', note: 'Once, on her Host desk' },
        { label: 'You save your seat', note: 'Daytime or evening, pick a date' },
        { label: 'Add it to your calendar', note: 'The link is inside the invite' },
        { label: 'Join lights up', note: '15 minutes before the start' },
        { label: 'Tap Join, you\'re in', note: 'Zoom, Meet or Teams opens' },
      ] },
      term: { word: 'Meeting link', meaning: 'A web address that opens a video call when you tap it. It looks like zoom.us/j/… or meet.google.com/… and it works the same every week if the host keeps the same room.' } },
    { kind: 'learn', title: 'Where you\'ll find the Join button', text: 'The app shows your Join button in three places, so you never have to hunt for it. The button stays hidden until 15 minutes before the start, so you can\'t accidentally walk in on the class before yours. It stays up until the class ends, so if you\'re running late you can still slip in.',
      table: { head: ['Where', 'What you see', 'When'], rows: [
        ['Home screen', 'A gold banner: your class name and Join now', 'From 15 minutes before until the end'],
        ['Dazzle University home, Join a live class', '✓ You\'re in, with Join class now under it', 'Same window; before that it tells you the exact time it appears'],
        ['Time with the Queen page (1:1 sessions)', 'Your booked time, with Join now', 'Same window'],
        ['Your phone\'s calendar', 'The link in the invite\'s location and notes', 'Any time'],
      ] },
      tip: 'Before the window opens, your seat says "Your Join button shows here at 6:45 PM ET" (or whatever time fits). That\'s your cue to grab a drink and get comfortable.' },
    { kind: 'howto', title: 'Save your seat and get the reminder', text: 'Saving a seat takes under a minute. Do it as soon as you decide to come, because a seat on the list is how the team knows to expect you.', steps: [
      { title: 'Open Dazzle University', detail: 'Tap University on the top bar, or More, then Dazzle University on a phone.' },
      { title: 'Find step 2, Join a live class', detail: 'Each class card shows its day, its next dates and two times: daytime and evening.', example: 'Implementation meeting · Mondays · 12:00 PM and 7:00 PM' },
      { title: 'Tap the time that fits your day', detail: 'A pop-up opens. Pick the date, check your name and email, and tap Save my seat.' },
      { title: 'Tap Add to calendar', detail: 'Your phone or computer adds the class with a 30-minute reminder. If the Queen has saved her link, it\'s inside the invite, so you can join straight from the calendar too.' },
      { title: 'On class day, tap Join', detail: 'From 15 minutes before, tap Join class now on your seat or on the Home banner. Your video app opens and you\'re in the room.' },
    ], tip: 'Can\'t make it after all? Tap Cancel on your seat. It frees the spot and keeps the list honest for the team.' },
    { kind: 'tap', title: 'Practice: join your class', prompt: 'It\'s 6:50 PM and your 7:00 PM class is on the University home. Which button gets you in?', screen: { title: '✓ You\'re in: Mon, Dec 1 · 7:00 PM', buttons: ['Add to calendar', 'Join class now', 'Cancel', 'Save my seat'] }, answer: 'Join class now', hint: 'You already have a seat. Now you want to walk into the room.' },
    { kind: 'quiz', q: 'Your class starts at 1:00 PM. When does the Join button appear?', options: ['The night before', 'At 12:45 PM, 15 minutes before', 'Only at exactly 1:00 PM', 'After the class ends'], answer: 1, why: 'Join lights up 15 minutes before the start and stays until the end. That gives you time to test your sound without walking in on the class before yours.' },

    /* ---------- Module 2: being a great guest ---------- */
    { chapter: 'Module 2 · Joining like a pro', queen: "Come five minutes early with your camera on and your questions written down. The sellers who show up ready are the ones who grow the fastest.", kind: 'learn', title: 'What happens when you tap Join', text: 'Tapping Join opens the Queen\'s video call. What you see next depends on the service she picked and your device. On a computer, most calls open right in your web browser. On a phone, the call may ask to open its free app, or to install it the first time. That\'s normal and it\'s free. Once you\'re in, you\'ll usually see a screen to check your camera and microphone, then a button like Join now or Ask to join.',
      visual: { type: 'compare', style: 'plain', caption: 'What each service asks of a guest', left: { title: 'On a computer', items: ['Opens in your browser', 'Allow camera and microphone when asked', 'Type your name if asked', 'Tap Join now'] }, right: { title: 'On a phone', items: ['May ask to open the app', 'Install it free the first time', 'Allow camera and microphone', 'Tap Join'] } },
      points: ['Zoom: tap Join from browser on a computer, or open the Zoom app on a phone', 'Google Meet: opens in Chrome or Safari on a computer; on a phone it may send you to the Google Meet app', 'Microsoft Teams: choose Continue on this browser on a computer; no account needed to join as a guest'] },
    { kind: 'howto', title: 'Your 10-minute class checklist', text: 'Run through this before your first class. After that it takes two minutes.', steps: [
      { title: 'Charge up', detail: 'Plug in your phone or laptop. A video call drains a battery fast.' },
      { title: 'Find a quiet, bright spot', detail: 'Face a window or a lamp so we can see you. Light behind you turns you into a shadow.' },
      { title: 'Have your shop open', detail: 'In an implementation class we set things up together. Keep the app open in another tab or on a second device.', example: 'Laptop on the call, phone open to Settings in the app' },
      { title: 'Write your questions', detail: 'Two or three, in order. If time runs short, you\'ll still get your biggest one answered.' },
      { title: 'Join 5 minutes early', detail: 'Tap Join as soon as it lights up. Test your sound, wave hello, and settle in.' },
      { title: 'Mute when you\'re not talking', detail: 'Background noise carries. Unmute when the Queen asks for questions.' },
    ] },
    { kind: 'scenario', title: 'The link won\'t open', situation: 'It\'s 7:02 PM. You tapped Join class now and your phone asked to install an app. You\'re worried you\'ll miss the start.',
      options: [
        { text: 'Give up and catch the next one', feedback: 'You don\'t need to. Installing the free app takes about a minute, and the class runs a full hour.' },
        { text: 'Install the free app, then tap Join again', best: true, feedback: 'Yes. It\'s a one-time step. Next week the app opens straight into the call.' },
        { text: 'Email the team and wait for a new link', feedback: 'The link is fine. The phone just needs the app first. Install it and tap Join again.' },
      ] },

    /* ---------- Module 3: Time with the Queen ---------- */
    { chapter: 'Module 3 · Your 1:1 with the Queen', kind: 'learn', title: 'From request to Join button', text: 'Time with the Queen is a paid 1:1 business consult. You send a request from the Time with the Queen page. The Queen replies with a time and how to pay your 50% deposit. Once it\'s paid, she books your session in the app under the email you sign in with. From that moment your session shows at the top of Time with the Queen, with an Add to calendar button, and a Join now button that lights up 15 minutes before you start. She also emails you the time and the link, so you have it in two places.',
      visual: { type: 'flow', steps: [
        { label: 'Send your request', note: 'Topics, goal, length' },
        { label: 'She replies with a time', note: 'And how to pay' },
        { label: 'Pay the 50% deposit', note: '$25 for a full first hour' },
        { label: 'She books it in the app', note: 'Under your sign-in email' },
        { label: 'Join now lights up', note: '15 minutes before' },
      ] },
      tip: 'Book with the same email you use to sign in to the app. That\'s how your session finds you.' },
    { kind: 'quiz', q: 'Your session doesn\'t show on the Time with the Queen page, but you got the confirmation email. What\'s the most likely reason?', options: ['The session was cancelled', 'It was booked under a different email than the one you sign in with', 'Sessions never show in the app'], answer: 1, why: 'Sessions are matched by email. Use the link in your confirmation email for today, and reply to the Queen with your sign-in email so she can fix the booking.' },

    /* ---------- Module 4: for the Queen and her hosts ---------- */
    { chapter: 'Module 4 · For Founders: the Host desk', queen: "Keep it simple. One room for each class, one for your 1:1s, and use the same links every week. Your regulars will learn exactly where to find you.", kind: 'learn', title: 'Your stage, in one place', text: 'Only Founder accounts get a Host desk: the Queen\'s own shop, her team, and anyone she adds under Free for you and your team. Other sellers never see it, and the server checks this too. Open it from More, then ♛ Host desk, or from the University home under Join a live class. At the top sit Requests: every 1:1 coaching and Time with the Queen request sellers send from the forms in the app, newest first, with a coral count of new ones (your Home screen shows the count too). Below that are four parts: Up next, with a big Start button for your next class or session; Your meeting rooms, where you paste each link once; Time with the Queen, where you book paid sessions; and Free for you and your team, where you give team members\' shops every feature free.',
      screen: { title: 'Host desk', rows: ['Next up · Starts in 12 minutes', 'How to go Live · Wed, Dec 3 · 8:00 PM ET', '9 seats saved'], buttons: ['Start class in Zoom', 'Who\'s coming (9)', 'Your meeting rooms', 'Book a session'], highlight: 'Start class in Zoom' },
      points: ['The Start button glows gold from 15 minutes before', 'Before that it says Open early, so you can set up in peace', 'No link saved yet? It says Add your meeting link first and takes you there'] },
    { kind: 'learn', title: 'Pick a meeting service', text: 'Any service that gives you a link works. These are the three most people already know. Plans and limits change, so check the service\'s own page before you choose, but at the time of writing this is how they compare for a one-hour class.',
      table: { head: ['Service', 'Free plan', 'Good to know'], rows: [
        ['Google Meet', 'Up to 100 people; group calls end at 60 minutes; 1:1 calls run much longer', 'Needs a free Google account to host. Guests join in the browser.'],
        ['Zoom', 'Every meeting ends at 40 minutes', 'Most familiar to many guests. Pro (about $16 a month) removes the limit.'],
        ['Microsoft Teams (free)', 'Up to 100 people for 60 minutes', 'Host with a Microsoft account, like a Hotmail or Outlook address.'],
      ] },
      visual: { type: 'bars', unit: ' min', caption: 'Longest free group call', bars: [
        { label: 'Zoom free', value: 40, note: 'Too short for a 60-minute class' },
        { label: 'Google Meet free', value: 60, hl: true },
        { label: 'Teams free', value: 60, hl: true },
      ] },
      tip: 'Classes run 60 minutes. A free plan that stops at 60 means you end right on time, so start on the minute.' },
    { kind: 'howto', title: 'Save your meeting rooms', text: 'Do this once. The same link works every week until you change it.', steps: [
      { title: 'Make a room you can reuse', detail: 'In Google Meet tap New meeting, then Create a meeting for later. In Zoom use your Personal Room. In Teams choose Create a link under Meet.', example: 'meet.google.com/abc-defg-hij' },
      { title: 'Copy the link', detail: 'Tap Copy, or press and hold the link and choose Copy.' },
      { title: 'Open your Host desk, Your meeting rooms', detail: 'There\'s one box for each class and one for Time with the Queen (1:1).' },
      { title: 'Paste and tap Save link', detail: 'Pasted a whole invite by mistake? That\'s fine. The app pulls the link out of it.' },
      { title: 'Tap Test it', detail: 'Your room opens in a new tab. If it opens for you, it opens for your guests.' },
    ], tip: 'Your 1:1 room stays private. Only Founder accounts and the client on a booked session see it. Class links go to everyone with a seat.' },
    { kind: 'howto', title: 'Run a class from the Host desk', steps: [
      { title: '15 minutes before: check Who\'s coming', detail: 'Tap Who\'s coming to see every name. Tap Email everyone the join link for a last-minute reminder (it opens your email with everyone in BCC).' },
      { title: '10 minutes before: tap Start', detail: 'The gold Start button opens your room. Turn on your camera, check your light and sound.' },
      { title: 'At the start: welcome people in', detail: 'Give latecomers two or three minutes. Some services ask you to admit guests. Watch for that pop-up.' },
      { title: 'Teach, then take questions', detail: 'Follow the class topics on the card. Leave the last 15 minutes for questions.' },
      { title: 'Close on time', detail: 'Tell them the next class date and the lessons to take before it, then end the call.' },
    ] },
    { kind: 'script', title: 'Your class welcome', text: 'A warm, short opening sets the tone and saves time. Make it your own.', lines: [
      '"Welcome in, Queens! Give everyone two minutes to come in."',
      '"Today is ______. By the end, you\'ll leave with ______."',
      '"Please mute when you\'re not talking. Questions go in the chat or wait for our Q&A at the end."',
      '"If your screen freezes, tap the Join button in the app again. It\'s the same room."',
      '"Let\'s get started!"',
    ] },
    { kind: 'order', title: 'Practice: class night, in order', prompt: 'Put the host\'s steps in order.', steps: ['Check Who\'s coming', 'Tap Start', 'Welcome people in', 'Teach the topics', 'Take questions', 'Share the next date and end the call'] },
    { kind: 'howto', title: 'Answer a request', text: 'Sellers never open an email app to reach you. They fill in a short form in the app (Book 1:1 coaching on the Help desk and Live classes page, or Send my request on Time with the Queen) and it lands at the top of your Host desk.', steps: [
      { title: 'Read the request', detail: 'Each card shows what she wants (1:1 coaching or Time with the Queen), when she sent it, her shop, her best time, and her topics. Tap Read her request for the full note.', example: 'Time with the Queen · 30 min ago · Tasha Green · Evening · 1 hr · Money and pricing' },
      { title: 'Reach out', detail: 'Tap Call if she left a phone number, or Email her to reply from your own email. Offer a time and, for a paid session, how to pay the deposit.' },
      { title: 'Book it when the deposit is in', detail: 'On a Time with the Queen request, tap Book her session. Her name, email, phone, length and topics are filled in for you. Pick the date and time and tap Book it. The request is marked handled for you.' },
      { title: 'Mark coaching handled', detail: 'For 1:1 coaching, tap ✓ Handled once you\'ve set the time. Show handled brings old ones back if you need them.' },
    ], tip: 'Answer new requests within a day. A quick "Got it, I\'ll have a time for you tomorrow" keeps a new seller excited.' },
    { kind: 'howto', title: 'Book a Time with the Queen session', text: 'Book it once the client\'s deposit is in. Then she sees it in her own app.', steps: [
      { title: 'Tap Book a session', detail: 'On the Host desk, under Time with the Queen.' },
      { title: 'Fill in her details', detail: 'Her name, the email she signs in with, phone if you have it, date and time (Eastern), length and topic.', example: 'Tasha Green · tasha@email.com · Tue, Dec 9 · 11:00 AM · 1 hr · Pricing for profit' },
      { title: 'Leave the meeting link empty', detail: 'It uses your 1:1 room. Paste a different link only for a one-off.' },
      { title: 'Tap Book it, then Email her the details', detail: 'Your email opens with the time, length, topic and link filled in. Read it over and send.' },
      { title: 'Afterwards, tap ✓ Done', detail: 'It moves off your list. Cancel takes a session off both calendars.' },
    ], tip: 'Download the calendar invite and send it too. Many clients trust their calendar more than their inbox.' },
    { kind: 'scenario', title: 'Group class on a free plan', situation: 'You\'re setting up the Wednesday class. A helper suggests the free Zoom plan because "everyone knows Zoom."',
      options: [
        { text: 'Use free Zoom and teach faster', feedback: 'Free Zoom ends every meeting at 40 minutes, so a 60-minute class gets cut off two-thirds of the way through.' },
        { text: 'Use free Google Meet or Teams, or pay for Zoom Pro', best: true, feedback: 'Right. Meet and Teams free plans fit a one-hour class. If your guests really prefer Zoom, Pro removes the limit for about $16 a month.' },
        { text: 'Skip the video call and post a text guide', feedback: 'Guides help, but live classes are where questions get answered. Keep the call.' },
      ] },

    /* ---------- Module 5: free for the Queen's team ---------- */
    { chapter: 'Module 5 · For Founders: free for your team', queen: "The people who build this with me should never pay to use it. Add them, and let them focus on serving our sellers.", kind: 'learn', title: 'You built it, your team uses it free', text: 'Everyone else picks a plan. The Queen\'s own shop, and any shop she adds, gets every feature free: Dazzle University, team members, everything. There are two ways her team works free. Helpers she invites in Settings, Team members, work inside her shop, so they\'re already covered. A team member who runs her own separate shop gets added on the Host desk under Free for you and your team, by the email she signs in with.',
      term: { word: 'Free access', meaning: 'A shop that uses every feature without a paid plan. Only Founder accounts can give it or take it away. A shop with free access is on the Founder plan, so its owner gets the Host desk too.' },
      points: ['She must sign up and create her shop first, then you add her email', 'She may need to close and reopen the app to see everything', 'Remove takes her back to the free Stream plan. Your own shop can\'t be removed.'] },
    { kind: 'quiz', q: 'Dee helps in the Queen\'s shop and also runs her own shop. How does Dee get her own shop free?', options: ['Invite her as a team member again', 'Add her sign-in email under Free for you and your team on the Host desk', 'She can\'t; only the Queen\'s shop is free'], answer: 1, why: 'Team member invites cover work inside the Queen\'s shop. Her own shop needs free access, added by her sign-in email on the Host desk.' },

    /* ---------- Wrap-up ---------- */
    { kind: 'recap', title: 'Key takeaways', points: [
      'Save your seat, then Add to calendar: the link is in the invite',
      'Join lights up 15 minutes before, on Home, the University home and Time with the Queen',
      'On a phone, the first join may ask you to install a free app. That\'s normal.',
      'Book 1:1s with your sign-in email so your session shows in the app',
      'Founders: save each meeting link once, then tap Start on the Host desk',
      'Founders: book paid sessions after the deposit, and email the client in one tap',
      'The Queen\'s shop and any shop she adds use every feature free',
    ] },
    { kind: 'checklist', title: 'Your next class', prompt: 'Tick these off before your next live class.', items: ['Save my seat for a class this week', 'Add it to my calendar', 'Charge my phone or laptop', 'Write down two questions', 'Tap Join as soon as it lights up', 'Stuck before then? Tap Book 1:1 coaching on the Help desk'] },
  ],
}
export default lesson
