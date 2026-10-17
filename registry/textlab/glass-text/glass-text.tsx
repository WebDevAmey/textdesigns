"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { srOnly } from "../lib/a11y";
import { usePointerVars } from "../lib/use-pointer-vars";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type GlassTextVariant = "frost" | "clear" | "tinted";

export interface GlassTextProps {
  text: string;
  /** frost is milky and soft, clear bends the backdrop strongly, tinted carries the accent color. */
  variant?: GlassTextVariant;
  /** The scene behind the glass: any CSS background image. The letters refract it. */
  backdrop?: string;
  /** Tint color for the tinted variant. */
  tint?: string;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_BACKDROP =
  "radial-gradient(circle at 20% 30%, oklch(0.75 0.17 30), transparent 45%), radial-gradient(circle at 80% 60%, oklch(0.7 0.15 250), transparent 50%), radial-gradient(circle at 50% 100%, oklch(0.8 0.15 150), transparent 55%), linear-gradient(135deg, oklch(0.3 0.05 280), oklch(0.2 0.04 230))";

/**
 * Glass letters over a scene. Each letter shows the scene behind it magnified and shifted, as thick
 * glass would, with a bright rim and a highlight that follows the pointer.
 */
export function GlassText({ text, variant = "clear", backdrop = DEFAULT_BACKDROP, tint = "var(--tl-accent, #e5643a)", as: Tag = "span", reducedMotion = "user", className, style }: GlassTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReduced(reducedMotion);
  usePointerVars(ref, { enabled: !reduced, rate: 9 });

  const shift = variant === "clear" ? 9 : 4;
  const refraction: CSSProperties = {
    backgroundImage:
      variant === "frost"
        ? `linear-gradient(oklch(1 0 0 / 0.42), oklch(1 0 0 / 0.42)), ${backdrop}`
        : variant === "tinted"
          ? `linear-gradient(color-mix(in oklab, ${tint} 38%, transparent), color-mix(in oklab, ${tint} 38%, transparent)), ${backdrop}`
          : backdrop,
    // The backdrop is scaled up and nudged against the pointer, which reads as light bending through the glass.
    backgroundSize: variant === "frost" ? "100% 100%, 108% 108%" : "100% 100%, 118% 118%",
    backgroundPosition: `0 0, calc(50% + (0.5 - var(--tl-px, 0.5)) * ${shift}%) calc(50% + (0.5 - var(--tl-py, 0.5)) * ${shift}%)`,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
  if (variant === "clear") {
    refraction.backgroundImage = `linear-gradient(transparent, transparent), ${backdrop}`;
  }

  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "inline-block", padding: "0.3em 0.45em", borderRadius: "0.3em", backgroundImage: backdrop, backgroundSize: "cover", ...style }}>
      <span style={srOnly}>{text}</span>
      <span aria-hidden="true" style={{ position: "relative", display: "inline-block" }}>
        {/* Soft shadow the glass casts on the scene. */}
        <span style={{ position: "absolute", inset: 0, color: "oklch(0 0 0 / 0.28)", filter: "blur(0.06em)", transform: "translateY(0.05em)" }}>{text}</span>
        <span style={{ position: "relative", ...refraction }}>{text}</span>
        {/* Rim light and a specular highlight that tracks the pointer. */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "0.012em oklch(1 0 0 / 0.65)",
            backgroundImage: `radial-gradient(circle at calc(var(--tl-px, 0.3) * 100%) calc(var(--tl-py, 0.2) * 100%), oklch(1 0 0 / 0.75), transparent 35%)`,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          {text}
        </span>
      </span>
    </Tag>
  );
}

export default GlassText;
