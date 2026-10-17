# Textlab rebuild plan

Phases run in order. Each phase depends on the one before it. Tick items as they land on `main`.

## Phase 0: research and audit

- [x] Study uiarc.dev: homepage, a component page, llms.txt, docs/ai, a component Markdown page, a registry item, changelog
- [x] Audit the current library (stack, structure, components, docs, build)
- [x] Decide keep and drop (SPEC section 3)

Done when: SPEC sections 2 and 3 are written.

## Phase 1: spec and plan

- [x] Write `docs/SPEC.md`
- [x] Write `docs/PLAN.md`
- [x] Set git identity (WebDevAmey, ameytarmale7@gmail.com)
- [ ] Disable Claude attribution in `.claude/settings.json` (waiting on owner approval)
- [ ] Strip the Claude co-author trailers from 6 older commits and force-push (waiting on owner approval)

Done when: both docs are committed and pushed.

## Phase 2: foundations

Depends on phase 1.

- [ ] Trim dependencies (drop gsap, framer-motion, split-type, simplex-noise, base-ui, tabler) once nothing imports them
- [ ] Add vitest, testing-library, jsdom, axe and `typecheck` / `test` scripts
- [ ] `text-fx-tokens` CSS (type, color, effect tokens, light and dark)
- [ ] `motion-tokens.ts`
- [ ] `split.ts` with grapheme-safe splitting and tests
- [ ] `use-split-lines.ts` with resize-aware line detection
- [ ] `use-trigger.ts`, `use-reduced.ts`, `use-hydrated.ts`, `use-frame.ts`, `use-pointer.ts`
- [ ] `sr-text.tsx`, `math.ts`, `noise.ts`
- [ ] Catalog types (`registry/catalog.ts`) with props schema

Done when: utilities are tested, typecheck and lint pass.

## Phase 3: docs site shell

Depends on phase 2.

- [ ] Root layout with fonts, theme toggle (light and dark), skip link
- [ ] Site header, sidebar grouped by job, footer
- [ ] Component page template: preview with replay, Preview/Code tabs, variant switcher, install tabs with copy, usage, props table, a11y and motion notes, related
- [ ] Code highlighting at build time
- [ ] Docs pages: introduction, installation, ai, tokens, changelog
- [ ] Guides, compare and roadmap pages
- [ ] Remove the old `/animations` docs, landing page and old effects

Done when: the site builds and one sample component renders on its page.

## Phase 4: registry and AI readiness

Depends on phase 3.

- [ ] `scripts/build-registry.ts` writing `/r/*.json`, `/r/registry.json`, `/r/catalog.json`
- [ ] `/llms.txt`, `/llms-full.txt`, `/llms-small.txt`
- [ ] `/components/<name>.md` and `/components/<name>/markdown`
- [ ] MCP server at `/api/mcp` and `mcp/server.mjs`
- [ ] Agent skill at `/r/skills/textlab/SKILL.md`
- [ ] Tests: registry items are valid, imports resolve, every catalog entry has docs and a demo
- [ ] Verify `npx shadcn add` against a local build in a scratch app

Done when: a fresh Next app installs a component from the local registry and it renders.

## Phase 5: catalog

Depends on phase 4. One commit per component (component, demo, catalog entry, test).

Reveal
- [ ] blur-reveal
- [ ] word-reveal
- [ ] line-reveal
- [ ] char-reveal
- [ ] wipe-reveal
- [ ] in-view-title
- [ ] split-text
- [ ] tracking-reveal
- [ ] slice-reveal
- [ ] focus-pull

Numbers
- [ ] rolling-number
- [ ] odometer
- [ ] split-flap
- [ ] price-ticker
- [ ] countdown
- [ ] stat-reveal

Typing
- [ ] typewriter
- [ ] scramble-text
- [ ] hover-scramble
- [ ] matrix-decode
- [ ] text-morph
- [ ] word-rotator
- [ ] caret-morph

Light
- [ ] gradient-text
- [ ] shimmer-text
- [ ] neon-text
- [ ] aurora-text
- [ ] holo-text
- [ ] spotlight-text
- [ ] glass-text
- [ ] ember-text

Distort
- [ ] gooey-text
- [ ] liquid-text
- [ ] ink-bleed
- [ ] chromatic-text
- [ ] glitch-text
- [ ] heat-haze

Scroll
- [ ] scroll-fill
- [ ] scroll-skew
- [ ] velocity-marquee
- [ ] scroll-stretch
- [ ] depth-layers

Draw
- [ ] outline-draw
- [ ] signature
- [ ] marker-highlight
- [ ] underline-draw
- [ ] strike-through
- [ ] circle-annotate

Cursor
- [ ] magnetic-text
- [ ] variable-proximity
- [ ] cursor-trail
- [ ] flip-roll
- [ ] tilt-text
- [ ] extrude-text

Physics
- [ ] letter-drop
- [ ] elastic-text
- [ ] jelly-text
- [ ] wave-text
- [ ] breathing-text

Path
- [ ] path-text

Pixel
- [ ] ascii-text
- [ ] dither-text
- [ ] pixel-sort
- [ ] particle-text
- [ ] shader-ripple
- [ ] noise-dissolve

Kinetic
- [ ] kinetic-beat
- [ ] word-sequence
- [ ] read-along
- [ ] echo-text

Done when: every entry has a live demo, 2–4 variants, a preset, a reduced-motion branch, a props table, a registry item and a passing render test.

## Phase 6: motion pass (Emil Kowalski skills)

Depends on phase 5. Skills found in `.claude/skills`: `find-animation-opportunities`, `animate`, `improve-animations`, `review-animations`, `emil-design-eng`, `apple-design`, `animation-vocabulary`. The step names in the brief map one to one; "find animation opportunities" is the `find-animation-opportunities` skill.

- [ ] Run `find-animation-opportunities` across components and docs, write `docs/MOTION-AUDIT.md` (commit)
- [ ] Run `animate` on the audit items (commit)
- [ ] Run `improve-animations`, fix findings, then `review-animations` until clean (commit)

Done when: `review-animations` comes back clean.

## Phase 7: design pass

Depends on phase 6.

- [ ] Check installed skills, install missing ones (famous, taste) or note the fallback
- [ ] Signature homepage with the interactive playground (text, variant, speed, easing, export to code)
- [ ] Docs layout and component page template (ui-ux-pro-max)
- [ ] Editorial filter on demos (taste)
- [ ] Micro-interactions (emil-design-eng) and restraint, depth and springs (apple-design)
- [ ] Mobile-first check at 375, 768, 1024 and 1440
- [ ] Lighthouse and axe on the homepage and one component page

Done when: lint, typecheck, tests and build pass, and every box above is ticked.
