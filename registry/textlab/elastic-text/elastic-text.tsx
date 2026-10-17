"use client";

import { useRef, type CSSProperties, type ElementType, type PointerEvent } from "react";
import { SrText } from "../lib/a11y";
import { Letters } from "../lib/letters";
import { atRest, stepSpring, type Spring1D } from "../lib/physics";
import { useFrame } from "../lib/use-frame";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type ElasticTextVariant = "band" | "sling";

export interface ElasticTextProps {
  text: string;
  /** band stretches and eases back; sling snaps back hard and overshoots like a released slingshot. */
  variant?: ElasticTextVariant;
  /** How many neighbours come along when you pull a letter. */
  reach?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * Drag a letter and the word stretches like rubber. Neighbours follow with falloff, and letting go
 * springs everything home. Works with mouse, pen and touch.
 */
export function ElasticText({ text, variant = "band", reach = 3, as: Tag = "span", reducedMotion = "user", className, style }: ElasticTextProps) {
  const root = useRef<HTMLElement | null>(null);
  const reduced = useReduced(reducedMotion);
  const springs = useRef<{ x: Spring1D; y: Spring1D }[]>([]);
  const drag = useRef<{ index: number; startX: number; startY: number; dx: number; dy: number } | null>(null);
  const live = useRef(false);

  const elements = () => Array.from(root.current?.querySelectorAll<HTMLElement>("[data-tl-char]") ?? []);

  const onDown = (event: PointerEvent, index: number) => {
    if (reduced) return;
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    const count = elements().length;
    for (let i = 0; i < count; i++) springs.current[i] ??= { x: { x: 0, v: 0 }, y: { x: 0, v: 0 } };
    drag.current = { index, startX: event.clientX, startY: event.clientY, dx: 0, dy: 0 };
    live.current = true;
  };
  const onMove = (event: PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    // Resistance grows with distance, like rubber that gets harder to pull.
    const rawX = event.clientX - d.startX;
    const rawY = event.clientY - d.startY;
    const dist = Math.hypot(rawX, rawY) || 1;
    const eased = 140 * Math.tanh(dist / 140);
    d.dx = (rawX / dist) * eased;
    d.dy = (rawY / dist) * eased;
  };
  const onUp = () => {
    const d = drag.current;
    if (!d) return;
    if (variant === "sling") {
      springs.current.forEach((s) => {
        s.x.v += -s.x.x * 6;
        s.y.v += -s.y.x * 6;
      });
    }
    drag.current = null;
  };

  useFrame(
    (_, dt) => {
      if (!live.current) return;
      const els = elements();
      const d = drag.current;
      let moving = !!d;
      springs.current.forEach((s, i) => {
        if (!s) return;
        const fall = d ? Math.exp(-Math.abs(i - d.index) / Math.max(0.5, reach / 2)) : 0;
        const tx = d ? d.dx * fall : 0;
        const ty = d ? d.dy * fall : 0;
        const stiffness = d ? 900 : variant === "sling" ? 520 : 300;
        const damping = d ? 60 : variant === "sling" ? 9 : 16;
        stepSpring(s.x, tx, stiffness, damping, dt);
        stepSpring(s.y, ty, stiffness, damping, dt);
        if (!atRest(s.x, tx, 0.05) || !atRest(s.y, ty, 0.05)) moving = true;
        const el = els[i];
        if (!el) return;
        // Letters stretch along the pull, which sells the rubber.
        const len = Math.hypot(s.x.x, s.y.x);
        const angle = Math.atan2(s.y.x, s.x.x);
        const stretch = 1 + Math.min(len / 220, 0.45);
        el.style.transform = `translate(${s.x.x.toFixed(2)}px, ${s.y.x.toFixed(2)}px) rotate(${angle}rad) scaleX(${stretch.toFixed(3)}) rotate(${-angle}rad)`;
      });
      live.current = moving;
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

  return (
    <Tag ref={root} className={className} style={{ display: "inline-block", touchAction: "none", userSelect: "none", ...style }}>
      <SrText>{text}</SrText>
      <span aria-hidden="true">
        <Letters
          text={text}
          charStyle={{ cursor: "grab", willChange: "transform" }}
          render={(char, i) => (
            <span style={{ display: "inline-block" }} onPointerDown={(e) => onDown(e, i)} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
              {char}
            </span>
          )}
        />
      </span>
    </Tag>
  );
}

export default ElasticText;
