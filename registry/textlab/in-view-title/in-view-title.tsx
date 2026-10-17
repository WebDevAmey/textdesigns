"use client";

import type { CSSProperties } from "react";
import { BlurReveal } from "../blur-reveal/blur-reveal";
import { LineReveal } from "../line-reveal/line-reveal";
import { WipeReveal } from "../wipe-reveal/wipe-reveal";
import { WordReveal } from "../word-reveal/word-reveal";
import type { ReducedMotion } from "../lib/use-reduced";

export type InViewTitleVariant = "blur" | "words" | "lines" | "wipe";

export interface InViewTitleProps {
  text: string;
  /** blur suits most headings; words and lines rise from a clip; wipe uncovers left to right. */
  variant?: InViewTitleVariant;
  as?: "h1" | "h2" | "h3" | "h4";
  /** Set false to replay on every entry. */
  once?: boolean;
  /** Share of the title that must be visible before it starts, 0 to 1. */
  amount?: number;
  delay?: number;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
  id?: string;
}

/**
 * A section title that reveals itself as it scrolls into view, in four styles that share timing.
 * Titles already above the viewport show at once, and server-rendered titles appear on their own if
 * scripts are slow.
 */
export function InViewTitle({ text, variant = "blur", as = "h2", once = true, amount = 0.45, delay = 0, reducedMotion, className, style, id }: InViewTitleProps) {
  const shared = { text, as, once, amount, delay, reducedMotion, className, style, id, trigger: "inView" as const };
  if (variant === "words") return <WordReveal {...shared} />;
  if (variant === "lines") return <LineReveal {...shared} />;
  if (variant === "wipe") return <WipeReveal {...shared} />;
  return <BlurReveal {...shared} />;
}

export default InViewTitle;
