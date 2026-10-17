import { useEffect, useRef, useState, type FocusEvent, type PointerEvent, type RefObject } from "react";
import { useInView } from "motion/react";
import { useHydrated } from "./use-hydrated";

export type Trigger = "mount" | "inView" | "hover" | "manual" | "always";

export interface TriggerOptions {
  trigger?: Trigger;
  /** Drives `trigger="manual"`. */
  active?: boolean;
  /** In view: play once. */
  once?: boolean;
  /** In view: share of the element that must be visible, 0 to 1. */
  amount?: number;
}

export interface TriggerState<T extends Element> {
  ref: RefObject<T | null>;
  /** True while the effect should be in its "on" state. */
  on: boolean;
  /** Spread onto the root for `trigger="hover"`. Focus counts as hover for keyboard users. */
  bind: {
    onPointerEnter?: (event: PointerEvent<T>) => void;
    onPointerLeave?: (event: PointerEvent<T>) => void;
    onFocus?: (event: FocusEvent<T>) => void;
    onBlur?: (event: FocusEvent<T>) => void;
  };
}

/** One trigger model for every component: mount, inView, hover, manual or always. */
export function useTrigger<T extends Element = HTMLElement>({ trigger = "mount", active = false, once = true, amount = 0.45 }: TriggerOptions = {}): TriggerState<T> {
  const ref = useRef<T | null>(null);
  const hydrated = useHydrated();
  const inView = useInView(ref, { once, amount });
  const [passed, setPassed] = useState(false);
  const [hovered, setHovered] = useState(false);

  // Titles already above the viewport show immediately instead of waiting for an intersection that never comes.
  useEffect(() => {
    if (trigger !== "inView" || inView || passed || !once) return;
    const check = () => {
      const node = ref.current;
      if (node && node.getBoundingClientRect().bottom < 0) setPassed(true);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, [trigger, inView, passed, once]);

  let on = false;
  if (trigger === "always") on = true;
  else if (trigger === "mount") on = hydrated;
  else if (trigger === "inView") on = inView || passed;
  else if (trigger === "hover") on = hovered;
  else if (trigger === "manual") on = active;

  const bind =
    trigger === "hover"
      ? {
          onPointerEnter: () => setHovered(true),
          onPointerLeave: () => setHovered(false),
          onFocus: () => setHovered(true),
          onBlur: () => setHovered(false),
        }
      : {};

  return { ref, on, bind };
}
