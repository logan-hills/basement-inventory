/** One small, consistent line-icon set (24px grid, 1.7 stroke). */
const PATHS: Record<string, string> = {
  dashboard: 'M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-3H4zM14 7h6V4h-6z',
  inventory: 'M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M12 11v10',
  receive: 'M12 3v12M7 10l5 5 5-5M4 17v3h16v-3',
  scan: 'M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3M8 8v8M12 8v8M16 8v8',
  warehouse: 'M3 21V9l9-6 9 6v12M7 21v-8h10v8M7 17h10',
  damaged: 'M12 3l9 16H3L12 3zM12 10v4M12 17.5v.5',
  calendar: 'M4 6h16v14H4zM4 10h16M9 3v5M15 3v5',
  live: 'M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14',
  pack: 'M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8',
  truck: 'M3 6h11v10H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.01M17 19a2 2 0 1 0 0-.01',
  users: 'M9 11a4 4 0 1 0 0-.01M2 20c0-3.5 3-6 7-6s7 2.5 7 6M17 4.5a3.5 3.5 0 0 1 0 6.5M22 20c0-2.8-1.8-4.8-4.5-5.6',
  reports: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  lessons: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21V5M8 7h7',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  upload: 'M12 16V4M7 9l5-5 5 5M4 17v3h16v-3',
  print: 'M6 9V3h12v6M6 18H4v-7h16v7h-2M7 14h10v7H7z',
  tag: 'M3 12V3h9l9 9-9 9-9-9zM7.5 7.5h.01',
  cart: 'M3 4h2l2.4 11h11l2-8H6.2M9 20a1 1 0 1 0 0-.01M18 20a1 1 0 1 0 0-.01',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 17l.7 1.8 1.8.7-1.8.7L19 22l-.7-1.8-1.8-.7 1.8-.7z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  menu: 'M4 7h16M4 12h16M4 17h16',
  plus: 'M12 5v14M5 12h14',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  trend: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  dollar: 'M12 3v18M16.5 7.5C16 6 14.3 5 12 5c-2.8 0-4.5 1.4-4.5 3.3 0 4.4 9 2.4 9 7 0 2-1.9 3.7-4.5 3.7-2.4 0-4.2-1.1-4.7-2.8',
  box: 'M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8',
  gift: 'M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9c-2-4-6-4-6-1.5S10 9 12 9zM12 9c2-4 6-4 6-1.5S14 9 12 9z',
  more: 'M3.5 12a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M10.5 12a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0M17.5 12a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0-3 0',
  chevron: 'M9 5l7 7-7 7',
  filter: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4',
  heart: 'M12 20s-7.5-4.6-9.2-9.4C1.6 7.3 3.8 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.4 0 5.6 3.3 4.4 6.6C19.5 15.4 12 20 12 20z',
  download: 'M12 4v12M7 11l5 5 5-5M4 17v3h16v-3',
}

export type IconName = keyof typeof PATHS

export default function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`icon ${className}`}>
      <path d={PATHS[name] ?? PATHS.box} />
    </svg>
  )
}
