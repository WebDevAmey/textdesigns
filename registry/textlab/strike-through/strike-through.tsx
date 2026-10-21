"use client";

import type { CSSProperties, ElementType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { srOnly } from "../lib/a11y";
import { drawProps } from "../lib/draw";
import { hashString } from "../lib/math";
import { ease } from "../lib/motion-tokens";
import { roughStrike, roughStrikeScribble } from "../lib/rough";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type StrikeThroughVariant = "line" | "scribble" | "replace";

export interface StrikeThroughProps {
  text: string;
  /** line crosses it out, scribble scratches it out, replace crosses it out and writes `replacement` above. */
  variant?: StrikeThroughVariant;
  /** The correction written above, for the replace variant. */
  replacement?: string;
  color?: string;
  thickness?: number;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always">;
  active?: boolean;
  once?: boolean;
  delay?: number;
  duration?: number;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * Cross out a word and, if you like, write the new one above it. The old word dims as the pen
 * passes, so the correction reads in the right order.
 */
export function StrikeThrough({ text, variant = "line", replacement, color = "var(--tl-accent, #3a9a5b)", thickness = 3, as: Tag = "span", trigger = "inView", active, once = true, delay = 0, duration = 0.5, reducedMotion = "user", className, style }: StrikeThroughProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const reduced = useReduced(reducedMotion);
  const struck = on || reduced;
  const d = (variant === "scribble" ? roughStrikeScribble : roughStrike)(hashString(text));
  const draw = drawProps(struck, { duration: variant === "scribble" ? duration * 1.6 : duration, delay });
  const showReplacement = variant === "replace" && replacement && struck;
  // An emoji correction pops in upright and larger; a word is handwritten small and slanted.
  const isEmoji = !!replacement && /^[\p{Extended_Pictographic}\p{Emoji_Component}\u200d\ufe0f\s]+$/u.test(replacement);
  const spoken = variant === "replace" && replacement ? `${replacement} (replaces ${text})` : `${text} (struck out)`;

  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "inline-block", ...style }} {...bind}>
      <span style={srOnly}>{spoken}</span>
      <motion.span aria-hidden="true" initial={false} animate={{ opacity: struck ? 0.55 : 1 }} transition={{ duration: 0.3, delay: reduced ? 0 : delay + duration * 0.6 }}>
        {text}
      </motion.span>
      <svg aria-hidden="true" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: "absolute", left: "-3%", width: "106%", top: "50%", marginTop: "-0.22em", height: "0.6em", overflow: "visible", pointerEvents: "none" }}>
        <motion.path d={d} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" {...(reduced ? { initial: false, animate: { pathLength: 1, opacity: 1 } } : draw)} />
      </svg>
      <AnimatePresence>
        {showReplacement && (
          <motion.span
            aria-hidden="true"
            style={{ position: "absolute", left: "50%", bottom: isEmoji ? "70%" : "78%", whiteSpace: "nowrap", color, fontSize: isEmoji ? "0.85em" : "0.62em", fontStyle: isEmoji ? "normal" : "italic", lineHeight: 1 }}
            initial={reduced ? false : isEmoji ? { opacity: 0, transform: "translateX(-50%) translateY(0.4em) scale(0.4) rotate(-20deg)" } : { opacity: 0, transform: "translateX(-50%) translateY(0.3em) rotate(-3deg)", filter: "blur(4px)" }}
            animate={isEmoji ? { opacity: 1, transform: "translateX(-50%) translateY(0em) scale(1) rotate(-6deg)" } : { opacity: 1, transform: "translateX(-50%) translateY(0em) rotate(-3deg)", filter: "blur(0px)" }}
            transition={isEmoji ? { type: "spring", duration: 0.6, bounce: 0.3, delay: reduced ? 0 : delay + duration + 0.1 } : { duration: 0.5, delay: reduced ? 0 : delay + duration + 0.1, ease: [...ease.enter] }}
          >
            {replacement}
          </motion.span>
        )}
      </AnimatePresence>
    </Tag>
  );
}

export default StrikeThrough;
