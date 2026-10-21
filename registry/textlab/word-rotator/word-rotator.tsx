"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";
import { srOnly } from "../lib/a11y";
import { ease } from "../lib/motion-tokens";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type WordRotatorVariant = "slide" | "blur" | "flip";

export interface WordRotatorProps {
  words: string[];
  /** How each word arrives. */
  variant?: WordRotatorVariant;
  /** Seconds each word stays. */
  interval?: number;
  /** Pause while hovered or focused. */
  pauseOnHover?: boolean;
  /** What screen readers hear. Defaults to every word in order. */
  label?: string;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

// Full transform strings, so entering and leaving words can run on the compositor.
// Full transform strings, so entering and leaving words can run on the compositor. A light blur
// bridges the moment two words overlap, so the swap reads as one movement.
const MOTION: Record<WordRotatorVariant, { initial: TargetAndTransition; rest: TargetAndTransition; exit: TargetAndTransition }> = {
  slide: {
    initial: { transform: "translateY(85%)", opacity: 0, filter: "blur(3px)" },
    rest: { transform: "translateY(0%)", opacity: 1, filter: "blur(0px)" },
    exit: { transform: "translateY(-85%)", opacity: 0, filter: "blur(3px)" },
  },
  blur: { initial: { opacity: 0, filter: "blur(8px)" }, rest: { opacity: 1, filter: "blur(0px)" }, exit: { opacity: 0, filter: "blur(8px)" } },
  flip: {
    initial: { transform: "rotateX(-80deg)", opacity: 0 },
    rest: { transform: "rotateX(0deg)", opacity: 1 },
    exit: { transform: "rotateX(80deg)", opacity: 0 },
  },
};

/**
 * Cycles words in a sentence while the width follows, so the words around it slide to make room
 * instead of jumping. Every word is measured once, so the width eases to an exact target instead of
 * being scaled, which keeps the letters crisp while it moves.
 */
export function WordRotator({ words, variant = "slide", interval = 2.4, pauseOnHover = true, label, as: Tag = "span", reducedMotion = "user", className, style }: WordRotatorProps) {
  const reduced = useReduced(reducedMotion);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const sizers = useRef<HTMLSpanElement | null>(null);
  const [widths, setWidths] = useState<number[]>([]);

  useEffect(() => {
    if (reduced || paused || words.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval * 1000);
    return () => clearInterval(id);
  }, [reduced, paused, words.length, interval]);

  useEffect(() => {
    const node = sizers.current;
    if (!node) return;
    const measure = () => setWidths(Array.from(node.children, (child) => (child as HTMLElement).getBoundingClientRect().width));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [words, reduced]);

  const spoken = label ?? words.join(", ");
  if (reduced) {
    return (
      <Tag className={className} style={style}>
        <span style={srOnly}>{spoken}</span>
        <span aria-hidden="true">{words[0]}</span>
      </Tag>
    );
  }

  const m = MOTION[variant];
  const width = widths[index];
  const hover = pauseOnHover ? { onPointerEnter: () => setPaused(true), onPointerLeave: () => setPaused(false), onFocus: () => setPaused(true), onBlur: () => setPaused(false) } : {};
  // Room above and below the clip so descenders (g, y, p) and accents are never cut; negative margins keep the line height unchanged.
  // Each word also carries a little side padding, so italic overhangs stay inside the clip.
  const clipRoom: CSSProperties = { paddingTop: "0.12em", paddingBottom: "0.28em", marginTop: "-0.12em", marginBottom: "-0.28em" };
  return (
    <Tag className={className} style={style} {...hover}>
      <span style={srOnly}>{spoken}</span>
      <span ref={sizers} aria-hidden="true" style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", whiteSpace: "nowrap", height: 0, overflow: "hidden" }}>
        {words.map((word, i) => (
          <span key={i} style={{ display: "inline-block", padding: "0 0.08em" }}>
            {word}
          </span>
        ))}
      </span>
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={width ? { width } : undefined}
        transition={{ duration: 0.55, ease: [...ease.standard] }}
        style={{
          position: "relative",
          display: "inline-grid",
          margin: "0 -0.08em",
          verticalAlign: "bottom",
          overflow: variant === "slide" ? "hidden" : "visible",
          perspective: variant === "flip" ? 500 : undefined,
          ...(variant === "slide" ? clipRoom : null),
        }}
      >
        <AnimatePresence initial={false}>
          <motion.span
            key={index}
            initial={m.initial}
            animate={m.rest}
            exit={{ ...m.exit, transition: { duration: 0.4, ease: [...ease.exit] } }}
            transition={{ duration: 0.6, ease: [...ease.enter] }}
            style={{ gridArea: "1 / 1", display: "inline-block", whiteSpace: "nowrap", padding: "0 0.08em", transformOrigin: "50% 50%" }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </Tag>
  );
}

export default WordRotator;
