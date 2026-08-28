import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useCart } from '../context/CartContext'
import { DrinkArt } from './art/DrinkArt'
import { RevealText } from './ui/RevealText'
import { MagneticButton } from './ui/MagneticButton'

/** READY TO SIP? — the background slowly zooms while three drinks
 *  drift around the typography and a magnetic CTA closes the show. */
export function FinalCTA() {
  const rootRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const { openCart } = useCart()

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      // background slow zoom
      gsap.fromTo(
        bgRef.current,
        { scale: 1 },
        {
          scale: 1.18,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        },
      )

      // floating drinks drift
      gsap.utils.toArray<HTMLElement>('.cta-drink').forEach((el, i) => {
        gsap.to(el, {
          y: i % 2 ? -26 : 30,
          x: i % 2 ? 18 : -14,
          rotation: i % 2 ? -5 : 6,
          duration: 5 + i * 1.3,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
        })
      })
    }, root)

    return () => {
      ctx.revert()
      gsap.utils.toArray<HTMLElement>('.cta-drink').forEach((el) => gsap.killTweensOf(el))
    }
  }, [])

  return (
    <section
      id="cta"
      ref={rootRef}
      className="vignette relative flex h-[110svh] min-h-[640px] items-center justify-center overflow-hidden"
    >
      {/* zooming backdrop */}
      <div ref={bgRef} className="absolute inset-0 will-change-transform">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 100% 80% at 50% 60%, #1a1309 0%, #0a0908 60%)' }} />
        <div className="absolute left-1/2 top-[70%] h-[60vmin] w-[90vmin] -translate-x-1/2 rounded-full opacity-25 blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(201,162,75,0.5) 0%, transparent 70%)' }} />
        <div className="absolute inset-4 border border-line/40 sm:inset-6" />
      </div>

      {/* floating products */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="cta-drink absolute left-[4%] top-[10%] w-[24vmin] opacity-55 blur-[1.5px]">
          <DrinkArt id="strawberry-milkshake" animated={false} className="w-full" />
        </div>
        <div className="cta-drink absolute right-[5%] top-[14%] w-[26vmin] opacity-55 blur-[1.5px]">
          <DrinkArt id="chocolate-coffee" animated={false} className="w-full" />
        </div>
        <div className="cta-drink absolute bottom-[4%] left-[16%] w-[22vmin] opacity-50 blur-[2px]">
          <DrinkArt id="lemonade" animated={false} className="w-full" />
        </div>
        <div className="cta-drink absolute bottom-[6%] right-[18%] w-[20vmin] opacity-50 blur-[2px]">
          <DrinkArt id="classic-coffee" animated={false} className="w-full" />
        </div>
      </div>

      {/* typography */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <p className="mb-4 font-sans text-[9px] uppercase tracking-[0.5em] text-gold">Last call</p>
        <RevealText
          lines={['READY', 'TO', 'Sip?']}
          mode="scale"
          stagger={0.16}
          className="font-display text-[clamp(4rem,15vw,15rem)] leading-[0.9] text-cream [&>div:nth-child(2)]:text-stroke [&>div:last-child]:font-serif [&>div:last-child]:italic [&>div:last-child]:text-gold-soft"
        />
        <div className="mt-12">
          <MagneticButton onClick={openCart} ariaLabel="Order your drink">
            Order your drink
            <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-2">→</span>
          </MagneticButton>
        </div>
        <p className="mt-8 font-sans text-[9px] uppercase tracking-[0.4em] text-fog/70">
          Poured fresh · chilled to zero
        </p>
      </div>
    </section>
  )
}
