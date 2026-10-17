"use client";

import { useRef, type CSSProperties, type ElementType, type RefObject } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { srOnly } from "../lib/a11y";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type DepthLayersVariant = "stack" | "fan";

export interface DepthLayersProps {
  text: string;
  /** stack separates copies vertically like layered prints; fan swings them open around a corner. */
  variant?: DepthLayersVariant;
  /** Number of outline copies behind the solid one. */
  layers?: number;
  /** Largest gap between neighbouring copies, in em (stack) or degrees (fan). */
  spread?: number;
  container?: RefObject<HTMLElement | null>;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

function Layer({ text, index, layers, progress, variant, spread }: { text: string; index: number; layers: number; progress: MotionValue<number>; variant: DepthLayersVariant; spread: number }) {
  const depth = index + 1;
  const y = useTransform(progress, (p) => (variant === "stack" ? `${p * depth * spread}em` : "0em"));
  const rotate = useTransform(progress, (p) => (variant === "fan" ? p * depth * spread : 0));
  return (
    <motion.span
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        y,
        rotate,
        transformOrigin: "0% 100%",
        WebkitTextFillColor: "transparent",
        WebkitTextStroke: "0.015em currentColor",
        opacity: 1 - depth / (layers + 1.5),
        zIndex: -depth,
      }}
    >
      {text}
    </motion.span>
  );
}

/**
 * Stacked outline copies drift apart in depth as the title moves through the viewport, widest at
 * the center of the screen and closing again as it leaves.
 */
export function DepthLayers({ text, variant = "stack", layers = 5, spread, container, as: Tag = "span", reducedMotion = "user", className, style }: DepthLayersProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReduced(reducedMotion);
  const { scrollYProgress } = useScroll({ target: ref, container, offset: ["start end", "end start"] });
  // 0 at the edges of the viewport, 1 at its center.
  const open = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const progress = useSpring(open, { stiffness: 180, damping: 30 });
  const gap = spread ?? (variant === "stack" ? 0.12 : 4);

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "inline-block", isolation: "isolate", ...style }}>
      <span style={srOnly}>{text}</span>
      {Array.from({ length: layers }, (_, i) => (
        <Layer key={i} text={text} index={i} layers={layers} progress={progress} variant={variant} spread={gap} />
      ))}
      <span aria-hidden="true" style={{ position: "relative" }}>
        {text}
      </span>
    </Tag>
  );
}

export default DepthLayers;
