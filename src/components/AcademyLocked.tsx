import { NovaSays } from './Nova'
import { PLAN_NAMES } from '../lib/plan'

/** Shown to free (Stream) shops in place of Dazzle Academy. */
export default function AcademyLocked() {
  return (
    <div className="stack wide-gap lesson-player">
      <div className="academy-lock card">
        <span className="cert-kicker">Dazzle Academy</span>
        <h1>Learn from Nova, grow your empire</h1>
        <NovaSays mood="wink">I'd love to teach you! Dazzle Academy comes with the {PLAN_NAMES.gem} plan and up: every app lesson plus in-depth business courses on branding, marketing, social media, TikTok Shop, shipping and customer care.</NovaSays>
        <ul className="lesson-points">
          <li>17 hands-on app lessons with practice and quick checks</li>
          <li>7 business courses with workbooks and certificates</li>
          <li>Progress saved for you and your helpers</li>
        </ul>
        <p className="muted">To upgrade, message Dynamic Dazzle Bargain Basement on Facebook Messenger.</p>
      </div>
    </div>
  )
}
