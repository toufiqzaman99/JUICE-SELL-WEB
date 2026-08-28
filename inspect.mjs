/* FROST & SIP — visual inspection script (dev-only tooling).
 * Drives the dev server with Playwright (system Edge), captures
 * console errors and screenshots key states. */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:5173/'
const OUT = new URL('./.shots/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
mkdirSync(OUT, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function run() {
  let browser
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true })
  } catch {
    console.log('msedge unavailable, trying bundled chromium…')
    browser = await chromium.launch({ headless: true })
  }

  const errors = []
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } })
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[console] ${m.text()}`)
  })
  page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`))

  await page.goto(BASE, { waitUntil: 'domcontentloaded' })

  /* intro stages */
  await sleep(1800)
  await page.screenshot({ path: `${OUT}01-preloader-letters.png` })
  await sleep(2600)
  await page.screenshot({ path: `${OUT}02-preloader-full.png` })
  await sleep(4200)
  await page.screenshot({ path: `${OUT}03-hero.png` })

  const stops = [
    ['04-hero-scrollout', 700],
    ['05-showcase-01', 2600],
    ['06-showcase-mid', 5000],
    ['07-showcase-late', 7600],
    ['08-lemonade', 10400],
    ['09-strawberry', 13100],
    ['10-chocolate', 15800],
    ['11-coffee', 18500],
    ['12-ingredients', 21100],
    ['13-cta', 22650],
    ['14-footer', 23650],
  ]
  for (const [name, y] of stops) {
    await page.evaluate((target) => window.scrollTo(0, target), y)
    await sleep(1100)
    await page.screenshot({ path: `${OUT}${name}.png` })
  }

  /* hover on showcase art */
  await page.evaluate(() => window.scrollTo(0, 5000))
  await sleep(1200)
  const art = await page.locator('[data-cursor="explore"]').first()
  if (await art.count()) {
    const box = await art.boundingBox()
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 8 })
      await sleep(900)
      await page.screenshot({ path: `${OUT}15-showcase-hover.png` })
      await page.mouse.move(20, 20)
      await sleep(600)
    }
  }

  /* add to cart + drawer */
  await page.evaluate(() => window.scrollTo(0, 10300))
  await sleep(1200)
  const orderBtn = page.getByText('Order now').first()
  if (await orderBtn.count()) {
    await orderBtn.click()
    await sleep(1300)
    await page.screenshot({ path: `${OUT}16-add-to-cart-toast.png` })
    const cartBtn = page.getByLabel(/Open cart/)
    await cartBtn.click()
    await sleep(1000)
    await page.screenshot({ path: `${OUT}17-cart-drawer.png` })
  }

  /* ── mobile ── */
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 } })
  mob.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[mobile console] ${m.text()}`)
  })
  mob.on('pageerror', (e) => errors.push(`[mobile pageerror] ${e.message}`))
  await mob.goto(BASE, { waitUntil: 'domcontentloaded' })
  await sleep(8200)
  await mob.screenshot({ path: `${OUT}18-mobile-hero.png` })
  await mob.getByLabel('Toggle menu', { exact: true }).click()
  await sleep(1000)
  await mob.screenshot({ path: `${OUT}19-mobile-menu.png` })
  await mob.locator('div.z-\\[60\\] button').first().click()
  await sleep(2200)
  await mob.screenshot({ path: `${OUT}20-mobile-showcase.png` })
  await mob.evaluate(() => window.scrollTo(0, 10300))
  await sleep(1200)
  await mob.screenshot({ path: `${OUT}21-mobile-lemonade.png` })

  console.log('DONE')
  console.log(errors.length ? `ERRORS (${errors.length}):\n${errors.join('\n')}` : 'NO CONSOLE ERRORS')
  await browser.close()
}

run().catch((e) => {
  console.error('INSPECT FAILED:', e.message)
  process.exit(1)
})
