"use client";

import type { CSSProperties, ElementType } from "react";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type NeonTextVariant = "steady" | "flicker" | "pulse";

export interface NeonTextProps {
  text: string;
  /** steady hums gently, flicker powers on and stutters now and then, pulse breathes its glow. */
  variant?: NeonTextVariant;
  /** Tube color. */
  color?: string;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

// Flicker never exceeds two flashes per second, well under the three-per-second seizure threshold.
const CSS = `
@keyframes tl-neon-on { 0% { opacity: 0.1; } 6% { opacity: 1; } 9% { opacity: 0.25; } 14% { opacity: 1; } 18% { opacity: 0.5; } 22%, 100% { opacity: 1; } }
@keyframes tl-neon-stutter { 0%, 91%, 93.5%, 100% { opacity: 1; } 92% { opacity: 0.45; } 96% { opacity: 0.85; } }
@keyframes tl-neon-hum { 0%, 100% { opacity: 1; } 50% { opacity: 0.93; } }
@keyframes tl-neon-pulse { 0%, 100% { text-shadow: var(--tl-neon-dim); } 50% { text-shadow: var(--tl-neon-full); } }
.tl-neon { color: color-mix(in oklab, var(--tl-neon) 30%, white); text-shadow: var(--tl-neon-full); }
.tl-neon[data-variant="steady"] { animation: tl-neon-hum 3.2s ease-in-out infinite; }
.tl-neon[data-variant="flicker"] { animation: tl-neon-on 1.4s steps(1) 1, tl-neon-stutter 7s steps(1) 1.4s infinite; }
.tl-neon[data-variant="pulse"] { animation: tl-neon-pulse 3s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .tl-neon[data-motion="user"] { animation: none !important; } }
`;

/** A neon sign that hums and flickers on. Layered glows give the tube a hot core and a soft halo. */
export function NeonText({ text, variant = "flicker", color = "oklch(0.72 0.24 350)", as: Tag = "span", reducedMotion = "user", className, style }: NeonTextProps) {
  const reduced = useReduced(reducedMotion);
  const glow = (k: number) =>
    `0 0 ${0.02 * k}em #fff, 0 0 ${0.08 * k}em var(--tl-neon), 0 0 ${0.18 * k}em var(--tl-neon), 0 0 ${0.42 * k}em color-mix(in oklab, var(--tl-neon) 70%, transparent), 0 0 ${0.9 * k}em color-mix(in oklab, var(--tl-neon) 45%, transparent)`;
  return (
    <Tag
      className={["tl-neon", className].filter(Boolean).join(" ")}
      data-variant={variant}
      data-motion={reducedMotion === "user" ? "user" : undefined}
      style={{ "--tl-neon": color, "--tl-neon-full": glow(1), "--tl-neon-dim": glow(0.55), ...(reduced ? { animation: "none" } : null), ...style } as CSSProperties}
    >
      <style href="tl-neon-text" precedence="default">{CSS}</style>
      {text}
    </Tag>
  );
}

export default NeonText;
