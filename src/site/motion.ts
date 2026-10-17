/** Motion presets shared by the docs UI. Values come from the library's motion tokens. */

// A short blurred crossfade for content that swaps in place: the blur hides the moment both versions overlap.
export const swap = {
  initial: { opacity: 0, filter: "blur(2px)" },
  animate: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, filter: "blur(2px)", transition: { duration: 0.1, ease: [0.22, 1, 0.36, 1] } },
} as const;
