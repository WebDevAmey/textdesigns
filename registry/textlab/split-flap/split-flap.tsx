"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType } from "react";
import { SrText } from "../lib/a11y";
import { graphemes } from "../lib/split";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type SplitFlapVariant = "dark" | "light" | "mini";

export interface SplitFlapProps {
  text: string;
  /** dark is the classic black board, light is cream tiles, mini is compact and borderless. */
  variant?: SplitFlapVariant;
  /** Pad or trim to this many tiles. Defaults to the text length. */
  length?: number;
  /** Characters every tile cycles through, in order. Unknown characters jump straight in. */
  charset?: string;
  /** Milliseconds per flip. */
  speed?: number;
  /** Milliseconds between neighbouring tiles starting. */
  stagger?: number;
  /** Announce changes to screen readers. */
  live?: boolean;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_CHARSET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-/";

const CSS = `
@keyframes tl-flap-top { from { transform: rotateX(0deg); } to { transform: rotateX(-90deg); } }
@keyframes tl-flap-bottom { from { transform: rotateX(90deg); } to { transform: rotateX(0deg); } }
.tl-flap { position: relative; display: inline-block; width: 0.8em; height: 1.18em; margin: 0 0.035em; perspective: 4em; border-radius: 0.12em; font-variant-numeric: tabular-nums; text-align: center; line-height: 1.18em; background: var(--tl-flap-bg); box-shadow: var(--tl-flap-shadow); }
.tl-flap-half { position: absolute; left: 0; right: 0; height: 50%; overflow: hidden; background: var(--tl-flap-bg); color: var(--tl-flap-fg); backface-visibility: hidden; }
.tl-flap-half > span { position: absolute; left: 0; right: 0; height: 1.18em; }
.tl-flap-top { top: 0; border-radius: 0.12em 0.12em 0 0; transform-origin: 50% 100%; }
.tl-flap-bottom { bottom: 0; border-radius: 0 0 0.12em 0.12em; transform-origin: 50% 0%; }
.tl-flap-bottom > span { bottom: 0; }
.tl-flap-top::after { content: ""; position: absolute; inset: auto 0 0 0; height: 1px; background: var(--tl-flap-seam); }
.tl-flap-leaf-top { z-index: 2; animation: tl-flap-top var(--tl-flap-ms) cubic-bezier(0.4, 0, 1, 1) forwards; }
.tl-flap-leaf-bottom { z-index: 2; transform: rotateX(90deg); animation: tl-flap-bottom var(--tl-flap-ms) cubic-bezier(0, 0, 0.2, 1) var(--tl-flap-ms) forwards; }
`;

const THEMES: Record<SplitFlapVariant, CSSProperties> = {
  dark: { "--tl-flap-bg": "oklch(0.24 0.006 260)", "--tl-flap-fg": "oklch(0.97 0.01 90)", "--tl-flap-seam": "oklch(0 0 0 / 0.7)", "--tl-flap-shadow": "inset 0 0 0 1px oklch(1 0 0 / 0.07), 0 2px 6px oklch(0 0 0 / 0.35)" } as CSSProperties,
  light: { "--tl-flap-bg": "oklch(0.96 0.018 90)", "--tl-flap-fg": "oklch(0.22 0.01 260)", "--tl-flap-seam": "oklch(0 0 0 / 0.16)", "--tl-flap-shadow": "inset 0 0 0 1px oklch(0 0 0 / 0.08), 0 1px 3px oklch(0 0 0 / 0.12)" } as CSSProperties,
  mini: { "--tl-flap-bg": "color-mix(in oklab, currentColor 10%, var(--tl-background, Canvas))", "--tl-flap-fg": "currentColor", "--tl-flap-seam": "color-mix(in oklab, currentColor 18%, transparent)", "--tl-flap-shadow": "none" } as CSSProperties,
};

function Tile({ target, charset, speed, delay, reduced }: { target: string; charset: string; speed: number; delay: number; reduced: boolean }) {
  const [current, setCurrent] = useState(target);
  const [next, setNext] = useState(target);
  const [step, setStep] = useState(0);
  const delayedFor = useRef(target);

  useEffect(() => {
    if (reduced) return;
    // Wait for the running flip to land before starting the next one.
    if (current === target || next !== current) return;
    const from = charset.indexOf(current);
    const to = charset.indexOf(target);
    const following = from === -1 || to === -1 ? target : charset[(from + 1) % charset.length];
    // Neighbours start a beat apart, but only at the start of each new word.
    const wait = delayedFor.current === target ? 0 : delay;
    delayedFor.current = target;
    const id = setTimeout(() => {
      setNext(following);
      setStep((s) => s + 1);
    }, wait);
    return () => clearTimeout(id);
  }, [current, next, target, charset, delay, reduced]);

  useEffect(() => {
    if (next === current) return;
    // The top leaf falls, then the bottom leaf lands; after both, the new char is current.
    const id = setTimeout(() => setCurrent(next), speed * 2);
    return () => clearTimeout(id);
  }, [next, current, speed]);

  if (reduced) {
    return (
      <span className="tl-flap">
        <span className="tl-flap-half tl-flap-top"><span>{target}</span></span>
        <span className="tl-flap-half tl-flap-bottom"><span>{target}</span></span>
      </span>
    );
  }

  const flipping = next !== current;
  return (
    <span className="tl-flap">
      <span className="tl-flap-half tl-flap-top"><span>{next}</span></span>
      <span className="tl-flap-half tl-flap-bottom"><span>{current}</span></span>
      {flipping && (
        <>
          <span key={`t${step}`} className="tl-flap-half tl-flap-top tl-flap-leaf-top"><span>{current}</span></span>
          <span key={`b${step}`} className="tl-flap-half tl-flap-bottom tl-flap-leaf-bottom"><span>{next}</span></span>
        </>
      )}
    </span>
  );
}

/**
 * An airport departures board. Each tile flips through the alphabet until it reaches its letter,
 * neighbours starting a beat apart, with a top leaf that falls and a bottom leaf that lands.
 */
export function SplitFlap({
  text,
  variant = "dark",
  length,
  charset = DEFAULT_CHARSET,
  speed = 50,
  stagger = 35,
  live = false,
  as: Tag = "span",
  reducedMotion = "user",
  className,
  style,
}: SplitFlapProps) {
  const reduced = useReduced(reducedMotion);
  const upper = charset === DEFAULT_CHARSET ? text.toUpperCase() : text;
  const chars = graphemes(upper);
  const size = length ?? chars.length;
  const tiles = Array.from({ length: size }, (_, i) => chars[i] ?? " ");

  return (
    <Tag className={className} style={{ display: "inline-block", whiteSpace: "nowrap", ...THEMES[variant], "--tl-flap-ms": `${speed}ms`, ...style } as CSSProperties}>
      <style href="tl-split-flap" precedence="default">{CSS}</style>
      <SrText>
        <span aria-live={live ? "polite" : undefined}>{text}</span>
      </SrText>
      <span aria-hidden="true" style={variant === "mini" ? { fontSize: "0.8em" } : undefined}>
        {tiles.map((char, i) => (
          <Tile key={i} target={char} charset={charset} speed={speed} delay={i * stagger} reduced={reduced} />
        ))}
      </span>
    </Tag>
  );
}

export default SplitFlap;
