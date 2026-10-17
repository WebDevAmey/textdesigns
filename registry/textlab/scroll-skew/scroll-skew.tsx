"use client";

import type { CSSProperties, ElementType, RefObject } from "react";
import { motion, useTransform } from "motion/react";
import { clamp } from "../lib/math";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useScrollVelocity } from "../lib/use-scroll-velocity";

export type ScrollSkewVariant = "skew" | "stretch";

export interface ScrollSkewProps {
  text: string;
  /** skew leans the line with scroll speed; stretch squashes and stretches it vertically. */
  variant?: ScrollSkewVariant;
  /** Largest lean in degrees (skew) or stretch factor above 1 (stretch). */
  max?: number;
  container?: RefObject<HTMLElement | null>;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/** Type leans with the speed of your scroll and springs upright when you stop. */
export function ScrollSkew({ text, variant = "skew", max, container, as: Tag = "span", reducedMotion = "user", className, style }: ScrollSkewProps) {
  const reduced = useReduced(reducedMotion);
  const velocity = useScrollVelocity(container);
  const limit = max ?? (variant === "skew" ? 12 : 0.35);
  const skewY = useTransform(velocity, (v) => (variant === "skew" ? clamp(v / 140, -limit, limit) : 0));
  const scaleY = useTransform(velocity, (v) => (variant === "stretch" ? 1 + clamp(Math.abs(v) / 4000, 0, limit) : 1));
  const scaleX = useTransform(scaleY, (s) => 1 / Math.sqrt(s));

  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag className={className} style={{ display: "inline-block", ...style }}>
      <motion.span style={{ display: "inline-block", skewY, scaleY, scaleX, transformOrigin: variant === "stretch" ? "50% 100%" : "50% 50%" }}>{text}</motion.span>
    </Tag>
  );
}

export default ScrollSkew;
