import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { scrollToId } from '../lib/lenis'
import { RevealText } from './ui/RevealText'

const COLS = [
  {
    title: 'MENU',
    links: [
      ['Fresh Lemonade', '#lemonade'],
      ['Strawberry Shake', '#strawberry'],
      ['Chocolate Shake', '#chocolate'],
      ['Cold Coffee', '#coffee'],
    ],
  },
  {
    title: 'VISIT',
    links: [
      ['12 Frost Lane', '#hero'],
      ['Open 9 — 23', '#hero'],
      ['Est. 2026', '#hero'],
    ],
  },
  {
    title: 'FOLLOW',
    links: [
      ['Instagram', '#hero'],
      ['TikTok', '#hero'],
      ['Spotify — Chill Mix', '#hero'],
    ],
  },
]

/** The curtain call: oversized wordmark, CHILL. SIP. ENJOY. and
 *  columns that rise into place as the footer enters the viewport. */
export function Footer() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ft-col',
        { y: 46, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: root, start: 'top 70%', once: true },
        },
      )
      gsap.fromTo(
        '.ft-bottom',
        { opacity: 0 },
        { opacity: 1, duration: 1, scrollTrigger: { trigger: root, start: 'top 60%', once: true } },
      )
      gsap.fromTo(
        '.ft-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.4, ease: 'power3.inOut', scrollTrigger: { trigger: root, start: 'top 75%', once: true } },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <footer ref={rootRef} className="relative overflow-hidden border-t border-line/60 pt-20">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-[40vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(201,162,75,0.4) 0%, transparent 70%)' }}
      />

      <div className="mx-auto max-w-[1500px] px-6 sm:px-10">
        {/* giant wordmark */}
        <RevealText
          lines={['FROST & SIP']}
          mode="chars"
          stagger={0.055}
          className="text-center font-display text-[clamp(3.4rem,13vw,13rem)] leading-[0.9] text-cream"
        />
        <p className="mt-4 text-center font-serif text-[clamp(1.1rem,2.4vw,1.8rem)] italic text-gold-soft">
          Chill. Sip. Enjoy.
        </p>

        <div className="ft-line mt-16 h-px w-full origin-center bg-line" />

        {/* columns */}
        <div className="grid grid-cols-2 gap-10 py-14 sm:grid-cols-4">
          <div className="ft-col col-span-2 sm:col-span-1">
            <p className="mb-5 font-sans text-[9px] uppercase tracking-[0.4em] text-gold">Frost &amp; Sip</p>
            <p className="max-w-xs font-sans text-sm font-light leading-relaxed text-fog">
              Small-batch lemonade, slow-churned shakes and espresso on ice — poured cinematic, served cold.
            </p>
          </div>
          {COLS.map((col) => (
            <div key={col.title} className="ft-col">
              <p className="mb-5 font-sans text-[9px] uppercase tracking-[0.4em] text-gold">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <button
                      type="button"
                      data-cursor="click"
                      onClick={() => href !== '#hero' && scrollToId(href)}
                      className="group relative font-sans text-sm font-light text-fog transition-colors duration-300 hover:text-cream"
                    >
                      {label}
                      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="ft-bottom flex flex-col items-center justify-between gap-3 border-t border-line/60 py-6 sm:flex-row">
          <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-fog/60">
            © 2026 Frost &amp; Sip — All rights chilled
          </p>
          <p className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold-soft">
            Made by Toufiquzzamn MD
          </p>
        </div>
      </div>
    </footer>
  )
}
