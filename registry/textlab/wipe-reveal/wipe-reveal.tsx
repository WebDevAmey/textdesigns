"use client";

import type { CSSProperties, ElementType } from "react";
import { motion } from "motion/react";
import { duration as durations, resolveEase, type EaseInput } from "../lib/motion-tokens";
import { useHydrated } from "../lib/use-hydrated";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type WipeRevealVariant = "left" | "right" | "center" | "diagonal";

export interface WipeRevealProps {
  text: string;
  /** Direction of the sweep. center opens from the middle outward. */
  variant?: WipeRevealVariant;
  /** Width of the soft edge as a share of the text, 0 to 0.5. */
  softness?: number;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always">;
  active?: boolean;
  once?: boolean;
  amount?: number;
  delay?: number;
  duration?: number;
  ease?: EaseInput;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
  id?: string;
  onComplete?: () => void;
}

function mask(variant: WipeRevealVariant, edge: number): string {
  const e = `${edge * 100}%`;
  if (variant === "center") {
    return `linear-gradient(90deg, transparent calc(50% - var(--tl-wipe)), #000 calc(50% - var(--tl-wipe) + ${e}), #000 calc(50% + var(--tl-wipe) - ${e}), transparent calc(50% + var(--tl-wipe)))`;
  }
  const angle = variant === "left" ? 90 : variant === "right" ? 270 : 115;
  return `linear-gradient(${angle}deg, #000 calc(var(--tl-wipe) - ${e}), transparent var(--tl-wipe))`;
}

/**
 * A soft edge uncovers the line. The mask sweeps a CSS variable, so no letter is ever cut by a hard
 * clip and the text stays real, selectable text the whole time.
 */
export function WipeReveal({
  text,
  variant = "left",
  softness = 0.18,
  as: Tag = "span",
  trigger = "inView",
  active,
  once = true,
  amount,
  delay = 0,
  duration = durations.reveal * 1.25,
  ease = "standard",
  reducedMotion = "user",
  className,
  style,
  id,
  onComplete,
}: WipeRevealProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once, amount });
  const hydrated = useHydrated();
  const reduced = useReduced(reducedMotion);
  const edge = Math.min(0.5, Math.max(0, softness));
  // The sweep runs past the far edge by the soft width, so the last letter ends fully opaque.
  const end = variant === "center" ? `${50 + edge * 100}%` : `${100 + edge * 100 + (variant === "diagonal" ? 20 : 0)}%`;
  const image = mask(variant, edge);

  if (reduced) {
    return (
      <Tag ref={ref} id={id} className={className} style={style} {...bind}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      id={id}
      className={className}
      style={style}
      data-tl-motion={reducedMotion === "user" ? "user" : undefined}
      data-tl-pending={hydrated ? undefined : ""}
      {...bind}
    >
      <motion.span
        data-tl-part=""
        style={{
          display: "inline-block",
          padding: "0.1em 0.12em 0.22em",
          margin: "-0.1em -0.12em -0.22em",
          WebkitMaskImage: image,
          maskImage: image,
        }}
        initial={{ "--tl-wipe": "0%", opacity: 0.001 } as never}
        animate={(on ? { "--tl-wipe": end, opacity: 1 } : { "--tl-wipe": "0%", opacity: 0.001 }) as never}
        transition={on ? { duration, delay, ease: resolveEase(ease), opacity: { duration: 0.01, delay } } : { duration: durations.fast }}
        onAnimationComplete={on ? onComplete : undefined}
      >
        {text}
      </motion.span>
    </Tag>
  );
}

export default WipeReveal;
