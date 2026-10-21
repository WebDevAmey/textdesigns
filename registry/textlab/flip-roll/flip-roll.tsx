"use client";

import type { CSSProperties, ElementType } from "react";
import { srOnly } from "../lib/a11y";
import { cssEase, type EaseInput } from "../lib/motion-tokens";
import { graphemes } from "../lib/split";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger } from "../lib/use-trigger";

export type FlipRollVariant = "up" | "down" | "stagger";

export interface FlipRollProps {
  text: string;
  /** up rolls the label up, down rolls it down, stagger rolls letter by letter. */
  variant?: FlipRollVariant;
  /** Seconds per roll. */
  duration?: number;
  /** Seconds between letters for the stagger variant. */
  stagger?: number;
  ease?: EaseInput;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * Hover and the label rolls up while a fresh copy rolls in behind it, like a drum turning one
 * notch. Also follows keyboard focus inside the element.
 */
export function FlipRoll({ text, variant = "stagger", duration = 0.6, stagger = 0.02, ease = "emphasized", as: Tag = "span", reducedMotion = "user", className, style }: FlipRollProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger: "hover" });
  const reduced = useReduced(reducedMotion);
  const chars = variant === "stagger" ? graphemes(text) : [text];
  const dir = variant === "down" ? -1 : 1;
  const flipped = on && !reduced;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ position: "relative", display: "inline-block", ...style }}
      onPointerEnter={bind.onPointerEnter}
      onPointerLeave={bind.onPointerLeave}
      onFocusCapture={bind.onFocus}
      onBlurCapture={bind.onBlur}
    >
      <span style={srOnly}>{text}</span>
      {/* The clip gets a little room above and below so descenders never touch its edge mid-roll. */}
      <span aria-hidden="true" style={{ display: "inline-flex", overflow: "hidden", verticalAlign: "top", lineHeight: 1.2, padding: "0.1em 0.02em", margin: "-0.1em 0" }}>
        {chars.map((char, i) => {
          const delay = variant === "stagger" ? i * stagger : 0;
          // Opacity eases a touch faster than the roll, so each copy is mostly gone before it reaches the edge.
          const t = `transform ${duration}s ${cssEase(ease)} ${delay}s, opacity ${duration * 0.7}s ${cssEase(ease)} ${delay}s`;
          const shift = (sign: number) => `translateY(calc(${sign * 100}% + ${sign * 0.2}em))`;
          return (
            <span key={i} style={{ position: "relative", display: "inline-block", whiteSpace: "pre" }}>
              <span style={{ display: "inline-block", transform: flipped ? shift(-dir) : "translateY(0)", opacity: flipped ? 0 : 1, transition: t, willChange: "transform" }}>{char}</span>
              <span style={{ position: "absolute", left: 0, top: 0, display: "inline-block", transform: flipped ? "translateY(0)" : shift(dir), opacity: flipped ? 1 : 0, transition: t, willChange: "transform" }}>{char}</span>
            </span>
          );
        })}
      </span>
    </Tag>
  );
}

export default FlipRoll;
