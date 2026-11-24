import { Link } from 'react-router-dom'
import { NovaSays } from './Nova'
import { useSession } from '../lib/session'

/** Shown to team members on the shop owner's extras: Dazzle University, Time with the Queen and Shared Page lives. */
export default function OwnerOnly({ what }: { what: string }) {
  const { shop } = useSession()
  return (
    <div className="stack wide-gap">
      <div className="card stack">
        <span className="eyebrow">Team member</span>
        <h1>{what} is for the shop owner</h1>
        <NovaSays mood="wink">You're on the {shop?.name ?? 'shop'} team, so you've got the whole warehouse: receiving, scanning, bins, picking, shipping and getting ready for lives. {what} stays with the owner. If you need something from it, just ask them!</NovaSays>
        <div className="row wrap">
          <Link className="btn primary" to="/inventory">Go to Stock</Link>
          <Link className="btn ghost" to="/orders">Go to Pick and pack</Link>
        </div>
      </div>
    </div>
  )
}
