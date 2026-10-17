"use client";

import { RevealText, type RevealBaseProps } from "../lib/reveal";

export type WordRevealVariant = "rise" | "fall" | "scale";

export interface WordRevealProps extends RevealBaseProps {
  /** rise comes up from below the line, fall drops in from above, scale grows from the baseline. */
  variant?: WordRevealVariant;
}

const HIDDEN = {
  rise: { y: "110%" },
  fall: { y: "-110%" },
  scale: { scale: 0.4, opacity: 0, y: "20%" },
} as const;

/** Words rise out of a clip, one after another. The clip keeps descenders and leaves layout untouched. */
export function WordReveal({ variant = "rise", ...props }: WordRevealProps) {
  return (
    <RevealText
      by="words"
      clip={variant !== "scale"}
      hidden={HIDDEN[variant]}
      partStyle={variant === "scale" ? { transformOrigin: "50% 100%" } : undefined}
      {...props}
    />
  );
}

export default WordReveal;
