/* FROST & SIP — programmatic animation verification.
 * Computes real scroll targets from section rects, asserts every
 * motion system's DOM state, cart flow, and mobile behaviour. */
import { chromium, devices } from 'playwright'

const BASE = 'http://localhost:5173/'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const results = []
const check = (name, ok, detail = '') =>
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)

async function main() {
  let browser
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true })
  } catch {
    browser = await chromium.launch({ headless: true })
  }
  const errors = []
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  page.on('console', (m) => m.type() === 'error' && errors.push(`[console] ${m.text()}`))
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))

  const s = (fn, arg) => page.evaluate(fn, arg)
  const scrollTo = async (y) => {
    await s((t) => window.scrollTo(0, t), y)
    await sleep(1000)
  }
  /* y position that puts a sticky section's pinned view at its middle */
  const stickyMid = (sel, extra) =>
    s(({ sel, extra }) => {
      const el = document.querySelector(sel)
      const r = el.getBoundingClientRect()
      return window.scrollY + r.top + extra
    }, { sel, extra })

  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  await sleep(8000)

  /* ── intro ── */
  check('preloader removed', await s(() => !document.querySelector('.pre-char')))
  check(
    'hero text visible',
    await s(() => parseFloat(getComputedStyle(document.querySelector('#hero .font-display')).opacity) > 0.9),
  )
  check(
    'no horizontal overflow (desktop)',
    await s(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    await s(() => `${document.documentElement.scrollWidth} vs ${window.innerWidth}`),
  )

  /* ── hero scroll-out ── */
  await scrollTo(620)
  check(
    'hero typography lifts & fades on scroll',
    await s(() => {
      const el = document.querySelector('#hero .will-change-transform')
      const m = new DOMMatrixReadOnly(getComputedStyle(el).transform)
      return m.f < -40 || parseFloat(getComputedStyle(el).opacity) < 0.9
    }),
  )

  /* ── showcase ── */
  const scMid = await stickyMid('#showcase', 3000)
  await scrollTo(scMid)
  check(
    'showcase track travels horizontally',
    await s(() => {
      const t = document.querySelector('.showcase-track')
      const m = new DOMMatrixReadOnly(getComputedStyle(t).transform)
      return m.e < -800
    }),
    await s(() => getComputedStyle(document.querySelector('.showcase-track')).transform),
  )
  check(
    'slide art entered (scale≈1, upright)',
    await s(() => {
      const art = document.querySelector('[data-cursor="explore"]')
      const m = new DOMMatrixReadOnly(getComputedStyle(art).transform)
      return m.a > 0.9 && m.a < 1.1 && Math.abs(m.b) < 0.15
    }),
  )

  /* ── lemonade ── */
  check(
    'feature triggers have real scrub range',
    await s(() => {
      const ST = window.gsap.core.globals().ScrollTrigger
      const t = ST.getAll().find((x) => x.trigger?.id === 'lemonade' && x.animation)
      return !!t && t.end - t.start > 500
    }),
    await s(() => {
      const ST = window.gsap.core.globals().ScrollTrigger
      const t = ST.getAll().find((x) => x.trigger?.id === 'lemonade' && x.animation)
      return t ? `range=${Math.round(t.end - t.start)}px` : 'no trigger'
    }),
  )
  const lmMid = await stickyMid('#lemonade', 900)
  await scrollTo(lmMid)
  check(
    'lemonade scrubbing at intermediate progress',
    await s(() => {
      const ST = window.gsap.core.globals().ScrollTrigger
      const t = ST.getAll().find((x) => x.trigger?.id === 'lemonade' && x.animation)
      return t && t.progress > 0.3 && t.progress < 0.7
    }),
    await s(() => {
      const ST = window.gsap.core.globals().ScrollTrigger
      const t = ST.getAll().find((x) => x.trigger?.id === 'lemonade' && x.animation)
      return t ? `progress=${t.progress.toFixed(2)}` : 'no trigger'
    }),
  )
  await scrollTo(lmMid - 300) // progress ≈ 0.33 — mid-sequence
  check(
    'slices staged: slice1 arrived, slice3 mid-flight',
    await s(() => {
      const op1 = parseFloat(getComputedStyle(document.querySelector('.lm-slice1')).opacity)
      const op3 = parseFloat(getComputedStyle(document.querySelector('.lm-slice3')).opacity)
      return op1 > 0.8 && op3 > 0.1 && op3 < 0.8
    }),
    await s(() => `slice1=${parseFloat(getComputedStyle(document.querySelector('.lm-slice1')).opacity).toFixed(2)} slice3=${parseFloat(getComputedStyle(document.querySelector('.lm-slice3')).opacity).toFixed(2)}`),
  )
  await scrollTo(lmMid)
  check(
    'camera pushing in',
    await s(() => new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.lm-camera')).transform).a > 1.02),
  )

  /* ── frame health while scrolling ── */
  {
    const before = await s(() => {
      const el = document.querySelector('#lemonade').getBoundingClientRect()
      return window.scrollY + el.top
    })
    await s((t) => window.scrollTo(0, t), before)
    await sleep(800)
    const fps = await s(
      () =>
        new Promise((resolve) => {
          let frames = 0
          let t0 = performance.now()
          let raf
          const tick = (t) => {
            frames++
            if (t - t0 >= 2000) {
              cancelAnimationFrame(raf)
              resolve(Math.round((frames / (t - t0)) * 100000) / 100)
            } else raf = requestAnimationFrame(tick)
          }
          raf = requestAnimationFrame(tick)
        }),
    )
    check('sustains ≥30fps while pinned', fps >= 30, `${fps}fps (headless, software raster)`)

    // restore a sane scroll position for the next block
    await scrollTo(await stickyMid('#lemonade', 900))
  }

  /* ── strawberry ── */
  await scrollTo(await stickyMid('#strawberry', 900))
  check(
    'strawberries converging',
    await s(() => parseFloat(getComputedStyle(document.querySelector('.sb-b1')).opacity) > 0.3),
  )
  check(
    'strawberry glass grown',
    await s(() => new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.sb-glass')).transform).a > 0.85),
  )

  /* ── chocolate ── */
  await scrollTo(await stickyMid('#chocolate', 900))
  check(
    'chocolate shards sweeping',
    await s(() => parseFloat(getComputedStyle(document.querySelector('.ch-shard1')).opacity) > 0.3),
  )

  /* ── coffee ── */
  await scrollTo(await stickyMid('#coffee', 900))
  check(
    'coffee panels gliding',
    await s(() => new DOMMatrixReadOnly(getComputedStyle(document.querySelector('.cf-track')).transform).e < -200),
    await s(() => getComputedStyle(document.querySelector('.cf-track')).transform),
  )

  /* ── ingredients ── */
  await scrollTo(await stickyMid('#ingredients', 720))
  check(
    'ingredients in orbit',
    await s(() => parseFloat(getComputedStyle(document.querySelector('.ie-lemon')).opacity) > 0.3),
  )
  await scrollTo((await stickyMid('#ingredients', 720)) + 1200)
  check(
    'drink reassembled at end',
    await s(() => parseFloat(getComputedStyle(document.querySelector('.ie-drink')).opacity) > 0.9),
  )

  /* ── CTA ── */
  await scrollTo((await stickyMid('#cta', 300)) + 300)
  check(
    'CTA backdrop zooming',
    await s(() => new DOMMatrixReadOnly(getComputedStyle(document.querySelector('#cta .will-change-transform')).transform).a > 1.02),
  )

  /* ── footer ── */
  await s(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await sleep(1200)
  check(
    'footer columns revealed',
    await s(() => parseFloat(getComputedStyle(document.querySelector('.ft-col')).opacity) > 0.9),
  )

  /* ── cart flow ── */
  await scrollTo(await stickyMid('#lemonade', 900))
  const orderBtn = page.getByText('Order now').first()
  if (await orderBtn.count()) {
    await orderBtn.click()
    await sleep(400)
    check('fly-to-cart clone launched', await s(() => !!document.querySelector('.z-\\[75\\]')))
    await sleep(1200)
    check('cart badge bumped to 1', await s(() => document.querySelector('.cart-badge')?.textContent === '1'))
    check('added-to-cart toast shown', await s(() => !!document.querySelector('.z-\\[76\\]')))
    await page.getByLabel(/Open cart/).click()
    await sleep(1000)
    check('cart drawer open', await s(() => !!document.querySelector('aside[aria-label="Shopping cart"]')))
    const plus = page.getByLabel('Increase quantity').first()
    await plus.click()
    await sleep(400)
    check(
      'quantity incremented',
      await s(() => document.querySelector('aside ul li')?.textContent?.includes('2')),
    )

    /* ── checkout → payment successful → continue ── */
    await page.getByRole('button', { name: /Checkout/ }).first().click()
    await sleep(500)
    check(
      'checkout enters authorizing state',
      await s(() => document.querySelector('aside')?.textContent?.includes('Authorizing')),
    )
    await sleep(2300)
    check(
      'payment successful screen shown',
      await s(() => document.querySelector('aside')?.textContent?.includes('PAYMENT SUCCESSFUL')),
    )
    check(
      'order id generated',
      await s(() => /FROST-\d{4}/.test(document.querySelector('aside')?.textContent ?? '')),
    )
    await page.getByRole('button', { name: /Continue/ }).first().click()
    await sleep(1100)
    check('cart cleared after continue', await s(() => document.querySelector('.cart-badge')?.textContent === '0'))
    check('drawer closed after continue', await s(() => !document.querySelector('aside[aria-label="Shopping cart"]')))
  } else {
    check('cart flow', false, 'Order now button not found')
  }

  /* ── mobile (real device emulation: touch, no fine pointer) ── */
  const ctx = await browser.newContext({ ...devices['iPhone 13'] })
  const mob = await ctx.newPage()
  mob.on('console', (m) => m.type() === 'error' && errors.push(`[mobile console] ${m.text()}`))
  mob.on('pageerror', (e) => errors.push(`[mobile pageerror] ${e.message}`))
  await mob.goto(BASE, { waitUntil: 'domcontentloaded' })
  await sleep(8000)
  check(
    'no horizontal overflow (mobile)',
    await mob.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1),
    await mob.evaluate(() => `${document.documentElement.scrollWidth} vs ${window.innerWidth}`),
  )
  check(
    'no custom cursor on mobile',
    await mob.evaluate(() => !document.body.classList.contains('custom-cursor')),
  )
  await mob.getByLabel('Toggle menu').click()
  await sleep(900)
  check('mobile menu opens', await mob.evaluate(() => !!document.querySelector('.z-\\[60\\]')))
  await mob.locator('div.z-\\[60\\] button').first().click()
  await sleep(2500)
  check(
    'menu link scrolls to showcase',
    await mob.evaluate(() => {
      const r = document.querySelector('#showcase').getBoundingClientRect()
      return r.top > -120 && r.top < 300
    }),
    await mob.evaluate(() => Math.round(document.querySelector('#showcase').getBoundingClientRect().top)),
  )
  const lmMidMob = await mob.evaluate(() => {
    const el = document.querySelector('#lemonade')
    const r = el.getBoundingClientRect()
    return window.scrollY + r.top + 900
  })
  await mob.evaluate((t) => window.scrollTo(0, t), lmMidMob)
  await sleep(1000)
  check(
    'mobile sticky feature works',
    await mob.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.lm-slice1')).opacity) > 0.2),
  )

  console.log(results.join('\n'))
  console.log(errors.length ? `\nERRORS (${errors.length}):\n${errors.join('\n')}` : '\nNO CONSOLE ERRORS')
  await browser.close()
}

main().catch((e) => {
  console.error('VERIFY FAILED:', e)
  process.exit(1)
})
