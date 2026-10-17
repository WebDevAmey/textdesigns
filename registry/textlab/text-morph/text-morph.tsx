"use client";

import type { CSSProperties, ElementType } from "react";
import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { SrText } from "../lib/a11y";
import { spring } from "../lib/motion-tokens";
import { graphemes } from "../lib/split";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type TextMorphVariant = "slide" | "blur" | "flip";

export interface TextMorphProps {
  /** The current label. Change it and the letters morph. */
  text: string;
  /** How new letters arrive and old ones leave. Shared letters always glide. */
  variant?: TextMorphVariant;
  /** Announce changes to screen readers. */
  live?: boolean;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const ENTER: Record<TextMorphVariant, { from: TargetAndTransition; exit: TargetAndTransition }> = {
  slide: { from: { opacity: 0, y: "0.35em" }, exit: { opacity: 0, y: "-0.35em" } },
  blur: { from: { opacity: 0, filter: "blur(6px)", scale: 0.9 }, exit: { opacity: 0, filter: "blur(6px)", scale: 0.9 } },
  flip: { from: { opacity: 0, rotateX: -90 }, exit: { opacity: 0, rotateX: 90 } },
};

/** Key each letter by itself and its occurrence, so the second "o" in "loop" stays the second "o". */
function keyed(text: string) {
  const seen = new Map<string, number>();
  return graphemes(text).map((char) => {
    const n = seen.get(char) ?? 0;
    seen.set(char, n + 1);
    return { char, key: `${char}-${n}` };
  });
}

/**
 * One word turns into the next, letter by letter. Letters both words share glide to their new
 * place (FLIP via layout animation); the rest leave and arrive in place.
 */
export function TextMorph({ text, variant = "slide", live = true, as: Tag = "span", reducedMotion = "user", className, style }: TextMorphProps) {
  const reduced = useReduced(reducedMotion);
  if (reduced) {
    return (
      <Tag className={className} style={style} aria-live={live ? "polite" : undefined}>
        {text}
      </Tag>
    );
  }
  const { from, exit } = ENTER[variant];
  return (
    <Tag className={className} style={{ display: "inline-flex", whiteSpace: "pre", ...style }}>
      <SrText>
        <span aria-live={live ? "polite" : undefined}>{text}</span>
      </SrText>
      <motion.span aria-hidden="true" layout style={{ display: "inline-flex", perspective: variant === "flip" ? 400 : undefined }} transition={spring.smooth}>
        <AnimatePresence mode="popLayout" initial={false}>
          {keyed(text).map(({ char, key }) => (
            <motion.span
              key={key}
              layout="position"
              initial={from}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1, rotateX: 0 }}
              exit={{ ...exit, transition: { duration: 0.15 } }}
              transition={spring.smooth}
              style={{ display: "inline-block" }}
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </AnimatePresence>
      </motion.span>
    </Tag>
  );
}

export default TextMorph;
