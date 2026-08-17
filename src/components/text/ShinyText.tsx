"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface ShinyTextProps {
  text: string;
  /** Chrome base colors of the gradient, in order. */
  colors?: string[];
  /** Color of the traveling specular highlight. */
  highlightColor?: string;
  /** Angle of the gradient, in degrees. */
  angle?: number;
  /** Seconds for one highlight sweep. */
  duration?: number;
}

const DEFAULT_COLORS = ["#6b6b70", "#f4f4f6", "#8f8f95", "#e9e9ec", "#6b6b70"];

export default function ShinyText({
  text,
  colors = DEFAULT_COLORS,
  highlightColor = "#ffffff",
  angle = 100,
  duration = 2.5,
}: ShinyTextProps) {
  const sheenRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = sheenRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { backgroundPosition: "100% 0" },
      {
        backgroundPosition: "-100% 0",
        duration,
        ease: "none",
        repeat: -1,
      }
    );
  }, [duration]);

  return (
    <span className="relative inline-block select-none">
      {/* Chrome base */}
      <span
        className="inline-block bg-clip-text font-bold text-transparent"
        style={{
          backgroundImage: `linear-gradient(${angle}deg, ${colors.join(", ")})`,
        }}
      >
        {text}
      </span>

      {/* Sweeping specular band, masked to the glyphs */}
      <span
        ref={sheenRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none bg-clip-text font-bold text-transparent bg-[length:200%_100%]"
        style={{
          backgroundImage: `linear-gradient(${angle}deg, transparent 42%, ${highlightColor} 50%, transparent 58%)`,
        }}
      >
        {text}
      </span>
    </span>
  );
}