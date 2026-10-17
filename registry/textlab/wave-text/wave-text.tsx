"use client";

import type { CSSProperties, ElementType } from "react";
import { SrText } from "../lib/a11y";
import { Letters } from "../lib/letters";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type WaveTextVariant = "wave" | "bounce" | "float";

export interface WaveTextProps {
  text: string;
  /** wave rolls a smooth sine, bounce hops each letter off the baseline, float drifts and tilts gently. */
  variant?: WaveTextVariant;
  /** Height of the wave in em. */
  amplitude?: number;
  /** Seconds per cycle. */
  speed?: number;
  /** Seconds between neighbouring letters. Smaller makes a longer wave. */
  spread?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const CSS = `
@keyframes tl-wave { 0%, 100% { transform: translateY(calc(var(--tl-amp) * 0.5)); } 50% { transform: translateY(calc(var(--tl-amp) * -0.5)); } }
@keyframes tl-bounce { 0%, 100% { transform: translateY(0); animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1); } 50% { transform: translateY(calc(var(--tl-amp) * -1)); animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1); } }
@keyframes tl-float { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(calc(var(--tl-amp) * -0.6)) rotate(3deg); } }
@media (prefers-reduced-motion: reduce) { [data-tl-wave="user"] [data-tl-char] { animation: none !important; } }
`;

/** A sine wave runs through the line. Pure CSS: one keyframe, offset per letter. */
export function WaveText({ text, variant = "wave", amplitude = 0.2, speed = 1.6, spread = 0.08, as: Tag = "span", reducedMotion = "user", className, style }: WaveTextProps) {
  const reduced = useReduced(reducedMotion);
  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }
  const name = variant === "bounce" ? "tl-bounce" : variant === "float" ? "tl-float" : "tl-wave";
  return (
    <Tag className={className} style={{ "--tl-amp": `${amplitude}em`, ...style } as CSSProperties} data-tl-wave={reducedMotion === "user" ? "user" : undefined}>
      <style href="tl-wave-text" precedence="default">{CSS}</style>
      <SrText>{text}</SrText>
      <span aria-hidden="true">
        <Letters
          text={text}
          charStyle={(i) => ({
            animation: `${name} ${speed}s ease-in-out infinite`,
            // Negative delays start every letter mid-cycle, so the wave is already moving on first paint.
            animationDelay: `${-(10 - ((i * spread) % 10))}s`,
            transformOrigin: "50% 80%",
          })}
        />
      </span>
    </Tag>
  );
}

export default WaveText;
