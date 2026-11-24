import type { NovaMood } from '../components/Nova'

/* Nova's 5-minute tip: one small, doable action a day, shown on Home.
   Each tip is something a seller can finish in about five minutes, and points to the course that goes deeper.
   Keep `course` pointing at a real lesson id. Add tips any time; they rotate by day of the year. */

export type DailyTip = {
  mood: NovaMood
  /** What Nova says on Home: one short sentence. */
  line: string
  /** The 5-minute job, as a title. */
  title: string
  /** Two to four tiny steps. */
  steps: string[]
  /** The lesson or course that teaches the why. */
  course: string
}

export const DAILY_TIPS: DailyTip[] = [
  { mood: 'wink', line: 'Two touches fill the room: post your poster two days ahead, then again an hour before.', title: 'Schedule your two live reminders', course: 'marketing',
    steps: ['Open your next live\'s poster', 'Schedule a post for two days before', 'Schedule a second post for one hour before'] },
  { mood: 'happy', line: 'Say your rules at the start AND end of every live.', title: 'Write your 20-second rules line', course: 'nopays',
    steps: ['Write when invoices are due and how to pay, in one sentence', 'Add your claim word ("SOLD + number")', 'Save it in your phone notes for live night'] },
  { mood: 'wow', line: 'A handwritten thank-you costs pennies and brings her back next week.', title: 'Write five thank-you cards', course: 'retention',
    steps: ['Grab five cards and a pen', 'Write one warm line and your next live day on each', 'Put them by your packing station'] },
  { mood: 'think', line: 'Running behind on shipping? Message buyers before they ask.', title: 'Send one "heads up" message', course: 'communication',
    steps: ['Check for any order that will ship later than promised', 'Send the buyer a short, warm update with the new date', 'Note it in Customers'] },
  { mood: 'cheer', line: 'Shout out your top buyers by name on live. People love to be seen.', title: 'Find your top five buyers', course: 'customers',
    steps: ['Open Customers and sort by spend', 'Write down your top five names', 'Plan to greet each one by name next live'] },
  { mood: 'happy', line: 'One Reel a day keeps the empty room away.', title: 'Clip 20 seconds from your last live', course: 'reels',
    steps: ['Open your last live replay', 'Find the best 20 seconds (a reveal or a big claim)', 'Add text with your next live day and post it'] },
  { mood: 'think', line: 'Do you know what it really costs you to ship a box?', title: 'Work out your true shipping cost', course: 'shipprice',
    steps: ['Add up last week\'s labels', 'Add mailers, tissue, tape and cards', 'Divide by the number of boxes and compare to what you charge'] },
  { mood: 'wink', line: 'Pay yourself first, even if it\'s small.', title: 'Set your pay day', course: 'moneymindset',
    steps: ['Pick a day each month that\'s your pay day', 'Choose a starting percentage (even 5%)', 'Put a repeating reminder in your phone'] },
  { mood: 'think', line: 'Tax money isn\'t spending money. Move it the day you\'re paid.', title: 'Move this week\'s tax set-aside', course: 'taxsimple',
    steps: ['Check this week\'s profit', 'Move your set-aside percent to your tax savings', 'Note the amount for your records'] },
  { mood: 'happy', line: 'Good light is the cheapest glow-up there is.', title: 'Do a 30-second light check', course: 'camera',
    steps: ['Set up where you go live', 'Record 30 seconds facing your light', 'Watch it back with the sound off and adjust'] },
  { mood: 'wow', line: 'Every piece has a story. Find one sense word for tonight\'s star piece.', title: 'Write one story line', course: 'stories',
    steps: ['Pick your best piece for the next live', 'Write one sense word, one moment and who it\'s perfect for', 'Say it out loud once'] },
  { mood: 'think', line: 'Old stock is cash taking a nap. Wake it up.', title: 'Pick five pieces for a markdown', course: 'sale',
    steps: ['Open Inventory and sort by oldest', 'Choose five pieces that have sat the longest', 'Tag them for your next sale live'] },
  { mood: 'cheer', line: 'Ten minutes of tidying keeps the whole shop findable.', title: 'Tidy one shelf', course: 'storage',
    steps: ['Pick one shelf or bin', 'Put strays back in their home and scan anything moved', 'Throw out empty bags and boxes'] },
  { mood: 'think', line: 'Count a little, often, and your stock stays honest.', title: 'Count one bin', course: 'scan',
    steps: ['Pick one bin', 'Scan every piece in it', 'Fix anything that doesn\'t match'] },
  { mood: 'happy', line: 'Your Reports know which category to buy more of.', title: 'Check your top category', course: 'reports',
    steps: ['Open Reports, then Top categories', 'Note your best seller and your slowest', 'Write one buying rule from it'] },
  { mood: 'wink', line: 'Your catchphrase is a brand you can hear.', title: 'Try three catchphrases', course: 'brandkit',
    steps: ['Write three short lines you could say after every claim', 'Say each one out loud', 'Pick one and use it all week'] },
  { mood: 'think', line: 'Before you buy a pallet, set your walk-away price.', title: 'Set your bulk-buying rule', course: 'loads',
    steps: ['Think of what your buyers pay for a typical piece', 'Divide it by four: that\'s your max cost per sellable piece', 'Write it on a card in your wallet'] },
  { mood: 'happy', line: 'Pre-orders let your buyers tell you what to buy.', title: 'Pick a pre-order idea', course: 'preorder',
    steps: ['Find a sold-out best seller in Inventory', 'Ask your vendor about price, minimum and lead time', 'Jot a cutoff and ship date with a cushion'] },
  { mood: 'think', line: 'Never sell what you haven\'t held.', title: 'Order a sample', course: 'livedrop',
    steps: ['Pick one drop-ship idea', 'Order a sample to your own door', 'Write down the date so you can time delivery'] },
  { mood: 'cheer', line: 'Measurements stop "it doesn\'t fit" messages.', title: 'Measure three pieces', course: 'nopays',
    steps: ['Lay three tops flat', 'Measure armpit to armpit and length', 'Add the numbers to each item\'s notes'] },
  { mood: 'happy', line: 'Your shop hours protect your family time.', title: 'Post your shop hours', course: 'familybalance',
    steps: ['Pick two message windows a day', 'Write your shop hours and your day off', 'Pin them in your group'] },
  { mood: 'wink', line: 'Rest is part of the plan, not a break from it.', title: 'Put rest on your calendar', course: 'selfcare',
    steps: ['Open your calendar', 'Block one full day off this week', 'Block a bedtime that gives you 7 hours on live nights'] },
  { mood: 'wow', line: 'Wealth is built quietly, a little every month.', title: 'Name your beneficiaries', course: 'wealth',
    steps: ['Log in to any bank or retirement account', 'Find the beneficiary section', 'Add or check the people you want named'] },
  { mood: 'think', line: 'One more platform, not five. Score them before you jump.', title: 'Score one second platform', course: 'secondplatform',
    steps: ['Pick TikTok Shop, Instagram or Whatnot', 'Score it 1 to 5 on buyers, stock, strengths, fees and time', 'Write the total in your notes'] },
  { mood: 'cheer', line: 'The job that drains you is the first one to hand off.', title: 'Find your first hand-off job', course: 'hiring',
    steps: ['List the jobs you did this week', 'Circle the one that drains you most', 'Write how many hours it takes a week'] },
  { mood: 'happy', line: 'Catch the thought, check it, change it.', title: 'Flip one thought', course: 'mindset',
    steps: ['Write one discouraging thought you had this week', 'Ask: is it a fact or a feeling?', 'Rewrite it as a growth line and read it out loud'] },
  { mood: 'think', line: 'Push, pivot or pause? Ask it about one stuck thing.', title: 'Run the push, pivot or pause check', course: 'persistence',
    steps: ['Name one part of the shop that feels stuck', 'Decide: push, pivot or pause', 'Write the very next step'] },
  { mood: 'wink', line: 'Say your price, then stop talking.', title: 'Practice your price line', course: 'herpower',
    steps: ['Pick a piece and say the price out loud', 'Count to three in silence', 'Do it twice more until it feels normal'] },
  { mood: 'happy', line: 'A slow-season cushion turns a quiet January into a shrug.', title: 'Add to your cushion', course: 'persistence',
    steps: ['Open your savings', 'Move $5 to $25 into your shop cushion', 'Write the new total down and smile'] },
  { mood: 'think', line: 'Your pinned post answers questions while you sleep.', title: 'Refresh your pinned post', course: 'launchbiz',
    steps: ['Open your pinned "how to shop with me" post', 'Update live days, payment and shipping', 'Add one fresh photo'] },
  { mood: 'cheer', line: 'Feature a buyer this week. Belonging sells.', title: 'Feature one happy buyer', course: 'community',
    steps: ['Ask a regular for a photo wearing her piece', 'Post it with a thank-you', 'Tag her (with her permission)'] },
  { mood: 'think', line: 'Check one subscription. Is it earning its keep?', title: 'Audit one app', course: 'apps',
    steps: ['Open your bank statement', 'Find one subscription', 'Keep it only if you used it last month'] },
  { mood: 'happy', line: 'Two-step sign-in protects your shop from hackers.', title: 'Turn on two-step sign-in', course: 'apps',
    steps: ['Open Facebook settings, then Security', 'Turn on two-factor authentication', 'Save your backup codes somewhere safe'] },
  { mood: 'wink', line: 'Let AI draft, you decide.', title: 'Draft your week of posts with AI', course: 'aimarketing',
    steps: ['Tell your AI assistant your next live\'s theme and buyer', 'Ask for three short posts in your voice', 'Edit them so they sound like you'] },
  { mood: 'think', line: 'Check a fact before you post it.', title: 'Double-check one AI answer', course: 'aicalm',
    steps: ['Pick one number or rule an AI gave you', 'Find it on the official site', 'Fix your notes if it was wrong'] },
  { mood: 'happy', line: 'Your opening 60 seconds set the whole live.', title: 'Rehearse your opener', course: 'liveplan',
    steps: ['Write a three-sentence opener with your theme and star piece', 'Say it out loud twice', 'Save it for live night'] },
  { mood: 'cheer', line: 'Bundles beat cheap singles.', title: 'Build one bundle', course: 'growth',
    steps: ['Pick three small pieces that go together', 'Price them a little under the total', 'Give the bundle a fun name'] },
  { mood: 'think', line: 'Your SWOT is a mirror. Look in it for five minutes.', title: 'Write one strength and one weakness', course: 'strategy1',
    steps: ['Write the one thing your buyers love most', 'Write the one thing that keeps going wrong', 'Pick one small fix for this week'] },
  { mood: 'happy', line: 'A vendor thank-you gets you first pick next time.', title: 'Thank a vendor', course: 'vendors',
    steps: ['Pick your favorite vendor', 'Send a short thank-you about your last order', 'Ask what\'s coming in next'] },
  { mood: 'wink', line: 'Keep your money in two pots, not one.', title: 'Check your money walls', course: 'finance',
    steps: ['Look at your business account this week', 'Find any personal spending', 'Move it back and note how to avoid it'] },
  { mood: 'wow', line: 'Your space is part of your brand.', title: 'Style your live corner', course: 'camera',
    steps: ['Clear anything messy from the camera\'s view', 'Add one brand touch: logo, plant or light', 'Take a photo to remember the setup'] },
  { mood: 'think', line: 'Recalls are real. Check anything for babies before you sell it.', title: 'Run one recall check', course: 'loads',
    steps: ['Pick any kids\' item, cord or battery piece in stock', 'Search the brand and model on cpsc.gov/Recalls', 'Pull it from stock if it\'s recalled'] },
]

/** Today's tip: rotates by day of the year so everyone sees the same tip on the same day. */
export function tipIndexFor(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0)
  const day = Math.floor((date.getTime() - start.getTime()) / 864e5)
  return day % DAILY_TIPS.length
}
