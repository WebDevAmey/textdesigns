/** Motion presets shared by the docs UI. Values come from the library's motion tokens. */
import { ease } from "@registry/textlab/lib/motion-tokens";

export const easeOut = [...ease.enter] as [number, number, number, number];

// A short blurred crossfade for content that swaps in place: the blur hides the moment both versions overlap.
export const swap = {
  initial: { opacity: 0, filter: "blur(2px)" },
  animate: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.15, ease: easeOut } },
  exit: { opacity: 0, filter: "blur(2px)", transition: { duration: 0.1, ease: easeOut } },
} as const;
