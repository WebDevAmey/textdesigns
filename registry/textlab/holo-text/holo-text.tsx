"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { usePointerVars } from "../lib/use-pointer-vars";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type HoloTextVariant = "foil" | "holo" | "chrome";

export interface HoloTextProps {
  text: string;
  /** foil is warm iridescent leaf, holo is a full rainbow hologram, chrome is a cool metallic sweep. */
  variant?: HoloTextVariant;
  /** How strongly the colors travel with the pointer, 0 to 1. */
  intensity?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const LAYERS: Record<HoloTextVariant, string> = {
  foil: "repeating-linear-gradient(115deg, oklch(0.86 0.1 80) 0%, oklch(0.8 0.13 30) 8%, oklch(0.84 0.1 330) 16%, oklch(0.88 0.09 200) 24%, oklch(0.86 0.1 80) 32%)",
  holo: "repeating-linear-gradient(110deg, oklch(0.8 0.18 20) 0%, oklch(0.88 0.16 90) 7%, oklch(0.84 0.17 150) 14%, oklch(0.78 0.15 230) 21%, oklch(0.74 0.2 300) 28%, oklch(0.8 0.18 20) 35%)",
  chrome: "linear-gradient(180deg, oklch(0.98 0 0) 0%, oklch(0.72 0.01 250) 38%, oklch(0.32 0.02 250) 50%, oklch(0.8 0.01 250) 62%, oklch(0.96 0 0) 100%)",
};

/**
 * Foil that shifts color as you move across it. The pattern slides with the pointer and a soft
 * sheen follows it, the way light catches a holographic card.
 */
export function HoloText({ text, variant = "holo", intensity = 0.7, as: Tag = "span", reducedMotion = "user", className, style }: HoloTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReduced(reducedMotion);
  usePointerVars(ref, { enabled: !reduced, rate: 8 });
  const travel = `${intensity * 120}%`;
  const sheen = `radial-gradient(circle at calc(var(--tl-px, 0.5) * 100%) calc(var(--tl-py, 0.5) * 100%), oklch(1 0 0 / calc(0.15 + var(--tl-in, 0) * 0.55)), transparent 45%)`;

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        backgroundImage: `${sheen}, ${LAYERS[variant]}`,
        backgroundSize: variant === "chrome" ? "100% 100%, 100% 160%" : "100% 100%, 300% 300%",
        backgroundPosition:
          variant === "chrome"
            ? `0 0, 0 calc(var(--tl-py, 0.5) * ${travel})`
            : `0 0, calc(var(--tl-px, 0.5) * ${travel}) calc(var(--tl-py, 0.5) * ${travel})`,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        filter: "drop-shadow(0 0.02em 0 color-mix(in oklab, currentColor 25%, transparent))",
        ...style,
      }}
    >
      {text}
    </Tag>
  );
}

export default HoloText;
