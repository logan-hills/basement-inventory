import { useEffect, useState, type FormEvent } from 'react'
import { useSession } from '../lib/session'
import { useToast } from '../lib/toast'
import { PLAN_NAMES } from '../lib/plan'
import { cancelInvite, createInvite, loadTeam, prettyCode, removeMember, teamLimit, type TeamInvite, type TeamMember } from '../lib/team'

/**
 * Settings → Team members. The owner makes a one-time invite code; the employee signs up with their
 * own email and types the code. Team members get the shop's daily work but not the owner's extras.
 */
export default function TeamSettings() {
  const { shop, isTeam, session, refreshShop } = useSession()
  const toast = useToast()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [invites, setInvites] = useState<TeamInvite[]>([])
  const [name, setName] = useState('')
  const [fresh, setFresh] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    if (!shop || isTeam) return
    try { const t = await loadTeam(shop.id); setMembers(t.members); setInvites(t.invites); setNote('') }
    catch (e: any) { setNote(e.message) }
  }
  useEffect(() => { load() }, [shop?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!shop) return null

  if (isTeam) return (
    <section className="card stack settings-one">
      <h2>You're on the {shop.name} team</h2>
      <p className="muted">The shop owner adds and removes team members. If you're leaving the shop, you can take yourself off the team here.</p>
      <button className="btn ghost self-start" onClick={async () => {
        if (!session || !confirm(`Leave the ${shop.name} team? You'll lose access to its inventory right away.`)) return
        try { await removeMember(session.user.id); await refreshShop() } catch (e: any) { toast(e.message, { kind: 'bad' }) }
      }}>Leave this team</button>
    </section>
  )

  const limit = teamLimit(shop.plan)
  const staff = members.filter(m => m.role === 'staff')
  const used = staff.length + invites.length
  const full = used >= limit

  async function invite(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try { const code = await createInvite(name); setFresh(code); setName(''); await load() }
    catch (err: any) { toast(err.message, { kind: 'bad' }) }
    setBusy(false)
  }

  async function copy(code: string) {
    const text = `You're invited to help run ${shop!.name} on Dynamic Dazzle! 1) Sign up at ${window.location.origin}${window.location.pathname} with your own email. 2) When it asks you to name your shop, tap "I'm joining a team" and type this code: ${prettyCode(code)}. The code works once and expires in 7 days.`
    try { await navigator.clipboard.writeText(text); toast('Invite copied. Paste it in a text or message.', { kind: 'ok' }) }
    catch { toast(`Your code is ${prettyCode(code)}`) }
  }

  return (
    <div className="stack wide-gap settings-one">
      <section className="card stack">
        <h2>Your team</h2>
        <p className="muted">Team members get their own sign-in and can receive, scan, move bins, pick, pack, ship and get lives ready for {shop.name}. Dazzle University, Time with the Queen and booking Shared Page lives stay with you.</p>
        <p className="small"><b>{used} of {limit}</b> team spot{limit === 1 ? '' : 's'} used{shop.plan ? ` on the ${PLAN_NAMES[shop.plan]} plan` : ''}.</p>
        {note && <p className="note">{note}</p>}
        <div className="stack">
          {members.map(m => (
            <div key={m.user_id} className="row-between team-row">
              <span><b>{m.display_name}</b>{m.role === 'owner' ? ' · Owner (you)' : ' · Team member'}<br /><span className="muted small">{m.email}</span></span>
              {m.role === 'staff' && <button className="btn ghost small" onClick={async () => {
                if (!confirm(`Remove ${m.display_name} from your team? They lose access right away.`)) return
                try { await removeMember(m.user_id); toast(`${m.display_name} was removed`, { kind: 'ok' }); load() } catch (e: any) { toast(e.message, { kind: 'bad' }) }
              }}>Remove</button>}
            </div>
          ))}
        </div>
      </section>

      {invites.length > 0 && <section className="card stack">
        <h2>Waiting to join</h2>
        {invites.map(i => (
          <div key={i.code} className="row-between team-row">
            <span><b className="mono">{prettyCode(i.code)}</b>{i.name ? ` · for ${i.name}` : ''}<br /><span className="muted small">Works until {new Date(i.expires_at).toLocaleDateString()}</span></span>
            <span className="row">
              <button className="btn ghost small" onClick={() => copy(i.code)}>Copy invite</button>
              <button className="btn ghost small" onClick={async () => { await cancelInvite(i.code).catch(() => null); load() }}>Cancel</button>
            </span>
          </div>
        ))}
      </section>}

      <section className="card stack">
        <h2>Add a team member</h2>
        {fresh && <div className="note stack">
          <span>Here's the code for your new team member. It works once, for 7 days:</span>
          <b className="mono team-code">{prettyCode(fresh)}</b>
          <button className="btn primary self-start" onClick={() => copy(fresh)}>Copy invite to send</button>
        </div>}
        {full ? <p className="muted">All your team spots are in use. Remove someone or cancel an invite to add another{limit < 5 ? ', or upgrade your plan for more spots' : ''}.</p> : (
          <form className="stack" onSubmit={invite}>
            <label>Their name (just so you remember who the code is for)<input value={name} onChange={e => setName(e.target.value)} placeholder="Like Tasha" maxLength={80} /></label>
            <button className="btn primary big self-start" disabled={busy}>Make an invite code</button>
          </form>
        )}
      </section>
    </div>
  )
}
