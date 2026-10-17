"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { SrText } from "../lib/a11y";
import { damp } from "../lib/math";
import { splitWords } from "../lib/split";
import { useFrame } from "../lib/use-frame";
import { useLetterBoxes } from "../lib/use-letter-boxes";
import { usePointer } from "../lib/use-pointer";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type VariableProximityVariant = "weight" | "width" | "slant";

export interface VariableProximityProps {
  text: string;
  /** Which axis swells near the cursor. */
  variant?: VariableProximityVariant;
  /** Axis value far from the cursor and right under it. */
  from?: number;
  to?: number;
  /** Reach in em. */
  radius?: number;
  /** Variable font family. Needs the axis you animate. Defaults to the --tl-font-flex token. */
  font?: string;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const AXIS: Record<VariableProximityVariant, { tag: string; from: number; to: number }> = {
  weight: { tag: "wght", from: 300, to: 900 },
  width: { tag: "wdth", from: 75, to: 151 },
  slant: { tag: "slnt", from: 0, to: -10 },
};

/**
 * Weight, width or slant swell as the cursor comes near. Each letter reads its own distance, so a
 * bulge of heavier type follows the pointer across the word.
 */
export function VariableProximity({ text, variant = "weight", from, to, radius = 3, font = "var(--tl-font-flex)", as: Tag = "span", reducedMotion = "user", className, style }: VariableProximityProps) {
  const root = useRef<HTMLElement | null>(null);
  const reduced = useReduced(reducedMotion);
  const pointer = usePointer(root, { enabled: !reduced });
  const { boxes, em } = useLetterBoxes(root, [text, variant]);
  const values = useRef<number[]>([]);
  const axis = AXIS[variant];
  const low = from ?? axis.from;
  const high = to ?? axis.to;
  const words = splitWords(text);

  useFrame(
    (_, dt) => {
      const p = pointer.current;
      const reach = radius * em.current;
      boxes.current.forEach((box, i) => {
        let target = low;
        if (p.active) {
          const dist = Math.hypot(p.x - box.cx, p.y - box.cy);
          const t = Math.max(0, 1 - dist / reach);
          target = low + (high - low) * t * t * (3 - 2 * t);
        }
        const prev = values.current[i] ?? low;
        const next = damp(prev, target, 12, dt);
        if (Math.abs(next - prev) < 0.05 && Math.abs(next - target) < 0.05) return;
        values.current[i] = next;
        box.el.style.fontVariationSettings = `"${axis.tag}" ${next.toFixed(1)}`;
      });
    },
    { ref: root, enabled: !reduced },
  );

  const base: CSSProperties = { fontFamily: font, fontVariationSettings: `"${axis.tag}" ${low}`, ...style };
  if (reduced) {
    return (
      <Tag className={className} style={base}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag ref={root} className={className} style={{ position: "relative", display: "inline-block", ...base }}>
      <SrText>{text}</SrText>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <span key={w}>
            <span style={{ whiteSpace: "nowrap" }}>
              {word.chars.map((char, c) => (
                <span key={c} data-tl-char="" style={{ fontVariationSettings: `"${axis.tag}" ${low}` }}>
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

export default VariableProximity;
