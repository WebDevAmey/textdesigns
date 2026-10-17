"use client";

import { useEffect, useState, type CSSProperties, type ElementType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { srOnly } from "../lib/a11y";
import { ease } from "../lib/motion-tokens";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useSvgId } from "../lib/use-svg-id";

export type GooeyTextVariant = "blob" | "drip";

export interface GooeyTextProps {
  /** Words to melt between. */
  words: string[];
  /** blob melts one word into the next in place; drip lets the old word drip away as the new one forms. */
  variant?: GooeyTextVariant;
  /** Seconds each word holds. */
  interval?: number;
  /** Seconds the melt takes. */
  duration?: number;
  /** How sticky the goo is, 4 to 20. Higher merges letters more. */
  goo?: number;
  label?: string;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * Words melt into each other. Two words cross-blur inside an alpha-threshold filter, so their
 * shapes merge like liquid instead of simply fading.
 */
export function GooeyText({ words, variant = "blob", interval = 2.2, duration = 1, goo = 12, label, as: Tag = "span", reducedMotion = "user", className, style }: GooeyTextProps) {
  const id = useSvgId("tl-goo");
  const reduced = useReduced(reducedMotion);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), (interval + duration) * 1000);
    return () => clearInterval(timer);
  }, [reduced, words.length, interval, duration]);

  const spoken = label ?? words.join(", ");
  if (reduced) {
    return (
      <Tag className={className} style={style}>
        <span style={srOnly}>{spoken}</span>
        <span aria-hidden="true">{words[0]}</span>
      </Tag>
    );
  }

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const exit = variant === "drip" ? { opacity: 0, filter: "blur(10px)", y: "0.5em", scaleY: 1.4 } : { opacity: 0, filter: "blur(12px)" };

  return (
    <Tag className={className} style={{ position: "relative", display: "inline-block", ...style }}>
      <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={id}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="sharp" />
            <feColorMatrix in="sharp" type="matrix" values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${goo} -${goo * 0.42}`} />
          </filter>
        </defs>
      </svg>
      <span style={srOnly}>{spoken}</span>
      <span aria-hidden="true" style={{ position: "relative", display: "inline-grid", filter: `url(#${id})` }}>
        <span style={{ gridArea: "1 / 1", visibility: "hidden" }}>{longest}</span>
        <AnimatePresence initial={false}>
          <motion.span
            key={index}
            style={{ gridArea: "1 / 1", textAlign: "center", transformOrigin: "50% 0%" }}
            initial={{ opacity: 0, filter: "blur(12px)", y: variant === "drip" ? "-0.25em" : 0 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0, scaleY: 1 }}
            exit={{ ...exit, transition: { duration: duration * 0.9, ease: [...ease.standard] } }}
            transition={{ duration, ease: [...ease.enter] }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </Tag>
  );
}

export default GooeyText;
