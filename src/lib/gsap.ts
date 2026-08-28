import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.defaults({ ease: 'power3.out', duration: 1 })

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

/** Re-measure every non-pinned trigger individually.
 *  Workaround: with Lenis driving scroll, a global ScrollTrigger.refresh()
 *  can leave triggers after the pinned showcase with stale positions
 *  (a re-entrant scroll event during the pin's revert interrupts the
 *  global pass), which would make all scrubbed sections jump to their
 *  end state. Refreshing only the non-pinned triggers against the intact,
 *  padded layout re-measures them correctly. */
export function refreshAllTriggers(): void {
  ScrollTrigger.getAll().forEach((t) => {
    if (!t.pin) t.refresh()
  })
}

if (import.meta.env.DEV) {
  ;(window as unknown as { refreshAllTriggers?: typeof refreshAllTriggers }).refreshAllTriggers =
    refreshAllTriggers
}

/* Every global refresh (mount, resize, ScrollTrigger's own debounced
 * scroll-end soft refresh) is followed by a per-trigger pass so the
 * pinned layout never leaves sibling triggers mis-measured. The
 * per-trigger pass does not dispatch 'refresh', so this cannot loop. */
let refreshPassTimer = 0
ScrollTrigger.addEventListener('refresh', () => {
  window.clearTimeout(refreshPassTimer)
  refreshPassTimer = window.setTimeout(refreshAllTriggers, 90)
})

export { gsap, ScrollTrigger }
