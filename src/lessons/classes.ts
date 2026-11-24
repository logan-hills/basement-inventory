/* Dazzle University Orientation: live classes taught by the Dynamic Dazzle team.
   These are the default days and times. The Queen changes them in the app (Edit class times,
   saved by src/lib/classSchedule.ts); topics and prep lessons are edited here.
   Times are Eastern, to match the shared calendar. */

export type ClassSession = { label: 'Daytime' | 'Evening'; time: string }
export type LiveClass = {
  id: string
  day: string
  title: string
  what: string
  covers: string[]
  /** Lesson ids to take before (or after) the class. */
  prep: string[]
  sessions: ClassSession[]
  tone: string
  /** Day of the week, 0 = Sunday. Used to list the next class dates. */
  weekday: number
  /** How long the class runs, for calendar invites. */
  minutes: number
  /** Dates (YYYY-MM-DD) with no class, set by the Queen. */
  skip?: string[]
}

export const CLASS_TZ = 'Eastern Time'
/** The time zone the class times are in, for calendar invites. */
export const CLASS_TZ_ID = 'America/New_York'

export const LIVE_CLASSES: LiveClass[] = [
  {
    id: 'implementation', day: 'Mondays', weekday: 1, minutes: 60, title: 'Implementation meeting', tone: 'violet',
    what: 'Set your shop up with us, step by step, and leave ready to receive and tag your first pieces.',
    covers: ['Your settings, profile and team', 'Receiving and tagging', 'Printing 2×1 tags and bin labels', 'Shelves, bins and scanning'],
    prep: ['launch', 'tour', 'settings'],
    sessions: [{ label: 'Daytime', time: '12:00 PM' }, { label: 'Evening', time: '7:00 PM' }],
  },
  {
    id: 'golive', day: 'Wednesdays', weekday: 3, minutes: 60, title: 'How to go Live', tone: 'fuchsia',
    what: 'Plan a live, book your slot on the shared calendar, and run the comment bot so no sale gets missed.',
    covers: ['Planning a live in the app', 'Booking the shared calendar', 'Comment bot setup and claims', 'Turning claims into orders'],
    prep: ['planner', 'calendar', 'liveprep', 'bot'],
    sessions: [{ label: 'Daytime', time: '1:00 PM' }, { label: 'Evening', time: '8:00 PM' }],
  },
]

export const ONE_ON_ONE = {
  title: '1:1 coaching',
  what: 'Stuck on something, or want a walkthrough with your own stock? Book a private session with the Dynamic Dazzle team, daytime or evening.',
}

/** Paid 1:1 business consult with the Queen. Edit the rates here; the Consult page and lesson read them. */
export const QUEEN_SESSION = {
  title: 'Schedule time with the Queen',
  tagline: '1:1 business consulting, on any topic',
  what: 'Bring your business, your plan and your questions. The Queen works through your challenges with you and hands you the tools to tackle them.',
  credential: 'MBA in business project planning, Capella University',
  /** Dollars per hour. */
  rate: 100,
  /** Share off the first full hour. */
  firstHourOff: 0.5,
  /** About this much per hour of follow-up research, quoted first. */
  researchRate: 25,
  /** Share of the session price paid up front to book. */
  deposit: 0.5,
  /** Where booking requests go: the Queen's own inbox. */
  email: 'LaVerne_q@hotmail.com',
  /** Ideas to get sellers started; tapping one adds it to their request. */
  ideas: [
    'Price my pieces so I make a real profit',
    'Build a simple business plan for next year',
    'Get more people to show up to my lives',
    'Find better vendors and buy smarter',
    'Set up my LLC, EIN and sales tax the right way',
    'Get organized so packing takes half the time',
    'Grow my repeat buyers and VIP list',
    'Know when I can afford to hire help',
    'Use AI to save hours on marketing',
    'Plan my holiday season',
  ],
}

/** What's due up front to book: half the session price. */
export const consultDeposit = (hours: number) => Math.round(consultPrice(hours) * QUEEN_SESSION.deposit * 100) / 100

/** What a session costs. The first full hour gets the discount; time is prorated after that.
    A session shorter than one hour is prorated at the full rate, with no discount. */
export function consultPrice(hours: number): number {
  const { rate, firstHourOff } = QUEEN_SESSION
  if (hours < 1) return Math.round(hours * rate * 100) / 100
  return Math.round((rate * (1 - firstHourOff) + (hours - 1) * rate) * 100) / 100
}
