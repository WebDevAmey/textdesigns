"use client";

import type { CSSProperties, ElementType } from "react";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type GradientTextVariant = "flow" | "conic" | "spectrum";

export interface GradientTextProps {
  text: string;
  /** flow drifts a linear gradient, conic turns a color wheel inside the letters, spectrum cycles hue. */
  variant?: GradientTextVariant;
  /** Gradient stops. Defaults to the spectrum tokens. */
  colors?: string[];
  /** Seconds per full cycle. */
  speed?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const CSS = `
@property --tl-angle { syntax: "<angle>"; inherits: false; initial-value: 0deg; }
@keyframes tl-gradient-flow { from { background-position: 0% 50%; } to { background-position: 200% 50%; } }
@keyframes tl-gradient-turn { to { --tl-angle: 360deg; } }
@keyframes tl-gradient-hue { to { filter: hue-rotate(360deg); } }
.tl-gradient { background-clip: text; -webkit-background-clip: text; color: transparent; -webkit-text-fill-color: transparent; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
@media (prefers-reduced-motion: reduce) { .tl-gradient[data-motion="user"] { animation: none !important; } }
`;

const DEFAULT = ["var(--tl-fx-spectrum-1)", "var(--tl-fx-spectrum-2)", "var(--tl-fx-spectrum-3)", "var(--tl-fx-spectrum-4)"];

/**
 * Color flows slowly through the letters. The text stays real text, clipped to a gradient, so it
 * selects, wraps and reads like any other heading.
 */
export function GradientText({ text, variant = "flow", colors = DEFAULT, speed = 8, as: Tag = "span", reducedMotion = "user", className, style }: GradientTextProps) {
  const reduced = useReduced(reducedMotion);
  const loop = [...colors, colors[0]].join(", ");
  const look: CSSProperties =
    variant === "conic"
      ? { backgroundImage: `conic-gradient(from var(--tl-angle) at 50% 50%, ${loop})`, animation: `tl-gradient-turn ${speed}s linear infinite` }
      : variant === "spectrum"
        ? { backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`, animation: `tl-gradient-hue ${speed}s linear infinite` }
        : { backgroundImage: `linear-gradient(90deg, ${loop})`, backgroundSize: "200% 100%", animation: `tl-gradient-flow ${speed}s linear infinite` };

  return (
    <Tag className={["tl-gradient", className].filter(Boolean).join(" ")} data-motion={reducedMotion === "user" ? "user" : undefined} style={{ ...look, ...(reduced ? { animation: "none" } : null), ...style }}>
      <style href="tl-gradient-text" precedence="default">{CSS}</style>
      {text}
    </Tag>
  );
}

export default GradientText;
