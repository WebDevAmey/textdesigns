"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooths wheel scrolling on the landing page. It moves the native scroll position, so
 * motion's useScroll keeps reading real values. Skipped entirely when motion is reduced.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.12 });
    return () => lenis.destroy();
  }, []);
  return null;
}
