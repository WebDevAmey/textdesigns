import type { ComponentType } from "react";
import TypewriterText from "@/components/text/TypewriterText";
import GravityText from "@/components/text/GravityText";
import CollapseText from "@/components/text/CollapseText";
import DecryptText from "@/components/text/DecryptText";
import PixelMemoryText from "@/components/text/PixelMemoryText";
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
  component: ComponentType<{ text: string }> | null;
  props: DocPropRow[];
  /** File (relative to src/components/text/) whose source is shown. */
  sourceFile?: string;
  /** Full source of the implementation, populated by the server page. */
  source?: string;
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
  rotate: "RotateText.tsx",
  scale: "ScaleText.tsx",
  "word-reveal": "WordReveal.tsx",
  "character-reveal": "CharacterReveal.tsx",
  blur: "BlurText.tsx",
  "collapse-text": "CollapseText.tsx",
  "text-tides": "TideText.tsx",
  "line-reveal": "LineReveal.tsx",
  decrypt: "DecryptText.tsx",
  "stroke-draw": "StrokedrawText.tsx",
  "letter-shuffle": "LetterShuffleText.tsx",
  shuffle: "ShuffleText.tsx",
  "cinematic-zoom": "CinematicZoomText.tsx",
  "path-entrance": "PathEntranceText.tsx",
  magnetic: "MagneticText.tsx",
  "hover-distort": "HoverDistortText.tsx",
  liquid: "LiquidText.tsx",
  displacement: "DisplacementText.tsx",
  "kinetic-drag": "KineticDragText.tsx",
  "magnetic-shatter": "MagneticInkShatter.tsx",
  typewriter: "TypewriterText.tsx",
  "text-trail": "TextTrail.tsx",
  "text-melt": "TextMelt.tsx",
  typequake: "TypequakeText.tsx",
  marquee: "MarqueeText.tsx",
  shimmer: "ShimmerText.tsx",
  "constellation-breathe": "ConstellationBreathe.tsx",
  "circular-text": "CircularText.tsx",
  "scroll-reveal": "ScrollReveal.tsx",
  "scroll-skew": "ScrollSkewText.tsx",
};

const fromLibrary = (slug: string, component: ComponentType<{ text: string }>, name: string, description: string, category: string): AnimationDoc => ({
  slug,
  name,
  description,
  interactions: category === "hover" ? ["Move"] : [],
  previewText: name,
  component,
  props: textProp,
  sourceFile: SOURCE_FILES[slug],
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
    .map((a) => fromLibrary(a.slug, a.component, a.name, a.description, a.category)),
}));

const experiments: AnimationDoc[] = [
  {
    slug: "living-typography",
    name: "Living Typography",
    description:
      "The line types itself character by character, hesitates, then deletes and starts again — a caret blinking like a slow heartbeat.",
    interactions: [],
    previewText: "Living Typography",
    component: TypewriterText,
    props: textProp,
    sourceFile: "TypewriterText.tsx",
  },
  {
    slug: "gravity-well",
    name: "Gravity Well",
    description:
      "Characters fall out of the sky and settle into place, bouncing softly. The whole word lands with weight.",
    interactions: [],
    previewText: "Gravity",
    component: GravityText,
    props: textProp,
    sourceFile: "GravityText.tsx",
  },
  {
    slug: "collapse-reconstruction",
    name: "Collapse / Reconstruction",
    description:
      "The word crushes itself toward a single point, then reconstructs from nothing — entropy in reverse.",
    interactions: [],
    previewText: "Reconstruct",
    component: CollapseText,
    props: textProp,
    sourceFile: "CollapseText.tsx",
  },
  {
    slug: "neural-type",
    name: "Neural Type",
    description:
      "Glyphs scramble through noise and resolve one character at a time, as if a network is recalling the word.",
    interactions: [],
    previewText: "NEURAL",
    component: DecryptText,
    props: [
      ...textProp,
      {
        prop: "duration",
        type: "number",
        default: "1.6",
        description: "Seconds until the text fully resolves",
      },
      {
        prop: "glyphs",
        type: "string",
        default: "!<>-_\\/[]{}—…",
        description: "Character set scrambled during resolution",
      },
    ],
    sourceFile: "DecryptText.tsx",
  },
  {
    slug: "pixel-memory",
    name: "Pixel Memory",
    description:
      "The word is drawn as a field of pixels that remember their place. Move the cursor to sweep them out of order.",
    interactions: ["Move"],
    previewText: "PIXEL",
    component: PixelMemoryText,
    props: [
      ...textProp,
      {
        prop: "particleSize",
        type: "number",
        default: "5",
        description: "Grid spacing between pixels, in px",
      },
      {
        prop: "interactionRadius",
        type: "number",
        default: "140",
        description: "Radius within which the cursor disturbs pixels",
      },
      {
        prop: "fontSize",
        type: "number",
        default: "140",
        description: "Font size of the sampled word",
      },
    ],
    sourceFile: "MagneticFluxText.tsx",
  },
  {
    slug: "future-experiment",
    name: "Future Experiment",
    description:
      "The next experiment in the pipeline. The slot is reserved — check back soon.",
    interactions: [],
    previewText: "Coming Soon",
    component: null,
    props: [],
  },
];

export const docGroups: DocGroup[] = [
  { label: "Text Animations", icon: "type", docs: experiments },
  ...libraryGroups,
];