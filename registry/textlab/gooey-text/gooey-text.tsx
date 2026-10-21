"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { srOnly } from "../lib/a11y";
import { resolveEase } from "../lib/motion-tokens";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";
import { useSvgId } from "../lib/use-svg-id";

export type GooeyTextVariant = "blob" | "drip";

export interface GooeyTextProps {
  /** Words to melt between. */
  words: string[];
  /** blob melts one word into the next in place; drip lets the old word drip away as the new one forms. */
  variant?: GooeyTextVariant;
  /** Seconds each word holds. */
  interval?: number;
  /** Seconds the melt takes. */
  duration?: number;
  /** How sticky the goo is, 4 to 20. Higher merges letters more. */
  goo?: number;
  label?: string;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

/**
 * Words melt into each other. Two words cross-blur inside an alpha-threshold filter, so their
 * shapes merge like liquid instead of simply fading.
 */
export function GooeyText({ words, variant = "blob", interval = 2.2, duration = 1.2, goo = 12, label, as: Tag = "span", reducedMotion = "user", className, style }: GooeyTextProps) {
  const id = useSvgId("tl-goo");
  const reduced = useReduced(reducedMotion);
  const [{ index, prev }, setStep] = useState<{ index: number; prev: number | null }>({ index: 0, prev: null });
  const incoming = useRef<HTMLSpanElement>(null);
  const outgoing = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (reduced || words.length < 2) return;
    const timer = setInterval(() => setStep(({ index: i }) => ({ index: (i + 1) % words.length, prev: i })), (interval + duration) * 1000);
    return () => clearInterval(timer);
  }, [reduced, words.length, interval, duration]);

  // The melt runs per frame: blur grows as 1/progress, so a word stays crisp until late and then
  // dissolves fast, while the alpha threshold turns the blur into liquid edges that join and split.
  // A layout effect paints the first frame before the browser does, so the new word never flashes in.
  useLayoutEffect(() => {
    if (prev === null) return;
    const inEl = incoming.current;
    const outEl = outgoing.current;
    if (!inEl || !outEl) return;
    const curve = resolveEase("standard");
    let raf = 0;
    const start = performance.now();
    const paint = (el: HTMLSpanElement, f: number, leaving: boolean) => {
      const blur = f <= 0.001 ? 100 : Math.min(8 / f - 8, 100);
      el.style.filter = `blur(${blur.toFixed(2)}px)`;
      el.style.opacity = `${(Math.pow(f, 0.4) * 100).toFixed(1)}%`;
      const drip = variant === "drip" ? 1 - f : 0;
      el.style.transform = leaving ? `translateY(${(drip * 0.45).toFixed(3)}em) scaleY(${(1 + drip * 0.35).toFixed(3)})` : `translateY(${(-drip * 0.2).toFixed(3)}em)`;
    };
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const f = cubicBezier(curve, t);
      paint(inEl, f, false);
      paint(outEl, 1 - f, true);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    tick(start);
    return () => cancelAnimationFrame(raf);
  }, [index, prev, duration, variant]);

  const spoken = label ?? words.join(", ");
  if (reduced) {
    return (
      <Tag className={className} style={style}>
        <span style={srOnly}>{spoken}</span>
        <span aria-hidden="true">{words[0]}</span>
      </Tag>
    );
  }

  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
  const layer: CSSProperties = { gridArea: "1 / 1", textAlign: "center", transformOrigin: "50% 0%", willChange: "filter, opacity" };

  return (
    <Tag className={className} style={{ position: "relative", display: "inline-block", ...style }}>
      <svg aria-hidden="true" width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          {/* A roomy filter region, or the blurred letters would be cut off square at the edges. */}
          <filter id={id} x="-25%" y="-60%" width="150%" height="220%">
            <feColorMatrix in="SourceGraphic" type="matrix" values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${goo * 2} -${(goo * 2 * 0.45).toFixed(2)}`} />
          </filter>
        </defs>
      </svg>
      <span style={srOnly}>{spoken}</span>
      <span aria-hidden="true" style={{ position: "relative", display: "inline-grid", filter: `url(#${id})` }}>
        <span style={{ gridArea: "1 / 1", visibility: "hidden" }}>{longest}</span>
        <span ref={outgoing} style={{ ...layer, opacity: 0 }}>
          {prev === null ? "" : words[prev]}
        </span>
        <span ref={incoming} style={layer}>
          {words[index]}
        </span>
      </span>
    </Tag>
  );
}

/** Progress along a CSS cubic-bezier at time t, solved by bisection; plenty for one value per frame. */
function cubicBezier([x1, y1, x2, y2]: [number, number, number, number], t: number) {
  const at = (a: number, b: number, s: number) => 3 * a * s * (1 - s) ** 2 + 3 * b * s * s * (1 - s) + s ** 3;
  let lo = 0;
  let hi = 1;
  let s = t;
  for (let i = 0; i < 20; i++) {
    s = (lo + hi) / 2;
    if (at(x1, x2, s) < t) lo = s;
    else hi = s;
  }
  return at(y1, y2, s);
}

export default GooeyText;
