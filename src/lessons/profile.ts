import type { Lesson } from './types'

const lesson: Lesson = {
  id: 'profile', title: 'Your seller profile and privacy', track: 'Start here', icon: 'users', minutes: 2,
  why: 'Let other sellers get to know you while you decide exactly what they can see.',
  route: { to: '/profile', label: 'Open my profile' },
  covers: ['src/pages/Profile.tsx', 'src/components/ProfileForm.tsx', 'src/pages/FinishSignup.tsx', 'src/pages/Login.tsx', 'src/lib/profile.ts', 'src/lib/legal.ts'],
  updated: '2026-11-23',
  slides: [
    { kind: 'learn', title: 'Two kinds of accounts', text: 'Just stream is free: book your hour on the shared Page and go live. The full seller app adds inventory, labels, live prep, picking and shipping. You can switch in My profile.' },
    { kind: 'learn', title: 'Shown or hidden', text: 'Your calendar name is always shown so everyone knows whose hour it is. Your photo, bio, email and phone each have a Shown / Hidden switch.', points: ['Shown: other sellers in the app can see it', 'Hidden: only you and the app team'], screen: { title: 'My profile', rows: ['Name on the live calendar', 'Email  ·  Hidden', 'Phone  ·  Hidden'], buttons: ['Shown', 'Hidden', 'Save profile'], highlight: 'Hidden' } },
    { kind: 'learn', title: 'Your business stays yours', text: 'Inventory, prices, costs, customers and orders are never shown to other sellers, only to you and the staff you add to your shop.' },
    { kind: 'quiz', q: 'You want sellers to see your bio but not your phone. What do you set?', options: ['Bio Shown, Phone Hidden', 'Both Hidden', 'Both Shown'], answer: 0, why: 'Each detail has its own switch.' },
  ],
}
export default lesson
