# React Bits Effect Swaps & New GSAP Effects

## Context

`textlab` is a gallery of text-animation components (`src/lib/animations.ts` catalogs them, `AnimationCard` renders each with a uniform `{ text: string }` prop). Two catalog entries currently have hand-rolled implementations that duplicate effects available as official `@react-bits` registry components:

- **Rotate** (`RotateText.tsx`) — a GSAP char-rotate-in-place reveal. Separately, the react-bits word-cycling `RotatingText` component is already installed (`src/components/RotatingText.jsx/css/d.ts`) and wrapped by `RotatingTextCard.tsx`, cataloged as a second, unrelated entry, **Rotating Word**.
- **Variable Text** (`VariableText.tsx`) — a hand-rolled cursor-proximity `font-variation-settings` effect, functionally the same effect the official `@react-bits/VariableProximity-JS-CSS` component provides.

Goal: replace both hand-rolled implementations with their official react-bits counterparts, and eliminate the resulting duplication in the catalog.

## Scope

### 1. RotateText

- Run `pnpm dlx shadcn@latest add @react-bits/RotatingText-JS-CSS` to refresh `src/components/RotatingText.jsx/.css/.d.ts` to the current upstream version.
- Rewrite `src/components/text/RotateText.tsx` to render `RotatingText` (from `@/components/RotatingText`), reusing the split pattern currently in `RotatingTextCard.tsx`: split the incoming `text` prop on whitespace, first word as a static prefix, remaining word(s) as the cycling list (falling back to cycling the whole string when there's only one word). Keeps the `{ text: string }` prop contract `AnimationCard` requires — no changes needed there.
- Delete `src/components/text/RotatingTextCard.tsx` (logic now lives in `RotateText.tsx`).
- In `src/lib/animations.ts`: remove the **Rotating Word** entry and its `RotatingTextCard` import; update the **Rotate** entry's `description` to reflect the new cycling behavior and add a `code` example (matching the format used by entries below "Collapse Text"). Keep the `name`/`slug` (`"Rotate"` / `"rotate"`) unchanged.

### 2. VariableText

- Run `pnpm dlx shadcn@latest add @react-bits/VariableProximity-JS-CSS` to install the component into `src/components/`.
- Rewrite `src/components/text/VariableText.tsx` to render the installed component instead of the current rAF/`font-variation-settings` implementation, preserving the existing `{ text: string }` export shape so the **Variable Text** catalog entry (name, slug, `code` sample, and `AnimationCard` usage) needs no changes beyond what the new component's actual prop names require.
- No catalog duplication exists here (only one "Variable Text" entry), so `animations.ts` only needs updates if the installed component's props differ from the current `radius`/`falloff` etc. used in the existing `code` sample — adjust the `code` string to match if so.

### 3. Five new GSAP-based effects

Five additional catalog entries, chosen to be widely-used GSAP patterns that don't overlap any of the 31 existing entries (checked against each, e.g. dropped an initial "Elastic Bounce" idea since `GravityText.tsx` already ends its fall with `elastic.out(1, 0.4)`). All required plugins (`ScrollTrigger`, `Flip`, `Draggable`, `InertiaPlugin`, `MotionPathPlugin`) are bundled in the already-installed `gsap@3.15.0` — no new dependencies. Each new component follows the codebase's existing convention (`"use client"`, `useGSAP` + `SplitType` for char-level splitting, cleanup via `split.revert()`) and exposes the standard `{ text: string }` prop so it works with `AnimationCard` and other card-style previews unchanged.

| Name | Slug | File | Plugin | Description |
|---|---|---|---|---|
| Scroll Skew | `scroll-skew` | `src/components/text/ScrollSkewText.tsx` | ScrollTrigger | Text skews with scroll velocity and snaps back to level when scrolling stops. |
| Letter Shuffle | `letter-shuffle` | `src/components/text/LetterShuffleText.tsx` | Flip | Characters shuffle from randomized positions into their correct reading order. |
| Kinetic Drag | `kinetic-drag` | `src/components/text/KineticDragText.tsx` | Draggable + InertiaPlugin | Characters can be dragged and flicked with momentum, drifting back into place. |
| Cinematic Zoom | `cinematic-zoom` | `src/components/text/CinematicZoomText.tsx` | core (no plugin) | The whole line zooms in from a distance with a soft blur, like a camera pulling into focus. |
| Path Entrance | `path-entrance` | `src/components/text/PathEntranceText.tsx` | MotionPathPlugin | Characters travel in along a curved motion path before settling into the final straight line. |

Notes on preview behavior: `AnimationCard` replays each animation on a 6s loop by remounting via `key={iteration}` (see `AnimationCard.tsx`), but that remount alone does nothing for effects that wait on real user input — confirmed `MagneticText.tsx`, `LiquidText.tsx`, and `DisplacementText.tsx` (cursor-driven) don't self-demo on mount either; they simply stay idle until a real cursor interacts with the card. Kinetic Drag follows that same established convention (idle until dragged). Scroll Skew doesn't need special-casing: like `ScrollReveal.tsx`, it hooks real `ScrollTrigger` viewport/scroll data, so it animates naturally as the visitor scrolls the `/animations` page.

Each gets appended to `src/lib/animations.ts` with a `code` sample, following the existing format used by entries below "Collapse Text".

## Out of scope

- No other catalog entries touched.
- No visual/behavioral redesign beyond what each installed component provides out of the box.
- Pre-existing uncommitted changes in the repo (`components.json`, `package.json`, `SlotrollText.tsx`, `CurvedText.tsx`, etc.) are left as-is.

## Verification

- `pnpm dev`, visit `/animations`: confirm the **Rotate** card shows word-cycling, **Variable Text** card shows the same cursor-proximity behavior as before.
- No dangling imports/references to `RotatingTextCard` or the old `VariableText` implementation.
- `pnpm lint` / `tsc` clean.
