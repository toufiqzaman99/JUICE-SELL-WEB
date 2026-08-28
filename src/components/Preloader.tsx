import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'

interface PreloaderProps {
  onReveal: () => void
  onDone: () => void
}

const WORD_STYLE =
  'inline-block will-change-transform font-display text-[clamp(3.2rem,11vw,8.5rem)] leading-none text-cream'

/** The cinematic cold-open: FROST ↓ & ↓ SIP — letters appear one by one,
 *  the wordmark flies to the top-left, twin curtains split to reveal the hero. */
export function Preloader({ onReveal, onDone }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const wordRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const word = wordRef.current
    if (!root || !word) return

    const chars = word.querySelectorAll<HTMLElement>('.pre-char')
    const tag = root.querySelector<HTMLElement>('.pre-tag')
    const line = root.querySelector<HTMLElement>('.pre-line')

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    // 1 — letters rise one by one
    tl.fromTo(
      chars,
      { yPercent: 140, opacity: 0, rotateX: -55 },
      { yPercent: 0, opacity: 1, rotateX: 0, duration: 1.05, stagger: 0.09, ease: 'power3.out' },
    )
      // 2 — the ampersand pops in gold
      .fromTo(
        '.pre-amp',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.55, ease: 'back.out(2.2)' },
        '-=0.55',
      )
      // 3 — tagline + hairline
      .fromTo(tag, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, '-=0.3')
      .fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power3.inOut' }, '-=0.5')
      // 4 — glow breathing under the wordmark
      .to(glowRef.current, { opacity: 0.5, duration: 1.2, ease: 'sine.inOut' }, 0.3)
      // 5 — hold, then the wordmark flies to the top-left logo slot
      .to({}, { duration: 0.45 })
      .add(() => onReveal())
      .to(
        word,
        {
          x: () => -(word.getBoundingClientRect().left - 34),
          y: () => -(word.getBoundingClientRect().top - 18),
          scale: () => 148 / word.getBoundingClientRect().width,
          transformOrigin: 'left top',
          duration: 1.0,
          ease: 'power3.inOut',
        },
        '+=0.1',
      )
      // 6 — curtains split while the wordmark dissolves into the logo
      .to(
        leftRef.current,
        { xPercent: -101, duration: 1.15, ease: 'power4.inOut' },
        '<+=0.1',
      )
      .to(rightRef.current, { xPercent: 101, duration: 1.15, ease: 'power4.inOut' }, '<')
      .to(word, { opacity: 0, duration: 0.4 }, '<+=0.45')
      .to(glowRef.current, { opacity: 0, duration: 0.8 }, '<')
      .add(() => onDone())

    return () => {
      tl.kill()
    }
  }, [onReveal, onDone])

  return (
    <div ref={rootRef} className="fixed inset-0 z-[80]" aria-hidden>
      {/* split curtains */}
      <div ref={leftRef} className="absolute inset-y-0 left-0 w-1/2 bg-ink will-change-transform" />
      <div ref={rightRef} className="absolute inset-y-0 right-0 w-1/2 bg-ink will-change-transform" />

      {/* ambient glow */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(201,162,75,0.35) 0%, transparent 65%)' }}
      />

      {/* wordmark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div ref={wordRef} className="flex items-end gap-[2vw]" style={{ perspective: '800px' }}>
          <div className="flex">
            {'FROST'.split('').map((c, i) => (
              <span key={i} className={`pre-char ${WORD_STYLE}`}>
                {c}
              </span>
            ))}
          </div>
          <span className="pre-amp font-serif text-[clamp(2.4rem,7vw,5.5rem)] italic leading-none text-gold">
            &amp;
          </span>
          <div className="flex">
            {'SIP'.split('').map((c, i) => (
              <span key={i} className={`pre-char ${WORD_STYLE}`}>
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="pre-tag mt-8 font-sans text-[10px] uppercase tracking-[0.5em] text-fog">
          Chill · Sip · Enjoy
        </div>
        <div className="pre-line mt-5 h-px w-40 origin-center scale-x-0 bg-gold/60" />
      </div>
    </div>
  )
}
