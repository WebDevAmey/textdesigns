import type { RefObject } from "react";
import { useScroll, useSpring, useVelocity } from "motion/react";

/**
 * Smoothed scroll velocity in px per second, from the window or a scrollable container.
 * The spring keeps sudden wheel ticks from snapping effects around.
 */
export function useScrollVelocity(container?: RefObject<HTMLElement | null>, { stiffness = 400, damping = 60 } = {}) {
  const { scrollY } = useScroll(container ? { container } : undefined);
  const velocity = useVelocity(scrollY);
  return useSpring(velocity, { stiffness, damping });
}
