"use client";

import { useEffect, useState, type CSSProperties, type ElementType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { srOnly } from "../lib/a11y";
import { ease } from "../lib/motion-tokens";
import { splitWords } from "../lib/split";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger } from "../lib/use-trigger";

export type WordSequenceVariant = "stage" | "stack" | "cut";

export interface WordSequenceProps {
  text: string;
  /** stage gives each word the spotlight in turn, stack builds the sentence word by word, cut jumps between scales like film titles. */
  variant?: WordSequenceVariant;
  /** Seconds per word. */
  interval?: number;
  /** Seconds to hold the finished sentence before looping. */
  hold?: number;
  loop?: boolean;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const CUT_SCALES = [1, 0.55, 1.35, 0.8, 1.15];

/**
 * A sentence choreographed word by word, then shown whole. Each variant is a different director:
 * a spotlight, a builder, and a film editor.
 */
export function WordSequence({ text, variant = "stack", interval = 0.45, hold = 2, loop = true, as: Tag = "div", reducedMotion = "user", className, style }: WordSequenceProps) {
  const { ref, on } = useTrigger<HTMLElement>({ trigger: "inView" });
  const reduced = useReduced(reducedMotion);
  const words = splitWords(text).map((w) => w.text);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!on || reduced) return;
    const done = step >= words.length;
    if (done && !loop) return;
    const id = setTimeout(() => setStep((s) => (s >= words.length ? 0 : s + 1)), (done ? hold : interval) * 1000);
    return () => clearTimeout(id);
  }, [on, reduced, step, words.length, interval, hold, loop]);

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style}>
        {text}
      </Tag>
    );
  }

  const finished = step >= words.length;
  const current = Math.min(step, words.length - 1);

  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "grid", placeItems: "center", ...style }}>
      <span style={srOnly}>{text}</span>
      {variant === "stack" ? (
        <span aria-hidden="true" style={{ gridArea: "1 / 1", textAlign: "center" }}>
          {words.map((word, i) => (
            <motion.span
              key={i}
              style={{ display: "inline-block", marginRight: "0.25em" }}
              initial={false}
              animate={i < step || finished ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: "0.4em", filter: "blur(6px)" }}
              transition={{ type: "spring", visualDuration: 0.35, bounce: 0.15 }}
            >
              {word}
            </motion.span>
          ))}
        </span>
      ) : (
        <>
          {/* The full sentence holds the space and appears at the end of the sequence. */}
          <motion.span aria-hidden="true" style={{ gridArea: "1 / 1", textAlign: "center" }} initial={false} animate={{ opacity: finished ? 1 : 0, scale: finished ? 1 : 0.96 }} transition={{ duration: 0.35, ease: [...ease.enter] }}>
            {text}
          </motion.span>
          <AnimatePresence mode="popLayout">
            {!finished && (
              <motion.span
                key={current}
                aria-hidden="true"
                style={{ gridArea: "1 / 1", whiteSpace: "nowrap", fontSize: variant === "stage" ? "1.6em" : undefined }}
                initial={variant === "cut" ? { opacity: 1, scale: CUT_SCALES[current % CUT_SCALES.length] } : { opacity: 0, scale: 0.85, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: variant === "cut" ? CUT_SCALES[current % CUT_SCALES.length] : 1, filter: "blur(0px)" }}
                exit={variant === "cut" ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 1.1, filter: "blur(8px)", transition: { duration: 0.15 } }}
                transition={variant === "cut" ? { duration: 0 } : { duration: 0.25, ease: [...ease.enter] }}
              >
                {words[current]}
              </motion.span>
            )}
          </AnimatePresence>
        </>
      )}
    </Tag>
  );
}

export default WordSequence;
