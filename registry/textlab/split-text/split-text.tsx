"use client";

import type { TargetAndTransition } from "motion/react";
import { RevealText, type RevealBaseProps, type RevealOrder } from "../lib/reveal";
import type { SplitBy } from "../lib/split";

export type SplitTextVariant = "chars" | "words" | "lines";
export type SplitTextPreset = "fade-up" | "fade-down" | "zoom" | "blur" | "flip";

export interface SplitTextProps extends RevealBaseProps {
  /** How the text is split. lines are measured from layout and re-measured on resize. */
  variant?: SplitTextVariant;
  /** A named starting pose. Ignored when `from` is set. */
  preset?: SplitTextPreset;
  /** Full control over where each part starts. Receives the part index and count when a function. */
  from?: TargetAndTransition | ((index: number, total: number) => TargetAndTransition);
  /** Which part moves first. */
  order?: RevealOrder;
  /** Clip each part so it appears out of nothing. */
  clip?: boolean;
}

const PRESETS: Record<SplitTextPreset, TargetAndTransition> = {
  "fade-up": { opacity: 0, y: "0.4em" },
  "fade-down": { opacity: 0, y: "-0.4em" },
  zoom: { opacity: 0, scale: 0.6 },
  blur: { opacity: 0, filter: "blur(8px)" },
  flip: { opacity: 0, rotateX: 90 },
};

/**
 * Stagger anything by chars, words or lines. The escape hatch under every reveal: pick a split,
 * a starting pose and an order, and it handles screen readers, line detection and reduced motion.
 */
export function SplitText({ variant = "words", preset = "fade-up", from, order = "start", clip = false, ...props }: SplitTextProps) {
  const by: SplitBy = variant;
  return (
    <RevealText
      by={by}
      order={order}
      clip={clip}
      hidden={from ?? PRESETS[preset]}
      partStyle={preset === "flip" && !from ? { transformPerspective: 500, transformOrigin: "50% 100%" } : undefined}
      {...props}
    />
  );
}

export default SplitText;
