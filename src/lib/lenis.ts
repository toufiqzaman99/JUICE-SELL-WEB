import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenis: Lenis | null = null

/** Create the Lenis instance and wire it into GSAP's ticker so
 *  ScrollTrigger and Lenis share one rAF loop (the canonical setup). */
export function initLenis(): Lenis | null {
  if (lenis || typeof window === 'undefined') return lenis

  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  })

  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000)
  })
  gsap.ticker.lagSmoothing(0)

  return lenis
}

export function getLenis(): Lenis | null {
  return lenis
}

export function scrollToId(id: string): void {
  const target = document.querySelector(id)
  if (!target) return
  if (lenis) {
    lenis.scrollTo(target as HTMLElement, { duration: 1.7, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else {
    ;(target as HTMLElement).scrollIntoView({ behavior: 'smooth' })
  }
}

export function stopScroll(): void {
  lenis?.stop()
  document.documentElement.style.overflow = 'hidden'
}

export function startScroll(): void {
  lenis?.start()
  document.documentElement.style.overflow = ''
}
