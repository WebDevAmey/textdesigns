"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface GradientTextProps {
  text: string;
  /** Colors of the gradient, in order. The first is repeated at the end so the loop is seamless. */
  colors?: string[];
  /** Angle of the gradient, in degrees. */
  angle?: number;
  /** Seconds for one full gradient sweep. */
  duration?: number;
}

const DEFAULT_COLORS = ["#f59e0b", "#ef4444", "#a855f7", "#3b82f6", "#10b981", "#f59e0b"];

export default function GradientText({
  text,
  colors = DEFAULT_COLORS,
  angle = 90,
  duration = 6,
}: GradientTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = textRef.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { backgroundPosition: "0% 50%" },
      {
        backgroundPosition: "200% 50%",
        duration,
        ease: "none",
        repeat: -1,
      }
    );
  }, [duration]);

  return (
    <span
      ref={textRef}
      className="inline-block select-none bg-clip-text font-bold text-transparent"
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${colors.join(", ")})`,
        backgroundSize: "200% 100%",
      }}
    >
      {text}
    </span>
  );
}
