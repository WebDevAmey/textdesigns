# Motion audit

Step 1 of the motion pass: `find-animation-opportunities`, run across every component and docs page on 2026-10-18. This file is the record; step 2 (`animate`) implements the opportunities, step 3 (`improve-animations`, then `review-animations`) fixes what already moves.

Skill names used, from `.claude/skills`: `find-animation-opportunities`, `animate`, `improve-animations`, `review-animations`, `emil-design-eng`. They match the brief one to one, so nothing was substituted.

## Recon

- **Stack:** Next.js 16, React 19, `motion` 12, plain CSS keyframes and transitions, a little canvas and WebGL.
- **Tokens:** `registry/textlab/lib/motion-tokens.ts` (`ease.enter`, `ease.exit`, `ease.standard`, `ease.emphasized`, durations, springs, staggers) mirrored as `--tl-ease-*` and `--tl-duration-*` in `tokens.css`. Suggestions below extend these.
- **Personality:** the docs UI is crisp and quiet (Arc-like). The components are the show: expressive, but each with a calm preset.
- **Frequency map:**
  - 100+ a day: none. There are no keyboard shortcuts or palettes.
  - Tens a day: sidebar and header navigation, hovering component cards, focus rings.
  - Occasional: Preview/Code tabs, variant switches, copy buttons, package-manager switch, code file switch, mobile Browse menu, theme toggle.
  - Rare: first visit to the components index, the homepage hero.

Two different bars apply. Docs chrome is UI: under 300 ms, ease-out, transform and opacity. The text effects are explanatory and marketing motion, which may run longer, but they still need correct curves, GPU-friendly properties, hover gating and reduced-motion branches.

## Part 1: Opportunities (missing motion)

| # | Location | Today | Purpose | Frequency | Suggested motion |
| --- | --- | --- | --- | --- | --- |
| 1 | `src/site/docs-shell.tsx` (mobile Browse `<details>`) | The section list snaps open and closed. | Preventing a jarring change | Occasional | Panel enters with `opacity: 0; transform: translateY(-4px)` to settled via `@starting-style`, `transition: opacity 200ms var(--tl-ease-enter), transform 200ms var(--tl-ease-enter)`. Reduced motion keeps opacity only. |
| 2 | `src/site/install-command.tsx` | The command text swaps instantly when you pick npm, pnpm, yarn or bun. | State indication | Occasional | Key the command on the manager and crossfade: enter `opacity: 0, filter: blur(2px)` to clear in 150 ms with `ease.enter`, old text leaves in 100 ms. The blur masks the double exposure. |
| 3 | `src/site/code-view.tsx` | Switching files replaces the code instantly. | State indication | Occasional | Same 150 ms crossfade as #2, so the two read as one system. |
| 4 | `src/app/components/page.tsx` | 70 cards appear at once on the index. | Preventing a jarring change, delight on a rarely seen page | Rare | Stagger the first six cards of each group: `opacity: 0; transform: translateY(8px)` to settled, `300ms var(--tl-ease-enter)`, 40 ms apart. CSS animation, so it never blocks clicks. Reduced motion: no stagger. |
| 5 | `src/site/preview.tsx` (replay button) | Pressing replay restarts the demo but the icon only rotates while held. | Feedback | Occasional | Spin the icon one turn on each click with a 400 ms `ease.enter` transform keyed on the run count, so the press visibly "rewinds". Reduced motion: no spin. |
| 6 | Homepage (built in the design pass) | No in-view title showcase yet. | Explanation | Rare | The "In-view title, four variants" demo: one title, a Blur / Words / Lines / Wipe switch, replayed on each switch. |

Every row stays inside the UI budget except #4 and #6, which are rare, explanatory surfaces.

## Part 2: Weak or incorrect motion found in passing (handed to step 3)

These are not missing motion; they are motion that runs but is off. Recorded here so step 3 has evidence.

| Location | Finding |
| --- | --- |
| `lib/reveal.tsx`, most motion components | Motion `x` / `y` / `scale` shorthands drive entrances that run while the page is still loading. Prefer full `transform` strings so motion can hand them to the compositor. |
| `lib/motion-tokens.ts`, `tokens.css` | `ease.exit` is a symmetric in-out curve used for exits; exits want ease-out. `ease.standard` is weaker than the strong in-out curve, and `ease.enter` nearly duplicates the strong ease-out. Consolidate on `cubic-bezier(0.23, 1, 0.32, 1)` and `cubic-bezier(0.77, 0, 0.175, 1)`. |
| `char-reveal` scale variant | Starts from `scale: 0`. Start from a small, visible scale instead. |
| `flip-roll`, `hover-scramble`, `chromatic-text`, `extrude-text` | Hover motion is not gated: taps on touch screens leave flip-roll stuck flipped and extrude stuck raised. |
| `tilt-text`, `chromatic-text` | A CSS variable on the parent drives child transforms, which recalculates styles for every child each frame. Write `transform` on the element directly. |
| `focus-pull`, `blur-reveal` playground controls | Blur can be set to 30 px. Keep transition blur under 20 px. |

## Part 3: Rejected candidates

- **Sidebar and header navigation highlight** (`src/site/sidebar.tsx`, `src/site/nav-link.tsx`). Rejected: tens of times a day, and navigation should feel instant.
- **Theme toggle colour crossfade** (`src/site/theme-toggle.tsx`). Rejected: fading every surface at once double-exposes the whole page. The swap stays instant on purpose, and only the icon turns.
- **Page-to-page content fade.** Rejected: route changes happen tens of times a session, and a fade makes every navigation feel slower.
- **Props table rows and code lines entering.** Rejected: this is data people are reading; moving it hinders.
- **Keyboard focus ring transition.** Rejected: keyboard-initiated, and the ring must appear the instant focus moves.
- **Split-flap's ease-in top leaf** and **kinetic-beat's slam**. Kept as is: both are physical effects (a flap falling under gravity, an impact), not UI responses, so ease-in is the correct curve there.

## Part 4: Verdict

The docs UI is already close: tabs, the segmented control, the copy button and the theme icon all move with purpose and inside budget. The real gaps are three instant swaps (Browse menu, install command, code file switch) and one flat first impression (the components index). The highest-leverage change is not an opportunity at all but the step 3 work in the shared reveal engine: moving its transforms to full transform strings improves dozens of components at once. Next: `animate` on rows 1 to 5, with row 6 landing in the design pass.

## Step 3: improve-animations and the review-animations gate

`improve-animations` ran across the whole codebase (recon, then the eight categories in its playbook). Per the brief, every finding was fixed rather than written up as a plan. `review-animations` then ran as a strict gate; its second pass raised five more findings, which were fixed, and the third pass came back clean.

### Findings and fixes

| # | Severity | Category | Location | Finding | Fix |
| --- | --- | --- | --- | --- | --- |
| 1 | HIGH | Performance | `lib/reveal.tsx` and 10 reveal components | Entrances ran on motion's `x`/`y`/`scale` shorthands while the page loads. | The engine converts every pose to a full transform string with a matching rest string (`poses()`), so motion can hand them to the compositor. |
| 2 | HIGH | Easing | `lib/motion-tokens.ts`, `tokens.css`, 9 files with hand-typed curves | Exits used a symmetric in-out curve; the in-out and ease-out tokens were weak near-duplicates of the strong curves. | `enter` and `exit` are now `cubic-bezier(0.23, 1, 0.32, 1)`, `standard` is `cubic-bezier(0.77, 0, 0.175, 1)`. Every hand-typed curve now reads a token, and Tailwind's default transition curve points at `--tl-ease-enter`. |
| 3 | HIGH | Accessibility | `lib/use-trigger.ts`, `flip-roll`, `hover-scramble`, `chromatic-text`, `extrude-text` | Hover motion fired on touch taps and stuck on. | Hover ignores touch pointers in JS; CSS hover sits behind `@media (hover: hover) and (pointer: fine)`. Keyboard focus still triggers. |
| 4 | HIGH | Purpose and frequency | `src/site/tabs.tsx`, `src/site/segmented.tsx` | Arrow-key switching animated the indicator and panel. | Keyboard changes are instant; pointer changes keep the 250 ms slide and 180 ms crossfade. |
| 5 | MEDIUM | Performance | `tilt-text`, `chromatic-text` | A CSS variable on the parent drove child transforms. | Transforms are written straight onto the elements that move; both loops now idle when still. |
| 6 | MEDIUM | Performance | `caret-morph`, `read-along` | The caret and highlight animated `width` and `height`. | A fixed-width box is moved and stretched with one transform (`translate() scaleX()`), gliding in 200 ms. |
| 7 | MEDIUM | Performance | `slice-reveal`, `word-rotator`, `echo-text`, `matrix-decode`, `ember-text`, `word-sequence`, `strike-through`, `price-ticker`, `gooey-text`, `signature` | Remaining entrances used shorthands or animated SVG geometry. | Full transform strings everywhere; the signature mask slides with `translateX` instead of growing its width. |
| 8 | MEDIUM | Physicality | `char-reveal` | The scale variant started from `scale(0)`. | Starts from `scale(0.35)` with opacity 0. |
| 9 | MEDIUM | Accessibility | Docs UI | Docs chrome ignored the OS reduced-motion setting. | `MotionConfig reducedMotion="user"` wraps the site; previews opt out so each component's own `reducedMotion` prop stays in charge. |
| 10 | LOW | Physicality | Press feedback across the docs | Press scales ranged from 0.94 to 0.99. | Buttons 0.97, small icon buttons 0.95, cards 0.98, all on the strong ease-out. |
| 11 | LOW | Easing | `lib/motion-tokens.ts`, `kinetic-beat` | Spring bounce reached 0.35 and 0.55. | Capped at 0.3. |
| 12 | LOW | Performance | `blur-reveal`, `focus-pull` controls | Playground blur went to 30 px. | Capped at 20 px. |
| 13 | LOW | Duration | `src/site/preview.tsx` | The replay spin took 400 ms. | 300 ms. |

### Deliberate exceptions (documented, not findings)

- **Ease-in on physical motion.** The split-flap top leaf falls under gravity, kinetic-beat's slam accelerates into an impact, and matrix glyphs fall. These are physics, not UI responses; each has a comment at the curve.
- **Text entrances longer than 300 ms.** Reveals are explanatory, marketing motion where reading is the point. Opacity always leads, so text is readable well before the transform settles.
- **Reduced motion shows the final state.** For text, the readable final state is the gentle version: SPEC section 7 records this decision, and fades would flash for users whose server render was already forced visible by the stylesheet.
- **Layout animations stay on motion's shorthands** in `text-morph` and `rolling-number` (`layout="position"` needs motion's own transform control), and in kinetic-beat's springs (springs need numeric values).
- **`marker-highlight` animates `background-size`.** It is paint-only, and it is the one property that highlights each wrapped line separately; `clip-path` would sweep the whole block at once.

### Gate result

Third `review-animations` pass: no `transition: all`, no `scale(0)`, no unexplained ease-in, no keyboard-triggered animation, no animated layout properties, no parent variables driving child transforms, hover gated, reduced motion handled in every component and in the docs UI. **Clean.**
