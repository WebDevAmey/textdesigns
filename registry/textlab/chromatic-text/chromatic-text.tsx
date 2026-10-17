"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type PointerEvent as ReactPointerEvent } from "react";
import { srOnly } from "../lib/a11y";
import { damp } from "../lib/math";
import { useFrame } from "../lib/use-frame";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type ChromaticTextVariant = "hover" | "velocity" | "pulse";

export interface ChromaticTextProps {
  text: string;
  /** hover splits while pointed at, velocity splits with pointer speed, pulse splits briefly every few seconds. */
  variant?: ChromaticTextVariant;
  /** Largest channel offset, in em. */
  amount?: number;
  /** Fringe colors, warm then cool. */
  colors?: [string, string];
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * The color channels split and rejoin, like a lens at its limit. Two tinted copies slide apart
 * behind the real text, so the letters themselves never lose their shape.
 */
export function ChromaticText({ text, variant = "hover", amount = 0.06, colors = ["oklch(0.65 0.25 25)", "oklch(0.75 0.15 210)"], as: Tag = "span", reducedMotion = "user", className, style }: ChromaticTextProps) {
  const root = useRef<HTMLElement | null>(null);
  const warm = useRef<HTMLSpanElement | null>(null);
  const cool = useRef<HTMLSpanElement | null>(null);
  const reduced = useReduced(reducedMotion);
  const [hover, setHover] = useState(false);
  const target = useRef(0);
  const current = useRef(0);
  const angle = useRef(0);
  const last = useRef<{ x: number; y: number; t: number } | null>(null);
  const resting = useRef(true);

  useEffect(() => {
    if (reduced || variant !== "velocity") return;
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const now = performance.now();
      const prev = last.current;
      last.current = { x: event.clientX, y: event.clientY, t: now };
      if (!prev) return;
      const dx = event.clientX - prev.x;
      const dy = event.clientY - prev.y;
      const speed = Math.hypot(dx, dy) / Math.max(8, now - prev.t);
      target.current = Math.min(1, speed / 2.5);
      angle.current = Math.atan2(dy, dx);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [reduced, variant]);

  useFrame(
    (time, dt) => {
      const node = root.current;
      if (!node) return;
      if (variant === "hover") target.current = hover ? 1 : 0;
      if (variant === "pulse") {
        const phase = time % 3.2;
        target.current = phase < 0.18 ? 1 : 0;
        angle.current = Math.sin(time * 1.7);
      }
      if (variant === "velocity") target.current = damp(target.current, 0, 3, dt);
      current.current = damp(current.current, target.current, variant === "pulse" ? 30 : 12, dt);
      // Nothing to write once the channels are back together; idle text costs nothing.
      const still = current.current < 0.0005 && target.current === 0;
      if (still && resting.current) return;
      resting.current = still;
      const a = angle.current;
      const r = current.current * amount;
      const x = (Math.cos(a) * r).toFixed(4);
      const y = (Math.sin(a) * r * 0.5).toFixed(4);
      // Transforms go straight onto each fringe; a variable on the parent would restyle every child.
      if (warm.current) warm.current.style.transform = `translate(${x}em, ${y}em)`;
      if (cool.current) cool.current.style.transform = `translate(${-x}em, ${-y}em)`;
    },
    { ref: root, enabled: !reduced },
  );

  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  const fringe = (color: string): CSSProperties => ({
    position: "absolute",
    inset: 0,
    color,
    opacity: 0.85,
    pointerEvents: "none",
  });

  return (
    <Tag
      ref={root}
      className={className}
      style={{ position: "relative", display: "inline-block", isolation: "isolate", ...style }}
      onPointerEnter={(event: ReactPointerEvent) => event.pointerType !== "touch" && setHover(true)}
      onPointerLeave={(event: ReactPointerEvent) => event.pointerType !== "touch" && setHover(false)}
    >
      <span style={srOnly}>{text}</span>
      <span ref={warm} aria-hidden="true" style={fringe(colors[0])}>
        {text}
      </span>
      <span ref={cool} aria-hidden="true" style={fringe(colors[1])}>
        {text}
      </span>
      <span aria-hidden="true" style={{ position: "relative" }}>
        {text}
      </span>
    </Tag>
  );
}

export default ChromaticText;
