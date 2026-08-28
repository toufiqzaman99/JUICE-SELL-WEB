import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useFinePointer } from '../hooks/useMedia'
import { DrinkArt } from './art/DrinkArt'
import { LemonWheelSVG, MintLeafSVG } from './art/drink-parts'

export type IntroStage = 'loading' | 'revealing' | 'done'

interface HeroProps {
  stage: IntroStage
}

/** Full-bleed cinematic hero: giant SIP THE MOMENT, floating lemonade,
 *  4-depth mouse parallax and a scrubbed scroll-out where typography
 *  separates into layers and the drink glides toward the showcase. */
export function Hero({ stage }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null)
  const sipRef = useRef<HTMLDivElement>(null)
  const theRef = useRef<HTMLDivElement>(null)
  const momentRef = useRef<HTMLDivElement>(null)
  const drinkRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const fruitRef = useRef<HTMLDivElement>(null)
  const fgRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()

  /* ── intro: drink scales 0.7 → 1 with a slow settle-rotation ── */
  useEffect(() => {
    if (stage !== 'revealing') return
    const drink = drinkRef.current
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    if (drink)
      tl.fromTo(
        drink,
        { scale: 0.7, rotation: -7, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: 1.7 },
        0,
      )
    tl.fromTo(sipRef.current, { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.3 }, 0.25)
      .fromTo(theRef.current, { yPercent: 90, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.3 }, 0.45)
      .fromTo(momentRef.current, { yPercent: 80, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.3 }, 0.55)
      .fromTo(bgRef.current, { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 1.8 }, 0)
      .fromTo(metaRef.current, { opacity: 0 }, { opacity: 1, duration: 0.9 }, 1.1)
      .fromTo('.hero-hint', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8 }, 1.25)
    return () => {
      tl.kill()
    }
  }, [stage])

  /* ── idle life: drink floats, garnish drifts ────────────────── */
  useEffect(() => {
    if (stage !== 'done') return
    const drink = drinkRef.current
    if (!drink) return
    const floatY = gsap.to(drink, { y: 16, duration: 3.8, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    const floatR = gsap.to(drink, { rotation: 2.6, duration: 5.4, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    const fruits = gsap.utils.toArray<HTMLElement>('.hero-fruit')
    fruits.forEach((f, i) => {
      gsap.to(f, {
        y: i % 2 ? -22 : 20,
        rotation: i % 2 ? 14 : -12,
        duration: 4.6 + i,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })
    })
    return () => {
      floatY.kill()
      floatR.kill()
    }
  }, [stage])

  /* ── mouse parallax: bg 0.2 · fruit 0.6 · drink 0.4 · fg 1.2 ── */
  useEffect(() => {
    if (!fine || stage !== 'done') return
    const layers: Array<{ el: HTMLElement | null; f: number }> = [
      { el: bgRef.current, f: 16 },
      { el: sipRef.current, f: 22 },
      { el: fruitRef.current, f: 46 },
      { el: drinkRef.current, f: 30 },
      { el: theRef.current, f: 34 },
      { el: fgRef.current, f: 72 },
    ]
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      layers.forEach(({ el, f }) => {
        if (!el) return
        gsap.to(el, { x: nx * f, y: ny * f, duration: 1.1, ease: 'power2.out', overwrite: 'auto' })
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [fine, stage])

  /* ── scroll-out: layers separate, drink glides toward the next act ── */
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
      defaults: { ease: 'none' },
    })
    tl.to(sipRef.current, { yPercent: -150, scale: 1.28, opacity: 0, duration: 0.9 }, 0)
      .to(theRef.current, { yPercent: -260, xPercent: 34, opacity: 0, duration: 0.85 }, 0.08)
      .to(momentRef.current, { yPercent: -120, xPercent: -30, opacity: 0, duration: 0.95 }, 0.04)
      .to(drinkRef.current, { xPercent: 46, yPercent: -16, scale: 0.52, rotation: 16, duration: 1 }, 0)
      .to(fruitRef.current, { yPercent: -70, rotation: -14, opacity: 0, duration: 0.9 }, 0.1)
      .to(bgRef.current, { scale: 1.5, opacity: 0.15, duration: 1 }, 0)
      .to(fgRef.current, { opacity: 0, yPercent: -30, duration: 0.8 }, 0.2)
      .to('.hero-hint', { opacity: 0, y: -20, duration: 0.4 }, 0)
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])


  return (
    <section id="hero" ref={rootRef} className="vignette relative h-[100svh] overflow-hidden">
      {/* ── background (parallax layer 1) ── */}
      <div ref={bgRef} className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 30%, #1c160c 0%, #0a0908 65%)' }}
        />
        <div
          className="absolute left-[8%] top-[18%] h-[38vmin] w-[38vmin] rounded-full opacity-30 blur-[90px]"
          style={{ background: 'radial-gradient(circle, rgba(233,195,60,0.5) 0%, transparent 70%)' }}
        />
        <div
          className="absolute right-[6%] top-[46%] h-[30vmin] w-[30vmin] rounded-full opacity-25 blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(201,162,75,0.45) 0%, transparent 70%)' }}
        />
        {/* thin inner frame — the "minimal border" motif */}
        <div className="absolute inset-4 border border-line/40 sm:inset-5" />
      </div>

      {/* ── SIP (behind the glass) ── */}
      <div
        ref={sipRef}
        className="absolute left-[-2vw] top-[6vh] z-[5] font-display text-[clamp(9rem,31vw,31rem)] leading-[0.82] text-cream will-change-transform"
      >
        SIP
      </div>

      {/* ── fruit constellation (parallax layer 2) ── */}
      <div ref={fruitRef} className="absolute inset-0 z-[6] will-change-transform">
        <div className="hero-fruit absolute left-[9%] top-[24%] w-[9vmin] opacity-90">
          <LemonWheelSVG r={50} className="w-full" />
        </div>
        <div className="hero-fruit absolute right-[12%] top-[16%] w-[7vmin] opacity-80">
          <LemonWheelSVG r={40} rot={34} className="w-full" />
        </div>
        <div className="hero-fruit absolute bottom-[16%] left-[16%] w-[6vmin] opacity-70">
          <MintLeafSVG scale={1.2} rot={-24} className="w-full" />
        </div>
        <div className="hero-fruit absolute bottom-[22%] right-[10%] w-[8vmin] opacity-85">
          <LemonWheelSVG r={44} rot={-40} className="w-full" />
        </div>
      </div>

      {/* ── THE (crosses in front) ── */}
      <div
        ref={theRef}
        className="absolute left-[4vw] top-[40vh] z-30 font-serif text-[clamp(3.4rem,13vw,12rem)] italic leading-none text-gold-soft will-change-transform"
      >
        the
      </div>

      {/* ── the drink (parallax layer 3) ── */}
      <div className="absolute left-1/2 top-1/2 z-20 w-[min(72vw,430px)] -translate-x-1/2 -translate-y-1/2 sm:w-[min(44vw,430px)]">
        <div ref={drinkRef} className="will-change-transform">
          <DrinkArt id="lemonade" animated floaters className="w-full" />
        </div>
      </div>

      {/* ── MOMENT (behind, bleeding off the right edge) ── */}
      <div
        ref={momentRef}
        className="absolute bottom-[-3vh] right-[-4vw] z-[5] font-display text-[clamp(6rem,22vw,23rem)] leading-[0.82] text-cream will-change-transform"
      >
        MOMENT
      </div>

      {/* ── foreground mist (parallax layer 4) ── */}
      <div ref={fgRef} className="pointer-events-none absolute inset-0 z-40 will-change-transform">
        <div className="absolute bottom-[-10%] left-[-8%] h-[46vh] w-[70vw] opacity-25 blur-[70px]" style={{ background: 'radial-gradient(ellipse, rgba(245,241,232,0.16) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-6%] right-[-10%] h-[40vh] w-[60vw] opacity-20 blur-[80px]" style={{ background: 'radial-gradient(ellipse, rgba(233,195,60,0.14) 0%, transparent 70%)' }} />
      </div>

      {/* ── meta row ── */}
      <div
        ref={metaRef}
        className="absolute inset-x-5 bottom-6 z-30 flex items-end justify-between sm:inset-x-8 sm:bottom-8"
      >
        <div className="space-y-1.5">
          <p className="font-sans text-[9px] uppercase tracking-[0.42em] text-fog">Craft cold drinks</p>
          <p className="font-sans text-[9px] uppercase tracking-[0.42em] text-fog/70">
            Lemonade · Milkshakes · Cold Coffee
          </p>
        </div>
        <div className="hero-hint flex items-center gap-3">
          <span className="font-sans text-[9px] uppercase tracking-[0.42em] text-fog">Scroll</span>
          <span className="relative block h-10 w-px overflow-hidden bg-line">
            <span className="hero-hint-line absolute left-0 top-0 h-4 w-px bg-gold" />
          </span>
        </div>
      </div>
    </section>
  )
}
