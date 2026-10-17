"use client";

import type { CSSProperties, ElementType } from "react";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type ShimmerTextVariant = "subtle" | "bright" | "rainbow";

export interface ShimmerTextProps {
  text: string;
  /** subtle is a soft pass for status lines, bright is a crisp sheen, rainbow carries a hint of color. */
  variant?: ShimmerTextVariant;
  /** Seconds per pass, including the rest between passes. */
  speed?: number;
  /** Width of the light band, as a share of the text. */
  spread?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const CSS = `
@keyframes tl-shimmer { 0% { background-position: 100% 0; } 70%, 100% { background-position: 0% 0; } }
.tl-shimmer { background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-repeat: no-repeat; }
@media (prefers-reduced-motion: reduce) { .tl-shimmer[data-motion="user"] { animation: none !important; background-position: 50% 0 !important; } }
`;

/**
 * A calm light passes across the words, then rests. Made for "thinking", "loading" and
 * "generating" lines where something is happening but nothing needs attention yet.
 */
export function ShimmerText({ text, variant = "subtle", speed = 2.4, spread = 0.18, as: Tag = "span", reducedMotion = "user", className, style }: ShimmerTextProps) {
  const reduced = useReduced(reducedMotion);
  const half = (spread * 100) / 2;
  const base = variant === "bright" ? "color-mix(in oklab, currentColor 45%, transparent)" : "color-mix(in oklab, currentColor 55%, transparent)";
  const light =
    variant === "rainbow"
      ? `var(--tl-fx-spectrum-1) ${50 - half}%, var(--tl-fx-spectrum-2) ${50 - half / 3}%, var(--tl-fx-spectrum-3) ${50 + half / 3}%, var(--tl-fx-spectrum-4) ${50 + half}%`
      : `currentColor 50%`;
  const image = `linear-gradient(90deg, ${base} ${50 - half}%, ${light}, ${base} ${50 + half}%)`;

  return (
    <Tag
      className={["tl-shimmer", className].filter(Boolean).join(" ")}
      data-motion={reducedMotion === "user" ? "user" : undefined}
      style={{
        backgroundImage: `${image}, linear-gradient(${base}, ${base})`,
        backgroundSize: "250% 100%, 100% 100%",
        animation: reduced ? "none" : `tl-shimmer ${speed}s linear infinite`,
        backgroundPosition: reduced ? "50% 0" : undefined,
        filter: variant === "bright" ? "drop-shadow(0 0 0.25em color-mix(in oklab, currentColor 18%, transparent))" : undefined,
        ...style,
      }}
    >
      <style href="tl-shimmer-text" precedence="default">{CSS}</style>
      {text}
    </Tag>
  );
}

export default ShimmerText;
