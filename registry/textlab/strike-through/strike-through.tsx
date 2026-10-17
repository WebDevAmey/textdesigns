"use client";

import type { CSSProperties, ElementType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { srOnly } from "../lib/a11y";
import { drawProps } from "../lib/draw";
import { hashString } from "../lib/math";
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
export function StrikeThrough({ text, variant = "line", replacement, color = "var(--tl-accent, #e5643a)", thickness = 3, as: Tag = "span", trigger = "inView", active, once = true, delay = 0, duration = 0.5, reducedMotion = "user", className, style }: StrikeThroughProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const reduced = useReduced(reducedMotion);
  const struck = on || reduced;
  const d = (variant === "scribble" ? roughStrikeScribble : roughStrike)(hashString(text));
  const draw = drawProps(struck, { duration: variant === "scribble" ? duration * 1.6 : duration, delay });
  const showReplacement = variant === "replace" && replacement && struck;
  const spoken = variant === "replace" && replacement ? `${replacement} (replaces ${text})` : `${text} (struck out)`;

  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "inline-block", ...style }} {...bind}>
      <span style={srOnly}>{spoken}</span>
      <motion.span aria-hidden="true" initial={false} animate={{ opacity: struck ? 0.55 : 1 }} transition={{ duration: 0.3, delay: reduced ? 0 : delay + duration * 0.6 }}>
        {text}
      </motion.span>
      <svg aria-hidden="true" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: "absolute", left: "-3%", width: "106%", top: "22%", height: "0.6em", overflow: "visible", pointerEvents: "none" }}>
        <motion.path d={d} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" {...(reduced ? { initial: false, animate: { pathLength: 1, opacity: 1 } } : draw)} />
      </svg>
      <AnimatePresence>
        {showReplacement && (
          <motion.span
            aria-hidden="true"
            style={{ position: "absolute", left: "50%", bottom: "78%", x: "-50%", whiteSpace: "nowrap", color, fontSize: "0.62em", fontStyle: "italic", rotate: -3 }}
            initial={reduced ? false : { opacity: 0, y: "0.3em", filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: reduced ? 0 : delay + duration + 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            {replacement}
          </motion.span>
        )}
      </AnimatePresence>
    </Tag>
  );
}

export default StrikeThrough;
