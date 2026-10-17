"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { srOnly } from "../lib/a11y";
import { damp } from "../lib/math";
import { useFrame } from "../lib/use-frame";
import { usePointer } from "../lib/use-pointer";
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

// Rest slightly turned, so the depth reads even before anyone points at it.
const REST = { x: 0.7, y: 0.3 };

/**
 * Extruded type tilts toward the pointer. The extrusion is built from stacked copies pushed back in
 * real 3D space, so the sides turn with the face like a solid object.
 */
export function TiltText({ text, variant = "extrude", tilt = 18, depth = 12, sideColor = "color-mix(in oklab, currentColor 45%, var(--tl-background, #000))", as: Tag = "span", reducedMotion = "user", className, style }: TiltTextProps) {
  const root = useRef<HTMLElement | null>(null);
  const group = useRef<HTMLSpanElement | null>(null);
  const shadow = useRef<HTMLSpanElement | null>(null);
  const reduced = useReduced(reducedMotion);
  const pointer = usePointer(root, { enabled: !reduced });
  const pos = useRef({ ...REST });

  const rotate = (x: number, y: number) => `rotateX(${((y - 0.5) * -tilt).toFixed(2)}deg) rotateY(${((x - 0.5) * tilt * 1.4).toFixed(2)}deg)`;

  useFrame(
    (_, dt) => {
      const p = pointer.current;
      const tx = p.active && p.inside ? p.nx : REST.x;
      const ty = p.active && p.inside ? p.ny : REST.y;
      const before = pos.current;
      if (Math.abs(before.x - tx) < 0.0005 && Math.abs(before.y - ty) < 0.0005) return;
      pos.current = { x: damp(before.x, tx, 7, dt), y: damp(before.y, ty, 7, dt) };
      // Transforms are written to the elements themselves, never through inherited variables.
      if (group.current) group.current.style.transform = rotate(pos.current.x, pos.current.y);
      if (shadow.current) shadow.current.style.transform = `translate(${((0.5 - pos.current.x) * 0.4).toFixed(3)}em, ${((0.5 - pos.current.y) * 0.4 + 0.06).toFixed(3)}em) translateZ(-0.3em)`;
    },
    { ref: root, enabled: !reduced },
  );

  return (
    <Tag ref={root} className={className} style={{ position: "relative", display: "inline-block", perspective: "8em", padding: "0.2em 0.3em", ...style }}>
      <span style={srOnly}>{text}</span>
      <span ref={group} aria-hidden="true" style={{ position: "relative", display: "inline-block", transformStyle: "preserve-3d", transform: reduced ? "none" : rotate(REST.x, REST.y) }}>
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
          <span ref={shadow} style={{ position: "absolute", inset: 0, color: "oklch(0 0 0 / 0.35)", filter: "blur(0.04em)", transform: "translate(-0.08em, -0.02em) translateZ(-0.3em)" }}>
            {text}
          </span>
        )}
        <span style={{ position: "relative", display: "block", transform: "translateZ(0.5px)" }}>{text}</span>
      </span>
    </Tag>
  );
}

export default TiltText;
