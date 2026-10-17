"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { motion } from "motion/react";
import { drawProps } from "../lib/draw";
import { hashString } from "../lib/math";
import type { EaseInput } from "../lib/motion-tokens";
import { roughScribble, roughUnderline, roughWave } from "../lib/rough";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type UnderlineDrawVariant = "line" | "wave" | "scribble";

export interface UnderlineDrawProps {
  /** The words to underline. Can include other inline elements. */
  children: ReactNode;
  /** line is a confident curve, wave is a squiggle, scribble is a quick double pass. */
  variant?: UnderlineDrawVariant;
  /** Pen color. Defaults to the accent token. */
  color?: string;
  /** Stroke width in px. */
  thickness?: number;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always">;
  active?: boolean;
  once?: boolean;
  delay?: number;
  duration?: number;
  ease?: EaseInput;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const PATHS = { line: roughUnderline, wave: roughWave, scribble: roughScribble };

/**
 * A hand-drawn underline sketches in under the words. The stroke keeps its width at any size, and
 * the jitter is seeded from the text so every underline is unique but stable.
 */
export function UnderlineDraw({ children, variant = "line", color = "var(--tl-accent, #e5643a)", thickness = 3, as: Tag = "span", trigger = "inView", active, once = true, delay = 0, duration, ease, reducedMotion = "user", className, style }: UnderlineDrawProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const reduced = useReduced(reducedMotion);
  const seed = hashString(typeof children === "string" ? children : variant);
  const d = PATHS[variant](seed);
  const draw = drawProps(on || reduced, { duration: duration ?? (variant === "scribble" ? 0.9 : 0.6), delay, ease });

  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "inline-block", ...style }} {...bind}>
      {children}
      <svg aria-hidden="true" viewBox="0 0 100 20" preserveAspectRatio="none" style={{ position: "absolute", left: "-2%", width: "104%", top: "68%", height: "0.5em", overflow: "visible", pointerEvents: "none" }}>
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          {...(reduced ? { initial: false, animate: { pathLength: 1, opacity: 1 } } : draw)}
        />
      </svg>
    </Tag>
  );
}

export default UnderlineDraw;
