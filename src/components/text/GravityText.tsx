"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";

gsap.registerPlugin(useGSAP);

interface GravityTextProps {
  text: string;
}

export default function GravityText({ text }: GravityTextProps) {
  const textRef = useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, {
      types: "chars",
    });

    const chars = split.chars;

    const timeline = gsap.timeline();

    // 1. Tiny anticipation before the text falls
    timeline.to(chars, {
      y: -8,
      duration: 0.15,
      stagger: 0.02,
      ease: "power2.out",
    });

    // 2. Gravity: characters fall independently
    timeline.to(chars, {
      y: () => gsap.utils.random(180, 500),
      x: () => gsap.utils.random(-100, 100),
      rotation: () => gsap.utils.random(-120, 120),
      scale: () => gsap.utils.random(0.9, 1.05),
      duration: () => gsap.utils.random(0.8, 1.4),
      stagger: {
        each: 0.04,
        from: "random",
      },
      ease: "expo.in",
    });

    // 3. Characters return towards their original position
    timeline.to(chars, {
      y: 0,
      x: 0,
      rotation: 0,
      scale: 1,
      duration: 1.2,
      stagger: {
        each: 0.035,
        from: "random",
      },
      ease: "power3.out",
    });

    // 4. Small impact / squash
    timeline.to(chars, {
      scaleY: 0.85,
      scaleX: 1.08,
      duration: 0.1,
      stagger: 0.02,
      ease: "power2.out",
    });

    // 5. Bounce back and settle
    timeline.to(chars, {
      scaleY: 1,
      scaleX: 1,
      duration: 0.6,
      stagger: 0.02,
      ease: "elastic.out(1, 0.4)",
    });

    return () => {
      split.revert();
    };
  });

  return (
    <h1
      ref={textRef}
      className="text-6xl font-bold tracking-tight"
    >
      {text}
    </h1>
  );
}