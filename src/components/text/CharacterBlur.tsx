"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(useGSAP);

interface CharacterBlurProps {
  text: string;
  /** Peak blur (px) each character starts at. */
  blur?: number;
  /** Seconds between each character starting to focus. */
  stagger?: number;
}

export default function CharacterBlur({
  text,
  blur = 16,
  stagger = 0.04,
}: CharacterBlurProps) {
  const textRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(() => {
    if (!textRef.current || reduceMotion) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    gsap.set(chars, { transformOrigin: "50% 50%" });

    // Two-stage per character: a fast coarse blur-out, then a crisp
    // snap into focus — like each glyph clicking into place.
    const timeline = gsap.timeline();

    chars.forEach((char, i) => {
      const start = i * stagger;

      gsap.set(char, {
        opacity: 0,
        filter: `blur(${blur}px)`,
        scale: 1.04,
      });

      timeline
        .to(
          char,
          {
            opacity: 1,
            filter: `blur(${Math.max(blur * 0.1, 1)}px)`,
            scale: 0.995,
            duration: 0.55,
            ease: "power2.in",
          },
          start
        )
        .to(
          char,
          {
            filter: "blur(0px)",
            scale: 1,
            duration: 0.18,
            ease: "power2.out",
          },
          start + 0.55
        );
    });

    return () => {
      split.revert();
      timeline.kill();
    };
  });

  if (reduceMotion) {
    return (
      <h1 ref={textRef} className="inline-block">
        {text}
      </h1>
    );
  }

  return (
    <h1 ref={textRef} className="inline-block whitespace-nowrap">
      {text}
    </h1>
  );
}