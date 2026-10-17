/**
 * Motion tokens shared by every Textlab component.
 * Durations are in seconds, the unit motion uses.
 */
export type Bezier = readonly [number, number, number, number];

export const ease = {
  /** Entrances. A strong ease-out: fast start, long soft landing. */
  enter: [0.23, 1, 0.32, 1],
  /** Exits also use ease-out, so the response starts the instant it is asked for. Keep exits short instead. */
  exit: [0.23, 1, 0.32, 1],
  /** Things that move while already on screen. A strong ease-in-out. */
  standard: [0.77, 0, 0.175, 1],
  /** Hero moments that need a longer tail. */
  emphasized: [0.16, 1, 0.3, 1],
  linear: [0, 0, 1, 1],
} as const satisfies Record<string, Bezier>;

export type EaseName = keyof typeof ease;
export type EaseInput = EaseName | Bezier;

export const duration = {
  instant: 0.1,
  fast: 0.16,
  base: 0.24,
  slow: 0.4,
  reveal: 0.8,
  ambient: 2.4,
} as const;

export const spring = {
  /** Presses and small toggles. No overshoot. */
  snappy: { type: "spring", visualDuration: 0.25, bounce: 0 },
  /** Settling into place. */
  smooth: { type: "spring", visualDuration: 0.4, bounce: 0.1 },
  /** Letters landing. A little life. */
  bouncy: { type: "spring", visualDuration: 0.5, bounce: 0.3 },
  /** Slow ambient drift. */
  gentle: { type: "spring", visualDuration: 0.8, bounce: 0.1 },
} as const;

export const stagger = {
  char: 0.02,
  word: 0.06,
  line: 0.1,
} as const;

export const motionTokens = { ease, duration, spring, stagger } as const;

/** Resolve an ease token name or a custom bezier into a mutable array motion accepts. */
export function resolveEase(value: EaseInput | undefined, fallback: EaseName = "enter"): [number, number, number, number] {
  const curve = typeof value === "string" ? ease[value] : value ?? ease[fallback];
  return [curve[0], curve[1], curve[2], curve[3]];
}

/** CSS cubic-bezier() string for an ease token or bezier. */
export function cssEase(value: EaseInput | undefined, fallback: EaseName = "enter"): string {
  const [a, b, c, d] = resolveEase(value, fallback);
  return `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
}
