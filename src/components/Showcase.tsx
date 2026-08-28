import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { PRODUCTS, type Product } from '../data/products'
import { useCart } from '../context/CartContext'
import { useFinePointer } from '../hooks/useMedia'
import { DrinkArt } from './art/DrinkArt'
import { RevealText } from './ui/RevealText'


function Slide({ product }: { product: Product }) {
  const artRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)
  const ingRef = useRef<HTMLUListElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const { addToCart } = useCart()

  /* hover: 3D tilt + scale + ingredient particles */
  useEffect(() => {
    const art = artRef.current
    if (!art || !fine) return
    let raf = 0
    const onMove = (e: MouseEvent) => {
      const r = art.getBoundingClientRect()
      const dx = (e.clientX - r.left) / r.width - 0.5
      const dy = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      const slide = art.closest('.slide')
      const glow = slide?.querySelector<HTMLElement>('.slide-glow')
      const particles = art.querySelectorAll<HTMLElement>('.tilt-particle')
      raf = requestAnimationFrame(() => {
        gsap.to(art, {
          rotateY: dx * 14,
          rotateX: -dy * 12,
          scale: 1.05,
          duration: 0.6,
          ease: 'power2.out',
          transformPerspective: 900,
        })
        if (glow) gsap.to(glow, { opacity: 0.85, duration: 0.6 })
        gsap.fromTo(
          particles,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'back.out(2.5)' },
        )
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      const glow = art.closest('.slide')?.querySelector<HTMLElement>('.slide-glow')
      gsap.to(art, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.9, ease: 'elastic.out(1, 0.5)' })
      if (glow) gsap.to(glow, { opacity: 0.55, duration: 0.9 })
      gsap.to(art.querySelectorAll('.tilt-particle'), { scale: 0, opacity: 0, duration: 0.35, stagger: 0.03 })
    }
    art.addEventListener('mousemove', onMove)
    art.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      art.removeEventListener('mousemove', onMove)
      art.removeEventListener('mouseleave', onLeave)
    }
  }, [fine])

  return (
    <div className="slide relative flex h-full w-screen shrink-0 items-center px-[7vw] sm:px-[6vw]">
      {/* giant index numeral behind everything */}
      <span
        className="slide-num absolute right-[2vw] top-1/2 z-0 -translate-y-1/2 font-display text-[38vh] leading-none text-stroke opacity-60"
        style={{ WebkitTextStrokeColor: 'rgba(245,241,232,0.10)' }}
      >
        {product.index}
      </span>

      <div className="relative z-10 grid w-full max-w-[1500px] grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-[3vw]">
        {/* ── art ── */}
        <div className="relative mx-auto w-[min(78vw,420px)] md:w-full md:max-w-[460px]">
          <div
            className="slide-glow absolute inset-x-[8%] bottom-[-6%] top-[6%] -z-10 rounded-full opacity-55 blur-[90px]"
            style={{ background: `radial-gradient(circle, ${product.glow} 0%, transparent 65%)` }}
          />
          <div ref={artRef} data-cursor="explore" className="relative will-change-transform">
            <DrinkArt id={product.id} animated className="w-full" />
            {/* hover particles */}
            {fine && (
              <div ref={particlesRef} className="pointer-events-none absolute inset-0">
                {[
                  [10, 22, 26], [86, 16, 30], [16, 74, 34], [84, 70, 28], [50, 8, 22], [50, 88, 26],
                ].map(([x, y, size], i) => (
                  <span
                    key={i}
                    className="tilt-particle absolute inline-block opacity-0 will-change-transform"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 35% 30%, ${product.accentSoft}, ${product.accent})`,
                      boxShadow: `0 4px 14px ${product.glow}`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── info ── */}
        <div className="text-center md:text-left">
          <p className="slide-tag mb-4 font-serif text-xl italic text-fog md:text-2xl">{product.tagline}</p>
          <h3
            ref={nameRef}
            className="slide-name font-display text-[clamp(2.6rem,6.5vw,5.6rem)] leading-[0.95] text-cream will-change-transform"
          >
            {product.name}
          </h3>
          <p
            ref={descRef}
            className="slide-desc mx-auto mt-6 max-w-md font-sans text-sm font-light leading-relaxed text-fog md:mx-0 md:text-[15px]"
          >
            {product.description}
          </p>
          <ul ref={ingRef} className="mt-7 flex flex-wrap justify-center gap-2.5 md:justify-start">
            {product.ingredients.map((ing) => (
              <li
                key={ing}
                className="slide-ing rounded-full border border-line px-4 py-1.5 font-sans text-[9px] uppercase tracking-[0.24em] text-fog will-change-transform"
              >
                {ing}
              </li>
            ))}
          </ul>
          <div
            ref={priceRef}
            className="slide-price mt-9 flex flex-col items-center gap-5 sm:flex-row sm:justify-center md:justify-start"
          >
            <span className="font-display text-3xl text-gold">
              ${product.price.toFixed(2)}
            </span>
            <button
              type="button"
              data-cursor="click"
              onClick={(e) => addToCart(product.id, e.currentTarget)}
              className="group relative overflow-hidden rounded-full border border-cream/25 px-8 py-3.5 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-cream transition-colors duration-500 hover:border-gold"
            >
              <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0.05,0.36,1)] group-hover:scale-x-100" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-ink">
                Add to cart
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/** CHOOSE YOUR SIP — vertical scroll drives a pinned horizontal gallery
 *  of six giant drinks; every slide enters with its own motion sequence. */
export function Showcase() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()

  useEffect(() => {
    const wrap = wrapRef.current
    const track = trackRef.current
    if (!wrap || !track) return

    const getDistance = () => track.scrollWidth - window.innerWidth
    const ctx = gsap.context(() => {
      const master = gsap.to(track, {
        x: () => -getDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              PRODUCTS.length - 1,
              Math.max(0, Math.round(self.progress * (PRODUCTS.length - 1))),
            )
            if (counterRef.current)
              counterRef.current.textContent = PRODUCTS[idx].index
            if (progressRef.current)
              progressRef.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })

      /* per-slide entrances, scrubbed against the horizontal travel */
      const slides = gsap.utils.toArray<HTMLElement>('.slide')
      slides.forEach((slide) => {
        const art = slide.querySelector<HTMLElement>('[data-cursor="explore"]')
        const trigger = { trigger: slide, containerAnimation: master, start: 'left 72%', end: 'left 34%' }

        if (art)
          gsap.fromTo(
            art,
            { scale: 0.7, rotation: -10, opacity: 0 },
            { scale: 1, rotation: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { ...trigger, scrub: true } },
          )
        gsap.fromTo(
          slide.querySelector('.slide-name'),
          { x: 110, opacity: 0 },
          { x: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { ...trigger, scrub: true } },
        )
        gsap.fromTo(
          slide.querySelector('.slide-tag'),
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { ...trigger, start: 'left 68%', end: 'left 38%', scrub: true } },
        )
        gsap.fromTo(
          slide.querySelector('.slide-desc'),
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { ...trigger, start: 'left 64%', end: 'left 40%', scrub: true } },
        )
        gsap.fromTo(
          slide.querySelector('.slide-num'),
          { xPercent: 60, opacity: 0 },
          { xPercent: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { ...trigger, start: 'left 90%', end: 'left 60%', scrub: true } },
        )
        gsap.fromTo(
          slide.querySelectorAll('.slide-ing'),
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, ease: 'power2.out', scrollTrigger: { ...trigger, start: 'left 60%', end: 'left 42%', scrub: true } },
        )
        gsap.fromTo(
          slide.querySelector('.slide-price'),
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, ease: 'power2.out', scrollTrigger: { ...trigger, start: 'left 58%', end: 'left 42%', scrub: true } },
        )
      })
    }, wrap)

    return () => ctx.revert()
  }, [fine])

  return (
    <section id="showcase" className="relative">
      <div ref={wrapRef} className="relative h-screen overflow-hidden">
        {/* heading pinned above the gallery */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 pt-16 text-center sm:pt-20">
          <p className="mb-3 font-sans text-[9px] uppercase tracking-[0.5em] text-gold">The menu · 06 signature pours</p>
          <RevealText
            lines={['CHOOSE YOUR', 'SIP']}
            mode="chars"
            className="font-display text-[clamp(2.6rem,7vw,6rem)] leading-none text-cream"
          />
        </div>

        {/* the horizontal track */}
        <div ref={trackRef} className="showcase-track flex h-full w-max will-change-transform">
          {PRODUCTS.map((p) => (
            <Slide key={p.id} product={p} />
          ))}
        </div>

        {/* bottom progress */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between px-6 pb-6 sm:px-10 sm:pb-8">
          <span className="font-sans text-[10px] tracking-[0.4em] text-fog">
            <span ref={counterRef} className="text-gold">01</span> / 06
          </span>
          <div className="h-px w-44 overflow-hidden bg-line">
            <div ref={progressRef} className="h-full w-full origin-left scale-x-0 bg-gold" />
          </div>
          <span className="hidden font-sans text-[9px] uppercase tracking-[0.4em] text-fog/60 sm:block">
            Keep scrolling
          </span>
        </div>
      </div>
    </section>
  )
}
