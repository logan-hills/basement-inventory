import { useState } from 'react'
import { useToast } from '../lib/toast'
import { splitStreamUrl } from '../lib/stage'

const APPS = [
  {
    id: 'prism', name: 'Prism', where: 'Phone',
    steps: ['Open Prism Live Studio and tap Go live.', 'Tap the channel picker, then Add channel, then Custom RTMP.', 'Paste the Server and the Stream key from above, then Save.', 'Turn on only that custom channel and tap Go live.'],
  },
  {
    id: 'larix', name: 'Larix', where: 'Phone',
    steps: ['Open Larix Broadcaster, tap the gear, then Connections.', 'Tap New connection and paste the Full link from above as the URL.', 'Save, make sure it is the only connection switched on, then go back.', 'Tap the big round button to start streaming.'],
  },
  {
    id: 'obs', name: 'OBS', where: 'Computer',
    steps: ['Open OBS Studio, then Settings, then Stream.', 'Service: Custom. Paste the Server and the Stream key from above.', 'Click OK, then Start Streaming.'],
  },
  {
    id: 'streamlabs', name: 'Streamlabs', where: 'Computer',
    steps: ['Open Streamlabs Desktop, then Settings, then Stream.', 'Stream type: Custom ingest. Paste the URL (Server) and Stream key from above.', 'Click Done, then Go Live.'],
  },
]

function CopyRow({ label, value, secret }: { label: string; value: string; secret?: boolean }) {
  const toast = useToast()
  const [show, setShow] = useState(!secret)
  return (
    <div className="key-row">
      <span className="key-label">{label}</span>
      <code className="key-value">{show ? value : '•'.repeat(Math.min(24, value.length))}</code>
      <div className="row-gap">
        {secret && <button type="button" className="btn ghost small" onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'}</button>}
        <button type="button" className="btn gold small" onClick={async () => { try { await navigator.clipboard.writeText(value); toast(`${label} copied`, { kind: 'ok' }) } catch { setShow(true); toast('Copy did not work. Press and hold to copy.', { kind: 'bad' }) } }}>Copy</button>
      </div>
    </div>
  )
}

/** The stream key for one slot, plus step-by-step help for the free streaming apps. */
export default function StreamSetup({ url }: { url: string | null }) {
  const [app, setApp] = useState('prism')
  const parts = url ? splitStreamUrl(url) : null
  const a = APPS.find(x => x.id === app)!
  return (
    <div className="stack">
      {parts ? (
        <div className="key-box stack tight-gap">
          <CopyRow label="Server" value={parts.server} />
          {parts.key && <CopyRow label="Stream key" value={parts.key} secret />}
          <CopyRow label="Full link" value={url!} secret />
          <p className="muted small">This key is only for your slot. It stops working when your slot ends, so nobody can reuse it.</p>
        </div>
      ) : (
        <p className="muted">Your stream key will show up here a few minutes before your slot.</p>
      )}
      <div className="stack tight-gap">
        <span className="eyebrow">How to go live with it</span>
        <div className="row-gap">
          {APPS.map(x => <button key={x.id} type="button" className={`chip ${x.id === app ? 'on' : ''}`} onClick={() => setApp(x.id)}>{x.name} <span className="chip-sub">· {x.where}</span></button>)}
        </div>
        <ol className="steps">{a.steps.map(s => <li key={s}>{s}</li>)}</ol>
        <p className="muted small">Start streaming any time after your key appears. You stay hidden in preview until your start time, then the app puts you live on the Page.</p>
      </div>
    </div>
  )
}
