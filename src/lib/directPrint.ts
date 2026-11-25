import { toCanvas } from 'html-to-image'

/* Direct print (beta): Chrome and Edge on a computer can talk to a thermal label printer themselves, over a USB cable
   (WebUSB), Bluetooth (Web Bluetooth), or a paired Bluetooth printer that shows up as a serial port (Web Serial).
   We send TSPL, the printer language most 4 inch thermal label printers speak (Core Innovations, MUNBYN, iDPRT, Nelko
   and many more). Every job carries the exact label size and gap, so nobody has to set a paper size, and the printer
   never runs past a label and skips the next one.
   Each label is turned into a 203 dpi black and white picture (8 dots per mm) and sent as a TSPL BITMAP. */

const DPI = 203
const DOTS_PER_MM = 8

export type Link = 'usb' | 'bluetooth' | 'serial'
type Conn = { kind: Link; name: string; write: (data: Uint8Array) => Promise<void>; close?: () => Promise<void> }

const nav = navigator as any
export const directPrintSupport = () => ({
  usb: !!nav.usb,
  bluetooth: !!nav.bluetooth,
  serial: !!nav.serial,
})
export const canDirectPrint = () => { const s = directPrintSupport(); return s.usb || s.bluetooth || s.serial }

let conn: Conn | null = null
export const connected = () => conn
const listeners = new Set<() => void>()
export const onConnChange = (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn) } }
const changed = () => listeners.forEach(f => f())

async function openUsb(device: any): Promise<Conn> {
  await device.open()
  if (device.configuration === null) await device.selectConfiguration(1)
  // Find the printer interface and its "out" pipe.
  let iface: any = null, ep: any = null
  for (const i of device.configuration.interfaces) {
    for (const alt of i.alternates) {
      const out = alt.endpoints.find((e: any) => e.direction === 'out' && e.type === 'bulk')
      if (out && (!iface || alt.interfaceClass === 7)) { iface = i; ep = out }
    }
  }
  if (!iface) throw new Error('This USB device has no place to send print jobs.')
  await device.claimInterface(iface.interfaceNumber)
  return {
    kind: 'usb', name: device.productName || 'USB printer',
    write: async (data) => { for (let i = 0; i < data.length; i += 16384) await device.transferOut(ep.endpointNumber, data.slice(i, i + 16384)) },
    close: async () => { try { await device.close() } catch { /* ignore */ } },
  }
}

/** Reconnect quietly to a USB printer this browser was already allowed to use. */
export async function reconnect(): Promise<boolean> {
  if (conn) return true
  try {
    if (nav.usb) {
      const devs = await nav.usb.getDevices()
      if (devs.length) { conn = await openUsb(devs[0]); changed(); return true }
    }
    if (nav.serial) {
      const ports = await nav.serial.getPorts()
      if (ports.length) { conn = await openSerial(ports[0]); changed(); return true }
    }
  } catch { /* the seller can tap Connect */ }
  return false
}

export async function connectUsb() {
  const device = await nav.usb.requestDevice({ filters: [] })
  conn = await openUsb(device); changed()
}

// Services used by common Bluetooth label and receipt printers.
const BLE_SERVICES = [
  '000018f0-0000-1000-8000-00805f9b34fb',
  '0000ff00-0000-1000-8000-00805f9b34fb',
  '0000ffe0-0000-1000-8000-00805f9b34fb',
  '0000fee7-0000-1000-8000-00805f9b34fb',
  '49535343-fe7d-4ae5-8fa9-9fafd205e455',
  'e7810a71-73ae-499d-8c15-faa9aef0c3f2',
  '0000ae30-0000-1000-8000-00805f9b34fb',
]
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export async function connectBluetooth() {
  const device = await nav.bluetooth.requestDevice({ acceptAllDevices: true, optionalServices: BLE_SERVICES })
  const server = await device.gatt.connect()
  let ch: any = null
  for (const s of await server.getPrimaryServices()) {
    for (const c of await s.getCharacteristics()) {
      if (c.properties.writeWithoutResponse || c.properties.write) { ch = c; break }
    }
    if (ch) break
  }
  if (!ch) throw new Error('That Bluetooth device has no place to send print jobs.')
  const fast = !!ch.properties.writeWithoutResponse
  conn = {
    kind: 'bluetooth', name: device.name || 'Bluetooth printer',
    write: async (data) => {
      for (let i = 0; i < data.length; i += 180) {
        const part = data.slice(i, i + 180)
        if (fast) { await ch.writeValueWithoutResponse(part); await sleep(8) } else await ch.writeValueWithResponse(part)
      }
    },
    close: async () => { try { device.gatt.disconnect() } catch { /* ignore */ } },
  }
  device.addEventListener('gattserverdisconnected', () => { if (conn?.kind === 'bluetooth') { conn = null; changed() } })
  changed()
}

async function openSerial(port: any): Promise<Conn> {
  if (!port.writable) await port.open({ baudRate: 9600 })
  return {
    kind: 'serial', name: 'Paired Bluetooth printer',
    write: async (data) => { const w = port.writable.getWriter(); try { await w.write(data) } finally { w.releaseLock() } },
    close: async () => { try { await port.close() } catch { /* ignore */ } },
  }
}
export async function connectSerial() {
  const port = await nav.serial.requestPort()
  conn = await openSerial(port); changed()
}

export async function disconnect() { await conn?.close?.(); conn = null; changed() }

/** Turns a canvas into black and white TSPL bitmap rows. In TSPL a 0 bit prints black. */
function toBits(c: HTMLCanvasElement) {
  const ctx = c.getContext('2d')!
  const { data } = ctx.getImageData(0, 0, c.width, c.height)
  const wb = Math.ceil(c.width / 8)
  const out = new Uint8Array(wb * c.height).fill(0xff)
  for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
    const i = (y * c.width + x) * 4
    const lum = data[i + 3] < 128 ? 255 : 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
    if (lum < 150) out[y * wb + (x >> 3)] &= ~(0x80 >> (x & 7))
  }
  return { wb, h: c.height, bits: out }
}

function turnCanvas(src: HTMLCanvasElement) {
  const c = document.createElement('canvas')
  c.width = src.height; c.height = src.width
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height)
  ctx.translate(c.width, 0); ctx.rotate(Math.PI / 2); ctx.drawImage(src, 0, 0)
  return c
}

/** Fits a capture to the exact label size in printer dots (whole dots, no stretching surprises). */
function fit(src: HTMLCanvasElement, wDots: number, hDots: number) {
  if (src.width === wDots && src.height === hDots) return src
  const c = document.createElement('canvas')
  c.width = wDots; c.height = hDots
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, wDots, hDots)
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(src, 0, 0, wDots, hDots)
  return c
}

const enc = new TextEncoder()
const join = (parts: (string | Uint8Array)[]) => {
  const bufs = parts.map(p => (typeof p === 'string' ? enc.encode(p) : p))
  const out = new Uint8Array(bufs.reduce((a, b) => a + b.length, 0))
  let o = 0; for (const b of bufs) { out.set(b, o); o += b.length }
  return out
}

export type DirectJob = {
  /** The label as the printer feeds it, in inches: width across the print head, length along the feed. */
  w: number; h: number
  /** Turn each picture a quarter turn (labels that feed the long way). */
  turn: boolean
  /** The roll sits in the middle of a 4 inch print head (narrow rolls in a shipping label printer). */
  middle: boolean
  /** Flip the print end for end. */
  flip?: boolean
  /** Gap between labels, in mm. */
  gapMm?: number
  selector?: string
}

/** Prints every label on the page, one per label, straight to the connected printer. Returns how many printed. */
export async function printDirect(job: DirectJob, onProgress?: (done: number, total: number) => void) {
  if (!conn) throw new Error('Connect your printer first.')
  const sheets = [...document.querySelectorAll<HTMLElement>(job.selector ?? '.print-area .sheet')]
  const wDots = Math.round(job.w * DPI), hDots = Math.round(job.h * DPI)
  const wMm = +(job.w * 25.4).toFixed(1), hMm = +(job.h * 25.4).toFixed(1)
  const headMm = 104
  const sizeW = job.middle ? headMm : wMm
  const x = job.middle ? Math.max(0, Math.round(((headMm - wMm) / 2) * DOTS_PER_MM)) : 0
  const areas = [...document.querySelectorAll<HTMLElement>('.print-area')]
  areas.forEach(a => a.classList.add('capturing'))
  try {
    for (let i = 0; i < sheets.length; i++) {
      let c = await toCanvas(sheets[i], { pixelRatio: DPI / 96, backgroundColor: '#ffffff', style: { boxShadow: 'none', zoom: '1' } })
      if (job.turn) c = turnCanvas(c)
      c = fit(c, wDots, hDots)
      const { wb, h, bits } = toBits(c)
      const data = join([
        `SIZE ${sizeW} mm,${hMm} mm\r\n`,
        `GAP ${job.gapMm ?? 3} mm,0 mm\r\n`,
        `DIRECTION ${job.flip ? 1 : 0}\r\n`,
        'REFERENCE 0,0\r\nDENSITY 10\r\nSPEED 3\r\nCLS\r\n',
        `BITMAP ${x},0,${wb},${h},0,`, bits, '\r\n',
        'PRINT 1,1\r\n',
      ])
      await conn.write(data)
      onProgress?.(i + 1, sheets.length)
    }
  } finally {
    areas.forEach(a => a.classList.remove('capturing'))
  }
  return sheets.length
}

/** Feeds one blank label and lets the printer measure the gap (TSPL GAPDETECT). */
export async function learnLabel(job: Pick<DirectJob, 'w' | 'h' | 'middle' | 'gapMm'>) {
  if (!conn) throw new Error('Connect your printer first.')
  const wMm = +(job.w * 25.4).toFixed(1), hMm = +(job.h * 25.4).toFixed(1)
  await conn.write(enc.encode(`SIZE ${job.middle ? 104 : wMm} mm,${hMm} mm\r\nGAP ${job.gapMm ?? 3} mm,0 mm\r\nGAPDETECT\r\n`))
}
