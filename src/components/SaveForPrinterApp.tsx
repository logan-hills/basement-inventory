import { useState } from 'react'
import { saveLabelsAsImages } from '../lib/printImage'

/** A second way to print: save the labels as pictures for the printer's own phone app. */
export default function SaveForPrinterApp({ name, disabled, turn = false }: { name: string; disabled?: boolean; turn?: boolean }) {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  async function go() {
    setBusy(true); setMsg('')
    try {
      const n = await saveLabelsAsImages(name, undefined, turn)
      if (n) setMsg(`${n} label picture${n === 1 ? '' : 's'} ready. Open ${n === 1 ? 'it' : 'them'} in your printer's app and print at 100%.`)
    } catch {
      setMsg('Those pictures didn\'t save. Try again, or use Print from a computer.')
    } finally { setBusy(false) }
  }
  return (
    <div className="stack tight-gap">
      <button className="btn outline-gold big" disabled={disabled || busy} onClick={go}>{busy ? 'Making pictures…' : 'Save for printer app (phones)'}</button>
      {msg && <p className="muted small" role="status">{msg}</p>}
    </div>
  )
}
