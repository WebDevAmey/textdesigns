"use client";

import type { CSSProperties, ElementType } from "react";
import { motion } from "motion/react";
import { srOnly } from "../lib/a11y";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useSvgId } from "../lib/use-svg-id";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type SignatureVariant = "pen" | "brush";

export interface SignatureProps {
  /** The name to sign. */
  text: string;
  /** pen is a fine nib that fills in behind itself, brush is a fuller stroke with ink that pools. */
  variant?: SignatureVariant;
  /** Script font. Defaults to the --tl-font-script token. */
  font?: string;
  /** Pen color. */
  color?: string;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always">;
  active?: boolean;
  once?: boolean;
  delay?: number;
  /** Seconds to sign the whole name. */
  duration?: number;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
  onComplete?: () => void;
}

/**
 * A handwritten signature writes itself, left to right. The nib traces the letters while a soft edge
 * moves along with it, so ink only appears where the pen has already been.
 */
export function Signature({ text, variant = "pen", font = "var(--tl-font-script, 'Snell Roundhand', 'Brush Script MT', cursive)", color = "currentColor", as: Tag = "span", trigger = "inView", active, once = true, delay = 0, duration = 2.2, reducedMotion = "user", className, style, onComplete }: SignatureProps) {
  const id = useSvgId("tl-sign");
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const reduced = useReduced(reducedMotion);
  const fontStyle: CSSProperties = { fontFamily: font, ...style };

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={{ color, ...fontStyle }} {...bind}>
        {text}
      </Tag>
    );
  }

  const brush = variant === "brush";
  const writing = { duration, delay, ease: [0.45, 0.05, 0.35, 1] as [number, number, number, number] };
  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "inline-block", ...fontStyle }} {...bind}>
      <span style={srOnly}>{text}</span>
      <span aria-hidden="true" style={{ visibility: "hidden", whiteSpace: "pre", padding: "0 0.2em" }}>
        {text}
      </span>
      <svg aria-hidden="true" width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible", color }}>
        <defs>
          <linearGradient id={`${id}-edge`}>
            <stop offset="0.85" stopColor="white" />
            <stop offset="1" stopColor="black" />
          </linearGradient>
          <mask id={`${id}-mask`} maskUnits="userSpaceOnUse" x="-10%" y="-50%" width="120%" height="200%">
            {/* The soft-edged rect slides in from the left; translating it costs no geometry work. */}
            <motion.rect
              x="-10%"
              y="-50%"
              width="125%"
              height="200%"
              fill={`url(#${id}-edge)`}
              style={{ transformBox: "fill-box" }}
              initial={{ transform: "translateX(-100%)" }}
              animate={{ transform: on ? "translateX(0%)" : "translateX(-100%)" }}
              transition={on ? writing : { duration: 0.2 }}
              onAnimationComplete={on ? onComplete : undefined}
            />
          </mask>
        </defs>
        <g mask={`url(#${id}-mask)`}>
          <motion.text
            x="50%"
            y="55%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ fontSize: "1em", strokeWidth: brush ? "0.03em" : "0.012em", strokeDasharray: "5em 5em" }}
            initial={{ strokeDashoffset: "5em", fillOpacity: 0 }}
            animate={on ? { strokeDashoffset: "0em", fillOpacity: 1 } : { strokeDashoffset: "5em", fillOpacity: 0 }}
            transition={on ? { strokeDashoffset: writing, fillOpacity: { duration: duration * 0.6, delay: delay + duration * (brush ? 0.15 : 0.35) } } : { duration: 0.2 }}
          >
            {text}
          </motion.text>
        </g>
      </svg>
    </Tag>
  );
}

export default Signature;
