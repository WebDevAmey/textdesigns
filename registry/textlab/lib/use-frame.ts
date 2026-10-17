import { useEffect, useEffectEvent, useState, type RefObject } from "react";

export interface FrameOptions {
  /** Element whose visibility gates the loop. Offscreen means paused. */
  ref?: RefObject<Element | null>;
  /** Turn the loop off entirely, for example under reduced motion. */
  enabled?: boolean;
}

/**
 * One requestAnimationFrame loop per component.
 * Pauses while the element is offscreen and while the tab is hidden, so idle effects cost nothing.
 * The callback receives elapsed time and the frame delta, both in seconds. Delta is capped at 50 ms
 * so a long pause never makes physics jump.
 */
export function useFrame(callback: (time: number, delta: number) => void, { ref, enabled = true }: FrameOptions = {}) {
  const onFrame = useEffectEvent(callback);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const node = ref?.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "64px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref]);

  useEffect(() => {
    if (!enabled || !visible) return;
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    const tick = (now: number) => {
      const delta = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      elapsed += delta;
      onFrame(elapsed, delta);
      raf = requestAnimationFrame(tick);
    };
    const start = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [enabled, visible]);
}
