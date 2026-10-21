"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { duration, ease } from "../lib/motion-tokens";
import { splitWords } from "../lib/split";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type CaretMorphVariant = "bar" | "block" | "highlight";

export interface CaretMorphProps {
  text: string;
  /** bar sits after the word like a cursor, block inverts the word, highlight selects it. */
  variant?: CaretMorphVariant;
  /** Tour the words on its own while nobody is pointing. */
  autoplay?: boolean;
  /** Seconds per word on the tour. */
  interval?: number;
  /** Highlight color for the highlight variant. */
  color?: string;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

type Box = { x: number; y: number; w: number; h: number };

/**
 * A caret that glides between words and reshapes to fit them. Point at a word, or focus the
 * sentence and use the arrow keys, and the caret springs there.
 */
export function CaretMorph({ text, variant = "highlight", autoplay = true, interval = 1.3, color = "var(--tl-accent, #3a9a5b)", as: Tag = "p", reducedMotion = "user", className, style }: CaretMorphProps) {
  const reduced = useReduced(reducedMotion);
  const words = splitWords(text);
  const root = useRef<HTMLElement | null>(null);
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [index, setIndex] = useState(0);
  const [engaged, setEngaged] = useState(false);

  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return;
    const measure = () => {
      const spans = node.querySelectorAll<HTMLElement>("[data-tl-word]");
      // Measure against the root's own box: offsetLeft is relative to the nearest positioned ancestor,
      // which here is an inline wrapper whose origin moves when the sentence wraps.
      const origin = node.getBoundingClientRect();
      setBoxes(
        Array.from(spans, (s) => {
          const r = s.getBoundingClientRect();
          return { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
        }),
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [text]);

  useEffect(() => {
    if (!autoplay || engaged || reduced || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval * 1000);
    return () => clearInterval(id);
  }, [autoplay, engaged, reduced, words.length, interval]);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    setIndex((i) => (i + (event.key === "ArrowRight" ? 1 : -1) + words.length) % words.length);
  };

  const box = boxes[index];
  // The caret is a fixed 100px-wide box moved and stretched with one transform, so the glide never
  // touches layout. Its height only changes with the line height, which does not animate.
  const BASE = 100;
  const caret: CSSProperties = { position: "absolute", left: 0, top: 0, width: BASE, pointerEvents: "none", transformOrigin: "0 0", borderRadius: variant === "bar" ? 2 : "0.12em" };
  const frame = box
    ? variant === "bar"
      ? { x: box.x + box.w + 2, y: box.y + box.h * 0.12, w: Math.max(2, box.h * 0.06), h: box.h * 0.78 }
      : { x: box.x - box.h * 0.08, y: box.y + box.h * 0.04, w: box.w + box.h * 0.16, h: box.h * 0.92 }
    : null;
  const target = frame ? { transform: `translate(${frame.x.toFixed(1)}px, ${frame.y.toFixed(1)}px) scaleX(${(frame.w / BASE).toFixed(4)})` } : null;

  return (
    <Tag
      ref={root}
      className={className}
      style={{ position: "relative", ...style }}
      tabIndex={0}
      role="group"
      aria-label={text}
      onKeyDown={onKeyDown}
      onFocus={() => setEngaged(true)}
      onBlur={() => setEngaged(false)}
      onPointerLeave={() => setEngaged(false)}
    >
      {target && !reduced && (
        <motion.span
          aria-hidden="true"
          style={{
            ...caret,
            height: frame?.h,
            background: variant === "highlight" ? `color-mix(in oklab, ${color} 28%, transparent)` : "currentColor",
            mixBlendMode: variant === "block" ? "difference" : undefined,
            zIndex: variant === "block" ? 2 : 0,
          }}
          initial={false}
          animate={target}
          transition={{ duration: duration.base * 0.85, ease: [...ease.enter] }}
        />
      )}
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i}>
            <span
              data-tl-word=""
              onPointerEnter={() => {
                setEngaged(true);
                setIndex(i);
              }}
              style={{ position: "relative", zIndex: 1 }}
            >
              {word.text}
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}

export default CaretMorph;
