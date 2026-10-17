"use client";

import { useState, type CSSProperties, type ElementType } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RollingNumber } from "../rolling-number/rolling-number";
import { formatNumber } from "../lib/format";
import { ease } from "../lib/motion-tokens";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type PriceTickerVariant = "currency" | "percent" | "compact";

export interface PriceTickerProps {
  value: number;
  /** currency formats as money, percent as a percentage of 1, compact as 1.2K style. */
  variant?: PriceTickerVariant;
  currency?: string;
  locale?: string;
  /** Show the change since the last value next to the price. */
  showDelta?: boolean;
  /** Color for rises and falls. Defaults to green and red tuned for both themes. */
  upColor?: string;
  downColor?: string;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const FORMATS: Record<PriceTickerVariant, (currency: string) => Intl.NumberFormatOptions> = {
  currency: (currency) => ({ style: "currency", currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  percent: () => ({ style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  compact: (currency) => ({ style: "currency", currency, notation: "compact", maximumFractionDigits: 1 }),
};

/**
 * A price that ticks to its new value with a brief flash of up or down. The flash fades on its own
 * and the arrow turns to point the way the price moved.
 */
export function PriceTicker({
  value,
  variant = "currency",
  currency = "USD",
  locale,
  showDelta = true,
  upColor = "oklch(0.62 0.16 150)",
  downColor = "oklch(0.6 0.2 25)",
  as: Tag = "span",
  reducedMotion = "user",
  className,
  style,
}: PriceTickerProps) {
  const reduced = useReduced(reducedMotion);
  const [previous, setPrevious] = useState(value);
  const [change, setChange] = useState<{ delta: number; id: number } | null>(null);

  // Derive the change while rendering, the way React recommends for state that follows a prop.
  if (value !== previous) {
    setPrevious(value);
    setChange((c) => ({ delta: value - previous, id: (c?.id ?? 0) + 1 }));
  }

  const format = FORMATS[variant](currency);
  const up = (change?.delta ?? 0) >= 0;
  const tint = change ? (up ? upColor : downColor) : undefined;
  const deltaText = change
    ? `${up ? "+" : "−"}${formatNumber(Math.abs(change.delta), locale, variant === "percent" ? { style: "percent", maximumFractionDigits: 2 } : { ...format, notation: "standard" })}`
    : "";

  return (
    <Tag className={className} style={{ display: "inline-flex", alignItems: "baseline", gap: "0.35em", whiteSpace: "nowrap", ...style }}>
      <motion.span
        key={change?.id ?? 0}
        initial={reduced || !change ? false : { color: tint }}
        animate={{ color: "currentColor" }}
        transition={{ duration: 1.2, ease: [...ease.standard], delay: 0.25 }}
        style={{ display: "inline-block" }}
      >
        <RollingNumber value={value} format={format} locale={locale} reducedMotion={reducedMotion} variant={up ? "up" : "down"} />
      </motion.span>
      {showDelta && (
        <span style={{ fontSize: "0.42em", fontVariantNumeric: "tabular-nums", minWidth: "4em" }} aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {change && (
              <motion.span
                key={change.id}
                initial={reduced ? false : { opacity: 0, y: up ? "0.6em" : "-0.6em" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ type: "spring", visualDuration: 0.3, bounce: 0.2 }}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.25em", color: up ? upColor : downColor }}
              >
                <motion.svg
                  aria-hidden="true"
                  viewBox="0 0 10 10"
                  width="0.8em"
                  height="0.8em"
                  initial={false}
                  animate={{ rotate: up ? 0 : 180 }}
                  transition={{ type: "spring", visualDuration: 0.3, bounce: 0 }}
                >
                  <path d="M5 1.5 L9 7.5 H1 Z" fill="currentColor" />
                </motion.svg>
                <span>{deltaText}</span>
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      )}
    </Tag>
  );
}

export default PriceTicker;
