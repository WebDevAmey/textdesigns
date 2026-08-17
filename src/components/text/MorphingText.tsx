"use client";

import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface MorphingTextProps {
  /** Single word fallback when `words` is not given. */
  text?: string;
  /** Words to morph between, one settled at a time. */
  words?: string[];
  /** Duration of one crossfade, in ms. */
  morphMs?: number;
  /** How long a settled word rests before the next morph, in ms. */
  holdMs?: number;
  /** Any CSS length for the display word; fluid clamps recommended. */
  fontSize?: string;
  /** Font stack for the display word. */
  fontFamily?: string;
  className?: string;
}

const DEFAULT_WORDS = ["WHY", "IS", "THIS", "SO", "SATISFYING"];

/** Peak blur (px) at the fully-dissolved end of a morph. */
const BLUR_MAX = 80;
/** Blur falloff exponent — higher = stays sharp longer, dissolves abruptly. */
const BLUR_EXP = 2.6;
/** Opacity curve exponent — higher = the outgoing word lingers longer. */
const OP_EXP = 0.45;

export default function MorphingText({
  text,
  words = text ? [text] : DEFAULT_WORDS,
  morphMs = 1000,
  holdMs = 700,
  fontSize = "clamp(2.5rem, 10vw, 6rem)",
  fontFamily,
  className,
}: MorphingTextProps) {
  const uid = useId().replace(/:/g, "");
  const filterId = `mkm-threshold-${uid}`;
  const reduceMotion = useReducedMotion();
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const elA = aRef.current;
    const elB = bRef.current;
    if (!elA || !elB) return;

    let index = 0;
    let cur = elA;
    let spare = elB;
    let phase: "hold" | "morph" = "hold";
    let phaseStart = performance.now();

    const apply = (f: number) => {
      const outgoing = 1 - f;
      cur.style.opacity = `${outgoing ** OP_EXP * 100}%`;
      cur.style.filter = `blur(${BLUR_MAX * f ** BLUR_EXP}px)`;
      spare.style.opacity = `${f ** OP_EXP * 100}%`;
      spare.style.filter = `blur(${BLUR_MAX * outgoing ** BLUR_EXP}px)`;
    };

    const settle = () => {
      const tmp = cur;
      cur = spare;
      spare = tmp;
      index = (index + 1) % words.length;
      spare.textContent = words[(index + 1) % words.length];
      apply(0);
    };

    cur.textContent = words[0];
    spare.textContent = words[1 % words.length];
    apply(0);

    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const elapsed = now - phaseStart;
      if (phase === "hold") {
        if (elapsed >= holdMs) {
          phase = "morph";
          phaseStart = now;
        }
      } else if (elapsed >= morphMs) {
        settle();
        phase = "hold";
        phaseStart = now;
      } else {
        apply(elapsed / morphMs);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [words, morphMs, holdMs, reduceMotion]);

  if (reduceMotion) {
    return (
      <span
        className={cn("inline-block select-none font-bold", className)}
        style={{ fontSize, fontFamily }}
      >
        {words[0]}
      </span>
    );
  }

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span
      className={cn("relative inline-block select-none font-bold", className)}
      style={{
        fontSize,
        fontFamily,
        lineHeight: 1.1,
        filter: `url(#${filterId})`,
      }}
    >
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden className="invisible whitespace-nowrap">
        {longest}
      </span>
      <span
        ref={aRef}
        aria-hidden
        className="absolute left-1/2 top-1/2 whitespace-nowrap will-change-[opacity,filter]"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <span
        ref={bRef}
        aria-hidden
        className="absolute left-1/2 top-1/2 whitespace-nowrap will-change-[opacity,filter]"
        style={{ transform: "translate(-50%, -50%)" }}
      />
      <svg aria-hidden className="absolute h-0 w-0">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="0.6" result="soft" />
            <feColorMatrix
              in="soft"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 255 -135"
            />
          </filter>
        </defs>
      </svg>
    </span>
  );
}