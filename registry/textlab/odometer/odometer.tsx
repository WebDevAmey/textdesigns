"use client";

import { useEffect, type CSSProperties, type ElementType } from "react";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { SrText } from "../lib/a11y";
import { formatNumber } from "../lib/format";
import { resolveEase, type EaseInput } from "../lib/motion-tokens";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type OdometerVariant = "mechanical" | "smooth";

export interface OdometerProps {
  value: number;
  /** mechanical turns a wheel only while the one to its right passes 9; smooth spins every wheel continuously. */
  variant?: OdometerVariant;
  /** Minimum number of wheels, padded with zeros. */
  digits?: number;
  /** Seconds to travel from the old value to the new one. */
  duration?: number;
  ease?: EaseInput;
  /** Show thin separators between wheels, like a real counter. */
  framed?: boolean;
  locale?: string;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

/** Position of wheel `place` (0 is ones) for a continuous value. */
function wheel(v: number, place: number, variant: OdometerVariant) {
  const unit = 10 ** place;
  if (variant === "smooth" || place === 0) return (((v / unit) % 10) + 10) % 10;
  const whole = Math.floor(v / unit) % 10;
  // The wheel only moves during the last unit before its neighbour rolls over, like gears.
  const carry = Math.min(1, Math.max(0, (v % unit) - (unit - 1)));
  return whole + carry;
}

function Wheel({ value, place, variant, framed }: { value: MotionValue<number>; place: number; variant: OdometerVariant; framed: boolean }) {
  const y = useTransform(value, (v) => `${(-wheel(v, place, variant) * 100) / CELLS.length}%`);
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        height: "1.2em",
        overflow: "hidden",
        verticalAlign: "bottom",
        padding: framed ? "0 0.08em" : undefined,
        borderLeft: framed ? "1px solid color-mix(in oklab, currentColor 14%, transparent)" : undefined,
        // Wheels curve away at the top and bottom edges.
        WebkitMaskImage: "linear-gradient(transparent, #000 22%, #000 78%, transparent)",
        maskImage: "linear-gradient(transparent, #000 22%, #000 78%, transparent)",
      }}
    >
      <span style={{ visibility: "hidden" }}>0</span>
      <motion.span style={{ position: "absolute", top: 0, left: framed ? "0.08em" : 0, right: framed ? "0.08em" : 0, display: "flex", flexDirection: "column", y }}>
        {CELLS.map((n, i) => (
          <span key={i} style={{ height: "1.2em", lineHeight: "1.2em", textAlign: "center" }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * A mechanical counter. The value travels through every number in between, so low wheels spin
 * fast while high wheels click over only when they must.
 */
export function Odometer({
  value,
  variant = "mechanical",
  digits = 1,
  duration = 1.6,
  ease = "standard",
  framed = false,
  locale,
  as: Tag = "span",
  reducedMotion = "user",
  className,
  style,
}: OdometerProps) {
  const reduced = useReduced(reducedMotion);
  const target = Math.max(0, Math.round(value));
  const mv = useMotionValue(target);

  useEffect(() => {
    if (reduced) {
      mv.set(target);
      return;
    }
    const controls = animate(mv, target, { duration, ease: resolveEase(ease) });
    return () => controls.stop();
  }, [target, duration, ease, reduced, mv]);

  const count = Math.max(digits, String(target).length);
  const label = formatNumber(target, locale);

  if (reduced) {
    return (
      <Tag className={className} style={{ fontVariantNumeric: "tabular-nums", ...style }}>
        {String(target).padStart(count, "0")}
      </Tag>
    );
  }

  return (
    <Tag className={className} style={{ fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", ...style }}>
      <SrText>{label}</SrText>
      <span aria-hidden="true" style={{ display: "inline-flex", lineHeight: "1.2em" }}>
        {Array.from({ length: count }, (_, i) => (
          <Wheel key={count - i} value={mv} place={count - 1 - i} variant={variant} framed={framed && i > 0} />
        ))}
      </span>
    </Tag>
  );
}

export default Odometer;
