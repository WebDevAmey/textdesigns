"use client";

import { useEffect, useRef, type CSSProperties, type ElementType } from "react";
import { SrText } from "../lib/a11y";
import { Letters } from "../lib/letters";
import { hashString, seeded } from "../lib/math";
import { graphemes } from "../lib/split";
import { useFrame } from "../lib/use-frame";
import { useHydrated } from "../lib/use-hydrated";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useTrigger, type Trigger } from "../lib/use-trigger";

export type LetterDropVariant = "drop" | "pile" | "toss";

export interface LetterDropProps {
  text: string;
  /** drop falls straight and bounces, pile tumbles and lands askew, toss also flings letters up on click or tap. */
  variant?: LetterDropVariant;
  /** Fall height in em. */
  height?: number;
  /** Bounciness, 0 to 0.9. */
  restitution?: number;
  as?: ElementType;
  trigger?: Exclude<Trigger, "always" | "hover">;
  active?: boolean;
  once?: boolean;
  /** Seconds between letters starting to fall. */
  stagger?: number;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

type Body = { y: number; v: number; r: number; vr: number; start: number; restR: number; settled: boolean };

/**
 * Letters fall, bounce and settle on the baseline under real gravity. Each letter is its own body
 * with a bounce that loses energy, and pile mode lets them tumble and land a little crooked.
 */
export function LetterDrop({ text, variant = "drop", height = 2.2, restitution = 0.45, as: Tag = "span", trigger = "inView", active, once = true, stagger = 0.06, reducedMotion = "user", className, style }: LetterDropProps) {
  const { ref, on, bind } = useTrigger<HTMLElement>({ trigger, active, once });
  const hydrated = useHydrated();
  const reduced = useReduced(reducedMotion);
  const count = graphemes(text.replace(/\s+/g, "")).length;
  const bodies = useRef<Body[]>([]);
  const els = useRef<HTMLElement[]>([]);
  const clock = useRef(0);
  const running = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    els.current = Array.from(node.querySelectorAll<HTMLElement>("[data-tl-char]"));
  }, [ref, text]);

  useEffect(() => {
    if (reduced) return;
    const rand = seeded(hashString(text));
    bodies.current = Array.from({ length: count }, (_, i) => ({
      y: -height,
      v: 0,
      r: variant === "pile" ? (rand() - 0.5) * 120 : 0,
      vr: 0,
      start: i * stagger + rand() * stagger,
      restR: variant === "pile" ? (rand() - 0.5) * 16 : 0,
      settled: false,
    }));
    clock.current = 0;
    running.current = on;
  }, [on, reduced, text, count, height, stagger, variant]);

  const toss = () => {
    if (variant !== "toss" || reduced) return;
    const rand = seeded(Date.now() >>> 0);
    bodies.current.forEach((b) => {
      b.v = -(6 + rand() * 5);
      b.vr = (rand() - 0.5) * 900;
      b.settled = false;
      b.start = 0;
    });
    clock.current = 0;
    running.current = true;
  };

  useFrame(
    (_, dt) => {
      if (!running.current) return;
      clock.current += dt;
      const gravity = 38;
      let moving = false;
      bodies.current.forEach((b, i) => {
        const el = els.current[i];
        if (!el) return;
        if (clock.current < b.start || b.settled) {
          if (!b.settled) moving = true;
          el.style.transform = `translateY(${b.y}em) rotate(${b.r}deg)`;
          el.style.opacity = clock.current < b.start && b.y <= -height ? "0" : "1";
          return;
        }
        moving = true;
        b.v += gravity * dt;
        b.y += b.v * dt;
        b.r += b.vr * dt;
        if (b.y >= 0) {
          b.y = 0;
          b.v = -b.v * restitution;
          b.vr = (b.restR - b.r) * 4 + b.vr * -0.3;
          if (Math.abs(b.v) < 0.8) {
            b.v = 0;
            b.settled = true;
            b.r = b.restR;
          }
        }
        el.style.opacity = "1";
        el.style.transform = `translateY(${b.y.toFixed(3)}em) rotate(${b.r.toFixed(1)}deg)`;
      });
      if (!moving) running.current = false;
    },
    { ref, enabled: !reduced },
  );

  if (reduced) {
    return (
      <Tag ref={ref} className={className} style={style} {...bind}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ display: "inline-block", cursor: variant === "toss" ? "pointer" : undefined, ...style }}
      onPointerDown={toss}
      data-tl-motion={reducedMotion === "user" ? "user" : undefined}
      data-tl-pending={hydrated ? undefined : ""}
      {...bind}
    >
      <SrText>{text}</SrText>
      <span aria-hidden="true">
        <Letters text={text} part charStyle={{ opacity: 0, transform: `translateY(${-height}em)`, transformOrigin: "50% 100%" }} />
      </span>
    </Tag>
  );
}

export default LetterDrop;
