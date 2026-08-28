import { useId } from 'react'
import type { ProductId } from '../../data/products'
import { getProduct } from '../../data/products'
import {
  Bean,
  Bubbles,
  Condensation,
  Droplet,
  GlassShell,
  IceCube,
  LemonWheel,
  Liquid,
  MintLeaf,
  Shard,
  Splash,
  Straw,
  Strawberry,
  StrawberrySlice,
  SyrupRibbon,
  WhippedCream,
} from './drink-parts'

interface DrinkArtProps {
  id: ProductId
  className?: string
  /** ambient studio glow behind the glass */
  glow?: boolean
  /** animated fizz / droplets / condensation */
  animated?: boolean
  /** exterior floating garnish */
  floaters?: boolean
}

/** Full cinematic studio scene for one product: key-lit glass,
 *  liquid, ice, garnish — all vector, all GPU-transform friendly. */
export function DrinkArt({ id, className = '', glow = true, animated = true, floaters = false }: DrinkArtProps) {
  const pid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const product = getProduct(id)

  return (
    <div className={`relative select-none ${className}`} aria-hidden>
      {glow && (
        <div
          className="absolute left-1/2 top-[38%] h-[70%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: `radial-gradient(circle, ${product.glow} 0%, transparent 62%)` }}
        />
      )}
      <svg viewBox="0 0 400 560" className="relative h-full w-full overflow-visible">
        {/* ── per-product scenes ─────────────────────────────── */}
        {id === 'lemonade' && (
          <>
            <GlassShell pid={pid} />
            <Liquid pid={pid} top={152} deep="#c98f1b" bright="#f3ce54" />
            <IceCube pid={pid} x={108} y={252} size={54} rot={-8} />
            <IceCube pid={pid} x={150} y={330} size={60} rot={12} />
            <IceCube pid={pid} x={222} y={268} size={52} rot={-18} />
            {animated && <Bubbles x={104} y={296} w={186} h={132} />}
            <LemonWheel pid={pid} x={262} y={112} r={46} rot={18} />
            <LemonWheel pid={pid} x={140} y={104} r={33} rot={-24} opacity={0.95} />
            <MintLeaf pid={pid} x={318} y={148} scale={0.9} rot={-30} />
            <Straw x={228} y={58} len={186} rot={-13} stripe="#e9c33c" />
            <Condensation />
            {animated && (
              <>
                <Droplet x={96} y={205} r={6} dur={3.4} delay={0.4} />
                <Droplet x={316} y={262} r={5} dur={3.9} delay={1.6} />
              </>
            )}
            {floaters && (
              <>
                <g className="art-floater" style={{ animationDuration: '6s' }}>
                  <LemonWheel pid={pid} x={52} y={408} r={38} rot={40} opacity={0.9} />
                </g>
                <g className="art-floater" style={{ animationDuration: '7.5s', animationDelay: '1.2s' }}>
                  <MintLeaf pid={pid} x={352} y={392} scale={1.05} rot={20} />
                </g>
              </>
            )}
          </>
        )}

        {id === 'strawberry-milkshake' && (
          <>
            <GlassShell pid={pid} />
            <Liquid pid={pid} top={204} deep="#c93a5c" bright="#f58ea1" />
            <WhippedCream pid={pid} cx={200} y={196} />
            <Strawberry pid={pid} x={200} y={92} size={52} rot={-8} />
            <StrawberrySlice pid={pid} x={138} y={156} size={40} rot={-28} />
            <StrawberrySlice pid={pid} x={272} y={176} size={32} rot={26} opacity={0.92} />
            <Straw x={240} y={64} len={180} rot={-12} stripe="#e4556e" />
            <IceCube pid={pid} x={118} y={330} size={54} rot={10} opacity={0.7} />
            <IceCube pid={pid} x={205} y={352} size={56} rot={-6} opacity={0.7} />
            <Condensation y={230} h={140} />
            {animated && (
              <>
                <Droplet x={102} y={288} r={6} dur={3.6} delay={0.8} />
                <Droplet x={310} y={330} r={5} dur={4.1} delay={2.2} />
              </>
            )}
            {floaters && (
              <>
                <g className="art-floater" style={{ animationDuration: '6.4s' }}>
                  <Strawberry pid={pid} x={46} y={396} size={48} rot={-18} />
                </g>
                <g className="art-floater" style={{ animationDuration: '7.2s', animationDelay: '1s' }}>
                  <StrawberrySlice pid={pid} x={352} y={404} size={44} rot={34} />
                </g>
              </>
            )}
          </>
        )}

        {id === 'chocolate-milkshake' && (
          <>
            <GlassShell pid={pid} />
            <Liquid pid={pid} top={204} deep="#3b2313" bright="#7a4a2a" />
            <SyrupRibbon x={160} y={210} len={200} color="#2e1a0c" />
            <SyrupRibbon x={240} y={216} len={190} color="#2e1a0c" opacity={0.7} />
            <WhippedCream pid={pid} cx={200} y={196} />
            <Shard pid={pid} x={182} y={118} w={24} h={34} rot={-20} />
            <Shard pid={pid} x={228} y={132} w={20} h={30} rot={32} />
            <Shard pid={pid} x={138} y={168} w={22} h={32} rot={-42} opacity={0.9} />
            <Straw x={244} y={66} len={180} rot={-12} stripe="#5a3418" />
            <IceCube pid={pid} x={120} y={338} size={52} rot={12} opacity={0.6} />
            <IceCube pid={pid} x={208} y={356} size={54} rot={-10} opacity={0.6} />
            <Condensation y={232} h={136} />
            {animated && <Splash pid={pid} x={120} y={150} scale={0.8} opacity={0.85} className="splash-pop" />}
            {floaters && (
              <>
                <g className="art-floater" style={{ animationDuration: '6.6s' }}>
                  <Shard pid={pid} x={52} y={380} w={26} h={38} rot={-30} />
                </g>
                <g className="art-floater" style={{ animationDuration: '7.8s', animationDelay: '1.4s' }}>
                  <Shard pid={pid} x={348} y={396} w={30} h={42} rot={24} />
                </g>
              </>
            )}
          </>
        )}

        {id === 'classic-coffee' && (
          <>
            <GlassShell pid={pid} />
            <Liquid pid={pid} top={168} deep="#6e4526" bright="#b98a5a" />
            <ellipse cx={200} cy={168} rx={96} ry={10} fill="#e8cba4" opacity={0.4} />
            <path d="M 140 164 C 152 152 176 148 194 152 C 210 148 232 152 246 162 C 226 168 166 170 140 164 Z" fill="#f2ddb8" opacity={0.75} />
            <IceCube pid={pid} x={110} y={256} size={56} rot={-10} />
            <IceCube pid={pid} x={158} y={330} size={62} rot={14} />
            <IceCube pid={pid} x={228} y={272} size={52} rot={-20} />
            <Bean pid={pid} x={196} y={176} size={26} rot={24} opacity={0.95} />
            <Straw x={236} y={62} len={182} rot={-13} stripe="#c08a5a" />
            <Condensation />
            {animated && (
              <>
                <Droplet x={98} y={220} r={6} dur={3.3} delay={0.2} />
                <Droplet x={314} y={278} r={5} dur={3.8} delay={1.8} />
              </>
            )}
            {floaters && (
              <>
                <g className="art-floater" style={{ animationDuration: '6.2s' }}>
                  <Bean pid={pid} x={48} y={400} size={36} rot={-24} />
                </g>
                <g className="art-floater" style={{ animationDuration: '7.4s', animationDelay: '1.1s' }}>
                  <Bean pid={pid} x={350} y={388} size={30} rot={30} />
                </g>
              </>
            )}
          </>
        )}

        {id === 'strawberry-coffee' && (
          <>
            <GlassShell pid={pid} />
            <Liquid pid={pid} top={168} deep="#b4583f" bright="#e88f74" />
            {/* berry layer */}
            <path d="M 82 330 L 96 442 Q 200 450 306 442 L 318 330 Q 200 344 82 330 Z" fill="#c93a5c" opacity={0.85} />
            <path d="M 84 330 Q 200 344 316 330" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={2} />
            <ellipse cx={200} cy={168} rx={96} ry={10} fill="#f2d4b8" opacity={0.4} />
            <path d="M 142 162 C 154 150 178 146 196 150 C 212 146 234 150 248 160 C 228 166 168 168 142 162 Z" fill="#f6e2c4" opacity={0.75} />
            <IceCube pid={pid} x={112} y={258} size={54} rot={-8} />
            <IceCube pid={pid} x={220} y={276} size={50} rot={-18} />
            <StrawberrySlice pid={pid} x={272} y={122} size={36} rot={28} />
            <Straw x={232} y={64} len={180} rot={-12} stripe="#e06a5a" />
            <Condensation />
            {animated && <Droplet x={306} y={240} r={5} dur={3.7} delay={1.2} />}
          </>
        )}

        {id === 'chocolate-coffee' && (
          <>
            <GlassShell pid={pid} />
            <Liquid pid={pid} top={168} deep="#4a2c16" bright="#a0703f" />
            <SyrupRibbon x={168} y={182} len={200} color="#241205" />
            <SyrupRibbon x={244} y={188} len={190} color="#241205" opacity={0.6} />
            <ellipse cx={200} cy={168} rx={96} ry={10} fill="#c9a06b" opacity={0.4} />
            <path d="M 144 163 C 156 151 180 147 198 151 C 214 147 236 151 250 161 C 230 167 170 169 144 163 Z" fill="#e0bd8c" opacity={0.7} />
            <IceCube pid={pid} x={112} y={262} size={56} rot={-12} />
            <IceCube pid={pid} x={162} y={336} size={60} rot={10} />
            <IceCube pid={pid} x={226} y={280} size={52} rot={-16} />
            <Shard pid={pid} x={186} y={120} w={20} h={30} rot={-26} opacity={0.95} />
            <Shard pid={pid} x={248} y={150} w={18} h={26} rot={38} opacity={0.85} />
            <Straw x={238} y={60} len={182} rot={-13} stripe="#b98a4e" />
            <Condensation />
            {animated && <Droplet x={100} y={232} r={6} dur={3.5} delay={0.6} />}
          </>
        )}
      </svg>
    </div>
  )
}
