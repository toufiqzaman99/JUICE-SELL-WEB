import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'

type RevealMode = 'chars' | 'words' | 'clip' | 'scale' | 'slide' | 'rotate'

interface RevealTextProps {
  /** lines of text; strings are split into chars/words, nodes render as-is */
  lines: ReactNode[]
  mode?: RevealMode
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  /** trigger point for the reveal */
  start?: string
  once?: boolean
}

/** Section-heading reveal with distinct motion vocabularies:
 *  chars — letters rise one by one (y + rotateX)
 *  words — words rise with stagger
 *  clip  — mask sweep (clip-path reveal)
 *  scale — scale from 0.88 with blur-ish fade
 *  slide — horizontal drift in
 *  rotate— slight rotation settle */
export function RevealText({
  lines,
  mode = 'chars',
  className = '',
  lineClassName = '',
  delay = 0,
  stagger = 0.045,
  start = 'top 82%',
  once = true,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const targets = root.querySelectorAll<HTMLElement>('[data-reveal]')
    if (targets.length === 0) return

    let from: gsap.TweenVars = {}
    switch (mode) {
      case 'chars':
        from = { yPercent: 130, opacity: 0, rotateX: -45, transformOrigin: '50% 100%' }
        break
      case 'words':
        from = { y: 70, opacity: 0 }
        break
      case 'clip':
        from = { yPercent: 120, opacity: 1 }
        break
      case 'scale':
        from = { scale: 0.86, opacity: 0 }
        break
      case 'slide':
        from = { x: -90, opacity: 0 }
        break
      case 'rotate':
        from = { rotation: -7, scale: 0.92, opacity: 0, transformOrigin: '0% 80%' }
        break
    }

    const tween = gsap.fromTo(targets, from, {
      yPercent: 0,
      y: 0,
      x: 0,
      scale: 1,
      rotation: 0,
      opacity: 1,
      rotateX: 0,
      stagger,
      delay,
      duration: mode === 'clip' ? 1.15 : 1,
      ease: mode === 'clip' ? 'power4.inOut' : 'power3.out',
    })

    const trigger = ScrollTrigger.create({
      trigger: root,
      start,
      once,
      animation: tween,
    })

    return () => {
      trigger.kill()
      tween.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, delay, stagger, start, once])

  return (
    <div ref={ref} className={className} aria-label={lines.filter((l) => typeof l === 'string').join(' ')}>
      {lines.map((line, li) => {
        const key = `line-${li}`
        if (typeof line === 'string') {
          const pieces =
            mode === 'chars'
              ? line.split('')
              : mode === 'words'
                ? line.split(' ')
                : [line]
          return (
            <div key={key} className={`overflow-hidden ${lineClassName}`} aria-hidden>
              <span className="inline-block">
                {pieces.map((p, pi) => {
                  const isSpace = p === ' '
                  return (
                    <span
                      key={`${key}-${pi}`}
                      data-reveal
                      className="inline-block will-change-transform"
                      style={{ perspective: '600px' }}
                    >
                      {isSpace ? ' ' : p}
                    </span>
                  )
                })}
              </span>
            </div>
          )
        }
        // ReactNode line: wrapped for clip reveal
        return (
          <div key={key} className={`overflow-hidden ${lineClassName}`}>
            <span data-reveal className="inline-block will-change-transform">
              {line}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/** Text helper: serif italic accent span (used inside heading lines) */
export function Accent({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-serif italic text-gold-soft ${className}`} style={{ fontWeight: 500 }}>
      {children}
    </span>
  )
}
