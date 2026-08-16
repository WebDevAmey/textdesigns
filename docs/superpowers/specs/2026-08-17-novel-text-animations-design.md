# Four New Novel Text Animations

## Context

`textlab` is a gallery of text-animation components. `src/lib/animations.ts` catalogs every entry (`name`, `slug`, `category`, `description`, `component`, optional `code`/`infinite`/`preview`); `src/lib/animations-docs.tsx` maps each `slug` to its source file for the docs viewer. Every catalog component renders with a uniform `{ text: string }`-compatible prop so it works unchanged inside `AnimationCard` (grid preview, auto-replays every 6s via `key={iteration}` remount) and the per-slug detail page.

Categories: `reveal` (9 entries), `hover` (7), `loop` (8), `scroll` (2 — noticeably thin). Recent additions (`MoltenMetalText`, `ResonantChainText`, `MagneticFluxText`) set the current house style: a small physics simulation (springs, coupled particles, noise fields) paired with an unusual rendering trick, run off `gsap.ticker`, with a short doc-comment explaining the specific novel combination.

Goal: add four new components, each combining techniques not paired together elsewhere in the catalog, one per category (filling out the thin `scroll` category as a side effect).

## Shared conventions

- `"use client"`; a typed props interface with defaults; single default export; file in `src/components/text/`.
- Reduced motion: hover/loop components use the existing `usePrefersReducedMotion()` hook and render static text; scroll/reveal components use the inline `window.matchMedia("(prefers-reduced-motion: reduce)").matches` early-return already used in `ScrollSkewText`/`PathEntranceText`.
- Reuse `src/lib/text-physics/{geometry,physics,noise}.ts` (`sampleTextParticles`, `clamp`/`lerp`/`distance`/`angleDelta`, `createNoiseField`) instead of re-deriving equivalents.
- All tickers/`ScrollTrigger`s/listeners are torn down and `split.revert()` called in the `useGSAP`/`useEffect` cleanup, matching every existing component.

## Scope

### 1. Letterpress Ink — scroll — `src/components/text/LetterpressText.tsx`

Each character starts as a ghost outline (`color: transparent`, faint `-webkit-text-stroke`). A `SplitType` char split feeds a GSAP timeline bound to `ScrollTrigger` with `scrub: true` (trigger = the component's own container, matching `ScrollReveal`'s pattern of triggering off itself rather than a page-level element). The timeline staggers each character through: a quick squash/overshoot (simulated stamp impact), a blur-to-sharp settle (`filter: blur()` animated toward 0, simulating ink bleed), and a fill from transparent to `inkColor`. Because the timeline is scrubbed to scroll position rather than played once, scrolling back up visibly lifts the ink back off — direction-aware for free, no extra state needed.

Props: `text`, `inkColor = "currentColor"`, `ghostOpacity = 0.28`, `impactStrength = 1`.

Reduced motion: render fully-stamped static text, skip `ScrollTrigger` registration entirely.

Catalog: name **Letterpress**, slug `letterpress`, category `scroll`.

### 2. Tuning Fork — loop — `src/components/text/TuningForkText.tsx`

Characters sit on a continuous analytic standing wave — `amplitude(x, t) = envelope(t) · sin(k·x − ω·t)` — rather than a spring simulation. `envelope(t)` is a small idle hum most of the time, punctuated every `ringInterval` seconds by an exponentially-decaying "pluck" (fast attack, slow ring-down), like a struck tuning fork. Per character: `translateY` from the wave amplitude at its index position, `font-variation-settings: "wght" ...` scaled by local |amplitude| (Inter, the project's body font loaded via `next/font/google`, is a variable font so `wght` responds), and a `color`/opacity shift tied to local energy — all written with `gsap.set` inside a `gsap.ticker` callback, no DOM measurement required since positions are purely index-driven. A thin `<svg><path>` beneath the text baseline is redrawn every frame from ~40 evenly-spaced samples of the same wave function, reading like a small oscilloscope trace.

Props: `text`, `ringInterval = 4`, `frequency = 1`, `amplitude = 6`.

Reduced motion: static text, ticker never starts, trace SVG omitted.

Catalog: name **Tuning Fork**, slug `tuning-fork`, category `loop`.

### 3. Gravity Lens — hover — `src/components/text/GravityLensText.tsx`

Inverts the catalog's existing repel-style hover effects (`MagneticText`, `DisplacementText`, `MoltenMetalText` all push away from the cursor). Characters within `lensRadius` of the pointer are pulled *inward* toward it, with falloff `(1 - dist/lensRadius)^2`, and magnify slightly as falloff increases (the real visual signature of gravitational lensing is magnification near the lens boundary, not just displacement) — driven per character by `gsap.quickTo` for `x`/`y`/`scale`. A ring element tracks the pointer (its own `gsap.quickTo` pair) and renders a thin chromatic-dispersion fringe — layered, slightly offset red/cyan `box-shadow`s plus a small `hue-rotate` — that fades in on hover and out on pointer-leave, suggesting light bending at the lens edge. On pointer-leave, characters spring back to rest (`gsap.to` back to `x:0,y:0,scale:1`), matching the settle-back behavior of the other hover components.

Props: `text`, `lensRadius = 140`, `strength = 0.5`, `magnify = 0.35`.

Reduced motion: static text, no pointer listeners, no ring.

Catalog: name **Gravity Lens**, slug `gravity-lens`, category `hover`.

### 4. Pressure Write — reveal — `src/components/text/PressureWriteText.tsx`

Extends the SVG `stroke-dashoffset` draw-on technique `StrokeDrawText` already uses for a whole line, but per character, with variable stroke width simulating pen pressure. Each glyph is its own `<text>` element (x-offsets computed the same way `StrokeDrawText` measures its bounding box, via `getComputedTextLength`/`getSubStringLength`) whose `strokeDashoffset` animates 0→length to draw the outline; the same tween's `onUpdate` also writes `strokeWidth` against a per-character-seeded pressure curve (thinner at stroke start/end, fuller mid-stroke, ±15% per-char randomization for a human, non-uniform feel) — an approximation of velocity-based pressure, not true glyph-outline pressure (out of scope without an outline-extraction dependency). A second, blurred duplicate stroke layer fades in behind each character as it draws and dissipates shortly after, simulating ink bleed settling. Word boundaries get a short timeline gap (pen lift) before the next word's first character starts.

Props: `text`, `fontSize = 120`, `inkColor = "currentColor"`, `pressureVariance = 0.15`.

Reduced motion: static filled text (no stroke animation).

Catalog: name **Pressure Write**, slug `pressure-write`, category `reveal`.

## Integration

For each of the four:
1. Add the component file under `src/components/text/`.
2. Import it in `src/lib/animations.ts` and append a catalog entry (`name`, `slug`, `category`, `description`, `component`, `code` sample) in its category's section, following the existing format used by entries below "Collapse Text".
3. Add its `slug → filename` mapping to `SOURCE_FILES` in `src/lib/animations-docs.tsx`.

No changes needed to `AnimationCard`, `AnimationDocs`, `DocsSidebar`, `DocsNav`, or the `/animations` page — all four expose the standard `{ text }`-compatible prop.

## Out of scope

- No changes to any of the 44 existing catalog entries.
- No new npm dependencies — everything is built on `gsap` (+ `ScrollTrigger`, already used by `ScrollReveal`/`ScrollSkewText`), `@gsap/react`, `split-type`, and `simplex-noise`, all already installed.
- Pressure Write approximates pen pressure via a seeded curve, not real glyph-outline/velocity extraction.

## Verification

- `npm run dev`; visit `/animations` and confirm all four cards render and auto-replay (or respond to scroll/hover, as appropriate) without console errors.
- Visit each `/animations/<slug>` detail page and confirm the doc view renders correctly with visible source.
- Toggle OS-level reduced-motion and confirm each falls back to static text.
- `npm run lint` clean; `tsc --noEmit` (or `next build`) clean.
