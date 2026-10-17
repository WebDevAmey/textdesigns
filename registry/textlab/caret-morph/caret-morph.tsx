"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { spring } from "../lib/motion-tokens";
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
export function CaretMorph({ text, variant = "highlight", autoplay = true, interval = 1.3, color = "var(--tl-accent, #e5643a)", as: Tag = "p", reducedMotion = "user", className, style }: CaretMorphProps) {
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
      setBoxes(Array.from(spans, (s) => ({ x: s.offsetLeft, y: s.offsetTop, w: s.offsetWidth, h: s.offsetHeight })));
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
  const caret: CSSProperties = { position: "absolute", left: 0, top: 0, pointerEvents: "none", borderRadius: variant === "bar" ? 2 : "0.12em" };
  const target = box
    ? variant === "bar"
      ? { x: box.x + box.w + 2, y: box.y + box.h * 0.12, width: Math.max(2, box.h * 0.06), height: box.h * 0.78 }
      : { x: box.x - box.h * 0.08, y: box.y + box.h * 0.04, width: box.w + box.h * 0.16, height: box.h * 0.92 }
    : null;

  return (
    <Tag
      ref={root}
      className={className}
      style={{ position: "relative", ...style }}
      tabIndex={0}
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
            background: variant === "highlight" ? `color-mix(in oklab, ${color} 28%, transparent)` : "currentColor",
            mixBlendMode: variant === "block" ? "difference" : undefined,
            zIndex: variant === "block" ? 1 : 0,
          }}
          initial={false}
          animate={target}
          transition={spring.snappy}
        />
      )}
      <span aria-hidden="true" style={{ position: "relative" }}>
        {words.map((word, i) => (
          <span key={i}>
            <span
              data-tl-word=""
              onPointerEnter={() => {
                setEngaged(true);
                setIndex(i);
              }}
              style={{ position: "relative" }}
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
