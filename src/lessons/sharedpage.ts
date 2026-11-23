import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'sharedpage', title: 'Go live on the shared Page', track: 'Sell', icon: 'clock', minutes: 4,
  why: 'Book your hour on the big shared Page, get your own stream key, and go live to thousands of followers without anyone sharing a password.',
  route: { to: '/shared-page', label: 'Open the live calendar' },
  covers: ['src/pages/SharedPage.tsx', 'src/pages/OnAir.tsx', 'src/components/StreamSetup.tsx', 'src/components/OnAirBar.tsx', 'src/lib/stage.ts'],
  updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'One calendar, one seller per hour', text: 'Everyone shares one live calendar for the Facebook Page. Time is booked in whole hours, and once an hour is taken nobody else can book it.', points: ['Your name shows next to the hours you book', 'Tap any name to see that seller\'s profile', 'Cancel early if plans change, so someone else can use the hour'] },
    {
      kind: 'tap', title: 'Book your hour', prompt: 'You want Thursday at 7 PM. What do you tap?',
      screen: { title: 'Shared Page lives', rows: ['Thu · 6 PM Bee Boutique', 'Thu · 7 PM wide open'], buttons: ['+ Book your hour', 'Host tools', 'All slots'] },
      answer: '+ Book your hour', hint: 'Booking starts with the gold-and-green Book button at the top.',
    },
    { kind: 'learn', title: 'Your private stream key', text: 'Ten minutes before your hour, your stream key appears on the On Air screen. Paste it into Prism or Larix on your phone, or OBS or Streamlabs on a computer. It only works for your hour.', tip: 'Start streaming as soon as the key shows. You stay in a hidden preview until your start time, so you can fix your lighting.' },
    { kind: 'order', title: 'Going live, step by step', prompt: 'Put these in order.', steps: ['Book your hour', 'Open On Air when the key appears', 'Paste the server and stream key into your streaming app', 'Start streaming and wait for your start time', 'Wrap up when the 5-minute warning chimes'] },
    { kind: 'learn', title: 'Hard start, hard stop', text: 'The app puts you live at your start time and ends the live on Facebook at your stop time, even mid-sentence. A chime and a gold banner give you a 5-minute warning, and the countdown shows on every screen of the app.' },
    { kind: 'quiz', q: 'The 5-minute warning just chimed. What do you do?', options: ['Keep selling, the next seller can wait', 'Do your last call, thank buyers, and say goodbye', 'Restart the stream to get more time'], answer: 1, why: 'Stop time is hard. The live ends on its own, so finish strong and leave the stage for the next seller.' },
    { kind: 'quiz', q: 'A friend asks for your stream key so they can go live in your hour. Okay?', options: ['Yes, it is just a code', 'No, keys are only for the seller who booked'], answer: 1, why: 'Keys are personal and tied to your booking. Sharing one breaks the Terms of Use.' },
  ],
}
export default lesson
