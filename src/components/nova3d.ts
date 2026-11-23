/* Nova in 3D: the Dazzle University handbag built from shapes (no model file to download).
   Green patent bag, gold handles, gold bow, a little crown, cat-eye shades, DD crest.

   Loaded lazily by <Nova>, so the rest of the app never pays for it. One shared WebGL
   renderer draws every Nova on the page into her own small 2D canvas, so a page can show
   many of her without running out of WebGL contexts (iPhones allow only a few).

   She floats and sways, blinks, turns toward your finger or mouse, spins when you drag her,
   and twirls when you tap. If the device can't keep up, or has no WebGL, every Nova quietly
   goes back to her picture. */
import {
  NeutralToneMapping, CanvasTexture, Color, ConeGeometry, CylinderGeometry, DirectionalLight, DoubleSide,
  ExtrudeGeometry, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, PerspectiveCamera,
  PlaneGeometry, PMREMGenerator, Scene, Shape, SphereGeometry, SRGBColorSpace, TorusGeometry,
  WebGLRenderer, type Texture,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

export type Mood = 'happy' | 'cheer' | 'think' | 'oops' | 'wow' | 'wink'
export type NovaHandle = { setMood: (m: Mood) => void; detach: () => void }

const R = 512 // shared render target size (px); each Nova uses a corner of it
const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/* ---------- the bag ---------- */

function bagShape(wb: number, wt: number, h: number, r: number) {
  const s = new Shape(), b = -h / 2, t = h / 2
  s.moveTo(-wb / 2 + r, b)
  s.lineTo(wb / 2 - r, b)
  s.quadraticCurveTo(wb / 2, b, wb / 2 - r * 0.15, b + r)
  s.lineTo(wt / 2, t - r)
  s.quadraticCurveTo(wt / 2, t, wt / 2 - r, t)
  s.lineTo(-wt / 2 + r, t)
  s.quadraticCurveTo(-wt / 2, t, -wt / 2, t - r)
  s.lineTo(-wb / 2 + r * 0.15, b + r)
  s.quadraticCurveTo(-wb / 2, b, -wb / 2 + r, b)
  return s
}

/** Cat-eye lens outline for the right lens (mirror it for the left). Centered on 0,0. */
function lensShape(k = 1) {
  const s = new Shape()
  s.moveTo(-0.2 * k, 0.02 * k)
  s.bezierCurveTo(-0.2 * k, 0.12 * k, -0.05 * k, 0.1 * k, 0.12 * k, 0.1 * k)
  s.bezierCurveTo(0.2 * k, 0.1 * k, 0.26 * k, 0.15 * k, 0.27 * k, 0.17 * k) // the flick
  s.bezierCurveTo(0.27 * k, 0.05 * k, 0.22 * k, -0.11 * k, 0.04 * k, -0.11 * k)
  s.bezierCurveTo(-0.12 * k, -0.11 * k, -0.2 * k, -0.07 * k, -0.2 * k, 0.02 * k)
  return s
}

type Model = { root: Group; body: Group; glasses: Group; face: MeshStandardMaterial }

function buildNova(): Model {
  const green = new MeshPhysicalMaterial({ color: new Color('#0B7A33'), roughness: 0.3, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.12 })
  const gold = new MeshStandardMaterial({ color: new Color('#E2A93A'), roughness: 0.22, metalness: 1 })
  const satin = new MeshStandardMaterial({ color: new Color('#E8A92E'), roughness: 0.35, metalness: 0.7 })
  const lens = new MeshPhysicalMaterial({ color: new Color('#140A0E'), roughness: 0.04, metalness: 0.3, clearcoat: 1 })
  const gem = new MeshStandardMaterial({ color: new Color('#E85D8E'), roughness: 0.1, metalness: 0.3, emissive: new Color('#5A0F2A') })
  const sparkle = new MeshStandardMaterial({ color: new Color('#FFF6DA'), roughness: 0.05, metalness: 0.2, emissive: new Color('#6B5420') })

  const root = new Group(), body = new Group()
  root.add(body)

  // Body: a puffy, slightly flared patent bag.
  const geo = new ExtrudeGeometry(bagShape(1.5, 1.28, 1.42, 0.24), { depth: 0.56, bevelEnabled: true, bevelThickness: 0.13, bevelSize: 0.1, bevelSegments: 6, curveSegments: 14 })
  geo.translate(0, 0, -0.28)
  body.add(new Mesh(geo, green))
  const front = 0.28 + 0.13

  // Face: eyes, brows, smile, blush and the DD crest, painted on a canvas.
  const face = new MeshStandardMaterial({ transparent: true, roughness: 0.35, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2 })
  const facePlane = new Mesh(new PlaneGeometry(1.24, 1.24), face)
  facePlane.position.set(0, -0.02, front + 0.002)
  body.add(facePlane)

  // Cat-eye sunglasses, sitting low so her eyes peek over the top.
  const glasses = new Group()
  for (const side of [-1, 1]) {
    const g = new Group()
    const l = new Mesh(new ExtrudeGeometry(lensShape(), { depth: 0.02, bevelEnabled: false, curveSegments: 16 }), lens)
    const rim = lensShape(1.16)
    rim.holes.push(lensShape(0.98))
    const f = new Mesh(new ExtrudeGeometry(rim, { depth: 0.045, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.008, bevelSegments: 2, curveSegments: 16 }), gold)
    f.position.z = -0.012
    g.add(l, f)
    for (const [x, y] of [[0.27, 0.17], [0.21, 0.14], [0.15, 0.125]] as const) {
      const d = new Mesh(new SphereGeometry(0.022, 10, 8), sparkle)
      d.position.set(x * 1.12, y * 1.12, 0.04)
      g.add(d)
    }
    g.scale.x = side
    g.position.x = side * 0.27
    glasses.add(g)
    // Arms running back along her sides.
    const arm = new Mesh(new CylinderGeometry(0.014, 0.014, 0.5, 6), gold)
    arm.rotation.x = Math.PI / 2
    arm.position.set(side * 0.58, 0.1, -0.2)
    glasses.add(arm)
  }
  const bridge = new Mesh(new TorusGeometry(0.07, 0.018, 8, 16, Math.PI), gold)
  bridge.position.set(0, 0.06, 0.02)
  glasses.add(bridge)
  glasses.position.set(0, 0.02, front + 0.06)
  glasses.scale.setScalar(1.22)
  glasses.rotation.z = 0.04
  body.add(glasses)

  // Gold handles with little rings where they meet the bag.
  for (const z of [-0.17, 0.17]) {
    const h = new Mesh(new TorusGeometry(0.4, 0.045, 12, 40, Math.PI), gold)
    h.position.set(0, 0.74, z)
    h.rotation.x = z > 0 ? -0.18 : 0.18
    body.add(h)
    for (const x of [-0.4, 0.4]) {
      const ring = new Mesh(new TorusGeometry(0.06, 0.02, 8, 18), gold)
      ring.position.set(x, 0.76, z * 1.05)
      ring.rotation.y = Math.PI / 2
      body.add(ring)
    }
  }

  // The gold bow on her top left corner.
  const bow = new Group()
  const ribbon = { depth: 0.05, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.02, bevelSegments: 3, curveSegments: 14 }
  const lobe = new Shape()
  lobe.moveTo(0, 0)
  lobe.bezierCurveTo(0.08, 0.26, 0.38, 0.3, 0.36, 0.08)
  lobe.bezierCurveTo(0.35, -0.1, 0.14, -0.14, 0, 0)
  const tailShape = new Shape()
  tailShape.moveTo(-0.03, 0)
  tailShape.lineTo(0.06, -0.3)
  tailShape.lineTo(0.12, -0.24)
  tailShape.lineTo(0.17, -0.31)
  tailShape.lineTo(0.05, 0.01)
  for (const s of [-1, 1]) {
    const loop = new Mesh(new ExtrudeGeometry(lobe, ribbon), satin)
    loop.scale.x = s
    loop.rotation.y = s * -0.25
    bow.add(loop)
    const tail = new Mesh(new ExtrudeGeometry(tailShape, ribbon), satin)
    tail.scale.x = s
    tail.position.z = -0.03
    bow.add(tail)
  }
  const knot = new Mesh(new SphereGeometry(0.08, 14, 10), satin)
  knot.scale.set(0.9, 1.1, 0.8)
  knot.position.z = 0.04
  bow.add(knot)
  bow.position.set(-0.58, 0.74, front - 0.04)
  bow.scale.setScalar(1.05)
  bow.rotation.set(0, 0.15, 0.4)
  body.add(bow)

  // A tiny crown, tipped to the side. She is Head of the University, after all.
  const crown = new Group()
  const band = new Mesh(new CylinderGeometry(0.16, 0.14, 0.09, 24, 1, true), new MeshStandardMaterial({ color: gold.color, roughness: 0.22, metalness: 1, side: DoubleSide }))
  crown.add(band)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2
    const p = new Mesh(new ConeGeometry(0.04, 0.12, 6), gold)
    p.position.set(Math.cos(a) * 0.15, 0.1, Math.sin(a) * 0.15)
    crown.add(p)
    const tip = new Mesh(new SphereGeometry(0.022, 8, 6), sparkle)
    tip.position.set(Math.cos(a) * 0.15, 0.17, Math.sin(a) * 0.15)
    crown.add(tip)
    const g = new Mesh(new SphereGeometry(0.026, 8, 6), gem)
    g.position.set(Math.cos(a + 0.5) * 0.157, 0, Math.sin(a + 0.5) * 0.157)
    g.scale.set(1, 1, 0.6)
    crown.add(g)
  }
  crown.position.set(0.52, 0.9, 0)
  crown.scale.setScalar(1.3)
  crown.rotation.set(0.15, 0, -0.32)
  body.add(crown)

  // Little gold feet.
  for (const x of [-0.55, 0.55]) for (const z of [-0.22, 0.22]) {
    const f = new Mesh(new SphereGeometry(0.06, 10, 8), gold)
    f.scale.y = 0.55
    f.position.set(x, -0.8, z)
    body.add(f)
  }

  root.position.y = -0.06
  return { root, body, glasses, face }
}

/* ---------- her face, painted ---------- */

type Expr = Mood | 'blink'
const faceCache = new Map<Expr, Texture>()

function paintFace(expr: Expr): Texture {
  const hit = faceCache.get(expr)
  if (hit) return hit
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const g = c.getContext('2d')!
  g.lineCap = g.lineJoin = 'round'
  const ink = '#1A0A06'

  // Blush
  for (const x of [128, 384]) {
    const r = g.createRadialGradient(x, 300, 4, x, 300, 52)
    r.addColorStop(0, 'rgba(255,110,140,.55)'); r.addColorStop(1, 'rgba(255,110,140,0)')
    g.fillStyle = r; g.fillRect(x - 60, 240, 120, 120)
  }

  const openEye = (x: number, big = false, look: [number, number] = [6, 6]) => {
    const rx = big ? 58 : 52, ry = big ? 68 : 60, y = 146
    g.fillStyle = '#FFFDF7'; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); g.fill()
    g.lineWidth = 6; g.strokeStyle = ink; g.stroke()
    g.save(); g.beginPath(); g.ellipse(x, y, rx - 3, ry - 3, 0, 0, Math.PI * 2); g.clip()
    const ix = x + look[0], iy = y + look[1]
    const ir = g.createRadialGradient(ix - 6, iy - 8, 4, ix, iy, 40)
    ir.addColorStop(0, '#8A4B22'); ir.addColorStop(1, '#2B1206')
    g.fillStyle = ir; g.beginPath(); g.arc(ix, iy, 38, 0, Math.PI * 2); g.fill()
    g.fillStyle = '#0A0302'; g.beginPath(); g.arc(ix, iy, 20, 0, Math.PI * 2); g.fill()
    g.fillStyle = '#fff'; g.beginPath(); g.arc(ix - 13, iy - 15, 12, 0, Math.PI * 2); g.fill()
    g.beginPath(); g.arc(ix + 10, iy + 10, 4.5, 0, Math.PI * 2); g.fill()
    g.restore()
    // Lid line and lashes on the outer corner
    const out = x < 256 ? -1 : 1
    g.lineWidth = 9; g.beginPath(); g.ellipse(x, y, rx, ry, 0, Math.PI * 1.08, Math.PI * 1.92); g.stroke()
    g.lineWidth = 6
    for (let i = 0; i < 3; i++) {
      const a = Math.PI * (out > 0 ? 1.72 + i * 0.1 : 1.28 - i * 0.1)
      const sx = x + Math.cos(a) * rx, sy = y + Math.sin(a) * ry
      g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(sx + out * 14, sy - 6, sx + out * 22, sy - 20 + i * 8); g.stroke()
    }
  }
  const closedEye = (x: number, happy: boolean) => {
    const y = happy ? 162 : 158, out = x < 256 ? -1 : 1
    g.strokeStyle = ink; g.lineWidth = 9; g.beginPath()
    if (happy) { g.moveTo(x - 40, y + 10); g.quadraticCurveTo(x, y - 40, x + 40, y + 10) }
    else { g.moveTo(x - 42, y - 4); g.quadraticCurveTo(x, y + 30, x + 42, y - 4) }
    g.stroke()
    g.lineWidth = 6
    for (let i = 0; i < 3; i++) {
      const sx = x + out * (30 - i * 10), sy = happy ? y - 6 + i * 4 : y + 6 + i * 3
      g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + out * 14, sy + (happy ? -14 : 16)); g.stroke()
    }
  }
  const brow = (x: number, lift = 0) => {
    g.strokeStyle = ink; g.lineWidth = 7; g.beginPath()
    g.moveTo(x - 38, 82 - lift); g.quadraticCurveTo(x, 54 - lift * 1.6, x + 40, 76 - lift); g.stroke()
  }

  const L = 150, Rr = 362
  switch (expr) {
    case 'wink': openEye(L); closedEye(Rr, false); brow(L, 4); brow(Rr, -4); break
    case 'cheer': closedEye(L, true); closedEye(Rr, true); brow(L, 8); brow(Rr, 8); break
    case 'blink': closedEye(L, false); closedEye(Rr, false); brow(L); brow(Rr); break
    case 'think': openEye(L, false, [10, -14]); openEye(Rr, false, [10, -14]); brow(L, -2); brow(Rr, 12); break
    case 'oops': openEye(L, true, [0, 4]); openEye(Rr, true, [0, 4]); brow(L, 14); brow(Rr, 14); break
    case 'wow': openEye(L, true, [0, 2]); openEye(Rr, true, [0, 2]); brow(L, 18); brow(Rr, 18); break
    default: openEye(L); openEye(Rr); brow(L, 4); brow(Rr, 4)
  }

  // Mouth
  const my = 312
  g.strokeStyle = ink; g.lineWidth = 6
  if (expr === 'oops' || expr === 'wow') {
    g.fillStyle = '#5A0F1A'; g.beginPath(); g.ellipse(256, my + 10, expr === 'wow' ? 26 : 20, expr === 'wow' ? 32 : 24, 0, 0, Math.PI * 2); g.fill(); g.stroke()
    g.fillStyle = '#FF6F8E'; g.beginPath(); g.ellipse(256, my + 26, 14, 9, 0, 0, Math.PI * 2); g.fill()
  } else if (expr === 'think') {
    g.lineWidth = 8; g.beginPath(); g.moveTo(222, my + 8); g.quadraticCurveTo(262, my + 22, 296, my - 4); g.stroke()
  } else {
    const w = expr === 'cheer' ? 80 : 66, d = expr === 'cheer' ? 70 : 54
    g.fillStyle = '#5A0F1A'; g.beginPath()
    g.moveTo(256 - w, my - 10); g.quadraticCurveTo(256, my + 4, 256 + w, my - 14)
    g.quadraticCurveTo(256 + w * 0.6, my + d, 256, my + d); g.quadraticCurveTo(256 - w * 0.7, my + d, 256 - w, my - 10)
    g.closePath(); g.fill(); g.stroke()
    g.save(); g.clip()
    g.fillStyle = '#FFFDF7'; g.fillRect(150, my - 30, 220, 26)
    g.fillStyle = '#FF5D7E'; g.beginPath(); g.ellipse(262, my + d, 40, 26, 0, 0, Math.PI * 2); g.fill()
    g.restore()
    // dimple
    g.lineWidth = 5; g.beginPath(); g.arc(256 + w + 6, my - 18, 10, Math.PI * 0.6, Math.PI * 1.3); g.stroke()
  }

  // DD crest with a crown
  const goldFill = g.createLinearGradient(0, 380, 0, 500)
  goldFill.addColorStop(0, '#FFF1C1'); goldFill.addColorStop(0.45, '#E9B949'); goldFill.addColorStop(1, '#9C6B1E')
  g.fillStyle = goldFill; g.strokeStyle = '#3A2408'; g.lineWidth = 4
  g.font = 'italic 900 92px Georgia, "Times New Roman", serif'
  g.textAlign = 'center'; g.textBaseline = 'alphabetic'
  g.strokeText('DD', 256, 494); g.fillText('DD', 256, 494)
  g.beginPath()
  g.moveTo(226, 414); g.lineTo(232, 386); g.lineTo(244, 402); g.lineTo(256, 378); g.lineTo(268, 402); g.lineTo(280, 386); g.lineTo(286, 414); g.closePath()
  g.fill(); g.stroke()

  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  faceCache.set(expr, t)
  return t
}

/* ---------- one shared stage ---------- */

type Inst = {
  canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; mood: Mood
  visible: boolean; yaw: number; vyaw: number; pitch: number; dragging: boolean
  downX: number; downY: number; lastX: number; lastT: number; moved: boolean
  lookX: number; lookY: number; tLookX: number; tLookY: number
  moodAt: number; tapAt: number; blinkAt: number; seed: number
  off: () => void
}

let stage: { renderer: WebGLRenderer; scene: Scene; camera: PerspectiveCamera; model: Model } | null = null
let failed = false
const insts = new Set<Inst>()
const failListeners = new Set<() => void>()
let raf = 0, lastFrame = 0, slowFrames = 0, measured = 0
let io: IntersectionObserver | null = null
let px = -1, py = -1
// 'off' always shows her picture; 'always' skips the speed check (for testing).
const pref = (() => { try { return localStorage.getItem('nova3d') } catch { return null } })()

function fail() {
  if (failed) return
  failed = true
  cancelAnimationFrame(raf)
  failListeners.forEach(f => f())
  failListeners.clear()
  try { stage?.renderer.dispose() } catch { /* ignore */ }
  stage = null
}

/** Is the 3D Nova available on this device? (false = use her picture) */
export function supported() {
  if (failed || pref === 'off') return false
  if (stage) return true
  try {
    const nav = navigator as Navigator & { deviceMemory?: number }
    if (nav.deviceMemory && nav.deviceMemory < 2) { failed = true; return false }
    const renderer = new WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true, powerPreference: 'low-power', failIfMajorPerformanceCaveat: true })
    renderer.setPixelRatio(1)
    renderer.setSize(R, R, false)
    renderer.setClearColor(0x000000, 0)
    renderer.setScissorTest(true)
    renderer.toneMapping = NeutralToneMapping
    renderer.toneMappingExposure = 1
    renderer.outputColorSpace = SRGBColorSpace
    renderer.domElement.addEventListener('webglcontextlost', fail)

    const scene = new Scene()
    const pmrem = new PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.55
    pmrem.dispose()
    const key = new DirectionalLight(0xffdcae, 2.2); key.position.set(-2, 3, 4)
    const rim = new DirectionalLight(0xff9a5a, 2.4); rim.position.set(2.5, 1.5, -3)
    const fill = new DirectionalLight(0xfff3e0, 0.6); fill.position.set(2, -1, 3)
    scene.add(key, rim, fill)

    const camera = new PerspectiveCamera(30, 1, 0.1, 50)
    camera.position.set(0, 0.25, 6.1)
    camera.lookAt(0, 0.26, 0)

    const model = buildNova()
    scene.add(model.root)
    stage = { renderer, scene, camera, model }
    window.addEventListener('pointermove', e => { px = e.clientX; py = e.clientY }, { passive: true })
    return true
  } catch {
    failed = true
    return false
  }
}

const ease = (k: number) => 1 - Math.pow(1 - k, 3)

/** Where Nova is and how she's posed at time `t` (seconds). */
function pose(i: Inst, t: number, now: number) {
  const { body, glasses } = stage!.model
  const still = reduced()
  const ph = t + i.seed

  // Turn toward the pointer, smoothly.
  i.lookX += (i.tLookX - i.lookX) * 0.08
  i.lookY += (i.tLookY - i.lookY) * 0.08

  // Drag spin with a little momentum, then she settles back to face you.
  if (!i.dragging) {
    i.yaw += i.vyaw
    i.vyaw *= 0.92
    if (Math.abs(i.vyaw) < 0.004) {
      const home = Math.round(i.yaw / (Math.PI * 2)) * Math.PI * 2
      i.yaw += (home - i.yaw) * 0.08
      i.vyaw = 0
    }
  }

  let y = 0, roll = 0, spin = 0, sx = 1, sy = 1, glassesDrop = 0
  if (!still) {
    y = Math.sin(ph * 1.7) * 0.045
    roll = Math.sin(ph * 1.1) * 0.035
    spin = Math.sin(ph * 0.55) * 0.16
  }
  const m = (now - i.moodAt) / 1000
  if (!still) {
    if (i.mood === 'cheer' && m < 1.2) { const k = m / 1.2; y += Math.abs(Math.sin(k * Math.PI * 2)) * 0.22 * (1 - k * 0.3); sy = 1 + Math.sin(k * Math.PI * 4) * 0.04; sx = 2 - sy }
    if (i.mood === 'wow' && m < 1) spin += ease(m) * Math.PI * 2
    if (i.mood === 'oops' && m < 0.8) roll += Math.sin(m * Math.PI * 7) * 0.14 * (1 - m / 0.8)
  }
  if (i.mood === 'think') roll -= 0.08
  if (i.mood === 'wink') roll += 0.05

  // Tap: a hop, a twirl and a peek over the shades.
  const k = (now - i.tapAt) / 1000
  if (k < 1.1) {
    if (!still) { y += Math.sin(Math.min(k / 0.6, 1) * Math.PI) * 0.28; spin += ease(Math.min(k / 0.9, 1)) * Math.PI * 2 }
    glassesDrop = Math.sin(Math.min(k / 1.1, 1) * Math.PI) * 0.12
  }

  body.position.y = y
  body.rotation.set(i.pitch + i.lookY * 0.22, i.yaw + spin + i.lookX * 0.5, roll)
  body.scale.set(sx, sy, 1)
  glasses.position.y = 0.02 - glassesDrop

  // Face: blink every few seconds; happy eyes after a tap.
  if (now > i.blinkAt + 140) i.blinkAt = now + 2400 + Math.random() * 3000
  const blinking = now > i.blinkAt && now < i.blinkAt + 140
  const expr: Expr = k < 1.1 ? 'cheer' : blinking && i.mood !== 'cheer' ? 'blink' : i.mood
  const map = paintFace(expr)
  const face = stage!.model.face
  if (face.map !== map) { const first = !face.map; face.map = map; if (first) face.needsUpdate = true }
}

function frame(now: number) {
  raf = requestAnimationFrame(frame)
  if (!stage || document.hidden) return
  const active = [...insts].filter(i => i.visible)
  if (!active.length) return
  const busy = active.some(i => i.dragging || Math.abs(i.vyaw) > 0 || now - i.tapAt < 1100 || now - i.moodAt < 1200)
  const gap = now - lastFrame
  if (gap < (busy ? 0 : 31)) return // 30 fps when she's just idling, to save battery
  // If this device can't keep up, go back to pictures.
  if (lastFrame && measured < 90 && pref !== 'always') {
    measured++
    if (gap > 90) slowFrames++
    if (slowFrames > 25) { fail(); return }
  }
  lastFrame = now
  const { renderer, scene, camera } = stage
  const t = now / 1000
  for (const i of active) {
    if (px >= 0 && !i.dragging) {
      const r = i.canvas.getBoundingClientRect()
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2
      i.tLookX = Math.max(-1, Math.min(1, (px - cx) / (window.innerWidth * 0.5)))
      i.tLookY = Math.max(-1, Math.min(1, (py - cy) / (window.innerHeight * 0.5)))
    }
    pose(i, t, now)
    const s = Math.min(R, i.canvas.width)
    renderer.setViewport(0, 0, s, s)
    renderer.setScissor(0, 0, s, s)
    renderer.render(scene, camera)
    i.ctx.clearRect(0, 0, i.canvas.width, i.canvas.height)
    i.ctx.drawImage(renderer.domElement, 0, R - s, s, s, 0, 0, i.canvas.width, i.canvas.height)
  }
}

/** Put a live 3D Nova into `canvas`. Returns null if the device can't (use the picture). */
export function attach(canvas: HTMLCanvasElement, mood: Mood, onFail: () => void): NovaHandle | null {
  if (!supported()) return null
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const css = canvas.clientWidth || 100
  canvas.width = canvas.height = Math.min(R, Math.round(css * Math.min(2, window.devicePixelRatio || 1)))

  const now = performance.now()
  const i: Inst = {
    canvas, ctx, mood, visible: true, yaw: 0, vyaw: 0, pitch: 0, dragging: false,
    downX: 0, downY: 0, lastX: 0, lastT: 0, moved: false,
    lookX: 0, lookY: 0, tLookX: 0, tLookY: 0, moodAt: now, tapAt: -1e9, blinkAt: now + 1500 + Math.random() * 2000,
    seed: Math.random() * 10, off: () => {},
  }

  const down = (e: PointerEvent) => {
    i.dragging = true; i.moved = false; i.vyaw = 0
    i.downX = i.lastX = e.clientX; i.downY = e.clientY; i.lastT = e.timeStamp
    canvas.setPointerCapture?.(e.pointerId)
  }
  const move = (e: PointerEvent) => {
    if (!i.dragging) return
    const dx = e.clientX - i.lastX
    if (Math.abs(e.clientX - i.downX) > 6 || Math.abs(e.clientY - i.downY) > 6) i.moved = true
    i.yaw += dx * 0.018
    i.vyaw = dx * 0.018 * Math.min(1, 16 / Math.max(1, e.timeStamp - i.lastT))
    i.pitch = Math.max(-0.35, Math.min(0.35, (e.clientY - i.downY) * 0.004))
    i.lastX = e.clientX; i.lastT = e.timeStamp
  }
  const up = () => {
    if (!i.dragging) return
    i.dragging = false
    i.pitch = 0
    if (i.moved) {
      // A drag shouldn't also count as a tap on whatever button she's sitting in.
      const eat = (e: MouseEvent) => { e.stopPropagation(); e.preventDefault() }
      window.addEventListener('click', eat, { capture: true, once: true })
      setTimeout(() => window.removeEventListener('click', eat, { capture: true }), 0)
    }
    else { i.tapAt = performance.now(); i.vyaw = 0 }
  }
  const key = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') i.tapAt = performance.now() }

  canvas.addEventListener('pointerdown', down)
  canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerup', up)
  canvas.addEventListener('pointercancel', up)
  canvas.parentElement?.closest('button')?.addEventListener('keydown', key)

  io ??= new IntersectionObserver(es => es.forEach(e => {
    for (const x of insts) if (x.canvas === e.target) x.visible = e.isIntersecting
  }))
  io.observe(canvas)
  insts.add(i)
  failListeners.add(onFail)
  if (!raf) raf = requestAnimationFrame(frame)

  i.off = () => {
    canvas.removeEventListener('pointerdown', down)
    canvas.removeEventListener('pointermove', move)
    canvas.removeEventListener('pointerup', up)
    canvas.removeEventListener('pointercancel', up)
    canvas.parentElement?.closest('button')?.removeEventListener('keydown', key)
    io?.unobserve(canvas)
    insts.delete(i)
    failListeners.delete(onFail)
    if (!insts.size) { cancelAnimationFrame(raf); raf = 0; lastFrame = 0 }
  }

  return {
    setMood: m => { if (m !== i.mood) { i.mood = m; i.moodAt = performance.now() } },
    detach: () => i.off(),
  }
}
