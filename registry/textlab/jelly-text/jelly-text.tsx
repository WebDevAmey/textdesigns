"use client";

import { useRef, type CSSProperties, type ElementType } from "react";
import { SrText } from "../lib/a11y";
import { Letters } from "../lib/letters";
import { atRest, stepSpring, type Spring1D } from "../lib/physics";
import { useFrame } from "../lib/use-frame";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type JellyTextVariant = "wobble" | "squash";

export interface JellyTextProps {
  text: string;
  /** wobble rocks letters side to side, squash squishes them flat then springs them tall. */
  variant?: JellyTextVariant;
  /** How hard a touch kicks the letter. */
  strength?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * Letters wobble like jelly when touched. Every letter is an underdamped spring; brushing one
 * kicks it, and its neighbours feel a smaller kick.
 */
export function JellyText({ text, variant = "squash", strength = 1, as: Tag = "span", reducedMotion = "user", className, style }: JellyTextProps) {
  const root = useRef<HTMLElement | null>(null);
  const reduced = useReduced(reducedMotion);
  const springs = useRef<Spring1D[]>([]);
  const live = useRef(false);

  const kick = (index: number) => {
    if (reduced) return;
    const els = root.current?.querySelectorAll("[data-tl-char]").length ?? 0;
    for (let i = 0; i < els; i++) springs.current[i] ??= { x: 0, v: 0 };
    [-1, 0, 1].forEach((d) => {
      const s = springs.current[index + d];
      if (s) s.v += (d === 0 ? 9 : 4) * strength * (variant === "wobble" ? 1.4 : 1);
    });
    live.current = true;
  };

  useFrame(
    (_, dt) => {
      if (!live.current) return;
      const els = root.current?.querySelectorAll<HTMLElement>("[data-tl-char]");
      if (!els) return;
      let moving = false;
      springs.current.forEach((s, i) => {
        if (!s) return;
        stepSpring(s, 0, 260, 7, dt);
        if (!atRest(s, 0, 0.002)) moving = true;
        const el = els[i];
        if (!el) return;
        el.style.transform =
          variant === "wobble" ? `rotate(${(s.x * 18).toFixed(2)}deg)` : `scale(${(1 + s.x * 0.35).toFixed(3)}, ${(1 - s.x * 0.35).toFixed(3)})`;
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
    <Tag ref={root} className={className} style={{ display: "inline-block", ...style }}>
      <SrText>{text}</SrText>
      <span aria-hidden="true">
        <Letters
          text={text}
          charStyle={{ transformOrigin: variant === "wobble" ? "50% 100%" : "50% 100%", willChange: "transform" }}
          render={(char, i) => (
            <span style={{ display: "inline-block" }} onPointerEnter={() => kick(i)} onPointerDown={() => kick(i)}>
              {char}
            </span>
          )}
        />
      </span>
    </Tag>
  );
}

export default JellyText;
