import GravityText from "@/components/text/GravityText";
import CharacterBlur from "@/components/text/CharacterBlur";
import FlipText from "@/components/text/FlipText";
import FadeText from "@/components/text/FadeText";
import WaveText from "@/components/text/WaveText";
import ScrambleText from "@/components/text/ScrambleText";
import GlitchText from "@/components/text/GlitchText";
import RotateText from "@/components/text/RotateText";
import ScaleText from "@/components/text/ScaleText";
import MagneticText from "@/components/text/MagneticText";
import WordReveal from "@/components/text/WordReveal";
import CharacterReveal from "@/components/text/CharacterReveal";
import BlurText from "@/components/text/BlurText";
import HoverDistortText from "@/components/text/HoverDistortText";
import CollapseText from "@/components/text/CollapseText";
import TideText from "@/components/text/TideText";
import TypewriterText from "@/components/text/TypewriterText";
import LineReveal from "@/components/text/LineReveal";
import TextTrail from "@/components/text/TextTrail";
import TextMelt from "@/components/text/TextMelt";
import TypequakeText from "@/components/text/TypequakeText";
import LiquidText from "@/components/text/LiquidText";
import DisplacementText from "@/components/text/DisplacementText";
import ScrollReveal from "@/components/text/ScrollReveal";
import MarqueeText from "@/components/text/MarqueeText";
import ShimmerText from "@/components/text/ShimmerText";
import DecryptText from "@/components/text/DecryptText";
import StrokeDrawText from "@/components/text/StrokedrawText";
import ScrollSkewText from "@/components/text/ScrollSkewText";
import LetterShuffleText from "@/components/text/LetterShuffleText";
import KineticDragText from "@/components/text/KineticDragText";
import CinematicZoomText from "@/components/text/CinematicZoomText";
import PathEntranceText from "@/components/text/PathEntranceText";
import MagneticInkShatter from "@/components/text/MagneticInkShatter";
import ConstellationBreathe from "@/components/text/ConstellationBreathe";
import CircularText from "@/components/text/CircularText";
import ShuffleText from "@/components/text/ShuffleText";

export type AnimationCategory = "reveal" | "hover" | "loop" | "scroll";

export const animations = [
  {
    name: "Gravity",
    slug: "gravity",
    category: "reveal",
    description: "Characters fall and settle with physical motion.",
    component: GravityText,
  },
  {
    name: "Char Blur",
    slug: "character-blur",
    category: "reveal",
    description: "Characters emerge from a soft blur.",
    component: CharacterBlur,
  },
  {
    name: "3D Flip",
    slug: "3d-flip",
    category: "reveal",
    description: "Characters rotate into view in 3D.",
    component: FlipText,
  },
  {
    name: "Fade",
    slug: "fade",
    category: "reveal",
    description: "A clean character-by-character fade.",
    component: FadeText,
  },
  {
    name: "Wave",
    slug: "wave",
    category: "reveal",
    description: "Characters move through a smooth wave.",
    component: WaveText,
  },
  {
    name: "Scramble",
    slug: "scramble",
    category: "reveal",
    description: "Characters rapidly resolve into the final text.",
    component: ScrambleText,
  },
  {
    name: "Glitch",
    slug: "glitch",
    category: "reveal",
    description: "A distorted glitch effect for expressive typography.",
    component: GlitchText,
  },
  {
    name: "Rotate",
    slug: "rotate",
    category: "reveal",
    description: "Characters rotate into their final position.",
    component: RotateText,
  },
  {
    name: "Scale",
    slug: "scale",
    category: "reveal",
    description: "Characters smoothly scale into view.",
    component: ScaleText,
  },
  {
    name: "Word Reveal",
    slug: "word-reveal",
    category: "reveal",
    description: "Words reveal themselves one at a time.",
    component: WordReveal,
  },
  {
    name: "Char Reveal",
    slug: "character-reveal",
    category: "reveal",
    description: "Characters reveal themselves individually.",
    component: CharacterReveal,
  },
  {
    name: "Blur",
    slug: "blur",
    category: "reveal",
    description: "Text transitions from blur into focus.",
    component: BlurText,
  },
  {
    name: "Collapse Text",
    slug: "collapse-text",
    category: "reveal",
    description:
      "Characters collapse towards a single point before reconstructing themselves.",
    component: CollapseText,
    code: `<CollapseText text="Collapse Text" />`,
  },
  {
    name: "Text Tides",
    slug: "text-tides",
    category: "reveal",
    description:
      "A continuous wave travels through each character like a moving surface.",
    component: TideText,
    code: `<TideText text="Text Tides" />`,
  },
  {
    name: "Line Reveal",
    slug: "line-reveal",
    category: "reveal",
    description:
      "Text reveals line by line through individual clipping masks.",
    component: LineReveal,
    code: `<LineReveal text="Create beautiful text animations" />`,
  },
  {
    name: "Decrypt",
    slug: "decrypt",
    category: "reveal",
    description:
      "Characters cycle through random glyphs before locking into the final text.",
    component: DecryptText,
    code: `<DecryptText text="Decrypt" duration={1.6} />`,
  },
  {
    name: "Stroke Draw",
    slug: "stroke-draw",
    category: "reveal",
    description:
      "An SVG text outline draws itself using an animated stroke.",
    component: StrokeDrawText,
    code: `<StrokeDrawText text="Stroke Draw" fontSize={120} />`,
  },
  {
    name: "Letter Shuffle",
    slug: "letter-shuffle",
    category: "reveal",
    description:
      "Characters shuffle from randomized positions into their correct reading order.",
    component: LetterShuffleText,
    code: `<LetterShuffleText text="Letter Shuffle" />`,
  },
  {
    name: "Shuffle",
    slug: "shuffle",
    category: "reveal",
    description:
      "Characters start shuffled and swap places two at a time, sorting themselves into the correct word.",
    component: ShuffleText,
    code: `<ShuffleText text="Shuffle" />`,
  },
  {
    name: "Cinematic Zoom",
    slug: "cinematic-zoom",
    category: "reveal",
    description:
      "The whole line zooms in from a distance with a soft blur, like a camera pulling into focus.",
    component: CinematicZoomText,
    code: `<CinematicZoomText text="Cinematic Zoom" />`,
  },
  {
    name: "Path Entrance",
    slug: "path-entrance",
    category: "reveal",
    description:
      "Characters travel in along a curved motion path before settling into the final line.",
    component: PathEntranceText,
    code: `<PathEntranceText text="Path Entrance" />`,
  },
  {
    name: "Magnetic",
    slug: "magnetic",
    category: "hover",
    description: "Characters react to the movement of the cursor.",
    component: MagneticText,
  },
  {
    name: "Hover Distort",
    slug: "hover-distort",
    category: "hover",
    description: "Typography distorts as you interact with it.",
    component: HoverDistortText,
  },
  {
    name: "Liquid",
    slug: "liquid",
    category: "hover",
    description:
      "Letters melt and ripple like liquid as you hover over them.",
    component: LiquidText,
    code: `<LiquidText text="Liquid" />`,
  },
  {
    name: "Displacement",
    slug: "displacement",
    category: "hover",
    description:
      "Glyphs lift and warp away from the cursor with a soft falloff.",
    component: DisplacementText,
    code: `<DisplacementText text="Displacement" />`,
  },
  {
    name: "Kinetic Drag",
    slug: "kinetic-drag",
    category: "hover",
    description:
      "Characters can be dragged and flicked with momentum, drifting back into place.",
    component: KineticDragText,
    code: `<KineticDragText text="Kinetic Drag" />`,
  },
  {
    name: "Magnetic Shatter",
    slug: "magnetic-shatter",
    category: "hover",
    description:
      "Letters repel from the cursor with a velocity-driven chromatic split, and shatter into shards on click.",
    component: MagneticInkShatter,
    code: `<MagneticInkShatter text="Shatter" />`,
  },
  {
    name: "Typewriter",
    slug: "typewriter",
    category: "loop",
    description:
      "A natural typing and deletion effect with a blinking cursor.",
    component: TypewriterText,
    code: `<TypewriterText text="Typewriter" />`,
  },
  {
    name: "Text Trail",
    slug: "text-trail",
    category: "loop",
    description:
      "Characters leave behind fading temporal echoes as they move.",
    component: TextTrail,
    code: `<TextTrail text="Text Trail" />`,
  },
  {
    name: "Text Melt",
    slug: "text-melt",
    category: "loop",
    description:
      "Characters soften, stretch and melt before reforming into place.",
    component: TextMelt,
    code: `<TextMelt text="Text Melt" />`,
  },
  {
    name: "Typequake",
    slug: "typequake",
    category: "loop",
    description:
      "A travelling shockwave sends each character briefly out of position.",
    component: TypequakeText,
    code: `<TypequakeText text="Typequake" />`,
  },
  {
    name: "Marquee",
    slug: "marquee",
    category: "loop",
    description:
      "A continuously looping horizontal text banner.",
    component: MarqueeText,
    infinite: true,
    code: `<MarqueeText text="Marquee Text" speed={15} direction="left" />`,
  },
  {
    name: "Shimmer",
    slug: "shimmer",
    category: "loop",
    description:
      "A soft light gradient sweeps across the text on loop or hover.",
    component: ShimmerText,
    code: `<ShimmerText text="Shimmer" loop trigger="auto" />`,
  },
  {
    name: "Constellation",
    slug: "constellation-breathe",
    category: "loop",
    description:
      "Letters scatter into a springy arranging, flash connector lines between them, and breathe with variable-font weight.",
    component: ConstellationBreathe,
    code: `<ConstellationBreathe text="Assemble" />`,
  },
  {
    name: "Circular Text",
    slug: "circular-text",
    category: "loop",
    description:
      "Text laid out around a circle, continuously rotating like a spinning badge.",
    component: CircularText,
    infinite: true,
    code: `<CircularText text="Circular Text" />`,
  },
  {
    name: "Scroll Reveal",
    slug: "scroll-reveal",
    category: "scroll",
    description:
      "Lines or words fade and rise into view as they enter the viewport.",
    component: ScrollReveal,
    code: `<ScrollReveal text="Scroll Reveal" splitBy="lines" />`,
  },
  {
    name: "Scroll Skew",
    slug: "scroll-skew",
    category: "scroll",
    description:
      "Text skews with scroll velocity and snaps back level when scrolling stops.",
    component: ScrollSkewText,
    code: `<ScrollSkewText text="Scroll Skew" />`,
  },
];