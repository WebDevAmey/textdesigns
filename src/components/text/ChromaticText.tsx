"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(useGSAP);

interface ChromaticTextProps {
  text: string;
  /** Red channel ghost color. */
  red?: string;
  /** Cyan channel ghost color. */
  cyan?: string;
  /** Seconds between each character starting to focus. */
  stagger?: number;
}

export default function ChromaticText({
  text,
  red = "#ff2d55",
  cyan = "#00e5ff",
  stagger = 0.045,
}: ChromaticTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(() => {
    if (!textRef.current || reduceMotion) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    // Each character arrives blurred and offset, its color channels
    // split apart; once it snaps sharp, the red/cyan ghosts converge.
    const timeline = gsap.timeline();

    chars.forEach((char, i) => {
      const start = i * stagger;

      gsap.set(char, {
        opacity: 0,
        filter: "blur(10px)",
        y: 12,
        textShadow: `0.11em 0 ${red}, -0.11em 0 ${cyan}`,
      });

      timeline
        .to(
          char,
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          start
        )
        .to(
          char,
          {
            textShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
            duration: 0.3,
            ease: "power2.out",
          },
          start + 0.3
        );
    });

    return () => {
      split.revert();
      timeline.kill();
    };
  });

  if (reduceMotion) {
    return (
      <h2 ref={textRef} className="inline-block whitespace-nowrap">
        {text}
      </h2>
    );
  }

  return (
    <h2 ref={textRef} className="inline-block whitespace-nowrap">
      {text}
    </h2>
  );
}