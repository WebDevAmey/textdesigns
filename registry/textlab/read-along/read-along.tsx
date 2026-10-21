"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { motion } from "motion/react";
import { SrText } from "../lib/a11y";
import { ease } from "../lib/motion-tokens";
import { splitWords } from "../lib/split";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger } from "../lib/use-trigger";

export type ReadAlongVariant = "highlight" | "karaoke";

export interface ReadAlongProps {
  text: string;
  /** highlight slides a selection box from word to word, karaoke fills each word with color as it is read. */
  variant?: ReadAlongVariant;
  /** Reading pace in words per minute. */
  wpm?: number;
  /** Highlight or fill color. */
  color?: string;
  loop?: boolean;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * A selection-like highlight follows the reading, word by word, at a natural pace. Longer words get
 * a little more time, and punctuation earns a pause.
 */
export function ReadAlong({ text, variant = "highlight", wpm = 220, color = "var(--tl-accent, #3a9a5b)", loop = true, as: Tag = "p", reducedMotion = "user", className, style }: ReadAlongProps) {
  const { ref, on } = useTrigger<HTMLElement>({ trigger: "inView", once: false });
  const reduced = useReduced(reducedMotion);
  const words = splitWords(text);
  const [index, setIndex] = useState(-1);
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const spans = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!on || reduced) return;
    const word = words[index]?.text ?? "";
    const base = 60000 / wpm;
    const pause = /[.,;:!?]$/.test(word) ? base * 0.9 : 0;
    const wait = index < 0 ? 400 : base * (0.7 + Math.min(word.length, 12) * 0.05) + pause;
    const id = setTimeout(() => setIndex((i) => (i + 1 >= words.length ? (loop ? -1 : i) : i + 1)), index === words.length - 1 ? wait + 1400 : wait);
    return () => clearTimeout(id);
  }, [on, reduced, index, words, wpm, loop]);

  useLayoutEffect(() => {
    const root = ref.current;
    const el = spans.current[index];
    if (!el || !root) {
      setBox(null);
      return;
    }
    // Measure against the root's box: offsetLeft would be relative to whichever ancestor is positioned.
    const measure = () => {
      const origin = root.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      setBox({ x: r.left - origin.left - root.clientLeft, y: r.top - origin.top - root.clientTop, w: r.width, h: r.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, [index, ref]);

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className} style={{ position: "relative", ...style }}>
      <SrText>{text}</SrText>
      {variant === "highlight" && box && (
        <motion.span
          aria-hidden="true"
          style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", borderRadius: "0.18em", background: `color-mix(in oklab, ${color} 26%, transparent)`, pointerEvents: "none" }}
          initial={false}
          // Width animates instead of scaleX so the rounded corners stay round and the box hugs the word exactly.
          animate={{ transform: `translate(${box.x - 2}px, ${box.y}px)`, width: box.w + 4, height: box.h }}
          transition={{ duration: 0.22, ease: [...ease.enter] }}
        />
      )}
      <span aria-hidden="true" style={{ position: "relative" }}>
        {words.map((word, i) => (
          <span key={i}>
            <span
              ref={(el) => {
                spans.current[i] = el;
              }}
              style={
                variant === "karaoke"
                  ? {
                      backgroundImage: `linear-gradient(90deg, ${color} 50%, currentColor 50%)`,
                      backgroundSize: "200% 100%",
                      backgroundPosition: i < index ? "0% 0" : i === index ? "0% 0" : "100% 0",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      transition: i === index ? `background-position ${(60 / wpm) * 0.9}s linear` : "none",
                    }
                  : undefined
              }
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

export default ReadAlong;
