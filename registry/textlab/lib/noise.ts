/**
 * Small 2D value noise. Smooth, cheap and deterministic. Good enough for drifting type.
 */
const PERM = new Uint8Array(512);
{
  const p = Array.from({ length: 256 }, (_, i) => i);
  let s = 1337;
  for (let i = 255; i > 0; i--) {
    s = (s * 16807) % 2147483647;
    const j = s % (i + 1);
    [p[i], p[j]] = [p[j], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
}

const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const rand = (x: number, y: number) => PERM[(PERM[x & 255] + y) & 511] / 255;

/** Value noise in the range 0 to 1. */
export function noise2(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = fade(xf);
  const v = fade(yf);
  const a = rand(xi, yi);
  const b = rand(xi + 1, yi);
  const c = rand(xi, yi + 1);
  const d = rand(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

/** Noise centered on 0, in the range -1 to 1. */
export const snoise2 = (x: number, y: number) => noise2(x, y) * 2 - 1;
