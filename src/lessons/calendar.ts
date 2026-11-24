import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'calendar', title: 'Schedule your lives', track: 'Sell', icon: 'calendar',
  why: 'A steady schedule trains your buyers to show up.',
  outcomes: [
    'Pick live days and times that fit your buyers\' lives',
    'Schedule a weekly show for months ahead in one go',
    'Plan a month of themes around paydays and holidays',
    'Read a live\'s projected sales and profit before you go live',
    'Close out each live and keep your streak going',
  ],
  route: { to: '/calendar', label: 'Open the calendar' },
  queen: {
    welcome: "Consistency is the quiet secret of the sellers who last. When your buyers know when you'll be live, they plan their evening around you. Let's set a schedule you can keep.",
    signoff: "Pick your nights, repeat them, and tell people when you're taking a week off. A schedule you keep builds trust faster than anything you say.",
  },
  covers: ['src/pages/Calendar.tsx', 'src/components/LiveForm.tsx', 'src/pages/LiveDetail.tsx'], updated: '2026-11-24',
  slides: [
    { chapter: 'Pick your times', queen: "Choose a schedule you can keep on your hardest week, not your best one.", kind: 'learn', title: 'Same time, every week', nova: 'Consistency is a superpower. Let\'s set your show times.',
      text: 'TV shows have time slots for a reason: people build their week around them. When buyers know "Tuesday 7, she\'s on," they stop needing a reminder. That habit is worth more than any single post.' },
    { kind: 'learn', title: 'When is your buyer free?', text: 'Picture your dream buyer\'s day. When is she home, fed, and scrolling?',
      table: { head: ['Time', 'Who\'s usually free'], rows: [
        ['Weekday 7 to 9 PM ET', 'Working women after dinner. The most popular window.'],
        ['Weekday noon', 'Lunch breaks. Shorter, quicker lives.'],
        ['Saturday morning', 'Coffee-and-scroll shoppers, retirees'],
        ['Sunday afternoon', 'After church, relaxed browsing'],
        ['Late night (after 10)', 'Night-shift workers and night owls'],
      ] },
      tip: 'Your buyers are in different time zones. 7 PM Eastern is 4 PM Pacific. Always say the time zone.' },
    { kind: 'learn', title: 'Avoid clashes', text: 'Check what your buyers are doing on your night. A live during Wednesday Bible study, a big game, or a show everyone watches will be quiet no matter how good your pieces are. Ask your regulars: "What nights work best for y\'all?" Then listen.' },
    { kind: 'scenario', title: 'Choose your night', situation: 'Most of your buyers are women 45 and up who work days. Many go to midweek church service on Wednesday nights.',
      options: [
        { text: 'Wednesday at 7 PM, since it\'s the middle of the week', feedback: 'That\'s right when many of your buyers are in service.' },
        { text: 'Tuesday and Thursday at 7 PM ET, every week', best: true, feedback: 'After work, after dinner, around church night, and the same every week so it becomes a habit.' },
        { text: 'Whenever you have time that week', feedback: 'A moving schedule means buyers never build the habit, and every live starts cold.' },
      ] },

    { kind: 'quiz', q: 'You go live at 7 PM Eastern. A buyer in California wants to join. What time is it for her?', options: ['7 PM', '4 PM', '10 PM'], answer: 1, why: 'Pacific time is 3 hours behind Eastern. That\'s why every post should say "7 PM ET."' },
    { chapter: 'Put it on the calendar', kind: 'learn', title: 'Schedule a live', text: 'Tap a day (or Schedule a live). Give it a title, theme, host, start time and length. You can schedule as far ahead as you like.',
      screen: { title: 'Schedule a live', rows: ['Title', 'Theme', 'Host', 'Date · Start · Length', 'Repeat every week'], buttons: ['Schedule'], highlight: 'Schedule' } },
    { kind: 'learn', title: 'Repeat every week', text: 'For your regular show, set Repeat every week to 4, 8, 13 (3 months), 26 (6 months), 52 (a year) or 104 weeks. Each one is its own live, so you can still change a theme or cancel one week without touching the rest.' },
    { kind: 'quiz', q: 'You go live every Tuesday. Fastest way to add the next 3 months?', options: ['Set Repeat every week to 13 weeks', 'Add each one by hand'], answer: 0, why: 'Repeat every week fills the calendar for you, and each live can still be changed on its own.' },
    { kind: 'learn', title: 'How long should a live be?', text: 'Longer isn\'t always better. Viewers drop off as the night goes on, and so does your energy.',
      table: { head: ['Length', 'Good for'], rows: [
        ['30 to 45 min', 'Flash sales, lunch lives, your first few lives'],
        ['60 min', 'Most regular shows. The shared Page books in 1-hour blocks.'],
        ['90 min to 2 hr', 'Big hauls and holiday shows, with a co-host to share the talking'],
      ] } },

    { kind: 'quiz', q: 'You\'re brand new and nervous on camera. What length should your first few lives be?', options: ['3 hours, to sell everything', '30 to 45 minutes', 'However long until people leave'], answer: 1, why: 'Short lives keep your energy high and leave buyers wanting more. Grow the length as you grow your crowd.' },
    { chapter: 'Plan the month', kind: 'learn', title: 'A month of themes', text: 'Plan the month in one sitting. Put your best themes on the best nights: right after paydays (often the 1st and 15th, or Fridays) and before holidays.',
      table: { head: ['Week', 'Tuesday', 'Thursday'], rows: [
        ['1 (payday week)', 'Payday Bag Bonanza', 'New Arrivals'],
        ['2', '$2 Tuesday', 'Church Hat Sunday prep'],
        ['3 (payday week)', 'Gold Rush', 'Customer Picks'],
        ['4', '$2 Tuesday', 'Clearance: Run a sale on old stock'],
      ] } },
    { kind: 'reflect', title: 'Your schedule', prompt: 'Which days and times will you go live every week, and what themes will you use this month?', placeholder: 'I go live…', example: 'Tuesday and Thursday at 7 PM ET, 1 hour. Payday Bonanza on the 1st, $2 Tuesday every other week, clearance the last Thursday.' },

    { queen: "Announce your breaks ahead of time. Buyers forgive a planned week off. They worry about a surprise one.", kind: 'scenario', title: 'Taking a week off', situation: 'You\'re going to a family reunion and will miss next Tuesday\'s live.',
      options: [
        { text: 'Just skip it, nobody will notice', feedback: 'Your regulars will show up to an empty Page and wonder if you\'re okay, or if you quit.' },
        { text: 'Cancel that one live on the calendar, tell buyers on the live before and in a post, and give them the date you\'re back', best: true, feedback: 'Your habit stays intact because they know exactly when to come back.' },
        { text: 'Go live from the reunion with no pieces', feedback: 'Rest! A planned break is much better than a weak live.' },
      ] },
    { kind: 'script', title: 'Announce your schedule', text: 'Pin this, and say it at the end of every live.',
      lines: [
        '"Mark your calendars, family! 📅 I\'m LIVE every Tuesday and Thursday at 7 PM Eastern (6 Central, 4 Pacific)."',
        '"Tap Follow and turn on notifications so you never miss a live. See you Tuesday! 💛"',
      ] },
    { chapter: 'Before and after', kind: 'learn', title: 'Projected sales and profit', text: 'Once you pick items for a live, it shows Projected sales (what comes in if everything sells) and Projected profit (after what you paid). It\'s your target for the night, and an early warning if a live is too thin.',
      example: 'Thursday shows Projected sales $640 and Projected profit $390. Last Thursday you sold about 60% of what you planned. So expect around $384 in sales, and plan a few more strong pieces if that\'s below your goal.' },
    { kind: 'number', title: 'What to expect', q: 'A live shows Projected sales of $800. Usually you sell about 55% of what you plan. About how much should you expect to sell?', prefix: '$', answer: 440, hint: 'Multiply the projected sales by 0.55.', why: '$800 × 0.55 = $440. Track your own percent live to live. It\'s the most honest forecast you\'ll ever have.' },
    { kind: 'learn', title: 'Mark it done', text: 'After the show, open the live, tap More, then Mark live as done. Your streak on Home grows with every live. Can\'t make one? Tap More, then Cancel live, so your calendar stays honest. Edit the details and Delete this live are in the same More list.' },
    { kind: 'learn', title: 'Going live on the shared Page?', text: 'Your own calendar is for planning. To claim an hour on the shared Facebook Page, tap Shared Page in the Lives row at the top of the screen and book your hour there. Book your Page hour first, then schedule the matching live on your calendar.' },
    { kind: 'tap', title: 'Practice', prompt: 'You want to book Thursday 7 PM on the shared Facebook Page. On the calendar, tap…', screen: { title: 'Lives', buttons: ['Planner', 'Calendar', 'Get ready', 'Giveaways', 'Shared Page'] }, answer: 'Shared Page', hint: 'Shared Page, in the row at the top, takes you to the shared calendar where you book your hour.' },
    { kind: 'checklist', title: 'Set up your calendar', prompt: 'Tick each one as you do it.', items: [
      'Ask my regulars which nights work best',
      'Pick my weekly days, times and length',
      'Schedule my weekly show to repeat for 13 weeks',
      'Plan this month\'s themes',
      'Book my shared Page hours (if I use the Page)',
      'Put my live days and times on my Page cover photo',
    ] },
  ],
}
export default lesson
