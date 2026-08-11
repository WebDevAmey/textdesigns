"use client";

import { useEffect, useId, useRef, useState } from "react";

interface LiquidTextProps {
  text?: string;
  /** Peak displacement scale while molten. */
  intensity?: number;
  className?: string;
  innerClassName?: string;
}

export default function LiquidText({
  text = "LIQUID",
  intensity = 26,
  className = "",
  innerClassName = "inline-block py-4 text-4xl font-medium leading-none tracking-tight text-current",
}: LiquidTextProps) {
  const rawId = useId();
  const filterId = "hovera-liquid" + rawId.replace(/[^a-zA-Z0-9]/g, "");
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const [hot, setHot] = useState(false);

  // The distortion melts in and out on hover via a rAF loop driving the SVG
  // turbulence phase and displacement scale directly — no React re-renders
  // per frame. Reduced motion never starts the loop, so the text stays solid.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let level = 0;
    let phase = 0;
    let last = performance.now();

    function tick(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      const target = hot ? 1 : 0;
      level += (target - level) * Math.min(1, dt * 5);
      phase += dt * (0.35 + level * 0.5);

      const turbulence = turbulenceRef.current;
      const displacement = displacementRef.current;
      if (turbulence && displacement) {
        turbulence.setAttribute(
          "baseFrequency",
          (0.012 + 0.004 * Math.sin(phase * 2.1)).toFixed(4) +
            " " +
            (0.05 + 0.02 * Math.cos(phase * 1.7)).toFixed(4)
        );
        displacement.setAttribute(
          "scale",
          (level * intensity).toFixed(2)
        );
      }
      if (level > 0.001 || hot) raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hot, intensity]);

  return (
    <span
      className={
        "relative inline-block cursor-default select-none " + className
      }
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
    >
      <svg aria-hidden className="pointer-events-none absolute h-0 w-0">
        <defs>
          <filter
            id={filterId}
            x="-20%"
            y="-40%"
            width="140%"
            height="180%"
          >
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0.012 0.05"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              ref={displacementRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      <span
        className={innerClassName}
        style={{ filter: "url(#" + filterId + ")" }}
      >
        {text}
      </span>
    </span>
  );
}