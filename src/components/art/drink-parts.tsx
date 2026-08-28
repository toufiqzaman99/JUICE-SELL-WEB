/**
 * FROST & SIP — SVG drink illustration primitives.
 *
 * Every drink is drawn as layered vector art with one shared light source
 * (top-left key light) so all products read like one studio photoshoot.
 * Gradient ids are namespaced per instance via `pid` so multiple drinks on
 * one page never collide.
 *
 * Raw parts (`LemonWheel`, `IceCube`, …) are fragments to be used INSIDE an
 * existing <svg>. Standalone `*SVG` wrappers at the bottom of this file carry
 * their own <svg> so garnish particles can float anywhere on the page.
 */

import { useId, type CSSProperties } from 'react'

export interface PartProps {
  pid: string
}

/* ── glass shell ─────────────────────────────────────────────── */
export function GlassShell({
  pid,
  x = 72,
  top = 96,
  bottom = 452,
  topW = 128,
  botW = 112,
}: PartProps & { x?: number; top?: number; bottom?: number; topW?: number; botW?: number }) {
  const rimY = top
  const body = `M ${x} ${rimY} L ${x + (topW - botW) / 2 + 6} ${bottom} Q ${x + topW - 6} ${bottom + 10} ${x + topW} ${bottom} L ${x + topW + (topW - botW) / 2 + 6 - 10} ${rimY}`
  return (
    <g>
      {/* rim */}
      <ellipse cx={x + topW} cy={rimY} rx={topW} ry={13} fill="none" stroke="rgba(245,241,232,0.4)" strokeWidth={2.5} />
      <ellipse cx={x + topW} cy={rimY} rx={topW - 5} ry={10} fill="none" stroke="rgba(245,241,232,0.15)" strokeWidth={1.5} />
      {/* glass body */}
      <path d={body} fill={`url(#${pid}-glass)`} stroke="rgba(245,241,232,0.22)" strokeWidth={2.5} strokeLinejoin="round" />
      {/* key-light streak */}
      <path
        d={`M ${x + 22} ${rimY + 26} L ${x + 26} ${bottom - 34}`}
        stroke={`url(#${pid}-streak)`}
        strokeWidth={7}
        strokeLinecap="round"
      />
      <path
        d={`M ${x + topW * 2 - 34} ${rimY + 30} L ${x + topW * 2 - 40} ${bottom - 90}`}
        stroke="rgba(245,241,232,0.10)"
        strokeWidth={4}
        strokeLinecap="round"
      />
      {/* ground shadow */}
      <ellipse cx={x + topW + 6} cy={bottom + 14} rx={topW * 0.95} ry={13} fill="rgba(0,0,0,0.55)" />
    </g>
  )
}

/* ── liquid fill ─────────────────────────────────────────────── */
export function Liquid({
  pid,
  x = 82,
  top = 148,
  bottom = 442,
  topW = 118,
  botW = 102,
  deep,
  bright,
}: PartProps & { x?: number; top?: number; bottom?: number; topW?: number; botW?: number; deep: string; bright: string }) {
  const cx = x + topW
  const body = `M ${x} ${top} L ${x + (topW - botW) / 2} ${bottom} Q ${x + topW - 8} ${bottom + 8} ${x + topW} ${bottom} L ${x + topW + (topW - botW) / 2 + 2} ${top}`
  return (
    <g>
      <defs>
        <linearGradient id={`${pid}-liquid`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bright} />
          <stop offset="55%" stopColor={deep} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
      </defs>
      <path d={body} fill={`url(#${pid}-liquid)`} />
      {/* liquid surface */}
      <ellipse cx={cx} cy={top} rx={topW} ry={12} fill={bright} opacity={0.55} />
      <ellipse cx={cx - 28} cy={top + 2} rx={34} ry={6} fill="#fff" opacity={0.18} />
      {/* interior glow near bottom (light through liquid) */}
      <ellipse cx={cx} cy={bottom - 14} rx={topW * 0.55} ry={16} fill="#fff" opacity={0.07} />
    </g>
  )
}

/* ── ice cube ────────────────────────────────────────────────── */
export function IceCube({ pid, x = 0, y = 0, size = 56, rot = 0, opacity = 1 }: PartProps & { x?: number; y?: number; size?: number; rot?: number; opacity?: number }) {
  const h = size * 0.82
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
      <defs>
        <linearGradient id={`${pid}-ice`} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="rgba(226,242,255,0.55)" />
          <stop offset="100%" stopColor="rgba(180,210,235,0.16)" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={size} height={h} rx={size * 0.28} fill={`url(#${pid}-ice)`} stroke="rgba(255,255,255,0.4)" strokeWidth={1.6} />
      <rect x={size * 0.24} y={h * 0.16} width={size * 0.42} height={h * 0.16} rx={h * 0.08} fill="rgba(255,255,255,0.65)" transform={`rotate(-16 ${size * 0.45} ${h * 0.24})`} />
      <path d={`M ${size * 0.7} ${h * 0.5} l ${size * 0.16} ${-h * 0.22} l ${size * 0.05} ${h * 0.18}`} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={1.4} />
    </g>
  )
}

/* ── lemon wheel ─────────────────────────────────────────────── */
export function LemonWheel({ pid, x = 0, y = 0, r = 44, rot = 0, opacity = 1 }: PartProps & { x?: number; y?: number; r?: number; rot?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
      <defs>
        <radialGradient id={`${pid}-lemon`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#f7e4a0" />
          <stop offset="60%" stopColor="#e9c33c" />
          <stop offset="100%" stopColor="#d9a72e" />
        </radialGradient>
      </defs>
      <circle r={r} fill={`url(#${pid}-lemon)`} stroke="#fbf3d5" strokeWidth={5} />
      <circle r={r - 9} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.5} />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1={0}
          y1={0}
          x2={Math.sin((i / 8) * Math.PI * 2) * (r - 11)}
          y2={-Math.cos((i / 8) * Math.PI * 2) * (r - 11)}
          stroke="rgba(255,255,255,0.5)"
          strokeWidth={2}
        />
      ))}
      <circle cx={r * 0.45} cy={-r * 0.3} r={2.2} fill="rgba(120,90,10,0.55)" />
      <circle cx={-r * 0.4} cy={r * 0.42} r={2.2} fill="rgba(120,90,10,0.55)" />
    </g>
  )
}

/* ── mint sprig ──────────────────────────────────────────────── */
export function MintLeaf({ pid, x = 0, y = 0, scale = 1, rot = 0, opacity = 1 }: PartProps & { x?: number; y?: number; scale?: number; rot?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${scale})`} opacity={opacity}>
      <defs>
        <linearGradient id={`${pid}-mint`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7cc26a" />
          <stop offset="100%" stopColor="#2f6b33" />
        </linearGradient>
      </defs>
      <path d="M 0 0 C 26 -16 52 -14 62 6 C 50 26 20 30 0 18 Z" fill={`url(#${pid}-mint)`} />
      <path d="M 2 2 C 24 -8 46 -8 58 8" fill="none" stroke="rgba(240,255,235,0.5)" strokeWidth={1.8} />
      <path d="M 0 0 C -24 -20 -52 -18 -58 2 C -46 20 -18 24 0 14 Z" fill={`url(#${pid}-mint)`} opacity={0.85} />
    </g>
  )
}

/* ── whole strawberry ────────────────────────────────────────── */
export function Strawberry({ pid, x = 0, y = 0, size = 56, rot = 0, opacity = 1 }: PartProps & { x?: number; y?: number; size?: number; rot?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
      <defs>
        <radialGradient id={`${pid}-berry`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#f2778e" />
          <stop offset="55%" stopColor="#e4556e" />
          <stop offset="100%" stopColor="#a92644" />
        </radialGradient>
      </defs>
      <path
        d={`M 0 ${-size * 0.72} C ${size * 0.62} ${-size * 0.78} ${size * 0.72} ${-size * 0.05} ${size * 0.58} ${size * 0.32} C ${size * 0.45} ${size * 0.66} ${size * 0.18} ${size * 0.78} 0 ${size * 0.78} C ${-size * 0.18} ${size * 0.78} ${-size * 0.45} ${size * 0.66} ${-size * 0.58} ${size * 0.32} C ${-size * 0.72} ${-size * 0.05} ${-size * 0.62} ${-size * 0.78} 0 ${-size * 0.72} Z`}
        fill={`url(#${pid}-berry)`}
      />
      {[
        [0.3, -0.4], [-0.28, -0.18], [0.35, 0.02], [-0.34, 0.28], [0.22, 0.48], [0.02, -0.02], [-0.12, -0.5], [0.12, -0.62],
      ].map(([px, py], i) => (
        <ellipse key={i} cx={px * size} cy={py * size} rx={size * 0.032} ry={size * 0.05} fill="#ffd9a0" opacity={0.9} transform={`rotate(${i * 47} ${px * size} ${py * size})`} />
      ))}
      <path d={`M 0 ${-size * 0.72} l ${size * 0.28} ${-size * 0.2} l ${-size * 0.02} ${size * 0.1} l ${size * 0.24} ${-size * 0.1} l ${-size * 0.06} ${size * 0.18} l ${size * 0.22} ${-size * 0.02} l ${-size * 0.1} ${size * 0.22} l ${-size * 0.2} ${size * 0.14} l ${-size * 0.16} ${size * 0.2} l ${-size * 0.22} ${size * 0.08} l ${-size * 0.18} ${size * 0.24} l ${-size * 0.26} 0 l ${-size * 0.08} ${size * 0.16} z`} fill="#3f8a3a" />
    </g>
  )
}

/* ── strawberry slice ────────────────────────────────────────── */
export function StrawberrySlice({ pid, x = 0, y = 0, size = 46, rot = 0, opacity = 1 }: PartProps & { x?: number; y?: number; size?: number; rot?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
      <defs>
        <radialGradient id={`${pid}-bslice`} cx="50%" cy="42%" r="70%">
          <stop offset="0%" stopColor="#ffb9c6" />
          <stop offset="65%" stopColor="#f58ea1" />
          <stop offset="100%" stopColor="#e4556e" />
        </radialGradient>
      </defs>
      <path
        d={`M 0 ${-size * 0.6} C ${size * 0.5} ${-size * 0.66} ${size * 0.6} ${-size * 0.04} ${size * 0.48} ${size * 0.26} C ${size * 0.37} ${size * 0.55} ${size * 0.15} ${size * 0.64} 0 ${size * 0.64} C ${-size * 0.15} ${size * 0.64} ${-size * 0.37} ${size * 0.55} ${-size * 0.48} ${size * 0.26} C ${-size * 0.6} ${-size * 0.04} ${-size * 0.5} ${-size * 0.66} 0 ${-size * 0.6} Z`}
        fill={`url(#${pid}-bslice)`}
        stroke="#ffd7de"
        strokeWidth={2}
      />
      {[0.24, -0.28, 0.26, 0.14, -0.22, 0.3, -0.28, -0.14, 0.0, 0.38, 0.12, -0.5].reduce<number[][]>((acc, v, i) => {
        if (i % 2 === 0) acc.push([v, 0])
        else acc[acc.length - 1][1] = v
        return acc
      }, []).map(([px, py], i) => (
        <ellipse key={i} cx={px * size} cy={py * size} rx={size * 0.03} ry={size * 0.05} fill="#fff" opacity={0.85} />
      ))}
      <path d={`M 0 ${-size * 0.62} L 0 ${size * 0.6}`} stroke="rgba(255,255,255,0.5)" strokeWidth={1.6} />
    </g>
  )
}

/* ── whipped cream crown ─────────────────────────────────────── */
export function WhippedCream({ pid, cx = 200, y = 92, scale = 1, opacity = 1 }: PartProps & { cx?: number; y?: number; scale?: number; opacity?: number }) {
  return (
    <g transform={`translate(${cx} ${y}) scale(${scale})`} opacity={opacity}>
      <defs>
        <radialGradient id={`${pid}-cream`} cx="42%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#fdfbf4" />
          <stop offset="70%" stopColor="#f4ecdc" />
          <stop offset="100%" stopColor="#dccfb8" />
        </radialGradient>
      </defs>
      <path d="M -52 22 C -58 -18 -44 -44 -24 -50 C -10 -66 10 -66 24 -50 C 46 -46 58 -20 52 20 C 34 12 10 30 -52 22 Z" fill={`url(#${pid}-cream)`} />
      <path d="M -52 22 C -34 34 -8 16 6 30 C 20 42 40 30 52 20 C 38 6 4 8 -18 12 C -36 14 -46 16 -52 22 Z" fill="rgba(190,170,140,0.35)" />
      <path d="M -30 -34 C -22 -44 -8 -46 0 -40" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth={4} strokeLinecap="round" />
    </g>
  )
}

/* ── coffee bean ─────────────────────────────────────────────── */
export function Bean({ pid, x = 0, y = 0, size = 34, rot = 0, opacity = 1 }: PartProps & { x?: number; y?: number; size?: number; rot?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
      <defs>
        <radialGradient id={`${pid}-bean`} cx="35%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#8a5a34" />
          <stop offset="70%" stopColor="#5d3a20" />
          <stop offset="100%" stopColor="#38200f" />
        </radialGradient>
      </defs>
      <ellipse rx={size * 0.52} ry={size * 0.72} fill={`url(#${pid}-bean)`} />
      <path d={`M 0 ${-size * 0.68} C ${size * 0.3} ${-size * 0.3} ${size * 0.3} ${size * 0.3} 0 ${size * 0.68}`} fill="none" stroke="rgba(30,14,6,0.8)" strokeWidth={2.4} />
      <path d={`M ${-size * 0.14} ${-size * 0.5} C ${-size * 0.24} ${-size * 0.1} ${-size * 0.24} ${size * 0.1} ${-size * 0.14} ${size * 0.5}`} fill="none" stroke="rgba(255,225,190,0.4)" strokeWidth={1.6} />
    </g>
  )
}

/* ── chocolate shard ─────────────────────────────────────────── */
export function Shard({ pid, x = 0, y = 0, w = 26, h = 34, rot = 0, opacity = 1 }: PartProps & { x?: number; y?: number; w?: number; h?: number; rot?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
      <defs>
        <linearGradient id={`${pid}-shard`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a5a34" />
          <stop offset="55%" stopColor="#5a3418" />
          <stop offset="100%" stopColor="#33200f" />
        </linearGradient>
      </defs>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={3} fill={`url(#${pid}-shard)`} transform="rotate(12)" />
      <rect x={-w / 2 + 4} y={-h / 2 + 5} width={w * 0.3} height={h * 0.36} rx={2} fill="rgba(255,225,190,0.45)" transform="rotate(12)" />
    </g>
  )
}

/* ── straw ───────────────────────────────────────────────────── */
export function Straw({ x = 0, y = 0, len = 190, rot = -14, stripe = '#e4556e', opacity = 1 }: { x?: number; y?: number; len?: number; rot?: number; stripe?: string; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity}>
      <rect x={-7} y={0} width={14} height={len} rx={7} fill="rgba(240,235,225,0.92)" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={i} x={-7} y={14 + i * 26} width={14} height={11} fill={stripe} />
      ))}
      <rect x={-2.5} y={0} width={5} height={len} rx={2.5} fill="rgba(255,255,255,0.5)" />
    </g>
  )
}

/* ── condensation dots ───────────────────────────────────────── */
export function Condensation({ x = 80, y = 130, w = 240, h = 150 }: { x?: number; y?: number; w?: number; h?: number }) {
  const dots = [
    [0.08, 0.12], [0.22, 0.05], [0.38, 0.16], [0.55, 0.06], [0.72, 0.14], [0.9, 0.08],
    [0.15, 0.34], [0.4, 0.3], [0.65, 0.32], [0.88, 0.3], [0.28, 0.5], [0.5, 0.52],
    [0.75, 0.5], [0.1, 0.66], [0.45, 0.72], [0.68, 0.7], [0.9, 0.6],
  ]
  return (
    <g>
      {dots.map(([px, py], i) => (
        <circle
          key={i}
          cx={x + px * w}
          cy={y + py * h}
          r={2 + (i % 3) * 1.1}
          fill="rgba(245,241,232,0.5)"
          className={`condensation-dot d${i % 4}`}
        />
      ))}
    </g>
  )
}

/* ── rising bubbles (lemonade fizz) ──────────────────────────── */
export function Bubbles({ x = 100, y = 300, w = 190, h = 130 }: { x?: number; y?: number; w?: number; h?: number }) {
  const bubbles = [
    [0.15, 1, 3.4, 4.2], [0.35, 1, 2.6, 3.4], [0.55, 1, 3.8, 4.8], [0.75, 1, 2.9, 3.9], [0.92, 1, 3.2, 4.4],
    [0.25, 1.4, 2.2, 3.1], [0.6, 1.5, 3, 5.2], [0.82, 1.6, 2.4, 3.6],
  ]
  return (
    <g>
      {bubbles.map(([px, py, r, dur], i) => (
        <circle
          key={i}
          cx={x + px * w}
          cy={y + py * h}
          r={r}
          fill="rgba(255,255,255,0.32)"
          className="bubble"
          style={{ animationDuration: `${dur}s`, animationDelay: `${i * 0.55}s` }}
        />
      ))}
    </g>
  )
}

/* ── falling droplet (exterior) ──────────────────────────────── */
export function Droplet({ x = 0, y = 0, r = 7, dur = 3.2, delay = 0, opacity = 0.8 }: { x?: number; y?: number; r?: number; dur?: number; delay?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <path d={`M 0 ${-r} C ${r * 0.7} ${-r * 0.1} ${r} ${r * 0.5} ${r * 0.4} ${r} C ${-r * 0.2} ${r * 1.4} ${-r} ${r * 0.5} ${-r * 0.4} ${r} C ${-r} ${r * 0.5} ${-r * 0.7} ${-r * 0.1} 0 ${-r} Z`} fill="rgba(240,246,255,0.75)" className="droplet" style={{ animationDuration: `${dur}s`, animationDelay: `${delay}s` }} />
      <circle cx={-r * 0.28} cy={r * 0.1} r={r * 0.22} fill="rgba(255,255,255,0.9)" />
    </g>
  )
}

/* ── milk splash crown (for chocolate milkshake section) ────── */
export function Splash({ pid, x = 0, y = 0, scale = 1, opacity = 1, className = '' }: PartProps & { x?: number; y?: number; scale?: number; opacity?: number; className?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity} className={className}>
      <defs>
        <radialGradient id={`${pid}-splash`} cx="45%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#fdfbf4" />
          <stop offset="100%" stopColor="#e9ddc8" />
        </radialGradient>
      </defs>
      <path
        d="M -58 14 C -60 -8 -52 -26 -38 -34 C -34 -52 -18 -60 -2 -56 C 2 -74 22 -76 30 -62 C 48 -58 56 -44 54 -24 C 60 -14 58 0 48 10 C 30 -4 8 -8 -58 14 Z"
        fill={`url(#${pid}-splash)`}
      />
      <circle cx={-44} cy={-14} r={5} fill="rgba(255,255,255,0.85)" />
      <circle cx={-8} cy={-52} r={5} fill="rgba(255,255,255,0.85)" />
      <circle cx={36} cy={-40} r={4} fill="rgba(255,255,255,0.85)" />
    </g>
  )
}

/* ── syrup ribbon (interior drip) ────────────────────────────── */
export function SyrupRibbon({ x = 0, y = 0, len = 210, color = '#5a3418', opacity = 0.9 }: { x?: number; y?: number; len?: number; color?: string; opacity?: number }) {
  return (
    <path
      d={`M ${x} ${y} q 10 34 -4 ${len * 0.3} t -2 ${len * 0.32} q 9 30 -3 ${len * 0.38}`}
      fill="none"
      stroke={color}
      strokeWidth={7}
      strokeLinecap="round"
      opacity={opacity}
    />
  )
}

/* ═══════════════════════════════════════════════════════════════
   Standalone SVG wrappers — for garnish particles placed in HTML
   (hero, feature sections, ingredient orbits). Each wrapper owns
   its <svg> + a namespaced gradient id.
   ═══════════════════════════════════════════════════════════════ */

interface WrapperProps {
  className?: string
  style?: CSSProperties
}

export function LemonWheelSVG({ r = 50, rot = 0, className = '', style }: WrapperProps & { r?: number; rot?: number }) {
  const pid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg viewBox="-62 -62 124 124" className={`h-full w-full ${className}`} style={style} overflow="visible" aria-hidden>
      <LemonWheel pid={pid} r={r} rot={rot} />
    </svg>
  )
}

export function MintLeafSVG({ scale = 1, rot = 0, className = '', style }: WrapperProps & { scale?: number; rot?: number }) {
  const pid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg viewBox="-72 -44 132 84" className={`h-full w-full ${className}`} style={style} overflow="visible" aria-hidden>
      <MintLeaf pid={pid} scale={scale} rot={rot} />
    </svg>
  )
}

export function IceCubeSVG({ size = 56, rot = 0, className = '', style }: WrapperProps & { size?: number; rot?: number }) {
  const pid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg viewBox="-10 -12 76 76" className={`h-full w-full ${className}`} style={style} overflow="visible" aria-hidden>
      <IceCube pid={pid} size={size} rot={rot} />
    </svg>
  )
}

export function StrawberrySVG({ size = 56, rot = 0, className = '', style }: WrapperProps & { size?: number; rot?: number }) {
  const pid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg viewBox="-62 -76 124 152" className={`h-full w-full ${className}`} style={style} overflow="visible" aria-hidden>
      <Strawberry pid={pid} size={size} rot={rot} />
    </svg>
  )
}

export function StrawberrySliceSVG({ size = 46, rot = 0, className = '', style }: WrapperProps & { size?: number; rot?: number }) {
  const pid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg viewBox="-54 -66 108 128" className={`h-full w-full ${className}`} style={style} overflow="visible" aria-hidden>
      <StrawberrySlice pid={pid} size={size} rot={rot} />
    </svg>
  )
}

export function BeanSVG({ size = 36, rot = 0, className = '', style }: WrapperProps & { size?: number; rot?: number }) {
  const pid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg viewBox="-42 -52 84 104" className={`h-full w-full ${className}`} style={style} overflow="visible" aria-hidden>
      <Bean pid={pid} size={size} rot={rot} />
    </svg>
  )
}

export function ShardSVG({ w = 30, h = 42, rot = 0, className = '', style }: WrapperProps & { w?: number; h?: number; rot?: number }) {
  const pid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg viewBox="-54 -62 108 124" className={`h-full w-full ${className}`} style={style} overflow="visible" aria-hidden>
      <Shard pid={pid} w={w} h={h} rot={rot} />
    </svg>
  )
}

export function DropletSVG({ r = 8, className = '', style }: WrapperProps & { r?: number }) {
  return (
    <svg viewBox="-26 -26 52 62" className={`h-full w-full ${className}`} style={style} overflow="visible" aria-hidden>
      <Droplet r={r} />
    </svg>
  )
}

export function SplashSVG({ scale = 1, className = '', style }: WrapperProps & { scale?: number }) {
  const pid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg viewBox="-72 -88 144 160" className={`h-full w-full ${className}`} style={style} overflow="visible" aria-hidden>
      <Splash pid={pid} scale={scale} />
    </svg>
  )
}

export function WhippedCreamSVG({ scale = 1, className = '', style }: WrapperProps & { scale?: number }) {
  const pid = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <svg viewBox="-70 -70 140 110" className={`h-full w-full ${className}`} style={style} overflow="visible" aria-hidden>
      <WhippedCream pid={pid} cx={0} y={0} scale={scale} />
    </svg>
  )
}
