"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface BounceTextProps {
  text: string;
  /** Base bounce height in px (default: 40px = 10 × unit) */
  height?: number;
  /** Seconds for one full bounce (default: 0.9s = duration-slow) */
  duration?: number;
}

/**
 * Height multipliers per character for uneven bouncing.
 * Creates visual rhythm across the text line.
 */
const HEIGHT_FACTORS = [1, 0.55, 0.8, 1.15, 0.7, 0.95, 0.6];

export default function BounceText({
  text,
  height = 40,
  duration = 0.9,
}: BounceTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    gsap.set(chars, {
      transformOrigin: "50% 100%",
    });

    chars.forEach((char, index) => {
      const peak = height * HEIGHT_FACTORS[index % HEIGHT_FACTORS.length];

      gsap
        .timeline({
          repeat: -1,
          repeatDelay: 0.2,   /* 0.2s = duration-fast */
          delay: index * 0.09, /* stagger-slow */
        })
        // Up phase
        .to(
          char,
          {
            y: -peak,
            scaleX: 0.9,    /* compression: 1 - 0.1 */
            scaleY: 1.12,   /* stretch: 1 + 0.12 */
            duration: duration * 0.45,
            ease: "power2.out",
          },
          0
        )
        // Down phase
        .to(
          char,
          {
            y: 0,
            scaleX: 1.16,   /* squash: 1 + 0.16 */
            scaleY: 0.78,   /* compression: 1 - 0.22 */
            duration: duration * 0.4,
            ease: "power2.in",
          },
          duration * 0.45
        )
        // Settle phase
        .to(
          char,
          {
            scaleX: 1,
            scaleY: 1,
            duration: 0.2,  /* duration-fast */
            ease: "elastic.out(1, 0.35)",
          },
          duration * 0.85
        );
    });

    return () => {
      split.revert();
    };
  });

  return (
    <h2 ref={textRef} className="inline-block whitespace-nowrap">
      {text}
    </h2>
  );
}