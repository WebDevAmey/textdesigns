"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { SrText } from "../lib/a11y";
import { damp } from "../lib/math";
import { splitWords } from "../lib/split";
import { useFrame } from "../lib/use-frame";
import { useLetterBoxes } from "../lib/use-letter-boxes";
import { usePointer } from "../lib/use-pointer";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type MagneticTextVariant = "attract" | "repel";

export interface MagneticTextProps {
  text: string;
  /** attract leans letters toward the cursor, repel pushes them away. */
  variant?: MagneticTextVariant;
  /** Reach of the field, in em. */
  radius?: number;
  /** Largest offset, in em. */
  strength?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * Letters lean toward the cursor and spring back when it leaves. The pull fades smoothly with
 * distance, so only the letters near the pointer move.
 */
export function MagneticText({ text, variant = "attract", radius = 2.5, strength = 0.28, as: Tag = "span", reducedMotion = "user", className, style }: MagneticTextProps) {
  const root = useRef<HTMLElement | null>(null);
  const reduced = useReduced(reducedMotion);
  const pointer = usePointer(root, { enabled: !reduced });
  const { boxes, em: emRef } = useLetterBoxes(root, [text]);
  const offsets = useRef<{ x: number; y: number }[]>([]);
  const words = splitWords(text);

  useFrame(
    (_, dt) => {
      const node = root.current;
      if (!node) return;
      const em = emRef.current;
      const reach = radius * em;
      const max = strength * em;
      const p = pointer.current;
      const sign = variant === "attract" ? 1 : -1;
      boxes.current.forEach((box, i) => {
        const o = (offsets.current[i] ??= { x: 0, y: 0 });
        let tx = 0;
        let ty = 0;
        if (p.active) {
          const dx = p.x - box.cx;
          const dy = p.y - box.cy;
          const dist = Math.hypot(dx, dy);
          if (dist < reach) {
            // Smoothstep falloff: full pull at the center, none at the edge of the field.
            const t = 1 - dist / reach;
            const pull = t * t * (3 - 2 * t) * max * sign;
            tx = (dx / (dist || 1)) * pull;
            ty = (dy / (dist || 1)) * pull;
          }
        }
        o.x = damp(o.x, tx, 14, dt);
        o.y = damp(o.y, ty, 14, dt);
        box.el.style.transform = `translate(${o.x.toFixed(2)}px, ${o.y.toFixed(2)}px)`;
      });
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
    <Tag ref={root} className={className} style={{ position: "relative", display: "inline-block", ...style }}>
      <SrText>{text}</SrText>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
              {word.chars.map((char, c) => (
                <span key={c} data-tl-char="" style={{ display: "inline-block" }}>
                  {char}
                </span>
              ))}
            </span>
            {w < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}

export default MagneticText;
