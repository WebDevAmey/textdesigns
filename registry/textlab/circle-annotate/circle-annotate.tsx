"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { motion } from "motion/react";
import { drawProps } from "../lib/draw";
import { hashString } from "../lib/math";
import { roughBox, roughBrackets, roughEllipse } from "../lib/rough";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type CircleAnnotateVariant = "circle" | "box" | "bracket";

export interface CircleAnnotateProps {
  children: ReactNode;
  /** circle loops around the word, box frames it, bracket sets it off at both ends. */
  variant?: CircleAnnotateVariant;
  color?: string;
  thickness?: number;
  /** Extra room around the word, in em. */
  padding?: number;
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

const PATHS = { circle: roughEllipse, box: roughBox, bracket: roughBrackets };

/** A pen circles the word that matters, in one continuous stroke that overshoots its start. */
export function CircleAnnotate({ children, variant = "circle", color = "var(--tl-accent, #3a9a5b)", thickness = 2.5, padding = 0.25, as: Tag = "span", trigger = "inView", active, once = true, delay = 0, duration = 0.9, reducedMotion = "user", className, style }: CircleAnnotateProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const reduced = useReduced(reducedMotion);
  const d = PATHS[variant](hashString(typeof children === "string" ? children : variant));
  const draw = drawProps(on, { duration, delay, ease: "standard" });
  const pad = `${padding}em`;
  // An ellipse drawn inside the word's box would cut its corners, so the circle's box grows past the
  // word on every side until the corners of the letters sit inside the curve.
  const frame: CSSProperties =
    variant === "circle"
      ? { left: `calc(-12.5% - ${pad})`, top: `calc(-17.5% - 0.5 * ${pad})`, width: `calc(125% + 2 * ${pad})`, height: `calc(135% + ${pad})` }
      : { left: `calc(-1 * ${pad})`, top: `calc(-0.6 * ${pad})`, width: `calc(100% + 2 * ${pad})`, height: `calc(100% + 1.2 * ${pad})` };
  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "inline-block", ...style }} {...bind}>
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        style={{ position: "absolute", ...frame, overflow: "visible", pointerEvents: "none" }}
      >
        <motion.path d={d} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" {...(reduced ? { initial: false, animate: { pathLength: 1, opacity: 1 } } : draw)} />
      </svg>
    </Tag>
  );
}

export default CircleAnnotate;
