"use client";

import type { CSSProperties, ElementType } from "react";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type ExtrudeTextVariant = "block" | "long-shadow" | "stack";

export interface ExtrudeTextProps {
  text: string;
  /** block builds a solid slab, long-shadow casts a fading diagonal, stack offsets outlined copies. */
  variant?: ExtrudeTextVariant;
  /** Number of depth steps at full extrusion. */
  depth?: number;
  /** Depth color. */
  color?: string;
  /** Hover grows the depth from flat; false keeps it extruded. */
  hover?: boolean;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const CSS = `
@property --tl-depth { syntax: "<number>"; inherits: true; initial-value: 0; }
.tl-extrude { --tl-depth: var(--tl-depth-rest); transition: --tl-depth 320ms cubic-bezier(0.22, 1, 0.36, 1), transform 320ms cubic-bezier(0.22, 1, 0.36, 1); }
.tl-extrude[data-hover]:hover, .tl-extrude[data-hover]:focus-visible { --tl-depth: 1; }
@media (prefers-reduced-motion: reduce) { .tl-extrude[data-motion="user"] { transition: none; } }
`;

function layers(variant: ExtrudeTextVariant, depth: number, color: string) {
  return Array.from({ length: depth }, (_, i) => {
    const n = i + 1;
    const off = `calc(var(--tl-depth) * ${(n * 0.012).toFixed(3)}em)`;
    if (variant === "long-shadow") {
      return `${off} ${off} 0 color-mix(in oklab, ${color} ${Math.round(100 - (n / depth) * 85)}%, transparent)`;
    }
    if (variant === "stack") {
      // Every third step draws a ring, which reads as stacked outlines.
      return n % 3 === 0 ? `${off} ${off} 0 ${color}` : `${off} ${off} 0 transparent`;
    }
    return `${off} ${off} 0 ${color}`;
  }).join(", ");
}

/**
 * Depth grows from the letters on hover. The extrusion is a registered CSS property, so the browser
 * interpolates it smoothly with no JavaScript at all.
 */
export function ExtrudeText({ text, variant = "block", depth = 14, color = "var(--tl-accent, #e5643a)", hover = true, as: Tag = "span", reducedMotion = "user", className, style }: ExtrudeTextProps) {
  const reduced = useReduced(reducedMotion);
  const rest = hover && !reduced ? 0.25 : 1;
  return (
    <Tag
      className={["tl-extrude", className].filter(Boolean).join(" ")}
      data-hover={hover && !reduced ? "" : undefined}
      data-motion={reducedMotion === "user" ? "user" : undefined}
      style={{
        display: "inline-block",
        "--tl-depth-rest": rest,
        textShadow: layers(variant, depth, color),
        transform: "translate(calc(var(--tl-depth) * -0.06em), calc(var(--tl-depth) * -0.06em))",
        ...style,
      } as CSSProperties}
    >
      <style href="tl-extrude-text" precedence="default">{CSS}</style>
      {text}
    </Tag>
  );
}

export default ExtrudeText;
