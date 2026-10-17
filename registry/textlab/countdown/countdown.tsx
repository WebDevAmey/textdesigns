"use client";

import { useEffect, useEffectEvent, useState, type CSSProperties, type ElementType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RollingNumber } from "../rolling-number/rolling-number";
import { SplitFlap } from "../split-flap/split-flap";
import { srOnly } from "../lib/a11y";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type CountdownVariant = "flip" | "roll" | "plain";
export type CountdownUnit = "days" | "hours" | "minutes" | "seconds";

export interface CountdownProps {
  /** The moment to count down to. */
  to: Date | string | number;
  /** flip uses split-flap tiles, roll uses rolling digits, plain crossfades. */
  variant?: CountdownVariant;
  /** Units to show, largest first. */
  units?: CountdownUnit[];
  /** Labels under each unit. Pass null to hide them. */
  labels?: Partial<Record<CountdownUnit, string>> | null;
  onComplete?: () => void;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const SIZE: Record<CountdownUnit, number> = { days: 86400, hours: 3600, minutes: 60, seconds: 1 };
const DEFAULT_LABELS: Record<CountdownUnit, string> = { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" };

function split(ms: number, units: CountdownUnit[]) {
  let rest = Math.max(0, Math.floor(ms / 1000));
  const out = {} as Record<CountdownUnit, number>;
  for (const unit of units) {
    out[unit] = Math.floor(rest / SIZE[unit]);
    rest -= out[unit] * SIZE[unit];
  }
  return out;
}

function PlainDigits({ value }: { value: string }) {
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ visibility: "hidden" }}>{value.replace(/\d/g, "0")}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          style={{ position: "absolute", inset: 0 }}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * Count down to a moment, second by second. The time is read only in the browser, so the server
 * renders placeholders and the first client render matches it exactly.
 */
export function Countdown({
  to,
  variant = "flip",
  units = ["days", "hours", "minutes", "seconds"],
  labels = DEFAULT_LABELS,
  onComplete,
  as: Tag = "div",
  reducedMotion = "user",
  className,
  style,
}: CountdownProps) {
  const reduced = useReduced(reducedMotion);
  const target = new Date(to).getTime();
  const [now, setNow] = useState<number | null>(null);
  const finish = useEffectEvent(() => onComplete?.());

  useEffect(() => {
    let id = 0;
    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t >= target) {
        finish();
        return;
      }
      // Align ticks to the wall clock so seconds change together everywhere on the page.
      id = window.setTimeout(tick, 1000 - (t % 1000) + 5);
    };
    tick();
    return () => clearTimeout(id);
  }, [target]);

  const parts = now === null ? null : split(target - now, units);
  const pad = (unit: CountdownUnit, n: number) => String(n).padStart(unit === "days" ? 1 : 2, "0");
  const spoken = parts ? units.map((u) => `${parts[u]} ${(labels?.[u] ?? DEFAULT_LABELS[u]).toLowerCase()}`).join(", ") : "";

  return (
    <Tag className={className} style={{ display: "inline-flex", gap: "0.5em", alignItems: "flex-start", fontVariantNumeric: "tabular-nums", ...style }}>
      <span style={srOnly}>{spoken}</span>
      {units.map((unit, i) => {
        const value = parts ? pad(unit, parts[unit]) : unit === "days" ? "–" : "––";
        return (
          <span key={unit} aria-hidden="true" style={{ display: "inline-flex", alignItems: "flex-start", gap: "0.5em" }}>
            {i > 0 && <span style={{ opacity: 0.35 }}>:</span>}
            <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
              {!parts || reduced ? (
                <span>{value}</span>
              ) : variant === "flip" ? (
                <SplitFlap text={value} variant="mini" charset="0123456789" speed={45} stagger={0} reducedMotion={reducedMotion} />
              ) : variant === "roll" ? (
                <RollingNumber value={parts[unit]} format={{ minimumIntegerDigits: unit === "days" ? 1 : 2, useGrouping: false }} variant="down" reducedMotion={reducedMotion} />
              ) : (
                <PlainDigits value={value} />
              )}
              {labels && <span style={{ fontSize: "0.22em", letterSpacing: "0.06em", opacity: 0.55, marginTop: "0.6em", fontFamily: "var(--tl-font-sans)" }}>{labels[unit] ?? DEFAULT_LABELS[unit]}</span>}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}

export default Countdown;
