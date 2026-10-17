"use client";

import type { CSSProperties, ElementType } from "react";
import { SrText } from "../lib/a11y";
import { charsets, useScramble } from "../lib/scramble";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type ScrambleTextVariant = "random" | "symbols" | "binary";

export interface ScrambleTextProps {
  text: string;
  /** Which glyphs flicker before each letter settles. */
  variant?: ScrambleTextVariant;
  /** Custom glyphs. Overrides the variant's set. */
  charset?: string;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always">;
  active?: boolean;
  once?: boolean;
  delay?: number;
  /** Seconds from noise to settled. */
  duration?: number;
  /** Milliseconds between glyph changes. */
  tick?: number;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
  onComplete?: () => void;
}

/**
 * Letters decode into place, left to right. The real text holds the layout underneath, so the
 * scrambling glyphs can be any width without moving anything around them.
 */
export function ScrambleText({
  text,
  variant = "random",
  charset,
  as: Tag = "span",
  trigger = "inView",
  active,
  once = true,
  delay = 0,
  duration = 1.2,
  tick = 45,
  reducedMotion = "user",
  className,
  style,
  onComplete,
}: ScrambleTextProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const reduced = useReduced(reducedMotion);
  const frame = useScramble(text, { active: on && !reduced, duration, delay, charset: charset ?? charsets[variant], tick, mode: "sweep", idle: "scrambled", onDone: onComplete });

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style} {...bind}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "inline-block", ...style }} {...bind}>
      <SrText>{text}</SrText>
      <span aria-hidden="true" style={{ visibility: "hidden" }}>
        {text}
      </span>
      <span aria-hidden="true" style={{ position: "absolute", inset: 0, whiteSpace: "pre", fontVariantLigatures: "none" }}>
        {frame}
      </span>
    </Tag>
  );
}

export default ScrambleText;
