# Four New Novel Text Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four new `textlab` catalog entries — Pressure Write (reveal), Gravity Lens (hover), Tuning Fork (loop), Letterpress (scroll) — each combining effects/techniques not paired together elsewhere in the 44-entry catalog, filling out the currently-thin `scroll` category.

**Architecture:** `textlab` is a Next.js App Router gallery. Each effect is a self-contained client component under `src/components/text/` exposing a `{ text: string }`-compatible prop, registered in `src/lib/animations.ts` (`{ name, slug, category, description, component, code }`) and rendered generically by `AnimationCard` (`component: React.ComponentType<{ text: string }>`, replays on a 6s loop via `key={iteration}` remount unless `infinite: true`). `src/lib/animations-docs.tsx` additionally maps each `slug` to its source filename (`SOURCE_FILES`) for the per-slug docs page. None of the four tasks below change that contract or touch `AnimationCard`/`AnimationDocs`/`DocsSidebar`/`DocsNav`.

**Tech Stack:** Next.js 16.3.0, React 19.2.8, TypeScript (strict), Tailwind CSS v4, GSAP 3.15.0 (`gsap` + `@gsap/react`, `ScrollTrigger` already used by `ScrollReveal`/`ScrollSkewText`), `split-type` for char splitting, `usePrefersReducedMotion` hook (`src/hooks/usePrefersReducedMotion.ts`).

## Global Constraints

- Package manager is `pnpm`. Run all commands from the `textlab/` directory (repo root).
- No test runner is configured (`package.json` has no `test` script, no jest/vitest/testing-library deps). Verification for every task is: (1) `npx tsc --noEmit` clean, (2) `pnpm lint` clean, (3) a manual visual check on the running dev server (`pnpm dev`) using the concrete pass criteria given in each task, instead of automated test assertions.
- Every new component keeps the `{ text: string }`-compatible prop contract so `AnimationCard`'s `React.ComponentType<{ text: string }>` typing keeps compiling with no changes to `AnimationCard.tsx`.
- Follow the codebase's existing component convention: `"use client"`, a typed props interface with defaults, single default export, a short JSDoc comment above the export explaining the effect's specific novel combination (see `ResonantChainText.tsx`/`MoltenMetalText.tsx` for the house style), cleanup of any `gsap.ticker` callbacks / DOM event listeners / `SplitType` instances in a returned cleanup function — but note `useGSAP`'s own context already auto-reverts plain GSAP tweens/timelines/ScrollTriggers on unmount, so don't re-kill those manually (see `ScrollReveal.tsx`, which only manually reverts its `SplitType` instance, not the ScrollTrigger it created).
- No new npm dependencies — everything is built on packages already installed.

---

### Task 1: Add the "Pressure Write" effect (reveal)

**Files:**
- Create: `src/components/text/PressureWriteText.tsx`
- Modify: `src/lib/animations.ts` (add import near the other reveal imports, insert a new catalog entry at the end of the `reveal` block — immediately after the "Path Entrance" entry, before the "Magnetic" entry)
- Modify: `src/lib/animations-docs.tsx` (add a `SOURCE_FILES` mapping entry, immediately after `"path-entrance": "PathEntranceText.tsx",`)

**Interfaces:**
- Consumes: none.
- Produces: `PressureWriteText` default export, `({ text, fontSize, inkColor, pressureVariance }: { text: string; fontSize?: number; inkColor?: string; pressureVariance?: number }) => JSX.Element`.

- [ ] **Step 1: Create the component**

Create `src/components/text/PressureWriteText.tsx`:

```tsx
"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface PressureWriteTextProps {
  text: string;
  fontSize?: number;
  inkColor?: string;
  /** How much per-character stroke width varies from the base pressure curve, 0-1. */
  pressureVariance?: number;
}

const BASE_STROKE = 3;
const PAD_RATIO = 0.12;

function measureCharWidths(text: string, font: string): number[] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return text.split("").map(() => 0);
  ctx.font = font;
  return text.split("").map((ch) => ctx.measureText(ch).width);
}

/**
 * Each character draws itself as an SVG stroke outline (the same
 * technique StrokeDrawText uses for a whole line), but per character
 * and with stroke-width modulated live against a seeded pressure
 * curve — thin at the start and end of a stroke, fuller in the
 * middle — approximating pen velocity rather than true glyph-outline
 * pressure. A blurred duplicate stroke fades in behind each character
 * as it draws and dissipates just after, like ink bleeding into paper
 * and drying, and word boundaries get a short pause simulating the pen
 * lifting off the page.
 */
export default function PressureWriteText({
  text,
  fontSize = 120,
  inkColor = "currentColor",
  pressureVariance = 0.15,
}: PressureWriteTextProps) {
  const strokeRefs = useRef<(SVGTextElement | null)[]>([]);
  const bleedRefs = useRef<(SVGTextElement | null)[]>([]);
  const reducedMotion = usePrefersReducedMotion();

  const chars = useMemo(() => text.split(""), [text]);

  const layout = useMemo(() => {
    const pad = fontSize * PAD_RATIO;
    if (typeof document === "undefined") {
      const fallbackWidth = fontSize * 0.6;
      return {
        width: chars.length * fallbackWidth + pad * 2,
        height: fontSize * 1.5,
        xs: chars.map((_, i) => pad + i * fallbackWidth),
      };
    }
    const font = `700 ${fontSize}px system-ui, sans-serif`;
    const widths = measureCharWidths(text, font);
    let cursor = pad;
    const xs = widths.map((w) => {
      const x = cursor;
      cursor += w;
      return x;
    });
    return { width: cursor + pad, height: fontSize * 1.5, xs };
  }, [text, fontSize, chars]);

  useGSAP(() => {
    if (reducedMotion) return;

    const baselineY = layout.height * 0.72;
    let cursorTime = 0;

    chars.forEach((char, i) => {
      const isSpace = char === " ";
      const nextIsSpace = chars[i + 1] === " ";

      if (isSpace) {
        cursorTime += 0.12;
        return;
      }

      const strokeEl = strokeRefs.current[i];
      const bleedEl = bleedRefs.current[i];
      if (!strokeEl) return;

      const length = Math.max(strokeEl.getComputedTextLength() * 3, 40);
      const variance = Math.random() * 2 - 1;
      const drawDuration = 0.22 + Math.abs(variance) * 0.08;

      gsap.set(strokeEl, {
        strokeDasharray: length,
        strokeDashoffset: length,
        fill: "transparent",
      });
      if (bleedEl) gsap.set(bleedEl, { opacity: 0 });

      const drawTween = gsap.to(strokeEl, {
        strokeDashoffset: 0,
        duration: drawDuration,
        delay: cursorTime,
        ease: "power1.inOut",
        onUpdate: () => {
          const bump = Math.sin(drawTween.progress() * Math.PI);
          const jitter = 1 + variance * pressureVariance;
          strokeEl.setAttribute(
            "stroke-width",
            String(BASE_STROKE * (0.4 + bump * 1.3) * jitter)
          );
        },
      });

      if (bleedEl) {
        gsap.fromTo(
          bleedEl,
          { opacity: 0.5 },
          {
            opacity: 0,
            duration: 0.5,
            delay: cursorTime + drawDuration * 0.4,
            ease: "power2.out",
          }
        );
      }

      cursorTime += drawDuration + (nextIsSpace ? 0.18 : 0.05);
    });
  }, [text, fontSize, pressureVariance, layout, reducedMotion]);

  if (reducedMotion) {
    return (
      <span className="inline-block font-bold" style={{ fontSize }}>
        {text}
      </span>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      width={layout.width}
      height={layout.height}
      style={{ maxWidth: "100%", height: "auto" }}
      className="mx-auto overflow-visible"
    >
      {chars.map((char, i) =>
        char === " " ? null : (
          <text
            key={`bleed-${i}`}
            ref={(el) => {
              bleedRefs.current[i] = el;
            }}
            x={layout.xs[i]}
            y={layout.height * 0.72}
            fontSize={fontSize}
            fontWeight={700}
            fill={inkColor}
            style={{ filter: "blur(6px)" }}
          >
            {char}
          </text>
        )
      )}
      {chars.map((char, i) =>
        char === " " ? null : (
          <text
            key={`stroke-${i}`}
            ref={(el) => {
              strokeRefs.current[i] = el;
            }}
            x={layout.xs[i]}
            y={layout.height * 0.72}
            fontSize={fontSize}
            fontWeight={700}
            stroke={inkColor}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            fill="transparent"
          >
            {char}
          </text>
        )
      )}
    </svg>
  );
}
```

- [ ] **Step 2: Register it in the catalog**

In `src/lib/animations.ts`, add the import with the other component imports near the top (order doesn't matter, but keep it near `PathEntranceText`):

```ts
import PressureWriteText from "@/components/text/PressureWriteText";
```

Insert this entry immediately after the "Path Entrance" entry and before the "Magnetic" entry (i.e., as the last entry in the `reveal` category block):

```ts
  {
    name: "Pressure Write",
    slug: "pressure-write",
    category: "reveal",
    description:
      "Each character draws itself with a variable-width stroke that mimics pen pressure, bleeding softly into place.",
    component: PressureWriteText,
    code: `<PressureWriteText text="Pressure Write" fontSize={100} />`,
  },
```

- [ ] **Step 3: Add the source-file mapping**

In `src/lib/animations-docs.tsx`, in the `SOURCE_FILES` object, insert immediately after `"path-entrance": "PathEntranceText.tsx",`:

```ts
  "pressure-write": "PressureWriteText.tsx",
```

- [ ] **Step 4: Type-check and lint**

```bash
npx tsc --noEmit
pnpm lint
```

Expected: both clean.

- [ ] **Step 5: Visual check**

```bash
pnpm dev
```

At `http://localhost:3000/animations`, find the **Pressure Write** card. Expected: on each replay, letters draw themselves one at a time as an outline whose thickness visibly pulses (thin → fuller → thin) as it draws, with a faint blurred "bleed" halo behind each letter that fades away shortly after it finishes drawing, and a short pause between the two words. Then visit `http://localhost:3000/animations/pressure-write` and confirm the detail page renders correctly with visible source code.

- [ ] **Step 6: Commit**

```bash
git add src/components/text/PressureWriteText.tsx src/lib/animations.ts src/lib/animations-docs.tsx
git commit -m "feat: add Pressure Write text effect"
```

---

### Task 2: Add the "Gravity Lens" effect (hover)

**Files:**
- Create: `src/components/text/GravityLensText.tsx`
- Modify: `src/lib/animations.ts` (add import, insert a new catalog entry at the end of the `hover` block — immediately after the "Flux Glyphs" entry, before the "Typewriter" entry)
- Modify: `src/lib/animations-docs.tsx` (add a `SOURCE_FILES` mapping entry, immediately after `"flux-glyphs": "MagneticFluxText.tsx",`)

**Interfaces:**
- Consumes: none.
- Produces: `GravityLensText` default export, `({ text, lensRadius, strength, magnify }: { text: string; lensRadius?: number; strength?: number; magnify?: number }) => JSX.Element`.

- [ ] **Step 1: Create the component**

Create `src/components/text/GravityLensText.tsx`:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface GravityLensTextProps {
  text: string;
  /** px radius around the cursor within which characters are pulled in. */
  lensRadius?: number;
  /** How strongly characters are pulled toward the cursor, 0-1. */
  strength?: number;
  /** Extra scale applied at the lens edge (magnification), 0-1. */
  magnify?: number;
}

/**
 * Inverts the usual cursor-repel hover effect: characters near the
 * pointer are pulled inward and magnify slightly as they approach the
 * lens boundary — the actual visual signature of gravitational
 * lensing, where magnification (not just displacement) is strongest at
 * the edge. A ring tracking the cursor renders a thin
 * chromatic-dispersion fringe, like light splitting as it bends around
 * the lens. Idle (no ongoing physics) until the pointer is actually
 * near — pure event-driven quickTo, no ticker.
 */
export default function GravityLensText({
  text,
  lensRadius = 140,
  strength = 0.5,
  magnify = 0.35,
}: GravityLensTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    const textEl = textRef.current;
    const ring = ringRef.current;
    if (!container || !textEl || !ring) return;

    const split = new SplitType(textEl, { types: "chars" });
    const chars = split.chars ?? [];

    const setters = chars.map((char) => ({
      x: gsap.quickTo(char, "x", { duration: 0.35, ease: "power3.out" }),
      y: gsap.quickTo(char, "y", { duration: 0.35, ease: "power3.out" }),
      scale: gsap.quickTo(char, "scale", { duration: 0.35, ease: "power3.out" }),
    }));

    const ringX = gsap.quickTo(ring, "x", { duration: 0.15, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.15, ease: "power3.out" });

    const handleMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const pointerX = event.clientX - rect.left;
      const pointerY = event.clientY - rect.top;

      gsap.to(ring, { opacity: 1, duration: 0.2 });
      ringX(pointerX - lensRadius);
      ringY(pointerY - lensRadius);

      chars.forEach((char, i) => {
        const charRect = char.getBoundingClientRect();
        const cx = charRect.left + charRect.width / 2 - rect.left;
        const cy = charRect.top + charRect.height / 2 - rect.top;
        const dx = pointerX - cx;
        const dy = pointerY - cy;
        const dist = Math.hypot(dx, dy);

        if (dist < lensRadius) {
          const falloff = (1 - dist / lensRadius) ** 2;
          setters[i].x(dx * falloff * strength);
          setters[i].y(dy * falloff * strength);
          setters[i].scale(1 + falloff * magnify);
        } else {
          setters[i].x(0);
          setters[i].y(0);
          setters[i].scale(1);
        }
      });
    };

    const handleLeave = () => {
      gsap.to(ring, { opacity: 0, duration: 0.3 });
      chars.forEach((_, i) => {
        setters[i].x(0);
        setters[i].y(0);
        setters[i].scale(1);
      });
    };

    container.addEventListener("pointermove", handleMove);
    container.addEventListener("pointerleave", handleLeave);

    return () => {
      container.removeEventListener("pointermove", handleMove);
      container.removeEventListener("pointerleave", handleLeave);
      split.revert();
    };
  }, [text, lensRadius, strength, magnify, reducedMotion]);

  if (reducedMotion) {
    return <span className="inline-block">{text}</span>;
  }

  return (
    <div ref={containerRef} className="relative inline-block touch-none">
      <div
        ref={ringRef}
        className="pointer-events-none absolute rounded-full opacity-0"
        style={{
          width: lensRadius * 2,
          height: lensRadius * 2,
          boxShadow:
            "0 0 0 1px rgba(255,80,80,0.35), 0 0 0 2px rgba(80,220,255,0.3), 0 0 24px 4px rgba(140,120,255,0.15)",
          filter: "blur(0.5px)",
        }}
      />
      <h1 ref={textRef} className="relative inline-block">
        {text}
      </h1>
    </div>
  );
}
```

- [ ] **Step 2: Register it in the catalog**

In `src/lib/animations.ts`, add the import near the other hover imports:

```ts
import GravityLensText from "@/components/text/GravityLensText";
```

Insert this entry immediately after the "Flux Glyphs" entry and before the "Typewriter" entry (i.e., as the last entry in the `hover` category block):

```ts
  {
    name: "Gravity Lens",
    slug: "gravity-lens",
    category: "hover",
    description:
      "Nearby letters bend inward and magnify near the cursor, with a thin chromatic fringe at the lens edge.",
    component: GravityLensText,
    code: `<GravityLensText text="Gravity Lens" />`,
  },
```

- [ ] **Step 3: Add the source-file mapping**

In `src/lib/animations-docs.tsx`, in the `SOURCE_FILES` object, insert immediately after `"flux-glyphs": "MagneticFluxText.tsx",`:

```ts
  "gravity-lens": "GravityLensText.tsx",
```

- [ ] **Step 4: Type-check and lint**

```bash
npx tsc --noEmit
pnpm lint
```

Expected: both clean.

- [ ] **Step 5: Visual check**

```bash
pnpm dev
```

At `http://localhost:3000/animations`, find the **Gravity Lens** card and hover near the text. Expected: nearby letters are pulled toward the cursor and magnify slightly as the cursor gets close, with a faint ring around the cursor showing a soft red/cyan fringe. Moving the cursor away lets the letters spring back to their original position and the ring fade out. Then visit `http://localhost:3000/animations/gravity-lens` and confirm the detail page renders correctly with visible source code.

- [ ] **Step 6: Commit**

```bash
git add src/components/text/GravityLensText.tsx src/lib/animations.ts src/lib/animations-docs.tsx
git commit -m "feat: add Gravity Lens text effect"
```

---

### Task 3: Add the "Tuning Fork" effect (loop)

**Files:**
- Create: `src/components/text/TuningForkText.tsx`
- Modify: `src/lib/animations.ts` (add import, insert a new catalog entry at the end of the `loop` block — immediately after the "Circular Text" entry, before the "Scroll Reveal" entry)
- Modify: `src/lib/animations-docs.tsx` (add a `SOURCE_FILES` mapping entry, immediately after `"circular-text": "CircularText.tsx",`)

**Interfaces:**
- Consumes: none.
- Produces: `TuningForkText` default export, `({ text, ringInterval, frequency, amplitude }: { text: string; ringInterval?: number; frequency?: number; amplitude?: number }) => JSX.Element`.

- [ ] **Step 1: Create the component**

Create `src/components/text/TuningForkText.tsx`:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface TuningForkTextProps {
  text: string;
  /** Seconds between each "pluck" ring. */
  ringInterval?: number;
  /** Number of standing-wave cycles across the text. */
  frequency?: number;
  /** Peak vertical displacement, in px. */
  amplitude?: number;
}

const TRACE_POINTS = 40;
const TRACE_HEIGHT = 20;

/**
 * Characters ride a continuous analytic standing wave rather than a
 * spring simulation: most of the time it's a barely-visible idle hum,
 * but every few seconds a sharp "pluck" sends a fast-attack,
 * slow-decay ring rippling through the letters — like a struck tuning
 * fork. Local wave energy also drives each character's variable font
 * weight and color, and a thin oscilloscope-style trace beneath the
 * baseline redraws every frame from the same wave function.
 */
export default function TuningForkText({
  text,
  ringInterval = 4,
  frequency = 1,
  amplitude = 6,
}: TuningForkTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    const split = new SplitType(textEl, { types: "chars" });
    const chars = split.chars ?? [];
    const count = Math.max(chars.length, 1);
    const k = Math.PI * 2 * frequency;
    const hum = 0.12;

    const tick = () => {
      const now = performance.now() / 1000;
      const phase = now % ringInterval;
      const ring = Math.exp(-phase * 1.8) + hum;

      chars.forEach((char, i) => {
        const x = i / count;
        const wave = Math.sin(k * x - now * 3.4);
        const amp = wave * amplitude * ring;
        const energy = Math.min(Math.abs(amp) / amplitude, 1);

        gsap.set(char, {
          y: amp,
          fontVariationSettings: `"wght" ${400 + energy * 500}`,
          color:
            energy > 0.08
              ? `hsl(${232 - energy * 30}, ${35 + energy * 45}%, ${20 + energy * 30}%)`
              : "currentColor",
        });
      });

      const svgPath = svgPathRef.current;
      if (svgPath) {
        const containerWidth = container.clientWidth;
        let d = "";
        for (let p = 0; p <= TRACE_POINTS; p++) {
          const x = p / TRACE_POINTS;
          const wave = Math.sin(k * x - now * 3.4);
          const amp = wave * (amplitude * 1.4) * ring;
          const px = x * containerWidth;
          const py = TRACE_HEIGHT / 2 + amp;
          d += `${p === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)} `;
        }
        svgPath.setAttribute("d", d);
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      split.revert();
    };
  }, [text, ringInterval, frequency, amplitude, reducedMotion]);

  if (reducedMotion) {
    return <span className="inline-block">{text}</span>;
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <h1 ref={textRef} className="inline-block">
        {text}
      </h1>
      <svg
        className="pointer-events-none absolute left-0 w-full overflow-visible"
        style={{ top: "100%", height: TRACE_HEIGHT }}
        aria-hidden="true"
      >
        <path
          ref={svgPathRef}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Register it in the catalog**

In `src/lib/animations.ts`, add the import near the other loop imports:

```ts
import TuningForkText from "@/components/text/TuningForkText";
```

Insert this entry immediately after the "Circular Text" entry and before the "Scroll Reveal" entry (i.e., as the last entry in the `loop` category block). Note `infinite: true`, matching how "Marquee" and "Circular Text" (the catalog's other perpetually-running loops) are marked, so `AnimationCard` doesn't force a 6s remount on an animation that never terminates:

```ts
  {
    name: "Tuning Fork",
    slug: "tuning-fork",
    category: "loop",
    description:
      "Letters idle on a standing wave that periodically rings like a struck tuning fork, traced by a small oscilloscope line.",
    component: TuningForkText,
    infinite: true,
    code: `<TuningForkText text="Tuning Fork" />`,
  },
```

- [ ] **Step 3: Add the source-file mapping**

In `src/lib/animations-docs.tsx`, in the `SOURCE_FILES` object, insert immediately after `"circular-text": "CircularText.tsx",`:

```ts
  "tuning-fork": "TuningForkText.tsx",
```

- [ ] **Step 4: Type-check and lint**

```bash
npx tsc --noEmit
pnpm lint
```

Expected: both clean.

- [ ] **Step 5: Visual check**

```bash
pnpm dev
```

At `http://localhost:3000/animations`, find the **Tuning Fork** card. Expected: the text shows a very subtle idle wobble, and roughly every 4 seconds a visibly stronger ripple passes through the letters (position, weight, and a slight color shift) that quickly decays back to the idle hum, in sync with a small wavy line trace under the text. Then visit `http://localhost:3000/animations/tuning-fork` and confirm the detail page renders correctly with visible source code.

- [ ] **Step 6: Commit**

```bash
git add src/components/text/TuningForkText.tsx src/lib/animations.ts src/lib/animations-docs.tsx
git commit -m "feat: add Tuning Fork text effect"
```

---

### Task 4: Add the "Letterpress" effect (scroll)

**Files:**
- Create: `src/components/text/LetterpressText.tsx`
- Modify: `src/lib/animations.ts` (add import, insert a new catalog entry at the end of the `scroll` block — immediately after the "Scroll Skew" entry, the last entry in the array)
- Modify: `src/lib/animations-docs.tsx` (add a `SOURCE_FILES` mapping entry, immediately after `"scroll-skew": "ScrollSkewText.tsx",`)

**Interfaces:**
- Consumes: none.
- Produces: `LetterpressText` default export, `({ text, inkColor, ghostOpacity, impactStrength }: { text: string; inkColor?: string; ghostOpacity?: number; impactStrength?: number }) => JSX.Element`.

- [ ] **Step 1: Create the component**

Create `src/components/text/LetterpressText.tsx`:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface LetterpressTextProps {
  text: string;
  inkColor?: string;
  /** Opacity of the always-visible ghost outline stroke, 0-1. */
  ghostOpacity?: number;
  /** Multiplier on the stamp impact's squash/overshoot, 0-2ish. */
  impactStrength?: number;
}

/**
 * Characters begin as ghost impressions — a faint, constant stroke
 * outline with no fill — and get stamped with ink as you scroll past
 * them: a quick squash-and-overshoot (the press impact) followed by a
 * blur-to-sharp settle (ink bleed soaking in and drying). The whole
 * sequence is scrubbed directly to scroll position rather than played
 * once, so scrolling back up visibly lifts the ink back off, character
 * by character, in reverse.
 */
export default function LetterpressText({
  text,
  inkColor = "currentColor",
  ghostOpacity = 0.28,
  impactStrength = 1,
}: LetterpressTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    const textEl = textRef.current;
    if (!textEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const split = new SplitType(textEl, { types: "chars" });
    const chars = split.chars ?? [];

    gsap.set(chars, {
      color: "transparent",
      webkitTextStroke: `1px rgba(0,0,0,${ghostOpacity})`,
      scaleY: 1,
      y: 0,
      filter: "blur(0px)",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: textEl,
        start: "top 85%",
        end: "bottom 45%",
        scrub: 0.4,
      },
    });

    chars.forEach((char, i) => {
      const start = i * 0.05;
      tl.set(char, { filter: "blur(6px)", color: "transparent", scaleY: 1, y: 0 }, start)
        .to(
          char,
          {
            filter: "blur(1px)",
            color: inkColor,
            scaleY: 1 - 0.22 * impactStrength,
            y: 2 * impactStrength,
            duration: 0.14,
            ease: "power1.out",
          },
          start
        )
        .to(
          char,
          {
            filter: "blur(0px)",
            scaleY: 1 + 0.08 * impactStrength,
            y: -1 * impactStrength,
            duration: 0.1,
            ease: "power1.out",
          },
          start + 0.14
        )
        .to(char, { scaleY: 1, y: 0, duration: 0.12, ease: "power2.out" }, start + 0.24);
    });

    return () => {
      split.revert();
    };
  }, [text, inkColor, ghostOpacity, impactStrength]);

  return (
    <h1 ref={textRef} className="inline-block">
      {text}
    </h1>
  );
}
```

- [ ] **Step 2: Register it in the catalog**

In `src/lib/animations.ts`, add the import near the other scroll imports:

```ts
import LetterpressText from "@/components/text/LetterpressText";
```

Insert this entry immediately after the "Scroll Skew" entry, as the new last entry in the `animations` array:

```ts
  {
    name: "Letterpress",
    slug: "letterpress",
    category: "scroll",
    description:
      "Scrolling stamps each character with ink like a letterpress; scrolling back lifts it off again.",
    component: LetterpressText,
    code: `<LetterpressText text="Letterpress" />`,
  },
```

- [ ] **Step 3: Add the source-file mapping**

In `src/lib/animations-docs.tsx`, in the `SOURCE_FILES` object, insert immediately after `"scroll-skew": "ScrollSkewText.tsx",` (the last entry):

```ts
  letterpress: "LetterpressText.tsx",
```

- [ ] **Step 4: Type-check and lint**

```bash
npx tsc --noEmit
pnpm lint
```

Expected: both clean.

- [ ] **Step 5: Visual check**

```bash
pnpm dev
```

At `http://localhost:3000/animations`, find the **Letterpress** card and scroll the page so the card moves through the middle of the viewport. Expected: each character starts as a faint outline and, as it scrolls into range, briefly squashes and overshoots before settling ink-filled and sharp; scrolling back up visibly reverses the effect, lifting the ink back off character by character. Then visit `http://localhost:3000/animations/letterpress`, scroll that page, and confirm the same behavior plus visible source code.

- [ ] **Step 6: Commit**

```bash
git add src/components/text/LetterpressText.tsx src/lib/animations.ts src/lib/animations-docs.tsx
git commit -m "feat: add Letterpress text effect"
```

---

### Task 5: Final integration pass

**Files:** none created — verification only.

**Interfaces:**
- Consumes: everything from Tasks 1–4.
- Produces: nothing further.

- [ ] **Step 1: Full type-check and lint**

```bash
npx tsc --noEmit
pnpm lint
```

Expected: both clean across the whole project.

- [ ] **Step 2: Full visual pass**

```bash
pnpm dev
```

At `http://localhost:3000/animations`, confirm:
- Exactly 48 cards total (44 that existed before this plan started, plus the 4 new effects).
- **Pressure Write**, **Gravity Lens**, **Tuning Fork**, **Letterpress** each behave per their Task 1–4 visual checks, grouped under the correct category filter (Reveal / Hover / Loop / Scroll respectively).
- No console errors in the browser devtools while scrolling through the whole grid, hovering every new card, and letting each auto-replay at least once.

- [ ] **Step 3: Reduced-motion check**

In the browser devtools, enable "Emulate CSS media feature prefers-reduced-motion: reduce" (Chrome: Rendering tab; Firefox: about:config `ui.prefersReducedMotion` = 1), reload `/animations`, and confirm all four new cards render fully-formed static text with no motion — no half-drawn strokes, no transparent/ghost characters, no console errors. Turn the emulation back off afterward.

- [ ] **Step 4: Confirm no orphaned references**

```bash
for name in PressureWriteText GravityLensText TuningForkText LetterpressText; do
  echo "== $name =="
  grep -n "$name" src/lib/animations.ts src/lib/animations-docs.tsx
done
```

Expected: each name shows exactly 3 matching lines total — 2 in `animations.ts` (the `import` line and the `component:` field) and 1 in `animations-docs.tsx` (the `SOURCE_FILES` value) — confirming every new component is wired into both the catalog and the docs source map.

- [ ] **Step 5: Review full diff**

```bash
git status
git diff --stat HEAD~4
```

Expected: only the files touched across Tasks 1–4 appear (4 new component files, `src/lib/animations.ts`, `src/lib/animations-docs.tsx`); nothing unrelated was modified.
