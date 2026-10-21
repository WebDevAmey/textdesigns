"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { damp, hashString, seeded } from "../lib/math";
import { graphemes } from "../lib/split";
import { useFrame } from "../lib/use-frame";
import { usePointer } from "../lib/use-pointer";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type CursorTrailVariant = "chain" | "scatter";

export interface CursorTrailProps {
  /** The word that follows the cursor. */
  text: string;
  /** chain strings the letters along your path; scatter lets each letter chase the cursor on its own. */
  variant?: CursorTrailVariant;
  /** The area that the trail lives in. */
  children?: ReactNode;
  /** Letter spacing along the chain, in em. */
  spacing?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
  /** Class for the trailing letters, for example a font or color. */
  trailClassName?: string;
}

/**
 * A word trails behind the cursor letter by letter. In chain mode each letter follows the one in
 * front of it, so the word bends along the path you draw.
 */
export function CursorTrail({ text, variant = "chain", children, spacing = 0.62, as: Tag = "div", reducedMotion = "user", className, style, trailClassName }: CursorTrailProps) {
  const root = useRef<HTMLElement | null>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useReduced(reducedMotion);
  const pointer = usePointer(root, { enabled: !reduced });
  const chars = graphemes(text);
  const state = useRef(chars.map(() => ({ x: 0, y: 0, a: 0, o: 0 })));
  const rand = seeded(hashString(text));
  const emRef = useRef(0);
  const jitter = useRef(chars.map(() => ({ x: (rand() - 0.5) * 2, y: (rand() - 0.5) * 2, r: (rand() - 0.5) * 50, rate: 5 + rand() * 7 })));
  // Smoothed pointer velocity in px/s: scatter flings the letters apart in proportion to it.
  const motionState = useRef({ x: 0, y: 0, vx: 0, vy: 0, seen: false });

  useFrame(
    (_, dt) => {
      const p = pointer.current;
      const node = root.current;
      if (!node) return;
      // Measure the letter height once; reading layout every frame would force style recalcs.
      if (!emRef.current) emRef.current = letters.current[0]?.offsetHeight || 16;
      const em = emRef.current;
      const show = p.active && p.inside ? 1 : 0;
      const m = motionState.current;
      if (!show) {
        m.seen = false;
        m.vx = m.vy = 0;
      } else if (dt > 0 && m.seen) {
        m.vx = damp(m.vx, (p.x - m.x) / dt, 10, dt);
        m.vy = damp(m.vy, (p.y - m.y) / dt, 10, dt);
      }
      m.x = p.x;
      m.y = p.y;
      if (show) m.seen = true;
      // 0 when the cursor rests, 1 when it moves fast.
      const fling = Math.min(Math.hypot(m.vx, m.vy) / 1200, 1);
      state.current.forEach((s, i) => {
        const el = letters.current[i];
        if (!el) return;
        // A hidden letter jumps to the pointer, so the trail never flies in from a corner.
        if (s.o < 0.02 && show) {
          s.x = p.x;
          s.y = p.y;
        }
        let tx = p.x;
        let ty = p.y;
        let ta = 0;
        if (variant === "chain") {
          if (i > 0) {
            const prev = state.current[i - 1];
            const dx = s.x - prev.x;
            const dy = s.y - prev.y;
            const d = Math.hypot(dx, dy) || 1;
            // Hold a fixed distance behind the letter in front, pointing along the path.
            tx = prev.x + (dx / d) * spacing * em * 0.9;
            ty = prev.y + (dy / d) * spacing * em * 0.9;
            ta = (Math.atan2(-dy, -dx) * 180) / Math.PI;
          } else {
            tx = p.x + spacing * em * 0.6;
          }
          s.x = i === 0 ? damp(s.x, tx, 18, dt) : damp(s.x, tx, 30, dt);
          s.y = i === 0 ? damp(s.y, ty, 18, dt) : damp(s.y, ty, 30, dt);
          s.a = damp(s.a, Math.abs(ta) > 90 ? ta - 180 * Math.sign(ta) : ta, 10, dt);
        } else {
          const j = jitter.current[i];
          // At rest the letters settle into the word beside the cursor; moving scatters them, each
          // drifting by its own amount and catching up at its own pace, then they regroup.
          tx = p.x + (i + 0.9) * spacing * em + j.x * em * 1.6 * fling;
          ty = p.y + j.y * em * 1.6 * fling;
          s.x = damp(s.x, tx, j.rate, dt);
          s.y = damp(s.y, ty, j.rate, dt);
          s.a = damp(s.a, j.r * fling, 6, dt);
        }
        s.o = damp(s.o, show, 8, dt);
        el.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px) translate(-50%, -50%) rotate(${s.a.toFixed(1)}deg)`;
        el.style.opacity = s.o.toFixed(3);
      });
    },
    { ref: root, enabled: !reduced },
  );

  return (
    <Tag ref={root} className={className} style={{ position: "relative", overflow: "hidden", cursor: reduced ? undefined : "crosshair", ...style }}>
      {children}
      {!reduced && (
        <span aria-hidden="true" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          {chars.map((char, i) => (
            <span
              key={i}
              ref={(el) => {
                letters.current[i] = el;
              }}
              className={trailClassName}
              style={{ position: "absolute", left: 0, top: 0, opacity: 0, whiteSpace: "pre", willChange: "transform" }}
            >
              {char}
            </span>
          ))}
        </span>
      )}
    </Tag>
  );
}

export default CursorTrail;
