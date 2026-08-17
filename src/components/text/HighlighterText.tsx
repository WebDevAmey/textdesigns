"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface HighlighterTextProps {
  text: string;
  /** Color of the marker highlight. */
  highlightColor?: string;
  /** Color of the text. */
  textColor?: string;
  /** Seconds for the highlight to draw across the text. */
  duration?: number;
  /** Slight tilt of the highlight, in degrees, for a hand-drawn marker feel. */
  tilt?: number;
}

export default function HighlighterText({
  text,
  highlightColor = "rgba(250, 204, 21, 0.55)",
  textColor = "currentColor",
  duration = 0.45,
  tilt = -1.5,
}: HighlighterTextProps) {
  const highlightRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const highlight = highlightRef.current;
    if (!highlight) return;

    gsap.set(highlight, { scaleX: 0, opacity: 0 });

    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1.4 });

    timeline
      .to(highlight, {
        opacity: 1,
        scaleX: 1.05,
        duration,
        ease: "power2.out",
      })
      .to(highlight, { scaleX: 1, duration: 0.12, ease: "power1.out" })
      .to(highlight, { opacity: 0, duration: 0.5, ease: "power1.inOut" }, "+=1.6")
      .to(highlight, { scaleX: 0, duration: 0, ease: "none" });
  }, [duration]);

  return (
    <span className="relative inline-block select-none whitespace-nowrap">
      <span
        ref={highlightRef}
        aria-hidden
        className="pointer-events-none absolute -inset-x-1 inset-y-0 rounded-lg"
        style={{
          backgroundColor: highlightColor,
          transform: `skewX(${tilt}deg)`,
          transformOrigin: "left center",
        }}
      />
      <span className="relative font-bold" style={{ color: textColor }}>
        {text}
      </span>
    </span>
  );
}