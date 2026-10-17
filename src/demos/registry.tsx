"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyComponent = ComponentType<any>;

/** Each component, loaded only on the pages that show it. */
export const components: Record<string, AnyComponent> = {
  "blur-reveal": dynamic(() => import("@registry/textlab/blur-reveal/blur-reveal")),
  "word-reveal": dynamic(() => import("@registry/textlab/word-reveal/word-reveal")),
  "line-reveal": dynamic(() => import("@registry/textlab/line-reveal/line-reveal")),
  "char-reveal": dynamic(() => import("@registry/textlab/char-reveal/char-reveal")),
  "wipe-reveal": dynamic(() => import("@registry/textlab/wipe-reveal/wipe-reveal")),
  "in-view-title": dynamic(() => import("@registry/textlab/in-view-title/in-view-title")),
  "split-text": dynamic(() => import("@registry/textlab/split-text/split-text")),
  "tracking-reveal": dynamic(() => import("@registry/textlab/tracking-reveal/tracking-reveal")),
  "slice-reveal": dynamic(() => import("@registry/textlab/slice-reveal/slice-reveal")),
  "focus-pull": dynamic(() => import("@registry/textlab/focus-pull/focus-pull")),
  "rolling-number": dynamic(() => import("@registry/textlab/rolling-number/rolling-number")),
  "odometer": dynamic(() => import("@registry/textlab/odometer/odometer")),
  "split-flap": dynamic(() => import("@registry/textlab/split-flap/split-flap")),
  "price-ticker": dynamic(() => import("@registry/textlab/price-ticker/price-ticker")),
  "countdown": dynamic(() => import("@registry/textlab/countdown/countdown")),
  "stat-reveal": dynamic(() => import("@registry/textlab/stat-reveal/stat-reveal")),
  "typewriter": dynamic(() => import("@registry/textlab/typewriter/typewriter")),
  "scramble-text": dynamic(() => import("@registry/textlab/scramble-text/scramble-text")),
  "hover-scramble": dynamic(() => import("@registry/textlab/hover-scramble/hover-scramble")),
  "matrix-decode": dynamic(() => import("@registry/textlab/matrix-decode/matrix-decode")),
  "text-morph": dynamic(() => import("@registry/textlab/text-morph/text-morph")),
  "word-rotator": dynamic(() => import("@registry/textlab/word-rotator/word-rotator")),
  "caret-morph": dynamic(() => import("@registry/textlab/caret-morph/caret-morph")),
  "gradient-text": dynamic(() => import("@registry/textlab/gradient-text/gradient-text")),
  "shimmer-text": dynamic(() => import("@registry/textlab/shimmer-text/shimmer-text")),
  "neon-text": dynamic(() => import("@registry/textlab/neon-text/neon-text")),
  "aurora-text": dynamic(() => import("@registry/textlab/aurora-text/aurora-text")),
  "holo-text": dynamic(() => import("@registry/textlab/holo-text/holo-text")),
  "spotlight-text": dynamic(() => import("@registry/textlab/spotlight-text/spotlight-text")),
  "glass-text": dynamic(() => import("@registry/textlab/glass-text/glass-text")),
  "ember-text": dynamic(() => import("@registry/textlab/ember-text/ember-text")),
  "gooey-text": dynamic(() => import("@registry/textlab/gooey-text/gooey-text")),
  "liquid-text": dynamic(() => import("@registry/textlab/liquid-text/liquid-text")),
  "ink-bleed": dynamic(() => import("@registry/textlab/ink-bleed/ink-bleed")),
  "chromatic-text": dynamic(() => import("@registry/textlab/chromatic-text/chromatic-text")),
  "glitch-text": dynamic(() => import("@registry/textlab/glitch-text/glitch-text")),
  "heat-haze": dynamic(() => import("@registry/textlab/heat-haze/heat-haze")),
  "scroll-fill": dynamic(() => import("@registry/textlab/scroll-fill/scroll-fill")),
};

/** Custom demos for components that need a stage: scroll areas, changing values, controls. */
export const demos: Record<string, ComponentType<DemoProps>> = {
  "rolling-number": dynamic(() => import("./rolling-number")),
  "odometer": dynamic(() => import("./odometer")),
  "split-flap": dynamic(() => import("./split-flap")),
  "price-ticker": dynamic(() => import("./price-ticker")),
  "countdown": dynamic(() => import("./countdown")),
  "text-morph": dynamic(() => import("./text-morph")),
  "word-rotator": dynamic(() => import("./word-rotator")),
  "holo-text": dynamic(() => import("./holo-text")),
  "glass-text": dynamic(() => import("./glass-text")),
  "scroll-fill": dynamic(() => import("./scroll-fill")),
};

export interface DemoProps {
  variant: string;
  /** Props from the playground or preset. */
  props: Record<string, unknown>;
}
