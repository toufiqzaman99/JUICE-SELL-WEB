import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { DrinkArt } from './art/DrinkArt'
import {
  BeanSVG,
  DropletSVG,
  IceCubeSVG,
  LemonWheelSVG,
  MintLeafSVG,
  ShardSVG,
  StrawberrySVG,
} from './art/drink-parts'
import { RevealText } from './ui/RevealText'

/* orbit destinations for the 7 ingredients (vw/vh offsets from center) */
const INGREDIENTS = [
  { key: 'lemon', label: 'LEMON', x: '-31vw', y: '-22vh', rot: 40 },
  { key: 'mint', label: 'MINT', x: '-23vw', y: '24vh', rot: -30 },
  { key: 'ice', label: 'ICE', x: '-8vw', y: '-33vh', rot: -14 },
  { key: 'milk', label: 'MILK', x: '25vw', y: '-27vh', rot: 20 },
  { key: 'coffee', label: 'COFFEE', x: '33vw', y: '-2vh', rot: -40 },
  { key: 'chocolate', label: 'CHOCOLATE', x: '25vw', y: '28vh', rot: 34 },
  { key: 'strawberry', label: 'STRAWBERRY', x: '-5vw', y: '34vh', rot: -20 },
] as const

/** WHAT'S INSIDE? — ingredients explode outward from the glass,
 *  hover in orbit, then collapse back and assemble the finished drink. */
export function IngredientsExplosion() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.closest('section'), start: 'top top', end: 'bottom bottom', scrub: 0.7 },
        defaults: { ease: 'none' },
      })

      // the glass waits in half-light…
      tl.fromTo(
        '.ie-drink',
        { opacity: 0.28, scale: 0.86 },
        { opacity: 1, scale: 1, duration: 0.16, ease: 'power2.out' },
        0.84,
      )

      // …while its soul flies apart
      INGREDIENTS.forEach((ing, i) => {
        const el = root.querySelector<HTMLElement>(`.ie-${ing.key}`)
        const label = root.querySelector<HTMLElement>(`.ie-${ing.key}-label`)
        const start = 0.06 + i * 0.035
        const end = start + 0.22
        const out: gsap.TweenVars = {
          x: ing.x,
          y: ing.y,
          scale: 1,
          opacity: 1,
          rotation: ing.rot,
          ease: 'power2.out',
          duration: end - start,
        }
        if (el)
          tl.fromTo(
            el,
            { x: 0, y: 0, scale: 0, opacity: 0, rotation: 0 },
            out,
            start,
          )
        if (label) {
          const labelY = `${parseFloat(ing.y) + 7}vh`
          tl.fromTo(
            label,
            { x: 0, y: 0, opacity: 0 },
            { x: ing.x, y: labelY, opacity: 1, ease: 'power2.out', duration: end - start },
            start + 0.03,
          )
        }
        // hold in orbit, then collapse back into the glass
        const back = 0.6 + (INGREDIENTS.length - 1 - i) * 0.03
        if (el) tl.to(el, { x: 0, y: 0, scale: 0, opacity: 0, rotation: 0, ease: 'power2.in', duration: 0.2 }, back)
        if (label) tl.to(label, { x: 0, y: 0, opacity: 0, ease: 'power2.in', duration: 0.2 }, back)
      })

      // completion burst
      tl.fromTo(
        '.ie-ring',
        { scale: 0.2, opacity: 0 },
        { scale: 1.5, opacity: 0, duration: 0.14, ease: 'power1.out' },
        0.86,
      )
      tl.fromTo('.ie-tag', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08, ease: 'power2.out' }, 0.9)
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="ingredients" className="relative" style={{ height: '260vh' }}>
      <div className="vignette sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden" style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 38%, #181410 0%, #0a0908 64%)' }}>
        <div ref={rootRef} className="relative h-full w-full">
          {/* heading */}
          <div className="absolute inset-x-0 top-[12vh] z-20 text-center">
            <p className="mb-3 font-sans text-[9px] uppercase tracking-[0.5em] text-gold">The formula</p>
            <RevealText
              lines={["WHAT'S INSIDE?"]}
              mode="words"
              className="font-display text-[clamp(2.8rem,8vw,7.5rem)] leading-none text-cream"
            />
          </div>

          {/* the glass */}
          <div className="absolute left-1/2 top-1/2 z-10 w-[min(56vw,380px)] -translate-x-1/2 -translate-y-1/2">
            <div className="ie-drink will-change-transform">
              <DrinkArt id="classic-coffee" animated className="w-full" />
            </div>
            <div className="ie-tag mt-4 text-center opacity-0">
              <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-fog">
                One perfect pour · seven pure ingredients
              </p>
            </div>
          </div>

          {/* completion burst ring */}
          <div className="ie-ring absolute left-1/2 top-1/2 z-0 h-[44vmin] w-[44vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/50 opacity-0" />

          {/* orbit ingredients */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-30">
            <div className="ie-lemon absolute w-24 -translate-x-1/2 -translate-y-1/2 opacity-0"><LemonWheelSVG r={46} className="w-full" /></div>
            <div className="ie-mint absolute w-24 -translate-x-1/2 -translate-y-1/2 opacity-0"><MintLeafSVG scale={1.15} className="w-full" /></div>
            <div className="ie-ice absolute w-24 -translate-x-1/2 -translate-y-1/2 opacity-0"><IceCubeSVG size={52} rot={12} className="w-full" /></div>
            <div className="ie-milk absolute w-20 -translate-x-1/2 -translate-y-1/2 opacity-0"><DropletSVG r={22} className="w-full" /></div>
            <div className="ie-coffee absolute w-24 -translate-x-1/2 -translate-y-1/2 opacity-0"><BeanSVG size={44} className="w-full" /></div>
            <div className="ie-chocolate absolute w-20 -translate-x-1/2 -translate-y-1/2 opacity-0"><ShardSVG w={34} h={46} className="w-full" /></div>
            <div className="ie-strawberry absolute w-24 -translate-x-1/2 -translate-y-1/2 opacity-0"><StrawberrySVG size={50} rot={-12} className="w-full" /></div>
          </div>

          {/* labels follow the ingredients in orbit */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-30">
            {INGREDIENTS.map((ing) => (
              <span
                key={ing.key}
                className={`ie-${ing.key}-label absolute -translate-x-1/2 -translate-y-1/2 font-sans text-[9px] uppercase tracking-[0.34em] text-fog opacity-0`}
              >
                {ing.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
