import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { getProduct } from '../data/products'
import { DrinkArt } from './art/DrinkArt'
import { scrollToId } from '../lib/lenis'

type Phase = 'cart' | 'processing' | 'success'

/** Right-side cart drawer: spring slide-in, blurred backdrop,
 *  staggered line items, animated quantities — and a cinematic
 *  checkout: authorizing → payment successful → continue. */
export function CartDrawer() {
  const { lines, count, total, isOpen, closeCart, changeQty, clearCart } = useCart()
  const [phase, setPhase] = useState<Phase>('cart')
  const [orderId, setOrderId] = useState('')

  /* reset the flow after the drawer has slid away */
  useEffect(() => {
    if (!isOpen) {
      const t = window.setTimeout(() => setPhase('cart'), 450)
      return () => window.clearTimeout(t)
    }
  }, [isOpen])

  const checkout = () => {
    if (phase !== 'cart' || lines.length === 0) return
    setPhase('processing')
    window.setTimeout(() => {
      setOrderId(`FROST-${Math.floor(1000 + Math.random() * 9000)}`)
      setPhase('success')
    }, 2100)
  }

  const continueShopping = () => {
    clearCart()
    closeCart()
    window.setTimeout(() => scrollToId('#showcase'), 500)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* backdrop */}
          <motion.button
            type="button"
            aria-label="Close cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={closeCart}
            className="fixed inset-0 z-[55] bg-ink/60 backdrop-blur-sm"
          />

          {/* drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260, mass: 0.9 }}
            className="fixed right-0 top-0 z-[56] flex h-full w-[min(94vw,460px)] flex-col border-l border-line bg-coal"
            aria-label="Shopping cart"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-line px-7 py-6">
              <h2 className="font-display text-xl tracking-[0.12em] text-cream">
                {phase === 'success' ? (
                  'ORDER CONFIRMED'
                ) : (
                  <>
                    YOUR ORDER{' '}
                    <span className="ml-1 font-sans text-[10px] tracking-[0.2em] text-gold">({count})</span>
                  </>
                )}
              </h2>
              <button
                type="button"
                data-cursor="click"
                onClick={closeCart}
                aria-label="Close"
                className="group flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors duration-300 hover:border-gold"
              >
                <span className="relative block h-3.5 w-3.5">
                  <span className="absolute left-0 top-1.5 h-px w-full rotate-45 bg-cream transition-transform duration-500 group-hover:rotate-[135deg]" />
                  <span className="absolute left-0 top-1.5 h-px w-full -rotate-45 bg-cream transition-transform duration-500 group-hover:rotate-[45deg]" />
                </span>
              </button>
            </div>

            <AnimatePresence mode="wait">
              {phase === 'success' ? (
                /* ── payment successful ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="no-scrollbar flex flex-1 flex-col items-center overflow-y-auto px-7 py-10 text-center"
                >
                  {/* burst + check */}
                  <div className="relative mb-8 mt-4 flex h-32 w-32 items-center justify-center">
                    <div className="absolute inset-0 animate-spin-slow">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <span
                          key={i}
                          className="absolute left-1/2 top-1/2 h-[38%] w-px origin-top"
                          style={{
                            background: 'linear-gradient(to bottom, rgba(201,162,75,0.55), transparent)',
                            transform: `translateX(-50%) rotate(${i * 45}deg)`,
                          }}
                        />
                      ))}
                    </div>
                    <div
                      className="absolute inset-4 rounded-full opacity-20 blur-xl"
                      style={{ background: 'radial-gradient(circle, rgba(201,162,75,0.8) 0%, transparent 70%)' }}
                    />
                    <motion.svg viewBox="0 0 64 64" className="relative h-20 w-20">
                      <motion.circle
                        cx="32"
                        cy="32"
                        r="28"
                        fill="none"
                        stroke="#c9a24b"
                        strokeWidth="2.5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                      />
                      <motion.path
                        d="M20 33 L28 41 L44 25"
                        fill="none"
                        stroke="#e6cd8a"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.45, delay: 0.55, ease: 'easeOut' }}
                      />
                    </motion.svg>
                  </div>

                  <motion.p
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="font-display text-2xl tracking-[0.1em] text-cream"
                  >
                    PAYMENT SUCCESSFUL
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-2 font-sans text-[10px] uppercase tracking-[0.34em] text-gold-soft"
                  >
                    Order {orderId} · Paid ${total.toFixed(2)}
                  </motion.p>

                  {/* receipt */}
                  <motion.ul
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="mt-8 w-full max-w-xs space-y-2.5 border-t border-line pt-6"
                  >
                    {lines.map((line) => {
                      const p = getProduct(line.productId)
                      return (
                        <li key={line.productId} className="flex items-baseline justify-between">
                          <span className="font-sans text-[11px] uppercase tracking-[0.14em] text-fog">
                            {p.shortName} <span className="text-fog/60">× {line.qty}</span>
                          </span>
                          <span className="font-sans text-[11px] text-cream">
                            ${(p.price * line.qty).toFixed(2)}
                          </span>
                        </li>
                      )
                    })}
                    <li className="flex items-baseline justify-between border-t border-line/60 pt-3">
                      <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-fog">Total</span>
                      <span className="font-display text-lg text-gold">${total.toFixed(2)}</span>
                    </li>
                  </motion.ul>

                  <motion.button
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.05, duration: 0.5 }}
                    type="button"
                    data-cursor="click"
                    onClick={continueShopping}
                    className="group relative mt-10 w-full overflow-hidden rounded-full border border-gold bg-gold/10 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-cream transition-colors duration-500 hover:text-ink"
                  >
                    <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0.05,0.36,1)] group-hover:scale-x-100" />
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      Continue
                      <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                    </span>
                  </motion.button>
                </motion.div>
              ) : (
                /* ── cart ── */
                <motion.div
                  key="cart"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35 }}
                  className="flex min-h-0 flex-1 flex-col"
                >
                  <div className="no-scrollbar flex-1 overflow-y-auto px-7 py-6">
                    {lines.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                        <p className="font-serif text-2xl italic text-fog">Your glass is empty…</p>
                        <button
                          type="button"
                          data-cursor="click"
                          onClick={() => {
                            closeCart()
                            window.setTimeout(() => scrollToId('#showcase'), 350)
                          }}
                          className="rounded-full border border-gold/60 px-7 py-3 font-sans text-[10px] uppercase tracking-[0.28em] text-cream transition-colors duration-300 hover:bg-gold hover:text-ink"
                        >
                          Choose your sip
                        </button>
                      </div>
                    ) : (
                      <ul className="space-y-7">
                        <AnimatePresence initial={false}>
                          {lines.map((line, i) => {
                            const p = getProduct(line.productId)
                            return (
                              <motion.li
                                key={line.productId}
                                layout
                                initial={{ opacity: 0, y: 26 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: 60, transition: { duration: 0.35 } }}
                                transition={{ delay: i * 0.07, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                                className="flex items-center gap-4"
                              >
                                <div className="h-24 w-16 shrink-0">
                                  <DrinkArt id={line.productId} animated={false} glow={false} className="h-full w-full" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate font-display text-[13px] tracking-[0.1em] text-cream">{p.shortName}</p>
                                  <p className="mt-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-fog">
                                    ${p.price.toFixed(2)}
                                  </p>
                                  <div className="mt-2.5 flex items-center gap-3">
                                    <button
                                      type="button"
                                      data-cursor="click"
                                      aria-label="Decrease quantity"
                                      onClick={() => changeQty(line.productId, -1)}
                                      className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-sm text-fog transition-all duration-200 hover:border-gold hover:text-cream active:scale-90"
                                    >
                                      −
                                    </button>
                                    <motion.span
                                      key={line.qty}
                                      initial={{ scale: 1.45, color: '#c9a24b' }}
                                      animate={{ scale: 1, color: '#f5f1e8' }}
                                      transition={{ type: 'spring', damping: 18, stiffness: 320 }}
                                      className="w-5 text-center font-sans text-sm"
                                    >
                                      {line.qty}
                                    </motion.span>
                                    <button
                                      type="button"
                                      data-cursor="click"
                                      aria-label="Increase quantity"
                                      onClick={() => changeQty(line.productId, 1)}
                                      className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-sm text-fog transition-all duration-200 hover:border-gold hover:text-cream active:scale-90"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <span className="font-display text-base text-gold">
                                  ${(p.price * line.qty).toFixed(2)}
                                </span>
                              </motion.li>
                            )
                          })}
                        </AnimatePresence>
                      </ul>
                    )}
                  </div>

                  {/* footer */}
                  {lines.length > 0 && (
                    <div className="border-t border-line px-7 py-6">
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-fog">Subtotal</span>
                        <motion.span
                          key={total.toFixed(2)}
                          initial={{ scale: 1.15, color: '#c9a24b' }}
                          animate={{ scale: 1, color: '#f5f1e8' }}
                          className="font-display text-2xl"
                        >
                          ${total.toFixed(2)}
                        </motion.span>
                      </div>
                      <p className="mb-5 font-sans text-[10px] text-fog/60">Chilled and delivered · taxes included</p>

                      {/* checkout — idle / authorizing */}
                      <button
                        type="button"
                        data-cursor="click"
                        disabled={phase === 'processing'}
                        onClick={checkout}
                        className={`group relative w-full overflow-hidden rounded-full py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.3em] transition-colors duration-500 ${
                          phase === 'processing'
                            ? 'cursor-wait border border-gold/40 bg-gold/5 text-gold-soft'
                            : 'border border-gold bg-gold/10 text-cream hover:text-ink'
                        }`}
                      >
                        {phase === 'processing' ? (
                          <span className="relative z-10 flex items-center justify-center gap-3">
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border border-gold-soft/30 border-t-gold-soft" />
                            Authorizing payment…
                          </span>
                        ) : (
                          <>
                            <span className="absolute inset-0 origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.65,0.05,0.36,1)] group-hover:scale-x-100" />
                            <span className="relative z-10 flex items-center justify-center gap-3">
                              Checkout
                              <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">→</span>
                            </span>
                          </>
                        )}
                      </button>
                      {phase === 'processing' && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-3 text-center font-sans text-[9px] uppercase tracking-[0.3em] text-fog/60"
                        >
                          Card ···· 4242 · demo payment
                        </motion.p>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
