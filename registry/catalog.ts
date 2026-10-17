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
];

export const byName = (name: string) => catalog.find((entry) => entry.name === name);
