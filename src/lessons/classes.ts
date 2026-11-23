/* Dazzle University Orientation: live classes taught by the Dynamic Dazzle team.
   Edit the days, times and topics here; the University page reads them as they are.
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
}

export const CLASS_TZ = 'Eastern Time'

export const LIVE_CLASSES: LiveClass[] = [
  {
    id: 'implementation', day: 'Mondays', title: 'Implementation meeting', tone: 'violet',
    what: 'Set your shop up with us, step by step, and leave ready to receive and tag your first pieces.',
    covers: ['Your settings, profile and team', 'Receiving and tagging', 'Printing 2×1 tags and bin labels', 'Shelves, bins and scanning'],
    prep: ['launch', 'tour', 'settings'],
    sessions: [{ label: 'Daytime', time: '12:00 PM' }, { label: 'Evening', time: '7:00 PM' }],
  },
  {
    id: 'golive', day: 'Wednesdays', title: 'How to go Live', tone: 'fuchsia',
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

/** Paid 1:1 strategic planning with the Queen. Edit the rate here. */
export const QUEEN_SESSION = {
  title: 'Schedule time with the Queen',
  what: 'A private 1:1 strategic planning session for your shop: your goals, your strengths and weak spots, and a plan you can act on this month.',
  credential: 'MBA in business project planning, Capella University',
  rate: 100,
  firstHourOff: 0.5,
}
