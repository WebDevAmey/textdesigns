"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { srOnly } from "../lib/a11y";
import { useFrame } from "../lib/use-frame";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useSvgId } from "../lib/use-svg-id";

export type PathTextVariant = "wave" | "circle" | "spiral";

export interface PathTextProps {
  text: string;
  /** wave flows along a sine, circle turns as a badge, spiral winds the words inward. */
  variant?: PathTextVariant;
  /** Speed in path units per second. Negative reverses. */
  speed?: number;
  /** Mark between repeats. */
  separator?: string;
  /** Font size inside the SVG, in path units. */
  fontSize?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const PATHS: Record<PathTextVariant, { d: string; viewBox: string }> = {
  wave: { d: "M -1000 100 C -875 20, -625 20, -500 100 S -125 180, 0 100 S 375 20, 500 100 S 875 180, 1000 100 S 1375 20, 1500 100 S 1875 180, 2000 100", viewBox: "0 0 1000 200" },
  circle: { d: "M 200 200 m -150 0 a 150 150 0 1 1 300 0 a 150 150 0 1 1 -300 0", viewBox: "0 0 400 400" },
  spiral: {
    d: (() => {
      const pts: string[] = [];
      for (let i = 0; i <= 720; i += 6) {
        const t = (i * Math.PI) / 180;
        const r = 190 - i * 0.22;
        pts.push(`${(200 + Math.cos(t) * r).toFixed(1)} ${(200 + Math.sin(t) * r).toFixed(1)}`);
      }
      return `M ${pts.join(" L ")}`;
    })(),
    viewBox: "0 0 400 400",
  },
};

/**
 * Text travels along a wave, a circle or a spiral. The words loop seamlessly: the repeat length is
 * measured from the real glyphs, so the seam never jumps.
 */
export function PathText({ text, variant = "wave", speed = 60, separator = "·", fontSize, as: Tag = "div", reducedMotion = "user", className, style }: PathTextProps) {
  const id = useSvgId("tl-path");
  const root = useRef<HTMLElement | null>(null);
  const textPath = useRef<SVGTextPathElement | null>(null);
  const unit = useRef<SVGTextElement | null>(null);
  const offset = useRef(0);
  const reduced = useReduced(reducedMotion);
  const { d, viewBox } = PATHS[variant];
  const size = fontSize ?? (variant === "wave" ? 44 : variant === "circle" ? 30 : 22);
  const chunk = `${text} ${separator} `;
  const repeats = variant === "circle" ? Math.max(1, Math.round(942 / (chunk.length * size * 0.55))) : 14;

  useFrame(
    (_, dt) => {
      const tp = textPath.current;
      const one = unit.current?.getComputedTextLength() ?? 0;
      if (!tp || !one || variant === "circle") return;
      // Wrap by exactly one repeat; the repeats are identical, so the jump is invisible.
      offset.current = (offset.current - speed * dt) % one;
      tp.setAttribute("startOffset", String(offset.current));
    },
    { ref: root, enabled: !reduced && variant !== "circle" },
  );

  return (
    <Tag ref={root} className={className} style={{ display: "block", ...style }}>
      <style href="tl-path-text" precedence="default">{"@keyframes tl-path-spin { to { transform: rotate(360deg); } }"}</style>
      <span style={srOnly}>{text}</span>
      <svg
        aria-hidden="true"
        viewBox={viewBox}
        style={{
          width: "100%",
          height: "auto",
          overflow: variant === "wave" ? "hidden" : "visible",
          transformOrigin: "50% 50%",
          animation: variant === "circle" && !reduced ? `tl-path-spin ${Math.abs(942 / speed)}s linear infinite ${speed < 0 ? "reverse" : "normal"}` : undefined,
        }}
      >
        <defs>
          <path id={id} d={d} />
        </defs>
        {/* Measures one repeat so the loop wraps exactly at a seam. */}
        <text ref={unit} style={{ fontSize: size, visibility: "hidden" }} x="-9999">
          {chunk}
        </text>
        <text fill="currentColor" style={{ fontSize: size, letterSpacing: variant === "circle" ? "0.08em" : undefined }}>
          <textPath ref={textPath} href={`#${id}`} startOffset="0" {...(variant === "circle" ? { textLength: 942, lengthAdjust: "spacing" } : null)}>
            {chunk.repeat(repeats)}
          </textPath>
        </text>
      </svg>
    </Tag>
  );
}

export default PathText;
