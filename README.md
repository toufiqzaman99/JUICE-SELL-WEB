# FROST &amp; SIP 🧊

A cinematic, Awwwards-style motion website for a premium beverage brand.
Built as a "luxury commercial you scroll through" — every act has its own
choreographed motion sequence.

## Stack

- **React 19 + TypeScript + Vite 8**
- **Tailwind CSS v4** (CSS-first `@theme` tokens)
- **GSAP + ScrollTrigger** — all major scroll choreography (scrubbed timelines, pinned horizontal gallery, parallax)
- **Lenis** — smooth scrolling, synced with GSAP's ticker
- **Framer Motion** — cart drawer, toasts, mobile menu (springs)
- All product photography is hand-drawn **vector SVG art** (shared studio lighting, no stock assets, works offline)

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
```

## The show

| # | Scene | Motion |
|---|-------|--------|
| 00 | Preloader | FROST ↓ & ↓ SIP letter stagger → wordmark flies to the logo slot → twin curtains split |
| 01 | Hero | Giant SIP THE MOMENT, floating lemonade, 4-depth mouse parallax, scrubbed layer-separation scroll-out |
| 02 | Choose Your Sip | Pinned horizontal gallery of 6 drinks — per-slide scale/rotate/x-slide entrances, 3D tilt + ingredient particles on hover |
| 03–06 | Lemonade / Strawberry / Chocolate / Coffee | Pinned "camera rooms" — slices fly in, ice falls, berries converge, cream rises, shards sweep, milk splashes, a 3-pour horizontal coffee track |
| 07 | What's Inside? | 7 ingredients explode into orbit and collapse back into the finished glass |
| 08 | CTA / Footer | Slow-zoom backdrop, floating products, magnetic ORDER YOUR DRINK, rising footer type |

Plus: custom cursor (EXPLORE/CLICK states, desktop only), fly-to-cart animation with badge bounce and toast, spring cart drawer, 01–06 scroll rail, film grain, condensed/italic/mono typographic system.

## Dev tooling

- `node verify.mjs` — headless verification suite (29 checks): every motion system's DOM state at computed scroll positions, cart flow, mobile behavior, horizontal overflow, console errors, frame rate. Uses your system Edge — no browser download.
- `node inspect.mjs` — captures screenshot stills of each scene into `.shots/`.

## Motion rules followed

- GPU-friendly transforms only (`transform`/`opacity`) — 60fps verified even pinned
- `prefers-reduced-motion` respected (intro skipped, ambient loops off)
- Mobile: smooth scroll + product transitions + reveals kept; custom cursor, magnetism and 3D tilt disabled on touch
- No horizontal overflow at any breakpoint

## This is the final project