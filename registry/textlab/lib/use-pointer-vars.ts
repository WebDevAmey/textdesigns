import { useEffect, useRef, type RefObject } from "react";
import { damp } from "./math";
import { useFrame } from "./use-frame";

export interface PointerVarsOptions {
  enabled?: boolean;
  /** Higher follows faster. Around 10 feels like a light, heavy object; 25 feels instant. */
  rate?: number;
  /** Where the point rests when the pointer leaves, 0 to 1. Null keeps the last position. */
  rest?: [number, number] | null;
  /** Follow touch drags too, not only mouse and pen. */
  touch?: boolean;
}

/**
 * Write the smoothed pointer position onto an element as CSS variables, without re-rendering:
 * --tl-px and --tl-py (0 to 1 across the element), --tl-x and --tl-y (px), and --tl-in (0 or 1, eased).
 */
export function usePointerVars(ref: RefObject<HTMLElement | null>, { enabled = true, rate = 12, rest = [0.5, 0.5], touch = true }: PointerVarsOptions = {}) {
  const restX = rest ? rest[0] : null;
  const restY = rest ? rest[1] : null;
  const target = useRef({ x: restX ?? 0.5, y: restY ?? 0.5, inside: 0 });
  const current = useRef({ x: restX ?? 0.5, y: restY ?? 0.5, inside: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    const move = (event: PointerEvent) => {
      if (!touch && event.pointerType === "touch") return;
      const rect = node.getBoundingClientRect();
      target.current.x = (event.clientX - rect.left) / (rect.width || 1);
      target.current.y = (event.clientY - rect.top) / (rect.height || 1);
      target.current.inside = 1;
    };
    const leave = () => {
      target.current.inside = 0;
      if (restX !== null && restY !== null) {
        target.current.x = restX;
        target.current.y = restY;
      }
    };
    node.addEventListener("pointermove", move, { passive: true });
    node.addEventListener("pointerdown", move, { passive: true });
    node.addEventListener("pointerleave", leave);
    node.addEventListener("pointercancel", leave);
    return () => {
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerdown", move);
      node.removeEventListener("pointerleave", leave);
      node.removeEventListener("pointercancel", leave);
    };
  }, [ref, enabled, touch, restX, restY]);

  useFrame(
    (_, dt) => {
      const node = ref.current;
      if (!node) return;
      const c = current.current;
      const t = target.current;
      const settled = Math.abs(c.x - t.x) < 0.0005 && Math.abs(c.y - t.y) < 0.0005 && Math.abs(c.inside - t.inside) < 0.002;
      if (settled) return;
      c.x = damp(c.x, t.x, rate, dt);
      c.y = damp(c.y, t.y, rate, dt);
      c.inside = damp(c.inside, t.inside, rate * 0.6, dt);
      const rect = node.getBoundingClientRect();
      node.style.setProperty("--tl-px", c.x.toFixed(4));
      node.style.setProperty("--tl-py", c.y.toFixed(4));
      node.style.setProperty("--tl-x", `${(c.x * rect.width).toFixed(1)}px`);
      node.style.setProperty("--tl-y", `${(c.y * rect.height).toFixed(1)}px`);
      node.style.setProperty("--tl-in", c.inside.toFixed(3));
    },
    { ref, enabled },
  );
}
