# Landing page implementation plan

Companion to [LANDING-SPEC.md](./LANDING-SPEC.md). Each step is one commit.

## 1. Cloud shader

- Installed with `npx shadcn@latest add @aceternity/cloud-shader-hero-demo`, which wrote `src/components/ui/cloud-shader.tsx` and `src/components/cloud-shader-hero-demo.tsx`.
- `src/lib/utils.ts` `cn` now uses `clsx` + `tailwind-merge` as the source expects, so `className="absolute inset-0"` overrides the component's default `relative`.
- The demo file is kept unchanged as the reference and rendered at `/examples/cloud-shader` (not linked from navigation) to compare against the source.

## 2. Hero (`src/site/landing/hero.tsx`)

- Replace the ASCII field hero with `<CloudShader className="absolute inset-0" />` inside a `relative min-h-[50rem] overflow-hidden` section, as in the source.
- Centered column `max-w-4xl`: pill, H1 (`SplitText` words, blur only), sub, buttons, small line, using the source's white and glass button styles.
- `PreviewWindow` (new, `src/site/landing/preview-window.tsx`): the source's glass frame (`rounded-2xl border-white/30 bg-white/20 p-2 backdrop-blur-md md:rounded-[2rem] md:p-3`) around a paper or soft black panel with window chrome, a live headline that rotates through blur reveal, scramble text, gooey text and wave text, and the JSX line for the current effect.
- Entrance choreography via a small `Rise` wrapper (motion, delay prop, emphasized ease).

## 3. Remove the stage

- Delete `src/site/landing/stage.tsx` and its use in the page.
- Delete the ASCII field, grain and `landing-effects` dependency if nothing else uses them, plus `public/landing/ascii-*` and `scripts/landing-images.py`. The footer field goes with them.

## 4. Sections

- `stack-strip.tsx`: pills with versions imported from `package.json`.
- `effects-grid.tsx`: nine cards, each `{ name, href, blurb, node }`, live previews with `MotionConfig reducedMotion="user"`.
- `install.tsx`: keep, adjust spacing to the new rhythm.
- `features.tsx`: three tiles replacing `details.tsx`.
- FAQ: reuse `src/site/faq.tsx` with a `limit` prop and a link to /docs/faq.
- `reveal.tsx`: one shared on-view reveal used by every section heading and card group.

## 5. Page and checks

- `src/app/(marketing)/page.tsx`: Hero, StackStrip, EffectsGrid, Install, Features, FAQ.
- Verify at 1440 and 390, light and dark: typecheck, lint, 363 tests, production build, axe in both themes, Lighthouse mobile.
- Push to `main` with author WebDevAmey and no co-author trailers.

## Differences from the Aceternity source (reported to Maze)

- The source's own navbar is not used; the site header already provides navigation.
- The dashboard screenshot is replaced by a live preview window built from Textlab components, so no image loads from `assets.aceternity.com`.
- Copy and links are Textlab's instead of the fictional "Altitude" bank.
