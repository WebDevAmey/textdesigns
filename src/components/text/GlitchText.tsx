"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface GlitchTextProps {
  text: string;
  /** Glitch interval in ms (default: 1200ms) */
  interval?: number;
}

export default function GlitchText({ text, interval = 1200 }: GlitchTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars;

    const glitch = () => {
      // Glitch burst: 0.08s (duration-micro)
      gsap.to(chars, {
        x: () => gsap.utils.random(-4, 4),    /* ±1 × unit */
        y: () => gsap.utils.random(-3, 3),    /* ±0.75 × unit */
        skewX: () => gsap.utils.random(-15, 15), /* ±15° */
        opacity: () => gsap.utils.random(0.5, 1),
        duration: 0.08,  /* duration-micro */
        stagger: 0.01,   /* stagger-micro */
        ease: "none",
        onComplete: () => {
          // Recovery: 0.08s (duration-micro)
          gsap.to(chars, {
            x: 0,
            y: 0,
            skewX: 0,
            opacity: 1,
            duration: 0.08,  /* duration-micro */
            stagger: 0.01,   /* stagger-micro */
          });
        },
      });
    };

    // Interval: 1200ms (duration-dramatic × 1.6)
    const timer = setInterval(glitch, interval);

    return () => {
      clearInterval(timer);
      split.revert();
    };
  });

  return (
    <h1
      ref={textRef}
      className="inline-block"
    >
      {text}
    </h1>
  );
}