import { useEffect, useRef, type RefObject } from "react";

export interface LetterBox {
  el: HTMLElement;
  /** Center relative to the container, in px. */
  cx: number;
  cy: number;
}

/**
 * Measure the letters inside a container (by `[data-tl-char]`) once and again on resize.
 * Positions are read from layout, not from transforms, so animated offsets never feed back.
 */
export function useLetterBoxes(ref: RefObject<HTMLElement | null>, deps: unknown[] = []) {
  const boxes = useRef<LetterBox[]>([]);
  /** The container's font size in px, measured with the boxes so frame loops never force a style read. */
  const em = useRef(16);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = () => {
      em.current = parseFloat(getComputedStyle(node).fontSize) || 16;
      boxes.current = Array.from(node.querySelectorAll<HTMLElement>("[data-tl-char]"), (el) => ({
        el,
        cx: el.offsetLeft + el.offsetWidth / 2,
        cy: el.offsetTop + el.offsetHeight / 2,
      }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, ...deps]);
  return { boxes, em };
}
