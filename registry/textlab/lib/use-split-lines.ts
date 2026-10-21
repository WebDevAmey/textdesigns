import { useLayoutEffect, useEffect, useState, type RefObject } from "react";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Layout top of `el` relative to `root`, ignoring transforms. offsetTop alone is not enough: animated
 * parts are transformed, which makes them offset parents, so tops must be summed up the chain.
 */
function layoutTop(el: HTMLElement, root: HTMLElement) {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root && root.contains(node)) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  // The chain left the root (the root is not an offset parent): remove the root's own offset.
  if (node !== root) top -= root.offsetTop;
  return top;
}

/**
 * Group the word spans inside `ref` into visual lines.
 * Word spans are found by `[data-tl-word]`. Returns the line index of each word, or null before
 * the first measure. Re-measures when the container width changes, once per frame at most.
 */
export function useSplitLines(ref: RefObject<HTMLElement | null>, wordCount: number, enabled = true): number[] | null {
  const [lines, setLines] = useState<number[] | null>(null);

  useIsoLayoutEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;
    let raf = 0;
    let lastWidth = -1;

    const measure = () => {
      raf = 0;
      const words = node.querySelectorAll<HTMLElement>("[data-tl-word]");
      const next: number[] = [];
      let line = -1;
      let lastTop = Number.NEGATIVE_INFINITY;
      words.forEach((word) => {
        const top = layoutTop(word, node);
        // Words on the same line can differ by a pixel or two with mixed fonts.
        if (top > lastTop + 2) {
          line += 1;
          lastTop = top;
        }
        next.push(line);
      });
      setLines((prev) => (prev && prev.length === next.length && prev.every((v, i) => v === next[i]) ? prev : next));
    };

    measure();
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      if (width === lastWidth) return;
      lastWidth = width;
      if (!raf) raf = requestAnimationFrame(measure);
    });
    observer.observe(node);
    // Fonts swapping in can rewrap lines.
    document.fonts?.ready.then(() => {
      if (!raf) raf = requestAnimationFrame(measure);
    });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [ref, wordCount, enabled]);

  return lines;
}

/** Group items by their line index. */
export function groupByLine<T>(items: T[], lineOf: number[]): T[][] {
  const groups: T[][] = [];
  items.forEach((item, i) => {
    const line = lineOf[i] ?? 0;
    (groups[line] ??= []).push(item);
  });
  return groups.filter(Boolean);
}
