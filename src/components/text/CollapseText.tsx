"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface CollapseTextProps {
  text: string;
}

export default function CollapseText({
  text,
}: CollapseTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars;

    const timeline = gsap.timeline();

    // Start slightly compressed
    timeline.set(chars, {
      transformOrigin: "center center",
    });

    // Phase 1: Collapse
    // Characters scatter inward toward center
    timeline.to(chars, {
      x: () => gsap.utils.random(-140, 140),  /* ±35 × unit */
      y: () => gsap.utils.random(-100, 100),  /* ±25 × unit */
      rotation: () => gsap.utils.random(-120, 120),
      scale: () => gsap.utils.random(0.25, 0.6),
      duration: 0.8,     /* duration-slow */
      stagger: {
        each: 0.025,     /* stagger-fast */
        from: "center",
      },
      ease: "power4.in", /* ease-in-out-quart (in phase) */
    });

    // Phase 2: Singularity
    // All characters compress to near-zero
    timeline.to(chars, {
      x: 0,
      y: 0,
      rotation: () => gsap.utils.random(-30, 30),
      scale: 0.05,       /* near zero */
      duration: 0.35,    /* ~duration-normal × 0.12 */
      stagger: {
        each: 0.015,     /* stagger-micro */
        from: "random",
      },
      ease: "expo.in",   /* exponential ease-in */
    });

    // Phase 3: Explode back
    // Characters return with elastic overshoot
    timeline.to(chars, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1.1,     /* duration-dramatic + 0.1s */
      stagger: {
        each: 0.035,     /* stagger-normal × 0.875 */
        from: "center",
      },
      ease: "elastic.out(1, 0.5)", /* elastic overshoot */
    });

    return () => {
      split.revert();
    };
  }, { scope: textRef });

  return (
    <h2
      ref={textRef}
      className="inline-block"
    >
      {text}
    </h2>
  );
}