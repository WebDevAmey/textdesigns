"use client";

import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { AnimatePresence, motion, useSpring, useTransform } from "motion/react";
import { SrText } from "../lib/a11y";
import { formatNumber, isDigit } from "../lib/format";
import { spring as springs } from "../lib/motion-tokens";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type RollingNumberVariant = "shortest" | "up" | "down";

export interface RollingNumberProps {
  value: number;
  /** shortest takes the nearer way round; up always rolls upward; down always rolls downward. */
  variant?: RollingNumberVariant;
  /** Intl.NumberFormat options, for example { style: "currency", currency: "EUR" }. */
  format?: Intl.NumberFormatOptions;
  /** Defaults to en-US so server and client agree. */
  locale?: string;
  /** Seconds a digit takes to settle. */
  duration?: number;
  /** Roll bounce, 0 to 0.5. */
  bounce?: number;
  /** Announce changes to screen readers. */
  live?: boolean;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

// Three cycles of digits let a column keep rolling the same way, then quietly re-center.
const CELLS = Array.from({ length: 30 }, (_, i) => i % 10);

function Digit({ digit, variant, duration, bounce }: { digit: number; variant: RollingNumberVariant; duration: number; bounce: number }) {
  const pos = useRef(10 + digit);
  const spring = useSpring(10 + digit, { visualDuration: duration, bounce });
  const y = useTransform(spring, (v) => `${-v * 10 / 3}%`);

  useEffect(() => {
    const current = ((Math.round(pos.current) % 10) + 10) % 10;
    if (current === digit) return;
    const upSteps = (digit - current + 10) % 10;
    const downSteps = upSteps - 10;
    const step = variant === "up" ? upSteps : variant === "down" ? downSteps : Math.abs(downSteps) < upSteps ? downSteps : upSteps;
    // Re-center into the middle cycle before rolling, so the column never runs out of digits.
    const base = 10 + current;
    if (Math.round(pos.current) !== base) spring.jump(base + (spring.get() - Math.round(pos.current)));
    pos.current = base + step;
    spring.set(pos.current);
  }, [digit, variant, spring]);

  return (
    <span style={{ position: "relative", display: "inline-block", height: "1.15em", overflow: "hidden", verticalAlign: "bottom" }}>
      <span style={{ visibility: "hidden" }}>0</span>
      <motion.span style={{ position: "absolute", left: 0, right: 0, top: 0, display: "flex", flexDirection: "column", y }}>
        {CELLS.map((n, i) => (
          <span key={i} style={{ height: "1.15em", lineHeight: "1.15em", textAlign: "center" }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Each digit rolls to its new value on its own reel. Columns are keyed from the right, so the
 * ones digit stays the ones digit when the number grows, and new leading digits slide in.
 */
export function RollingNumber({
  value,
  variant = "shortest",
  format,
  locale,
  duration = 0.6,
  bounce = springs.smooth.bounce,
  live = false,
  as: Tag = "span",
  reducedMotion = "user",
  className,
  style,
}: RollingNumberProps) {
  const reduced = useReduced(reducedMotion);
  const text = formatNumber(value, locale, format);
  const chars = Array.from(text);

  if (reduced) {
    return (
      <Tag className={className} style={{ fontVariantNumeric: "tabular-nums", ...style }} aria-live={live ? "polite" : undefined}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag className={className} style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", ...style }}>
      <SrText>
        <span aria-live={live ? "polite" : undefined}>{text}</span>
      </SrText>
      <span aria-hidden="true" style={{ display: "inline-flex", alignItems: "flex-end", lineHeight: "1.15em" }}>
        <AnimatePresence initial={false} mode="popLayout">
          {chars.map((char, i) => {
            const key = chars.length - i;
            return (
              <motion.span
                key={key}
                layout="position"
                initial={{ opacity: 0, y: "0.4em", filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: "-0.4em", filter: "blur(2px)" }}
                transition={{ type: "spring", visualDuration: duration * 0.8, bounce: 0 }}
                style={{ display: "inline-block" }}
              >
                {isDigit(char) ? <Digit digit={Number(char)} variant={variant} duration={duration} bounce={bounce} /> : char}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </span>
    </Tag>
  );
}

export default RollingNumber;
