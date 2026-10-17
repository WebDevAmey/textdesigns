"use client";

import { useEffect, useState, type CSSProperties, type ElementType } from "react";
import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { srOnly } from "../lib/a11y";
import { spring } from "../lib/motion-tokens";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type WordRotatorVariant = "slide" | "blur" | "flip";

export interface WordRotatorProps {
  words: string[];
  /** How each word arrives. */
  variant?: WordRotatorVariant;
  /** Seconds each word stays. */
  interval?: number;
  /** Pause while hovered or focused. */
  pauseOnHover?: boolean;
  /** What screen readers hear. Defaults to every word in order. */
  label?: string;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

// Full transform strings, so entering and leaving words can run on the compositor.
const MOTION: Record<WordRotatorVariant, { initial: TargetAndTransition; rest: TargetAndTransition; exit: TargetAndTransition }> = {
  slide: { initial: { transform: "translateY(100%)", opacity: 0 }, rest: { transform: "translateY(0%)", opacity: 1 }, exit: { transform: "translateY(-100%)", opacity: 0 } },
  blur: { initial: { opacity: 0, filter: "blur(8px)" }, rest: { opacity: 1, filter: "blur(0px)" }, exit: { opacity: 0, filter: "blur(8px)" } },
  flip: { initial: { transform: "rotateX(-90deg)", opacity: 0 }, rest: { transform: "rotateX(0deg)", opacity: 1 }, exit: { transform: "rotateX(90deg)", opacity: 0 } },
};

/**
 * Cycles words in a sentence while the width follows, so the words around it slide to make room
 * instead of jumping.
 */
export function WordRotator({ words, variant = "slide", interval = 2.4, pauseOnHover = true, label, as: Tag = "span", reducedMotion = "user", className, style }: WordRotatorProps) {
  const reduced = useReduced(reducedMotion);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval * 1000);
    return () => clearInterval(id);
  }, [reduced, paused, words.length, interval]);

  const spoken = label ?? words.join(", ");
  if (reduced) {
    return (
      <Tag className={className} style={style}>
        <span style={srOnly}>{spoken}</span>
        <span aria-hidden="true">{words[0]}</span>
      </Tag>
    );
  }

  const m = MOTION[variant];
  const hover = pauseOnHover ? { onPointerEnter: () => setPaused(true), onPointerLeave: () => setPaused(false), onFocus: () => setPaused(true), onBlur: () => setPaused(false) } : {};
  return (
    <Tag className={className} style={style} {...hover}>
      <span style={srOnly}>{spoken}</span>
      <motion.span
        aria-hidden="true"
        layout
        transition={spring.smooth}
        style={{ position: "relative", display: "inline-flex", justifyContent: "center", verticalAlign: "bottom", overflow: variant === "slide" ? "hidden" : "visible", perspective: variant === "flip" ? 500 : undefined, padding: "0 0.05em" }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={index}
            initial={m.initial}
            animate={m.rest}
            exit={m.exit}
            transition={spring.smooth}
            style={{ display: "inline-block", whiteSpace: "nowrap" }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </Tag>
  );
}

export default WordRotator;
