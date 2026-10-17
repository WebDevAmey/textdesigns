import type { Transition } from "motion/react";
import { resolveEase, type EaseInput } from "./motion-tokens";

/** Motion props that draw an SVG path from nothing using pathLength. */
export function drawProps(on: boolean, { duration = 0.7, delay = 0, ease = "standard" as EaseInput } = {}) {
  const transition: Transition = on
    ? { pathLength: { duration, delay, ease: resolveEase(ease) }, opacity: { duration: 0.01, delay } }
    : { duration: 0.2 };
  return {
    initial: { pathLength: 0, opacity: 0 },
    animate: on ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
    transition,
  };
}
