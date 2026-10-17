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
];

export const byName = (name: string) => catalog.find((entry) => entry.name === name);
