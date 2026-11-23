// Scan feedback: a buzz (where the device allows it), a short tone and a screen flash.
// In the iPhone app, buzzes use the phone's real haptic engine.
import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'

const native = Capacitor.isNativePlatform()

let ctx: AudioContext | null = null
let soundOn = true
try { soundOn = localStorage.getItem('scanSound') !== 'off' } catch { /* ignore */ }

export function setSound(on: boolean) {
  soundOn = on
  try { localStorage.setItem('scanSound', on ? 'on' : 'off') } catch { /* ignore */ }
}
export const soundEnabled = () => soundOn

function tone(freq: number, ms: number, delay = 0) {
  if (!soundOn) return
  try {
    ctx ??= new AudioContext()
    const t = ctx.currentTime + delay / 1000
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.25, t + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + ms / 1000)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + ms / 1000 + 0.02)
  } catch { /* audio not available */ }
}

function vibrate(pattern: number | number[]) {
  if (native) {
    const ms = Array.isArray(pattern) ? 0 : pattern
    const p = Array.isArray(pattern)
      ? Haptics.notification({ type: NotificationType.Error })
      : ms >= 30 ? Haptics.notification({ type: NotificationType.Success }) : Haptics.impact({ style: ImpactStyle.Light })
    p.catch(() => { /* ignore */ })
    return
  }
  try { navigator.vibrate?.(pattern) } catch { /* not supported (iPhone browsers) */ }
}

function flash(kind: 'ok' | 'bad') {
  const el = document.createElement('div')
  el.className = `scan-flash ${kind}`
  document.body.appendChild(el)
  setTimeout(() => el.remove(), 450)
}

export function feedbackOk() {
  vibrate(35)
  tone(1320, 90)
  flash('ok')
}

export function feedbackBad() {
  vibrate([60, 60, 60])
  tone(220, 140)
  tone(180, 180, 160)
  flash('bad')
}

/** Light tap for buttons and swipes. */
export function tap() {
  vibrate(10)
}
