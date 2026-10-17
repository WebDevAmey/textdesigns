"use client";

import type { CSSProperties, ElementType } from "react";
import { motion } from "motion/react";
import { srOnly } from "../lib/a11y";
import { resolveEase, type EaseInput } from "../lib/motion-tokens";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useSvgId } from "../lib/use-svg-id";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type OutlineDrawVariant = "draw-fill" | "draw-only" | "fill-sweep";

export interface OutlineDrawProps {
  text: string;
  /** draw-fill traces then floods with ink, draw-only leaves the outline, fill-sweep traces then fills left to right. */
  variant?: OutlineDrawVariant;
  /** Outline width in em. */
  stroke?: number;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always">;
  active?: boolean;
  once?: boolean;
  delay?: number;
  /** Seconds the trace takes. The fill follows. */
  duration?: number;
  ease?: EaseInput;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
  onComplete?: () => void;
}

/**
 * The outline draws itself, then fills. Every glyph contour is traced at once with a dash that
 * runs out, so even long words finish together.
 */
export function OutlineDraw({ text, variant = "draw-fill", stroke = 0.018, as: Tag = "span", trigger = "inView", active, once = true, delay = 0, duration = 1.6, ease = "standard", reducedMotion = "user", className, style, onComplete }: OutlineDrawProps) {
  const id = useSvgId("tl-outline");
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const reduced = useReduced(reducedMotion);
  const curve = resolveEase(ease);

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style} {...bind}>
        {variant === "draw-only" ? <span style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: `${stroke}em currentColor` }}>{text}</span> : text}
      </Tag>
    );
  }

  const fillAt = delay + duration * 0.75;
  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "inline-block", ...style }} {...bind}>
      <span style={srOnly}>{text}</span>
      <span aria-hidden="true" style={{ visibility: "hidden", whiteSpace: "pre" }}>
        {text}
      </span>
      <svg aria-hidden="true" width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {variant === "fill-sweep" && (
          <defs>
            <linearGradient id={`${id}-sweep`} x1="0" x2="1" y1="0" y2="0">
              <motion.stop offset={0} stopColor="white" initial={{ offset: 0 }} animate={{ offset: on ? 1 : 0 }} transition={{ duration: duration * 0.7, delay: fillAt, ease: curve }} />
              <motion.stop offset={0} stopColor="black" initial={{ offset: 0 }} animate={{ offset: on ? 1 : 0 }} transition={{ duration: duration * 0.7, delay: fillAt, ease: curve }} />
            </linearGradient>
            <mask id={`${id}-mask`} maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill={`url(#${id}-sweep)`} />
            </mask>
          </defs>
        )}
        <motion.text
          x="50%"
          y="54%"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="currentColor"
          stroke="currentColor"
          strokeLinejoin="round"
          style={{ fontSize: "1em", strokeWidth: `${stroke}em`, strokeDasharray: "6em 6em" }}
          initial={{ strokeDashoffset: "6em", fillOpacity: 0 }}
          animate={on ? { strokeDashoffset: "0em", fillOpacity: variant === "draw-fill" ? 1 : 0 } : { strokeDashoffset: "6em", fillOpacity: 0 }}
          transition={on ? { strokeDashoffset: { duration, delay, ease: curve }, fillOpacity: { duration: duration * 0.5, delay: fillAt } } : { duration: 0.2 }}
          onAnimationComplete={on ? onComplete : undefined}
        >
          {text}
        </motion.text>
        {variant === "fill-sweep" && (
          <text x="50%" y="54%" textAnchor="middle" dominantBaseline="middle" fill="currentColor" mask={`url(#${id}-mask)`} style={{ fontSize: "1em" }}>
            {text}
          </text>
        )}
      </svg>
    </Tag>
  );
}

export default OutlineDraw;
