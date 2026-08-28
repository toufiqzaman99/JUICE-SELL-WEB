import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'
import { useFinePointer } from '../hooks/useMedia'

type CursorMode = 'default' | 'explore' | 'click'

/** Desktop-only custom cursor: fast dot + lagging ring that morphs into
 *  labelled states ("EXPLORE" over art, "CLICK" over buttons). */
export function CustomCursor() {
  const fine = useFinePointer()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const [mode, setMode] = useState<CursorMode>('default')
  const modeRef = useRef<CursorMode>('default')
  modeRef.current = mode

  useEffect(() => {
    if (!fine) return
    document.body.classList.add('custom-cursor')

    const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.45, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>('[data-cursor]')
      setMode((target?.dataset.cursor as CursorMode) ?? 'default')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    return () => {
      document.body.classList.remove('custom-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [fine])

  useEffect(() => {
    if (!fine) return
    const ring = ringRef.current
    const label = labelRef.current
    if (!ring || !label) return
    const m = modeRef.current
    gsap.to(ring, {
      width: m === 'explore' ? 84 : m === 'click' ? 56 : 34,
      height: m === 'explore' ? 84 : m === 'click' ? 56 : 34,
      backgroundColor: m === 'explore' ? 'rgba(201,162,75,0.92)' : m === 'click' ? 'rgba(245,241,232,0.92)' : 'rgba(245,241,232,0.06)',
      duration: 0.45,
      ease: 'power3.out',
    })
    gsap.to(label, { opacity: m === 'default' ? 0 : 1, scale: m === 'default' ? 0.6 : 1, duration: 0.3 })
    label.textContent = m === 'explore' ? 'EXPLORE' : 'CLICK'
    label.style.color = m === 'explore' ? '#0a0908' : '#0a0908'
  }, [mode, fine])

  if (!fine) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[95]" aria-hidden>
      <div
        ref={ringRef}
        className="absolute left-0 top-0 -ml-[17px] -mt-[17px] flex h-[34px] w-[34px] items-center justify-center rounded-full border border-cream/25 backdrop-blur-[2px]"
      >
        <span
          ref={labelRef}
          className="font-sans text-[9px] font-semibold tracking-[0.18em] opacity-0"
        />
      </div>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-cream"
      />
    </div>
  )
}
