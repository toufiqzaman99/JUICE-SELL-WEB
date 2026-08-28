import { useEffect, useState } from 'react'
import { gsap, prefersReducedMotion, refreshAllTriggers } from './lib/gsap'

// dev-only debug handle for the verification harness
if (import.meta.env.DEV) {
  ;(window as unknown as { gsap?: typeof gsap }).gsap = gsap
}
import { initLenis, startScroll, stopScroll } from './lib/lenis'
import { CartProvider } from './context/CartContext'
import { CustomCursor } from './components/CustomCursor'
import { ScrollRail } from './components/ScrollRail'
import { Navbar } from './components/Navbar'
import { Preloader } from './components/Preloader'
import { Hero, type IntroStage } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Showcase } from './components/Showcase'
import {
  ChocolateSection,
  CoffeeSection,
  LemonadeSection,
  StrawberrySection,
} from './components/FeatureSections'
import { IngredientsExplosion } from './components/IngredientsExplosion'
import { FinalCTA } from './components/FinalCTA'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { FlyToCart } from './components/FlyToCart'

export default function App() {
  const [stage, setStage] = useState<IntroStage>(() =>
    prefersReducedMotion() ? 'done' : 'loading',
  )

  /* boot smooth scrolling; lock the page during the cold-open */
  useEffect(() => {
    initLenis()
    if (prefersReducedMotion()) return
    stopScroll()
    return () => {
      startScroll()
    }
  }, [])

  /* release the scroll once the curtains have opened; re-measure all
     triggers individually so pinned sections measure from the final layout */
  useEffect(() => {
    if (stage === 'done') {
      startScroll()
      const t = window.setTimeout(() => {
        refreshAllTriggers()
      }, 160)
      return () => window.clearTimeout(t)
    }
  }, [stage])

  return (
    <CartProvider>
      <div className="grain relative min-h-screen bg-ink text-cream">
        <CustomCursor />
        <ScrollRail visible={stage === 'done'} />
        <Navbar visible={stage === 'done'} />

        {stage !== 'done' && (
          <Preloader
            onReveal={() => setStage('revealing')}
            onDone={() => setStage('done')}
          />
        )}

        <main>
          <Hero stage={stage} />
          <Marquee />
          <Showcase />
          <LemonadeSection />
          <StrawberrySection />
          <ChocolateSection />
          <CoffeeSection />
          <Marquee className="border-t-0" />
          <IngredientsExplosion />
          <FinalCTA />
        </main>

        <Footer />
        <CartDrawer />
        <FlyToCart />
      </div>
    </CartProvider>
  )
}
