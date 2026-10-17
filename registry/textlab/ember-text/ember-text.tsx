"use client";

import type { CSSProperties, ElementType } from "react";
import { motion } from "motion/react";
import { SrText } from "../lib/a11y";
import { splitWords } from "../lib/split";
import { useHydrated } from "../lib/use-hydrated";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type EmberTextVariant = "ember" | "steel" | "ice";

export interface EmberTextProps {
  text: string;
  /** ember glows white-hot to red, steel cools from blue-white, ice frosts from cyan. */
  variant?: EmberTextVariant;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always">;
  active?: boolean;
  once?: boolean;
  delay?: number;
  /** Seconds between letters. */
  stagger?: number;
  /** Seconds a letter takes to cool. */
  duration?: number;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const HEAT: Record<EmberTextVariant, string[]> = {
  ember: ["oklch(0.99 0.04 95)", "oklch(0.88 0.17 85)", "oklch(0.72 0.2 50)", "oklch(0.55 0.2 30)"],
  steel: ["oklch(0.99 0.01 250)", "oklch(0.88 0.06 240)", "oklch(0.7 0.1 250)", "oklch(0.5 0.08 260)"],
  ice: ["oklch(0.99 0.02 200)", "oklch(0.9 0.08 200)", "oklch(0.8 0.12 210)", "oklch(0.65 0.12 220)"],
};

/**
 * Letters land white-hot and cool down to the text color, one after another, like metal leaving
 * the forge. A glowing copy cools through the palette on top of each settled letter.
 */
export function EmberText({ text, variant = "ember", as: Tag = "span", trigger = "inView", active, once = true, delay = 0, stagger = 0.045, duration = 1.6, reducedMotion = "user", className, style }: EmberTextProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const hydrated = useHydrated();
  const reduced = useReduced(reducedMotion);
  const words = splitWords(text);
  const heat = HEAT[variant];

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style} {...bind}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className} style={style} data-tl-motion={reducedMotion === "user" ? "user" : undefined} data-tl-pending={hydrated ? undefined : ""} {...bind}>
      <SrText>{text}</SrText>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              {word.chars.map((char, c) => {
                const at = delay + (word.charOffset + c) * stagger;
                return (
                  <span key={c} style={{ position: "relative", display: "inline-block" }}>
                    <motion.span
                      data-tl-part=""
                      style={{ display: "inline-block" }}
                      initial={{ opacity: 0, y: "0.15em" }}
                      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: "0.15em" }}
                      transition={on ? { opacity: { duration: 0.2, delay: at }, y: { type: "spring", visualDuration: 0.5, bounce: 0.3, delay: at } } : { duration: 0.15 }}
                    >
                      {char}
                    </motion.span>
                    <motion.span
                      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
                      initial={{ opacity: 0, color: heat[0] }}
                      animate={
                        on
                          ? {
                              opacity: [0, 1, 1, 0],
                              color: heat,
                              textShadow: [`0 0 0.5em ${heat[1]}`, `0 0 0.35em ${heat[2]}`, `0 0 0.2em ${heat[3]}`, `0 0 0em ${heat[3]}`],
                            }
                          : { opacity: 0 }
                      }
                      transition={on ? { duration, delay: at, ease: "easeOut", times: [0, 0.08, 0.6, 1] } : { duration: 0 }}
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

export default EmberText;
