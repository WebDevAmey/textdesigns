"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { srOnly } from "../lib/a11y";
import { usePointerVars } from "../lib/use-pointer-vars";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type SpotlightTextVariant = "reveal" | "glow" | "outline";

export interface SpotlightTextProps {
  text: string;
  /** reveal lifts dim text to full, glow adds a warm light, outline fills hollow letters under the light. */
  variant?: SpotlightTextVariant;
  /** Radius of the light, in em. */
  radius?: number;
  /** Light color for the glow variant. */
  color?: string;
  /** How visible the text is outside the light, 0 to 1. */
  dim?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * A light follows the cursor and reveals the copy. Works with touch too: drag a finger across it.
 * Outside the light the text stays legible, just quieter.
 */
export function SpotlightText({ text, variant = "reveal", radius = 2.2, color = "var(--tl-fx-glow, #f59e0b)", dim = 0.22, as: Tag = "span", reducedMotion = "user", className, style }: SpotlightTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReduced(reducedMotion);
  usePointerVars(ref, { enabled: !reduced, rate: 14, rest: null });

  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  const mask = `radial-gradient(circle ${radius}em at var(--tl-x, 50%) var(--tl-y, 50%), #000 0%, rgb(0 0 0 / 0.6) 45%, transparent 100%)`;
  const base: CSSProperties =
    variant === "outline"
      ? { WebkitTextFillColor: "transparent", WebkitTextStroke: "0.02em color-mix(in oklab, currentColor 55%, transparent)" }
      : { opacity: dim };

  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "inline-block", touchAction: "pan-y", ...style }}>
      <span style={srOnly}>{text}</span>
      <span aria-hidden="true" style={base}>
        {text}
      </span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          WebkitMaskImage: mask,
          maskImage: mask,
          opacity: "calc(0.25 + var(--tl-in, 0) * 0.75)",
          color: variant === "glow" ? `color-mix(in oklab, ${color} 55%, white)` : undefined,
          textShadow: variant === "glow" ? `0 0 0.3em ${color}, 0 0 0.8em color-mix(in oklab, ${color} 50%, transparent)` : undefined,
        }}
      >
        {text}
      </span>
    </Tag>
  );
}

export default SpotlightText;
