"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { useReducedMotion } from "framer-motion";

gsap.registerPlugin(useGSAP);

interface CascadeTextProps {
  text: string;
  /** Drop distance in em (default: 0.9em) */
  fall?: number;
  /** Stagger interval in seconds (default: 0.055s ≈ stagger-normal × 1.375) */
  stagger?: number;
}

export default function CascadeText({
  text,
  fall = 0.9,
  stagger = 0.055,
}: CascadeTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);
  const reduceMotion = useReducedMotion();

  useGSAP(() => {
    if (!textRef.current || reduceMotion) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars ?? [];

    gsap.set(chars, { transformOrigin: "50% 0%" });

    // Each character drops from above and lands with a springy bounce,
    // one after another like a waterfall of dominoes.
    gsap.fromTo(
      chars,
      {
        y: `-${fall}em`,
        rotation: () => gsap.utils.random(-14, 14), /* ±14° */
        opacity: 0,
      },
      {
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.9,    /* duration-slow */
        ease: "elastic.out(1, 0.45)", /* elastic bounce */
        stagger: stagger,
      }
    );

    return () => {
      split.revert();
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