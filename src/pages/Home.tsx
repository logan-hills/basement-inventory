import { Link } from 'react-router-dom'
import { useSession } from '../lib/session'

const tiles = [
  { to: '/intake', title: 'Add inventory', text: 'Log items, variations, photos and print tags' },
  { to: '/inventory', title: 'Inventory', text: 'Search by name or Live Number' },
  { to: '/locations', title: 'Warehouse', text: 'Shelves, bins and the warehouse map' },
  { to: '/scan', title: 'Scan', text: 'Scan a tag or location to look it up or move it' },
]

export default function Home() {
  const { shop } = useSession()
  return (
    <>
      <h1>{shop?.name}</h1>
      <div className="tiles">
        {tiles.map(t => (
          <Link key={t.to} to={t.to} className="card tile">
            <strong>{t.title}</strong>
            <span className="muted">{t.text}</span>
          </Link>
        ))}
      </div>
    </>
  )
}
