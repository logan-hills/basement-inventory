import { NovaSays } from './Nova'
import novaLaverne from '../assets/nova-laverne.webp'
import { PLAN_NAMES } from '../lib/plan'
import { LESSONS, COURSES } from '../lessons'

/** Shown to free (Stream) shops in place of Dazzle University. */
export default function AcademyLocked() {
  return (
    <div className="stack wide-gap lesson-player">
      <div className="academy-lock card">
        <img className="lock-art" src={novaLaverne} alt="Nova the handbag with LaVerne" />
        <span className="cert-kicker">Dazzle University</span>
        <h1>Learn from Nova, grow your empire</h1>
        <NovaSays mood="wink">I'd love to teach you! Dazzle University comes with the {PLAN_NAMES.gem} plan and up: full orientation for the app with live weekly classes, plus in-depth business courses on strategic planning, making it official, taxes, money and buying, branding, social media, Canva and AI, storage, packing and keeping customers.</NovaSays>
        <ul className="lesson-points">
          <li>{LESSONS.length} hands-on orientation lessons with practice and quick checks</li>
          <li>{COURSES.length} business courses with workbooks and certificates, built on trusted sources</li>
          <li>Progress saved for you and your helpers</li>
        </ul>
        <p className="muted">To upgrade, message Dynamic Dazzle Bargain Basement on Facebook Messenger.</p>
      </div>
    </div>
  )
}
