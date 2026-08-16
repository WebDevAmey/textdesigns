"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface TuningForkTextProps {
  text: string;
  /** Seconds between each "pluck" ring. */
  ringInterval?: number;
  /** Number of standing-wave cycles across the text. */
  frequency?: number;
  /** Peak vertical displacement, in px. */
  amplitude?: number;
}

const TRACE_POINTS = 40;
const TRACE_HEIGHT = 20;

/**
 * Characters ride a continuous analytic standing wave rather than a
 * spring simulation: most of the time it's a barely-visible idle hum,
 * but every few seconds a sharp "pluck" sends a fast-attack,
 * slow-decay ring rippling through the letters — like a struck tuning
 * fork. Local wave energy also drives each character's variable font
 * weight and color, and a thin oscilloscope-style trace beneath the
 * baseline redraws every frame from the same wave function.
 */
export default function TuningForkText({
  text,
  ringInterval = 4,
  frequency = 1,
  amplitude = 6,
}: TuningForkTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const svgPathRef = useRef<SVGPathElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    const textEl = textRef.current;
    if (!container || !textEl) return;

    const split = new SplitType(textEl, { types: "chars" });
    const chars = split.chars ?? [];
    const count = Math.max(chars.length, 1);
    const k = Math.PI * 2 * frequency;
    const hum = 0.12;

    const tick = () => {
      const now = performance.now() / 1000;
      const phase = now % ringInterval;
      const ring = Math.exp(-phase * 1.8) + hum;

      chars.forEach((char, i) => {
        const x = i / count;
        const wave = Math.sin(k * x - now * 3.4);
        const amp = wave * amplitude * ring;
        const energy = Math.min(Math.abs(amp) / amplitude, 1);

        gsap.set(char, {
          y: amp,
          fontVariationSettings: `"wght" ${400 + energy * 500}`,
          color:
            energy > 0.08
              ? `hsl(${232 - energy * 30}, ${35 + energy * 45}%, ${20 + energy * 30}%)`
              : "currentColor",
        });
      });

      const svgPath = svgPathRef.current;
      if (svgPath) {
        const containerWidth = container.clientWidth;
        let d = "";
        for (let p = 0; p <= TRACE_POINTS; p++) {
          const x = p / TRACE_POINTS;
          const wave = Math.sin(k * x - now * 3.4);
          const amp = wave * (amplitude * 1.4) * ring;
          const px = x * containerWidth;
          const py = TRACE_HEIGHT / 2 + amp;
          d += `${p === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)} `;
        }
        svgPath.setAttribute("d", d);
      }
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      split.revert();
    };
  }, [text, ringInterval, frequency, amplitude, reducedMotion]);

  if (reducedMotion) {
    return <span className="inline-block">{text}</span>;
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <h1 ref={textRef} className="inline-block">
        {text}
      </h1>
      <svg
        className="pointer-events-none absolute left-0 w-full overflow-visible"
        style={{ top: "100%", height: TRACE_HEIGHT }}
        aria-hidden="true"
      >
        <path
          ref={svgPathRef}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.25}
          strokeWidth={1}
        />
      </svg>
    </div>
  );
}
