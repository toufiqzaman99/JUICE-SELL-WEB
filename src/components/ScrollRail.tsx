import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { scrollToId } from '../lib/lenis'

const STOPS = [
  { n: '01', id: '#hero', label: 'SIP THE MOMENT' },
  { n: '02', id: '#showcase', label: 'CHOOSE YOUR SIP' },
  { n: '03', id: '#lemonade', label: 'PURE LEMON' },
  { n: '04', id: '#strawberry', label: 'STRAWBERRY DREAM' },
  { n: '05', id: '#chocolate', label: 'CHOCOLATE' },
  { n: '06', id: '#coffee', label: 'COLD COFFEE' },
]

/** Thin right-edge progress rail: a growing line + 01–06 chapter
 *  markers that light up as their sections become active. */
export function ScrollRail({ visible }: { visible: boolean }) {
  const [active, setActive] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef(0)
  activeRef.current = active

  useEffect(() => {
    if (!visible) return
    const triggers = STOPS.map((stop, i) =>
      ScrollTrigger.create({
        trigger: stop.id,
        start: 'top 45%',
        end: 'bottom 45%',
        onToggle: (self) => {
          if (self.isActive) setActive(i)
        },
      }),
    )

    const progress = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        if (lineRef.current) lineRef.current.style.transform = `scaleY(${self.progress})`
      },
    })

    // refresh after fonts/images settle so measurements are right
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => {
      window.clearTimeout(t)
      triggers.forEach((tr) => tr.kill())
      progress.kill()
    }
  }, [visible])

  useEffect(() => {
    if (!visible) return
    gsap.to(rootRef.current, {
      opacity: 1,
      x: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2,
    })
  }, [visible])

  return (
    <div
      ref={rootRef}
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 translate-x-6 flex-col items-end gap-5 opacity-0 lg:flex"
      aria-hidden
    >
      {STOPS.map((stop, i) => (
        <button
          key={stop.n}
          type="button"
          tabIndex={-1}
          onClick={() => scrollToId(stop.id)}
          className="group flex items-center gap-3"
        >
          <span
            className={`font-sans text-[9px] tracking-[0.2em] transition-all duration-500 ${
              i === active ? 'text-gold' : 'text-fog/40 group-hover:text-fog'
            }`}
          >
            {stop.n}
          </span>
          <span
            className={`block rounded-full transition-all duration-700 ${
              i === active ? 'h-6 w-[2px] bg-gold' : 'h-2 w-px bg-fog/30'
            }`}
          />
        </button>
      ))}
      {/* progress line */}
      <div className="relative mt-2 h-24 w-[2px] overflow-hidden rounded-full bg-line">
        <div
          ref={lineRef}
          className="absolute inset-0 origin-top scale-y-0 bg-gold/80"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>
    </div>
  )
}
