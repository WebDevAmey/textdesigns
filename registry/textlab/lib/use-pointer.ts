import { useEffect, useRef, type RefObject } from "react";

export interface PointerState {
  /** Pointer position relative to the element's top left, in px. */
  x: number;
  y: number;
  /** Position normalised to the element, 0 to 1 inside. */
  nx: number;
  ny: number;
  inside: boolean;
  /** False until the first pointer move, and on touch-only devices. */
  active: boolean;
  /** Element size at the last move. */
  width: number;
  height: number;
}

/**
 * Track the pointer relative to an element without re-rendering.
 * Read `pointer.current` inside a frame loop. Listens on window so proximity effects work
 * before the pointer enters the element.
 */
export function usePointer(ref: RefObject<Element | null>, { enabled = true } = {}) {
  const pointer = useRef<PointerState>({ x: 0, y: 0, nx: 0.5, ny: 0.5, inside: false, active: false, width: 0, height: 0 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: PointerEvent) => {
      const node = ref.current;
      if (!node || event.pointerType === "touch") return;
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const state = pointer.current;
      state.x = x;
      state.y = y;
      state.width = rect.width;
      state.height = rect.height;
      state.nx = rect.width ? x / rect.width : 0.5;
      state.ny = rect.height ? y / rect.height : 0.5;
      state.inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      state.active = true;
    };
    const onLeave = () => {
      pointer.current.inside = false;
      pointer.current.active = false;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, enabled]);

  return pointer;
}
