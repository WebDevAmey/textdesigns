"use client";

import type { CSSProperties, ElementType } from "react";
import { SrText } from "../lib/a11y";
import { Letters } from "../lib/letters";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type BreathingTextVariant = "breathe" | "heartbeat";

export interface BreathingTextProps {
  text: string;
  /** breathe swells slowly through the word, heartbeat thumps twice and rests. */
  variant?: BreathingTextVariant;
  /** Weight at rest and at the peak. */
  from?: number;
  to?: number;
  /** Seconds per breath. */
  speed?: number;
  /** Variable font with a weight axis. */
  font?: string;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const CSS = `
@property --tl-wght { syntax: "<number>"; inherits: true; initial-value: 400; }
@keyframes tl-breathe { 0%, 100% { --tl-wght: var(--tl-from); } 50% { --tl-wght: var(--tl-to); } }
@keyframes tl-heartbeat { 0%, 40%, 100% { --tl-wght: var(--tl-from); } 10%, 26% { --tl-wght: var(--tl-to); } 18% { --tl-wght: calc((var(--tl-from) + var(--tl-to)) / 2); } }
.tl-breath [data-tl-char] { font-variation-settings: "wght" var(--tl-wght); }
@media (prefers-reduced-motion: reduce) { .tl-breath[data-motion="user"] [data-tl-char] { animation: none !important; } }
`;

/**
 * Weight breathes in and out, travelling through the word like a slow inhale. The weight is a
 * registered CSS property, so the browser interpolates it with no JavaScript.
 */
export function BreathingText({ text, variant = "breathe", from = 250, to = 800, speed = 3.6, font = "var(--tl-font-flex)", as: Tag = "span", reducedMotion = "user", className, style }: BreathingTextProps) {
  const reduced = useReduced(reducedMotion);
  if (reduced) {
    return (
      <Tag className={className} style={{ fontFamily: font, fontVariationSettings: `"wght" ${(from + to) / 2}`, ...style }}>
        {text}
      </Tag>
    );
  }
  const name = variant === "heartbeat" ? "tl-heartbeat" : "tl-breathe";
  return (
    <Tag
      className={["tl-breath", className].filter(Boolean).join(" ")}
      data-motion={reducedMotion === "user" ? "user" : undefined}
      style={{ fontFamily: font, "--tl-from": from, "--tl-to": to, ...style } as CSSProperties}
    >
      <style href="tl-breathing-text" precedence="default">{CSS}</style>
      <SrText>{text}</SrText>
      <span aria-hidden="true">
        <Letters
          text={text}
          charStyle={(i) => ({
            animation: `${name} ${speed}s ${variant === "heartbeat" ? "ease-out" : "ease-in-out"} infinite`,
            animationDelay: `${variant === "heartbeat" ? 0 : -(speed * 2) + i * 0.09}s`,
          })}
        />
      </span>
    </Tag>
  );
}

export default BreathingText;
