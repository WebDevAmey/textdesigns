"use client";

import { RevealText, type RevealBaseProps } from "../lib/reveal";

export type LineRevealVariant = "rise" | "mask" | "tilt";

export interface LineRevealProps extends RevealBaseProps {
  /** rise lifts each line out of a clip, mask uncovers it top to bottom, tilt swings it up on a hinge. */
  variant?: LineRevealVariant;
}

/**
 * Lines lift in one after another. Lines are measured from the real layout and re-measured
 * when the container resizes, so the reveal always follows how the text actually wraps.
 */
export function LineReveal({ variant = "rise", ...props }: LineRevealProps) {
  if (variant === "mask") {
    return <RevealText by="lines" hidden={{ clipPath: "inset(0% 0% 100% 0%)", y: "0.2em" }} shown={{ clipPath: "inset(0% 0% 0% 0%)", y: 0 }} {...props} />;
  }
  if (variant === "tilt") {
    return (
      <RevealText
        by="lines"
        hidden={{ rotateX: -75, y: "0.4em", opacity: 0 }}
        partStyle={{ transformOrigin: "50% 0%", transformPerspective: 600 }}
        {...props}
      />
    );
  }
  return <RevealText by="lines" clip hidden={{ y: "105%" }} {...props} />;
}

export default LineReveal;
