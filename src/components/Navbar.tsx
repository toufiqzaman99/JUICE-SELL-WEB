import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { gsap } from '../lib/gsap'
import { scrollToId, getLenis } from '../lib/lenis'
import { useCart } from '../context/CartContext'
import { useIsMobile } from '../hooks/useMedia'

const LINKS = [
  { label: 'MENU', id: '#showcase' },
  { label: 'CITRUS', id: '#lemonade' },
  { label: 'CREAM', id: '#strawberry' },
  { label: 'COCOA', id: '#chocolate' },
  { label: 'COFFEE', id: '#coffee' },
]

export function Navbar({ visible }: { visible: boolean }) {
  const { count, cartButtonRef, openCart } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const isMobile = useIsMobile()
  const navRef = useRef<HTMLElement>(null)
  const lastScroll = useRef(0)

  /* intro reveal */
  useEffect(() => {
    if (!visible) return
    gsap.fromTo(
      navRef.current,
      { y: -28, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.15 },
    )
  }, [visible])

  /* compact on scroll + hide on down / show on up */
  useEffect(() => {
    const lenis = getLenis()
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 80)
      setHidden(y > 320 && y > lastScroll.current + 6 && !menuOpen)
      if (y < lastScroll.current - 6) setHidden(false)
      lastScroll.current = y
    }
    if (lenis) {
      lenis.on('scroll', onScroll)
    } else {
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    return () => {
      lenis?.off('scroll', onScroll)
      window.removeEventListener('scroll', onScroll)
    }
  }, [menuOpen])

  /* lock scroll when menu open */
  useEffect(() => {
    getLenis()?.[menuOpen ? 'stop' : 'start']()
    document.documentElement.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [menuOpen])

  const go = (id: string) => {
    setMenuOpen(false)
    // wait for the menu to unlock scrolling
    window.setTimeout(() => scrollToId(id), isMobile ? 420 : 0)
  }

  return (
    <>
      <header
        ref={navRef}
        className={`fixed inset-x-0 top-0 z-50 opacity-0 transition-all duration-700 ${
          hidden ? '-translate-y-full' : 'translate-y-0'
        } ${scrolled && !menuOpen ? 'border-b border-line/60 bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'}`}
      >
        <nav
          className={`mx-auto flex max-w-[1600px] items-center justify-between px-5 transition-all duration-700 sm:px-8 ${
            scrolled ? 'py-3' : 'py-5 sm:py-7'
          }`}
        >
          {/* logo */}
          <button
            type="button"
            data-cursor="click"
            onClick={() => go('#hero')}
            className="font-display text-[19px] tracking-[0.14em] text-cream"
          >
            FROST<span className="mx-1 text-gold">&amp;</span>SIP
          </button>

          {/* desktop links */}
          <ul className="hidden items-center gap-8 lg:flex">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  type="button"
                  data-cursor="click"
                  onClick={() => go(link.id)}
                  className="group relative font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-fog transition-colors duration-300 hover:text-cream"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-500 group-hover:w-full" />
                </button>
              </li>
            ))}
          </ul>

          {/* cart */}
          <button
            ref={cartButtonRef}
            type="button"
            data-cursor="click"
            onClick={openCart}
            aria-label={`Open cart, ${count} items`}
            className="relative flex items-center gap-2 rounded-full border border-line px-4 py-2 font-sans text-[10px] uppercase tracking-[0.24em] text-cream transition-colors duration-300 hover:border-gold"
          >
            CART
            <span className="cart-badge font-sans text-[10px] text-gold">{count}</span>
          </button>

          {/* mobile burger */}
          {isMobile && (
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="fixed right-5 top-4 z-[70] flex h-10 w-10 items-center justify-center rounded-full border border-line bg-ink/60 backdrop-blur"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={`absolute left-0 top-0 h-px w-full bg-cream transition-all duration-500 ${menuOpen ? 'top-1.5 rotate-45' : ''}`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-px w-full bg-cream transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
                />
                <span
                  className={`absolute left-0 top-3 h-px w-full bg-cream transition-all duration-500 ${menuOpen ? 'top-1.5 -rotate-45' : ''}`}
                />
              </span>
            </button>
          )}
        </nav>
      </header>

      {/* fullscreen mobile menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.65, 0.05, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col justify-center bg-ink/95 px-8 backdrop-blur-2xl"
          >
            <ul className="space-y-2">
              {LINKS.map((link, i) => (
                <motion.li
                  key={link.id}
                  initial={{ opacity: 0, y: 44 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    type="button"
                    onClick={() => go(link.id)}
                    className="font-display text-5xl uppercase tracking-wide text-cream transition-colors active:text-gold"
                  >
                    {link.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-12 font-serif text-xl italic text-fog"
            >
              Chill. Sip. Enjoy.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
