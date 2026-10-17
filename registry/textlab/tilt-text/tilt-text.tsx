"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { srOnly } from "../lib/a11y";
import { usePointerVars } from "../lib/use-pointer-vars";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type TiltTextVariant = "extrude" | "float" | "shadow";

export interface TiltTextProps {
  text: string;
  /** extrude gives the letters solid depth, float lifts them off a soft ground shadow, shadow casts a long light-driven shadow. */
  variant?: TiltTextVariant;
  /** Largest tilt in degrees. */
  tilt?: number;
  /** Extrusion layers for the extrude variant. */
  depth?: number;
  /** Side color of the extrusion. */
  sideColor?: string;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * Extruded type tilts toward the pointer. The extrusion is built from stacked copies pushed back in
 * real 3D space, so the sides turn with the face like a solid object.
 */
export function TiltText({ text, variant = "extrude", tilt = 18, depth = 12, sideColor = "color-mix(in oklab, currentColor 45%, var(--tl-background, #000))", as: Tag = "span", reducedMotion = "user", className, style }: TiltTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reduced = useReduced(reducedMotion);
  // Rest slightly turned, so the depth reads even before anyone points at it.
  usePointerVars(ref, { enabled: !reduced, rate: 7, rest: [0.7, 0.3] });

  const rotate = reduced ? "none" : `rotateX(calc((var(--tl-py, 0.3) - 0.5) * ${-tilt}deg)) rotateY(calc((var(--tl-px, 0.7) - 0.5) * ${tilt * 1.4}deg))`;
  const face: CSSProperties = { position: "relative", display: "block", transform: "translateZ(0.5px)" };

  return (
    <Tag ref={ref} className={className} style={{ position: "relative", display: "inline-block", perspective: "8em", padding: "0.2em 0.3em", ...style }}>
      <span style={srOnly}>{text}</span>
      <span aria-hidden="true" style={{ position: "relative", display: "inline-block", transformStyle: "preserve-3d", transform: rotate, transition: "transform 80ms linear" }}>
        {variant === "extrude" &&
          Array.from({ length: depth }, (_, i) => (
            <span
              key={i}
              style={{ position: "absolute", inset: 0, color: sideColor, transform: `translateZ(${-(i + 1) * 0.022}em)`, filter: i === depth - 1 ? "drop-shadow(0 0.08em 0.06em oklch(0 0 0 / 0.35))" : undefined }}
            >
              {text}
            </span>
          ))}
        {variant === "float" && (
          <span style={{ position: "absolute", inset: 0, color: "oklch(0 0 0 / 0.4)", filter: "blur(0.08em)", transform: "translateZ(-0.6em) translateY(0.25em) scale(0.98)" }}>{text}</span>
        )}
        {variant === "shadow" && (
          <span
            style={{
              position: "absolute",
              inset: 0,
              color: "oklch(0 0 0 / 0.35)",
              filter: "blur(0.04em)",
              transform: `translate(calc((0.5 - var(--tl-px, 0.5)) * 0.4em), calc((0.5 - var(--tl-py, 0.5)) * 0.4em + 0.06em)) translateZ(-0.3em)`,
            }}
          >
            {text}
          </span>
        )}
        <span style={face}>{text}</span>
      </span>
    </Tag>
  );
}

export default TiltText;
