"use client";

import { RevealText, type RevealBaseProps } from "../lib/reveal";

export type FocusPullVariant = "center" | "start" | "end";

export interface FocusPullProps extends RevealBaseProps {
  /** Where focus lands first: the middle letter, the first or the last. */
  variant?: FocusPullVariant;
  /** Starting blur in px. */
  blur?: number;
}

/**
 * Focus racks across the word like a camera lens. Letters start soft and slightly too large,
 * then sharpen in order from the focal point outward.
 */
export function FocusPull({ variant = "center", blur = 14, stagger = 0.045, duration = 0.9, ...props }: FocusPullProps) {
  return (
    <RevealText
      by="chars"
      order={variant}
      stagger={stagger}
      duration={duration}
      hidden={{ opacity: 0.15, filter: `blur(${blur}px)`, scale: 1.25 }}
      partStyle={{ transformOrigin: "50% 60%" }}
      {...props}
    />
  );
}

export default FocusPull;
