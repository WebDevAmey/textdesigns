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
- [x] Disable Claude attribution in `.claude/settings.json`
- [x] Strip the Claude co-author trailers from 6 older commits and force-push

Done when: both docs are committed and pushed.

## Phase 2: foundations

Depends on phase 1.

- [x] Trim dependencies (drop gsap, framer-motion, split-type, simplex-noise, base-ui, tabler) once nothing imports them
- [x] Add vitest, testing-library, jsdom, axe and `typecheck` / `test` scripts
- [x] `text-fx-tokens` CSS (type, color, effect tokens, light and dark)
- [x] `motion-tokens.ts`
- [x] `split.ts` with grapheme-safe splitting and tests
- [x] `use-split-lines.ts` with resize-aware line detection
- [x] `use-trigger.ts`, `use-reduced.ts`, `use-hydrated.ts`, `use-frame.ts`, `use-pointer.ts`
- [x] `a11y.tsx` (screen-reader text), `math.ts`, `noise.ts`
- [x] Catalog types (`registry/catalog.ts`) with props schema

Done when: utilities are tested, typecheck and lint pass.

## Phase 3: docs site shell

Depends on phase 2.

- [x] Root layout with fonts, theme toggle (light and dark), skip link
- [x] Site header, sidebar grouped by job, footer
- [x] Component page template: preview with replay, Preview/Code tabs, variant switcher, install tabs with copy, usage, props table, a11y and motion notes, related
- [x] Code highlighting at build time
- [x] Docs pages: introduction, installation, ai, tokens, changelog
- [x] Guides, compare and roadmap pages
- [x] Remove the old `/animations` docs, landing page and old effects

Done when: the site builds and one sample component renders on its page.

## Phase 4: registry and AI readiness

Depends on phase 3.

- [x] `scripts/build-registry.ts` writing `/r/*.json`, `/r/registry.json`, `/r/catalog.json`
- [x] `/llms.txt`, `/llms-full.txt`, `/llms-small.txt`
- [x] `/components/<name>.md` and `/components/<name>/markdown`
- [x] MCP server at `/api/mcp` and `mcp/server.mjs`
- [x] Agent skill at `/r/skills/textlab/SKILL.md`
- [x] Tests: registry items are valid, imports resolve, every catalog entry has docs and a demo
- [x] Verify `npx shadcn add` against a local build in a scratch app (found motion 14 breaks prerendering, so installs pin motion 12)

Done when: a fresh Next app installs a component from the local registry and it renders.

## Phase 5: catalog

Depends on phase 4. One commit per component (component, demo, catalog entry, test).

Reveal
- [x] blur-reveal
- [x] word-reveal
- [x] line-reveal
- [x] char-reveal
- [x] wipe-reveal
- [x] in-view-title
- [x] split-text
- [x] tracking-reveal
- [x] slice-reveal
- [x] focus-pull

Numbers
- [x] rolling-number
- [x] odometer
- [x] split-flap
- [x] price-ticker
- [x] countdown
- [x] stat-reveal

Typing
- [x] typewriter
- [x] scramble-text
- [x] hover-scramble
- [x] matrix-decode
- [x] text-morph
- [x] word-rotator
- [x] caret-morph

Light
- [x] gradient-text
- [x] shimmer-text
- [x] neon-text
- [x] aurora-text
- [x] holo-text
- [x] spotlight-text
- [x] glass-text
- [x] ember-text

Distort
- [x] gooey-text
- [x] liquid-text
- [x] ink-bleed
- [x] chromatic-text
- [x] glitch-text
- [x] heat-haze

Scroll
- [x] scroll-fill
- [x] scroll-skew
- [x] velocity-marquee
- [x] scroll-stretch
- [x] depth-layers

Draw
- [x] outline-draw
- [x] signature
- [x] marker-highlight
- [x] underline-draw
- [x] strike-through
- [x] circle-annotate

Cursor
- [x] magnetic-text
- [x] variable-proximity
- [x] cursor-trail
- [x] flip-roll
- [x] tilt-text
- [x] extrude-text

Physics
- [x] letter-drop
- [x] elastic-text
- [x] jelly-text
- [x] wave-text
- [x] breathing-text

Path
- [x] path-text

Pixel
- [x] ascii-text
- [x] dither-text
- [x] pixel-sort
- [x] particle-text
- [x] shader-ripple
- [x] noise-dissolve

Kinetic
- [x] kinetic-beat
- [x] word-sequence
- [x] read-along
- [x] echo-text

Done when: every entry has a live demo, 2–4 variants, a preset, a reduced-motion branch, a props table, a registry item and a passing render test.

## Phase 6: motion pass (Emil Kowalski skills)

Depends on phase 5. Skills found in `.claude/skills`: `find-animation-opportunities`, `animate`, `improve-animations`, `review-animations`, `emil-design-eng`, `apple-design`, `animation-vocabulary`. The step names in the brief map one to one; "find animation opportunities" is the `find-animation-opportunities` skill.

- [x] Run `find-animation-opportunities` across components and docs, write `docs/MOTION-AUDIT.md` (commit)
- [x] Run `animate` on the audit items (commit). Rows 1 to 5 shipped; row 6 lands with the homepage in phase 7
- [x] Run `improve-animations`, fix findings, then `review-animations` until clean (commit). Clean on the third pass; see MOTION-AUDIT.md step 3

Done when: `review-animations` comes back clean.

## Phase 7: design pass

Depends on phase 6.

- [x] Check installed skills, install missing ones (famous, taste) or note the fallback. Installed taste (`design-taste-frontend`, `high-end-visual-design`); no "famous" skill exists on skills.sh, so `high-end-visual-design` stands in for hero moments
- [ ] Signature homepage with the interactive playground (text, variant, speed, easing, export to code)
- [ ] Docs layout and component page template (ui-ux-pro-max)
- [ ] Editorial filter on demos (taste)
- [ ] Micro-interactions (emil-design-eng) and restraint, depth and springs (apple-design)
- [ ] Mobile-first check at 375, 768, 1024 and 1440
- [ ] Lighthouse and axe on the homepage and one component page

Done when: lint, typecheck, tests and build pass, and every box above is ticked.
