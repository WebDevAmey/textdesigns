"use client";

import type { CSSProperties, ElementType } from "react";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type AuroraTextVariant = "polar" | "ember" | "mint";

export interface AuroraTextProps {
  text: string;
  /** Palette: polar greens and violets, ember oranges and pinks, mint teals and limes. */
  variant?: AuroraTextVariant;
  /** Custom colors, three or four. Overrides the variant. */
  colors?: string[];
  /** Seconds for the slowest band to drift. */
  speed?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const PALETTES: Record<AuroraTextVariant, string[]> = {
  polar: ["oklch(0.78 0.17 160)", "oklch(0.7 0.15 200)", "oklch(0.62 0.2 290)", "oklch(0.8 0.14 130)"],
  ember: ["oklch(0.72 0.19 40)", "oklch(0.66 0.22 15)", "oklch(0.7 0.2 350)", "oklch(0.82 0.15 75)"],
  mint: ["oklch(0.82 0.13 175)", "oklch(0.86 0.17 130)", "oklch(0.74 0.12 210)", "oklch(0.9 0.1 100)"],
};

// Each band drifts on its own period, so the pattern never visibly repeats.
const CSS = `
@keyframes tl-aurora-a { 0%, 100% { background-position: 0% 50%, 100% 50%, 50% 0%, 50% 100%; } 50% { background-position: 100% 40%, 0% 60%, 40% 100%, 60% 0%; } }
.tl-aurora { background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-size: 180% 180%, 160% 160%, 200% 200%, 170% 170%; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
@media (prefers-reduced-motion: reduce) { .tl-aurora[data-motion="user"] { animation: none !important; } }
`;

/** Northern lights drift inside the letters: four soft bands, each moving on its own clock. */
export function AuroraText({ text, variant = "polar", colors, speed = 14, as: Tag = "span", reducedMotion = "user", className, style }: AuroraTextProps) {
  const reduced = useReduced(reducedMotion);
  const [a, b, c, d = a] = colors ?? PALETTES[variant];
  const image = [
    `radial-gradient(ellipse at 20% 30%, ${a}, transparent 60%)`,
    `radial-gradient(ellipse at 80% 70%, ${b}, transparent 55%)`,
    `radial-gradient(ellipse at 50% 10%, ${c}, transparent 60%)`,
    `linear-gradient(120deg, ${d}, ${a})`,
  ].join(", ");
  return (
    <Tag
      className={["tl-aurora", className].filter(Boolean).join(" ")}
      data-motion={reducedMotion === "user" ? "user" : undefined}
      style={{ backgroundImage: image, animation: reduced ? "none" : `tl-aurora-a ${speed}s ease-in-out infinite`, ...style }}
    >
      <style href="tl-aurora-text" precedence="default">{CSS}</style>
      {text}
    </Tag>
  );
}

export default AuroraText;
