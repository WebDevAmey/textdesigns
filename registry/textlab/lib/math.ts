export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/** Map a value from one range to another, clamped. */
export const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) =>
  lerp(outMin, outMax, clamp((value - inMin) / (inMax - inMin || 1)));

/** Frame-rate independent smoothing. `rate` is roughly how many times per second the gap halves. */
export const damp = (from: number, to: number, rate: number, dt: number) => lerp(from, to, 1 - Math.exp(-rate * dt));

/** Deterministic pseudo random generator, so server and client agree. */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

/** Hash a string into a 32 bit seed. */
export function hashString(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
