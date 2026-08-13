# React Bits Effect Swaps & New GSAP Effects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace two hand-rolled `textlab` catalog effects (`RotateText`, `VariableText`) with their official `@react-bits` registry components, remove the resulting catalog duplication, and add five new widely-used GSAP-based effects to the catalog.

**Architecture:** `textlab` is a Next.js App Router gallery. Each effect is a self-contained client component under `src/components/text/` exposing a `{ text: string }` prop, registered in `src/lib/animations.ts` (`{ name, slug, description, component, code }`) and rendered generically by `AnimationCard` (`component: React.ComponentType<{ text: string }>`, replays on a 6s loop via `key={iteration}` remount). No component in this plan changes that contract.

**Tech Stack:** Next.js 16.3.0, React 19.2.8, TypeScript (strict), Tailwind CSS v4, GSAP 3.15.0 (`gsap` + `@gsap/react`) with all bonus plugins bundled free (`ScrollTrigger`, `Flip`, `Draggable`, `InertiaPlugin`, `MotionPathPlugin` all present under `node_modules/gsap/`), `motion` (Framer Motion, `^12.43.0`), `shadcn` CLI configured with a `@react-bits` registry (`https://reactbits.dev/r/{name}.json`) in `components.json`.

## Global Constraints

- Package manager is `pnpm`. Run all installs via `pnpm dlx shadcn@latest add ...` from the `textlab/` directory.
- No test runner is configured in this project (`package.json` has no `test` script, no jest/vitest/testing-library deps). Verification for every task is: (1) `npx tsc --noEmit` clean, (2) `pnpm lint` clean, (3) a manual visual check on the running dev server (`pnpm dev`) at `/animations`, using the concrete pass criteria given in each task instead of automated test assertions.
- Every effect component keeps the `{ text: string }` prop contract so `AnimationCard`'s `React.ComponentType<{ text: string }>` typing keeps compiling with no changes to `AnimationCard.tsx`.
- Follow the codebase's existing component convention for GSAP effects: `"use client"`, `gsap.registerPlugin(useGSAP, ...)`, `useGSAP(() => { ... })` with no dependency array, `SplitType` for char-level splits, cleanup via `split.revert()` in the returned cleanup function, root element `<h1 ref={...} className="inline-block">{text}</h1>` unless a wrapper is structurally required (see `FlipText.tsx`'s `perspective-[600px]` wrapper for precedent).
- `@react-bits` registry components install as **untyped `.jsx`** files under a **subfolder matching the component name** (confirmed by fetching the registry JSON: `RotatingText-JS-CSS` and `VariableProximity-JS-CSS` both declare paths like `RotatingText/RotatingText.jsx`, not a flat file). Add a hand-written sibling `.d.ts` for each so TypeScript imports stay typed, matching the pattern already used for the (now-stale) flat `RotatingText.d.ts`.

---

### Task 1: Refresh `RotatingText` and rewire `RotateText.tsx` to the word-cycling effect

**Files:**
- Run install: `pnpm dlx shadcn@latest add @react-bits/RotatingText-JS-CSS` (creates `src/components/RotatingText/RotatingText.jsx` and `src/components/RotatingText/RotatingText.css`)
- Create: `src/components/RotatingText/RotatingText.d.ts`
- Delete: `src/components/RotatingText.jsx`, `src/components/RotatingText.css`, `src/components/RotatingText.d.ts` (stale flat copies, superseded by the subfolder install)
- Modify: `src/components/text/RotateText.tsx` (full rewrite)

**Interfaces:**
- Consumes: none from other tasks.
- Produces: `RotateText` default export with signature `({ text }: { text: string }) => JSX.Element`, unchanged from before — Task 2 relies on this still being the `component` wired to the "Rotate" catalog entry in `animations.ts`.

- [ ] **Step 1: Run the install command**

```bash
cd textlab
pnpm dlx shadcn@latest add @react-bits/RotatingText-JS-CSS
```

Expected: creates `src/components/RotatingText/RotatingText.jsx` and `src/components/RotatingText/RotatingText.css`. If prompted about overwriting `motion` version, accept the default (already-installed `motion@^12.43.0` satisfies the registry's `^12.23.12` requirement).

- [ ] **Step 2: Delete the stale flat files**

```bash
rm src/components/RotatingText.jsx src/components/RotatingText.css src/components/RotatingText.d.ts
```

- [ ] **Step 3: Add typed declarations for the new subfolder location**

Create `src/components/RotatingText/RotatingText.d.ts`:

```ts
import type { CSSProperties } from "react";

interface RotatingTextProps {
  texts: string[];
  transition?: object;
  initial?: object;
  animate?: object;
  exit?: object;
  animatePresenceMode?: "sync" | "wait" | "popLayout";
  animatePresenceInitial?: boolean;
  rotationInterval?: number;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  loop?: boolean;
  auto?: boolean;
  splitBy?: string;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  style?: CSSProperties;
}

declare const RotatingText: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<RotatingTextProps> & React.RefAttributes<unknown>
>;

export default RotatingText;
```

- [ ] **Step 4: Rewrite `RotateText.tsx`**

Replace the full contents of `src/components/text/RotateText.tsx`:

```tsx
"use client";

import { useMemo } from "react";
import RotatingText from "@/components/RotatingText/RotatingText";

interface RotateTextProps {
  text: string;
}

export default function RotateText({ text }: RotateTextProps) {
  const { staticWord, texts } = useMemo(() => {
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length <= 1) {
      return { staticWord: words[0] ?? "", texts: [text] };
    }
    return { staticWord: words[0], texts: words.slice(1) };
  }, [text]);

  return (
    <span className="inline-flex items-baseline gap-2">
      <span>{staticWord}</span>
      <RotatingText texts={texts} />
    </span>
  );
}
```

- [ ] **Step 5: Type-check and lint**

```bash
npx tsc --noEmit
pnpm lint
```

Expected: both clean, no errors referencing `RotateText.tsx` or `RotatingText`.

- [ ] **Step 6: Visual check**

```bash
pnpm dev
```

Open `http://localhost:3000/animations`, find the **Rotate** card. Expected: shows "Rotate" as a static word followed by a second element that vertically cycles (springs up/out and a new one springs in) roughly every 2 seconds — the same visual behavior currently seen on the **Rotating Word** card (still present until Task 2). Stop the dev server after confirming.

- [ ] **Step 7: Commit**

```bash
git add src/components/RotatingText src/components/text/RotateText.tsx
git rm src/components/RotatingText.jsx src/components/RotatingText.css src/components/RotatingText.d.ts
git commit -m "feat: rewire RotateText to the react-bits word-cycling effect"
```

---

### Task 2: Remove the now-duplicate "Rotating Word" catalog entry

**Files:**
- Delete: `src/components/text/RotatingTextCard.tsx`
- Modify: `src/lib/animations.ts:30` (remove import), `src/lib/animations.ts:77-82` (update "Rotate" entry), `src/lib/animations.ts:241-248` (remove "Rotating Word" entry)

**Interfaces:**
- Consumes: `RotateText` from Task 1 (`src/components/text/RotateText.tsx`, default export `({ text }: { text: string }) => JSX.Element`).
- Produces: none consumed by later tasks.

- [ ] **Step 1: Delete `RotatingTextCard.tsx`**

```bash
rm src/components/text/RotatingTextCard.tsx
```

- [ ] **Step 2: Remove its import from `animations.ts`**

In `src/lib/animations.ts`, delete line 30:

```ts
import RotatingTextCard from "@/components/text/RotatingTextCard";
```

- [ ] **Step 3: Update the "Rotate" entry's description and add a `code` sample**

Replace the existing "Rotate" entry (currently):

```ts
  {
    name: "Rotate",
    slug: "rotate",
    description: "Characters rotate into their final position.",
    component: RotateText,
  },
```

with:

```ts
  {
    name: "Rotate",
    slug: "rotate",
    description:
      "A static word paired with a second word that rotates vertically through a list.",
    component: RotateText,
    code: `<RotateText text="Rotate into place" />`,
  },
```

- [ ] **Step 4: Remove the "Rotating Word" entry**

Delete this whole object from the `animations` array in `src/lib/animations.ts`:

```ts
{
  name: "Rotating Word",
  slug: "rotating-word",
  description:
    "A static word paired with a second word that cycles vertically through a list.",
  component: RotatingTextCard,
  code: `<span className="inline-flex items-baseline gap-2">We build <RotatingText texts={["websites", "products", "brands"]} /></span>`,
},
```

- [ ] **Step 5: Type-check and lint**

```bash
npx tsc --noEmit
pnpm lint
```

Expected: both clean — no unresolved `RotatingTextCard` import, no unused-import warnings.

- [ ] **Step 6: Visual check**

```bash
pnpm dev
```

At `http://localhost:3000/animations`: confirm there is exactly one card named **Rotate** (showing the word-cycling behavior from Task 1) and no card named **Rotating Word**.

- [ ] **Step 7: Commit**

```bash
git add src/lib/animations.ts
git rm src/components/text/RotatingTextCard.tsx
git commit -m "refactor: remove duplicate Rotating Word catalog entry"
```

---

### Task 3: Replace `VariableText.tsx` internals with the installed `VariableProximity` component

**Files:**
- Run install: `pnpm dlx shadcn@latest add @react-bits/VariableProximity-JS-CSS` (creates `src/components/VariableProximity/VariableProximity.jsx` and `src/components/VariableProximity/VariableProximity.css`)
- Create: `src/components/VariableProximity/VariableProximity.d.ts`
- Modify: `src/components/text/VariableText.tsx` (full rewrite)

**Interfaces:**
- Consumes: none from other tasks.
- Produces: `VariableProximityText` default export with signature `({ text, radius, falloff }: { text: string; radius?: number; falloff?: "linear" | "exponential" | "gaussian" }) => JSX.Element` — unchanged public shape from before (radius/falloff prop names and defaults match what `src/lib/animations.ts:262-263` already expects, so no catalog changes are needed in this task).

- [ ] **Step 1: Run the install command**

```bash
pnpm dlx shadcn@latest add @react-bits/VariableProximity-JS-CSS
```

Expected: creates `src/components/VariableProximity/VariableProximity.jsx` and `src/components/VariableProximity/VariableProximity.css`.

- [ ] **Step 2: Add typed declarations**

Create `src/components/VariableProximity/VariableProximity.d.ts`:

```ts
import type { CSSProperties, MouseEventHandler, RefObject } from "react";

interface VariableProximityProps {
  label: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  containerRef: RefObject<HTMLElement | null>;
  radius?: number;
  falloff?: "linear" | "exponential" | "gaussian";
  className?: string;
  onClick?: MouseEventHandler<HTMLSpanElement>;
  style?: CSSProperties;
}

declare const VariableProximity: React.ForwardRefExoticComponent<
  React.PropsWithoutRef<VariableProximityProps> & React.RefAttributes<HTMLSpanElement>
>;

export default VariableProximity;
```

- [ ] **Step 3: Rewrite `VariableText.tsx`**

Replace the full contents of `src/components/text/VariableText.tsx`:

```tsx
"use client";

import { useRef } from "react";
import VariableProximity from "@/components/VariableProximity/VariableProximity";

interface VariableProximityTextProps {
  text: string;
  radius?: number;
  falloff?: "linear" | "exponential" | "gaussian";
}

export default function VariableProximityText({
  text,
  radius = 120,
  falloff = "gaussian",
}: VariableProximityTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative inline-block">
      <VariableProximity
        label={text}
        className="inline-block"
        fromFontVariationSettings="'wght' 400, 'opsz' 8"
        toFontVariationSettings="'wght' 1000, 'opsz' 144"
        containerRef={containerRef}
        radius={radius}
        falloff={falloff}
      />
    </div>
  );
}
```

Note: `VariableProximity`'s internal animation loop early-returns whenever `containerRef.current` is falsy, so the `containerRef` prop is required for the effect to run at all (not optional set-dressing) — this is why the wrapper creates and attaches its own ref rather than relying on the component's forwarded `ref`.

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

At `http://localhost:3000/animations`, find the **Variable Text** card. Expected: letters visually thicken/widen as the cursor passes near them and relax back as it moves away — same behavior as before, now backed by the installed component (which also pulls in the Roboto Flex variable font itself via its CSS, so the effect is visible regardless of the page's default font).

- [ ] **Step 6: Commit**

```bash
git add src/components/VariableProximity src/components/text/VariableText.tsx
git commit -m "feat: rewire VariableText to the react-bits VariableProximity component"
```

---

### Task 4: Add the "Scroll Skew" effect

**Files:**
- Create: `src/components/text/ScrollSkewText.tsx`
- Modify: `src/lib/animations.ts` (add import, add catalog entry)

**Interfaces:**
- Consumes: none.
- Produces: `ScrollSkewText` default export, `({ text }: { text: string }) => JSX.Element`.

- [ ] **Step 1: Create the component**

Create `src/components/text/ScrollSkewText.tsx`:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ScrollSkewTextProps {
  text: string;
}

export default function ScrollSkewText({ text }: ScrollSkewTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const skewTo = gsap.quickTo(textRef.current, "skewY", {
      duration: 0.4,
      ease: "power3.out",
    });
    const clampSkew = gsap.utils.clamp(-16, 16);

    const trigger = ScrollTrigger.create({
      onUpdate: (self) => skewTo(clampSkew(self.getVelocity() / -300)),
    });

    const resetSkew = () => skewTo(0);
    ScrollTrigger.addEventListener("scrollEnd", resetSkew);

    return () => {
      trigger.kill();
      ScrollTrigger.removeEventListener("scrollEnd", resetSkew);
    };
  });

  return (
    <h1 ref={textRef} className="inline-block will-change-transform">
      {text}
    </h1>
  );
}
```

- [ ] **Step 2: Register it in the catalog**

In `src/lib/animations.ts`, add the import alongside the others near the top:

```ts
import ScrollSkewText from "@/components/text/ScrollSkewText";
```

Add this entry to the end of the `animations` array (before the closing `];`):

```ts
{
  name: "Scroll Skew",
  slug: "scroll-skew",
  description:
    "Text skews with scroll velocity and snaps back level when scrolling stops.",
  component: ScrollSkewText,
  code: `<ScrollSkewText text="Scroll Skew" />`,
},
```

- [ ] **Step 3: Type-check and lint**

```bash
npx tsc --noEmit
pnpm lint
```

Expected: both clean.

- [ ] **Step 4: Visual check**

```bash
pnpm dev
```

At `http://localhost:3000/animations`, find the **Scroll Skew** card and scroll the page up and down. Expected: the card's text visibly skews in the direction of scroll while scrolling, and returns to level shortly after you stop scrolling.

- [ ] **Step 5: Commit**

```bash
git add src/components/text/ScrollSkewText.tsx src/lib/animations.ts
git commit -m "feat: add Scroll Skew text effect"
```

---

### Task 5: Add the "Letter Shuffle" effect

**Files:**
- Create: `src/components/text/LetterShuffleText.tsx`
- Modify: `src/lib/animations.ts` (add import, add catalog entry)

**Interfaces:**
- Consumes: none.
- Produces: `LetterShuffleText` default export, `({ text }: { text: string }) => JSX.Element`.

- [ ] **Step 1: Create the component**

Create `src/components/text/LetterShuffleText.tsx`:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Flip } from "gsap/Flip";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, Flip);

interface LetterShuffleTextProps {
  text: string;
}

export default function LetterShuffleText({ text }: LetterShuffleTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    gsap.set(chars, {
      x: () => gsap.utils.random(-120, 120),
      y: () => gsap.utils.random(-60, 60),
      rotation: () => gsap.utils.random(-90, 90),
      opacity: 0,
    });

    const state = Flip.getState(chars);

    gsap.set(chars, { x: 0, y: 0, rotation: 0, opacity: 1 });

    Flip.from(state, {
      targets: chars,
      duration: 0.8,
      stagger: 0.03,
      ease: "power3.out",
    });

    return () => {
      split.revert();
    };
  });

  return (
    <h1 ref={textRef} className="inline-block">
      {text}
    </h1>
  );
}
```

- [ ] **Step 2: Register it in the catalog**

In `src/lib/animations.ts`, add the import:

```ts
import LetterShuffleText from "@/components/text/LetterShuffleText";
```

Add this entry to the end of the `animations` array:

```ts
{
  name: "Letter Shuffle",
  slug: "letter-shuffle",
  description:
    "Characters shuffle from randomized positions into their correct reading order.",
  component: LetterShuffleText,
  code: `<LetterShuffleText text="Letter Shuffle" />`,
},
```

- [ ] **Step 3: Type-check and lint**

```bash
npx tsc --noEmit
pnpm lint
```

Expected: both clean.

- [ ] **Step 4: Visual check**

```bash
pnpm dev
```

At `http://localhost:3000/animations`, find the **Letter Shuffle** card. Expected: on each replay, letters appear scattered around the final text with random rotation, then snap-animate into their correct positions and orientation, forming "Letter Shuffle".

- [ ] **Step 5: Commit**

```bash
git add src/components/text/LetterShuffleText.tsx src/lib/animations.ts
git commit -m "feat: add Letter Shuffle text effect"
```

---

### Task 6: Add the "Kinetic Drag" effect

**Files:**
- Create: `src/components/text/KineticDragText.tsx`
- Modify: `src/lib/animations.ts` (add import, add catalog entry)

**Interfaces:**
- Consumes: none.
- Produces: `KineticDragText` default export, `({ text }: { text: string }) => JSX.Element`.

- [ ] **Step 1: Create the component**

Create `src/components/text/KineticDragText.tsx`:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin);

interface KineticDragTextProps {
  text: string;
}

export default function KineticDragText({ text }: KineticDragTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    const draggables = Draggable.create(chars, {
      type: "x,y",
      inertia: true,
      cursor: "grab",
      activeCursor: "grabbing",
      onThrowComplete() {
        gsap.to(this.target, {
          x: 0,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.35)",
        });
      },
    });

    return () => {
      draggables.forEach((instance) => instance.kill());
      split.revert();
    };
  });

  return (
    <h1 ref={textRef} className="inline-block cursor-grab select-none">
      {text}
    </h1>
  );
}
```

- [ ] **Step 2: Register it in the catalog**

In `src/lib/animations.ts`, add the import:

```ts
import KineticDragText from "@/components/text/KineticDragText";
```

Add this entry to the end of the `animations` array:

```ts
{
  name: "Kinetic Drag",
  slug: "kinetic-drag",
  description:
    "Characters can be dragged and flicked with momentum, drifting back into place.",
  component: KineticDragText,
  code: `<KineticDragText text="Kinetic Drag" />`,
},
```

- [ ] **Step 3: Type-check and lint**

```bash
npx tsc --noEmit
pnpm lint
```

Expected: both clean.

- [ ] **Step 4: Visual check**

```bash
pnpm dev
```

At `http://localhost:3000/animations`, find the **Kinetic Drag** card. Expected: individual letters can be clicked-and-dragged (cursor shows a grab hand); flicking one and releasing gives it momentum before it eases back to its original position.

- [ ] **Step 5: Commit**

```bash
git add src/components/text/KineticDragText.tsx src/lib/animations.ts
git commit -m "feat: add Kinetic Drag text effect"
```

---

### Task 7: Add the "Cinematic Zoom" effect

**Files:**
- Create: `src/components/text/CinematicZoomText.tsx`
- Modify: `src/lib/animations.ts` (add import, add catalog entry)

**Interfaces:**
- Consumes: none.
- Produces: `CinematicZoomText` default export, `({ text }: { text: string }) => JSX.Element`.

- [ ] **Step 1: Create the component**

Create `src/components/text/CinematicZoomText.tsx`:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface CinematicZoomTextProps {
  text: string;
}

export default function CinematicZoomText({ text }: CinematicZoomTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    gsap.from(textRef.current, {
      scale: 3.2,
      opacity: 0,
      filter: "blur(20px)",
      transformOrigin: "50% 50%",
      duration: 1.4,
      ease: "power3.out",
    });
  });

  return (
    <div className="perspective-[800px]">
      <h1 ref={textRef} className="inline-block">
        {text}
      </h1>
    </div>
  );
}
```

- [ ] **Step 2: Register it in the catalog**

In `src/lib/animations.ts`, add the import:

```ts
import CinematicZoomText from "@/components/text/CinematicZoomText";
```

Add this entry to the end of the `animations` array:

```ts
{
  name: "Cinematic Zoom",
  slug: "cinematic-zoom",
  description:
    "The whole line zooms in from a distance with a soft blur, like a camera pulling into focus.",
  component: CinematicZoomText,
  code: `<CinematicZoomText text="Cinematic Zoom" />`,
},
```

- [ ] **Step 3: Type-check and lint**

```bash
npx tsc --noEmit
pnpm lint
```

Expected: both clean.

- [ ] **Step 4: Visual check**

```bash
pnpm dev
```

At `http://localhost:3000/animations`, find the **Cinematic Zoom** card. Expected: on each replay, the text starts large, blurred and transparent, then shrinks, sharpens, and fades in to its normal size — a single smooth block-level move, not per-character.

- [ ] **Step 5: Commit**

```bash
git add src/components/text/CinematicZoomText.tsx src/lib/animations.ts
git commit -m "feat: add Cinematic Zoom text effect"
```

---

### Task 8: Add the "Path Entrance" effect

**Files:**
- Create: `src/components/text/PathEntranceText.tsx`
- Modify: `src/lib/animations.ts` (add import, add catalog entry)

**Interfaces:**
- Consumes: none.
- Produces: `PathEntranceText` default export, `({ text }: { text: string }) => JSX.Element`.

- [ ] **Step 1: Create the component**

Create `src/components/text/PathEntranceText.tsx`:

```tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP, MotionPathPlugin);

interface PathEntranceTextProps {
  text: string;
}

export default function PathEntranceText({ text }: PathEntranceTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    chars.forEach((char, i) => {
      const startX = gsap.utils.random(-200, 200);
      const startY = gsap.utils.random(-150, -60);

      gsap.set(char, { x: startX, y: startY, opacity: 0 });

      gsap.to(char, {
        motionPath: {
          path: [
            { x: startX, y: startY },
            { x: startX * 0.4, y: startY * 0.4 - 30 },
            { x: 0, y: 0 },
          ],
          curviness: 1.5,
        },
        opacity: 1,
        duration: 1.1,
        delay: i * 0.035,
        ease: "power2.inOut",
      });
    });

    return () => {
      split.revert();
    };
  });

  return (
    <h1 ref={textRef} className="inline-block">
      {text}
    </h1>
  );
}
```

- [ ] **Step 2: Register it in the catalog**

In `src/lib/animations.ts`, add the import:

```ts
import PathEntranceText from "@/components/text/PathEntranceText";
```

Add this entry to the end of the `animations` array:

```ts
{
  name: "Path Entrance",
  slug: "path-entrance",
  description:
    "Characters travel in along a curved motion path before settling into the final line.",
  component: PathEntranceText,
  code: `<PathEntranceText text="Path Entrance" />`,
},
```

- [ ] **Step 3: Type-check and lint**

```bash
npx tsc --noEmit
pnpm lint
```

Expected: both clean.

- [ ] **Step 4: Visual check**

```bash
pnpm dev
```

At `http://localhost:3000/animations`, find the **Path Entrance** card. Expected: on each replay, characters swoop in one after another along a visibly curved trajectory (not a straight line) and settle into "Path Entrance".

- [ ] **Step 5: Commit**

```bash
git add src/components/text/PathEntranceText.tsx src/lib/animations.ts
git commit -m "feat: add Path Entrance text effect"
```

---

### Task 9: Final integration pass

**Files:** none created — verification only.

**Interfaces:**
- Consumes: everything from Tasks 1–8.
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
- Exactly 36 cards total (31 original − 1 removed "Rotating Word" + 1 renamed-in-place "Rotate" + 5 new = 36... i.e. one fewer than before this plan started, plus five new ones).
- **Rotate** shows the word-cycling behavior; no **Rotating Word** card exists.
- **Variable Text** still shows the cursor-proximity thickening effect.
- **Scroll Skew**, **Letter Shuffle**, **Kinetic Drag**, **Cinematic Zoom**, **Path Entrance** each behave per their Task 4–8 visual checks.
- No console errors in the browser devtools while scrolling through the whole grid.

- [ ] **Step 3: Confirm no orphaned references**

```bash
grep -rn "RotatingTextCard" src/ || echo "clean"
grep -rn "components/RotatingText\"" src/ || echo "clean"
```

Expected: both print `clean` (no matches to the deleted card component or the old flat import path).

- [ ] **Step 4: Review full diff**

```bash
git status
git diff --stat HEAD~9
```

Expected: only the files touched across Tasks 1–8 appear; nothing unrelated was modified.
