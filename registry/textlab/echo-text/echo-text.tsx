"use client";

import { useState, type CSSProperties, type ElementType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { srOnly } from "../lib/a11y";
import { ease } from "../lib/motion-tokens";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type EchoTextVariant = "trail" | "ghost";

export interface EchoTextProps {
  /** The current text. Each change leaves echoes of the old one. */
  text: string;
  /** trail drops a row of offset copies that fade in sequence; ghost blooms the old text outward as it fades. */
  variant?: EchoTextVariant;
  /** Number of echo copies per change. */
  echoes?: number;
  /** Announce changes to screen readers. */
  live?: boolean;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * Every change leaves fading echoes behind. The new text arrives crisp while copies of the old one
 * drift off and dissolve, so the change itself is visible for a moment.
 */
export function EchoText({ text, variant = "trail", echoes = 4, live = true, as: Tag = "span", reducedMotion = "user", className, style }: EchoTextProps) {
  const reduced = useReduced(reducedMotion);
  const [history, setHistory] = useState<{ id: number; text: string }[]>([]);
  const [previous, setPrevious] = useState(text);
  const [count, setCount] = useState(0);

  // Track changes while rendering, the way React recommends for state that follows a prop.
  if (text !== previous) {
    setPrevious(text);
    setCount((c) => c + 1);
    setHistory((h) => [...h.slice(-2), { id: count + 1, text: previous }]);
  }

  if (reduced) {
    return (
      <Tag className={className} style={style} aria-live={live ? "polite" : undefined}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag className={className} style={{ position: "relative", display: "inline-grid", ...style }}>
      <span style={srOnly}>
        <span aria-live={live ? "polite" : undefined}>{text}</span>
      </span>
      <AnimatePresence>
        {history.map((entry) =>
          Array.from({ length: variant === "trail" ? echoes : 1 }, (_, k) => (
            <motion.span
              key={`${entry.id}-${k}`}
              aria-hidden="true"
              style={{ gridArea: "1 / 1", whiteSpace: "nowrap", pointerEvents: "none" }}
              initial={variant === "trail" ? { opacity: 0.5 - k * 0.08, transform: "translate(0em, 0em)" } : { opacity: 0.7, transform: "scale(1)", filter: "blur(0px)" }}
              animate={
                variant === "trail"
                  ? { opacity: 0, transform: `translate(${(k + 1) * 0.06}em, ${(k + 1) * 0.1}em)` }
                  : { opacity: 0, transform: "scale(1.35)", filter: "blur(6px)" }
              }
              transition={{ duration: 0.7 + k * 0.12, delay: k * 0.05, ease: [...ease.enter] }}
              onAnimationComplete={() => {
                if (k === 0) setHistory((h) => h.filter((e) => e.id !== entry.id));
              }}
            >
              {entry.text}
            </motion.span>
          )),
        )}
      </AnimatePresence>
      <motion.span
        key={count}
        aria-hidden="true"
        style={{ gridArea: "1 / 1", whiteSpace: "nowrap", position: "relative" }}
        initial={count === 0 ? false : { opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.3, ease: [...ease.enter] }}
      >
        {text}
      </motion.span>
    </Tag>
  );
}

export default EchoText;
