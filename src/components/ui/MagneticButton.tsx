import { useEffect, useRef, type ReactNode, type MouseEvent } from 'react'
import { gsap } from '../../lib/gsap'
import { useFinePointer } from '../../hooks/useMedia'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  onClick?: () => void
  ariaLabel?: string
}

/** Magnetic CTA: the button leans toward the cursor and springs back
 *  on leave. Inner content drifts slightly more for depth. */
export function MagneticButton({
  children,
  className = '',
  strength = 0.35,
  onClick,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  const fine = useFinePointer()

  useEffect(() => {
    const el = ref.current
    if (!el || !fine) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })
    const ixTo = gsap.quickTo(innerRef.current, 'x', { duration: 0.4, ease: 'power3.out' })
    const iyTo = gsap.quickTo(innerRef.current, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (e: globalThis.MouseEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      xTo(dx * strength)
      yTo(dy * strength)
      ixTo(dx * strength * 0.35)
      iyTo(dy * strength * 0.35)
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' })
      gsap.to(innerRef.current, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [fine, strength])

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // subtle press feedback before action
    gsap.fromTo(
      ref.current,
      { scale: 0.96 },
      { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' },
    )
    onClick?.()
    e.preventDefault()
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      data-cursor="click"
      className={`group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-gold/60 bg-transparent px-8 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.28em] text-cream transition-[border-color,scale] duration-500 hover:scale-[1.045] hover:border-gold active:scale-[0.97] ${className}`}
    >
      {/* fill sweep */}
      <span className="absolute inset-0 -z-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0.05,0.36,1)] group-hover:scale-x-100" />
      <span
        ref={innerRef}
        className="relative z-10 flex items-center gap-3 transition-colors duration-500 group-hover:text-ink"
      >
        {children}
      </span>
    </button>
  )
}
