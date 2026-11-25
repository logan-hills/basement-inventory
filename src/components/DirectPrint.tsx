import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { Capacitor } from '@capacitor/core'
import { canDirectPrint, connectBluetooth, connectSerial, connectUsb, connected, directPrintSupport, disconnect, learnLabel, onConnChange, printDirect, reconnect } from '../lib/directPrint'

/** Direct print (beta): print straight to a thermal label printer from Chrome or Edge, with the exact label size
    sent along with every label. No print window, no paper size to set. */
export default function DirectPrint({ w, h, turn, count, sizeName, prepare, gapMm }: {
  /** Label as the printer feeds it, inches: across the head, then along the feed. */
  w: number; h: number; turn: boolean; count: number; sizeName: string
  /** Runs right before printing, to put the page in its plain direct-print shape. */
  prepare?: () => void
  gapMm?: number
}) {
  const [, bump] = useState(0)
  useEffect(() => onConnChange(() => bump(v => v + 1)), [])
  useEffect(() => { reconnect() }, [])
  const key = `directMiddle:${w}x${h}`
  const [middle, setMiddleState] = useState(() => { try { const v = localStorage.getItem(key); return v == null ? w < 3.5 : v === '1' } catch { return w < 3.5 } })
  useEffect(() => { try { const v = localStorage.getItem(key); setMiddleState(v == null ? w < 3.5 : v === '1') } catch { /* ignore */ } }, [key, w])
  const setMiddle = (v: boolean) => { setMiddleState(v); try { localStorage.setItem(key, v ? '1' : '0') } catch { /* ignore */ } }
  const [flip, setFlip] = useState(() => { try { return localStorage.getItem('directFlip') === '1' } catch { return false } })
  const [busy, setBusy] = useState('')
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  if (Capacitor.isNativePlatform() || !canDirectPrint()) return (
    <div className="direct-print muted small">
      <b>Direct print</b> works in Chrome or Edge on a computer. On this device, use Print or Save for printer app.
    </div>
  )
  const sup = directPrintSupport()
  const c = connected()

  async function run(label: string, fn: () => Promise<unknown>, done?: string) {
    setBusy(label); setMsg(null)
    try { await fn(); if (done) setMsg({ ok: true, text: done }) }
    catch (e: any) {
      const m = String(e?.message ?? e)
      if (e?.name === 'NotFoundError' || /cancel/i.test(m)) setMsg(null)
      else if (e?.name === 'SecurityError' || /access denied|claim/i.test(m)) setMsg({ ok: false, text: 'Your computer is holding on to that printer for its own print window, so the browser can\'t reach it by cable. Try Bluetooth instead, or unplug and replug the printer and connect again.' })
      else setMsg({ ok: false, text: `That didn't work: ${m}` })
    } finally { setBusy('') }
  }

  async function print(only?: number) {
    await run('print', async () => {
      if (prepare) flushSync(prepare)
      const n = await printDirect({ w, h, turn, middle, flip, gapMm, selector: only === 1 ? '.print-area .sheet:first-child' : undefined },
        (d, t) => setBusy(`print ${d}/${t}`))
      setMsg({ ok: true, text: `Sent ${n} label${n === 1 ? '' : 's'} to your printer. One per label, no settings needed.` })
    })
  }

  return (
    <section className="direct-print stack">
      <div className="row-between"><b>Direct print <span className="chip-mini">Beta</span></b>{c && <span className="small direct-on">● {c.name}</span>}</div>
      <p className="small muted">Prints straight to your thermal label printer at exactly {sizeName}. No print window and no paper size to set.</p>
      {!c ? (
        <div className="row-gap">
          {sup.usb && <button className="btn gold" disabled={!!busy} onClick={() => run('usb', connectUsb)}>Connect by USB cable</button>}
          {sup.bluetooth && <button className="btn outline-gold" disabled={!!busy} onClick={() => run('bt', connectBluetooth)}>Connect by Bluetooth</button>}
          {sup.serial && <button className="link-btn" disabled={!!busy} onClick={() => run('serial', connectSerial)}>Printer paired in Bluetooth settings? Pick it here</button>}
        </div>
      ) : (
        <>
          <div className="stack tight-gap">
            <span className="label-text">Where does the roll sit in your printer?</span>
            <div className="seg" role="group" aria-label="Where the roll sits">
              <button className={middle ? 'on' : ''} aria-pressed={middle} onClick={() => setMiddle(true)}>In the middle</button>
              <button className={!middle ? 'on' : ''} aria-pressed={!middle} onClick={() => setMiddle(false)}>Against the left side</button>
            </div>
          </div>
          <div className="row-gap">
            {count > 1 && <button className="btn ghost big" disabled={!!busy} onClick={() => print(1)}>Print 1 test label</button>}
            <button className="btn primary big" disabled={!!busy || !count} onClick={() => print()}>{busy.startsWith('print') ? `Printing ${busy.slice(6)}…` : `Direct print ${count} label${count === 1 ? '' : 's'}`}</button>
          </div>
          <details className="small">
            <summary className="gold">Not quite right?</summary>
            <ul>
              <li>Blank labels: switch where the roll sits, then print 1 test label.</li>
              <li>Labels skip or the print lands across two labels: <button className="link-btn" disabled={!!busy} onClick={() => run('learn', () => learnLabel({ w, h, middle, gapMm }), 'Your printer fed a label to learn the size. Print 1 test label now.')}>Let the printer learn the label</button>, then print 1 test label.</li>
              <li>Printing upside down: <label className="check-line"><input type="checkbox" checked={flip} onChange={e => { setFlip(e.target.checked); try { localStorage.setItem('directFlip', e.target.checked ? '1' : '0') } catch { /* ignore */ } }} />Turn it end for end</label></li>
              <li>Nothing happens at all: your printer may use a different printer language. Use Print below instead, and tell us the printer's name.</li>
            </ul>
            <button className="link-btn" onClick={() => disconnect()}>Disconnect this printer</button>
          </details>
        </>
      )}
      {msg && <p className={`small ${msg.ok ? 'scan-test-ok' : 'warn-text'}`} role="status">{msg.text}</p>}
    </section>
  )
}
