import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from '../lib/gsap'
import { useCart } from '../context/CartContext'
import { getProduct } from '../data/products'
import { DrinkArt } from './art/DrinkArt'

interface Toast {
  name: string
  stamp: number
}

/** Renders the flying product image (ADD TO CART → cart icon),
 *  bounces the cart badge on landing and pops the confirmation toast. */
export function FlyToCart() {
  const { flying } = useCart()
  const [toast, setToast] = useState<Toast | null>(null)
  const flyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!flying) return
    const el = flyRef.current
    if (!el) return

    const fromX = flying.from.left + flying.from.width / 2
    const fromY = flying.from.top + flying.from.height / 2
    const toX = flying.to.left + flying.to.width / 2
    const toY = flying.to.top + flying.to.height / 2

    gsap.set(el, { x: fromX, y: fromY, scale: 1, rotation: 0, opacity: 1 })
    gsap.to(el, {
      x: toX,
      y: toY,
      scale: 0.08,
      rotation: 24,
      opacity: 0.35,
      duration: 0.92,
      ease: 'power2.inOut',
      onComplete: () => {
        // cart badge bounce
        gsap.fromTo(
          '.cart-badge',
          { scale: 1.6, color: '#c9a24b' },
          { scale: 1, color: '#c9a24b', duration: 0.7, ease: 'elastic.out(1, 0.4)' },
        )
        setToast({ name: getProduct(flying.productId).shortName, stamp: Date.now() })
      },
    })

    return () => {
      gsap.killTweensOf(el)
    }
  }, [flying])

  /* auto-dismiss the toast */
  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2400)
    return () => window.clearTimeout(t)
  }, [toast])

  return (
    <>
      {/* the flying clone */}
      {flying && (
        <div
          ref={flyRef}
          className="pointer-events-none fixed left-0 top-0 z-[75] w-[130px] will-change-transform"
          style={{ opacity: 0 }}
          aria-hidden
        >
          <DrinkArt id={flying.productId} animated={false} glow={false} className="w-full" />
        </div>
      )}

      {/* confirmation toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.stamp}
            initial={{ opacity: 0, y: 28, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ type: 'spring', damping: 22, stiffness: 320 }}
            className="fixed bottom-6 right-6 z-[76] flex items-center gap-3 rounded-full border border-gold/50 bg-coal/90 py-3 pl-4 pr-6 backdrop-blur-xl"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold font-sans text-[11px] font-bold text-ink">✓</span>
            <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-cream">
              Added to cart — <span className="text-gold-soft">{toast.name}</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
