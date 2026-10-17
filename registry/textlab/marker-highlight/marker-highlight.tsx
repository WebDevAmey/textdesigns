"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { cssEase, type EaseInput } from "../lib/motion-tokens";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type MarkerHighlightVariant = "marker" | "underline" | "box";

export interface MarkerHighlightProps {
  children: ReactNode;
  /** marker is a full highlighter stroke, underline a thick low band, box a soft rounded block. */
  variant?: MarkerHighlightVariant;
  /** Highlight color. Defaults to the highlight token, which adapts to dark mode. */
  color?: string;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always">;
  active?: boolean;
  once?: boolean;
  delay?: number;
  duration?: number;
  ease?: EaseInput;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const BANDS: Record<MarkerHighlightVariant, { height: string; position: string; radius: string }> = {
  marker: { height: "78%", position: "0 70%", radius: "0.15em 0.35em 0.2em 0.3em" },
  underline: { height: "32%", position: "0 92%", radius: "0.1em" },
  box: { height: "100%", position: "0 50%", radius: "0.25em" },
};

/**
 * A highlighter swipes behind the words. Works across line breaks: every line fragment gets its
 * own stroke, because the background is cloned per line box. Renders a real <mark> by default.
 */
export function MarkerHighlight({
  children,
  variant = "marker",
  color = "var(--tl-fx-highlight, oklch(0.92 0.15 100 / 0.75))",
  as: Tag = "mark",
  trigger = "inView",
  active,
  once = true,
  delay = 0,
  duration = 0.7,
  ease = "standard",
  reducedMotion = "user",
  className,
  style,
}: MarkerHighlightProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const reduced = useReduced(reducedMotion);
  const band = BANDS[variant];
  const shown = on || reduced;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        color: "inherit",
        backgroundColor: "transparent",
        backgroundImage: `linear-gradient(${color}, ${color})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: band.position,
        backgroundSize: `${shown ? 100 : 0}% ${band.height}`,
        transition: reduced ? "none" : `background-size ${shown ? duration : 0.2}s ${cssEase(ease)} ${shown ? delay : 0}s`,
        borderRadius: band.radius,
        padding: "0 0.12em",
        margin: "0 -0.12em",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
        ...style,
      }}
      {...bind}
    >
      {children}
    </Tag>
  );
}

export default MarkerHighlight;
