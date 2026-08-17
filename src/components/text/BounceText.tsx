"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface BounceTextProps {
  text: string;
  /** Base bounce height in px. */
  height?: number;
  /** Seconds for one full bounce. */
  duration?: number;
}

/** Height multipliers per character so the line bounces unevenly. */
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
          repeatDelay: 0.2,
          delay: index * 0.09,
        })
        .to(
          char,
          {
            y: -peak,
            scaleX: 0.9,
            scaleY: 1.12,
            duration: duration * 0.45,
            ease: "power2.out",
          },
          0
        )
        .to(
          char,
          {
            y: 0,
            scaleX: 1.16,
            scaleY: 0.78,
            duration: duration * 0.4,
            ease: "power2.in",
          },
          duration * 0.45
        )
        .to(
          char,
          {
            scaleX: 1,
            scaleY: 1,
            duration: 0.2,
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