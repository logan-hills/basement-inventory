import { Link } from 'react-router-dom'
import Icon from './Icon'

/* An Orientation lesson, dressed as a boutique hang tag: notched top, a grommet with a gold
   string, the lesson number, and a status ribbon. Sits beside the course bags in the same look. */

export default function LessonTag({ to, no, title, minutes, activities, icon, tone, status, score }: {
  to: string; no: string; title: string; minutes: number; activities: number; icon: string; tone: string; status?: 'done' | 'started'; score?: number | null
}) {
  const label = status === 'done' ? `Certified ${score ?? 100}%` : status === 'started' ? 'In progress' : 'Start'
  return (
    <Link to={to} className={`htag-wrap tone-${tone}${status ? ` is-${status}` : ''}`} aria-label={`Lesson ${no}: ${title}, ${minutes} minutes, ${label}`}>
      <svg className="htag-string" viewBox="0 0 40 46" aria-hidden="true"><path d="M20 46 C 6 30, 34 18, 20 0" /></svg>
      <span className="htag">
        <span className="htag-hole" aria-hidden="true" />
        <span className="htag-no">Nº {no}</span>
        <span className="htag-ico"><Icon name={icon} size={22} /></span>
        <b className="htag-title">{title}</b>
        <span className="htag-rule" aria-hidden="true" />
        <span className="htag-meta">{minutes} min · {activities} activities</span>
        <span className={`htag-status${status ? ` ${status}` : ''}`}>{label}</span>
      </span>
    </Link>
  )
}
