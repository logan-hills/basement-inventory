import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import CrispBarcode from '../components/CrispBarcode'
import SaveForPrinterApp from '../components/SaveForPrinterApp'
import { GEAR, GEAR_GROUPS, TEST_SIZES, amazonLink, type TestSize } from '../lib/gear'
import { SCANNER_SPEED_MS } from '../lib/scanner'
import { feedbackOk } from '../lib/feedback'

type ScanResult = { code: string; avgMs: number | null; ending: 'Enter' | 'Tab' }

/** Scan anything into the box: shows what the scanner sent and whether it's set up right. */
function ScannerTest() {
  const [val, setVal] = useState('')
  const [res, setRes] = useState<ScanResult | null>(null)
  const times = useRef<number[]>([])

  function finish(ending: 'Enter' | 'Tab') {
    const code = val.trim()
    if (!code) return
    const t = times.current
    const avgMs = t.length > 2 ? (t[t.length - 1] - t[0]) / (t.length - 1) : null
    setRes({ code, avgMs, ending })
    feedbackOk()
    setVal(''); times.current = []
  }
  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key.length === 1) times.current.push(performance.now())
    if (e.key === 'Tab' && val.trim()) { e.preventDefault(); finish('Tab') }
  }
  const fromScanner = res?.avgMs != null && res.avgMs < SCANNER_SPEED_MS

  return (
    <div className="card stack">
      <span className="eyebrow">Test your scanner</span>
      <p>Tap the box, then scan any barcode: an item tag, a bin label, or the barcode on a cereal box.</p>
      <form className="scan-input" onSubmit={(e: FormEvent) => { e.preventDefault(); finish('Enter') }}>
        <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={onKey} placeholder="Scan here" autoComplete="off" autoCapitalize="characters" enterKeyHint="go" aria-label="Scanner test box" />
        <button className="btn primary">Check</button>
      </form>
      {res && (
        <div className="stack tight-gap" role="status">
          <span className="scan-test-out mono">{res.code}</span>
          {fromScanner ? <span className="scan-test-ok">It works! Your scanner typed that in a flash and pressed {res.ending}. You're ready to scan.</span>
            : res.avgMs == null ? <span className="muted">Got it. Scan once more to check the speed.</span>
            : <span className="muted">That looks hand-typed. Try scanning with your scanner to test it.</span>}
          {res.ending === 'Tab' && <span className="muted small">Your scanner presses Tab after each scan. That's fine here: Dazzle Warehouse treats it like Enter.</span>}
        </div>
      )}
      <details>
        <summary className="gold">Nothing showed up?</summary>
        <ol className="muted">
          <li>Tap inside the box first so it has a blinking cursor.</li>
          <li>Bluetooth: make sure the scanner is paired in your phone or computer's Bluetooth settings, in keyboard (HID) mode.</li>
          <li>If the code shows up but nothing happens after, scan the "Add Enter" or "carriage return" code in the scanner's manual.</li>
          <li>Odd characters, like é or @ in place of numbers? Scan the "US keyboard" code in the manual.</li>
        </ol>
      </details>
    </div>
  )
}

function TestLabel({ size }: { size: TestSize }) {
  const s = TEST_SIZES[size]
  const small = s.h <= 1
  if (size === 'r58' || size === 'r80') return (
    <div className={`receipt ${size === 'r80' ? 'wide' : ''}`}>
      <div className="receipt-shop">Test receipt</div>
      <div className="receipt-center">{s.name}</div>
      <div className="receipt-rule" />
      <div className="receipt-line"><span>Sparkle top · Live #1234</span><span>$24.00</span></div>
      <div className="receipt-line"><span>Gold hoops · Live #5678</span><span>$12.00</span></div>
      <div className="receipt-rule" />
      <div className="receipt-line receipt-total"><span>Total</span><span>$36.00</span></div>
      <CrispBarcode value="DD-TEST42" heightIn={0.4} maxWidthIn={size === 'r80' ? 2.6 : 1.8} />
      <div className="receipt-center">If the edges aren't cut off, you're set.</div>
    </div>
  )
  return (
    <div className="testlabel">
      <i /><i /><i /><i />
      <b style={{ fontSize: small ? '11pt' : '30pt' }}>{s.w}×{s.h} in</b>
      {!small && <small style={{ fontSize: '12pt' }}>Dazzle Warehouse test label</small>}
      <CrispBarcode value="DAZZLE-TEST" heightIn={small ? 0.36 : 1} maxWidthIn={s.w - 0.4} maxDots={small ? 3 : 4} />
      <small style={{ fontSize: small ? '6pt' : '11pt' }}>All 4 corners showing? You're lined up.</small>
    </div>
  )
}

function TestPrint() {
  const [size, setSize] = useState<TestSize>('2x1')
  const s = TEST_SIZES[size]
  const receipt = size === 'r58' || size === 'r80'
  const ref = useRef<HTMLDivElement>(null)
  const [h, setH] = useState<number>(s.h)
  // Receipts are as long as they need to be, so measure the printed height.
  useEffect(() => { setH(receipt && ref.current ? Math.ceil((ref.current.scrollHeight / 96) * 10) / 10 : s.h) }, [size, receipt, s.h])
  return (
    <>
    <div className="card stack no-print">
      <span className="eyebrow">Test print</span>
      <p>Print one test label before a big batch. If all four corners show and the barcode is sharp, everything is lined up.</p>
      <div className="size-chips" role="group" aria-label="Label size">
        {(Object.keys(TEST_SIZES) as TestSize[]).map(k => <button key={k} className={`chip ${k === size ? 'on' : ''}`} aria-pressed={k === size} onClick={() => setSize(k)}>{TEST_SIZES[k].name}</button>)}
      </div>
      <p className="muted small">In the print window: paper size <b>{receipt ? (size === 'r58' ? '58 mm roll' : '80 mm roll') : `${s.w} x ${s.h} in`}</b>, scale 100% (Actual size), margins None.</p>
      <style>{`@page { size: ${s.w}in ${h}in; margin: 0; }`}</style>
      <button className="btn primary big" onClick={() => window.print()}>Print test {receipt ? 'receipt' : 'label'}</button>
      <SaveForPrinterApp name={`test-${size}`} />
    </div>
    <div className="print-area">
      <div className="sheet" ref={ref} style={{ width: `${s.w}in`, height: receipt ? 'auto' : `${s.h}in` }}><TestLabel size={size} /></div>
    </div>
    </>
  )
}

export default function Gear() {
  return (
    <div className="stack wide-gap">
      <div className="card gear-hero no-print">
        <span className="eyebrow light">Recommended gear</span>
        <h1>Tools that just work</h1>
        <p>Every scanner, printer and label here has been picked to work smoothly with Dazzle Warehouse. Start with a scanner and one thermal printer, then add rolls as you grow.</p>
        <div className="row-gap"><Link className="btn gold" to="/lessons/gear">Take the 15 minute setup lesson</Link></div>
      </div>

      {GEAR_GROUPS.map(g => (
        <section key={g.id} className="stack no-print">
          <div className="gear-group-head">
            <span className="gear-group-ico"><Icon name={g.icon} size={24} /></span>
            <div><h2 style={{ fontSize: '1.35rem' }}>{g.id}</h2><p className="muted">{g.blurb}</p></div>
          </div>
          <div className="gear-grid">
            {GEAR.filter(x => x.group === g.id).map(x => (
              <article key={x.id} className="card gear-card">
                <span className="gear-badge">{x.badge}</span>
                <h3>{x.name}</h3>
                <p className="muted">{x.why}</p>
                <div className="chip-list">{x.facts.map(f => <span key={f} className="chip-mini">{f}</span>)}</div>
                <details>
                  <summary>Set it up with Dazzle Warehouse</summary>
                  <ol>{x.setup.map((s, i) => <li key={i}>{s}</li>)}</ol>
                  <p className="small" style={{ marginTop: 8 }}>Used in: {x.useIn.map((u, i) => <span key={u.to}>{i ? ', ' : ''}<Link to={u.to}>{u.label}</Link></span>)}</p>
                </details>
                <a className="btn ghost big" href={amazonLink(x.asin)} target="_blank" rel="noopener noreferrer">View on Amazon</a>
              </article>
            ))}
          </div>
        </section>
      ))}

      <section className="stack">
        <div className="gear-group-head no-print">
          <span className="gear-group-ico"><Icon name="settings" size={24} /></span>
          <div><h2 style={{ fontSize: '1.35rem' }}>Check it works</h2><p className="muted">Two quick tests. Do them once when your gear arrives.</p></div>
        </div>
        <div className="no-print"><ScannerTest /></div>
        <TestPrint />
      </section>

      <p className="muted small no-print">Already have a different scanner or printer? Most will still work. Any scanner that types like a keyboard works, and any thermal printer that prints 2×1, 4×4 and 4×6 labels does too.</p>
    </div>
  )
}
