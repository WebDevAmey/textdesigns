"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { SrText } from "../lib/a11y";
import { charsets, useScramble } from "../lib/scramble";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger } from "../lib/use-trigger";

export type HoverScrambleVariant = "sweep" | "all";

export interface HoverScrambleProps {
  text: string;
  /** sweep re-settles left to right; all stays scrambled, then snaps back together. */
  variant?: HoverScrambleVariant;
  charset?: string;
  /** Seconds the scramble lasts. */
  duration?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
  /** Optional element to wrap, for example an icon after the label. */
  children?: ReactNode;
}

/**
 * Scrambles on hover or keyboard focus and settles back into the word. Made for nav links and
 * buttons: put it inside a focusable element and it follows that element's focus.
 */
export function HoverScramble({ text, variant = "sweep", charset = charsets.symbols, duration = 0.5, as: Tag = "span", reducedMotion = "user", className, style, children }: HoverScrambleProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger: "hover" });
  const reduced = useReduced(reducedMotion);
  const frame = useScramble(text, { active: on && !reduced, duration, charset, mode: variant, idle: "text", tick: 40 });

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ position: "relative", display: "inline-block", ...style }}
      onPointerEnter={bind.onPointerEnter}
      onPointerLeave={bind.onPointerLeave}
      // Focus inside (for example the parent link) counts as hover.
      onFocusCapture={bind.onFocus}
      onBlurCapture={bind.onBlur}
    >
      <SrText>{text}</SrText>
      <span aria-hidden="true" style={{ visibility: "hidden" }}>
        {text}
      </span>
      <span aria-hidden="true" style={{ position: "absolute", inset: 0, whiteSpace: "pre" }}>
        {frame}
      </span>
      {children}
    </Tag>
  );
}

export default HoverScramble;
