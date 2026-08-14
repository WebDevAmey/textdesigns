import { createNoise3D, type NoiseFunction3D } from "simplex-noise";

/**
 * One shared 3D simplex field per mounted effect: sample it as
 * noise(seedX, seedY, time) to get smooth, organic per-particle drift
 * that never repeats identically across particles.
 */
export function createNoiseField(): NoiseFunction3D {
  return createNoise3D();
}
