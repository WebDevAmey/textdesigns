/**
 * Tiny physics helpers. Semi-implicit Euler with sub-steps: stable at any frame rate and cheap
 * enough to run per letter.
 */
export interface Spring1D {
  x: number;
  v: number;
}

/** Advance a damped spring toward `target`. Stiffness and damping are per unit mass. */
export function stepSpring(s: Spring1D, target: number, stiffness: number, damping: number, dt: number) {
  const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
  const h = dt / steps;
  for (let i = 0; i < steps; i++) {
    const force = -stiffness * (s.x - target) - damping * s.v;
    s.v += force * h;
    s.x += s.v * h;
  }
}

/** True when a spring is close enough to rest that it can stop updating. */
export const atRest = (s: Spring1D, target: number, epsilon = 0.01) => Math.abs(s.x - target) < epsilon && Math.abs(s.v) < epsilon;
