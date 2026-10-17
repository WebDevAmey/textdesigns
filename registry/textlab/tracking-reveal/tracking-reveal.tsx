"use client";

import { RevealText, type RevealBaseProps } from "../lib/reveal";

export type TrackingRevealVariant = "open" | "close";

export interface TrackingRevealProps extends RevealBaseProps {
  /** open starts tightly packed and breathes out; close starts spread wide and gathers in. */
  variant?: TrackingRevealVariant;
  /** How far each letter travels per step from the center, in em. */
  spread?: number;
}

/**
 * Letter spacing breathes open as the word appears. Letters move with transforms from the
 * text's center instead of animating letter-spacing, so nothing reflows.
 */
export function TrackingReveal({ variant = "open", spread = 0.08, duration = 1.1, ease = "emphasized", ...props }: TrackingRevealProps) {
  const sign = variant === "open" ? -1 : 1.6;
  return (
    <RevealText
      by="chars"
      stagger={0}
      duration={duration}
      ease={ease}
      hidden={(i, total) => ({ x: `${(i - (total - 1) / 2) * spread * sign}em`, opacity: 0, filter: "blur(4px)" })}
      {...props}
    />
  );
}

export default TrackingReveal;
