"use client";

import type { CSSProperties, ElementType } from "react";
import { motion } from "motion/react";
import { SrText } from "../lib/a11y";
import { hashString, seeded } from "../lib/math";
import { charsets } from "../lib/scramble";
import { splitWords } from "../lib/split";
import { useHydrated } from "../lib/use-hydrated";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type MatrixDecodeVariant = "rain" | "flicker";

export interface MatrixDecodeProps {
  text: string;
  /** rain drops a column of glyphs onto each letter; flicker cycles glyphs in place. */
  variant?: MatrixDecodeVariant;
  /** Glow color as letters resolve. */
  glow?: string;
  charset?: string;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always">;
  active?: boolean;
  once?: boolean;
  delay?: number;
  /** Seconds the whole word takes to resolve. */
  duration?: number;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * Glyph rain resolves into the word. Each letter catches a short falling column of characters,
 * flashes bright as it locks, then cools to the text color.
 */
export function MatrixDecode({
  text,
  variant = "rain",
  glow = "oklch(0.86 0.2 150)",
  charset = charsets.katakana,
  as: Tag = "span",
  trigger = "inView",
  active,
  once = true,
  delay = 0,
  duration = 1.6,
  reducedMotion = "user",
  className,
  style,
}: MatrixDecodeProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const hydrated = useHydrated();
  const reduced = useReduced(reducedMotion);
  const words = splitWords(text);
  const rand = seeded(hashString(text));
  const total = words.reduce((n, w) => n + w.chars.length, 0);

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style} {...bind}>
        {text}
      </Tag>
    );
  }

  const glyph = () => charset[Math.floor(rand() * charset.length)];

  return (
    <Tag ref={ref} className={className} style={style} data-tl-motion={reducedMotion === "user" ? "user" : undefined} data-tl-pending={hydrated ? undefined : ""} {...bind}>
      <SrText>{text}</SrText>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              {word.chars.map((char, c) => {
                const i = word.charOffset + c;
                // Letters resolve in a loose left-to-right order with a little randomness.
                const at = delay + (i / Math.max(total, 1)) * duration * 0.7 + rand() * duration * 0.25;
                const column = Array.from({ length: 6 }, glyph);
                const flicker = Array.from({ length: 4 }, glyph);
                return (
                  <span key={c} style={{ position: "relative", display: "inline-block" }}>
                    {variant === "rain" ? (
                      <motion.span
                        style={{ position: "absolute", left: 0, right: 0, bottom: "100%", display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1, fontSize: "0.5em", color: glow, pointerEvents: "none" }}
                        initial={{ y: "-60%", opacity: 0 }}
                        animate={on ? { y: ["-60%", "140%"], opacity: [0, 1, 0] } : { y: "-60%", opacity: 0 }}
                        transition={on ? { duration: 0.55, delay: Math.max(0, at - 0.45), ease: "easeIn" } : { duration: 0 }} // glyphs fall, so they accelerate
                      >
                        {column.map((g, k) => (
                          <span key={k} style={{ opacity: (k + 1) / column.length }}>
                            {g}
                          </span>
                        ))}
                      </motion.span>
                    ) : (
                      <motion.span
                        style={{ position: "absolute", inset: 0, textAlign: "center", color: glow }}
                        initial={{ opacity: 0 }}
                        animate={on ? { opacity: [0, 1, 1, 0] } : { opacity: 0 }}
                        transition={on ? { duration: 0.5, delay: Math.max(0, at - 0.4), times: [0, 0.1, 0.8, 1] } : { duration: 0 }}
                      >
                        {flicker.map((g, k) => (
                          <motion.span
                            key={k}
                            style={{ position: "absolute", inset: 0 }}
                            initial={{ opacity: 0 }}
                            animate={on ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                            transition={on ? { duration: 0.14, delay: Math.max(0, at - 0.4) + k * 0.1 } : { duration: 0 }}
                          >
                            {g}
                          </motion.span>
                        ))}
                      </motion.span>
                    )}
                    <motion.span
                      data-tl-part=""
                      style={{ display: "inline-block" }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: on ? 1 : 0 }}
                      transition={on ? { duration: 0.08, delay: at } : { duration: 0.15 }}
                    >
                      {char}
                    </motion.span>
                    {/* A glowing copy flashes on top as the letter locks, then cools away. */}
                    <motion.span
                      style={{ position: "absolute", inset: 0, color: glow, textShadow: `0 0 0.35em ${glow}`, pointerEvents: "none" }}
                      initial={{ opacity: 0 }}
                      animate={on ? { opacity: [0, 1, 0] } : { opacity: 0 }}
                      transition={on ? { duration: 1, delay: at, times: [0, 0.08, 1], ease: "easeOut" } : { duration: 0 }}
                    >
                      {char}
                    </motion.span>
                  </span>
                );
              })}
            </span>
            {w < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}

export default MatrixDecode;
