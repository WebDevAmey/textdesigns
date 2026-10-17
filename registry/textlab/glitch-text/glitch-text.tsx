"use client";

import { useEffect, useState, type CSSProperties, type ElementType } from "react";
import { srOnly } from "../lib/a11y";
import { useReduced, type ReducedMotion } from "../lib/use-reduced";

export type GlitchTextVariant = "slice" | "shift" | "scan";

export interface GlitchTextProps {
  text: string;
  /** slice tears horizontal bands sideways, shift jolts the whole word with split channels, scan rolls a bright band through it. */
  variant?: GlitchTextVariant;
  /** When it glitches: on hover, on an interval, or once on mount. */
  trigger?: "hover" | "interval" | "mount";
  /** Seconds between bursts for trigger="interval". */
  every?: number;
  as?: ElementType;
  reducedMotion?: ReducedMotion;
  className?: string;
  style?: CSSProperties;
}

// Bursts last 450 ms with hard steps, then rest; never more than two bursts a second.
const CSS = `
@keyframes tl-glitch-a { 0% { clip-path: inset(12% 0 70% 0); transform: translate(-0.06em, 0); } 20% { clip-path: inset(58% 0 22% 0); transform: translate(0.08em, 0); } 40% { clip-path: inset(30% 0 52% 0); transform: translate(-0.04em, 0); } 60% { clip-path: inset(80% 0 6% 0); transform: translate(0.05em, 0); } 80% { clip-path: inset(4% 0 84% 0); transform: translate(-0.07em, 0); } 100% { clip-path: inset(50% 0 50% 0); transform: none; } }
@keyframes tl-glitch-b { 0% { clip-path: inset(66% 0 12% 0); transform: translate(0.07em, 0); } 25% { clip-path: inset(8% 0 76% 0); transform: translate(-0.05em, 0); } 50% { clip-path: inset(40% 0 38% 0); transform: translate(0.06em, 0); } 75% { clip-path: inset(20% 0 64% 0); transform: translate(-0.08em, 0); } 100% { clip-path: inset(50% 0 50% 0); transform: none; } }
@keyframes tl-glitch-shift { 0%, 100% { transform: none; } 15% { transform: translate(-0.05em, 0.02em) skewX(-6deg); } 30% { transform: translate(0.06em, -0.01em); } 45% { transform: translate(-0.02em, 0) skewX(4deg); } 60% { transform: translate(0.03em, 0.01em); } }
@keyframes tl-glitch-scan { from { background-position: 0 -120%; } to { background-position: 0 220%; } }
.tl-glitch-layer { position: absolute; inset: 0; pointer-events: none; clip-path: inset(50% 0 50% 0); }
[data-glitching] > .tl-glitch-a { animation: tl-glitch-a 0.45s steps(1) 1; color: var(--tl-glitch-1); }
[data-glitching] > .tl-glitch-b { animation: tl-glitch-b 0.45s steps(1) 1; color: var(--tl-glitch-2); }
[data-glitching][data-variant="shift"] > .tl-glitch-main { animation: tl-glitch-shift 0.45s steps(1) 1; }
[data-variant="scan"] > .tl-glitch-scan { clip-path: none; background: linear-gradient(transparent 0%, color-mix(in oklab, currentColor 0%, transparent) 40%, var(--tl-glitch-2) 50%, transparent 60%) no-repeat; background-size: 100% 40%; background-clip: text; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-position: 0 -120%; }
[data-glitching][data-variant="scan"] > .tl-glitch-scan { animation: tl-glitch-scan 0.6s linear 1; }
`;

/**
 * A controlled digital glitch on cue: short, hard-stepped bursts with long rests, so it reads as
 * intentional rather than broken.
 */
export function GlitchText({ text, variant = "slice", trigger = "interval", every = 3.5, as: Tag = "span", reducedMotion = "user", className, style }: GlitchTextProps) {
  const reduced = useReduced(reducedMotion);
  const [burst, setBurst] = useState(0);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    if (reduced) return;
    if (trigger === "mount") {
      const id = setTimeout(() => setBurst((b) => b + 1), 300);
      return () => clearTimeout(id);
    }
    if (trigger !== "interval") return;
    const id = setInterval(() => setBurst((b) => b + 1), every * 1000);
    return () => clearInterval(id);
  }, [reduced, trigger, every]);

  // Derive the burst window while rendering instead of syncing it in an effect.
  const [seen, setSeen] = useState(0);
  if (burst !== seen) {
    setSeen(burst);
    setGlitching(true);
  }
  useEffect(() => {
    if (!glitching) return;
    const id = setTimeout(() => setGlitching(false), 620);
    return () => clearTimeout(id);
  }, [glitching, burst]);

  if (reduced) {
    return (
      <Tag className={className} style={style}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag
      className={className}
      style={{ position: "relative", display: "inline-block", "--tl-glitch-1": "oklch(0.68 0.25 25)", "--tl-glitch-2": "oklch(0.78 0.15 200)", ...style } as CSSProperties}
      data-variant={variant}
      data-glitching={glitching ? "" : undefined}
      onPointerEnter={trigger === "hover" ? () => setBurst((b) => b + 1) : undefined}
    >
      <style href="tl-glitch-text" precedence="default">{CSS}</style>
      <span style={srOnly}>{text}</span>
      <span aria-hidden="true" className="tl-glitch-main" style={{ display: "inline-block" }}>
        {text}
      </span>
      {variant !== "scan" && (
        <>
          <span aria-hidden="true" className="tl-glitch-layer tl-glitch-a">
            {text}
          </span>
          <span aria-hidden="true" className="tl-glitch-layer tl-glitch-b">
            {text}
          </span>
        </>
      )}
      {variant === "scan" && (
        <span aria-hidden="true" className="tl-glitch-layer tl-glitch-scan">
          {text}
        </span>
      )}
    </Tag>
  );
}

export default GlitchText;
