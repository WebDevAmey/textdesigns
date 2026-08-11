import GravityText from "@/components/text/GravityText";
import CharacterBlur from "@/components/text/CharacterBlur";
import FlipText from "@/components/text/FlipText";
import FadeText from "@/components/text/FadeText";
import WaveText from "@/components/text/WaveText";
import ScrambleText from "@/components/text/ScrambleText";
import GlitchText from "@/components/text/GlitchText";
import TypewriterText from "@/components/text/TypewriterText";
import RotateText from "@/components/text/RotateText";
import ScaleText from "@/components/text/ScaleText";
import MagneticText from "@/components/text/MagneticText";
import WordReveal from "@/components/text/WordReveal";
import CharacterReveal from "@/components/text/CharacterReveal";
import BlurText from "@/components/text/BlurText";
import HoverDistortText from "@/components/text/HoverDistortText";
import CollapseText from "@/components/text/CollapseText";
import TideText from "@/components/text/TideText";

export const animations = [
  {
    name: "Gravity",
    slug: "gravity",
    description: "Characters fall and settle with physical motion.",
    component: GravityText,
  },
  {
    name: "Char Blur",
    slug: "character-blur",
    description: "Characters emerge from a soft blur.",
    component: CharacterBlur,
  },
  {
    name: "3D Flip",
    slug: "3d-flip",
    description: "Characters rotate into view in 3D.",
    component: FlipText,
  },
  {
    name: "Fade",
    slug: "fade",
    description: "A clean character-by-character fade.",
    component: FadeText,
  },
  {
    name: "Wave",
    slug: "wave",
    description: "Characters move through a smooth wave.",
    component: WaveText,
  },
  {
    name: "Scramble",
    slug: "scramble",
    description: "Characters rapidly resolve into the final text.",
    component: ScrambleText,
  },
  {
    name: "Glitch",
    slug: "glitch",
    description: "A distorted glitch effect for expressive typography.",
    component: GlitchText,
  },
  {
    name: "Typewriter",
    slug: "typewriter",
    description: "Text appears progressively like a typewriter.",
    component: TypewriterText,
  },
  {
    name: "Rotate",
    slug: "rotate",
    description: "Characters rotate into their final position.",
    component: RotateText,
  },
  {
    name: "Scale",
    slug: "scale",
    description: "Characters smoothly scale into view.",
    component: ScaleText,
  },
  {
    name: "Magnetic",
    slug: "magnetic",
    description: "Characters react to the movement of the cursor.",
    component: MagneticText,
  },
  {
    name: "Word Reveal",
    slug: "word-reveal",
    description: "Words reveal themselves one at a time.",
    component: WordReveal,
  },
  {
    name: "Char Reveal",
    slug: "character-reveal",
    description: "Characters reveal themselves individually.",
    component: CharacterReveal,
  },
  {
    name: "Blur",
    slug: "blur",
    description: "Text transitions from blur into focus.",
    component: BlurText,
  },
  {
    name: "Hover Distort",
    slug: "hover-distort",
    description: "Typography distorts as you interact with it.",
    component: HoverDistortText,
  },

  {
    name: "Collapse Text",
    slug: "collapse-text",
    description:
      "Characters collapse towards a single point before reconstructing themselves.",
    component: CollapseText,
    code: `<CollapseText text="Collapse Text" />`,
  },
  {
  name: "Text Tides",
  slug: "text-tides",
  description:
    "A continuous wave travels through each character like a moving surface.",
  component: TideText,
  code: `<TideText text="Text Tides" />`,
},
];