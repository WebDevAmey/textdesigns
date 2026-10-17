import type { ComponentMeta } from "./types";
import { meta as blurReveal } from "./textlab/blur-reveal/meta";
import { meta as wordReveal } from "./textlab/word-reveal/meta";
import { meta as lineReveal } from "./textlab/line-reveal/meta";
import { meta as charReveal } from "./textlab/char-reveal/meta";
import { meta as wipeReveal } from "./textlab/wipe-reveal/meta";
import { meta as inViewTitle } from "./textlab/in-view-title/meta";
import { meta as splitText } from "./textlab/split-text/meta";
import { meta as trackingReveal } from "./textlab/tracking-reveal/meta";
import { meta as sliceReveal } from "./textlab/slice-reveal/meta";
import { meta as focusPull } from "./textlab/focus-pull/meta";
import { meta as rollingNumber } from "./textlab/rolling-number/meta";
import { meta as odometer } from "./textlab/odometer/meta";
import { meta as splitFlap } from "./textlab/split-flap/meta";
import { meta as priceTicker } from "./textlab/price-ticker/meta";
import { meta as countdown } from "./textlab/countdown/meta";
import { meta as statReveal } from "./textlab/stat-reveal/meta";
import { meta as typewriter } from "./textlab/typewriter/meta";
import { meta as scrambleText } from "./textlab/scramble-text/meta";
import { meta as hoverScramble } from "./textlab/hover-scramble/meta";
import { meta as matrixDecode } from "./textlab/matrix-decode/meta";
import { meta as textMorph } from "./textlab/text-morph/meta";
import { meta as wordRotator } from "./textlab/word-rotator/meta";
import { meta as caretMorph } from "./textlab/caret-morph/meta";
import { meta as gradientText } from "./textlab/gradient-text/meta";
import { meta as shimmerText } from "./textlab/shimmer-text/meta";
import { meta as neonText } from "./textlab/neon-text/meta";
import { meta as auroraText } from "./textlab/aurora-text/meta";
import { meta as holoText } from "./textlab/holo-text/meta";
import { meta as spotlightText } from "./textlab/spotlight-text/meta";
import { meta as glassText } from "./textlab/glass-text/meta";
import { meta as emberText } from "./textlab/ember-text/meta";
import { meta as gooeyText } from "./textlab/gooey-text/meta";
import { meta as liquidText } from "./textlab/liquid-text/meta";
import { meta as inkBleed } from "./textlab/ink-bleed/meta";
import { meta as chromaticText } from "./textlab/chromatic-text/meta";
import { meta as glitchText } from "./textlab/glitch-text/meta";
import { meta as heatHaze } from "./textlab/heat-haze/meta";
import { meta as scrollFill } from "./textlab/scroll-fill/meta";
import { meta as scrollSkew } from "./textlab/scroll-skew/meta";
import { meta as velocityMarquee } from "./textlab/velocity-marquee/meta";
import { meta as scrollStretch } from "./textlab/scroll-stretch/meta";
import { meta as depthLayers } from "./textlab/depth-layers/meta";
import { meta as outlineDraw } from "./textlab/outline-draw/meta";
import { meta as signature } from "./textlab/signature/meta";
import { meta as markerHighlight } from "./textlab/marker-highlight/meta";
import { meta as underlineDraw } from "./textlab/underline-draw/meta";
import { meta as strikeThrough } from "./textlab/strike-through/meta";
import { meta as circleAnnotate } from "./textlab/circle-annotate/meta";
import { meta as magneticText } from "./textlab/magnetic-text/meta";
import { meta as variableProximity } from "./textlab/variable-proximity/meta";
import { meta as cursorTrail } from "./textlab/cursor-trail/meta";
import { meta as flipRoll } from "./textlab/flip-roll/meta";
import { meta as tiltText } from "./textlab/tilt-text/meta";
import { meta as extrudeText } from "./textlab/extrude-text/meta";
import { meta as letterDrop } from "./textlab/letter-drop/meta";
import { meta as elasticText } from "./textlab/elastic-text/meta";
import { meta as jellyText } from "./textlab/jelly-text/meta";
import { meta as waveText } from "./textlab/wave-text/meta";
import { meta as breathingText } from "./textlab/breathing-text/meta";
import { meta as pathText } from "./textlab/path-text/meta";
import { meta as asciiText } from "./textlab/ascii-text/meta";
import { meta as ditherText } from "./textlab/dither-text/meta";
import { meta as pixelSort } from "./textlab/pixel-sort/meta";
import { meta as particleText } from "./textlab/particle-text/meta";
import { meta as shaderRipple } from "./textlab/shader-ripple/meta";

/** Every component, in sidebar order within its category. */
export const catalog: ComponentMeta[] = [
  blurReveal,
  wordReveal,
  lineReveal,
  charReveal,
  wipeReveal,
  inViewTitle,
  splitText,
  trackingReveal,
  sliceReveal,
  focusPull,
  rollingNumber,
  odometer,
  splitFlap,
  priceTicker,
  countdown,
  statReveal,
  typewriter,
  scrambleText,
  hoverScramble,
  matrixDecode,
  textMorph,
  wordRotator,
  caretMorph,
  gradientText,
  shimmerText,
  neonText,
  auroraText,
  holoText,
  spotlightText,
  glassText,
  emberText,
  gooeyText,
  liquidText,
  inkBleed,
  chromaticText,
  glitchText,
  heatHaze,
  scrollFill,
  scrollSkew,
  velocityMarquee,
  scrollStretch,
  depthLayers,
  outlineDraw,
  signature,
  markerHighlight,
  underlineDraw,
  strikeThrough,
  circleAnnotate,
  magneticText,
  variableProximity,
  cursorTrail,
  flipRoll,
  tiltText,
  extrudeText,
  letterDrop,
  elasticText,
  jellyText,
  waveText,
  breathingText,
  pathText,
  asciiText,
  ditherText,
  pixelSort,
  particleText,
  shaderRipple,
];

export const byName = (name: string) => catalog.find((entry) => entry.name === name);
