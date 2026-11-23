import { useEffect, useRef, useState } from 'react'
import { BarcodeDetector as Ponyfill } from 'barcode-detector/ponyfill'

const FORMATS = ['code_128', 'code_39', 'ean_13', 'upc_a', 'qr_code']

type Props = {
  onCode: (code: string) => void
  /** Ignore the same code again within this many ms (prevents double scans). */
  repeatDelay?: number
}

/** Back-camera barcode scanner. Works on iPhone Safari, Android Chrome and laptops with a camera. */
export default function CameraScanner({ onCode, repeatDelay = 2000 }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const onCodeRef = useRef(onCode)
  onCodeRef.current = onCode
  const [error, setError] = useState('')
  const [torch, setTorch] = useState<{ on: boolean; track: MediaStreamTrack } | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null
    let stopped = false
    let timer = 0
    const last = { code: '', at: 0 }

    ;(async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        if (stopped) { stream.getTracks().forEach(t => t.stop()); return }
        const video = videoRef.current!
        video.srcObject = stream
        await video.play()

        const track = stream.getVideoTracks()[0]
        const caps = (track.getCapabilities?.() ?? {}) as { torch?: boolean }
        if (caps.torch) setTorch({ on: false, track })

        const Native = (window as any).BarcodeDetector
        let detector: { detect: (s: HTMLVideoElement) => Promise<{ rawValue: string }[]> }
        if (Native) {
          const supported: string[] = (await Native.getSupportedFormats?.()) ?? []
          const fmts = FORMATS.filter(f => supported.includes(f))
          detector = fmts.length ? new Native({ formats: fmts }) : new Ponyfill({ formats: FORMATS as any })
        } else {
          detector = new Ponyfill({ formats: FORMATS as any })
        }

        const tick = async () => {
          if (stopped) return
          try {
            if (video.readyState >= 2) {
              const found = await detector.detect(video)
              const code = found[0]?.rawValue?.trim()
              const now = Date.now()
              if (code && (code !== last.code || now - last.at > repeatDelay)) {
                last.code = code; last.at = now
                onCodeRef.current(code)
              }
            }
          } catch { /* keep trying */ }
          timer = window.setTimeout(tick, 120)
        }
        tick()
      } catch (e: any) {
        setError(e?.name === 'NotAllowedError'
          ? 'Camera access was blocked. Allow camera access for this site in your browser settings, then reload.'
          : 'Could not start the camera on this device.')
      }
    })()

    return () => {
      stopped = true
      clearTimeout(timer)
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [repeatDelay])

  async function toggleTorch() {
    if (!torch) return
    const on = !torch.on
    try {
      await torch.track.applyConstraints({ advanced: [{ torch: on } as any] })
      setTorch({ ...torch, on })
    } catch { /* not supported */ }
  }

  if (error) return <div className="camera-box camera-error">{error}</div>

  return (
    <div className="camera-box">
      <video ref={videoRef} playsInline muted />
      <div className="camera-frame" aria-hidden="true"><span /></div>
      {torch && (
        <button type="button" className="torch" onClick={toggleTorch} aria-label={torch.on ? 'Turn light off' : 'Turn light on'}>
          {torch.on ? 'Light on' : 'Light'}
        </button>
      )}
    </div>
  )
}
