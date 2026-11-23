import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useSession } from '../lib/session'

export default function CreateShop() {
  const { refreshShop } = useSession()
  const [name, setName] = useState('The Basement')
  const [msg, setMsg] = useState('')

  async function submit(e: FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('shops').insert({ name })
    if (error) setMsg(error.message)
    else await refreshShop()
  }

  return (
    <div className="center-page">
      <form className="card auth" onSubmit={submit}>
        <h1>Name your shop</h1>
        <p className="muted">You can invite staff later.</p>
        <label>Shop name<input required value={name} onChange={e => setName(e.target.value)} /></label>
        <button className="primary">Create shop</button>
        {msg && <p className="note">{msg}</p>}
      </form>
    </div>
  )
}
