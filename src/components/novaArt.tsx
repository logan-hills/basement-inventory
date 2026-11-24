/* Nova drawn from the official Dynamic Dazzle art. Her painted layers (body, eyes, brows, mouth,
   shades, bow, and the arm with her little shopping bag) are cut from the logo; the other faces
   (big smile, surprised, thinking, sassy, heart eyes, blink) are drawn on top in the same style.
   Every coordinate here is in the art's own space: 610 x 740. The model sheet lives in
   /design/nova-stills-v2 in the project files. */
import type { ReactNode } from 'react'
import armUrl from '../assets/nova/arm.webp'
import bodyUrl from '../assets/nova/body.webp'
import bowUrl from '../assets/nova/bow.webp'
import browLUrl from '../assets/nova/browL.webp'
import eyeLUrl from '../assets/nova/eyeL.webp'
import eyeRUrl from '../assets/nova/eyeR.webp'
import glassesUrl from '../assets/nova/glasses.webp'
import mouthUrl from '../assets/nova/mouth.webp'

export type Face = 'wink' | 'smile' | 'wow' | 'think' | 'oops' | 'sassy' | 'heart'
export type Part = 'body' | 'glasses' | 'bow' | 'minibag' | 'shoes'

// [x, y, width, height] of each painted layer in the 610 x 740 art.
const LAYERS = {
  body: [bodyUrl, 110, 31, 445, 695], arm: [armUrl, 29, 226, 232, 396], bow: [bowUrl, 92, 77, 219, 211],
  glasses: [glassesUrl, 177, 224, 370, 146], mouth: [mouthUrl, 331, 311, 112, 79],
  eyeR: [eyeRUrl, 375, 148, 109, 145], eyeL: [eyeLUrl, 217, 226, 122, 64], browL: [browLUrl, 221, 189, 99, 36],
} as const
const Img = ({ n }: { n: keyof typeof LAYERS }) => {
  const [href, x, y, width, height] = LAYERS[n]
  return <image href={href} x={x} y={y} width={width} height={height} />
}

export const VIEW = '-40 -40 690 800'
export const ORIGIN = { feet: '305px 712px', bow: '196px 162px', arm: '175px 380px', mouth: '386px 352px' }
const INK = '#0d0d0d', LID = '#0a5a1c', BROW = '#07340f'
const EYE_R = [427, 244], EYE_L = [273, 258], BROW_R = [424, 176], BROW_L = [270, 212], MOUTH = [386, 352]

export function Defs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}iris`} cx=".42" cy=".38" r=".62"><stop offset="0" stopColor="#8a4a1c" /><stop offset=".55" stopColor="#3a1806" /><stop offset="1" stopColor="#0b0502" /></radialGradient>
      <linearGradient id={`${id}lid`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0d7a26" stopOpacity=".2" /><stop offset="1" stopColor="#063d12" stopOpacity=".55" /></linearGradient>
      <linearGradient id={`${id}heart`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#ff6b8b" /><stop offset="1" stopColor="#d1123f" /></linearGradient>
      <radialGradient id={`${id}shadow`} cx=".5" cy=".5" r=".5"><stop offset="0" stopColor="#000" stopOpacity=".4" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
      <filter id={`${id}soft`} x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6" /></filter>
      <filter id={`${id}glow`} x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.5" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
    </defs>
  )
}

type EyeOpts = { rx?: number; ry?: number; dx?: number; dy?: number; lid?: number; side?: 1 | -1; iris?: number; rot?: number }
function OpenEye({ id, cx, cy, o = {} }: { id: string; cx: number; cy: number; o?: EyeOpts }) {
  const { rx = 40, ry = 46, dx = -4, dy = -6, lid = 0, side = 1, iris = 27, rot = -12 } = o
  const top = -ry, lidY = top + lid * ry * 1.1
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${rot})`}>
      <ellipse cx="0" cy="-6" rx={rx + 12} ry={ry + 14} fill={LID} opacity=".25" />
      <path d={`M${-rx - 10},${top + 4} Q0,${top - 26} ${rx + 14},${top + 2}`} fill="none" stroke={BROW} strokeWidth="5" strokeLinecap="round" opacity=".8" />
      <clipPath id={id}><ellipse cx="0" cy="0" rx={rx} ry={ry} /></clipPath>
      <ellipse cx="0" cy="0" rx={rx} ry={ry} fill="#fdfdfb" />
      <g clipPath={`url(#${id})`}>
        <ellipse cx={-rx * 0.2} cy={ry * 0.55} rx={rx} ry={ry * 0.45} fill="#dfe6ea" />
        <g className="nv-iris"><circle cx={dx} cy={dy} r={iris} fill={`url(#${id.split('-')[0]}iris)`} />
          <circle cx={dx} cy={dy} r={iris * 0.5} fill="#050302" />
          <circle cx={dx - iris * 0.32} cy={dy - iris * 0.4} r={iris * 0.32} fill="#fff" />
          <circle cx={dx + iris * 0.35} cy={dy + iris * 0.35} r={iris * 0.13} fill="#fff" /></g>
        {lid > 0 && <rect x={-rx - 4} y={top - 4} width={rx * 2 + 8} height={lidY - top + 4} fill="#14a332" />}
      </g>
      <path d={`M${-rx - 4},${lidY + ry * 0.35 * (1 - lid)} Q${-rx * 0.5},${lidY - 6} 0,${lidY - 6} Q${rx * 0.6},${lidY - 6} ${rx + 6},${lidY + ry * 0.25 * (1 - lid)}`} fill="none" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <g transform={`translate(0 ${lidY - top}) scale(${side} 1)`} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round">
        <path d={`M${rx * 0.45},${top + 5} q8,-14 20,-22`} /><path d={`M${rx * 0.8},${top + 14} q14,-8 26,-14`} /><path d={`M${rx + 2},${top + 30} q16,-2 26,-6`} />
      </g>
    </g>
  )
}
function ClosedEye({ cx, cy, w = 42, happy = true, side = 1 }: { cx: number; cy: number; w?: number; happy?: boolean; side?: 1 | -1 }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(-14)`}>
      <ellipse cx="0" cy="-2" rx={w + 8} ry="30" fill={LID} opacity=".12" />
      <path d={happy ? `M${-w},12 Q0,-30 ${w},10` : `M${-w},-4 Q0,24 ${w},-6`} fill="none" stroke={INK} strokeWidth="10" strokeLinecap="round" />
      <g transform={`scale(${side} 1)`} fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round">
        {happy
          ? <><path d={`M${w * 0.7},-4 q12,-8 22,-18`} /><path d={`M${w + 1},8 q14,-2 22,-10`} /></>
          : <><path d={`M${w * 0.55},8 q10,10 14,22`} /><path d={`M${w * 0.9},2 q14,6 22,14`} /></>}
      </g>
    </g>
  )
}
const HeartEye = ({ id, cx, cy, s }: { id: string; cx: number; cy: number; s: number }) => (
  <g transform={`translate(${cx} ${cy}) rotate(-14) scale(${s})`} className="nv-heart">
    <path d="M0,34 C-60,-2 -46,-56 -10,-44 Q0,-40 0,-26 Q0,-40 10,-44 C46,-56 60,-2 0,34Z" fill={`url(#${id}heart)`} stroke="#5c0618" strokeWidth="5" strokeLinejoin="round" />
    <ellipse cx="-20" cy="-22" rx="11" ry="7" fill="#fff" opacity=".85" transform="rotate(-30 -20 -22)" />
  </g>
)
const Brow = ({ cx, cy, lift = 0, tilt = 0 }: { cx: number; cy: number; lift?: number; tilt?: number }) => (
  <g transform={`translate(${cx} ${cy - lift}) rotate(${-12 + tilt})`}><path d="M-40,6 Q0,-20 40,2 Q0,-10 -40,6Z" fill={BROW} stroke={BROW} strokeWidth="5" strokeLinejoin="round" /></g>
)
const Brows = ({ l = 0, r = 0, tl = 0, tr = 0 }) => <><Brow cx={BROW_L[0]} cy={BROW_L[1]} lift={l} tilt={tl} /><Brow cx={BROW_R[0]} cy={BROW_R[1]} lift={r} tilt={tr} /></>

const MouthImg = ({ sx = 1, sy = sx, dy = 0 }: { sx?: number; sy?: number; dy?: number }) =>
  <g transform={`translate(${MOUTH[0]} ${MOUTH[1] + dy}) scale(${sx} ${sy}) translate(${-MOUTH[0]} ${-MOUTH[1]})`}><Img n="mouth" /></g>
const MouthO = () => (
  <g transform={`translate(${MOUTH[0] - 2} ${MOUTH[1] + 6}) rotate(-14)`}>
    <ellipse cx="0" cy="0" rx="22" ry="27" fill="#3a0610" stroke="#7a0a1e" strokeWidth="6" /><ellipse cx="2" cy="12" rx="13" ry="8" fill="#ff4d6d" />
  </g>
)
const MouthSmirk = () => (
  <g transform={`translate(${MOUTH[0]} ${MOUTH[1] - 2}) rotate(-16)`}>
    <path d="M-44,4 Q-4,22 40,-14" fill="none" stroke="#2a0509" strokeWidth="9" strokeLinecap="round" />
    <path d="M-30,10 Q4,26 34,-6 Q8,16 -30,10Z" fill="#e8304f" />
    <path d="M44,-22 q8,8 2,18" fill="none" stroke={BROW} strokeWidth="5" strokeLinecap="round" />
  </g>
)
const MouthHmm = () => (
  <g transform={`translate(${MOUTH[0]} ${MOUTH[1] - 4}) rotate(-12)`}><path d="M-34,6 Q-8,-6 12,4 Q28,12 40,-4" fill="none" stroke="#2a0509" strokeWidth="9" strokeLinecap="round" /></g>
)
// Soft patches of her green that sit over the painted features when a drawn face replaces them.
const EyePatch = ({ id }: { id: string }) => (
  <g filter={`url(#${id}soft)`}>
    <ellipse cx="272" cy="250" rx="62" ry="44" fill="#1d9616" transform="rotate(-12 272 250)" /><ellipse cx="418" cy="226" rx="66" ry="62" fill="#22a40a" />
    <ellipse cx="462" cy="208" rx="26" ry="44" fill="#0b6e08" /><ellipse cx="300" cy="206" rx="52" ry="16" fill="#26a612" transform="rotate(-10 300 206)" />
  </g>
)
const MouthPatch = ({ id }: { id: string }) => <g filter={`url(#${id}soft)`}><ellipse cx="386" cy="350" rx="58" ry="34" fill="#14920a" transform="rotate(-14 386 350)" /></g>

/** Eyes, brows and mouth for a face. `blink` closes her eyes for a moment. */
export function FaceArt({ id, face, blink }: { id: string; face: Face; blink: boolean }): { eyes: ReactNode; mouth: ReactNode; glasses: string } {
  const e = (k: string, cx: number, cy: number, o: EyeOpts) => <OpenEye id={`${id}-${k}`} cx={cx} cy={cy} o={o} />
  const shut = <><EyePatch id={id} /><ClosedEye cx={EYE_L[0]} cy={EYE_L[1] + 6} happy={false} side={-1} /><ClosedEye cx={EYE_R[0]} cy={EYE_R[1] + 6} happy={false} /></>
  const happy = <><EyePatch id={id} /><Brows l={8} r={10} /><ClosedEye cx={EYE_L[0]} cy={EYE_L[1] + 2} w={40} side={-1} /><ClosedEye cx={EYE_R[0]} cy={EYE_R[1] + 2} /></>
  const painted = <MouthImg />
  switch (face) {
    case 'smile': return { eyes: happy, mouth: <MouthImg sx={1.35} />, glasses: '' }
    case 'heart': return {
      eyes: <><EyePatch id={id} /><HeartEye id={id} cx={EYE_L[0]} cy={EYE_L[1] - 4} s={0.95} /><HeartEye id={id} cx={EYE_R[0]} cy={EYE_R[1] - 8} s={1.02} /></>,
      mouth: <MouthImg sx={1.3} />, glasses: 'translate(0px, 18px)',
    }
    case 'wow': return {
      eyes: blink ? shut : <><EyePatch id={id} /><Brows l={26} r={30} />{e('l', EYE_L[0], EYE_L[1] - 6, { rx: 40, ry: 50, dx: 0, dy: -2, iris: 22, side: -1 })}{e('r', EYE_R[0], EYE_R[1] - 10, { rx: 42, ry: 52, dx: 0, dy: -2, iris: 23 })}</>,
      mouth: <><MouthPatch id={id} /><MouthO /></>, glasses: 'translate(0px, 22px)',
    }
    case 'think': return {
      eyes: blink ? shut : <><EyePatch id={id} /><Brow cx={BROW_L[0]} cy={BROW_L[1]} tilt={6} /><Brow cx={BROW_R[0]} cy={BROW_R[1]} lift={18} tilt={-6} />{e('l', EYE_L[0], EYE_L[1], { rx: 38, ry: 44, dx: 12, dy: -16, iris: 25, side: -1, lid: 0.12 })}{e('r', EYE_R[0], EYE_R[1], { dx: 12, dy: -16, iris: 26, lid: 0.08 })}</>,
      mouth: <><MouthPatch id={id} /><MouthHmm /></>, glasses: '',
    }
    case 'oops': return {
      eyes: blink ? shut : <><EyePatch id={id} /><Brow cx={BROW_L[0]} cy={BROW_L[1]} lift={10} tilt={-14} /><Brow cx={BROW_R[0]} cy={BROW_R[1]} lift={14} tilt={12} />{e('l', EYE_L[0], EYE_L[1], { rx: 38, ry: 44, dx: -10, dy: 8, iris: 24, side: -1, lid: 0.18 })}{e('r', EYE_R[0], EYE_R[1], { dx: -10, dy: 8, iris: 25, lid: 0.14 })}</>,
      mouth: <><MouthPatch id={id} /><MouthHmm /></>, glasses: 'translate(0px, 8px)',
    }
    case 'sassy': return {
      eyes: blink ? shut : <><EyePatch id={id} /><Brow cx={BROW_L[0]} cy={BROW_L[1]} lift={-4} tilt={4} /><Brow cx={BROW_R[0]} cy={BROW_R[1]} lift={16} tilt={-8} />{e('l', EYE_L[0], EYE_L[1] + 4, { rx: 38, ry: 44, dx: -10, dy: 4, iris: 26, side: -1, lid: 0.42 })}{e('r', EYE_R[0], EYE_R[1] + 4, { dx: -10, dy: 4, lid: 0.42 })}</>,
      mouth: <><MouthPatch id={id} /><MouthSmirk /></>, glasses: 'translate(-2px, 30px) rotate(-3deg)',
    }
    default: return { eyes: blink ? shut : <><Img n="browL" /><Img n="eyeL" /><Img n="eyeR" /></>, mouth: painted, glasses: '' }
  }
}

export const Painted = Img

/** Invisible tap targets, one per part, in the art's space. */
export function HitAreas() {
  return (
    <g className="nv-hit" fill="transparent">
      <polygon data-part="body" points="150,190 205,135 480,110 552,500 262,545 160,520" />
      <rect data-part="shoes" x="250" y="560" width="220" height="180" />
      <polygon data-part="minibag" points="28,240 150,240 180,400 256,420 256,618 28,618" />
      <ellipse data-part="bow" cx="196" cy="160" rx="104" ry="84" />
      <polygon data-part="glasses" points="178,285 400,282 548,218 532,322 450,342 362,312 332,356 250,370 194,342" />
    </g>
  )
}
