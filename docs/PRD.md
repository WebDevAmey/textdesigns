# TextLab — Text Animation & Interaction Library

## Product Requirements Document (PRD)

---

## 1. Executive Summary

TextLab is a production-grade, mathematically-designed text animation and interaction library built with React, Next.js, and Tailwind CSS. It serves as both a **component library** and an **interactive documentation platform** for text-based animations.

**Core Value Proposition:**
> Design is not decoration applied after implementation. Design is a system of relationships. Mathematics is not decoration either. It should explain why the system behaves the way it does.

---

## 2. Technical Stack

### 2.1 Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | App Router, RSC, Server Components |
| React | 19.x | UI primitives, concurrent features |
| TypeScript | 5.x | Type safety, developer experience |

### 2.2 Styling & UI
| Technology | Purpose |
|------------|---------|
| Tailwind CSS 4 | Utility-first styling |
| shadcn/ui | Base component system (base-nova style) |
| beui.dev | Advanced motion components (MorphingSearch, etc.) |
| WatermelonUI | Additional UI primitives |
| VengeanceUI | Animation utilities |

### 2.3 Animation Libraries
| Technology | Purpose |
|------------|---------|
| Framer Motion / Motion | Declarative animations, layout animations |
| GSAP | Complex timeline animations, ScrollTrigger |
| SplitType | Text splitting (chars, words, lines) |

### 2.4 Development Tools
| Technology | Purpose |
|------------|---------|
| Turbopack | Fast builds, HMR |
| ESLint | Code quality |
| Prettier | Code formatting |

---

## 3. Architecture

### 3.1 Project Structure
```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with fonts, providers
│   ├── globals.css              # Design tokens, base styles
│   ├── page.tsx                 # Landing page
│   ├── animations/
│   │   └── page.tsx             # Animation showcase (SSR)
│   └── experiments/
│       └── page.tsx             # Experimental animations
│
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── text-disperse.tsx    # Reusable animation components
│   │   ├── text-roll.tsx
│   │   ├── cascade-text.tsx
│   │   └── ...
│   │
│   ├── text/                    # Animation library wrappers
│   │   ├── TextDisperse.tsx     # Wrapper for animation registry
│   │   ├── TextRoll.tsx
│   │   ├── CascadeHover.tsx
│   │   ├── WaveText.tsx
│   │   ├── FadeText.tsx
│   │   └── ... (50+ animations)
│   │
│   ├── animations/              # Documentation system
│   │   ├── AnimationDocs.tsx    # Main docs container
│   │   ├── DocsNav.tsx          # Navigation with MorphingSearch
│   │   ├── AnimationCard.tsx    # Animation preview cards
│   │   └── DocsSidebar.tsx      # Sidebar navigation
│   │
│   └── motion/                  # Third-party motion components
│       └── morphing-search.tsx  # beui.dev search component
│
├── lib/
│   ├── utils.ts                 # cn() utility
│   ├── ease.ts                  # Animation easing functions
│   ├── animations.ts            # Animation registry
│   ├── animations-docs.tsx      # Documentation metadata
│   ├── design-tokens.ts         # Mathematical design tokens
│   └── text-physics/            # Physics-based animations
│       ├── physics.ts
│       ├── noise.ts
│       └── geometry.ts
│
└── hooks/                       # Custom React hooks
    ├── use-animation.ts
    └── use-reduced-motion.ts
```

### 3.2 Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Animation Registry                        │
│  animations.ts → Central source of truth for all animations │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Animation Wrappers                        │
│  components/text/*.tsx → Props interface + default values    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    UI Components                             │
│  components/ui/*.tsx → Reusable, standalone components      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Documentation                             │
│  animations-docs.tsx → Metadata, preview text, source files │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Design System — Mathematical Foundations

### 4.1 Base Unit System
```css
:root {
  --unit: 4px;  /* Base unit for all spacing */
}
```

All spacing values are multiples of the base unit:
| Token | Value | Usage |
|-------|-------|-------|
| --space-1 | 4px | Micro spacing |
| --space-2 | 8px | Tight spacing |
| --space-3 | 12px | Small spacing |
| --space-4 | 16px | Default spacing |
| --space-6 | 24px | Medium spacing |
| --space-8 | 32px | Large spacing |
| --space-10 | 40px | XL spacing |
| --space-12 | 48px | 2XL spacing |
| --space-16 | 64px | Section spacing |
| --space-20 | 80px | Large section spacing |
| --space-32 | 128px | Page section spacing |

### 4.2 Typography Scale (Major Third: 1.25)
```css
:root {
  --text-xs: 0.64rem;    /* 10.24px */
  --text-sm: 0.8rem;     /* 12.8px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.25rem;    /* 20px */
  --text-xl: 1.563rem;   /* 25px */
  --text-2xl: 1.953rem;  /* 31.25px */
  --text-3xl: 2.441rem;  /* 39.06px */
  --text-4xl: 3.052rem;  /* 48.83px */
  --text-5xl: 3.815rem;  /* 61.04px */
  --text-6xl: 4.768rem;  /* 76.29px */
  --text-7xl: 5.96rem;   /* 95.37px */
  --text-8xl: 7.451rem;  /* 119.22px */
}
```

### 4.3 Animation Timing Scale
```css
:root {
  /* Durations */
  --duration-instant: 0ms;
  --duration-micro: 75ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-moderate: 500ms;
  --duration-slow: 750ms;
  --duration-dramatic: 1000ms;
  --duration-cinematic: 1500ms;

  /* Stagger intervals */
  --stagger-micro: 10ms;
  --stagger-fast: 25ms;
  --stagger-normal: 40ms;
  --stagger-moderate: 60ms;
  --stagger-slow: 80ms;
  --stagger-dramatic: 100ms;
}
```

### 4.4 Easing Functions
```css
:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-out-back: cubic-bezier(0.33, 1, 0.68, 1);
  --ease-in-out-quart: cubic-bezier(0.76, 0, 0.24, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 5. Animation Categories

### 5.1 Reveal Animations
Character/word reveal on page load or scroll.

| Animation | Model | Parameters |
|-----------|-------|------------|
| Gravity | Physics-based fall | gravity, bounce, stagger |
| Character Blur | Blur + fade | blur, duration, stagger |
| 3D Flip | rotateX transform | duration, stagger, perspective |
| Fade | Opacity + y offset | duration, delay, easing |
| Wave | sin(i × φ) | amplitude, frequency, stagger |
| Scale | Scale from 0 | duration, stagger, easing |
| Word Reveal | Word-by-word | duration, stagger |
| Character Reveal | Char-by-char | duration, stagger, offset |
| Blur | Gaussian blur | duration, blur amount |
| Collapse | Scatter + reconstruct | phases, easing |
| Line Reveal | Line-by-line | duration, stagger |
| Decrypt | Glyph cycling | duration, chars |
| Stroke Draw | SVG path animation | duration, delay |
| Letter Shuffle | Position swap | duration, stagger |
| Cascade | Spring bounce | fall distance, stagger |

### 5.2 Hover Animations
Interactive animations triggered by cursor.

| Animation | Model | Parameters |
|-----------|-------|------------|
| Magnetic | Distance-based repulsion | radius, strength, damping |
| Hover Distort | Cursor tracking | intensity, radius |
| Liquid | Ripple effect | amplitude, frequency |
| Displacement | Force field | radius, strength |
| Kinetic Drag | Drag + momentum | friction, return speed |
| Magnetic Shatter | Chromatic split | intensity, shards |
| Flux Glyphs | Particle system | density, flow |
| Gooey | Morph + blur | morph amount, duration |
| Text Disperse | Scatter on hover | transforms, easing |
| Cascade Hover | Staggered rise | stagger, duration |
| Text Roll | 3D rotateX flip | duration, stagger |

### 5.3 Loop Animations
Continuous animations.

| Animation | Model | Parameters |
|-----------|-------|------------|
| Typewriter | Sequential reveal | speed, pause, delete |
| Text Trail | Temporal echoes | trail length, fade |
| Text Melt | Deformation | amplitude, frequency |
| Typequake | Shockwave | intensity, speed |
| Marquee | Horizontal scroll | speed, direction |
| Shimmer | Gradient sweep | duration, colors |
| Gradient | Color flow | colors, speed |
| Morphing | Word crossfade | words, duration |
| Constellation | Scatter + arrange | spring, weight |
| Circular | Rotation | speed, radius |
| Bounce | Vertical oscillation | height, frequency |
| Neon | Glow flicker | intensity, stutter |

### 5.4 Scroll Animations
Triggered by scroll position.

| Animation | Model | Parameters |
|-----------|-------|------------|
| Scroll Reveal | Viewport entry | splitBy, duration |
| Scroll Skew | Velocity-based | intensity, damping |
| Letterpress | Ink stamp | intensity, spread |

---

## 6. Mathematical Animation Models

### 6.1 Wave Animation
```typescript
// y(i, t) = A × sin(ωt + iφ)
function wavePosition(
  index: number,
  time: number,
  amplitude: number,
  frequency: number,
  phase: number
): number {
  return amplitude * Math.sin(frequency * time + index * phase);
}
```

### 6.2 Stagger Delay
```typescript
// delay(i) = i × Δt
function staggerDelay(index: number, interval: number): number {
  return index * interval;
}
```

### 6.3 Distance Falloff
```typescript
// strength = max(0, 1 - distance / radius)
function distanceFalloff(distance: number, radius: number): number {
  return Math.max(0, 1 - distance / radius);
}
```

### 6.4 Golden Ratio Composition
```typescript
const PHI = 1.618;

function goldenSpacing(base: number): number {
  return base * PHI;
}
```

---

## 7. Scaling Architecture

### 7.1 Component Registry Pattern
```typescript
// animations.ts - Central registry
export const animations = [
  {
    name: "Wave",
    slug: "wave",
    category: "reveal",
    description: "Characters move through a smooth wave.",
    component: WaveText,
    infinite: false,
    code: `<WaveText text="Wave" />`,
  },
  // ... 50+ animations
];
```

**Benefits:**
- Single source of truth
- Easy to add/remove animations
- Automatic documentation generation
- Type-safe props

### 7.2 Wrapper Pattern
```typescript
// components/text/WaveText.tsx
export default function WaveText({ text }: WaveTextProps) {
  return (
    <WaveTextUI
      amplitude={40}      /* 10 × unit */
      frequency={0.8}
      stagger={0.04}      /* stagger-normal */
    >
      {text}
    </WaveTextUI>
  );
}
```

**Benefits:**
- Decouples animation logic from UI
- Enables preview customization
- Simplifies testing

### 7.3 Documentation Auto-Generation
```typescript
// animations-docs.tsx
const SOURCE_FILES: Record<string, string> = {
  wave: "WaveText.tsx",
  fade: "FadeText.tsx",
  // ... auto-generated from registry
};

export const docGroups = animations
  .filter(a => a.category === "reveal")
  .map(a => ({
    ...a,
    sourceFile: SOURCE_FILES[a.slug],
  }));
```

---

## 8. Reliability Patterns

### 8.1 Reduced Motion Support
```typescript
const reduceMotion = useReducedMotion();

gsap.from(chars, {
  opacity: 0,
  duration: reduceMotion ? 0 : 1,
  stagger: reduceMotion ? 0 : 0.05,
});
```

### 8.2 Error Boundaries
```typescript
<ErrorBoundary fallback={<AnimationFallback />}>
  <AnimationComponent />
</ErrorBoundary>
```

### 8.3 Performance Optimization
```typescript
// Memoize animation components
const TextReveal = React.memo(function TextReveal({ text }) {
  // ...
});

// Use will-change for GPU acceleration
<span style={{ willChange: "transform" }} />

// Lazy load heavy animations
const ParticleText = dynamic(() => import("./ParticleText"), {
  loading: () => <div className="h-20" />,
});
```

### 8.4 SSR Safety
```typescript
// Check for browser APIs
if (typeof window !== "undefined") {
  // Client-side animation init
}

// Use useEffect for client-only code
useEffect(() => {
  const timeline = gsap.timeline();
  // ...
}, []);
```

---

## 9. Integration with Third-Party Libraries

### 9.1 beui.dev Components
```typescript
// MorphingSearch for command palette
import { MorphingSearch } from "@/components/motion/morphing-search";

<MorphingSearch
  items={searchItems}
  placeholder="Search animations…"
  shortcut="k"
  centered
/>
```

### 9.2 WatermelonUI Integration
```typescript
// Future: WatermelonUI components
import { WatermelonButton } from "@watermelon-ui/button";
import { WatermelonCard } from "@watermelon-ui/card";
```

### 9.3 VengeanceUI Integration
```typescript
// Future: VengeanceUI animation utilities
import { useVengeanceSpring } from "@vengeance-ui/spring";
import { VengeanceParticle } from "@vengeance-ui/particle";
```

---

## 10. Performance Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Animation Frame Rate | 60fps | Chrome DevTools |
| Bundle Size (initial) | < 100KB | Webpack Bundle Analyzer |
| Animation Count | 50+ | Registry count |

---

## 11. Accessibility Requirements

### 11.1 Reduced Motion
- All animations respect `prefers-reduced-motion`
- Use `useReducedMotion()` hook from Framer Motion
- Provide instant alternatives for all animations

### 11.2 Screen Readers
- All interactive elements have `aria-label`
- Decorative animations have `aria-hidden="true"`
- Text alternatives provided for all visual content

### 11.3 Keyboard Navigation
- All interactive animations keyboard accessible
- Focus indicators visible
- Tab order logical

---

## 12. Future Roadmap

### Phase 1: Core Library (Current)
- [x] 50+ text animations
- [x] Mathematical design system
- [x] Documentation platform
- [x] Search functionality

### Phase 2: Advanced Features
- [ ] Scroll-triggered animations
- [ ] GSAP ScrollTrigger integration
- [ ] Physics-based particles
- [ ] WebGL text effects

### Phase 3: Enterprise Features
- [ ] Animation builder UI
- [ ] Export as CodePen/CodeSandbox
- [ ] Animation marketplace
- [ ] Team collaboration

### Phase 4: Platform Expansion
- [ ] Framer Motion template pack
- [ ] After Effects export
- [ ] Lottie integration
- [ ] Rive support

---

## 13. Success Metrics

| Metric | Target | Current |
|--------|--------|---------|
| GitHub Stars | 1000+ | TBD |
| Weekly Downloads | 1000+ | TBD |
| Animation Count | 50+ | 50+ |
| Documentation Coverage | 100% | 100% |
| TypeScript Coverage | 100% | 100% |
| Test Coverage | 80% | TBD |

---

## 14. Conclusion

TextLab is designed to be the definitive text animation library for React applications. By building on mathematical foundations, maintaining strict design consistency, and leveraging best-in-class libraries like shadcn/ui and beui.dev, it provides:

1. **Scalability** — Registry pattern allows unlimited animations
2. **Reliability** — Reduced motion, error boundaries, SSR safety
3. **Consistency** — Mathematical design tokens ensure visual harmony
4. **Developer Experience** — Type-safe, well-documented, easy to extend

The library follows the principle: **"Design is a system of relationships, not decoration."**

---

*Document Version: 1.0*
*Last Updated: August 2026*
*Author: TextLab Team*
