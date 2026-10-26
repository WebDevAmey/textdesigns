# Landing page spec: clean revamp with a cloud hero

Status: approved direction from Maze, 2026-10-26. Supersedes the five-zone build in `22bbd0d`.

## Goal

A clean, calm landing page that reads like a product site, not a demo reel. Someone should understand what Textlab is from the first screen, see real effects running, copy the install command and leave with one obvious next step.

References: vantaui.com (centered hero over a big product preview, short feature tiles, latest additions, FAQ, closing CTA), boardui.com (stack pills with versions, a grid of live component cards, MCP section, GitHub section), uiarc.dev (every example is live, plain copy).

## What changes

| Area | Before | After |
|---|---|---|
| Hero | Dark, left aligned, ASCII field, sticky scale-out | Aceternity cloud shader sky, centered copy, glass "preview window" with a live effect |
| Four figure stage | Scroll pinned, 400vh, progress rule, Fig. 1 to 4 | **Removed** |
| Effects | Only inside the stage | A grid of nine live effect cards |
| Install | Terminal with Human / Agent switch | Kept, tightened |
| Details | 001 to 004 rows with drawn marks | Three feature tiles: accessible, agent ready, source in your repo |
| FAQ | Docs only | Short list of five on the landing page, full list at /docs/faq |
| Closing | Curtain footer | Kept (Start typing, links, wordmark) |

## Page outline

1. **Hero** (cloud shader, `min-h-[50rem]`)
   - Pill: "New · Eleven effects, rebuilt and smoother" → /docs/changelog
   - H1: "Type that moves." Each word sharpens in from a blur.
   - Sub: "70 text effects for React. Install one with a single command and the source lands in your repo."
   - Buttons: "Browse effects" (white, primary) and "Copy install" chip (glass) with copy feedback
   - Small line: "Free and MIT licensed · No runtime package"
   - Preview window: a glass frame like the source's dashboard image, holding a fake editor chrome (three dots, file tab `hero.tsx`) with a live headline that cycles through four effects, and the one line of JSX that renders it.
2. **Stack strip**: React 19.2, Next.js 16, Tailwind CSS 4, Motion 12, shadcn CLI, TypeScript, as quiet pills with versions read from package.json.
3. **Live effects grid**: heading "Seventy effects, every one live", nine cards (3 × 3 on desktop, 1 column on phones). Each card: live preview area, name, one line, arrow link. Ends with "Browse all 70 effects".
4. **Install**: "From browsing to shipped in a minute." Terminal block with Human / Agent switch, file written, JSX line, live result.
5. **Features**: three tiles in one row. Accessible by default (axe on every component, Lighthouse accessibility 100), ready for your agent (MCP, llms.txt, Markdown pages), source in your repo (no runtime package, MIT).
6. **FAQ**: five questions, native disclosure, link to the full list.
7. **Footer**: existing curtain footer.

## Visual rules

- Keep the site palette, Bricolage Grotesque and Geist Mono. The cloud hero is the only saturated area; everything below it is the warm paper or soft black ground.
- Cards: `rounded-2xl`, hairline ring, `bg-surface`, no shadows except the hero glass frame.
- One accent (ember) for focus rings and small highlights only. The hero buttons follow the cloud source: white primary, glass secondary.
- Section rhythm: `py-24` desktop, `py-16` phone, max width 1280px, headings left aligned except the hero.

## Motion

- Hero entrance, once, on load: pill fades in (0 ms), H1 words blur in with a 60 ms stagger, sub and buttons rise 8 px (300 ms), preview window rises 24 px from a 6 px blur (450 ms). Ease: the repo's `emphasized` token.
- Preview window: the headline swaps effects every 3.2 s; swaps pause when the hero is off screen.
- Sections below: one shared reveal (8 px rise, 4 px blur, 600 ms, once) on headings and card groups, staggered 60 ms per card. No scroll pinning, no scrubbing.
- Cards: hover lifts the ring color only; the effect inside reacts on its own terms (pointer effects respond, looping effects keep looping).
- Reduced motion: no entrance, no swapping, cloud time frozen (the shader already does this), effects render their still state.

## Accessibility and performance

- All copy is real HTML; the shader canvas is decorative and `pointer-events-none`.
- The H1 stays visible from first paint (blur only, never opacity 0) so it remains the LCP element.
- Lighthouse mobile targets: performance 90+, accessibility 100, CLS 0.
- axe clean in light and dark.

## Facts allowed on the page

70 effects, 12 groups, 192 variants, 363 tests with an axe check per component, MIT, no runtime package, React 19, Next.js, Tailwind CSS 4, Motion, shadcn CLI, TypeScript, MCP server, llms.txt, Markdown pages, Lighthouse accessibility 100 (measured on this page).
