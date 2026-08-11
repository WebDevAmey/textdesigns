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

    // Collapse
    timeline.to(chars, {
      x: () => gsap.utils.random(-140, 140),
      y: () => gsap.utils.random(-100, 100),
      rotation: () => gsap.utils.random(-120, 120),
      scale: () => gsap.utils.random(0.25, 0.6),
      duration: 0.8,
      stagger: {
        each: 0.025,
        from: "center",
      },
      ease: "power4.in",
    });

    // Singularity
    timeline.to(chars, {
      x: 0,
      y: 0,
      rotation: () => gsap.utils.random(-30, 30),
      scale: 0.05,
      duration: 0.35,
      stagger: {
        each: 0.015,
        from: "random",
      },
      ease: "expo.in",
    });

    // Explode back
    timeline.to(chars, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1.1,
      stagger: {
        each: 0.035,
        from: "center",
      },
      ease: "elastic.out(1, 0.5)",
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