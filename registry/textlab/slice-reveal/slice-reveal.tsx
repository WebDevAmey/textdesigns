"use client";

import type { CSSProperties, ElementType } from "react";
import { motion } from "motion/react";
import { SrText } from "../lib/a11y";
import { duration as durations, resolveEase, type EaseInput } from "../lib/motion-tokens";
import { useHydrated } from "../lib/use-hydrated";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type SliceRevealVariant = "3" | "5" | "8";

export interface SliceRevealProps {
  text: string;
  /** Number of horizontal slices. */
  variant?: SliceRevealVariant;
  /** How far each slice starts from home, as a share of the text width. */
  offset?: number;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always">;
  active?: boolean;
  once?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  ease?: EaseInput;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
  onComplete?: () => void;
}

/**
 * The title arrives in offset horizontal slices that slide together, alternating sides,
 * like a print registered by hand. Each slice is a clipped copy of the same line.
 */
export function SliceReveal({
  text,
  variant = "5",
  offset = 0.35,
  as: Tag = "span",
  trigger = "inView",
  active,
  once = true,
  delay = 0,
  stagger = 0.05,
  duration = durations.reveal,
  ease = "emphasized",
  reducedMotion = "user",
  className,
  style,
  onComplete,
}: SliceRevealProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const hydrated = useHydrated();
  const reduced = useReduced(reducedMotion);
  const count = Number(variant);

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style} {...bind}>
        {text}
      </Tag>
    );
  }

  const curve = resolveEase(ease);
  return (
    <Tag
      ref={ref}
      className={className}
      style={{ display: "inline-block", ...style }}
      data-tl-motion={reducedMotion === "user" ? "user" : undefined}
      data-tl-pending={hydrated ? undefined : ""}
      {...bind}
    >
      <SrText>{text}</SrText>
      <span aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>
        {/* The invisible copy holds the size, so slices can be absolutely positioned on top. */}
        <span style={{ visibility: "hidden" }}>{text}</span>
        {Array.from({ length: count }, (_, i) => {
          const top = (i / count) * 100;
          const bottom = 100 - ((i + 1) / count) * 100;
          const from = (i % 2 === 0 ? -1 : 1) * offset * 100;
          return (
            <motion.span
              key={i}
              data-tl-part=""
              style={{
                position: "absolute",
                inset: 0,
                whiteSpace: "nowrap",
                // A hair of overlap hides seams between slices at fractional pixel heights.
                clipPath: `inset(${Math.max(0, top - 0.6)}% -10% ${Math.max(0, bottom - 0.6)}% -10%)`,
              }}
              initial={{ x: `${from}%`, opacity: 0 }}
              animate={on ? { x: "0%", opacity: 1 } : { x: `${from}%`, opacity: 0 }}
              transition={
                on
                  ? { x: { duration, delay: delay + i * stagger, ease: curve }, opacity: { duration: duration * 0.4, delay: delay + i * stagger } }
                  : { duration: durations.fast }
              }
              onAnimationComplete={on && i === count - 1 ? onComplete : undefined}
            >
              {text}
            </motion.span>
          );
        })}
      </span>
    </Tag>
  );
}

export default SliceReveal;
