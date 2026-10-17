"use client";

import { useEffect, useState, type CSSProperties, type ElementType } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { SrText } from "../lib/a11y";
import { formatNumber } from "../lib/format";
import { resolveEase, type EaseInput } from "../lib/motion-tokens";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type StatRevealVariant = "count" | "spring" | "scramble";

export interface StatRevealProps {
  value: number;
  /** count eases up, spring overshoots a touch and settles, scramble shuffles digits then locks in. */
  variant?: StatRevealVariant;
  /** Number to count from. */
  from?: number;
  /** Text before and after the number, for example "$" and "+". */
  prefix?: string;
  suffix?: string;
  format?: Intl.NumberFormatOptions;
  locale?: string;
  trigger?: Exclude<Trigger, "always" | "hover">;
  active?: boolean;
  once?: boolean;
  delay?: number;
  duration?: number;
  ease?: EaseInput;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
  onComplete?: () => void;
}

/**
 * A headline stat that counts up when it scrolls into view. The final value reserves its width
 * from the first frame, so the line never grows as the digits climb.
 */
export function StatReveal({
  value,
  variant = "count",
  from = 0,
  prefix = "",
  suffix = "",
  format,
  locale,
  trigger = "inView",
  active,
  once = true,
  delay = 0,
  duration = 1.8,
  ease = "emphasized",
  as: Tag = "span",
  reducedMotion = "user",
  className,
  style,
  onComplete,
}: StatRevealProps) {
  const { ref, on } = useTrigger<HTMLElement>({ trigger, active, once });
  const reduced = useReduced(reducedMotion);
  const mv = useMotionValue(from);
  const decimals = format?.maximumFractionDigits ?? (Number.isInteger(value) ? 0 : 1);
  const display = useTransform(mv, (v) => formatNumber(Number(v.toFixed(decimals)), locale, format));
  const final = formatNumber(value, locale, format);
  const [scrambled, setScrambled] = useState<string | null>(null);

  useEffect(() => {
    if (reduced) return;
    if (!on) {
      mv.set(from);
      return;
    }
    if (variant === "scramble") {
      // Shuffle every digit, then lock them in left to right.
      const start = performance.now() + delay * 1000;
      let raf = 0;
      const frame = (t: number) => {
        const p = Math.min(1, Math.max(0, (t - start) / (duration * 1000)));
        const locked = Math.floor(p * final.length);
        setScrambled(
          Array.from(final, (ch, i) => (i < locked || !/\d/.test(ch) ? ch : String(Math.floor(Math.random() * 10)))).join(""),
        );
        if (p < 1) raf = requestAnimationFrame(frame);
        else {
          setScrambled(null);
          onComplete?.();
        }
      };
      raf = requestAnimationFrame(frame);
      return () => cancelAnimationFrame(raf);
    }
    const controls = animate(mv, value, variant === "spring" ? { type: "spring", visualDuration: duration * 0.6, bounce: 0.25, delay } : { duration, delay, ease: resolveEase(ease) });
    controls.then(() => onComplete?.());
    return () => controls.stop();
    // onComplete is a callback; re-running on its identity would restart the count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, value, from, variant, duration, delay, ease, reduced, final, mv]);

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums", ...style }}>
        {prefix}
        {final}
        {suffix}
      </Tag>
    );
  }

  return (
    <Tag ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", ...style }}>
      <SrText>{`${prefix}${final}${suffix}`}</SrText>
      <span aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>
        <span style={{ visibility: "hidden" }}>
          {prefix}
          {final}
          {suffix}
        </span>
        <span style={{ position: "absolute", inset: 0, textAlign: "right" }}>
          {prefix}
          {variant === "scramble" ? <span>{scrambled ?? (on ? final : final.replace(/\d/g, "0"))}</span> : <motion.span>{display}</motion.span>}
          {suffix}
        </span>
      </span>
    </Tag>
  );
}

export default StatReveal;
