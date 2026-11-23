/* Nova in 3D, built to match her official art (design/nova-reference.png): a tall glossy green
   shopping bag with gold handles, a big gold bow wearing a tiny crown, one wink and one big
   lashy eye, gold rhinestone cat-eye shades worn low, a big open smile, the crowned DD crest,
   white cartoon gloves (one throwing a peace sign), black legs, camo sneakers, and her little
   black "Deals, Good Vibes, Amazing People" bag.

   Everything is made from shapes and painted canvases, so there's no model file to download.
   Loaded lazily by <Nova>, so the rest of the app never pays for it. One shared WebGL renderer
   draws every Nova on the page into her own small 2D canvas, so a page can show many of her
   without running out of WebGL contexts (iPhones allow only a few).

   She floats, sways, blinks, taps her foot and turns toward your finger or mouse. Drag to spin
   her. Tap different parts for different reactions (shades, bow, peace hand, little bag,
   sneakers, or her body for a twirl). Her mouth moves while her words type. If the device
   can't keep up, or has no WebGL, every Nova quietly goes back to her picture. */
import {
  BoxGeometry, CanvasTexture, CapsuleGeometry, CatmullRomCurve3, Color, ConeGeometry, CylinderGeometry,
  DirectionalLight, DoubleSide, ExtrudeGeometry, Group, InstancedMesh, Mesh, MeshPhysicalMaterial,
  MeshStandardMaterial, NeutralToneMapping, Object3D, PerspectiveCamera, PlaneGeometry, PMREMGenerator,
  Raycaster, Scene, Shape, SphereGeometry, SRGBColorSpace, TorusGeometry, TubeGeometry, Vector2, Vector3,
  WebGLRenderer, type Texture,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { tap as buzz } from '../lib/feedback'

export type Mood = 'happy' | 'cheer' | 'think' | 'oops' | 'wow' | 'wink'
export type Part = 'body' | 'glasses' | 'bow' | 'hand' | 'minibag' | 'shoes'
export type NovaHandle = { setMood: (m: Mood) => void; setTalking: (on: boolean) => void; detach: () => void }

const R = 512 // shared render target size (px); each Nova uses a corner of it
const reduced = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const TAU = Math.PI * 2

/* ---------- painted textures ---------- */

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const g = c.getContext('2d')!
  g.lineCap = g.lineJoin = 'round'
  return { c, g }
}
function tex(c: HTMLCanvasElement) {
  const t = new CanvasTexture(c)
  t.colorSpace = SRGBColorSpace
  t.anisotropy = 4
  return t
}
const INK = '#160805'

/** Gold foil gradient for lettering. */
function goldFill(g: CanvasRenderingContext2D, y0: number, y1: number) {
  const f = g.createLinearGradient(0, y0, 0, y1)
  f.addColorStop(0, '#FFF3C4'); f.addColorStop(0.35, '#F2C14E'); f.addColorStop(0.7, '#B9821F'); f.addColorStop(1, '#FFE08A')
  return f
}

/** Eyes: 512x256 canvas on the upper face. Her right eye is on the left of the picture. */
type Eyes = Mood | 'blink' | 'peek'
const eyeCache = new Map<Eyes, Texture>()
function paintEyes(e: Eyes): Texture {
  const hit = eyeCache.get(e)
  if (hit) return hit
  const { c, g } = canvas(512, 256)
  const lid = '#0A5A24'

  const open = (x: number, s = 1, look: [number, number] = [8, 10]) => {
    const rx = 60 * s, ry = 74 * s, y = 138
    g.fillStyle = '#FFFDF7'; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.fill()
    g.save(); g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.clip()
    const ix = x + look[0], iy = y + look[1]
    const ir = g.createRadialGradient(ix - 8, iy - 10, 4, ix, iy, 48)
    ir.addColorStop(0, '#9A5A2A'); ir.addColorStop(0.6, '#4A220C'); ir.addColorStop(1, '#1E0A03')
    g.fillStyle = ir; g.beginPath(); g.arc(ix, iy, 46, 0, TAU); g.fill()
    g.fillStyle = '#050101'; g.beginPath(); g.arc(ix, iy, 27, 0, TAU); g.fill()
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(ix - 15, iy - 18, 14, 12, -0.4, 0, TAU); g.fill()
    g.beginPath(); g.arc(ix + 14, iy + 14, 6, 0, TAU); g.fill()
    // Green lid with a glossy edge, like her art
    const lg = g.createLinearGradient(0, y - ry, 0, y - ry * 0.35)
    lg.addColorStop(0, '#0E7A34'); lg.addColorStop(1, lid)
    g.fillStyle = lg; g.beginPath(); g.ellipse(x, y - ry * 0.92, rx * 1.1, ry * 0.42, 0, 0, Math.PI); g.fill()
    g.restore()
    g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU); g.stroke()
    // Thick lash line along the lid, then long curled lashes on the outer corner
    g.lineWidth = 11; g.beginPath(); g.ellipse(x, y - ry * 0.92, rx * 1.1, ry * 0.42, 0, Math.PI * 0.1, Math.PI * 0.9); g.stroke()
    const out = x < 256 ? -1 : 1
    g.lineWidth = 7
    for (let i = 0; i < 4; i++) {
      const a = Math.PI * (out > 0 ? 0.16 + i * 0.11 : 0.84 - i * 0.11)
      const sx = x + Math.cos(a) * rx * 1.1, sy = y - ry * 0.92 + Math.sin(a) * ry * 0.42
      const len = 34 - i * 5
      g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(sx + out * len * 0.9, sy + 4, sx + out * len, sy - len * 0.7); g.stroke()
    }
  }
  const shut = (x: number, happy: boolean) => {
    const y = 150, out = x < 256 ? -1 : 1
    g.fillStyle = lid; g.beginPath()
    if (happy) { g.moveTo(x - 50, y + 12); g.quadraticCurveTo(x, y - 50, x + 50, y + 12); g.quadraticCurveTo(x, y - 20, x - 50, y + 12) }
    else { g.moveTo(x - 54, y - 6); g.quadraticCurveTo(x, y - 40, x + 54, y - 6); g.quadraticCurveTo(x, y + 30, x - 54, y - 6) }
    g.fill()
    g.strokeStyle = INK; g.lineWidth = 11; g.beginPath()
    if (happy) { g.moveTo(x - 50, y + 12); g.quadraticCurveTo(x, y - 50, x + 50, y + 12) }
    else { g.moveTo(x - 54, y - 6); g.quadraticCurveTo(x, y + 30, x + 54, y - 6) }
    g.stroke()
    g.lineWidth = 7
    for (let i = 0; i < 4; i++) {
      const sx = x + out * (44 - i * 13), sy = happy ? y - 2 - (3 - i) * 5 : y + 4 + i * 3
      g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(sx + out * 12, sy + (happy ? -10 : 14), sx + out * 22, sy + (happy ? -26 : 26)); g.stroke()
    }
  }
  const brow = (x: number, lift = 0, tilt = 0) => {
    g.strokeStyle = INK; g.lineWidth = 8; g.beginPath()
    g.moveTo(x - 46, 44 - lift + tilt); g.quadraticCurveTo(x, 6 - lift * 1.6, x + 48, 34 - lift - tilt); g.stroke()
  }

  const L = 132, Rr = 380
  switch (e) {
    case 'wink': case 'happy': shut(L, false); open(Rr, 1.18, [6, 12]); brow(L, -4); brow(Rr, 12); break // her signature look
    case 'cheer': shut(L, true); shut(Rr, true); brow(L, 10); brow(Rr, 10); break
    case 'blink': shut(L, false); shut(Rr, false); brow(L); brow(Rr); break
    case 'think': open(L, 0.95, [12, -20]); open(Rr, 0.95, [12, -20]); brow(L, -2, 6); brow(Rr, 14); break
    case 'peek': open(L, 1.08, [0, 18]); open(Rr, 1.08, [0, 18]); brow(L, 20); brow(Rr, 20); break
    case 'oops': open(L, 1.05, [0, 6]); open(Rr, 1.05, [0, 6]); brow(L, 16, -8); brow(Rr, 16, -8); break
    case 'wow': open(L, 1.1, [0, 2]); open(Rr, 1.1, [0, 2]); brow(L, 22); brow(Rr, 22); break
  }
  const t = tex(c)
  eyeCache.set(e, t)
  return t
}

/** Mouth and blush: 512x192 canvas. `open` 0..2 is how open she is while talking. */
type MouthKey = `${'smile' | 'o' | 'smirk'}${0 | 1 | 2}`
const mouthCache = new Map<MouthKey, Texture>()
function paintMouth(kind: 'smile' | 'o' | 'smirk', open: 0 | 1 | 2): Texture {
  const key: MouthKey = `${kind}${open}`
  const hit = mouthCache.get(key)
  if (hit) return hit
  const { c, g } = canvas(512, 192)
  for (const x of [96, 416]) {
    const r = g.createRadialGradient(x, 70, 4, x, 70, 60)
    r.addColorStop(0, 'rgba(255,90,130,.5)'); r.addColorStop(1, 'rgba(255,90,130,0)')
    g.fillStyle = r; g.fillRect(x - 70, 0, 140, 150)
  }
  g.strokeStyle = INK; g.lineWidth = 7
  const my = 60
  if (kind === 'o') {
    const ry = 26 + open * 8, rx = 22 + open * 3
    g.fillStyle = '#4A0A14'; g.beginPath(); g.ellipse(262, my + 20, rx, ry, 0, 0, TAU); g.fill(); g.stroke()
    g.fillStyle = '#FF5D7E'; g.beginPath(); g.ellipse(262, my + 20 + ry * 0.55, rx * 0.65, ry * 0.32, 0, 0, TAU); g.fill()
  } else if (kind === 'smirk' && open === 0) {
    g.lineWidth = 9; g.beginPath(); g.moveTo(206, my + 18); g.quadraticCurveTo(262, my + 40, 318, my - 2); g.stroke()
  } else {
    // Her big open smile, lifted on one side like the art.
    const d = [74, 34, 54][open], w = 92
    const l = 262 - w, r = 262 + w
    g.fillStyle = '#4A0A14'; g.beginPath()
    g.moveTo(l, my - 2); g.quadraticCurveTo(262, my + 14, r, my - 26)
    g.quadraticCurveTo(r - 18, my + d, 270, my + d); g.quadraticCurveTo(l + 20, my + d, l, my - 2)
    g.closePath(); g.fill()
    g.save(); g.clip()
    g.fillStyle = '#FFFDF7'; g.beginPath(); g.moveTo(l, my - 30); g.lineTo(r, my - 54); g.lineTo(r, my - 8); g.quadraticCurveTo(262, my + 26, l, my + 14); g.closePath(); g.fill()
    g.fillStyle = '#FF4F73'; g.beginPath(); g.ellipse(276, my + d + 4, 56, 34, 0, 0, TAU); g.fill()
    g.restore()
    g.strokeStyle = '#B0122E'; g.lineWidth = 8; g.beginPath()
    g.moveTo(l, my - 2); g.quadraticCurveTo(262, my + 14, r, my - 26)
    g.quadraticCurveTo(r - 18, my + d, 270, my + d); g.quadraticCurveTo(l + 20, my + d, l, my - 2); g.stroke()
    g.strokeStyle = INK; g.lineWidth = 6
    g.beginPath(); g.arc(r + 8, my - 32, 12, Math.PI * 0.55, Math.PI * 1.3); g.stroke()
  }
  const t = tex(c)
  mouthCache.set(key, t)
  return t
}

/** The crowned DD crest: a green D and a gold D, interlocked. */
function paintCrest(): Texture {
  const { c, g } = canvas(512, 384)
  g.textAlign = 'center'; g.textBaseline = 'alphabetic'
  g.font = '900 250px "Bodoni 72", Didot, "Playfair Display", Georgia, serif'
  const base = 360
  // Gold D (back, right)
  g.lineWidth = 12; g.strokeStyle = '#3A2408'; g.strokeText('D', 300, base)
  g.fillStyle = goldFill(g, 150, base); g.fillText('D', 300, base)
  // Green D (front, left) with a gold outline
  g.lineWidth = 12; g.strokeStyle = '#3A2408'; g.strokeText('D', 210, base)
  g.lineWidth = 6; g.strokeStyle = goldFill(g, 150, base); g.strokeText('D', 210, base)
  const gr = g.createLinearGradient(0, 150, 0, base); gr.addColorStop(0, '#3FE07A'); gr.addColorStop(1, '#12A043')
  g.fillStyle = gr; g.fillText('D', 210, base)
  // Crown
  g.fillStyle = goldFill(g, 30, 130); g.strokeStyle = '#3A2408'; g.lineWidth = 6
  g.beginPath()
  g.moveTo(190, 130); g.lineTo(178, 58); g.lineTo(220, 96); g.lineTo(256, 34); g.lineTo(292, 96); g.lineTo(334, 58); g.lineTo(322, 130); g.closePath()
  g.fill(); g.stroke()
  g.fillStyle = '#FFF3C4'
  for (const [x, y] of [[178, 52], [256, 28], [334, 52]]) { g.beginPath(); g.arc(x, y, 11, 0, TAU); g.fill(); g.stroke() }
  return tex(c)
}

/** Gold script on her little black bag. */
function paintMiniBag(): Texture {
  const { c, g } = canvas(256, 288)
  g.fillStyle = '#0D0B0C'; g.fillRect(0, 0, 256, 288)
  g.fillStyle = goldFill(g, 40, 250); g.textAlign = 'center'
  g.font = 'italic 700 44px "Brush Script MT", "Segoe Script", "Snell Roundhand", cursive'
  ;['Deals', 'Good Vibes', 'Amazing', 'People ♡'].forEach((l, i) => g.fillText(l, 128 + (i % 2 ? 6 : -6), 70 + i * 56))
  return tex(c)
}

/** Green, yellow and black camo for her sneakers. */
function paintCamo(): Texture {
  const { c, g } = canvas(256, 256)
  g.fillStyle = '#138A3A'; g.fillRect(0, 0, 256, 256)
  let s = 7
  const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280
  for (const col of ['#F5C518', '#0B0B0B', '#0A5F27', '#F5C518', '#0B0B0B']) {
    g.fillStyle = col
    for (let i = 0; i < 7; i++) {
      const x = rnd() * 256, y = rnd() * 256, r = 14 + rnd() * 26
      g.beginPath(); g.ellipse(x, y, r, r * 0.6, rnd() * 3, 0, TAU); g.fill()
    }
  }
  return tex(c)
}

/* ---------- building her ---------- */

function bagShape(wb: number, wt: number, h: number, r: number) {
  const s = new Shape(), b = -h / 2, t = h / 2
  s.moveTo(-wb / 2 + r, b)
  s.lineTo(wb / 2 - r, b)
  s.quadraticCurveTo(wb / 2, b, wb / 2 - 0.01, b + r)
  s.lineTo(wt / 2, t - r * 0.4)
  s.quadraticCurveTo(wt / 2, t, wt / 2 - r * 0.4, t)
  s.lineTo(-wt / 2 + r * 0.4, t)
  s.quadraticCurveTo(-wt / 2, t, -wt / 2, t - r * 0.4)
  s.lineTo(-wb / 2 + 0.01, b + r)
  s.quadraticCurveTo(-wb / 2, b, -wb / 2 + r, b)
  return s
}

/** Cat-eye lens outline for the lens on the right of the picture (mirror it for the left). */
function lensShape(k = 1) {
  const s = new Shape()
  s.moveTo(-0.22 * k, 0.04 * k)
  s.bezierCurveTo(-0.22 * k, 0.12 * k, -0.06 * k, 0.11 * k, 0.12 * k, 0.11 * k)
  s.bezierCurveTo(0.22 * k, 0.11 * k, 0.29 * k, 0.17 * k, 0.31 * k, 0.2 * k) // the flick
  s.bezierCurveTo(0.31 * k, 0.04 * k, 0.24 * k, -0.13 * k, 0.04 * k, -0.13 * k)
  s.bezierCurveTo(-0.14 * k, -0.13 * k, -0.22 * k, -0.07 * k, -0.22 * k, 0.04 * k)
  return s
}

type Model = {
  root: Group; body: Group; glasses: Group; bow: Group; crown: Group
  armL: Group; armR: Group; peace: Group; mini: Group; legL: Group; legR: Group
  eyes: MeshStandardMaterial; mouth: MeshStandardMaterial
  pickables: Object3D[]
}

function tag(o: Object3D, part: Part) { o.userData.part = part; return o }
/** An invisible, generous tap target, so small parts are easy to hit with a finger. */
const hitMat = new MeshStandardMaterial({ visible: false })
function hitBox(parent: Group, w: number, h: number, d: number, x = 0, y = 0, z = 0) {
  const b = new Mesh(new BoxGeometry(w, h, d), hitMat)
  b.position.set(x, y, z)
  parent.add(b)
}

function buildNova(): Model {
  const green = new MeshPhysicalMaterial({ color: new Color('#0C8A35'), roughness: 0.22, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.06 })
  const inside = new MeshStandardMaterial({ color: new Color('#04210E'), roughness: 0.9 })
  const gold = new MeshStandardMaterial({ color: new Color('#E2A93A'), roughness: 0.2, metalness: 1 })
  const satin = new MeshStandardMaterial({ color: new Color('#EDB02F'), roughness: 0.32, metalness: 0.65, side: DoubleSide })
  const lens = new MeshPhysicalMaterial({ color: new Color('#120709'), roughness: 0.03, metalness: 0.3, clearcoat: 1 })
  const gem = new MeshStandardMaterial({ color: new Color('#E85D8E'), roughness: 0.1, metalness: 0.3, emissive: new Color('#5A0F2A') })
  const sparkle = new MeshStandardMaterial({ color: new Color('#FFF8E2'), roughness: 0.02, metalness: 0.4, emissive: new Color('#7A6430') })
  const glove = new MeshStandardMaterial({ color: new Color('#F7F5F0'), roughness: 0.55 })
  const black = new MeshPhysicalMaterial({ color: new Color('#141114'), roughness: 0.35, clearcoat: 0.6 })
  const sole = new MeshStandardMaterial({ color: new Color('#F2EFE6'), roughness: 0.6 })
  const camo = new MeshStandardMaterial({ map: paintCamo(), roughness: 0.4 })

  const root = new Group(), body = new Group()
  root.add(body)
  const pickables: Object3D[] = []

  // The bag: tall, flared, glossy. Top at y=0.82, front face at z=front.
  const W = 1.22, H = 1.64
  const geo = new ExtrudeGeometry(bagShape(W + 0.1, W - 0.06, H, 0.16), { depth: 0.5, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 5, curveSegments: 12 })
  geo.translate(0, 0, -0.25)
  const bag = tag(new Mesh(geo, green), 'body')
  body.add(bag)
  pickables.push(bag)
  const front = 0.25 + 0.08, top = H / 2
  // The opening at the top
  const mouthTop = new Mesh(new PlaneGeometry(W - 0.12, 0.5), inside)
  mouthTop.rotation.x = -Math.PI / 2
  mouthTop.position.set(0, top + 0.061, 0)
  body.add(mouthTop)

  // Face decals: eyes, mouth (with blush), and the gold DD crest.
  const decal = (w: number, h: number, y: number, mat: MeshStandardMaterial) => {
    const m = new Mesh(new PlaneGeometry(w, h), mat)
    m.position.set(0, y, front + 0.003)
    body.add(m)
    return mat
  }
  const decalMat = () => new MeshStandardMaterial({ transparent: true, roughness: 0.3, metalness: 0, polygonOffset: true, polygonOffsetFactor: -2 })
  const eyes = decal(1.08, 0.54, 0.42, decalMat())
  const mouth = decal(1.2, 0.45, -0.17, decalMat())
  const crestMat = new MeshStandardMaterial({ map: paintCrest(), transparent: true, roughness: 0.25, metalness: 0.5, polygonOffset: true, polygonOffsetFactor: -2 })
  decal(0.7, 0.525, -0.54, crestMat)

  // Gold rhinestone cat-eye shades, worn low and tilted, so her open eye peeks over.
  const glasses = tag(new Group(), 'glasses') as Group
  const stones: [number, number, number][] = []
  for (const side of [-1, 1]) {
    const g = new Group()
    const l = new Mesh(new ExtrudeGeometry(lensShape(), { depth: 0.02, bevelEnabled: false, curveSegments: 16 }), lens)
    const rim = lensShape(1.15)
    rim.holes.push(lensShape(0.98))
    const f = new Mesh(new ExtrudeGeometry(rim, { depth: 0.04, bevelEnabled: true, bevelThickness: 0.012, bevelSize: 0.008, bevelSegments: 2, curveSegments: 16 }), gold)
    f.position.z = -0.01
    g.add(l, f)
    g.scale.x = side
    g.position.x = side * 0.29
    glasses.add(g)
    // Rhinestones along the top of the frame
    for (let k = 0; k <= 8; k++) {
      const t = k / 8
      const x = -0.2 + t * 0.49, y = 0.12 + Math.pow(t, 2.2) * 0.1
      stones.push([side * (0.29 + x * 1.08), y * 1.08, 0.04])
    }
    const arm = new Mesh(new CylinderGeometry(0.013, 0.013, 0.46, 6), gold)
    arm.rotation.x = Math.PI / 2
    arm.position.set(side * 0.62, 0.11, -0.2)
    glasses.add(arm)
  }
  const sg = new InstancedMesh(new SphereGeometry(0.019, 8, 6), sparkle, stones.length)
  const tmp = new Object3D()
  stones.forEach((p, k) => { tmp.position.set(...p); tmp.updateMatrix(); sg.setMatrixAt(k, tmp.matrix) })
  glasses.add(sg)
  const bridge = new Mesh(new TorusGeometry(0.075, 0.017, 8, 16, Math.PI), gold)
  bridge.position.set(0, 0.05, 0.02)
  glasses.add(bridge)
  hitBox(glasses, 1.15, 0.38, 0.08, 0, 0.03, 0.02)
  glasses.scale.setScalar(1.12)
  glasses.position.set(0.02, 0.12, front + 0.06)
  glasses.rotation.z = -0.1
  body.add(glasses)
  pickables.push(glasses)

  // Gold arched handles through gold grommets, front and back.
  for (const z of [front - 0.03, -front + 0.03]) {
    const pts = [[-0.3, top - 0.1], [-0.33, top + 0.2], [-0.2, top + 0.44], [0, top + 0.5], [0.2, top + 0.44], [0.33, top + 0.2], [0.3, top - 0.1]]
      .map(([x, y]) => new Vector3(x, y, z * 1.02))
    const h = new Mesh(new TubeGeometry(new CatmullRomCurve3(pts), 40, 0.042, 10), gold)
    body.add(h)
    for (const x of [-0.3, 0.3]) {
      const ring = new Mesh(new TorusGeometry(0.06, 0.022, 8, 20), gold)
      ring.position.set(x, top - 0.1, z > 0 ? front + 0.005 : -front - 0.005)
      body.add(ring)
    }
  }

  // The big gold satin bow on her top left corner, wearing a tiny crown.
  const bow = tag(new Group(), 'bow') as Group
  const ribbon = { depth: 0.04, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.022, bevelSegments: 3, curveSegments: 14 }
  const lobe = new Shape()
  lobe.moveTo(0, 0)
  lobe.bezierCurveTo(0.06, 0.3, 0.44, 0.36, 0.42, 0.1)
  lobe.bezierCurveTo(0.41, -0.12, 0.16, -0.16, 0, 0)
  const tail = new Shape()
  tail.moveTo(-0.03, 0)
  tail.bezierCurveTo(0.02, -0.18, 0.04, -0.3, 0.02, -0.46)
  tail.lineTo(0.1, -0.38); tail.lineTo(0.17, -0.47)
  tail.bezierCurveTo(0.15, -0.3, 0.12, -0.15, 0.06, 0.01)
  for (const s of [-1, 1]) {
    const loop = new Mesh(new ExtrudeGeometry(lobe, ribbon), satin)
    loop.scale.x = s
    loop.rotation.y = s * -0.3
    bow.add(loop)
    const t = new Mesh(new ExtrudeGeometry(tail, ribbon), satin)
    t.scale.x = s
    t.rotation.z = s * 0.15
    t.position.z = -0.03
    bow.add(t)
  }
  const knot = new Mesh(new SphereGeometry(0.09, 16, 12), satin)
  knot.scale.set(0.9, 1.1, 0.8)
  knot.position.z = 0.05
  bow.add(knot)
  hitBox(bow, 0.95, 0.6, 0.2, 0, 0, 0)
  const crown = new Group()
  crown.add(new Mesh(new CylinderGeometry(0.1, 0.09, 0.06, 20, 1, true), new MeshStandardMaterial({ color: gold.color, roughness: 0.2, metalness: 1, side: DoubleSide })))
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * TAU
    const p = new Mesh(new ConeGeometry(0.03, 0.1, 6), gold)
    p.position.set(Math.cos(a) * 0.095, 0.07, Math.sin(a) * 0.095)
    crown.add(p)
    const tip = new Mesh(new SphereGeometry(0.018, 8, 6), sparkle)
    tip.position.set(Math.cos(a) * 0.095, 0.125, Math.sin(a) * 0.095)
    crown.add(tip)
    const g = new Mesh(new SphereGeometry(0.018, 8, 6), gem)
    g.position.set(Math.cos(a + 0.6) * 0.1, 0, Math.sin(a + 0.6) * 0.1)
    crown.add(g)
  }
  crown.position.set(0, 0.13, 0.04)
  crown.rotation.set(0.25, 0, -0.15)
  bow.add(crown)
  bow.position.set(-0.52, top + 0.02, front - 0.02)
  bow.rotation.set(0, 0.25, 0.35)
  body.add(bow)
  pickables.push(bow)

  // Arms: black, with white cartoon gloves. Pivots at the shoulders so they can wave.
  const limb = (pts: [number, number, number][], r: number) => new Mesh(new TubeGeometry(new CatmullRomCurve3(pts.map(p => new Vector3(...p))), 20, r, 8), black)
  const gloveHand = (fingersUp: number) => {
    const hand = new Group()
    const palm = new Mesh(new SphereGeometry(0.12, 16, 12), glove)
    palm.scale.set(1, 1.05, 0.72)
    hand.add(palm)
    const cuff = new Mesh(new TorusGeometry(0.095, 0.04, 8, 18), glove)
    cuff.rotation.x = Math.PI / 2
    cuff.position.y = -0.12
    hand.add(cuff)
    for (let k = 0; k < 4; k++) {
      const x = -0.07 + k * 0.047
      if (k >= 4 - fingersUp) {
        const f = new Mesh(new CapsuleGeometry(0.036, 0.16, 4, 8), glove)
        const spread = fingersUp === 2 ? (k === 2 ? -0.22 : 0.22) : 0
        f.position.set(x + spread * 0.25, 0.17, 0)
        f.rotation.z = -spread
        hand.add(f)
      } else {
        const f = new Mesh(new SphereGeometry(0.042, 10, 8), glove)
        f.position.set(x, 0.07, 0.07)
        hand.add(f)
      }
    }
    const thumb = new Mesh(new CapsuleGeometry(0.035, 0.08, 4, 8), glove)
    thumb.position.set(-0.08, 0.02, 0.07)
    thumb.rotation.z = 0.9
    hand.add(thumb)
    return hand
  }
  // Peace sign, on the left of the picture.
  const armL = new Group()
  armL.position.set(-0.62, -0.02, 0)
  armL.add(limb([[0, 0, 0], [-0.22, -0.02, 0.06], [-0.4, 0.14, 0.12], [-0.47, 0.34, 0.14]], 0.045))
  const peace = tag(gloveHand(2), 'hand') as Group
  hitBox(peace, 0.4, 0.55, 0.3, 0, 0.08, 0)
  peace.position.set(-0.48, 0.48, 0.15)
  peace.rotation.set(0, 0.3, 0.18)
  armL.add(peace)
  body.add(armL)
  pickables.push(peace)
  // Holding her little black bag, on the right.
  const armR = new Group()
  armR.position.set(0.62, -0.08, 0)
  armR.add(limb([[0, 0, 0], [0.2, -0.08, 0.05], [0.34, -0.26, 0.1], [0.4, -0.46, 0.12]], 0.045))
  const fist = gloveHand(0)
  fist.position.set(0.41, -0.56, 0.13)
  fist.rotation.set(0, -0.3, Math.PI)
  armR.add(fist)
  const mini = tag(new Group(), 'minibag') as Group
  const mb = new Mesh(new ExtrudeGeometry(bagShape(0.42, 0.36, 0.44, 0.04), { depth: 0.14, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.012, bevelSegments: 2 }), black)
  mb.position.set(0, -0.34, -0.07)
  mini.add(mb)
  const mbFace = new Mesh(new PlaneGeometry(0.34, 0.38), new MeshStandardMaterial({ map: paintMiniBag(), roughness: 0.3, metalness: 0.4 }))
  mbFace.position.set(0, -0.34, 0.088)
  mini.add(mbFace)
  const mh = new Mesh(new TorusGeometry(0.12, 0.016, 8, 24, Math.PI), gold)
  mh.position.set(0, -0.12, 0.02)
  mini.add(mh)
  hitBox(mini, 0.5, 0.62, 0.25, 0, -0.28, 0)
  mini.position.set(0.41, -0.6, 0.13)
  armR.add(mini)
  body.add(armR)
  pickables.push(mini)

  // Black legs and camo sneakers.
  const legs: Group[] = []
  for (const s of [-1, 1]) {
    const leg = tag(new Group(), 'shoes') as Group
    leg.position.set(s * 0.28, -top + 0.02, 0)
    leg.add(limb([[0, 0, 0], [s * 0.02, -0.2, 0.02], [s * 0.04, -0.36, 0.04]], 0.06))
    const shoe = new Group()
    const upper = new Mesh(new CapsuleGeometry(0.12, 0.16, 6, 12), camo)
    upper.rotation.x = Math.PI / 2
    upper.scale.set(1.05, 1, 0.85)
    upper.position.set(0, 0.02, 0.06)
    const soleM = new Mesh(new CapsuleGeometry(0.125, 0.2, 6, 12), sole)
    soleM.rotation.x = Math.PI / 2
    soleM.scale.set(1.1, 1, 0.38)
    soleM.position.set(0, -0.07, 0.07)
    const toe = new Mesh(new SphereGeometry(0.1, 12, 8), new MeshStandardMaterial({ color: new Color('#F5C518'), roughness: 0.4 }))
    toe.scale.set(1.05, 0.65, 0.8)
    toe.position.set(0, -0.01, 0.2)
    const collar = new Mesh(new TorusGeometry(0.075, 0.025, 8, 16), black)
    collar.rotation.x = Math.PI / 2
    collar.position.set(0, 0.1, -0.02)
    shoe.add(upper, soleM, toe, collar)
    hitBox(shoe, 0.34, 0.3, 0.5, 0, 0, 0.05)
    shoe.scale.setScalar(1.3)
    shoe.position.set(s * 0.04, -0.46, 0)
    leg.add(shoe)
    body.add(leg)
    pickables.push(leg)
    legs.push(leg)
  }

  root.position.y = 0.05
  return { root, body, glasses, bow, crown, armL, armR, peace, mini, legL: legs[0], legR: legs[1], eyes, mouth, pickables }
}

/* ---------- one shared stage ---------- */

type Inst = {
  canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; mood: Mood; talking: boolean
  visible: boolean; yaw: number; vyaw: number; pitch: number; dragging: boolean
  downX: number; downY: number; lastX: number; lastT: number; moved: boolean
  lookX: number; lookY: number; tLookX: number; tLookY: number
  moodAt: number; react: Part | null; reactAt: number; blinkAt: number; tapFootAt: number; seed: number
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
const REACT_MS: Record<Part, number> = { body: 1100, glasses: 1500, bow: 1200, hand: 1400, minibag: 1300, shoes: 1400 }

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
    renderer.outputColorSpace = SRGBColorSpace
    renderer.domElement.addEventListener('webglcontextlost', fail)

    const scene = new Scene()
    const pmrem = new PMREMGenerator(renderer)
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environmentIntensity = 0.6
    pmrem.dispose()
    const key = new DirectionalLight(0xffdcae, 2.2); key.position.set(-2, 3, 4)
    const rim = new DirectionalLight(0xff9a5a, 2.4); rim.position.set(2.5, 1.5, -3)
    const fill = new DirectionalLight(0xfff3e0, 0.7); fill.position.set(2, -1, 3)
    scene.add(key, rim, fill)

    const camera = new PerspectiveCamera(30, 1, 0.1, 50)
    camera.position.set(0, 0.15, 6.9)
    camera.lookAt(0, 0.1, 0)

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
const bump = (k: number) => Math.sin(Math.min(Math.max(k, 0), 1) * Math.PI)

/** Pose Nova for instance `i` at time `now` (ms). */
function pose(i: Inst, now: number) {
  const m = stage!.model
  const still = reduced()
  const ph = now / 1000 + i.seed

  i.lookX += (i.tLookX - i.lookX) * 0.08
  i.lookY += (i.tLookY - i.lookY) * 0.08

  // Drag spin with a little momentum, then she settles back to face you.
  if (!i.dragging) {
    i.yaw += i.vyaw
    i.vyaw *= 0.92
    if (Math.abs(i.vyaw) < 0.004) {
      const home = Math.round(i.yaw / TAU) * TAU
      i.yaw += (home - i.yaw) * 0.08
      i.vyaw = 0
    }
  }

  let y = 0, roll = 0, spin = 0, sx = 1, sy = 1
  let glassesY = 0.12, glassesTilt = -0.1, bowWiggle = 0, crownHop = 0
  let armLz = Math.sin(ph * 2.2) * 0.05, armRz = 0, peaceZ = 0.18, miniSwing = Math.sin(ph * 1.7) * 0.06
  let footL = 0, footR = 0, hopL = 0, hopR = 0
  if (!still) {
    y = Math.sin(ph * 1.7) * 0.04
    roll = Math.sin(ph * 1.1) * 0.03
    spin = Math.sin(ph * 0.55) * 0.16
    // An idle foot tap every few seconds.
    const f = (now - i.tapFootAt) / 1000
    if (f > 0 && f < 0.9) footR = Math.abs(Math.sin(f * Math.PI * 3)) * 0.35
    else if (f >= 0.9) i.tapFootAt = now + 4000 + Math.random() * 4000
  } else armLz = miniSwing = 0

  const mt = (now - i.moodAt) / 1000
  if (!still) {
    if (i.mood === 'cheer' && mt < 1.4) {
      const k = mt / 1.4
      y += Math.abs(Math.sin(k * Math.PI * 3)) * 0.18 * (1 - k * 0.3)
      sy = 1 + Math.sin(k * Math.PI * 6) * 0.04; sx = 2 - sy
      hopL = Math.max(0, Math.sin(k * Math.PI * 6)) * 0.1; hopR = Math.max(0, -Math.sin(k * Math.PI * 6)) * 0.1
      armLz += Math.sin(k * Math.PI * 6) * 0.3
    }
    if (i.mood === 'wow' && mt < 1) spin += ease(mt) * TAU
    if (i.mood === 'oops' && mt < 0.8) roll += Math.sin(mt * Math.PI * 7) * 0.14 * (1 - mt / 0.8)
  }
  if (i.mood === 'think') { roll -= 0.08; peaceZ = 0.6 }
  if (i.mood === 'wink') roll += 0.05

  // Reactions to a tap on part of her.
  const k = i.react ? (now - i.reactAt) / REACT_MS[i.react] : 2
  if (k < 1) {
    switch (i.react) {
      case 'body':
        if (!still) { y += bump(k / 0.55) * 0.28; spin += ease(Math.min(k / 0.8, 1)) * TAU }
        glassesY -= bump(k) * 0.1
        break
      case 'glasses': glassesY -= bump(k) * 0.2; glassesTilt += bump(k) * 0.12; break
      case 'bow': if (!still) { bowWiggle = Math.sin(k * Math.PI * 8) * 0.3 * (1 - k); crownHop = bump(k / 0.5) * 0.18 } break
      case 'hand': if (!still) { armLz += Math.sin(k * Math.PI * 6) * 0.35 * (1 - k * 0.5); peaceZ += Math.sin(k * Math.PI * 6) * 0.3 } break
      case 'minibag': if (!still) { armRz = bump(k) * 0.9; miniSwing += Math.sin(k * Math.PI * 5) * 0.4 * (1 - k) } break
      case 'shoes':
        if (!still) {
          hopL = Math.max(0, Math.sin(k * Math.PI * 8)) * 0.12; hopR = Math.max(0, -Math.sin(k * Math.PI * 8)) * 0.12
          y += Math.abs(Math.sin(k * Math.PI * 8)) * 0.05; roll += Math.sin(k * Math.PI * 4) * 0.08
        }
        break
    }
  }

  m.body.position.y = y
  m.body.rotation.set(i.pitch + i.lookY * 0.2, i.yaw + spin + i.lookX * 0.5, roll)
  m.body.scale.set(sx, sy, 1)
  m.glasses.position.y = glassesY
  m.glasses.rotation.z = glassesTilt
  m.bow.rotation.z = 0.35 + bowWiggle
  m.crown.position.y = 0.13 + crownHop
  m.crown.rotation.y = crownHop * 12
  m.armL.rotation.z = armLz
  m.peace.rotation.z = peaceZ
  m.armR.rotation.z = armRz
  m.mini.rotation.z = miniSwing
  m.legL.position.y = -0.8 + hopL
  m.legR.position.y = -0.8 + hopR
  m.legL.children[1].rotation.x = -footL
  m.legR.children[1].rotation.x = -footR

  // Face.
  if (now > i.blinkAt + 140) i.blinkAt = now + 2400 + Math.random() * 3000
  const blinking = now > i.blinkAt && now < i.blinkAt + 140
  let eyes: Eyes = i.mood
  if (k < 1) eyes = i.react === 'glasses' ? 'peek' : i.react === 'minibag' || i.react === 'hand' ? 'wink' : 'cheer'
  else if (blinking && i.mood !== 'cheer') eyes = 'blink'
  const oShape = i.mood === 'oops' || i.mood === 'wow' || (k < 1 && i.react === 'glasses')
  const kind = oShape ? 'o' : i.mood === 'think' && k >= 1 ? 'smirk' : 'smile'
  const open = (i.talking && !still ? ([1, 2, 0, 2, 1, 0] as const)[Math.floor(now / 95) % 6] : 0)
  setMap(m.eyes, paintEyes(eyes))
  setMap(m.mouth, paintMouth(kind, open))
}

function setMap(mat: MeshStandardMaterial, map: Texture) {
  if (mat.map === map) return
  const first = !mat.map
  mat.map = map
  if (first) mat.needsUpdate = true
}

function frame(now: number) {
  raf = requestAnimationFrame(frame)
  if (!stage || document.hidden) return
  const active = [...insts].filter(i => i.visible)
  if (!active.length) return
  const busy = active.some(i => i.dragging || i.talking || Math.abs(i.vyaw) > 0 || (i.react && now - i.reactAt < REACT_MS[i.react]) || now - i.moodAt < 1400)
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
  for (const i of active) {
    if (px >= 0 && !i.dragging) {
      const r = i.canvas.getBoundingClientRect()
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2
      i.tLookX = Math.max(-1, Math.min(1, (px - cx) / (window.innerWidth * 0.5)))
      i.tLookY = Math.max(-1, Math.min(1, (py - cy) / (window.innerHeight * 0.5)))
    }
    pose(i, now)
    const s = Math.min(R, i.canvas.width)
    renderer.setViewport(0, 0, s, s)
    renderer.setScissor(0, 0, s, s)
    renderer.render(scene, camera)
    i.ctx.clearRect(0, 0, i.canvas.width, i.canvas.height)
    i.ctx.drawImage(renderer.domElement, 0, R - s, s, s, 0, 0, i.canvas.width, i.canvas.height)
  }
}

const ray = new Raycaster()
/** Which part of her is under this point on the canvas? null = empty space. */
function pick(i: Inst, clientX: number, clientY: number): Part | null {
  if (!stage) return null
  const r = i.canvas.getBoundingClientRect()
  const ndc = new Vector2(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1)
  pose(i, performance.now())
  stage.model.root.updateMatrixWorld(true)
  ray.setFromCamera(ndc, stage.camera)
  for (const hit of ray.intersectObjects(stage.model.pickables, true)) {
    let o: Object3D | null = hit.object
    while (o && !o.userData.part) o = o.parent
    if (o) return o.userData.part as Part
  }
  return null
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
    canvas, ctx, mood, talking: false, visible: true, yaw: 0, vyaw: 0, pitch: 0, dragging: false,
    downX: 0, downY: 0, lastX: 0, lastT: 0, moved: false,
    lookX: 0, lookY: 0, tLookX: 0, tLookY: 0, moodAt: now, react: null, reactAt: 0,
    blinkAt: now + 1500 + Math.random() * 2000, tapFootAt: now + 2500 + Math.random() * 3000,
    seed: Math.random() * 10, off: () => {},
  }

  const poke = (part: Part, x: number, y: number) => {
    i.react = part; i.reactAt = performance.now(); i.vyaw = 0
    buzz()
    canvas.dispatchEvent(new CustomEvent('novapoke', { detail: { part, x, y }, bubbles: true }))
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
  const up = (e: PointerEvent) => {
    if (!i.dragging) return
    i.dragging = false
    i.pitch = 0
    if (i.moved) {
      // A drag shouldn't also count as a tap on whatever button she's sitting in.
      const eat = (ev: MouseEvent) => { ev.stopPropagation(); ev.preventDefault() }
      window.addEventListener('click', eat, { capture: true, once: true })
      setTimeout(() => window.removeEventListener('click', eat, { capture: true }), 0)
    } else if (e.type === 'pointerup') {
      poke(pick(i, e.clientX, e.clientY) ?? 'body', e.clientX, e.clientY)
    }
  }
  const key = (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') poke('body', 0, 0) }

  canvas.addEventListener('pointerdown', down)
  canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerup', up)
  canvas.addEventListener('pointercancel', up)
  const btn = canvas.parentElement?.closest('button')
  btn?.addEventListener('keydown', key)

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
    btn?.removeEventListener('keydown', key)
    io?.unobserve(canvas)
    insts.delete(i)
    failListeners.delete(onFail)
    if (!insts.size) { cancelAnimationFrame(raf); raf = 0; lastFrame = 0 }
  }

  return {
    setMood: m => { if (m !== i.mood) { i.mood = m; i.moodAt = performance.now() } },
    setTalking: on => { i.talking = on },
    detach: () => i.off(),
  }
}
