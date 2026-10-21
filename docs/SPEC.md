# Textlab spec

Textlab is a library of text effects for React. Every component does one thing to type, installs with the shadcn CLI, and lands in your project as source you own.

This document is the contract for the rebuild. If code and spec disagree, fix one of them in the same change.

## 1. Vision and positioning

- **Text only.** No buttons, cards or dashboards. Every item animates, shapes or reacts with letters, words, lines or numbers.
- **Rare, not loud.** The goal is the most inventive text library around, but inventive means precise. Each effect has a reason to exist, a calm preset and a reduced-motion branch. Nothing ships that reads as a gimmick.
- **Arc-level finish.** The architecture, docs and developer experience follow [Arc](https://uiarc.dev): live demos, Preview and Code tabs, registry install, Markdown for agents, an MCP server and motion tokens.
- **Owned source.** Components are copied into the user's project. They are small, readable and editable, with no runtime package to upgrade.

Positioning line: *Text effects your users feel and your agents can install.*

## 2. What Arc does that we mirror

Notes from studying uiarc.dev, its llms.txt, docs/ai, a component Markdown page and a registry item (October 2026).

- [x] Every example is live and interactive, never a recording.
- [x] Each component page has Preview and Code tabs and a copy button.
- [x] Components install with `npx shadcn@latest add <url>` or `@namespace/name` after registering the namespace in `components.json`.
- [x] Shared foundations ship as their own registry items (`arc-foundation`, `arc-motion-tokens`) and every item lists them in `registryDependencies`.
- [x] Each component has a Markdown page at `/components/<name>/markdown` with: when to use, when not to use, installation (CLI and manual), usage, API table, accessibility, motion, responsive, performance, notes for AI and related items.
- [x] `llms.txt` indexes every item with a one-line job description; `llms-full.txt` inlines every Markdown page; `llms-small.txt` is the short form.
- [x] A read-only MCP server with `search_components`, `list_components`, `get_component`, `get_install_command` and `get_skill`.
- [x] An agent skill and short always-on rules for AGENTS.md / CLAUDE.md.
- [x] Motion is built in and every item has a reduced-motion branch.
- [x] Semantic color tokens, typography tokens and motion tokens (ease, duration, spring, stagger).
- [x] Components are named by their job, each with a one-line description in the voice of an action ("Scrub to read any day").
- [x] Homepage "In-view title, four variants" demo with Blur, Words, Lines and Wipe.
- [x] Guides, Changelog, Roadmap and Compare pages.
- [x] SSR care: server-rendered titles that start hidden fall back to visible after a delay if scripts are slow; titles already scrolled past show instantly.
- [x] Copy rules: sentence case, no em dashes, no eyebrow labels, verbs on buttons.

Where we go further than Arc: 60+ text-only components, an interactive playground with export to code, WebGL effects with CSS fallbacks, and a props schema per component that powers the docs table, the playground controls, the Markdown and the MCP server from one source.

## 3. Audit of the existing library

Stack today: Next.js 16.3, React 19.2, TypeScript 5, Tailwind 4, shadcn (base-nova), `motion` 12, plus `framer-motion` 13, `gsap`, `split-type`, `simplex-noise`, `@base-ui/react`, `@tabler/icons-react` and `lucide-react`.

Structure today: a landing page (`src/components/home`), one docs page at `/animations` that switches between effects client-side, ~55 effects in `src/components/text` (many are thin wrappers around `src/components/ui`), metadata split across `src/lib/animations.ts` and `src/lib/animations-docs.tsx`, and a `design-tokens.ts` with spacing and type scales.

| Area | Verdict | Why |
| --- | --- | --- |
| Next.js 16, React 19, TS, Tailwind 4 | Keep | Modern and fits the target. |
| `motion` | Keep | The single animation engine. |
| `framer-motion`, `gsap`, `split-type` | Drop | Two engines for the same job, plus a splitter we can write in 80 lines with resize-aware line detection. Fewer install dependencies per component. |
| `simplex-noise` | Drop | A tiny inline value noise in `text-fx` covers our needs. |
| `@base-ui/react`, `@tabler/icons-react`, extra registries | Drop | Not needed for a text library; `lucide-react` stays for docs UI icons only. |
| `/animations` single-page docs | Rebuild | No per-component URLs, no install commands, no props tables, no Markdown, not crawlable. |
| `animations.ts` + `animations-docs.tsx` | Rebuild | Two sources of truth with drifting metadata. Replaced by one typed catalog. |
| Existing effects | Rebuild | Inconsistent props, no shared tokens, no reduced-motion branch in most, no screen-reader text when split, several duplicates (two shimmer, two circular, two marquee). Good ideas are kept as concepts: Gravity, Particle, Vaporize, Gooey, Molten Metal, Resonant Chain, Pixel Memory, Tide, Constellation Breathe. |
| `design-tokens.ts` | Rebuild | Spacing and type scales are fine but unused by effects; replaced by text and motion tokens the components actually consume. |
| Landing page | Rebuild | Replaced by the signature homepage and playground. |
| `.claude/skills` (Emil Kowalski set) | Keep | Used in the motion pass. |

The old code is removed in one commit once the new site builds, so `main` always builds.

## 4. Architecture

```
registry/
  textlab/
    lib/                 shared text-fx utilities (one registry item: text-fx)
      motion-tokens.ts   ease, duration, spring, stagger
      split.ts           split text into graphemes, words and lines
      use-split-lines.ts resize-aware line detection
      use-trigger.ts     mount, inView, hover, manual triggers
      use-reduced.ts     reducedMotion prop resolved against the OS setting
      use-hydrated.ts    SSR-safe client flag
      use-frame.ts       one rAF loop, paused offscreen and when the tab is hidden
      use-pointer.ts     pointer position relative to an element
      noise.ts, math.ts  value noise, clamp, lerp, springs
      sr-text.tsx        screen-reader text plus aria-hidden visual layer
    tokens.css           text-fx tokens (one registry item: text-fx-tokens)
    <name>/<name>.tsx    one folder per component
  catalog.ts             metadata for every component (single source of truth)
scripts/
  build-registry.ts      writes public/r/*.json, public/llms*.txt, public/components/*.md
src/app/
  page.tsx               homepage with the playground
  components/[slug]/     component page (Preview / Code, install, props, variants)
  components/[slug]/markdown/route.ts   Markdown for agents (also emitted statically)
  docs/                  introduction, installation, ai, tokens, changelog
  guides/, compare/, roadmap/
  api/mcp/route.ts       MCP server over streamable HTTP (JSON-RPC)
mcp/server.mjs           the same tools over stdio for local clients
```

### Registry and CLI install

- Each component is a `registry:ui` item at `/r/<name>.json`, with its source inlined, `dependencies` (usually `motion`) and `registryDependencies: ["<site>/r/text-fx.json"]`.
- `text-fx` (utilities) and `text-fx-tokens` (CSS) are their own items. Files install to `components/textlab/...` and import each other with relative paths, so no `tsconfig` change is needed.
- `/r/registry.json` lists every item, so `components.json` can register `"@textlab": "<site>/r/{name}.json"` and users run `npx shadcn@latest add @textlab/scramble-text`.
- The generator is our own script (no network, deterministic output). A test validates every item against the registry-item shape and checks that every relative import resolves inside the item set.

### Docs site

- Every component page: title, one-line job, live Preview with a replay control, Code tab with highlighted source and copy button, variant switcher, install command tabs (npm, pnpm, yarn, bun) with copy, usage snippet, props table, accessibility, motion and reduced-motion notes, related items, and a link to the Markdown.
- Pages are statically generated from the catalog with `generateStaticParams`.
- Sidebar groups by job: Reveal, Numbers, Typing, Light, Distort, Scroll, Draw, Cursor, Physics, Path, Pixel, Kinetic.

### AI readiness

- `/llms.txt`, `/llms-full.txt`, `/llms-small.txt`.
- `/components/<name>.md` (static) and `/components/<name>/markdown` (route) with the Arc section layout.
- `/r/catalog.json` with metadata for every item.
- MCP server at `/api/mcp` with tools `list_components`, `search_components`, `get_component` (docs, props and source), `get_install_command`, `get_tokens`. A stdio twin in `mcp/server.mjs` reads the generated JSON.
- An agent skill at `/r/skills/textlab/SKILL.md` with the rules from section 8.

## 5. Design tokens

### Type

| Token | Value | Use |
| --- | --- | --- |
| `--font-sans` | Switzer 400/500 (Indian Type Foundry, ITF Free Font License) | UI and most demos |
| `--font-display` | Switzer 600, -0.04em | Headings, demos and the docs identity |
| `--font-flex` | Roboto Flex (wght, wdth, opsz, slnt) | Variable-font effects |
| `--font-mono` | IBM Plex Mono | Code, counters, split-flap |
| `--text-display` | `clamp(2.5rem, 6vw + 1rem, 6rem)` | Hero titles |
| `--text-title` | `clamp(1.75rem, 3vw + 1rem, 3rem)` | Section titles and demo default |
| `--leading-tight` / `--tracking-tight` | `1.05` / `-0.02em` | Display text |

Digits use `font-variant-numeric: tabular-nums` in every number component so values never shift width.

### Color (semantic)

`--background`, `--surface`, `--surface-2`, `--foreground`, `--text-secondary`, `--text-tertiary`, `--border`, `--accent`, `--accent-foreground`, plus effect tokens `--fx-highlight` (marker), `--fx-glow`, `--fx-ink`, `--fx-spectrum-1..4` (gradient, holo, aurora). Light and dark are defined for every token; dark mode is `.dark` on `<html>`. Effects read tokens, never raw colors, unless the user passes a color prop.

### Motion (`motion-tokens.ts`)

| Group | Tokens |
| --- | --- |
| ease | `enter` `[0.23, 1, 0.32, 1]` (strong ease-out, entrances) · `exit` `[0.23, 1, 0.32, 1]` (exits are ease-out too, just shorter) · `standard` `[0.77, 0, 0.175, 1]` (strong ease-in-out, moves on screen) · `emphasized` `[0.16, 1, 0.3, 1]` · `linear` |
| duration (s) | `instant 0.1` · `fast 0.16` · `base 0.24` · `slow 0.4` · `reveal 0.8` · `ambient 2.4` |
| spring | `snappy { visualDuration 0.25, bounce 0 }` (presses) · `smooth { 0.4, 0.1 }` (settle) · `bouncy { 0.5, 0.3 }` (letters landing) · `gentle { 0.8, 0.1 }` (ambient) |
| stagger (s) | `char 0.02` · `word 0.06` · `line 0.1` |

UI chrome (tabs, copy feedback, menus) stays under 300 ms. Text entrances may take longer (`reveal`) because reading is the point, but text must be readable before the motion fully settles: opacity leads, blur clears next, transform settles last.

## 6. Component API conventions

Every component accepts the subset of these that applies, with the same names and meanings everywhere:

| Prop | Type | Meaning |
| --- | --- | --- |
| `text` | `string` | The copy. Numbers use `value`, rotators use `words`. |
| `as` | `ElementType` | Rendered tag. Defaults to `span` (inline) or `h2` for titles. |
| `variant` | string union | 2–4 named looks per component. |
| `trigger` | `"mount" \| "inView" \| "hover" \| "manual" \| "always"` | What starts it. `manual` reads `active`. `always` is ambient. |
| `active` | `boolean` | Drives `trigger="manual"`. |
| `once` | `boolean` | In-view: play once (default `true`). |
| `amount` | `number` | In-view threshold, 0–1 (default `0.45`). |
| `delay` | `number` | Seconds before start. |
| `stagger` | `number` | Seconds between parts. |
| `duration` | `number` | Seconds per part. |
| `ease` | token name or cubic bezier | Defaults per component. |
| `reducedMotion` | `"user" \| "always" \| "never"` | `user` follows the OS setting (default). |
| `className`, `style` | | Merged onto the root. |
| `onComplete` | `() => void` | Fires when a one-shot finishes. |

Rules: sensible defaults so `<ScrambleText text="Hello" />` looks right with no props; no prop that only one component would ever understand gets a generic name; types are exported (`ScrambleTextProps`); `forwardRef` is not needed in React 19, `ref` is a prop.

## 7. Accessibility

- When text is split into spans, the root contains a visually hidden copy of the full text and the animated layer is `aria-hidden`. Screen readers read the sentence once, never letter by letter.
- Headings keep their tag (`as="h2"`), so the page outline is intact.
- `prefers-reduced-motion: reduce` (or `reducedMotion="always"`) shows the final state immediately: no transform, blur, mask or loop. Ambient effects render a still frame. Effects that convey a value (counters, typewriters) jump to the value.
- No layout shift: split parts are inline-block in a container that reserves the final size; number components use tabular figures and a fixed digit width; typewriters reserve the longest string's width when asked (`reserve`).
- Hover effects also respond to focus when the element is focusable, and never hide content behind hover alone. Cursor effects do nothing on touch except where a tap variant is documented.
- Flashing: neon and glitch effects stay under 3 flashes per second and are off under reduced motion.
- Color contrast of the settled state meets WCAG AA against `--background` in both themes.

## 8. Performance

- Animate `transform`, `opacity` and `filter` (blur) where possible. Never animate `width`, `height`, `top` or `left` per frame.
- Measure once, then animate. Reads (getBoundingClientRect) are batched before writes; line detection runs on `ResizeObserver` with one measure per frame.
- `will-change` only while an animation runs, removed after.
- In-view triggers use `IntersectionObserver` (via motion's `useInView`); continuous loops pause when offscreen and when the tab is hidden.
- Pointer effects use one `pointermove` listener per instance, read in the frame loop, not on every event.
- Canvas: device pixel ratio capped at 2, redraw only while something moves.
- WebGL effects load with `next/dynamic`/`import()` only when in view, share one context per instance, and fall back to a CSS version without WebGL or under reduced motion.
- Budget: a component idle on screen costs 0 ms per frame. While active, DOM effects stay under 2 ms per frame and canvas/WebGL effects under 4 ms on a 2020 MacBook Air at 60 Hz. Split effects are meant for up to ~200 parts; longer copy should use a word or line split.

## 9. Agent rules (shipped in the skill)

Prefer an existing Textlab component over writing one. Read the component's Markdown and use only documented props. Keep the screen-reader text and the reduced-motion branch. Use tokens, not raw colors. Sentence case copy, no em dashes, no eyebrow labels.

## 10. Component catalog

Names describe the job. Each entry: name, one-line job, variants. Targets 70 components; every one ships with a live demo, 2–4 variants, a preset, a reduced-motion fallback and a documented API.

### Reveal
1. `blur-reveal`: Words sharpen into focus. Variants: word, char, line.
2. `word-reveal`: Words rise out of a clip. Variants: rise, fall, scale.
3. `line-reveal`: Lines lift in, re-measured on resize. Variants: rise, mask, tilt.
4. `char-reveal`: Letters arrive one at a time. Variants: fade, drop, spin, scale.
5. `wipe-reveal`: A soft edge uncovers the line. Variants: left, right, center, diagonal.
6. `in-view-title`: A section title that reveals as it scrolls in. Variants: blur, words, lines, wipe.
7. `split-text`: Stagger anything by chars, words or lines. Variants: chars, words, lines.
8. `tracking-reveal`: Letter spacing breathes open as it appears. Variants: open, close.
9. `slice-reveal`: The title arrives in offset horizontal slices. Variants: 3, 5 or 8 slices.
10. `focus-pull`: Focus racks from the center letter outward. Variants: center, start, end.

### Numbers
11. `rolling-number`: Each digit rolls to its new value. Variants: up, down, shortest.
12. `odometer`: A mechanical wheel that spins past every digit. Variants: mechanical, smooth.
13. `split-flap`: An airport board that flips to the next word. Variants: dark, light, mini.
14. `price-ticker`: Prices tick with a flash of up or down. Variants: currency, percent, compact.
15. `countdown`: Count down to a moment, second by second. Variants: flip, roll, plain.
16. `stat-reveal`: A stat counts up when it scrolls in. Variants: count, spring, scramble.

### Typing
17. `typewriter`: Types, deletes and retypes with a caret. Variants: bar, block, underscore.
18. `scramble-text`: Letters decode into place. Variants: random, symbols, binary.
19. `hover-scramble`: Scrambles on hover, settles on leave. Variants: sweep, all.
20. `matrix-decode`: Glyph rain resolves into the word. Variants: rain, flicker.
21. `text-morph`: One word turns into the next, letter by letter. Variants: slide, blur, flip.
22. `word-rotator`: Cycles words while the width follows. Variants: slide, blur, flip.
23. `caret-morph`: A caret that glides and reshapes as you select. Variants: bar, block, highlight.

### Light
24. `gradient-text`: Color flows slowly through the letters. Variants: flow, conic, spectrum.
25. `shimmer-text`: A calm light passes across the words. Variants: subtle, bright, rainbow.
26. `neon-text`: A neon sign that hums and flickers on. Variants: steady, flicker, pulse.
27. `aurora-text`: Northern lights drift inside the letters. Variants: polar, ember, mint.
28. `holo-text`: Foil that shifts color as you tilt or move. Variants: foil, holo, chrome.
29. `spotlight-text`: A light follows the cursor and reveals the copy. Variants: reveal, glow, outline.
30. `glass-text`: Frosted letters that refract what is behind them. Variants: frost, clear, tinted.
31. `ember-text`: Letters glow hot and cool down as they land. Variants: ember, steel, ice.

### Distort
32. `gooey-text`: Words melt into each other. Variants: blob, drip.
33. `liquid-text`: Ripples run through the letters under the cursor. Variants: ripple, wave, still-water.
34. `ink-bleed`: Text soaks in like ink on paper. Variants: ink, watercolor, stamp.
35. `chromatic-text`: The color channels split and rejoin. Variants: hover, velocity, pulse.
36. `glitch-text`: A controlled digital glitch on cue. Variants: slice, shift, scan.
37. `heat-haze`: A mirage warps the air above the type. Variants: haze, boil.

### Scroll
38. `scroll-fill`: Words light up as you read down the page. Variants: word, char, line.
39. `scroll-skew`: Type leans with the speed of your scroll. Variants: skew, stretch.
40. `velocity-marquee`: A marquee that speeds up, slows and reverses with scroll. Variants: single, double, outline.
41. `scroll-stretch`: Letters stretch tall as you scroll fast. Variants: vertical, horizontal.
42. `depth-layers`: Stacked outline copies drift apart in depth on scroll. Variants: stack, fan.

### Draw
43. `outline-draw`: The outline draws itself, then fills. Variants: draw-fill, draw-only, fill-sweep.
44. `signature`: A handwritten signature writes itself. Variants: pen, brush.
45. `marker-highlight`: A highlighter swipes behind the words. Variants: marker, underline, box.
46. `underline-draw`: A hand-drawn underline sketches in. Variants: line, wave, scribble.
47. `strike-through`: Cross out a word and write the new one. Variants: line, scribble, replace.
48. `circle-annotate`: A pen circles the word that matters. Variants: circle, box, bracket.

### Cursor
49. `magnetic-text`: Letters lean toward the cursor and spring back. Variants: attract, repel.
50. `variable-proximity`: Weight and width swell near the cursor. Variants: weight, width, slant.
51. `cursor-trail`: A word trails behind the cursor letter by letter. Variants: chain, scatter.
52. `flip-roll`: Hover and the label rolls up into a fresh copy. Variants: up, down, stagger.
53. `tilt-text`: Extruded type tilts toward the pointer. Variants: extrude, float, shadow.
54. `extrude-text`: Depth grows from the letters on hover. Variants: block, long-shadow, stack.

### Physics
55. `letter-drop`: Letters fall, bounce and settle on the floor. Variants: drop, pile, toss.
56. `elastic-text`: Drag a letter and the word stretches like rubber. Variants: band, sling.
57. `jelly-text`: Letters wobble like jelly when touched. Variants: wobble, squash.
58. `wave-text`: A sine wave runs through the line. Variants: wave, bounce, float.
59. `breathing-text`: Weight breathes in and out over time. Variants: breathe, heartbeat.

### Path
60. `path-text`: Text travels along a wave, circle or spiral. Variants: wave, circle, spiral.

### Pixel
61. `ascii-text`: The title rendered in ASCII glyphs that ripple. Variants: classic, blocks, braille.
62. `dither-text`: Ordered dither and halftone dots form the type. Variants: dither, halftone.
63. `pixel-sort`: Rows sort into place like a glitch artwork. Variants: sort, smear.
64. `particle-text`: Particles gather into letters and scatter on touch. Variants: dust, sand, stars.
65. `shader-ripple`: A WebGL ripple bends the title (CSS fallback). Variants: ripple, lens.
66. `noise-dissolve`: The title dissolves through noise (WebGL, CSS fallback). Variants: dissolve, burn.

### Kinetic
67. `kinetic-beat`: Words hit on a beat. Variants: pop, slam, bounce.
68. `word-sequence`: A sentence choreographed word by word. Variants: stage, stack, cut.
69. `read-along`: A selection-like highlight follows the reading. Variants: highlight, karaoke.
70. `echo-text`: Every change leaves fading echoes behind. Variants: trail, ghost.

## 11. Quality gates

- `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` pass on `main` after every push.
- Unit tests cover the shared utilities, the registry output, and render tests per component (renders, has sr-only text, renders final state under reduced motion).
- Axe checks run in the component render tests.
- Motion pass and design pass are tracked in `docs/MOTION-AUDIT.md` and `docs/PLAN.md`.
