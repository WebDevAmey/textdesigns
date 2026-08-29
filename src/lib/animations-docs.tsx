import type { ComponentType } from "react";
import { animations } from "@/lib/animations";

export interface DocPropRow {
  prop: string;
  type: string;
  default: string;
  description: string;
}

export interface AnimationDoc {
  slug: string;
  name: string;
  description: string;
  interactions: string[];
  previewText: string;
  component: ComponentType<{ text: string; containerRef?: React.RefObject<HTMLDivElement | null> }> | null;
  props: DocPropRow[];
  /** File (relative to src/components/text/) whose source is shown. */
  sourceFile?: string;
  /** Full source of the implementation, populated by the server page. */
  source?: string;
  /** Whether the preview should be replayed on a loop. */
  replays?: boolean;
  /** Extra props passed to the component in the preview. */
  previewProps?: Record<string, unknown>;
  /** Animation category. */
  category?: string;
}

export type DocIcon = "type" | "reveal" | "hover" | "loop" | "scroll";

export interface DocGroup {
  label: string;
  icon: DocIcon;
  docs: AnimationDoc[];
}

const textProp: DocPropRow[] = [
  {
    prop: "text",
    type: "string",
    default: "—",
    description: "Text rendered by the animation",
  },
];

const SOURCE_FILES: Record<string, string> = {
  gravity: "GravityText.tsx",
  "character-blur": "CharacterBlur.tsx",
  "3d-flip": "FlipText.tsx",
  fade: "FadeText.tsx",
  wave: "WaveText.tsx",
  scramble: "ScrambleText.tsx",
  glitch: "GlitchText.tsx",
  scale: "ScaleText.tsx",
  "word-reveal": "WordReveal.tsx",
  "character-reveal": "CharacterReveal.tsx",
  blur: "BlurText.tsx",
  "collapse-text": "CollapseText.tsx",
  "line-reveal": "LineReveal.tsx",
  decrypt: "DecryptText.tsx",
  "stroke-draw": "StrokedrawText.tsx",
  "cinematic-zoom": "CinematicZoomText.tsx",
  "path-entrance": "PathEntranceText.tsx",
  "particle-text": "ParticleText.tsx",
  highlighter: "HighlighterText.tsx",
  cascade: "CascadeText.tsx",
  chromatic: "ChromaticText.tsx",
  "apple-hello": "AppleHelloText.tsx",
  magnetic: "MagneticText.tsx",
  "hover-distort": "HoverDistortText.tsx",
  liquid: "LiquidText.tsx",
  displacement: "DisplacementText.tsx",
  "kinetic-drag": "KineticDragText.tsx",
  "magnetic-shatter": "MagneticInkShatter.tsx",
  "flux-glyphs": "MagneticFluxText.tsx",
  typewriter: "TypewriterText.tsx",
  "text-trail": "TextTrail.tsx",
  "text-melt": "TextMelt.tsx",
  typequake: "TypequakeText.tsx",
  marquee: "MarqueeText.tsx",
  shimmer: "ShimmerText.tsx",
  gradient: "GradientText.tsx",
  morphing: "MorphingText.tsx",
  bounce: "BounceText.tsx",
  "neon-flicker": "NeonFlickerText.tsx",
  "constellation-breathe": "ConstellationBreathe.tsx",
  "circular-text": "CircularText.tsx",
  "scroll-reveal": "ScrollReveal.tsx",
  "scroll-skew": "ScrollSkewText.tsx",
  letterpress: "LetterpressText.tsx",
  gooey: "GooeyText.tsx",
  vaporize: "VaporizeText.tsx",
  "text-roll": "TextRoll.tsx",
  "cascade-hover": "TextRevealHover.tsx",
  "text-marquee": "TextMarqueeWrapper.tsx",
  "text-split": "TextSplitWrapper.tsx",
  "text-loop": "TextLoopWrapper.tsx",
};

const fromLibrary = (slug: string, component: ComponentType<{ text: string; containerRef?: React.RefObject<HTMLDivElement | null> }>, name: string, description: string, category: string, infinite?: boolean, previewProps?: Record<string, unknown>): AnimationDoc => ({
  slug,
  name,
  description,
  interactions: category === "hover" ? ["Move"] : [],
  previewText:
    slug === "stroke-draw"
      ? "Stroke"
      : slug === "flux-glyphs"
          ? "GLYPHS"
          : slug === "particle-text"
            ? "Particle"
            : slug === "text-roll"
              ? "Follow your Gut"
              : slug === "text-disperse"
                ? "Disperse"
                : slug === "cinematic-zoom"
                  ? "Cinematic"
                  : slug === "magnetic-shatter"
                    ? "Shatter"
                    : name,
  component,
  props: textProp,
  sourceFile: SOURCE_FILES[slug],
  replays: !infinite,
  previewProps,
  category,
});

const libraryGroups = (
  [
    ["reveal", "Reveals", "reveal"] as const,
    ["hover", "Hover", "hover"] as const,
    ["loop", "Loops", "loop"] as const,
    ["scroll", "Scroll", "scroll"] as const,
  ] as const
).map(([key, label, icon]) => ({
  label,
  icon: icon as DocIcon,
  docs: animations
    .filter((a) => a.category === key)
    .map((a) =>
      fromLibrary(a.slug, a.component, a.name, a.description, a.category, a.infinite, a.preview)
    ),
}));

export const docGroups: DocGroup[] = [
  { label: "Text Animations", icon: "type", docs: [] },
  ...libraryGroups,
];