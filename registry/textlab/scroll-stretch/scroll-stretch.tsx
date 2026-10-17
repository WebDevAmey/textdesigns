"use client";

import type { CSSProperties, ElementType, RefObject } from "react";
import { motion, useSpring, useTransform, type MotionValue } from "motion/react";
import { SrText } from "../lib/a11y";
import { clamp } from "../lib/math";
import { graphemes } from "../lib/split";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useScrollVelocity } from "../lib/use-scroll-velocity";

export type ScrollStretchVariant = "vertical" | "horizontal";

export interface ScrollStretchProps {
  text: string;
  /** vertical pulls letters tall like taffy; horizontal smears them sideways. */
  variant?: ScrollStretchVariant;
  /** Largest stretch above 1. */
  max?: number;
  container?: RefObject<HTMLElement | null>;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

function Letter({ char, amount, index, total, variant }: { char: string; amount: MotionValue<number>; index: number; total: number; variant: ScrollStretchVariant }) {
  // Letters further along respond a little later, so the stretch travels through the word like a wave.
  const lagged = useSpring(amount, { stiffness: 520 - (index / Math.max(1, total)) * 320, damping: 26 });
  const scale = useTransform(lagged, (v) => 1 + v);
  const counter = useTransform(lagged, (v) => 1 / Math.sqrt(1 + v));
  return (
    <motion.span
      style={{
        display: "inline-block",
        whiteSpace: "pre",
        transformOrigin: variant === "vertical" ? "50% 100%" : "0% 50%",
        scaleY: variant === "vertical" ? scale : counter,
        scaleX: variant === "vertical" ? counter : scale,
      }}
    >
      {char}
    </motion.span>
  );
}

/** Letters stretch as you scroll fast and snap back when you stop, each one a beat after the last. */
export function ScrollStretch({ text, variant = "vertical", max = 0.6, container, as: Tag = "span", reducedMotion = "user", className, style }: ScrollStretchProps) {
  const reduced = useReduced(reducedMotion);
  const velocity = useScrollVelocity(container);
  const amount = useTransform(velocity, (v) => clamp(Math.abs(v) / 3000, 0, max));
  const chars = graphemes(text);

  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag className={className} style={{ display: "inline-block", ...style }}>
      <SrText>{text}</SrText>
      <span aria-hidden="true" style={{ display: "inline-block", whiteSpace: "nowrap" }}>
        {chars.map((char, i) => (
          <Letter key={i} char={char} amount={amount} index={i} total={chars.length} variant={variant} />
        ))}
      </span>
    </Tag>
  );
}

export default ScrollStretch;
