"use client";

import { RevealText, type RevealBaseProps } from "../lib/reveal";

export type CharRevealVariant = "fade" | "drop" | "spin" | "scale";

export interface CharRevealProps extends RevealBaseProps {
  /** fade is quiet, drop falls into place, spin turns up from the baseline, scale pops from nothing. */
  variant?: CharRevealVariant;
}

const HIDDEN = {
  fade: { opacity: 0, y: "0.12em" },
  drop: { opacity: 0, y: "-0.7em" },
  spin: { opacity: 0, rotate: -90, scale: 0.5 },
  scale: { opacity: 0, scale: 0 },
} as const;

/** Letters arrive one at a time. Each word stays unbreakable so lines never reflow mid-animation. */
export function CharReveal({ variant = "fade", duration, ...props }: CharRevealProps) {
  return (
    <RevealText
      by="chars"
      hidden={HIDDEN[variant]}
      duration={duration ?? (variant === "fade" ? 0.6 : 0.7)}
      partStyle={variant === "spin" ? { transformOrigin: "0% 100%" } : variant === "scale" ? { transformOrigin: "50% 70%" } : undefined}
      {...props}
    />
  );
}

export default CharReveal;
