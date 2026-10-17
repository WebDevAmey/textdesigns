"use client";

import { RevealText, type RevealBaseProps } from "../lib/reveal";

export type BlurRevealVariant = "word" | "char" | "line";

export interface BlurRevealProps extends RevealBaseProps {
  /** word sharpens each word, char each letter, line each measured line. */
  variant?: BlurRevealVariant;
  /** Starting blur in px. */
  blur?: number;
}

const BY = { word: "words", char: "chars", line: "lines" } as const;

/** Words sharpen into focus. Opacity leads so the copy reads before the blur has fully cleared. */
export function BlurReveal({ variant = "word", blur = 12, ...props }: BlurRevealProps) {
  return (
    <RevealText
      by={BY[variant]}
      hidden={{ opacity: 0, filter: `blur(${blur}px)`, y: variant === "char" ? "0.1em" : "0.18em" }}
      {...props}
    />
  );
}

export default BlurReveal;
