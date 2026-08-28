import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from '../lib/gsap'
import { useCart } from '../context/CartContext'
import { DrinkArt } from './art/DrinkArt'
import {
  BeanSVG,
  DropletSVG,
  IceCubeSVG,
  LemonWheelSVG,
  MintLeafSVG,
  ShardSVG,
  SplashSVG,
  StrawberrySVG,
  StrawberrySliceSVG,
  WhippedCreamSVG,
} from './art/drink-parts'
import { RevealText } from './ui/RevealText'

/* ────────────────────────────────────────────────────────────────
   StickyScene — the "camera room" pattern: a tall section whose inner
   viewport stays pinned (CSS sticky) while a scrubbed GSAP timeline
   plays the cinematic sequence. No GSAP pinning → Lenis-friendly.
   ──────────────────────────────────────────────────────────────── */
function StickyScene({
  id,
  height = '300vh',
  children,
  className = '',
}: {
  id: string
  height?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className="relative" style={{ height }}>
      <div className={`sticky top-0 flex h-screen items-center justify-center overflow-hidden ${className}`}>
        {children}
      </div>
    </section>
  )
}

function MiniOrder({ productId }: { productId: 'lemonade' | 'strawberry-milkshake' | 'chocolate-milkshake' }) {
  const { addToCart } = useCart()
  return (
    <button
      type="button"
      data-cursor="click"
      onClick={(e) => addToCart(productId, e.currentTarget)}
      className="group relative mt-8 inline-flex items-center gap-3 overflow-hidden rounded-full border border-cream/25 px-7 py-3 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-cream transition-colors duration-500 hover:border-gold"
    >
      <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0.05,0.36,1)] group-hover:scale-x-100" />
      <span className="relative z-10 transition-colors duration-500 group-hover:text-ink">
        Order now <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
      </span>
    </button>
  )
}

/* ────────────────────────────────────────────────────────────────
   01 · LEMONADE — PURE LEMON ENERGY.
   slices fly in · ice falls · mint rotates · droplets descend ·
   camera pushes in · FRESHLY SQUEEZED lands at the end
   ──────────────────────────────────────────────────────────────── */
export function LemonadeSection() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.closest('section'), start: 'top top', end: 'bottom bottom', scrub: 0.7 },
        defaults: { ease: 'none' },
      })

      tl.fromTo('.lm-camera', { scale: 1 }, { scale: 1.16, duration: 1, ease: 'power1.in' }, 0)
        .fromTo('.lm-glow', { scale: 0.8, opacity: 0.5 }, { scale: 1.25, opacity: 1, duration: 1 }, 0)
        // lemon slices fly in from the edges
        .fromTo('.lm-slice1', { x: -420, y: -220, rotation: -160, opacity: 0 }, { x: 0, y: 0, rotation: 24, opacity: 1, duration: 0.32, ease: 'power2.out' }, 0.12)
        .fromTo('.lm-slice2', { x: 460, y: -300, rotation: 200, opacity: 0 }, { x: 0, y: 0, rotation: -38, opacity: 1, duration: 0.34, ease: 'power2.out' }, 0.18)
        .fromTo('.lm-slice3', { x: -380, y: 320, rotation: -220, opacity: 0 }, { x: 0, y: 0, rotation: 60, opacity: 1, duration: 0.36, ease: 'power2.out' }, 0.24)
        // ice falls slowly
        .fromTo('.lm-ice1', { y: -260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'power1.in' }, 0.16)
        .fromTo('.lm-ice2', { y: -320, opacity: 0 }, { y: 0, opacity: 0.9, duration: 0.32, ease: 'power1.in' }, 0.24)
        .fromTo('.lm-ice3', { y: -380, opacity: 0 }, { y: 0, opacity: 0.8, duration: 0.34, ease: 'power1.in' }, 0.3)
        // mint rotates in
        .fromTo('.lm-mint', { rotation: -160, scale: 0.5, opacity: 0 }, { rotation: 18, scale: 1, opacity: 1, duration: 0.26, ease: 'power2.out' }, 0.34)
        // droplets glide down the glass
        .fromTo('.lm-drop', { y: 0, opacity: 0 }, { y: 46, opacity: 1, duration: 0.4, ease: 'power1.in' }, 0.3)
        // the glass settles with a slow rotation
        .fromTo('.lm-glass', { rotation: 0 }, { rotation: -5, duration: 0.45, ease: 'power2.out' }, 0.2)
        // headline drifts apart slightly
        .to('.lm-head', { xPercent: -4, duration: 1 }, 0)
        // finale stamp
        .fromTo('.lm-stamp', { scale: 1.25, opacity: 0, letterSpacing: '0.6em' }, { scale: 1, opacity: 1, letterSpacing: '0.34em', duration: 0.16, ease: 'power2.out' }, 0.78)
        .to('.lm-stamp', { opacity: 0.95, duration: 0.1 }, 0.95)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <StickyScene id="lemonade" className="vignette">
      <div ref={rootRef} className="relative h-full w-full" style={{ background: 'radial-gradient(ellipse 100% 80% at 30% 40%, #221a08 0%, #0a0908 60%)' }}>
        <div className="lm-glow absolute left-[52%] top-[46%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(233,195,60,0.22) 0%, transparent 65%)' }} />

        {/* headline — clip reveal */}
        <div className="lm-head absolute left-[6vw] top-[16vh] z-20 max-w-[60vw]">
          <p className="mb-4 font-sans text-[9px] uppercase tracking-[0.5em] text-gold">01 — Citrus</p>
          <RevealText
            lines={['PURE', 'LEMON', 'ENERGY.']}
            mode="clip"
            className="font-display text-[clamp(3.4rem,9.5vw,9.5rem)] leading-[0.92] text-cream"
            stagger={0.14}
          />
          <div className="lm-stamp mt-10 inline-block border-y border-gold/50 py-3 font-sans text-[11px] uppercase tracking-[0.34em] text-gold-soft opacity-0">
            Freshly squeezed
          </div>
          <MiniOrder productId="lemonade" />
        </div>

        {/* camera + glass */}
        <div className="lm-camera absolute left-[58%] top-1/2 z-10 w-[min(64vw,480px)] -translate-x-1/2 -translate-y-1/2 will-change-transform sm:left-[62%]">
          <div className="lm-glass relative will-change-transform">
            <DrinkArt id="lemonade" animated className="w-full" />
            {/* droplets on glass */}
            <div className="lm-drop absolute left-[16%] top-[38%] w-5 opacity-0">
              <DropletSVG r={7} className="w-full" />
            </div>
            <div className="lm-drop absolute right-[14%] top-[44%] w-4 opacity-0">
              <DropletSVG r={5} className="w-full" />
            </div>
          </div>
        </div>

        {/* flying ingredients */}
        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="lm-slice1 absolute right-[10%] top-[20%] w-[12vmin] opacity-0"><LemonWheelSVG r={52} className="w-full" /></div>
          <div className="lm-slice2 absolute left-[44%] top-[8%] w-[9vmin] opacity-0"><LemonWheelSVG r={40} className="w-full" /></div>
          <div className="lm-slice3 absolute bottom-[12%] right-[26%] w-[10vmin] opacity-0"><LemonWheelSVG r={46} className="w-full" /></div>
          <div className="lm-ice1 absolute left-[42%] top-[30%] w-14 opacity-0"><IceCubeSVG size={56} rot={14} className="w-full" /></div>
          <div className="lm-ice2 absolute right-[30%] top-[14%] w-12 opacity-0"><IceCubeSVG size={48} rot={-18} className="w-full" /></div>
          <div className="lm-ice3 absolute left-[36%] top-[6%] w-10 opacity-0"><IceCubeSVG size={40} rot={26} className="w-full" /></div>
          <div className="lm-mint absolute bottom-[16%] left-[10%] w-[7vmin] opacity-0"><MintLeafSVG scale={1.3} className="w-full" /></div>
        </div>
      </div>
    </StickyScene>
  )
}

/* ────────────────────────────────────────────────────────────────
   02 · STRAWBERRY — STRAWBERRY DREAM.
   berries converge from depth · cream rises · slices rotate ·
   glass grows 0.6 → 1 · the whole scene drifts aside
   ──────────────────────────────────────────────────────────────── */
export function StrawberrySection() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.closest('section'), start: 'top top', end: 'bottom bottom', scrub: 0.7 },
        defaults: { ease: 'none' },
      })

      tl.fromTo('.sb-camera', { scale: 1, xPercent: 0 }, { scale: 1.06, xPercent: -22, duration: 1, ease: 'power1.in' }, 0)
        // berries fly from the deep background toward the glass
        .fromTo('.sb-b1', { x: -520, y: -140, scale: 0.55, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.34, ease: 'power2.out' }, 0.1)
        .fromTo('.sb-b2', { x: 480, y: -240, scale: 0.5, opacity: 0 }, { x: 0, y: 0, scale: 0.95, opacity: 1, duration: 0.36, ease: 'power2.out' }, 0.16)
        .fromTo('.sb-b3', { x: -460, y: 260, scale: 0.6, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.38, ease: 'power2.out' }, 0.22)
        .fromTo('.sb-b4', { x: 520, y: 300, scale: 0.5, opacity: 0 }, { x: 0, y: 0, scale: 0.9, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0.28)
        // cream rises
        .fromTo('.sb-cream', { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.28, ease: 'power2.out' }, 0.3)
        // slices slowly rotate into place
        .fromTo('.sb-s1', { rotation: -120, scale: 0.6, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' }, 0.34)
        .fromTo('.sb-s2', { rotation: 140, scale: 0.6, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: 0.32, ease: 'power2.out' }, 0.4)
        // glass grows 0.6 → 1.0
        .fromTo('.sb-glass', { scale: 0.6, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.42, ease: 'power2.out' }, 0.14)
        .fromTo('.sb-glow', { scale: 0.7, opacity: 0.4 }, { scale: 1.3, opacity: 1, duration: 1 }, 0)
        .to('.sb-head', { xPercent: 8, duration: 1 }, 0)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <StickyScene id="strawberry" className="vignette">
      <div ref={rootRef} className="relative h-full w-full" style={{ background: 'radial-gradient(ellipse 100% 80% at 70% 40%, #2a0d14 0%, #0a0908 62%)' }}>
        <div className="sb-glow absolute left-[36%] top-[46%] h-[72vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]" style={{ background: 'radial-gradient(circle, rgba(228,85,110,0.26) 0%, transparent 65%)' }} />

        <div className="sb-head absolute right-[6vw] top-[16vh] z-20 max-w-[62vw] text-right">
          <p className="mb-4 font-sans text-[9px] uppercase tracking-[0.5em] text-berry-soft">02 — Cream</p>
          <RevealText
            lines={['STRAWBERRY', 'Dream.']}
            mode="scale"
            lineClassName="justify-end"
            className="font-display text-[clamp(3.2rem,8.5vw,8.5rem)] leading-[0.95] text-cream [&>div:last-child]:font-serif [&>div:last-child]:italic [&>div:last-child]:text-berry-soft"
            stagger={0.16}
          />
          <MiniOrder productId="strawberry-milkshake" />
        </div>

        <div className="sb-camera absolute left-[34%] top-1/2 z-10 w-[min(60vw,450px)] -translate-x-1/2 -translate-y-1/2 will-change-transform sm:left-[38%]">
          <div className="sb-glass relative will-change-transform">
            <DrinkArt id="strawberry-milkshake" animated className="w-full" />
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-30">
          {/* cream crown rising onto the rim */}
          <div className="sb-cream absolute left-[35%] top-[25%] w-[14vmin] opacity-0">
            <WhippedCreamSVG className="w-full" />
          </div>
          <div className="sb-b1 absolute left-[14%] top-[22%] w-[10vmin] opacity-0"><StrawberrySVG size={52} rot={-14} className="w-full" /></div>
          <div className="sb-b2 absolute right-[26%] top-[12%] w-[9vmin] opacity-0"><StrawberrySVG size={46} rot={20} className="w-full" /></div>
          <div className="sb-b3 absolute bottom-[14%] left-[22%] w-[11vmin] opacity-0"><StrawberrySVG size={56} rot={8} className="w-full" /></div>
          <div className="sb-b4 absolute bottom-[20%] right-[12%] w-[8vmin] opacity-0"><StrawberrySVG size={42} rot={-30} className="w-full" /></div>
          <div className="sb-s1 absolute left-[30%] top-[40%] w-[7vmin] opacity-0"><StrawberrySliceSVG size={40} className="w-full" /></div>
          <div className="sb-s2 absolute right-[30%] top-[52%] w-[6vmin] opacity-0"><StrawberrySliceSVG size={34} className="w-full" /></div>
        </div>
      </div>
    </StickyScene>
  )
}

/* ────────────────────────────────────────────────────────────────
   03 · CHOCOLATE — CHOCOLATE INDULGENCE.
   shards sweep across · syrup drips down · milk splashes ·
   the glass turns in the dark
   ──────────────────────────────────────────────────────────────── */
export function ChocolateSection() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.closest('section'), start: 'top top', end: 'bottom bottom', scrub: 0.7 },
        defaults: { ease: 'none' },
      })

      tl.fromTo('.ch-camera', { scale: 1 }, { scale: 1.1, duration: 1, ease: 'power1.in' }, 0)
        // chocolate pieces sweep through the frame
        .fromTo('.ch-shard1', { x: '-30vw', y: -40, rotation: -90, opacity: 0 }, { x: '6vw', y: 0, rotation: 160, opacity: 1, duration: 0.4, ease: 'power1.inOut' }, 0.1)
        .fromTo('.ch-shard2', { x: '30vw', y: 60, rotation: 120, opacity: 0 }, { x: '-4vw', y: 0, rotation: -140, opacity: 1, duration: 0.42, ease: 'power1.inOut' }, 0.16)
        .fromTo('.ch-shard3', { x: '-28vw', y: 120, rotation: 80, opacity: 0 }, { x: '2vw', y: 0, rotation: -200, opacity: 0.9, duration: 0.44, ease: 'power1.inOut' }, 0.22)
        // milk splash bursts
        .fromTo('.ch-splash', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.16, ease: 'back.out(2)' }, 0.46)
        .to('.ch-splash', { scale: 1.06, opacity: 0, duration: 0.14 }, 0.68)
        // glass rotates in the dark
        .fromTo('.ch-glass', { rotation: 4 }, { rotation: -6, duration: 0.5, ease: 'power2.out' }, 0.2)
        .fromTo('.ch-glow', { scale: 0.8, opacity: 0.4 }, { scale: 1.25, opacity: 1, duration: 1 }, 0)
        .to('.ch-head', { yPercent: -6, duration: 1 }, 0)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <StickyScene id="chocolate" className="vignette">
      <div ref={rootRef} className="relative h-full w-full" style={{ background: 'radial-gradient(ellipse 100% 80% at 32% 42%, #22120a 0%, #0a0908 62%)' }}>
        <div className="ch-glow absolute left-[56%] top-[46%] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]" style={{ background: 'radial-gradient(circle, rgba(160,106,60,0.24) 0%, transparent 65%)' }} />

        <div className="ch-head absolute left-[6vw] top-[16vh] z-20 max-w-[62vw]">
          <p className="mb-4 font-sans text-[9px] uppercase tracking-[0.5em] text-cocoa-soft">03 — Cocoa</p>
          <RevealText
            lines={['CHOCOLATE', 'Indulgence.']}
            mode="slide"
            className="font-display text-[clamp(3rem,8.5vw,8.5rem)] leading-[0.95] text-cream [&>div:last-child]:font-serif [&>div:last-child]:italic [&>div:last-child]:text-cocoa-soft"
            stagger={0.16}
          />
          <MiniOrder productId="chocolate-milkshake" />
        </div>

        <div className="ch-camera absolute left-[58%] top-1/2 z-10 w-[min(62vw,460px)] -translate-x-1/2 -translate-y-1/2 will-change-transform sm:left-[62%]">
          <div className="ch-glass relative will-change-transform">
            <DrinkArt id="chocolate-milkshake" animated className="w-full" />
            <div className="ch-splash absolute left-[-2%] top-[24%] w-[46%] opacity-0">
              <SplashSVG className="w-full" />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="ch-shard1 absolute left-[10%] top-[24%] w-12 opacity-0"><ShardSVG w={34} h={46} className="w-full" /></div>
          <div className="ch-shard2 absolute right-[12%] top-[38%] w-14 opacity-0"><ShardSVG w={40} h={52} className="w-full" /></div>
          <div className="ch-shard3 absolute left-[14%] top-[58%] w-10 opacity-0"><ShardSVG w={28} h={40} className="w-full" /></div>
        </div>
      </div>
    </StickyScene>
  )
}

/* ────────────────────────────────────────────────────────────────
   04 · COFFEE — COFFEE. BUT COLDER.
   three pours glide horizontally · beans float · ice drifts ·
   the glass carries its own parallax
   ──────────────────────────────────────────────────────────────── */
const COFFEE_PANELS = [
  { id: 'classic-coffee' as const, label: 'CLASSIC COLD COFFEE', sub: 'Slow-chilled espresso' },
  { id: 'strawberry-coffee' as const, label: 'STRAWBERRY COLD COFFEE', sub: 'Espresso over berry purée' },
  { id: 'chocolate-coffee' as const, label: 'CHOCOLATE COLD COFFEE', sub: 'Midnight in a glass' },
]

export function CoffeeSection() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.closest('section'), start: 'top top', end: 'bottom bottom', scrub: 0.7 },
        defaults: { ease: 'none' },
      })

      tl.fromTo('.cf-track', { xPercent: 0 }, { xPercent: -66.67, duration: 1 }, 0)
        .fromTo('.cf-head', { yPercent: 0 }, { yPercent: -30, duration: 0.5 }, 0)
        // per-panel parallax on the glasses
        .fromTo('.cf-art1', { xPercent: -6, yPercent: 0 }, { xPercent: 6, yPercent: -4, duration: 0.34 }, 0.05)
        .fromTo('.cf-art2', { xPercent: -4, yPercent: 0 }, { xPercent: 4, yPercent: -4, duration: 0.34 }, 0.4)
        .fromTo('.cf-art3', { xPercent: -6, yPercent: 0 }, { xPercent: 6, yPercent: -4, duration: 0.34 }, 0.72)
        // label stamps pop as each panel arrives
        .fromTo('.cf-label1', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.12, ease: 'power2.out' }, 0.24)
        .fromTo('.cf-label2', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.12, ease: 'power2.out' }, 0.58)
        .fromTo('.cf-label3', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.12, ease: 'power2.out' }, 0.9)
    }, root)

    /* ambient floaters — beans rise, ice drifts (not scrubbed) */
    const beans = gsap.utils.toArray<HTMLElement>('.cf-bean')
    beans.forEach((b, i) => {
      gsap.to(b, { y: -34, rotation: i % 2 ? 40 : -36, duration: 3.6 + i * 0.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    })
    const ice = gsap.utils.toArray<HTMLElement>('.cf-ice')
    ice.forEach((c, i) => {
      gsap.to(c, { y: 22, x: i % 2 ? -14 : 12, duration: 5 + i, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    })

    return () => {
      ctx.revert()
      beans.forEach((b) => gsap.killTweensOf(b))
      ice.forEach((c) => gsap.killTweensOf(c))
    }
  }, [])

  return (
    <StickyScene id="coffee" className="vignette">
      <div ref={rootRef} className="relative h-full w-full" style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 36%, #201309 0%, #0a0908 64%)' }}>
        <div className="pointer-events-none absolute left-1/2 top-[46%] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px]" style={{ background: 'radial-gradient(circle, rgba(192,138,90,0.2) 0%, transparent 65%)' }} />

        <div className="cf-head absolute inset-x-0 top-[12vh] z-20 text-center">
          <p className="mb-4 font-sans text-[9px] uppercase tracking-[0.5em] text-coffee-soft">04 — Cold bar</p>
          <RevealText
            lines={['COFFEE.', 'BUT COLDER.']}
            mode="rotate"
            className="font-display text-[clamp(3rem,9vw,9rem)] leading-[0.92] text-cream [&>div:last-child]:text-stroke"
            stagger={0.12}
          />
        </div>

        {/* horizontal 3-pour track */}
        <div className="cf-track absolute inset-x-0 top-1/2 z-10 flex h-[56vh] w-[300%] -translate-y-1/2 will-change-transform">
          {COFFEE_PANELS.map((panel, i) => (
            <div key={panel.id} className="relative flex h-full w-1/3 flex-col items-center justify-center">
              <div className={`cf-art${i + 1} relative w-[min(58vw,400px)] will-change-transform`}>
                <DrinkArt id={panel.id} animated className="w-full" />
              </div>
              <div className={`cf-label${i + 1} mt-6 text-center opacity-0`}>
                <p className="font-display text-xl tracking-[0.08em] text-cream sm:text-2xl">{panel.label}</p>
                <p className="mt-1 font-serif text-sm italic text-fog">{panel.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ambient beans + ice */}
        <div className="pointer-events-none absolute inset-0 z-30">
          <div className="cf-bean absolute left-[8%] top-[28%] w-9 opacity-80"><BeanSVG size={34} rot={18} className="w-full" /></div>
          <div className="cf-bean absolute right-[10%] top-[34%] w-8 opacity-80"><BeanSVG size={30} rot={-22} className="w-full" /></div>
          <div className="cf-bean absolute left-[16%] bottom-[18%] w-9 opacity-70"><BeanSVG size={34} rot={30} className="w-full" /></div>
          <div className="cf-ice absolute right-[16%] bottom-[20%] w-7 opacity-70"><IceCubeSVG size={28} rot={-14} className="w-full" /></div>
          <div className="cf-ice absolute left-[42%] bottom-[10%] w-6 opacity-60"><IceCubeSVG size={24} rot={20} className="w-full" /></div>
          <div className="cf-ice absolute right-[40%] top-[20%] w-6 opacity-60"><IceCubeSVG size={24} rot={-30} className="w-full" /></div>
        </div>
      </div>
    </StickyScene>
  )
}
