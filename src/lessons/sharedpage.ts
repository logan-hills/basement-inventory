import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'sharedpage', title: 'Go live on the shared Page', track: 'Sell', icon: 'clock', minutes: 4,
  why: 'Book your hour on the big shared Page, get your own stream key, and go live to thousands of followers without anyone sharing a password.',
  route: { to: '/shared-page', label: 'Open the live calendar' },
  covers: ['src/components/GuidelinesGate.tsx', 'src/lib/guidelines.ts', 'src/pages/SharedPage.tsx', 'src/pages/OnAir.tsx', 'src/components/StreamSetup.tsx', 'src/components/OnAirBar.tsx', 'src/lib/stage.ts'],
  updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'One calendar, one seller per hour', text: 'Everyone shares one live calendar for the Facebook Page. Time is booked in whole hours, and once an hour is taken nobody else can book it.', points: ['Your name shows next to the hours you book', 'Tap any name to see that seller\'s profile', 'Cancel early if plans change, so someone else can use the hour'] },
    { kind: 'learn', title: 'The house rules, every time', text: 'Each time you open the live calendar, the Vendor Live Selling Guidelines pop up. Read to the end and tap I have read and agree. The app saves the date and time you agreed.', points: ['Log in 5 to 10 minutes early', 'More than 10 minutes late means the live is canceled automatically', 'No music, TV or designer names on your live'], tip: 'Breaking the guidelines can get your account revoked with no refund, so give them a real read.' },
    {
      kind: 'tap', title: 'Book your hour', prompt: 'You want Thursday at 7 PM. What do you tap?',
      screen: { title: 'Shared Page lives', rows: ['Thu · 6 PM Bee Boutique', 'Thu · 7 PM wide open'], buttons: ['+ Book your hour', 'Host tools', 'All slots'] },
      answer: '+ Book your hour', hint: 'Booking starts with the gold-and-green Book button at the top.',
    },
    { kind: 'learn', title: 'Your Go Live key unlocks on time', text: 'Nobody gets the Page login. At exactly your start time, on the night you booked, your private Go Live key appears on the On Air screen. Paste it into Prism or Larix on your phone, or OBS or Streamlabs on a computer, and start streaming. It only works for your hour.', tip: 'Set up your streaming app earlier in the day so at start time you just paste and go.' },
    { kind: 'order', title: 'Going live, step by step', prompt: 'Put these in order.', steps: ['Book your hour', 'Set up your streaming app ahead of time', 'At your start time, open On Air and copy your key', 'Paste the key and start streaming', 'Wrap up when the 5-minute warning chimes'] },
    { kind: 'learn', title: 'Hard start, hard stop', text: 'The app puts you live at your start time and ends the live on Facebook at your stop time, even mid-sentence. A chime and a gold banner give you a 5-minute warning, and the countdown shows on every screen of the app.' },
    { kind: 'quiz', q: 'The 5-minute warning just chimed. What do you do?', options: ['Keep selling, the next seller can wait', 'Do your last call, thank buyers, and say goodbye', 'Restart the stream to get more time'], answer: 1, why: 'Stop time is hard. The live ends on its own, so finish strong and leave the stage for the next seller.' },
    { kind: 'quiz', q: 'Your hour starts at 7:00. It is 7:11 and you are not streaming yet. What happens?', options: ['Nothing, you still have the whole hour', 'The live is canceled automatically and the hour is lost'], answer: 1, why: 'More than 10 minutes late = live canceled. Log in 5 to 10 minutes early.' },
    { kind: 'quiz', q: 'A friend asks for your stream key so they can go live in your hour. Okay?', options: ['Yes, it is just a code', 'No, keys are only for the seller who booked'], answer: 1, why: 'Keys are personal and tied to your booking. Sharing one breaks the Terms of Use.' },
  ],
}
export default lesson
