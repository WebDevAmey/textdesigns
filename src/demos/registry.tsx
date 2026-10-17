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
};

/** Custom demos for components that need a stage: scroll areas, changing values, controls. */
export const demos: Record<string, ComponentType<DemoProps>> = {
  "rolling-number": dynamic(() => import("./rolling-number")),
  "odometer": dynamic(() => import("./odometer")),
  "split-flap": dynamic(() => import("./split-flap")),
  "price-ticker": dynamic(() => import("./price-ticker")),
  "countdown": dynamic(() => import("./countdown")),
};

export interface DemoProps {
  variant: string;
  /** Props from the playground or preset. */
  props: Record<string, unknown>;
}
